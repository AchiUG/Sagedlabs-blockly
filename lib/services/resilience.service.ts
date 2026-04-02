
/**
 * Resilience Service
 * Calculates AI-Age Resilience Scores based on SAGE-D pillar contributions
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ResilienceService {
  /**
   * Calculate resilience score for a user
   */
  static async calculateResilienceScore(userId: string) {
    // 1. Get all user contributions by pillar
    const contributions = await prisma.contribution.findMany({
      where: { userId },
      include: {
        activity: {
          include: { pillar: true }
        }
      }
    });

    if (contributions.length === 0) {
      return this.createDefaultScore(userId);
    }

    // 2. Calculate SVU by pillar
    const svuByPillar: Record<string, number> = {
      S: 0,
      A: 0,
      G: 0,
      E: 0,
      D: 0
    };

    contributions.forEach((contrib) => {
      const pillarCode = contrib.activity.pillar.code;
      svuByPillar[pillarCode] += contrib.svuEarned;
    });

    // 3. Calculate individual pillar scores (0-100 scale)
    const totalSVU = Object.values(svuByPillar).reduce((a, b) => a + b, 0);
    
    const symbolicScore = this.normalizePillarScore(svuByPillar.S, totalSVU);
    const adaptiveScore = this.normalizePillarScore(svuByPillar.A, totalSVU);
    const governanceScore = this.normalizePillarScore(svuByPillar.G, totalSVU);
    const equityScore = this.normalizePillarScore(svuByPillar.E, totalSVU);
    const defensiveScore = this.normalizePillarScore(svuByPillar.D, totalSVU);

    // 4. Calculate overall score (weighted average)
    const overallScore =
      (symbolicScore * 0.25) +
      (adaptiveScore * 0.20) +
      (governanceScore * 0.20) +
      (equityScore * 0.15) +
      (defensiveScore * 0.20);

    // 5. Determine automation risk level
    const automationRiskLevel = this.determineRiskLevel(overallScore);

    // 6. Determine trend direction (compare with previous score)
    const previousScore = await prisma.resilienceScore.findUnique({
      where: { userId }
    });

    let trendDirection = 'STABLE';
    if (previousScore) {
      const diff = overallScore - previousScore.overallScore;
      if (diff > 5) trendDirection = 'IMPROVING';
      else if (diff < -5) trendDirection = 'DECLINING';
    }

    // 7. Update or create resilience score
    const resilienceScore = await prisma.resilienceScore.upsert({
      where: { userId },
      update: {
        overallScore,
        symbolicScore,
        adaptiveScore,
        governanceScore,
        equityScore,
        defensiveScore,
        automationRiskLevel,
        trendDirection,
        lastCalculated: new Date()
      },
      create: {
        userId,
        overallScore,
        symbolicScore,
        adaptiveScore,
        governanceScore,
        equityScore,
        defensiveScore,
        automationRiskLevel,
        trendDirection
      }
    });

    return resilienceScore;
  }

  /**
   * Normalize pillar score to 0-100 scale
   */
  private static normalizePillarScore(pillarSVU: number, totalSVU: number): number {
    if (totalSVU === 0) return 0;
    
    // Each pillar should ideally be 20% of total (5 pillars)
    const idealPercent = 20;
    const actualPercent = (pillarSVU / totalSVU) * 100;
    
    // Score is based on how close to ideal (max 100)
    return Math.min(100, actualPercent * 5); // 20% → 100 score
  }

  /**
   * Determine automation risk level
   */
  private static determineRiskLevel(overallScore: number): string {
    if (overallScore >= 70) return 'LOW';
    if (overallScore >= 40) return 'MODERATE';
    return 'HIGH';
  }

  /**
   * Create default score for new users
   */
  private static async createDefaultScore(userId: string) {
    return prisma.resilienceScore.create({
      data: {
        userId,
        overallScore: 0,
        symbolicScore: 0,
        adaptiveScore: 0,
        governanceScore: 0,
        equityScore: 0,
        defensiveScore: 0,
        automationRiskLevel: 'MODERATE',
        trendDirection: null
      }
    });
  }

  /**
   * Get resilience recommendations
   */
  static async getRecommendations(userId: string) {
    const score = await prisma.resilienceScore.findUnique({
      where: { userId }
    });

    if (!score) {
      return {
        recommendations: [
          'Start logging your activities to calculate your resilience score',
          'Focus on building skills across all five SAGE-D pillars'
        ]
      };
    }

    const recommendations: string[] = [];
    const weakPillars: Array<{ name: string; score: number }> = [];

    // Identify weak pillars (below 50)
    if (score.symbolicScore < 50) {
      weakPillars.push({ name: 'Symbolic-Relationality', score: score.symbolicScore });
    }
    if (score.adaptiveScore < 50) {
      weakPillars.push({ name: 'Adaptive Ecological Alignment', score: score.adaptiveScore });
    }
    if (score.governanceScore < 50) {
      weakPillars.push({ name: 'Governance & Knowledge Sovereignty', score: score.governanceScore });
    }
    if (score.equityScore < 50) {
      weakPillars.push({ name: 'Equity, Efficiency & Resilience', score: score.equityScore });
    }
    if (score.defensiveScore < 50) {
      weakPillars.push({ name: 'Defensive Sovereignty & Protection', score: score.defensiveScore });
    }

    // Sort by lowest score
    weakPillars.sort((a, b) => a.score - b.score);

    // Generate recommendations
    weakPillars.slice(0, 3).forEach((pillar) => {
      recommendations.push(
        `Strengthen your ${pillar.name} skills through relevant activities`
      );
    });

    if (score.automationRiskLevel === 'HIGH') {
      recommendations.push(
        'Your automation risk is high. Focus on human-centric skills that AI cannot replicate.'
      );
    }

    if (score.trendDirection === 'DECLINING') {
      recommendations.push(
        'Your resilience score is declining. Increase your learning activities.'
      );
    }

    return {
      recommendations,
      weakPillars
    };
  }
}
