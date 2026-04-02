
/**
 * User API Route (v2)
 */

export const dynamic = 'force-dynamic';

import { NextRequest } from 'next/server';
import { getUserService } from '@/lib/di/container';
import { ResponseBuilder } from '@/lib/core/utils/response-builder';
import { asyncHandler } from '@/lib/middleware/error-handler';
import { requireAuth, requireRole } from '@/lib/middleware/auth-middleware';
import { ForbiddenError, NotFoundError } from '@/lib/core/errors/app-error';

// GET /api/v2/users/:userId - Get user profile
export const GET = asyncHandler(async (
  request: NextRequest,
  { params }: { params: { userId: string } }
) => {
  const authContext = await requireAuth();
  
  // Users can only view their own profile unless admin
  if (authContext.userId !== params.userId && authContext.role !== 'ADMIN') {
    throw new ForbiddenError('Cannot access other user profiles');
  }

  const userService = getUserService();
  const user = await userService.getUserWithProfile(params.userId);

  if (!user) {
    throw new NotFoundError('User');
  }

  return ResponseBuilder.success(user);
});

// PATCH /api/v2/users/:userId - Update user profile
export const PATCH = asyncHandler(async (
  request: NextRequest,
  { params }: { params: { userId: string } }
) => {
  const authContext = await requireAuth();
  
  // Users can only update their own profile unless admin
  if (authContext.userId !== params.userId && authContext.role !== 'ADMIN') {
    throw new ForbiddenError('Cannot update other user profiles');
  }

  const body = await request.json();
  const userService = getUserService();
  
  const updatedUser = await userService.updateUser(params.userId, body);

  return ResponseBuilder.success(updatedUser);
});
