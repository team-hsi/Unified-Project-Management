import { BaseError } from "./base-error";

type LogLevel = "error" | "warn" | "info" | "debug";

class ErrorLogger {
  private static instance: ErrorLogger;
  private readonly environment: "development" | "production" | "test";

  private constructor() {
    this.environment = process.env.NODE_ENV as
      | "development"
      | "production"
      | "test";
  }

  public static getInstance(): ErrorLogger {
    if (!ErrorLogger.instance) {
      ErrorLogger.instance = new ErrorLogger();
    }
    return ErrorLogger.instance;
  }

  private formatError(error: Error | BaseError): string {
    if (error instanceof BaseError) {
      return JSON.stringify(error.toJSON(), null, 2);
    }
    return JSON.stringify(
      {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
      null,
      2
    );
  }

  public log(error: Error | BaseError, level: LogLevel = "error"): void {
    const formattedError = this.formatError(error);
    console[level](formattedError);
  }

  public error(error: Error | BaseError): void {
    this.log(error, "error");
  }

  public warn(error: Error | BaseError): void {
    this.log(error, "warn");
  }

  public info(error: Error | BaseError): void {
    this.log(error, "info");
  }

  public debug(error: Error | BaseError): void {
    this.log(error, "debug");
  }
}

export const errorLogger = ErrorLogger.getInstance();
