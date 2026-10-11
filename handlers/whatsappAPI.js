/**
 * WhatsApp API Handler
 * Manages all communication with WhatsApp API
 */

const axios = require('axios');

class WhatsAppAPI {
  constructor(accessToken, phoneNumberId) {
    this.accessToken = accessToken;
    this.phoneNumberId = phoneNumberId;
    this.baseURL = `https://graph.instagram.com/v17.0`;
  }

  /**
   * Send a text message
   * @param {string} to - Recipient phone number
   * @param {string} message - Message text
   */
  async sendTextMessage(to, message) {
    try {
      const response = await axios.post(
        `${this.baseURL}/${this.phoneNumberId}/messages`,
        {
          messaging_product: 'whatsapp',
          to: to,
          type: 'text',
          text: {
            body: message,
          },
        },
        {
          headers: this.getHeaders(),
        }
      );

      console.log('Text message sent:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error sending text message:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Send an image message
   * @param {string} to - Recipient phone number
   * @param {string} imageUrl - URL of the image
   * @param {string} caption - Optional image caption
   */
  async sendImageMessage(to, imageUrl, caption = '') {
    try {
      const response = await axios.post(
        `${this.baseURL}/${this.phoneNumberId}/messages`,
        {
          messaging_product: 'whatsapp',
          to: to,
          type: 'image',
          image: {
            link: imageUrl,
          },
          caption: caption,
        },
        {
          headers: this.getHeaders(),
        }
      );

      console.log('Image message sent:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error sending image message:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Send a document message
   * @param {string} to - Recipient phone number
   * @param {string} documentUrl - URL of the document
   * @param {string} filename - Name of the document
   */
  async sendDocumentMessage(to, documentUrl, filename) {
    try {
      const response = await axios.post(
        `${this.baseURL}/${this.phoneNumberId}/messages`,
        {
          messaging_product: 'whatsapp',
          to: to,
          type: 'document',
          document: {
            link: documentUrl,
            filename: filename,
          },
        },
        {
          headers: this.getHeaders(),
        }
      );

      console.log('Document message sent:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error sending document message:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Send a template message
   * @param {string} to - Recipient phone number
   * @param {string} templateName - Name of the template
   * @param {string} languageCode - Language code (e.g., 'en_US')
   */
  async sendTemplateMessage(to, templateName, languageCode = 'en_US') {
    try {
      const response = await axios.post(
        `${this.baseURL}/${this.phoneNumberId}/messages`,
        {
          messaging_product: 'whatsapp',
          to: to,
          type: 'template',
          template: {
            name: templateName,
            language: {
              code: languageCode,
            },
          },
        },
        {
          headers: this.getHeaders(),
        }
      );

      console.log('Template message sent:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error sending template message:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Send a button message
   * @param {string} to - Recipient phone number
   * @param {string} bodyText - Message body
   * @param {array} buttons - Array of button objects
   */
  async sendButtonMessage(to, bodyText, buttons) {
    try {
      const response = await axios.post(
        `${this.baseURL}/${this.phoneNumberId}/messages`,
        {
          messaging_product: 'whatsapp',
          to: to,
          type: 'interactive',
          interactive: {
            type: 'button',
            body: {
              text: bodyText,
            },
            action: {
              buttons: buttons,
            },
          },
        },
        {
          headers: this.getHeaders(),
        }
      );

      console.log('Button message sent:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error sending button message:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Send a list message
   * @param {string} to - Recipient phone number
   * @param {string} headerText - List header
   * @param {string} bodyText - Message body
   * @param {string} footerText - List footer
   * @param {array} sections - Array of section objects
   */
  async sendListMessage(to, headerText, bodyText, footerText, sections) {
    try {
      const response = await axios.post(
        `${this.baseURL}/${this.phoneNumberId}/messages`,
        {
          messaging_product: 'whatsapp',
          to: to,
          type: 'interactive',
          interactive: {
            type: 'list',
            header: {
              type: 'text',
              text: headerText,
            },
            body: {
              text: bodyText,
            },
            footer: {
              text: footerText,
            },
            action: {
              button: 'View Options',
              sections: sections,
            },
          },
        },
        {
          headers: this.getHeaders(),
        }
      );

      console.log('List message sent:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error sending list message:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Mark message as read
   * @param {string} messageId - Message ID to mark as read
   */
  async markMessageAsRead(messageId) {
    try {
      const response = await axios.post(
        `${this.baseURL}/${this.phoneNumberId}/messages`,
        {
          messaging_product: 'whatsapp',
          status: 'read',
          message_id: messageId,
        },
        {
          headers: this.getHeaders(),
        }
      );

      console.log('Message marked as read:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error marking message as read:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Get headers for API requests
   */
  getHeaders() {
    return {
      Authorization: `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json',
    };
  }

  /**
   * Validate phone number format
   * @param {string} phoneNumber - Phone number to validate
   */
  validatePhoneNumber(phoneNumber) {
    // Remove all non-digit characters
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    // Check if it has at least 10 digits
    if (cleaned.length < 10) {
      throw new Error('Invalid phone number format');
    }

    return cleaned;
  }
}

module.exports = WhatsAppAPI;
