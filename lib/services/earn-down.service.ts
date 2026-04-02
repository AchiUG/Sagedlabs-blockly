
/**
 * Earn-Down Service
 * Manages course fee reduction using SVUs
 * Formula: Remaining = Price – (SVUs × Rate)
 * Max 70% of price payable via SVUs
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface ApplyEarnDownInput {
  userId: string;
  courseId: string;
  svuToApply: number;
}

export interface EarnDownCalculation {
  originalPrice: number;
  svuApplied: number;
  conversionRate: number; // ₦100 per SVU
  discountAmount: number;
  maxDiscountAllowed: number;
  finalPrice: number;
  savingsPercent: number;
  canApply: boolean;
  reason?: string;
}

export class EarnDownService {
  static readonly CONVERSION_RATE = 100; // 1 SVU = ₦100
  static readonly MAX_DISCOUNT_PERCENT = 70; // Max 70% via SVUs

  /**
   * Calculate earn-down discount for a course
   */
  static async calculateEarnDown(
    userId: string,
    courseId: string,
    svuToApply: number
  ): Promise<EarnDownCalculation> {
    // 1. Get course price
    const course = await prisma.course.findUnique({
      where: { id: courseId }
    });

    if (!course) {
      throw new Error('Course not found');
    }

    const originalPrice = course.price;

    // 2. Get user's available SVU balance
    const balance = await prisma.sVUBalance.findUnique({
      where: { userId }
    });

    if (!balance || balance.availableSVU < svuToApply) {
      return {
        originalPrice,
        svuApplied: 0,
        conversionRate: this.CONVERSION_RATE,
        discountAmount: 0,
        maxDiscountAllowed: originalPrice * (this.MAX_DISCOUNT_PERCENT / 100),
        finalPrice: originalPrice,
        savingsPercent: 0,
        canApply: false,
        reason: 'Insufficient SVU balance'
      };
    }

    // 3. Calculate discount amount
    const discountAmount = svuToApply * this.CONVERSION_RATE;

    // 4. Check max discount limit (70% of price)
    const maxDiscountAllowed = originalPrice * (this.MAX_DISCOUNT_PERCENT / 100);
    const actualDiscount = Math.min(discountAmount, maxDiscountAllowed);

    // 5. Calculate final price
    const finalPrice = Math.max(0, originalPrice - actualDiscount);

    // 6. Calculate savings percent
    const savingsPercent = (actualDiscount / originalPrice) * 100;

    return {
      originalPrice: originalPrice,
      svuApplied: svuToApply,
      conversionRate: this.CONVERSION_RATE,
      discountAmount: actualDiscount,
      maxDiscountAllowed: maxDiscountAllowed,
      finalPrice: finalPrice,
      savingsPercent: savingsPercent,
      canApply: true
    };
  }

  /**
   * Apply earn-down to a course enrollment
   */
  static async applyEarnDown(input: ApplyEarnDownInput) {
    const calculation = await this.calculateEarnDown(
      input.userId,
      input.courseId,
      input.svuToApply
    );

    if (!calculation.canApply) {
      throw new Error(calculation.reason || 'Cannot apply earn-down');
    }

    // 1. Create earn-down record
    const earnDownRecord = await prisma.earnDownRecord.create({
      data: {
        userId: input.userId,
        courseId: input.courseId,
        originalPrice: calculation.originalPrice,
        svuApplied: input.svuToApply,
        conversionRate: this.CONVERSION_RATE,
        discountAmount: calculation.discountAmount,
        finalPrice: calculation.finalPrice,
        maxDiscountPercent: this.MAX_DISCOUNT_PERCENT,
        expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // 90 days from now
      }
    });

    // 2. Update user's SVU balance (move from available to used)
    await prisma.sVUBalance.update({
      where: { userId: input.userId },
      data: {
        availableSVU: { decrement: input.svuToApply },
        usedSVU: { increment: input.svuToApply },
        lastUpdated: new Date()
      }
    });

    return {
      earnDownRecord,
      calculation
    };
  }

  /**
   * Get earn-down records for a user
   */
  static async getUserEarnDowns(userId: string) {
    return prisma.earnDownRecord.findMany({
      where: { userId },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            imageUrl: true
          }
        }
      },
      orderBy: { appliedAt: 'desc' }
    });
  }

  /**
   * Get maximum SVU that can be applied to a course
   */
  static async getMaxApplicableSVU(userId: string, courseId: string) {
    const course = await prisma.course.findUnique({
      where: { id: courseId }
    });

    if (!course) {
      throw new Error('Course not found');
    }

    const balance = await prisma.sVUBalance.findUnique({
      where: { userId }
    });

    if (!balance) {
      return 0;
    }

    // Max discount is 70% of course price
    const maxDiscountAmount = course.price * (this.MAX_DISCOUNT_PERCENT / 100);
    
    // Convert to SVU
    const maxSVUByPrice = Math.floor(maxDiscountAmount / this.CONVERSION_RATE);
    
    // User can't apply more than they have
    return Math.min(maxSVUByPrice, balance.availableSVU);
  }

  /**
   * Check if user has an active earn-down for a course
   */
  static async hasActiveEarnDown(userId: string, courseId: string) {
    const record = await prisma.earnDownRecord.findFirst({
      where: {
        userId,
        courseId,
        expiresAt: { gte: new Date() }
      }
    });

    return !!record;
  }

  /**
   * Get earn-down summary for dashboard
   */
  static async getEarnDownSummary(userId: string) {
    const records = await this.getUserEarnDowns(userId);
    
    const totalSVUUsed = records.reduce((sum, r) => sum + r.svuApplied, 0);
    const totalSavings = records.reduce((sum, r) => sum + r.discountAmount, 0);
    const coursesDiscounted = records.length;

    return {
      totalSVUUsed: totalSVUUsed,
      totalSavings: totalSavings,
      coursesDiscounted: coursesDiscounted,
      records: records.slice(0, 5) // Recent 5
    };
  }
}
