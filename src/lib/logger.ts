/* eslint-disable @typescript-eslint/no-explicit-any */
type LogLevel = "info" | "warn" | "error" | "debug";

interface LogPayload {
  message: string;
  level: LogLevel;
  context?: string;
  metadata?: Record<string, any>;
  timestamp: string;
}

class Logger {
  private formatLog(level: LogLevel, message: string, context?: string, metadata?: Record<string, any>): string {
    const payload: LogPayload = {
      timestamp: new Date().toISOString(),
      level,
      context,
      message,
      metadata: metadata ? this.sanitizeMetadata(metadata) : undefined,
    };

    if (process.env.NODE_ENV === "production") {
      return JSON.stringify(payload);
    }

    const contextStr = context ? `[${context}] ` : "";
    const metaStr = metadata ? ` | ${JSON.stringify(payload.metadata)}` : "";
    return `[${payload.timestamp}] ${level.toUpperCase()}: ${contextStr}${message}${metaStr}`;
  }

  private sanitizeMetadata(metadata: Record<string, any>): Record<string, any> {
    const sensitiveKeys = ["password", "token", "key", "authorization", "secret", "cookie", "session"];
    const sanitized = { ...metadata };

    Object.keys(sanitized).forEach((k) => {
      if (sensitiveKeys.some((sk) => k.toLowerCase().includes(sk))) {
        sanitized[k] = "[REDACTED]";
      } else if (typeof sanitized[k] === "object" && sanitized[k] !== null) {
        try {
          sanitized[k] = this.sanitizeMetadata(sanitized[k]);
        } catch {
          sanitized[k] = "[Unserializable Object]";
        }
      }
    });

    return sanitized;
  }

  info(message: string, context?: string, metadata?: Record<string, any>) {
    console.log(this.formatLog("info", message, context, metadata));
  }

  warn(message: string, context?: string, metadata?: Record<string, any>) {
    console.warn(this.formatLog("warn", message, context, metadata));
  }

  error(message: string, error?: Error | unknown, context?: string, metadata?: Record<string, any>) {
    const errMeta = error instanceof Error 
      ? { errorName: error.name, errorMessage: error.message, errorStack: error.stack } 
      : { error: String(error) };
    const mergedMetadata = { ...metadata, ...errMeta };
    console.error(this.formatLog("error", message, context, mergedMetadata));
  }

  debug(message: string, context?: string, metadata?: Record<string, any>) {
    if (process.env.NODE_ENV !== "production") {
      console.log(this.formatLog("debug", message, context, metadata));
    }
  }
}

export const logger = new Logger();
export default logger;
