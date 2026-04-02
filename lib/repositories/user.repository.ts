
/**
 * User Repository - Data access layer for users
 */

import { User, Prisma } from '@prisma/client';
import { BaseRepository } from './base.repository';
import { PrismaClient } from '@prisma/client';
import { NotFoundError } from '../core/errors/app-error';

export interface CreateUserDTO {
  email: string;
  name?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  archetype?: string;
  subscriptionTier?: string;
}

export interface UpdateUserDTO {
  name?: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  institution?: string;
  archetype?: string;
  subscriptionTier?: string;
  subscriptionStatus?: string;
  onboardingCompleted?: boolean;
  walletAddress?: string;
  walletEnabled?: boolean;
}

export class UserRepository extends BaseRepository<
  User,
  CreateUserDTO,
  UpdateUserDTO
> {
  constructor(prisma: PrismaClient) {
    super(prisma, 'user');
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findByIdWithProfile(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        gamification: true,
        _count: {
          select: {
            enrollments: true,
            certificates: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundError('User');
    }

    return user;
  }

  async findByArchetype(archetype: string) {
    return this.prisma.user.findMany({
      where: { archetype },
    });
  }

  async updateArchetype(userId: string, archetype: string, secondary?: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        archetype,
        archetypeSecondary: secondary,
      },
    });
  }

  async updateSubscription(
    userId: string,
    tier: string,
    status: string,
    startDate?: Date,
    endDate?: Date
  ) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        subscriptionTier: tier,
        subscriptionStatus: status,
        subscriptionStartDate: startDate,
        subscriptionEndDate: endDate,
      },
    });
  }

  protected buildWhereClause(
    search?: string,
    filters?: Record<string, any>
  ): Prisma.UserWhereInput {
    const where: Prisma.UserWhereInput = {};

    if (filters) {
      if (filters.role) where.role = filters.role;
      if (filters.archetype) where.archetype = filters.archetype;
      if (filters.subscriptionTier) where.subscriptionTier = filters.subscriptionTier;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    return where;
  }
}
