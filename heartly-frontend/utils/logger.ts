type LogLevel = 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  metadata?: Record<string, unknown>;
}

export const logger = {
  log: (message: string, level: LogLevel = 'info', metadata?: Record<string, unknown>) => {
    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      metadata,
    };

    // In production, you would send this to a logging service
    // For now, we'll just console log
    console[level](JSON.stringify(logEntry));

    // In a real-world scenario, you might want to send this to a logging service
    // Example: await sendToLoggingService(logEntry);
  },
  info: (message: string, metadata?: Record<string, unknown>) => logger.log(message, 'info', metadata),
  warn: (message: string, metadata?: Record<string, unknown>) => logger.log(message, 'warn', metadata),
  error: (message: string, metadata?: Record<string, unknown>) => logger.log(message, 'error', metadata),
};

// This function would be implemented to send logs to your chosen logging service
// async function sendToLoggingService(logEntry: LogEntry) {
//   // Implementation depends on your chosen logging service
// }

