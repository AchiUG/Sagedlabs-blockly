
/**
 * Enrollment Service Interface
 */

import { Enrollment } from '@prisma/client';

export interface EnrollmentDTO {
  id: string;
  userId: string;
  courseId: string;
  status: string;
  progress: number;
  enrolledAt: Date;
  completedAt?: Date;
}

export interface EnrollCourseInput {
  userId: string;
  courseId: string;
}

export interface IEnrollmentService {
  enrollUser(input: EnrollCourseInput): Promise<EnrollmentDTO>;
  getUserEnrollments(userId: string): Promise<any[]>;
  getCourseEnrollments(courseId: string): Promise<any[]>;
  getEnrollmentStatus(userId: string, courseId: string): Promise<EnrollmentDTO | null>;
  updateProgress(userId: string, courseId: string, progress: number): Promise<EnrollmentDTO>;
  completeCourse(userId: string, courseId: string): Promise<EnrollmentDTO>;
  canUserAccessCourse(userId: string, courseId: string): Promise<boolean>;
}
