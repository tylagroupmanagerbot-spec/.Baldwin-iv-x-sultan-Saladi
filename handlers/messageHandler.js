/**
 * Message Handler Module
 * Processes incoming WhatsApp messages and generates responses
 */

class MessageHandler {
  constructor() {
    this.commands = this.initializeCommands();
  }

  /**
   * Initialize available commands
   */
  initializeCommands() {
    return {
      'hi': {
        response: 'Hello! 👋 How can I help you today?',
        description: 'Greet the bot'
      },
      'hello': {
        response: 'Hello! 👋 How can I help you today?',
        description: 'Greet the bot'
      },
      'help': {
        response: this.getHelpMenu(),
        description: 'Show available commands'
      },
      'time': {
        response: `Current time: ${new Date().toLocaleTimeString()}`,
        description: 'Get current server time'
      },
      'ping': {
        response: 'Pong! 🏓 Bot is alive and running.',
        description: 'Check if bot is alive'
      },
      'start': {
        response: 'Welcome! I\'m your WhatsApp bot. Type "help" to see what I can do.',
        description: 'Start interaction'
      }
    };
  }

  /**
   * Get help menu
   */
  getHelpMenu() {
    let menu = '📋 *Available Commands:*\n\n';
    for (const [command, data] of Object.entries(this.commands)) {
      menu += `• *${command}* - ${data.description}\n`;
    }
    return menu;
  }

  /**
   * Process incoming message
   * @param {string} message - Incoming message text
   * @param {string} from - Sender's phone number
   * @returns {string} - Response message
   */
  processMessage(message, from) {
    const lowerMessage = message.toLowerCase().trim();

    // Check if message matches a command
    if (this.commands[lowerMessage]) {
      return this.commands[lowerMessage].response;
    }

    // Default response if no command matches
    return 'I didn\'t understand that command. Type "help" to see available commands.';
  }

  /**
   * Add custom command
   * @param {string} command - Command keyword
   * @param {string} response - Response message
   * @param {string} description - Command description
   */
  addCommand(command, response, description = 'Custom command') {
    this.commands[command.toLowerCase()] = {
      response,
      description
    };
  }

  /**
   * Handle complex message routing
   * @param {object} messageData - Full message object from WhatsApp
   * @returns {object} - Response object
   */
  handleMessageData(messageData) {
    const messageType = messageData.type;

    switch (messageType) {
      case 'text':
        return {
          type: 'text',
          content: this.processMessage(messageData.text.body, messageData.from)
        };
      case 'image':
        return {
          type: 'text',
          content: 'Thanks for the image! 📸 I can see it but text is my specialty.'
        };
      case 'document':
        return {
          type: 'text',
          content: 'I received your document! 📄 Feel free to ask any questions.'
        };
      case 'audio':
        return {
          type: 'text',
          content: 'I received your audio message! 🎵 How can I help?'
        };
      default:
        return {
          type: 'text',
          content: 'I received your message! How can I assist?'
        };
    }
  }
}

module.exports = MessageHandler;
