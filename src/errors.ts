/**
 * NewDB SDK Errors.
 */

export class NewDBError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NewDBError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class AuthenticationError extends NewDBError {
  constructor(message = 'Invalid or missing API key (X-API-KEY).') {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export class RateLimitError extends NewDBError {
  constructor(message = 'Rate limit exceeded for NewDB API.') {
    super(message);
    this.name = 'RateLimitError';
  }
}

export class TimeoutError extends NewDBError {
  constructor(message = 'Task did not finish within timeout.') {
    super(message);
    this.name = 'TimeoutError';
  }
}

export class APIResponseError extends NewDBError {
  public statusCode: number;
  public responseBody: any;

  constructor(message: string, statusCode: number, responseBody?: any) {
    super(`[${statusCode}] ${message}`);
    this.name = 'APIResponseError';
    this.statusCode = statusCode;
    this.responseBody = responseBody;
  }
}
