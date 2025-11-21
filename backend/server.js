const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'VAPI Proxy Server is running' });
});

// VAPI Chat Proxy Endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const privateKey = process.env.VAPI_PRIVATE_KEY;
    const assistantId = process.env.VAPI_ASSISTANT_ID;

    if (!privateKey) {
      console.error('[Chat API] Missing VAPI_PRIVATE_KEY');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const { input, previousChatId, assistantOverrides } = req.body;

    console.log('[Chat API] Proxying request to VAPI:', {
      input: input?.substring(0, 50),
      previousChatId,
      hasOverrides: !!assistantOverrides
    });

    // Build the request body for VAPI
    const vapiRequestBody = {
      assistantId,
      input,
    };

    // Include previous chat ID for conversation continuity
    if (previousChatId) {
      vapiRequestBody.previousChatId = previousChatId;
    }

    // Include assistant overrides (for user context on first message)
    if (assistantOverrides) {
      vapiRequestBody.assistantOverrides = assistantOverrides;
    }

    // Make the request to VAPI using the private key (server-side)
    const vapiResponse = await fetch('https://api.vapi.ai/chat', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${privateKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(vapiRequestBody),
    });

    // Check if the request was successful
    if (!vapiResponse.ok) {
      const errorText = await vapiResponse.text();
      console.error('[Chat API] VAPI error:', vapiResponse.status, errorText);
      return res.status(vapiResponse.status).json({
        error: `VAPI API error: ${vapiResponse.status}`
      });
    }

    // Parse and return the VAPI response
    const data = await vapiResponse.json();
    console.log('[Chat API] VAPI response received:', {
      id: data.id,
      outputCount: data.output?.length
    });

    res.json(data);
  } catch (error) {
    console.error('[Chat API] Request failed:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`[VAPI Proxy Server] Running on port ${PORT}`);
  console.log(`[VAPI Proxy Server] Health check: http://localhost:${PORT}/health`);
  console.log(`[VAPI Proxy Server] Chat endpoint: http://localhost:${PORT}/api/chat`);
});
