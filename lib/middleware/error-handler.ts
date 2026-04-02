
/**
 * Error Handler Middleware
 * Catches and formats errors consistently across the application
 */

import { NextResponse } from 'next/server';
import { AppError } from '../core/errors/app-error';
import { ResponseBuilder } from '../core/utils/response-builder';

export function handleError(error: unknown): NextResponse {
  console.error('API Error:', error);

  if (error instanceof AppError) {
    return ResponseBuilder.error(error);
  }

  if (error instanceof Error) {
    return ResponseBuilder.error(error);
  }

  // Unknown error type
  return ResponseBuilder.error(new Error('An unexpected error occurred'));
}

/**
 * Async handler wrapper for API routes
 * Automatically catches and handles errors
 */
export function asyncHandler<T extends any[], R>(
  fn: (...args: T) => Promise<R>
) {
  return async (...args: T): Promise<R | NextResponse> => {
    try {
      return await fn(...args);
    } catch (error) {
      return handleError(error);
    }
  };
}
