export interface ErrorMetadata {
  code?: string;
  status?: number;
  displayName?: string;
}

export class BaseError extends Error {
  public readonly code: string;
  public readonly status: number;
  public readonly displayName: string;

  constructor(
    message: string,
    {
      code = "UNKNOWN_ERROR",
      status = 500,
      displayName = "Error",
    }: ErrorMetadata = {}
  ) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.status = status;
    this.displayName = displayName;

    // Ensure proper prototype chain for instanceof checks
    Object.setPrototypeOf(this, new.target.prototype);
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      status: this.status,
      displayName: this.displayName,
    };
  }
}
