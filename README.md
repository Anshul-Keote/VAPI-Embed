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
