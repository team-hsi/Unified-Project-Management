import { AppError } from "./app-error";

interface ErrorLog {
  message: string;
  stack?: string;
  code?: string;
  statusCode?: number;
  timestamp: string;
  path?: string;
  userId?: string;
}

class ErrorLogger {
  private static instance: ErrorLogger;
  private logs: ErrorLog[] = [];

  private constructor() {}

  static getInstance(): ErrorLogger {
    if (!ErrorLogger.instance) {
      ErrorLogger.instance = new ErrorLogger();
    }
    return ErrorLogger.instance;
  }

  log(error: Error | AppError, context?: { path?: string; userId?: string }) {
    const errorLog: ErrorLog = {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      ...context,
    };

    if (error instanceof AppError) {
      errorLog.code = error.code;
      errorLog.statusCode = error.statusCode;
    }

    this.logs.push(errorLog);
    console.error("Error logged:", errorLog);

    // In production, you would send this to an error tracking service
    if (process.env.NODE_ENV === "production") {
      // Example: send to error tracking service
      // this.sendToErrorTrackingService(errorLog);
    }
  }

  getLogs(): ErrorLog[] {
    return this.logs;
  }

  clearLogs() {
    this.logs = [];
  }
}

export const errorLogger = ErrorLogger.getInstance();
