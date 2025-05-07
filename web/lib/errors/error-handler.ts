import { BaseError } from "./base-error";
import {
  APIError,
  AuthenticationError,
  AuthorizationError,
  BadRequestError,
  NotFoundError,
  RequestTimeoutError,
  ConflictError,
} from "./api-error";
import { errorLogger } from "./error-logger";

export interface ErrorResponse {
  error: {
    name: string;
    message: string;
    code: string;
    status: number;
    displayName: string;
  };
}

export function handleError(error: unknown): ErrorResponse {
  // Log the error
  errorLogger.error(error instanceof Error ? error : new Error(String(error)));

  // Handle known error types
  if (error instanceof BaseError) {
    return {
      error: error.toJSON(),
    };
  }

  // Handle API errors
  if (error instanceof APIError) {
    return {
      error: error.toJSON(),
    };
  }

  // Handle specific API error types
  if (error instanceof AuthenticationError) {
    return {
      error: error.toJSON(),
    };
  }

  if (error instanceof AuthorizationError) {
    return {
      error: error.toJSON(),
    };
  }

  if (error instanceof BadRequestError) {
    return {
      error: error.toJSON(),
    };
  }

  if (error instanceof NotFoundError) {
    return {
      error: error.toJSON(),
    };
  }

  if (error instanceof RequestTimeoutError) {
    return {
      error: error.toJSON(),
    };
  }

  if (error instanceof ConflictError) {
    return {
      error: error.toJSON(),
    };
  }

  // Handle unknown errors
  const unknownError = new BaseError(
    error instanceof Error ? error.message : "An unknown error occurred",
    {
      code: "UNKNOWN_ERROR",
      status: 500,
      displayName: "Unknown Error",
    }
  );

  return {
    error: unknownError.toJSON(),
  };
}

export function isErrorResponse(value: unknown): value is ErrorResponse {
  return (
    typeof value === "object" &&
    value !== null &&
    "error" in value &&
    typeof (value as ErrorResponse).error === "object" &&
    (value as ErrorResponse).error !== null &&
    "name" in (value as ErrorResponse).error &&
    "message" in (value as ErrorResponse).error &&
    "code" in (value as ErrorResponse).error &&
    "status" in (value as ErrorResponse).error &&
    "displayName" in (value as ErrorResponse).error
  );
}
