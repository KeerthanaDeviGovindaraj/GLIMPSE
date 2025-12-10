// utils/logger.js
const fs = require('fs');
const path = require('path');

class Logger {
  constructor() {
    this.logDir = path.join(__dirname, '../logs');
    this.ensureLogDir();
  }

  ensureLogDir() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  formatMessage(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    const metaStr = Object.keys(meta).length > 0 ? JSON.stringify(meta) : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${message} ${metaStr}\n`;
  }

  writeToFile(filename, message) {
    const filepath = path.join(this.logDir, filename);
    fs.appendFileSync(filepath, message);
  }

  info(message, meta = {}) {
    const formattedMsg = this.formatMessage('info', message, meta);
    console.log(`ℹ️  ${message}`, meta);
    this.writeToFile('app.log', formattedMsg);
  }

  error(message, error = null, meta = {}) {
    const errorMeta = error ? { ...meta, error: error.message, stack: error.stack } : meta;
    const formattedMsg = this.formatMessage('error', message, errorMeta);
    console.error(`❌ ${message}`, errorMeta);
    this.writeToFile('error.log', formattedMsg);
  }

  warn(message, meta = {}) {
    const formattedMsg = this.formatMessage('warn', message, meta);
    console.warn(`⚠️  ${message}`, meta);
    this.writeToFile('app.log', formattedMsg);
  }

  debug(message, meta = {}) {
    if (process.env.NODE_ENV === 'development') {
      const formattedMsg = this.formatMessage('debug', message, meta);
      console.debug(`🐛 ${message}`, meta);
      this.writeToFile('debug.log', formattedMsg);
    }
  }

  success(message, meta = {}) {
    const formattedMsg = this.formatMessage('success', message, meta);
    console.log(`✅ ${message}`, meta);
    this.writeToFile('app.log', formattedMsg);
  }
}

module.exports = new Logger();