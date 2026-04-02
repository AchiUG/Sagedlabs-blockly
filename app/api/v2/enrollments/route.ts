
/**
 * Enrollments API Route (v2)
 */

export const dynamic = 'force-dynamic';

import { NextRequest } from 'next/server';
import { getEnrollmentService } from '@/lib/di/container';
import { ResponseBuilder } from '@/lib/core/utils/response-builder';
import { asyncHandler } from '@/lib/middleware/error-handler';
import { requireAuth } from '@/lib/middleware/auth-middleware';

// GET /api/v2/enrollments - Get user's enrollments
export const GET = asyncHandler(async (request: NextRequest) => {
  const authContext = await requireAuth();
  
  const enrollmentService = getEnrollmentService();
  const enrollments = await enrollmentService.getUserEnrollments(authContext.userId);

  return ResponseBuilder.success(enrollments);
});

// POST /api/v2/enrollments - Enroll in a course
export const POST = asyncHandler(async (request: NextRequest) => {
  const authContext = await requireAuth();
  
  const { courseId } = await request.json();
  
  const enrollmentService = getEnrollmentService();
  const enrollment = await enrollmentService.enrollUser({
    userId: authContext.userId,
    courseId,
  });

  return ResponseBuilder.created(enrollment);
});
