// Loki log shipper — captures browser errors and sends structured logs to Loki
// Proxied through nginx → loki:3100

const SERVICE = 'zingybank-frontend';
const LOKI_PUSH_URL = '/loki/api/v1/push';

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
}

function toNanoTimestamp(): string {
  return (Date.now() * 1_000_000).toString();
}

async function ship(entry: LogEntry): Promise<void> {
  const payload = {
    streams: [
      {
        stream: {
          service: SERVICE,
          level: entry.level,
          env: import.meta.env.MODE,
        },
        values: [
          [
            toNanoTimestamp(),
            JSON.stringify({
              message: entry.message,
              ...entry.context,
            }),
          ],
        ],
      },
    ],
  };

  try {
    await fetch(LOKI_PUSH_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    });
  } catch {
    // silently fail — don't cause recursive errors
  }
}

export const logger = {
  info: (message: string, context?: Record<string, unknown>) =>
    ship({ level: 'info', message, context }),
  warn: (message: string, context?: Record<string, unknown>) =>
    ship({ level: 'warn', message, context }),
  error: (message: string, context?: Record<string, unknown>) =>
    ship({ level: 'error', message, context }),
  debug: (message: string, context?: Record<string, unknown>) =>
    ship({ level: 'debug', message, context }),
};

export function initGlobalErrorLogging(): void {
  window.addEventListener('error', (event) => {
    logger.error('Uncaught error', {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      stack: event.error?.stack,
    });
  });

  window.addEventListener('unhandledrejection', (event) => {
    logger.error('Unhandled promise rejection', {
      reason: String(event.reason),
      stack: event.reason?.stack,
    });
  });
}
