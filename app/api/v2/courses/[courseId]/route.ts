
/**
 * Single Course API Route (v2)
 */

export const dynamic = 'force-dynamic';

import { NextRequest } from 'next/server';
import { getCourseService } from '@/lib/di/container';
import { ResponseBuilder } from '@/lib/core/utils/response-builder';
import { asyncHandler } from '@/lib/middleware/error-handler';
import { requireAuth, requireRole } from '@/lib/middleware/auth-middleware';
import { NotFoundError } from '@/lib/core/errors/app-error';

// GET /api/v2/courses/:courseId - Get course details
// Note: Detailed curriculum (modules/lessons) only returned to authenticated users
export const GET = asyncHandler(async (
  request: NextRequest,
  context: { params: Promise<{ courseId: string }> }
) => {
  const { courseId } = await context.params;
  const courseService = getCourseService();
  
  // Check if user is authenticated (optional - doesn't throw if not authenticated)
  let authContext = null;
  try {
    authContext = await requireAuth();
  } catch (e) {
    // User not authenticated - will return limited course data
  }
  
  const course = await courseService.getCourseWithDetails(courseId);
  
  if (!course) {
    throw new NotFoundError('Course');
  }

  // If user is not authenticated, remove detailed curriculum data
  if (!authContext) {
    return ResponseBuilder.success({
      ...course,
      modules: course.modules?.slice(0, 3).map((module: any) => ({
        id: module.id,
        title: module.title,
        description: module.description,
        orderIndex: module.orderIndex,
        lessonCount: module.lessons?.length || 0,
        assignmentCount: module.assignments?.length || 0
      }))
    });
  }

  return ResponseBuilder.success(course);
});

// PATCH /api/v2/courses/:courseId - Update course
export const PATCH = asyncHandler(async (
  request: NextRequest,
  context: { params: Promise<{ courseId: string }> }
) => {
  const { courseId } = await context.params;
  const authContext = await requireRole(['INSTRUCTOR', 'ADMIN']);
  
  const body = await request.json();
  const courseService = getCourseService();

  // Verify ownership for instructors
  if (authContext.role === 'INSTRUCTOR') {
    const course = await courseService.getCourseById(courseId);
    if (course?.instructorId !== authContext.userId) {
      throw new NotFoundError('Course');
    }
  }

  const updatedCourse = await courseService.updateCourse(courseId, body);

  return ResponseBuilder.success(updatedCourse);
});

// DELETE /api/v2/courses/:courseId - Delete course
export const DELETE = asyncHandler(async (
  request: NextRequest,
  context: { params: Promise<{ courseId: string }> }
) => {
  const { courseId } = await context.params;
  const authContext = await requireRole(['INSTRUCTOR', 'ADMIN']);
  
  const courseService = getCourseService();

  // Verify ownership for instructors
  if (authContext.role === 'INSTRUCTOR') {
    const course = await courseService.getCourseById(courseId);
    if (course?.instructorId !== authContext.userId) {
      throw new NotFoundError('Course');
    }
  }

  await courseService.deleteCourse(courseId);

  return ResponseBuilder.noContent();
});
