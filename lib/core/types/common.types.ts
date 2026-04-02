
/**
 * Common Types - Shared type definitions across the application
 * These types provide a foundation for type-safe communication
 */

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  metadata?: ResponseMetadata;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
  timestamp?: string;
}

export interface ResponseMetadata {
  page?: number;
  limit?: number;
  total?: number;
  timestamp: string;
}

// Pagination Types
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

// Filter Types
export interface FilterParams {
  search?: string;
  filters?: Record<string, any>;
}

// Result Types (for error handling)
export type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };

export const Ok = <T>(value: T): Result<T> => ({ ok: true, value });
export const Err = <E>(error: E): Result<never, E> => ({ ok: false, error });

// Entity Base
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}
