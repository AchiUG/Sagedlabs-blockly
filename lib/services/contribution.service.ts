
/**
 * Contribution Service
 * Manages user activities and SVU contributions
 */

import { PrismaClient } from '@prisma/client';
import { SVUCalculationService } from './svu-calculation.service';

const prisma = new PrismaClient();

export interface CreateActivityInput {
  userId: string;
  categoryId: string;
  pillarId: string;
  title: string;
  description: string;
  activityType: string;
  hoursSpent: number;
  reach?: number;
  evidence?: string;
  metadata?: Record<string, any>;
}

export class ContributionService {
  /**
   * Log a new activity and calculate initial SVU
   */
  static async logActivity(input: CreateActivityInput) {
    // 1. Create the activity
    const activity = await prisma.activity.create({
      data: {
        userId: input.userId,
        categoryId: input.categoryId,
        pillarId: input.pillarId,
        title: input.title,
        description: input.description,
        activityType: input.activityType as any,
        hoursSpent: input.hoursSpent,
        reach: input.reach,
        evidence: input.evidence,
        metadata: input.metadata ? JSON.stringify(input.metadata) : null,
        status: 'PENDING' // Starts as pending, awaiting verification
      },
      include: {
        pillar: true,
        category: true
      }
    });

    // 2. Get user's primary learning path
    const userPath = await prisma.userLearningPath.findFirst({
      where: {
        userId: input.userId,
        isPrimary: true
      },
      include: { path: true }
    });

    // 3. Calculate SVU (self-reported, so VM = 0.8)
    const svuResult = await SVUCalculationService.calculateSVU({
      activityId: activity.id,
      hoursSpent: input.hoursSpent,
      reach: input.reach,
      pillarCode: activity.pillar.code,
      userLearningPath: userPath?.path.code,
      isVerified: false, // Self-reported initially
      evidenceQuality: input.evidence ? 'high' : 'medium'
    });

    // 4. Create contribution record
    const contribution = await prisma.contribution.create({
      data: {
        activityId: activity.id,
        userId: input.userId,
        basePoints: svuResult.basePoints,
        irreplaceabilityMultiplier: svuResult.irreplaceabilityMultiplier,
        impactMultiplier: svuResult.impactMultiplier,
        pathWeightMultiplier: svuResult.pathWeightMultiplier,
        verificationMultiplier: svuResult.verificationMultiplier,
        svuEarned: svuResult.svuEarned
      }
    });

    // 5. Update user's SVU balance
    await this.updateSVUBalance(input.userId, svuResult.svuEarned);

    return {
      activity,
      contribution,
      svuResult
    };
  }

  /**
   * Update user's SVU balance
   */
  static async updateSVUBalance(userId: string, svuToAdd: number) {
    const balance = await prisma.sVUBalance.upsert({
      where: { userId },
      update: {
        totalSVU: { increment: svuToAdd },
        availableSVU: { increment: svuToAdd },
        lifetimeSVU: { increment: svuToAdd },
        lastUpdated: new Date()
      },
      create: {
        userId,
        totalSVU: svuToAdd,
        availableSVU: svuToAdd,
        verifiedSVU: 0,
        usedSVU: 0,
        lifetimeSVU: svuToAdd
      }
    });

    return balance;
  }

  /**
   * Get user's SVU balance
   */
  static async getUserBalance(userId: string) {
    const balance = await prisma.sVUBalance.findUnique({
      where: { userId }
    });

    if (!balance) {
      // Create initial balance
      return prisma.sVUBalance.create({
        data: {
          userId,
          totalSVU: 0,
          availableSVU: 0,
          verifiedSVU: 0,
          usedSVU: 0,
          lifetimeSVU: 0
        }
      });
    }

    return balance;
  }

  /**
   * Get user's activity history with SVU breakdown
   */
  static async getUserActivities(
    userId: string,
    options?: {
      status?: string;
      pillarCode?: string;
      limit?: number;
      offset?: number;
    }
  ) {
    const where: any = { userId };
    
    if (options?.status) {
      where.status = options.status;
    }
    
    if (options?.pillarCode) {
      where.pillar = { code: options.pillarCode };
    }

    const [activities, total] = await Promise.all([
      prisma.activity.findMany({
        where,
        include: {
          pillar: true,
          category: true,
          contributions: true,
          verifications: {
            orderBy: { submittedAt: 'desc' },
            take: 1
          }
        },
        orderBy: { createdAt: 'desc' },
        take: options?.limit || 10,
        skip: options?.offset || 0
      }),
      prisma.activity.count({ where })
    ]);

    return {
      activities,
      total,
      hasMore: (options?.offset || 0) + activities.length < total
    };
  }

  /**
   * Get SVU statistics by pillar
   */
  static async getSVUStatsByPillar(userId: string) {
    const contributions = await prisma.contribution.findMany({
      where: { userId },
      include: {
        activity: {
          include: { pillar: true }
        }
      }
    });

    const statsByPillar = contributions.reduce((acc, contrib) => {
      const pillarCode = contrib.activity.pillar.code;
      if (!acc[pillarCode]) {
        acc[pillarCode] = {
          pillarCode,
          pillarName: contrib.activity.pillar.name,
          totalSVU: 0,
          activityCount: 0
        };
      }
      acc[pillarCode].totalSVU += contrib.svuEarned;
      acc[pillarCode].activityCount += 1;
      return acc;
    }, {} as Record<string, any>);

    return Object.values(statsByPillar);
  }

  /**
   * Get activity categories with their details
   */
  static async getActivityCategories() {
    return prisma.activityCategory.findMany({
      orderBy: { name: 'asc' }
    });
  }

  /**
   * Get all pillars
   */
  static async getPillars() {
    return prisma.pillar.findMany({
      orderBy: { orderIndex: 'asc' }
    });
  }

  /**
   * Delete an activity (before verification)
   */
  static async deleteActivity(activityId: string, userId: string) {
    const activity = await prisma.activity.findUnique({
      where: { id: activityId },
      include: { contributions: true }
    });

    if (!activity || activity.userId !== userId) {
      throw new Error('Activity not found or unauthorized');
    }

    if (activity.status !== 'PENDING') {
      throw new Error('Cannot delete verified or in-review activities');
    }

    // Deduct SVU from balance
    if (activity.contributions.length > 0) {
      const svuToDeduct = activity.contributions[0].svuEarned;
      await prisma.sVUBalance.update({
        where: { userId },
        data: {
          totalSVU: { decrement: svuToDeduct },
          availableSVU: { decrement: svuToDeduct },
          lifetimeSVU: { decrement: svuToDeduct }
        }
      });
    }

    // Delete activity (cascade will delete contributions)
    await prisma.activity.delete({
      where: { id: activityId }
    });

    return { success: true };
  }
}
