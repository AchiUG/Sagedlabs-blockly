
/**
 * Verification Service
 * Handles community verification and SVU recalculation
 */

import { PrismaClient } from '@prisma/client';
import { SVUCalculationService } from './svu-calculation.service';
import { ContributionService } from './contribution.service';

const prisma = new PrismaClient();

export interface SubmitVerificationInput {
  activityId: string;
  verificationType: 'PEER_REVIEW' | 'ORG_LETTER' | 'PHOTO_VIDEO' | 'CERTIFICATE';
  evidence?: string;
  notes?: string;
}

export class VerificationService {
  /**
   * Submit an activity for verification
   */
  static async submitForVerification(input: SubmitVerificationInput) {
    const activity = await prisma.activity.findUnique({
      where: { id: input.activityId }
    });

    if (!activity) {
      throw new Error('Activity not found');
    }

    if (activity.status !== 'PENDING') {
      throw new Error('Activity is already verified or under review');
    }

    // Update activity status
    await prisma.activity.update({
      where: { id: input.activityId },
      data: { status: 'IN_REVIEW' }
    });

    // Create verification request
    const verification = await prisma.verification.create({
      data: {
        activityId: input.activityId,
        verificationType: input.verificationType,
        evidence: input.evidence,
        notes: input.notes,
        status: 'PENDING'
      }
    });

    return verification;
  }

  /**
   * Approve a verification (admin/verifier action)
   */
  static async approveVerification(
    verificationId: string,
    verifierId: string,
    impactScore?: number
  ) {
    const verification = await prisma.verification.findUnique({
      where: { id: verificationId },
      include: {
        activity: {
          include: {
            contributions: true,
            user: {
              include: {
                learningPaths: {
                  where: { isPrimary: true },
                  include: { path: true }
                }
              }
            }
          }
        }
      }
    });

    if (!verification) {
      throw new Error('Verification not found');
    }

    // Update verification status
    await prisma.verification.update({
      where: { id: verificationId },
      data: {
        status: 'APPROVED',
        verifierId,
        reviewedAt: new Date(),
        impactScore
      }
    });

    // Update activity status
    await prisma.activity.update({
      where: { id: verification.activityId },
      data: { status: 'VERIFIED' }
    });

    // Recalculate SVU with verified multiplier (VM = 1.0)
    const activity = verification.activity;
    const oldSVU = activity.contributions[0]?.svuEarned || 0;

    // Get pillar info
    const pillarInfo = await prisma.pillar.findUnique({
      where: { id: activity.pillarId }
    });

    if (!pillarInfo) {
      throw new Error('Pillar not found for activity');
    }

    const svuResult = await SVUCalculationService.calculateSVU({
      activityId: activity.id,
      hoursSpent: activity.hoursSpent,
      reach: activity.reach || undefined,
      pillarCode: pillarInfo.code,
      userLearningPath: activity.user.learningPaths[0]?.path.code,
      isVerified: true, // Now verified!
      evidenceQuality: activity.evidence ? 'high' : 'medium'
    });

    const newSVU = svuResult.svuEarned;
    const svuDifference = newSVU - oldSVU;

    // Update contribution record
    await prisma.contribution.updateMany({
      where: { activityId: activity.id },
      data: {
        verificationMultiplier: 1.0,
        svuEarned: newSVU
      }
    });

    // Update user's SVU balance
    await prisma.sVUBalance.update({
      where: { userId: activity.userId },
      data: {
        totalSVU: { increment: svuDifference },
        availableSVU: { increment: svuDifference },
        verifiedSVU: { increment: newSVU }, // Add to verified pool
        lastUpdated: new Date()
      }
    });

    return {
      verification,
      oldSVU,
      newSVU,
      svuIncrease: svuDifference
    };
  }

  /**
   * Reject a verification
   */
  static async rejectVerification(
    verificationId: string,
    verifierId: string,
    reason: string
  ) {
    const verification = await prisma.verification.findUnique({
      where: { id: verificationId },
      include: { activity: true }
    });

    if (!verification) {
      throw new Error('Verification not found');
    }

    await prisma.verification.update({
      where: { id: verificationId },
      data: {
        status: 'REJECTED',
        verifierId,
        reviewedAt: new Date(),
        notes: reason
      }
    });

    await prisma.activity.update({
      where: { id: verification.activityId },
      data: { status: 'REJECTED' }
    });

    return verification;
  }

  /**
   * Get pending verifications for review
   */
  static async getPendingVerifications(limit = 20) {
    return prisma.verification.findMany({
      where: { status: 'PENDING' },
      include: {
        activity: {
          include: {
            user: true,
            pillar: true,
            category: true
          }
        }
      },
      orderBy: { submittedAt: 'asc' },
      take: limit
    });
  }

  /**
   * Get verification history for an activity
   */
  static async getActivityVerifications(activityId: string) {
    return prisma.verification.findMany({
      where: { activityId },
      include: {
        verifier: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: { submittedAt: 'desc' }
    });
  }
}
