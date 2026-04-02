
/**
 * Course Service - Business logic for course management
 * Implements service layer with dependency injection ready architecture
 */

import { CourseRepository, CreateCourseDTO, UpdateCourseDTO } from '../repositories/course.repository';
import { EnrollmentRepository } from '../repositories/enrollment.repository';
import {
  ICourseService,
  CourseDTO,
  CreateCourseInput,
  UpdateCourseInput,
  CourseFilterOptions,
} from './interfaces/course.service.interface';
import { PaginationParams, PaginatedResult } from '../core/types/common.types';
import { NotFoundError, BusinessRuleError } from '../core/errors/app-error';

export class CourseService implements ICourseService {
  constructor(
    private readonly courseRepository: CourseRepository,
    private readonly enrollmentRepository: EnrollmentRepository
  ) {}

  async getCourseById(id: string): Promise<CourseDTO | null> {
    const course = await this.courseRepository.findById(id);
    return course ? this.mapToDTO(course) : null;
  }

  async getCourseWithDetails(id: string): Promise<any> {
    const course = await this.courseRepository.findByIdWithDetails(id);
    if (!course) {
      throw new NotFoundError('Course');
    }
    return course;
  }

  async getAllCourses(
    params: PaginationParams & CourseFilterOptions
  ): Promise<PaginatedResult<CourseDTO>> {
    const { search, instructorId, categoryId, level, isPublished, ...paginationParams } = params;

    const result = await this.courseRepository.findAll({
      ...paginationParams,
      search,
      filters: {
        instructorId,
        categoryId,
        level,
        isPublished,
      },
    });

    return {
      ...result,
      items: result.items.map(this.mapToDTO),
    };
  }

  async getPublishedCourses(
    params: PaginationParams
  ): Promise<PaginatedResult<CourseDTO>> {
    const result = await this.courseRepository.findPublished(params);
    return {
      ...result,
      items: result.items.map(this.mapToDTO),
    };
  }

  async getCoursesByInstructor(
    instructorId: string,
    params: PaginationParams
  ): Promise<PaginatedResult<CourseDTO>> {
    const result = await this.courseRepository.findByInstructor(instructorId, params);
    return {
      ...result,
      items: result.items.map(this.mapToDTO),
    };
  }

  async createCourse(data: CreateCourseInput): Promise<CourseDTO> {
    const createDTO: CreateCourseDTO = {
      ...data,
      isPublished: false,
    };

    const course = await this.courseRepository.create(createDTO);
    return this.mapToDTO(course);
  }

  async updateCourse(id: string, data: UpdateCourseInput): Promise<CourseDTO> {
    const updateDTO: UpdateCourseDTO = data;
    const course = await this.courseRepository.update(id, updateDTO);
    return this.mapToDTO(course);
  }

  async publishCourse(id: string): Promise<CourseDTO> {
    // Business rule: Course must have at least one module to be published
    const courseWithDetails = await this.courseRepository.findByIdWithDetails(id);
    if (!courseWithDetails) {
      throw new NotFoundError('Course');
    }

    // Uncomment this rule if you want to enforce modules before publishing
    // if (!courseWithDetails.modules || courseWithDetails.modules.length === 0) {
    //   throw new BusinessRuleError('Course must have at least one module before publishing');
    // }

    const course = await this.courseRepository.update(id, { isPublished: true });
    return this.mapToDTO(course);
  }

  async unpublishCourse(id: string): Promise<CourseDTO> {
    const course = await this.courseRepository.update(id, { isPublished: false });
    return this.mapToDTO(course);
  }

  async deleteCourse(id: string): Promise<void> {
    // Business rule: Cannot delete course with active enrollments
    const enrollmentCount = await this.courseRepository.countEnrollments(id);
    if (enrollmentCount > 0) {
      throw new BusinessRuleError('Cannot delete course with active enrollments');
    }

    await this.courseRepository.delete(id);
  }

  async canUserEnroll(userId: string, courseId: string): Promise<boolean> {
    const course = await this.courseRepository.findById(courseId);
    if (!course || !course.isPublished) {
      return false;
    }

    const existingEnrollment = await this.enrollmentRepository.findByUserAndCourse(
      userId,
      courseId
    );

    return !existingEnrollment;
  }

  private mapToDTO(course: any): CourseDTO {
    return {
      id: course.id,
      title: course.title,
      description: course.description,
      instructorId: course.instructorId,
      categoryId: course.categoryId,
      level: course.level,
      duration: course.duration,
      imageUrl: course.imageUrl,
      isPublished: course.isPublished,
      createdAt: course.createdAt,
      updatedAt: course.updatedAt,
    };
  }
}
