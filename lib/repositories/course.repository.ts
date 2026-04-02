
/**
 * Course Repository - Data access layer for courses
 * Implements repository pattern for course-related database operations
 */

import { Course, Prisma } from '@prisma/client';
import { BaseRepository } from './base.repository';
import { PrismaClient } from '@prisma/client';
import { PaginationParams, FilterParams } from '../core/types/common.types';

export interface CreateCourseDTO {
  title: string;
  description?: string;
  instructorId: string;
  categoryId?: string;
  level?: string;
  duration?: string;
  imageUrl?: string;
  isPublished?: boolean;
}

export interface UpdateCourseDTO {
  title?: string;
  description?: string;
  categoryId?: string;
  level?: string;
  duration?: string;
  imageUrl?: string;
  isPublished?: boolean;
}

export interface CourseFilters extends FilterParams {
  instructorId?: string;
  categoryId?: string;
  level?: string;
  isPublished?: boolean;
}

export class CourseRepository extends BaseRepository<
  Course,
  CreateCourseDTO,
  UpdateCourseDTO
> {
  constructor(prisma: PrismaClient) {
    super(prisma, 'course');
  }

  async findByInstructor(
    instructorId: string,
    params?: PaginationParams
  ) {
    return this.findAll({ ...params, filters: { instructorId } });
  }

  async findPublished(params?: PaginationParams) {
    return this.findAll({ ...params, filters: { isPublished: true } });
  }

  async findByIdWithDetails(id: string) {
    return this.prisma.course.findUnique({
      where: { id },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        category: true,
        modules: {
          include: {
            lessons: true,
          },
          orderBy: { orderIndex: 'asc' },
        },
        _count: {
          select: {
            enrollments: true,
          },
        },
      },
    });
  }

  async countEnrollments(courseId: string): Promise<number> {
    return this.prisma.enrollment.count({
      where: { courseId },
    });
  }

  protected buildWhereClause(
    search?: string,
    filters?: Record<string, any>
  ): Prisma.CourseWhereInput {
    const where: Prisma.CourseWhereInput = {};

    if (filters) {
      if (filters.instructorId) where.instructorId = filters.instructorId;
      if (filters.categoryId) where.categoryId = filters.categoryId;
      if (filters.level) where.level = filters.level as any;
      if (typeof filters.isPublished === 'boolean') {
        where.isPublished = filters.isPublished;
      }
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    return where;
  }
}
