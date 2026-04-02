
/**
 * Application Error Classes
 * Standardized error handling for the application
 */

export enum ErrorCode {
  // Authentication & Authorization
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  
  // Validation
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',
  
  // Resource
  NOT_FOUND = 'NOT_FOUND',
  ALREADY_EXISTS = 'ALREADY_EXISTS',
  CONFLICT = 'CONFLICT',
  
  // Business Logic
  BUSINESS_RULE_VIOLATION = 'BUSINESS_RULE_VIOLATION',
  INSUFFICIENT_PRIVILEGES = 'INSUFFICIENT_PRIVILEGES',
  
  // System
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',
}

export class AppError extends Error {
  constructor(
    public readonly code: ErrorCode,
    public readonly message: string,
    public readonly statusCode: number = 500,
    public readonly details?: any
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      code: this.code,
      message: this.message,
      details: this.details,
      timestamp: new Date().toISOString(),
    };
  }
}

// Specific Error Classes
export class UnauthorizedError extends AppError {
  constructor(message: string = 'Authentication required', details?: any) {
    super(ErrorCode.UNAUTHORIZED, message, 401, details);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Access denied', details?: any) {
    super(ErrorCode.FORBIDDEN, message, 403, details);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, details?: any) {
    super(ErrorCode.NOT_FOUND, `${resource} not found`, 404, details);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(ErrorCode.VALIDATION_ERROR, message, 400, details);
  }
}

export class ConflictError extends AppError {
  constructor(message: string, details?: any) {
    super(ErrorCode.CONFLICT, message, 409, details);
  }
}

export class BusinessRuleError extends AppError {
  constructor(message: string, details?: any) {
    super(ErrorCode.BUSINESS_RULE_VIOLATION, message, 400, details);
  }
}

export class DatabaseError extends AppError {
  constructor(message: string, details?: any) {
    super(ErrorCode.DATABASE_ERROR, message, 500, details);
  }
}
