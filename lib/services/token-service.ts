
/**
 * Token Service - Handles SAGE Token operations
 * Abstracted for future blockchain integration
 */

export type TokenType = 'SAGE' | 'REFLECTION';

export interface TokenTransaction {
  userId: string;
  amount: number;
  type: TokenType;
  reason: string;
  metadata?: Record<string, any>;
}

export interface TokenBalance {
  sageTokens: number;
  reflectionTokens: number;
  totalEarned: number;
  lifetimeTokens: number;
}

class TokenService {
  /**
   * Award tokens to a user
   * Can be replaced with blockchain smart contract calls later
   */
  async awardTokens(transaction: TokenTransaction): Promise<TokenBalance> {
    // For now, we use the gamification system's XP as tokens
    // In future, this can be a separate token ledger or blockchain
    
    // This is a placeholder - actual implementation will update database
    return {
      sageTokens: transaction.amount,
      reflectionTokens: 0,
      totalEarned: transaction.amount,
      lifetimeTokens: transaction.amount
    };
  }

  /**
   * Get token rewards for different activities
   */
  getRewardAmount(activity: string): { amount: number; type: TokenType } {
    const rewards: Record<string, { amount: number; type: TokenType }> = {
      'signup': { amount: 10, type: 'SAGE' },
      'complete_onboarding': { amount: 10, type: 'SAGE' },
      'first_reflection': { amount: 1, type: 'REFLECTION' },
      'complete_lesson': { amount: 5, type: 'SAGE' },
      'complete_module': { amount: 25, type: 'SAGE' },
      'complete_course': { amount: 100, type: 'SAGE' },
      'create_depth_project': { amount: 50, type: 'SAGE' },
      'publish_depth_project': { amount: 100, type: 'SAGE' },
      'mentor_session': { amount: 30, type: 'SAGE' },
      'teach_module': { amount: 150, type: 'SAGE' },
      'daily_login': { amount: 2, type: 'SAGE' },
      'weekly_streak': { amount: 20, type: 'SAGE' },
      'community_contribution': { amount: 15, type: 'SAGE' }
    };

    return rewards[activity] || { amount: 5, type: 'SAGE' };
  }

  /**
   * Calculate token requirements for stage progression
   */
  getStageTokenRequirement(stage: number): number {
    const requirements: Record<number, number> = {
      1: 0, // Seeker (starting stage)
      2: 100, // Apprentice
      3: 300, // Cultivator
      4: 600, // Griot-Scholar
      5: 1000, // Architect
      6: 1500, // Guardian
      7: 2500 // Sage
    };

    return requirements[stage] || 0;
  }

  /**
   * Format token display
   */
  formatTokens(amount: number, type: TokenType = 'SAGE'): string {
    return `${amount} ${type} ${amount === 1 ? 'Token' : 'Tokens'}`;
  }
}

export const tokenService = new TokenService();
