
/**
 * Token Service
 * Manages $SAGED token minting and conversion
 * 1 verified SVU = 1 potential $SAGED token
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface MintTokenInput {
  userId: string;
  activityId: string;
  amount: number;
  sourceType: 'ACADEMIC' | 'TECHNICAL' | 'VOLUNTEER' | 'CULTURAL' | 'ROUTINE';
}

export class TokenService {
  /**
   * Get token conversion eligibility rate based on activity type
   */
  static getConversionEligibility(sourceType: string): number {
    const eligibilityMap: Record<string, number> = {
      ACADEMIC: 100,      // LMS-verified → 100%
      TECHNICAL: 100,     // Auto + Peer → 100%
      VOLUNTEER: 65,      // NGO verified → 50-80%, avg 65%
      CULTURAL: 90,       // AI + Peer → 80-100%, avg 90%
      ROUTINE: 20         // Auto → 0-40%, avg 20%
    };

    return eligibilityMap[sourceType] || 50;
  }

  /**
   * Mint $SAGED tokens from verified SVUs
   */
  static async mintTokens(input: MintTokenInput) {
    // 1. Verify the activity is verified
    const activity = await prisma.activity.findUnique({
      where: { id: input.activityId },
      include: {
        contributions: true
      }
    });

    if (!activity) {
      throw new Error('Activity not found');
    }

    if (activity.status !== 'VERIFIED') {
      throw new Error('Only verified activities can mint tokens');
    }

    // 2. Get eligibility percentage
    const eligibilityPercent = this.getConversionEligibility(input.sourceType);

    // 3. Calculate mintable tokens
    const eligibleAmount = (input.amount * eligibilityPercent) / 100;

    // 4. Create token record
    const token = await prisma.sAGEDToken.create({
      data: {
        userId: input.userId,
        amount: eligibleAmount,
        sourceType: input.sourceType,
        sourceActivityId: input.activityId,
        conversionRate: 1.0, // 1 verified SVU = 1 token
        eligibilityPercent
      }
    });

    // 5. Update user's verified SVU balance
    await prisma.sVUBalance.update({
      where: { userId: input.userId },
      data: {
        verifiedSVU: { increment: eligibleAmount }
      }
    });

    return token;
  }

  /**
   * Get user's token balance
   */
  static async getUserTokenBalance(userId: string) {
    const tokens = await prisma.sAGEDToken.findMany({
      where: { userId }
    });

    const totalTokens = tokens.reduce((sum, t) => sum + t.amount, 0);

    // Get balance by source type
    const bySourceType = tokens.reduce((acc, t) => {
      const type = t.sourceType;
      if (!acc[type]) {
        acc[type] = 0;
      }
      acc[type] += t.amount;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalTokens,
      bySourceType,
      tokenHistory: tokens.slice(-10) // Recent 10
    };
  }

  /**
   * Get token statistics
   */
  static async getTokenStats(userId: string) {
    const [balance, tokens] = await Promise.all([
      prisma.sVUBalance.findUnique({
        where: { userId }
      }),
      prisma.sAGEDToken.findMany({
        where: { userId }
      })
    ]);

    const totalMinted = tokens.reduce((sum, t) => sum + t.amount, 0);
    const verifiedSVU = balance?.verifiedSVU || 0;
    const pendingConversion = verifiedSVU - totalMinted;

    return {
      totalMinted,
      verifiedSVU,
      pendingConversion: Math.max(0, pendingConversion),
      canMintMore: pendingConversion > 0
    };
  }

  /**
   * Get token pool distribution (70% Education, 30% Impact)
   */
  static async getTokenPoolDistribution(userId: string) {
    const tokens = await prisma.sAGEDToken.findMany({
      where: { userId }
    });

    let educationPool = 0; // ACADEMIC + TECHNICAL
    let impactPool = 0;    // VOLUNTEER + CULTURAL + ROUTINE

    tokens.forEach((t) => {
      if (t.sourceType === 'ACADEMIC' || t.sourceType === 'TECHNICAL') {
        educationPool += t.amount;
      } else {
        impactPool += t.amount;
      }
    });

    const total = educationPool + impactPool;

    return {
      educationPool,
      impactPool,
      total,
      educationPercent: total > 0 ? (educationPool / total) * 100 : 0,
      impactPercent: total > 0 ? (impactPool / total) * 100 : 0
    };
  }

  /**
   * Auto-mint tokens for newly verified activities
   */
  static async autoMintForVerifiedActivity(activityId: string) {
    const activity = await prisma.activity.findUnique({
      where: { id: activityId },
      include: {
        contributions: true,
        category: true
      }
    });

    if (!activity || activity.status !== 'VERIFIED') {
      return null;
    }

    // Determine source type based on activity type
    let sourceType: MintTokenInput['sourceType'] = 'ROUTINE';
    
    if (activity.activityType === 'TEACHING' || activity.activityType === 'MENTORING') {
      sourceType = 'ACADEMIC';
    } else if (activity.activityType === 'TECHNICAL_BUILD' || activity.activityType === 'BUILDING') {
      sourceType = 'TECHNICAL';
    } else if (
      activity.activityType === 'COMMUNITY_SERVICE' ||
      activity.activityType === 'FAITH_SERVICE' ||
      activity.activityType === 'NGO_PROJECT'
    ) {
      sourceType = 'VOLUNTEER';
    } else if (
      activity.activityType === 'STORYTELLING' ||
      activity.activityType === 'CULTURAL_PRESERVATION'
    ) {
      sourceType = 'CULTURAL';
    }

    const svuEarned = activity.contributions[0]?.svuEarned || 0;

    return this.mintTokens({
      userId: activity.userId,
      activityId: activity.id,
      amount: svuEarned,
      sourceType
    });
  }
}
