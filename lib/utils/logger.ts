/**
 * Logger Utility
 * Centralized logging system for the application
 * Provides different log levels and structured logging
 */

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
  error?: Error;
}

/**
 * Logger class for centralized logging
 */
class Logger {
  private isDevelopment: boolean;

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
  }

  /**
   * Format log entry for console output
   */
  private formatLogEntry(entry: LogEntry): string {
    const { level, message, timestamp, context } = entry;
    let formatted = `[${timestamp}] [${level}] ${message}`;
    
    if (context && Object.keys(context).length > 0) {
      formatted += `\nContext: ${JSON.stringify(context, null, 2)}`;
    }
    
    return formatted;
  }

  /**
   * Create log entry
   */
  private createLogEntry(
    level: LogLevel,
    message: string,
    context?: Record<string, unknown>,
    error?: Error
  ): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      error,
    };
  }

  /**
   * Log debug message (only in development)
   */
  debug(message: string, context?: Record<string, unknown>): void {
    if (!this.isDevelopment) return;

    const entry = this.createLogEntry(LogLevel.DEBUG, message, context);
    console.debug(this.formatLogEntry(entry));
  }

  /**
   * Log info message
   */
  info(message: string, context?: Record<string, unknown>): void {
    const entry = this.createLogEntry(LogLevel.INFO, message, context);
    console.info(this.formatLogEntry(entry));
  }

  /**
   * Log warning message
   */
  warn(message: string, context?: Record<string, unknown>): void {
    const entry = this.createLogEntry(LogLevel.WARN, message, context);
    console.warn(this.formatLogEntry(entry));
  }

  /**
   * Log error message
   */
  error(message: string, error?: Error, context?: Record<string, unknown>): void {
    const entry = this.createLogEntry(LogLevel.ERROR, message, context, error);
    console.error(this.formatLogEntry(entry));
    
    if (error) {
      console.error('Error stack:', error.stack);
    }

    // In production, you could send errors to a logging service here
    // Example: Sentry, LogRocket, etc.
    if (!this.isDevelopment) {
      this.sendToLoggingService(entry);
    }
  }

  /**
   * Send error to external logging service (placeholder)
   * In production, implement integration with services like Sentry
   */
  private sendToLoggingService(entry: LogEntry): void {
    // Placeholder for external logging service integration
    // Example: Sentry.captureException(entry.error, { extra: entry.context });
    
    // For now, just log that we would send it
    if (this.isDevelopment) {
      console.log('[Logger] Would send to logging service:', entry);
    }
  }
}

/**
 * Singleton logger instance
 */
export const logger = new Logger();
