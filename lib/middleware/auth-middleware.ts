
/**
 * Authentication Middleware
 * Validates user authentication and extracts user context
 */

import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-config';
import { UnauthorizedError } from '../core/errors/app-error';

export interface AuthContext {
  userId: string;
  email: string;
  role: string;
}

export async function requireAuth(request?: NextRequest): Promise<AuthContext> {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    throw new UnauthorizedError('Authentication required');
  }

  const user = session.user as any;

  return {
    userId: user.id,
    email: user.email,
    role: user.role || 'STUDENT',
  };
}

export async function requireRole(
  role: string | string[],
  request?: NextRequest
): Promise<AuthContext> {
  const context = await requireAuth(request);

  const allowedRoles = Array.isArray(role) ? role : [role];

  if (!allowedRoles.includes(context.role)) {
    throw new UnauthorizedError(`Required role: ${allowedRoles.join(' or ')}`);
  }

  return context;
}
