// Custom error classes for the SDK
export class CincAPIError extends Error {
  public statusCode?: number;
  public response?: any;

  constructor(message: string, statusCode?: number, response?: any) {
    super(message);
    this.name = 'CincAPIError';
    this.statusCode = statusCode;
    this.response = response;
  }
}

export class NetworkError extends CincAPIError {
  constructor(message: string = 'Network request failed') {
    super(message);
    this.name = 'NetworkError';
  }
}

export class AuthenticationError extends CincAPIError {
  constructor(message: string = 'Authentication failed') {
    super(message, 401);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends CincAPIError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, 403);
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends CincAPIError {
  constructor(message: string = 'Resource not found') {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}

export class ValidationError extends CincAPIError {
  constructor(message: string = 'Invalid input data') {
    super(message, 400);
    this.name = 'ValidationError';
  }
}

export class RateLimitError extends CincAPIError {
  constructor(message: string = 'Rate limit exceeded') {
    super(message, 429);
    this.name = 'RateLimitError';
  }
}

export class ServerError extends CincAPIError {
  constructor(message: string = 'Internal server error') {
    super(message, 500);
    this.name = 'ServerError';
  }
}
