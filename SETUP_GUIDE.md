# WhatsApp Bot Setup Guide 📱

Complete step-by-step guide to set up and deploy your WhatsApp bot.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Meta Setup](#meta-setup)
3. [Local Development](#local-development)
4. [Render Deployment](#render-deployment)
5. [Testing](#testing)

---

## Prerequisites

### Required Accounts
- ✅ **Meta Business Account** - [Sign up here](https://business.facebook.com/)
- ✅ **Render Account** - [Sign up here](https://render.com)
- ✅ **GitHub Account** - For code hosting
- ✅ **Node.js v18+** - [Download](https://nodejs.org/)

### Required Credentials
You'll need to collect:
1. **WhatsApp Business Phone Number ID**
2. **WhatsApp API Access Token**
3. **Webhook Verify Token** (create your own strong token)

---

## Meta Setup

### Step 1: Create a Meta App

1. Go to [Meta Developers](https://developers.facebook.com/)
2. Click "My Apps" → "Create App"
3. Choose "Business" as the app type
4. Fill in app details:
   - App Name: "WhatsApp Bot"
   - App Contact Email: Your email
   - Select Business Purpose: "Chat/Messaging Bot"
5. Click "Create App"

### Step 2: Add WhatsApp Product

1. In your app dashboard, click "Add Product"
2. Search for "WhatsApp" and click "Set Up"
3. Choose "Webhook" as the integration method

### Step 3: Create WhatsApp Business Account

1. Go to WhatsApp Manager
2. Click "Create Account"
3. Fill in your business details
4. Verify your phone number
5. Add your business info and profile picture

### Step 4: Get Your Credentials

1. **Phone Number ID**: 
   - Go to WhatsApp Settings → API Setup
   - Copy your "Phone Number ID"

2. **Access Token**:
   - Go to Settings → User Access Tokens
   - Create a new system user token
   - Copy the token

3. **Webhook Verify Token**:
   - Create a strong random token (e.g., using: `openssl rand -base64 32`)
   - Keep this safe!

### Step 5: Configure Webhook

⚠️ **Do this AFTER deploying to Render**

1. In Meta App Dashboard → WhatsApp → Configuration
2. Set **Callback URL**: `https://your-render-app.onrender.com/webhook`
3. Set **Verify Token**: Your webhook verify token
4. Subscribe to:
   - `messages`
   - `message_status`
   - `message_template_status_update`

---

## Local Development

### Step 1: Clone and Install

```bash
git clone https://github.com/yourusername/whatsapp-bot.git
cd whatsapp-bot
npm install
```

### Step 2: Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:
```
WHATSAPP_API_TOKEN=your_token_here
BUSINESS_PHONE_NUMBER_ID=your_phone_id_here
WEBHOOK_VERIFY_TOKEN=your_verify_token_here
PORT=3000
NODE_ENV=development
```

### Step 3: Run Locally

```bash
npm start
```

Or with auto-reload:
```bash
npm run dev
```

### Step 4: Test Locally (Optional)

Use ngrok to expose local server:
```bash
# Install ngrok
npm install -g ngrok

# In another terminal
ngrok http 3000

# Copy the forwarding URL and update webhook URL in Meta Dashboard
```

---

## Render Deployment

### Step 1: Push Code to GitHub

```bash
git add .
git commit -m "WhatsApp bot ready for deployment"
git push origin main
```

### Step 2: Connect to Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Click "Connect GitHub Account"
4. Authorize Render
5. Select your repository

### Step 3: Configure Web Service

**Basic Settings:**
- Name: `whatsapp-bot`
- Environment: `Node`
- Region: Choose closest to you
- Branch: `main`
- Build Command: `npm install`
- Start Command: `npm start`
- Instance Type: `Free` (sufficient for testing)

**Environment Variables:**

Click "Add Environment Variable" and add:

| Key | Value |
|-----|-------|
| `WHATSAPP_API_TOKEN` | Your WhatsApp API token |
| `BUSINESS_PHONE_NUMBER_ID` | Your phone number ID |
| `WEBHOOK_VERIFY_TOKEN` | Your verify token |
| `NODE_ENV` | `production` |
| `PORT` | `3000` |

### Step 4: Deploy

1. Click "Create Web Service"
2. Wait for deployment to complete (2-5 minutes)
3. Copy your Render URL (e.g., `https://whatsapp-bot.onrender.com`)
4. Note: Free tier services sleep after 15 minutes of inactivity

### Step 5: Update Meta Webhook URL

⚠️ **Important: Do this after Render deployment is complete**

1. Go to Meta App Dashboard
2. Navigate to WhatsApp → Configuration
3. Set Callback URL: `https://whatsapp-bot.onrender.com/webhook`
4. Set Verify Token: (your webhook verify token)
5. Click "Verify and Save"

---

## Testing

### Test 1: Health Check

```bash
curl https://your-render-app.onrender.com/health
```

Expected response:
```json
{"status": "Bot is running!"}
```

### Test 2: Send a Message

1. Send a WhatsApp message to your business number:
   - Type: `hello`
   - Bot should respond: `Hello! 👋 How can I help you today?`

2. Try other commands:
   - `help` - See all available commands
   - `time` - Get current time
   - `ping` - Check if bot is alive

### Test 3: Check Logs

In Render Dashboard:
1. Select your service
2. Go to "Logs"
3. You should see your bot handling messages

---

## Troubleshooting

### Problem: Webhook Verification Fails

**Solution:**
- ✅ Verify the URL is correct in Meta Dashboard
- ✅ Check that WEBHOOK_VERIFY_TOKEN matches exactly
- ✅ Ensure the `/webhook` endpoint is public (no authentication)
- ✅ Check Render logs for errors

### Problem: Bot Doesn't Receive Messages

**Solution:**
- ✅ Ensure webhook is verified in Meta Dashboard
- ✅ Check that messages and message_status are subscribed
- ✅ Verify phone number is registered in WhatsApp Business
- ✅ Check bot logs: `tail -f logs/bot-*.log`

### Problem: Messages Won't Send

**Solution:**
- ✅ Verify WHATSAPP_API_TOKEN is correct
- ✅ Check BUSINESS_PHONE_NUMBER_ID is correct
- ✅ Ensure recipient has WhatsApp account
- ✅ Verify API token has correct permissions

### Problem: Render Service Keeps Going to Sleep

**Solution:**
- ✅ Upgrade to Paid tier (optional)
- ✅ Or keep bot active with periodic health checks using a cron service
- ✅ Or use a monitoring service like Uptime Robot

### Problem: Can't Find Logs

**Solution:**
```bash
# Local logs are in ./logs directory
cat logs/bot-$(date +%Y-%m-%d).log

# Render logs are in Dashboard → Logs tab
# Or via CLI:
render logs whatsapp-bot
```

---

## Security Checklist

- [ ] Store all tokens in `.env` (never commit)
- [ ] Use strong webhook verify token
- [ ] Validate all incoming webhook requests
- [ ] Keep dependencies updated: `npm audit fix`
- [ ] Monitor logs for suspicious activity
- [ ] Rotate tokens regularly
- [ ] Use HTTPS only (Render handles this)
- [ ] Limit rate of outgoing messages
- [ ] Validate user input before processing

---

## Next Steps

### Enhance Your Bot

1. **Add Database** - Store user data and conversation history
   ```bash
   npm install mongoose
   ```

2. **Add AI** - Integrate with OpenAI or Hugging Face
   ```bash
   npm install openai
   ```

3. **Add Authentication** - Protect sensitive endpoints
   ```bash
   npm install jsonwebtoken bcryptjs
   ```

4. **Add Broadcasting** - Send messages to multiple users
   - Create `/broadcast` endpoint

5. **Add Scheduling** - Send scheduled messages
   ```bash
   npm install node-cron
   ```

### Monitoring & Analytics

- Set up error tracking: [Sentry](https://sentry.io/)
- Monitor performance: [New Relic](https://newrelic.com/)
- Track metrics: Custom dashboard with logs

### Scale to Production

- Upgrade Render to paid tier
- Add database (MongoDB, PostgreSQL)
- Implement message queuing (Redis)
- Set up CI/CD pipeline
- Add automated testing
- Monitor uptime and performance

---

## Support & Resources

- 📚 [Meta WhatsApp API Docs](https://developers.facebook.com/docs/whatsapp)
- 📚 [Render Documentation](https://render.com/docs)
- 🐛 [GitHub Issues](https://github.com/yourusername/whatsapp-bot/issues)
- 💬 [WhatsApp Support](https://www.whatsapp.com/contact/)

---

**Last Updated**: 2024
**Version**: 1.0.0
