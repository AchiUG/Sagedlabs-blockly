
import { Course, User, Enrollment, Module, Lesson, Assignment, Progress, Certificate, UserRole, CourseLevel, EnrollmentStatus, AssignmentType } from '@prisma/client';

export type {
  Course,
  User,
  Enrollment,
  Module,
  Lesson,
  Assignment,
  Progress,
  Certificate,
  UserRole,
  CourseLevel,
  EnrollmentStatus,
  AssignmentType,
};

export interface CourseWithInstructor extends Course {
  instructor: User;
  modules?: ModuleWithLessons[];
  _count?: {
    enrollments: number;
  };
}

export interface ModuleWithLessons extends Module {
  lessons: Lesson[];
  assignments: Assignment[];
}

export interface EnrollmentWithCourse extends Enrollment {
  course: CourseWithInstructor;
}

export interface UserWithRole extends User {
  role: UserRole;
}

export interface LessonWithProgress extends Lesson {
  progress?: Progress[];
}

export interface CourseProgress {
  courseId: string;
  totalLessons: number;
  completedLessons: number;
  progressPercentage: number;
  timeSpent: number;
}

export interface DashboardStats {
  totalCourses: number;
  enrolledCourses: number;
  completedCourses: number;
  certificates: number;
  totalTimeSpent: number;
}

export interface InstructorStats {
  totalCourses: number;
  publishedCourses: number;
  totalStudents: number;
  averageRating: number;
  totalRevenue: number;
}

export interface AdminStats {
  totalUsers: number;
  totalCourses: number;
  totalEnrollments: number;
  activeUsers: number;
  revenue: number;
}
