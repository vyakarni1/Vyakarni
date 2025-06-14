
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  data?: any;
  timestamp: string;
  component?: string;
  operation?: string;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private logs: LogEntry[] = [];
  private maxLogs = 100;

  private formatMessage(level: LogLevel, message: string, data?: any, context?: string): LogEntry {
    return {
      level,
      message,
      data,
      timestamp: new Date().toISOString(),
      component: context,
    };
  }

  private shouldLog(level: LogLevel): boolean {
    if (level === 'error' || level === 'warn') return true;
    return this.isDevelopment;
  }

  private writeLog(entry: LogEntry) {
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Only log to console in development or for errors/warnings
    if (this.shouldLog(entry.level)) {
      const prefix = `[${entry.level.toUpperCase()}] ${entry.timestamp}`;
      const contextPrefix = entry.component ? ` [${entry.component}]` : '';
      const fullMessage = `${prefix}${contextPrefix} ${entry.message}`;

      switch (entry.level) {
        case 'error':
          console.error(fullMessage, entry.data || '');
          break;
        case 'warn':
          console.warn(fullMessage, entry.data || '');
          break;
        case 'info':
          console.info(fullMessage, entry.data || '');
          break;
        case 'debug':
          console.log(fullMessage, entry.data || '');
          break;
      }
    }
  }

  debug(message: string, data?: any, component?: string) {
    const entry = this.formatMessage('debug', message, data, component);
    this.writeLog(entry);
  }

  info(message: string, data?: any, component?: string) {
    const entry = this.formatMessage('info', message, data, component);
    this.writeLog(entry);
  }

  warn(message: string, data?: any, component?: string) {
    const entry = this.formatMessage('warn', message, data, component);
    this.writeLog(entry);
  }

  error(message: string, data?: any, component?: string) {
    const entry = this.formatMessage('error', message, data, component);
    this.writeLog(entry);
  }

  // Get recent logs for debugging
  getRecentLogs(limit = 50): LogEntry[] {
    return this.logs.slice(-limit);
  }

  // Clear logs
  clearLogs() {
    this.logs = [];
  }

  // Export logs for debugging
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}

export const logger = new Logger();
