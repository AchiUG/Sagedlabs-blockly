
/**
 * Courses API Route (v2) - Refactored with new architecture
 * Demonstrates: Service layer, DI, error handling, standardized responses
 */

export const dynamic = 'force-dynamic';

import { NextRequest } from 'next/server';
import { getCourseService } from '@/lib/di/container';
import { ResponseBuilder } from '@/lib/core/utils/response-builder';
import { asyncHandler } from '@/lib/middleware/error-handler';
import { requireAuth, requireRole } from '@/lib/middleware/auth-middleware';

// GET /api/v2/courses - List all courses with filtering
export const GET = asyncHandler(async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;
  
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const search = searchParams.get('search') || undefined;
  const isPublished = searchParams.get('published') === 'true' ? true : undefined;
  const level = searchParams.get('level') || undefined;

  const courseService = getCourseService();

  const result = await courseService.getAllCourses({
    page,
    limit,
    search,
    isPublished,
    level,
  });

  return ResponseBuilder.paginated(
    result.items,
    result.pagination.total,
    result.pagination.page,
    result.pagination.limit
  );
});

// POST /api/v2/courses - Create new course (instructor or admin only)
export const POST = asyncHandler(async (request: NextRequest) => {
  const authContext = await requireRole(['INSTRUCTOR', 'ADMIN']);
  
  const body = await request.json();
  
  const courseService = getCourseService();
  
  const course = await courseService.createCourse({
    ...body,
    instructorId: authContext.userId,
  });

  return ResponseBuilder.created(course);
});
