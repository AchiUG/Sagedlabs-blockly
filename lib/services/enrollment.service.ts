
/**
 * Enrollment Service - Business logic for course enrollments
 */

import { EnrollmentRepository } from '../repositories/enrollment.repository';
import { CourseRepository } from '../repositories/course.repository';
import {
  IEnrollmentService,
  EnrollmentDTO,
  EnrollCourseInput,
} from './interfaces/enrollment.service.interface';
import { NotFoundError, BusinessRuleError } from '../core/errors/app-error';

export class EnrollmentService implements IEnrollmentService {
  constructor(
    private readonly enrollmentRepository: EnrollmentRepository,
    private readonly courseRepository: CourseRepository
  ) {}

  async enrollUser(input: EnrollCourseInput): Promise<EnrollmentDTO> {
    const { userId, courseId } = input;

    // Validate course exists and is published
    const course = await this.courseRepository.findById(courseId);
    if (!course) {
      throw new NotFoundError('Course');
    }

    if (!course.isPublished) {
      throw new BusinessRuleError('Course is not available for enrollment');
    }

    // Create enrollment (repository will check for duplicates)
    const enrollment = await this.enrollmentRepository.createEnrollment({
      userId,
      courseId,
      status: 'ACTIVE',
    });

    return this.mapToDTO(enrollment);
  }

  async getUserEnrollments(userId: string): Promise<any[]> {
    return this.enrollmentRepository.findByUser(userId);
  }

  async getCourseEnrollments(courseId: string): Promise<any[]> {
    return this.enrollmentRepository.findByCourse(courseId);
  }

  async getEnrollmentStatus(
    userId: string,
    courseId: string
  ): Promise<EnrollmentDTO | null> {
    const enrollment = await this.enrollmentRepository.findByUserAndCourse(
      userId,
      courseId
    );
    return enrollment ? this.mapToDTO(enrollment) : null;
  }

  async updateProgress(
    userId: string,
    courseId: string,
    progress: number
  ): Promise<EnrollmentDTO> {
    // Validate progress value
    if (progress < 0 || progress > 100) {
      throw new BusinessRuleError('Progress must be between 0 and 100');
    }

    const enrollment = await this.enrollmentRepository.updateProgress(
      userId,
      courseId,
      progress
    );

    return this.mapToDTO(enrollment);
  }

  async completeCourse(userId: string, courseId: string): Promise<EnrollmentDTO> {
    return this.updateProgress(userId, courseId, 100);
  }

  async canUserAccessCourse(userId: string, courseId: string): Promise<boolean> {
    const enrollment = await this.enrollmentRepository.findByUserAndCourse(
      userId,
      courseId
    );

    return enrollment !== null && enrollment.status === 'ACTIVE';
  }

  private mapToDTO(enrollment: any): EnrollmentDTO {
    return {
      id: enrollment.id,
      userId: enrollment.userId,
      courseId: enrollment.courseId,
      status: enrollment.status,
      progress: enrollment.progress || 0,
      enrolledAt: enrollment.enrolledAt,
      completedAt: enrollment.completedAt,
    };
  }
}
