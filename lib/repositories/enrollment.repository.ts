
/**
 * Enrollment Repository - Data access layer for course enrollments
 */

import { Enrollment, Prisma } from '@prisma/client';
import { BaseRepository } from './base.repository';
import { PrismaClient } from '@prisma/client';
import { ConflictError } from '../core/errors/app-error';

export interface CreateEnrollmentDTO {
  userId: string;
  courseId: string;
  status?: string;
}

export interface UpdateEnrollmentDTO {
  status?: string;
  progress?: number;
  completedAt?: Date;
}

export class EnrollmentRepository extends BaseRepository<
  Enrollment,
  CreateEnrollmentDTO,
  UpdateEnrollmentDTO
> {
  constructor(prisma: PrismaClient) {
    super(prisma, 'enrollment');
  }

  async findByUserAndCourse(
    userId: string,
    courseId: string
  ): Promise<Enrollment | null> {
    return this.prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });
  }

  async findByUser(userId: string) {
    return this.prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: {
          include: {
            instructor: {
              select: {
                name: true,
                image: true,
              },
            },
          },
        },
      },
      orderBy: { enrolledAt: 'desc' },
    });
  }

  async findByCourse(courseId: string) {
    return this.prisma.enrollment.findMany({
      where: { courseId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
      orderBy: { enrolledAt: 'desc' },
    });
  }

  async createEnrollment(data: CreateEnrollmentDTO): Promise<Enrollment> {
    // Check if already enrolled
    const existing = await this.findByUserAndCourse(data.userId, data.courseId);
    if (existing) {
      throw new ConflictError('User is already enrolled in this course');
    }

    return this.create(data);
  }

  async updateProgress(
    userId: string,
    courseId: string,
    progress: number
  ): Promise<Enrollment> {
    const enrollment = await this.findByUserAndCourse(userId, courseId);
    if (!enrollment) {
      throw new ConflictError('Enrollment not found');
    }

    return this.prisma.enrollment.update({
      where: { id: enrollment.id },
      data: {
        progress,
        ...(progress >= 100 && { completedAt: new Date() }),
      },
    });
  }

  protected buildWhereClause(
    search?: string,
    filters?: Record<string, any>
  ): Prisma.EnrollmentWhereInput {
    const where: Prisma.EnrollmentWhereInput = {};

    if (filters) {
      if (filters.userId) where.userId = filters.userId;
      if (filters.courseId) where.courseId = filters.courseId;
      if (filters.status) where.status = filters.status;
    }

    return where;
  }
}
