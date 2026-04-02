
/**
 * Dependency Injection Container
 * Central registry for service instances with lifecycle management
 */

import { PrismaClient } from '@prisma/client';
import { prisma } from '../db';

// Repositories
import { CourseRepository } from '../repositories/course.repository';
import { UserRepository } from '../repositories/user.repository';
import { EnrollmentRepository } from '../repositories/enrollment.repository';

// Services
import { CourseService } from '../services/course.service';
import { UserService } from '../services/user.service';
import { EnrollmentService } from '../services/enrollment.service';

/**
 * Service Container - Implements Singleton pattern for service instances
 * This allows for easy testing and service replacement (microservices migration)
 */
class ServiceContainer {
  private static instance: ServiceContainer;
  private services: Map<string, any> = new Map();

  private constructor() {
    this.registerServices();
  }

  static getInstance(): ServiceContainer {
    if (!ServiceContainer.instance) {
      ServiceContainer.instance = new ServiceContainer();
    }
    return ServiceContainer.instance;
  }

  private registerServices(): void {
    // Register Prisma Client
    this.register('PrismaClient', prisma);

    // Register Repositories
    this.register('CourseRepository', new CourseRepository(prisma));
    this.register('UserRepository', new UserRepository(prisma));
    this.register('EnrollmentRepository', new EnrollmentRepository(prisma));

    // Register Services
    this.register(
      'CourseService',
      new CourseService(
        this.get('CourseRepository'),
        this.get('EnrollmentRepository')
      )
    );

    this.register(
      'UserService',
      new UserService(this.get('UserRepository'))
    );

    this.register(
      'EnrollmentService',
      new EnrollmentService(
        this.get('EnrollmentRepository'),
        this.get('CourseRepository')
      )
    );
  }

  register<T>(key: string, instance: T): void {
    this.services.set(key, instance);
  }

  get<T>(key: string): T {
    const service = this.services.get(key);
    if (!service) {
      throw new Error(`Service ${key} not found in container`);
    }
    return service as T;
  }

  has(key: string): boolean {
    return this.services.has(key);
  }

  // For testing: allows replacing services with mocks
  replace<T>(key: string, instance: T): void {
    if (!this.has(key)) {
      throw new Error(`Cannot replace non-existent service: ${key}`);
    }
    this.services.set(key, instance);
  }

  // Clear all services (useful for testing)
  clear(): void {
    this.services.clear();
  }

  // Reset to initial state
  reset(): void {
    this.clear();
    this.registerServices();
  }
}

// Export singleton instance
export const container = ServiceContainer.getInstance();

// Helper functions for common service access
export const getService = <T>(key: string): T => container.get<T>(key);

export const getCourseService = () => container.get<CourseService>('CourseService');
export const getUserService = () => container.get<UserService>('UserService');
export const getEnrollmentService = () => container.get<EnrollmentService>('EnrollmentService');
