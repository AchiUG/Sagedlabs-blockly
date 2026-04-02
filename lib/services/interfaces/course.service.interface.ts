
/**
 * Course Service Interface
 * Defines the contract for course-related business logic
 */

import { Course } from '@prisma/client';
import { PaginationParams, PaginatedResult } from '@/lib/core/types/common.types';

export interface CourseDTO {
  id: string;
  title: string;
  description?: string;
  instructorId: string;
  instructorName?: string;
  categoryId?: string;
  level?: string;
  duration?: string;
  imageUrl?: string;
  isPublished: boolean;
  enrollmentCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCourseInput {
  title: string;
  description?: string;
  instructorId: string;
  categoryId?: string;
  level?: string;
  duration?: string;
  imageUrl?: string;
}

export interface UpdateCourseInput {
  title?: string;
  description?: string;
  categoryId?: string;
  level?: string;
  duration?: string;
  imageUrl?: string;
}

export interface CourseFilterOptions {
  instructorId?: string;
  categoryId?: string;
  level?: string;
  isPublished?: boolean;
  search?: string;
}

export interface ICourseService {
  getCourseById(id: string): Promise<CourseDTO | null>;
  getCourseWithDetails(id: string): Promise<any>;
  getAllCourses(params: PaginationParams & CourseFilterOptions): Promise<PaginatedResult<CourseDTO>>;
  getPublishedCourses(params: PaginationParams): Promise<PaginatedResult<CourseDTO>>;
  getCoursesByInstructor(instructorId: string, params: PaginationParams): Promise<PaginatedResult<CourseDTO>>;
  createCourse(data: CreateCourseInput): Promise<CourseDTO>;
  updateCourse(id: string, data: UpdateCourseInput): Promise<CourseDTO>;
  publishCourse(id: string): Promise<CourseDTO>;
  unpublishCourse(id: string): Promise<CourseDTO>;
  deleteCourse(id: string): Promise<void>;
  canUserEnroll(userId: string, courseId: string): Promise<boolean>;
}
