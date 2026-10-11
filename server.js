const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Webhook token for verification
const WEBHOOK_VERIFY_TOKEN = process.env.WEBHOOK_VERIFY_TOKEN || 'your_verify_token';
const WHATSAPP_API_TOKEN = process.env.WHATSAPP_API_TOKEN;
const BUSINESS_PHONE_NUMBER_ID = process.env.BUSINESS_PHONE_NUMBER_ID;

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'Bot is running!' });
});

// Webhook verification (GET request from WhatsApp)
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token) {
    if (mode === 'subscribe' && token === WEBHOOK_VERIFY_TOKEN) {
      console.log('Webhook verified successfully');
      res.status(200).send(challenge);
    } else {
      console.log('Webhook verification failed');
      res.sendStatus(403);
    }
  } else {
    res.sendStatus(400);
  }
});

// Webhook event handler (POST request from WhatsApp)
app.post('/webhook', async (req, res) => {
  try {
    const body = req.body;

    if (body.object) {
      if (
        body.entry &&
        body.entry[0].changes &&
        body.entry[0].changes[0].value.messages &&
        body.entry[0].changes[0].value.messages[0]
      ) {
        const phoneNumberId =
          body.entry[0].changes[0].value.metadata.phone_number_id;
        const from = body.entry[0].changes[0].value.messages[0].from;
        const msg_body = body.entry[0].changes[0].value.messages[0].text.body;

        console.log(`Message from ${from}: ${msg_body}`);

        // Process the message and generate a response
        const response = await processMessage(msg_body, from);

        // Send the response back
        await sendMessage(phoneNumberId, from, response);
      }

      res.status(200).send('EVENT_RECEIVED');
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error('Error handling webhook:', error);
    res.sendStatus(500);
  }
});

// Function to process incoming messages
async function processMessage(message, sender) {
  const lowerMessage = message.toLowerCase().trim();

  // Simple command handling
  if (lowerMessage === 'hi' || lowerMessage === 'hello') {
    return 'Hello! 👋 How can I help you today?';
  } else if (lowerMessage === 'help') {
    return 'Available commands:\n- hi/hello: Greet the bot\n- help: Show this menu\n- time: Get current time\n- ping: Check if bot is alive';
  } else if (lowerMessage === 'time') {
    const time = new Date().toLocaleTimeString();
    return `Current time: ${time}`;
  } else if (lowerMessage === 'ping') {
    return 'Pong! 🏓 Bot is alive and running.';
  } else {
    return 'I didn\'t understand that command. Type "help" to see available commands.';
  }
}

// Function to send messages via WhatsApp API
async function sendMessage(phoneNumberId, to, message) {
  try {
    const response = await axios.post(
      `https://graph.instagram.com/v17.0/${phoneNumberId}/messages`,
      {
        messaging_product: 'whatsapp',
        to: to,
        type: 'text',
        text: {
          body: message,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${WHATSAPP_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Message sent successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error.response?.data || error.message);
    throw error;
  }
}

// Start the server
app.listen(PORT, () => {
  console.log(`WhatsApp Bot server is running on port ${PORT}`);
  console.log(`Webhook endpoint: http://localhost:${PORT}/webhook`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
