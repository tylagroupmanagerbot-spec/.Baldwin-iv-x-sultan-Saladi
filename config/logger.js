/**
 * Logger Module
 * Centralized logging for the application
 */

const fs = require('fs');
const path = require('path');

class Logger {
  constructor(logDir = './logs') {
    this.logDir = logDir;
    
    // Create logs directory if it doesn't exist
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }

    this.logFile = path.join(this.logDir, `bot-${new Date().toISOString().split('T')[0]}.log`);
  }

  /**
   * Format log message with timestamp
   */
  formatMessage(level, message) {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level}] ${message}`;
  }

  /**
   * Write to log file
   */
  writeToFile(message) {
    try {
      fs.appendFileSync(this.logFile, message + '\n');
    } catch (error) {
      console.error('Error writing to log file:', error);
    }
  }

  /**
   * Info level logging
   */
  info(message) {
    const formatted = this.formatMessage('INFO', message);
    console.log(formatted);
    this.writeToFile(formatted);
  }

  /**
   * Error level logging
   */
  error(message, error = null) {
    const errorMsg = error ? `${message} - ${error.message}` : message;
    const formatted = this.formatMessage('ERROR', errorMsg);
    console.error(formatted);
    this.writeToFile(formatted);
  }

  /**
   * Warning level logging
   */
  warn(message) {
    const formatted = this.formatMessage('WARN', message);
    console.warn(formatted);
    this.writeToFile(formatted);
  }

  /**
   * Debug level logging
   */
  debug(message) {
    if (process.env.DEBUG) {
      const formatted = this.formatMessage('DEBUG', message);
      console.log(formatted);
      this.writeToFile(formatted);
    }
  }

  /**
   * Success level logging
   */
  success(message) {
    const formatted = this.formatMessage('SUCCESS', message);
    console.log(formatted);
    this.writeToFile(formatted);
  }
}

module.exports = new Logger();
