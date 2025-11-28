# Courtney Widget - Embeddable VAPI Chat Widget

This is an embeddable chat widget powered by VAPI AI that can be integrated into any website via a simple script tag.

## Project Structure

```
VAPI Embed/
├── widget/          # Frontend widget (React + Vite)
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── lib/            # VAPI clients
│   │   └── widget.tsx      # Widget entry point
│   └── dist/               # Built files (after npm run build)
│       ├── courtney-widget.js
│       └── courtney-widget.css
│
└── backend/         # Backend API proxy (Express)
    ├── server.js           # Express server
    └── .env                # Environment variables
```

## Setup Instructions

### 1. Backend Setup

```bash
cd backend
npm install
```

Configure `.env` file:
```env
VAPI_PRIVATE_KEY=your-vapi-private-key
VAPI_ASSISTANT_ID=your-vapi-assistant-id
PORT=3001
```

Start the backend:
```bash
npm start
```

Backend will run on `http://localhost:3001`

### 2. Widget Setup

```bash
cd widget
npm install
```

Build the widget:
```bash
npm run build
```

This creates:
- `dist/courtney-widget.umd.js`
- `dist/courtney-widget.css`

## Usage on Customer Website

Add these lines to any HTML page:

```html
<!-- Add the widget container -->
<div id="courtney-widget"></div>

<!-- Load the CSS -->
<link rel="stylesheet" href="https://your-cdn.com/courtney-widget.css">

<!-- Load the JavaScript -->
<script src="https://your-cdn.com/courtney-widget.umd.js"></script>

<!-- Initialize the widget -->
<script>
  CourtneyWidget.init({
    target: '#courtney-widget',
    apiEndpoint: 'https://your-backend.railway.app/api/chat',
    publicKey: 'your-vapi-public-key',
    assistantId: 'your-vapi-assistant-id'
  });
</script>
```

## Deployment to Railway

### Backend Deployment

1. Create new Railway project
2. Connect your GitHub repo or deploy from local
3. Set environment variables:
   - `VAPI_PRIVATE_KEY`
   - `VAPI_ASSISTANT_ID`
   - `PORT` (Railway will set this automatically)
4. Railway will auto-detect Node.js and run `npm start`

### Widget (CDN) Deployment

**Option 1: Deploy with Backend**
- Add the built widget files to a `public/` directory in the backend
- Serve static files from Express
- Access at `https://your-backend.railway.app/courtney-widget.umd.js`

**Option 2: Separate CDN**
- Upload `dist/` files to Railway static hosting
- Or use a CDN service like Cloudflare, AWS S3, etc.

## Development

### Widget Development
```bash
cd widget
npm run dev
```

### Backend Development
```bash
cd backend
npm run dev
```

## Features

- Text chat with VAPI AI assistant
- Voice call integration
- User feedback collection
- Custom CourtsApp branding
- Responsive design
- Easy integration with any website

## Security

- Private API keys are kept server-side only
- Backend proxy prevents key exposure
- CORS enabled for cross-origin requests
- Environment variables for sensitive data

## How AssistantID Works (Important!)

### The Split Personality Bug (Now Fixed)

The widget supports two communication modes: **Text Chat** (HTTP) and **Voice Calls** (WebRTC). Each mode handles the `assistantId` differently:

**Voice Calls (WebRTC):**
- Uses the `assistantId` passed to `CourtneyWidget.init()`
- Goes directly to VAPI platform via Web SDK
- Backend is NOT involved

**Text Chat (HTTP):**
- Frontend sends messages to backend `/api/chat`
- **Backend IGNORES any assistantId from the request**
- Always uses `process.env.VAPI_ASSISTANT_ID` from backend `.env`

### Why This Matters

If the frontend passes a different `assistantId` than what's in the backend's `.env`:

```
Voice Call: Uses assistantId from frontend → Assistant A
Text Chat:  Uses assistantId from backend  → Assistant B

Result: Split personality! Different assistants for different modes! ❌
```

### The Solution: Backend Configuration Endpoint

The backend provides a `/api/config` endpoint that returns the assistant configuration:

```javascript
GET /api/config
Response: {
  "publicKey": "99d4ee33-0c22-4f57-a457-2266fab4a844",
  "assistantId": "31409e97-631c-48e0-89f5-4b6ba0f1c1df"
}
```

**For proper integration:** Frontends should fetch config from this endpoint and use the backend's `assistantId` for initialization. This ensures:
- Voice calls use the same assistant as text chat ✅
- Backend is the single source of truth ✅
- No configuration duplication ✅

See the Courtsapp Landing Page project for an example of this pattern.

## Configuration Options

```typescript
CourtneyWidget.init({
  target: string | HTMLElement,     // Where to mount the widget
  apiEndpoint: string,                // Your backend API URL
  publicKey: string,                  // VAPI public key
  assistantId: string,                // VAPI assistant ID
})
```

## Cleanup

To remove the widget:
```javascript
CourtneyWidget.destroy();
```
