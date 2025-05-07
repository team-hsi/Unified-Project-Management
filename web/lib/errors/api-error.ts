import { BaseError } from "./base-error";

export class APIError extends BaseError {
  constructor(
    message: string,
    { code = "API_ERROR", status = 500, displayName = "API Error" } = {}
  ) {
    super(message, { code, status, displayName });
  }
}

export class AuthenticationError extends APIError {
  constructor(message: string = "Authentication failed") {
    super(message, {
      code: "AUTHENTICATION_ERROR",
      status: 401,
      displayName: "Authentication Error",
    });
  }
}

export class AuthorizationError extends APIError {
  constructor(message: string = "Not authorized") {
    super(message, {
      code: "AUTHORIZATION_ERROR",
      status: 403,
      displayName: "Authorization Error",
    });
  }
}

export class BadRequestError extends APIError {
  constructor(message: string = "Bad request") {
    super(message, {
      code: "BAD_REQUEST_ERROR",
      status: 400,
      displayName: "Bad Request",
    });
  }
}

export class NotFoundError extends APIError {
  constructor(message: string = "Resource not found") {
    super(message, {
      code: "NOT_FOUND_ERROR",
      status: 404,
      displayName: "Not Found",
    });
  }
}

export class RequestTimeoutError extends APIError {
  constructor(message: string = "Request timed out") {
    super(message, {
      code: "REQUEST_TIMEOUT_ERROR",
      status: 408,
      displayName: "Request Timeout",
    });
  }
}

export class ConflictError extends APIError {
  constructor(message: string = "Resource already exists") {
    super(message, {
      code: "CONFLICT_ERROR",
      status: 409,
      displayName: "Conflict",
    });
  }
}
