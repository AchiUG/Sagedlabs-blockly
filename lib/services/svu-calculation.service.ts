
/**
 * SVU Calculation Service
 * Implements the SAGE-D scoring algorithm:
 * SVU = BasePoints × IM × XM × PWM × VM
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface SVUCalculationInput {
  activityId: string;
  hoursSpent: number;
  reach?: number;
  pillarCode: string;
  userLearningPath?: string; // 'educator' or 'technologist'
  isVerified: boolean;
  evidenceQuality?: 'low' | 'medium' | 'high';
}

export interface SVUCalculationResult {
  basePoints: number;
  irreplaceabilityMultiplier: number; // IM
  impactMultiplier: number; // XM
  pathWeightMultiplier: number; // PWM
  verificationMultiplier: number; // VM
  svuEarned: number;
  breakdown: string;
}

export class SVUCalculationService {
  /**
   * Calculate SVU for a given activity
   */
  static async calculateSVU(
    input: SVUCalculationInput
  ): Promise<SVUCalculationResult> {
    // 1. Base Points (10 per hour by default)
    const basePoints = input.hoursSpent * 10;

    // 2. Get Irreplaceability Multiplier (IM) from pillar
    const pillar = await prisma.pillar.findUnique({
      where: { code: input.pillarCode }
    });
    
    if (!pillar) {
      throw new Error(`Pillar not found: ${input.pillarCode}`);
    }
    
    const irreplaceabilityMultiplier = pillar.irreplaceabilityMultiplier;

    // 3. Calculate Impact Multiplier (XM) based on reach and evidence
    const impactMultiplier = this.calculateImpactMultiplier(
      input.reach,
      input.evidenceQuality
    );

    // 4. Get Path Weight Multiplier (PWM)
    let pathWeightMultiplier = 1.0;
    if (input.userLearningPath) {
      const learningPath = await prisma.learningPath.findUnique({
        where: { code: input.userLearningPath }
      });
      pathWeightMultiplier = learningPath?.pathWeightMultiplier || 1.0;
    }

    // 5. Verification Multiplier (VM)
    const verificationMultiplier = input.isVerified ? 1.0 : 0.8;

    // 6. Calculate final SVU
    const svuEarned =
      basePoints *
      irreplaceabilityMultiplier *
      impactMultiplier *
      pathWeightMultiplier *
      verificationMultiplier;

    // 7. Create breakdown explanation
    const breakdown = this.generateBreakdown({
      basePoints,
      irreplaceabilityMultiplier,
      impactMultiplier,
      pathWeightMultiplier,
      verificationMultiplier,
      svuEarned
    });

    return {
      basePoints,
      irreplaceabilityMultiplier,
      impactMultiplier,
      pathWeightMultiplier,
      verificationMultiplier,
      svuEarned,
      breakdown
    };
  }

  /**
   * Calculate Impact Multiplier (XM) - Range: 0.5 to 2.0
   * Based on reach and evidence quality
   */
  private static calculateImpactMultiplier(
    reach?: number,
    evidenceQuality?: 'low' | 'medium' | 'high'
  ): number {
    let xm = 1.0; // Default multiplier

    // Adjust based on reach (number of people impacted)
    if (reach) {
      if (reach < 5) xm = 0.8;
      else if (reach < 10) xm = 1.0;
      else if (reach < 50) xm = 1.3;
      else if (reach < 100) xm = 1.5;
      else if (reach < 500) xm = 1.7;
      else xm = 2.0;
    }

    // Adjust based on evidence quality
    if (evidenceQuality) {
      if (evidenceQuality === 'low') xm *= 0.9;
      else if (evidenceQuality === 'high') xm *= 1.1;
    }

    // Ensure within bounds
    return Math.max(0.5, Math.min(2.0, xm));
  }

  /**
   * Generate human-readable breakdown of calculation
   */
  private static generateBreakdown(data: {
    basePoints: number;
    irreplaceabilityMultiplier: number;
    impactMultiplier: number;
    pathWeightMultiplier: number;
    verificationMultiplier: number;
    svuEarned: number;
  }): string {
    return `
SVU Calculation Breakdown:
━━━━━━━━━━━━━━━━━━━━━━━
Base Points: ${data.basePoints.toFixed(2)}
× IM (Irreplaceability): ${data.irreplaceabilityMultiplier.toFixed(2)}
× XM (Impact): ${data.impactMultiplier.toFixed(2)}
× PWM (Path Weight): ${data.pathWeightMultiplier.toFixed(2)}
× VM (Verification): ${data.verificationMultiplier.toFixed(2)}
━━━━━━━━━━━━━━━━━━━━━━━
= ${data.svuEarned.toFixed(2)} SVUs
    `.trim();
  }

  /**
   * Recalculate SVU for an existing activity (e.g., after verification)
   */
  static async recalculateSVU(activityId: string): Promise<SVUCalculationResult> {
    const activity = await prisma.activity.findUnique({
      where: { id: activityId },
      include: {
        pillar: true,
        user: {
          include: {
            learningPaths: {
              where: { isPrimary: true },
              include: { path: true }
            }
          }
        }
      }
    });

    if (!activity) {
      throw new Error('Activity not found');
    }

    // Determine evidence quality based on activity metadata
    const evidenceQuality = activity.evidence
      ? ('high' as const)
      : ('medium' as const);

    const result = await this.calculateSVU({
      activityId: activity.id,
      hoursSpent: activity.hoursSpent,
      reach: activity.reach || undefined,
      pillarCode: activity.pillar.code,
      userLearningPath: activity.user.learningPaths[0]?.path.code,
      isVerified: activity.status === 'VERIFIED',
      evidenceQuality
    });

    return result;
  }

  /**
   * Get multiplier information for display
   */
  static async getMultiplierInfo() {
    const pillars = await prisma.pillar.findMany({
      orderBy: { orderIndex: 'asc' }
    });

    const learningPaths = await prisma.learningPath.findMany();

    return {
      pillars: pillars.map((p) => ({
        code: p.code,
        name: p.name,
        multiplier: p.irreplaceabilityMultiplier,
        description: p.description
      })),
      learningPaths: learningPaths.map((lp) => ({
        code: lp.code,
        name: lp.name,
        multiplier: lp.pathWeightMultiplier,
        description: lp.description
      })),
      impactMultiplierRanges: {
        min: 0.5,
        max: 2.0,
        description: 'Based on reach (people impacted) and evidence quality'
      },
      verificationMultipliers: {
        verified: 1.0,
        selfReported: 0.8
      }
    };
  }
}
