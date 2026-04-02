
/**
 * Response Builder - Standardized API response construction
 */

import { NextResponse } from 'next/server';
import { ApiResponse, ResponseMetadata } from '../types/common.types';
import { AppError } from '../errors/app-error';

export class ResponseBuilder {
  static success<T>(
    data: T,
    metadata?: Partial<ResponseMetadata>,
    status: number = 200
  ): NextResponse<ApiResponse<T>> {
    const response: ApiResponse<T> = {
      success: true,
      data,
      metadata: {
        ...metadata,
        timestamp: new Date().toISOString(),
      },
    };

    return NextResponse.json(response, { status });
  }

  static created<T>(data: T): NextResponse<ApiResponse<T>> {
    return this.success(data, undefined, 201);
  }

  static noContent(): NextResponse {
    return new NextResponse(null, { status: 204 });
  }

  static error(
    error: AppError | Error,
    status?: number
  ): NextResponse<ApiResponse> {
    if (error instanceof AppError) {
      const response: ApiResponse = {
        success: false,
        error: error.toJSON(),
      };
      return NextResponse.json(response, { status: error.statusCode });
    }

    // Generic error handling
    const response: ApiResponse = {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error.message || 'An unexpected error occurred',
        timestamp: new Date().toISOString(),
      },
    };

    return NextResponse.json(response, { status: status || 500 });
  }

  static paginated<T>(
    items: T[],
    total: number,
    page: number,
    limit: number,
    status: number = 200
  ): NextResponse<ApiResponse<T[]>> {
    const totalPages = Math.ceil(total / limit);
    
    const response: ApiResponse<T[]> = {
      success: true,
      data: items,
      metadata: {
        page,
        limit,
        total,
        timestamp: new Date().toISOString(),
      },
    };

    return NextResponse.json(response, { status });
  }
}
