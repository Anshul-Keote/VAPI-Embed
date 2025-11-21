# Railway Deployment Guide

Follow these steps to deploy the VAPI Embed widget to Railway.

## Step 1: Deploy Backend to Railway

1. Go to [Railway.app](https://railway.app) and sign in
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select the `VAPI-Embed` repository
4. Railway will auto-detect the Node.js backend

### Configure Environment Variables

In Railway dashboard, add these environment variables:

```
VAPI_PRIVATE_KEY=your-vapi-private-key
VAPI_ASSISTANT_ID=your-vapi-assistant-id
PORT=3001
```

### Set Root Directory (Important!)

Since the backend code is in a subdirectory:

1. Go to **Settings** → **Build & Deploy**
2. Set **Root Directory** to: `backend`
3. Railway will now run `npm install` and `npm start` from the backend folder

### Get Your Railway URL

After deployment, Railway will give you a URL like:
```
https://your-app-name.up.railway.app
```

Your backend API will be at:
```
https://your-app-name.up.railway.app/api/chat
```

## Step 2: Serve Widget Files

The widget files need to be accessible via CDN. You have two options:

### Option A: Serve from Railway Backend (Recommended)

1. Create a `public` folder in the backend directory:
```bash
cd backend
mkdir public
```

2. Copy the built widget files:
```bash
cp ../widget/dist/courtney-widget.umd.js public/
cp ../widget/dist/courtney-widget.css public/
```

3. Update `backend/server.js` to serve static files:
```javascript
// Add this line after other middleware
app.use(express.static('public'));
```

4. Commit and push:
```bash
git add .
git commit -m "Add widget static files"
git push
```

Widget will be accessible at:
- `https://your-app-name.up.railway.app/courtney-widget.umd.js`
- `https://your-app-name.up.railway.app/courtney-widget.css`

### Option B: Use a Separate CDN

Upload `widget/dist/` files to:
- Cloudflare R2
- AWS S3
- Vercel
- Netlify
- Any CDN service

## Step 3: HTML Snippet for Customers

Once deployed, provide this HTML snippet to anyone who wants to add the widget to their website:

```html
<!-- Courtney AI Support Widget -->
<div id="courtney-widget"></div>

<!-- Load Widget CSS -->
<link rel="stylesheet" href="https://your-app-name.up.railway.app/courtney-widget.css">

<!-- Load Widget JavaScript -->
<script src="https://your-app-name.up.railway.app/courtney-widget.umd.js"></script>

<!-- Initialize Widget -->
<script>
  CourtneyWidget.init({
    target: '#courtney-widget',
    apiEndpoint: 'https://your-app-name.up.railway.app/api/chat',
    publicKey: 'your-vapi-public-key',
    assistantId: 'your-vapi-assistant-id'
  });
</script>
```

### Customization Options

Users can customize the widget placement by changing the `target` selector:

```html
<!-- Example: Different placement -->
<div id="my-custom-support"></div>

<script>
  CourtneyWidget.init({
    target: '#my-custom-support',
    apiEndpoint: 'https://your-app-name.up.railway.app/api/chat',
    publicKey: 'your-vapi-public-key',
    assistantId: 'your-vapi-assistant-id'
  });
</script>
```

## Monitoring & Logs

View logs in Railway dashboard:
1. Go to your project
2. Click **"Deployments"**
3. Click on the latest deployment
4. View logs to see requests and errors

## Health Check

Test if your backend is running:
```
https://your-app-name.up.railway.app/health
```

Should return:
```json
{
  "status": "ok",
  "message": "VAPI Proxy Server is running"
}
```

## Troubleshooting

### Widget doesn't load
- Check if the CSS and JS files are accessible
- Check browser console for CORS errors
- Verify Railway URL is correct

### Chat doesn't work
- Check Railway environment variables are set
- Verify VAPI credentials are correct
- Check Railway logs for backend errors

### CORS Issues
The backend already has CORS enabled for all origins. If you need to restrict:

```javascript
// In backend/server.js
app.use(cors({
  origin: ['https://yourdomain.com', 'https://anotherdomain.com']
}));
```

## Scaling

Railway auto-scales based on usage. For production:

1. **Enable Autoscaling**: Railway handles this automatically
2. **Monitor Usage**: Check Railway metrics dashboard
3. **Rate Limiting**: Add rate limiting to protect your API
4. **Caching**: Consider caching responses if needed

## Cost Estimation

Railway pricing:
- **Hobby Plan**: $5/month (limited resources)
- **Pro Plan**: Pay for what you use
- **Enterprise**: Custom pricing

Your backend is lightweight and should cost minimal under typical usage.
