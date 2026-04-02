
/**
 * User Service Interface
 */

import { User } from '@prisma/client';
import { PaginationParams, PaginatedResult } from '@/lib/core/types/common.types';

export interface UserDTO {
  id: string;
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  role: string;
  archetype?: string;
  subscriptionTier?: string;
  subscriptionStatus?: string;
  createdAt: Date;
}

export interface CreateUserInput {
  email: string;
  password?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
}

export interface UpdateUserInput {
  name?: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  institution?: string;
}

export interface IUserService {
  getUserById(id: string): Promise<UserDTO | null>;
  getUserByEmail(email: string): Promise<UserDTO | null>;
  getUserWithProfile(id: string): Promise<any>;
  getAllUsers(params: PaginationParams): Promise<PaginatedResult<UserDTO>>;
  createUser(data: CreateUserInput): Promise<UserDTO>;
  updateUser(id: string, data: UpdateUserInput): Promise<UserDTO>;
  deleteUser(id: string): Promise<void>;
  updateUserArchetype(userId: string, archetype: string, secondary?: string): Promise<UserDTO>;
  updateUserSubscription(userId: string, tier: string, status: string): Promise<UserDTO>;
}
