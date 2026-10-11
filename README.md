# WhatsApp Bot 🤖

A simple and scalable WhatsApp bot built with Node.js and Express, ready to be deployed on Render.

## Features

- ✅ WhatsApp webhook integration
- ✅ Message handling and response
- ✅ Command-based interactions
- ✅ Easy deployment on Render
- ✅ Health check endpoint
- ✅ Secure webhook verification

## Prerequisites

Before you start, make sure you have:

1. **WhatsApp Business Account** - Sign up at [Meta Business](https://business.facebook.com/)
2. **Render Account** - Sign up at [render.com](https://render.com)
3. **Node.js** (v18 or higher) - For local development

## Getting Started

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd whatsapp-bot
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Copy the example file and add your credentials:

```bash
cp .env.example .env
```

Edit `.env` and add:

```env
WHATSAPP_API_TOKEN=your_whatsapp_api_token_here
BUSINESS_PHONE_NUMBER_ID=your_business_phone_number_id_here
WEBHOOK_VERIFY_TOKEN=your_verify_token_here
PORT=3000
```

### 4. Run Locally

```bash
npm start
```

Or with auto-reload during development:

```bash
npm run dev
```

Visit `http://localhost:3000/health` to verify the bot is running.

## Deployment on Render

### Step 1: Push to GitHub

```bash
git add .
git commit -m "Initial WhatsApp bot setup"
git push origin main
```

### Step 2: Deploy on Render

1. Go to [render.com](https://render.com) and sign in
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `whatsapp-bot`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add environment variables in the dashboard:
   - `WHATSAPP_API_TOKEN`
   - `BUSINESS_PHONE_NUMBER_ID`
   - `WEBHOOK_VERIFY_TOKEN`
   - `NODE_ENV=production`
6. Click "Create Web Service"

### Step 3: Configure WhatsApp Webhook

1. Go to Meta App Dashboard
2. Select your WhatsApp app
3. Go to Configuration → Webhooks
4. Set Callback URL: `https://your-render-url.onrender.com/webhook`
5. Set Verify Token: (same as `WEBHOOK_VERIFY_TOKEN` in your `.env`)
6. Subscribe to `messages` and `message_status` webhooks

## API Endpoints

### Health Check
```
GET /health
```
Returns the bot status.

### Webhook Verification
```
GET /webhook?hub.mode=subscribe&hub.verify_token=YOUR_TOKEN&hub.challenge=CHALLENGE
```
WhatsApp calls this for verification.

### Message Handler
```
POST /webhook
```
WhatsApp sends incoming messages here.

## Available Commands

- **hi** / **hello** - Greet the bot
- **help** - Show available commands
- **time** - Get current server time
- **ping** - Check if bot is alive

## Project Structure

```
whatsapp-bot/
├── server.js           # Main application file
├── package.json        # Project dependencies
├── .env.example        # Environment variables template
├── .gitignore          # Git ignore rules
├── render.yaml         # Render deployment config
└── README.md           # This file
```

## Customization

### Adding New Commands

Edit the `processMessage()` function in `server.js`:

```javascript
} else if (lowerMessage === 'your_command') {
  return 'Your response here';
}
```

### Handling Media Messages

The current implementation handles text messages. To handle images, documents, etc., extend the webhook handler:

```javascript
if (body.entry[0].changes[0].value.messages[0].image) {
  // Handle image
}
```

## Troubleshooting

### Bot not receiving messages
- ✅ Verify the webhook URL is correct and publicly accessible
- ✅ Check that `WEBHOOK_VERIFY_TOKEN` matches in Meta Dashboard
- ✅ Ensure the phone number is registered in WhatsApp Business

### Messages not sending
- ✅ Validate `WHATSAPP_API_TOKEN` is correct
- ✅ Check `BUSINESS_PHONE_NUMBER_ID` is correct
- ✅ Verify recipient phone number format (with country code)

### Webhook verification fails
- ✅ Check logs in Render dashboard
- ✅ Ensure `WEBHOOK_VERIFY_TOKEN` is set correctly
- ✅ Verify the endpoint is `/webhook` exactly

## Security Notes

⚠️ **Important:**
- Never commit `.env` files with real tokens
- Rotate your tokens regularly
- Use strong verify tokens
- Always validate incoming requests
- Keep dependencies updated: `npm update`

## Support

For issues or questions:
1. Check [Meta WhatsApp API Docs](https://developers.facebook.com/docs/whatsapp)
2. Review [Render Documentation](https://render.com/docs)
3. Check the logs in your Render dashboard

## License

ISC

---

**Created**: 2024
**Bot Name**: WhatsApp Manager Bot
