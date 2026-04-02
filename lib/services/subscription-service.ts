
/**
 * Subscription Service - Handles subscription tiers and pricing
 * Abstracted for future payment gateway integration
 */

export type SubscriptionTier = 'basic' | 'pro' | 'mentor';

export interface SubscriptionPlan {
  id: SubscriptionTier;
  name: string;
  title: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  tokenMultiplier: number;
  stageAccess: number[];
  recommended?: boolean;
}

export interface SubscriptionSelection {
  tier: SubscriptionTier;
  pathway: string;
  archetype: string;
  walletEnabled: boolean;
}

class SubscriptionService {
  /**
   * Get available subscription plans
   */
  getPlans(): SubscriptionPlan[] {
    return [
      {
        id: 'basic',
        name: 'Seeker',
        title: 'Basic',
        price: 9.99,
        currency: 'USD',
        interval: 'month',
        features: [
          'Access to Seeker & Apprentice stages',
          'Core AI courses and modules',
          'Community forums access',
          'Basic SAGE Token earning (1x)',
          'Email support',
          'Monthly live Q&A sessions'
        ],
        tokenMultiplier: 1.0,
        stageAccess: [1, 2] // Seeker, Apprentice
      },
      {
        id: 'pro',
        name: 'Apprentice',
        title: 'Pro',
        price: 19.99,
        currency: 'USD',
        interval: 'month',
        features: [
          'Full access to all stages (1-7)',
          'All courses and micro-modules',
          'Priority community access',
          'Enhanced SAGE Token earning (1.5x)',
          'Weekly live workshops',
          'Reflection & Depth Projects',
          'Priority support',
          'Downloadable resources'
        ],
        tokenMultiplier: 1.5,
        stageAccess: [1, 2, 3, 4, 5, 6, 7],
        recommended: true
      },
      {
        id: 'mentor',
        name: 'Cultivator',
        title: 'Mentor',
        price: 49,
        currency: 'USD',
        interval: 'month',
        features: [
          'Everything in Pro',
          'Mentorship opportunities',
          'Teach-to-earn program',
          'Maximum SAGE Token earning (2x)',
          'Private mentorship sessions',
          'Faculty collaboration access',
          'Revenue sharing on courses',
          '1-on-1 coaching sessions',
          'Exclusive Sage Circle access',
          'Early access to new content'
        ],
        tokenMultiplier: 2.0,
        stageAccess: [1, 2, 3, 4, 5, 6, 7]
      }
    ];
  }

  /**
   * Get recommended plan based on archetype
   */
  getRecommendedPlan(archetype: string): SubscriptionTier {
    const recommendations: Record<string, SubscriptionTier> = {
      young_sage: 'basic',
      educator: 'pro',
      technologist: 'pro',
      sage_mastery: 'mentor',
      tech_educator: 'mentor',
      educator_sage: 'mentor'
    };

    return recommendations[archetype] || 'pro';
  }

  /**
   * Format price display
   */
  formatPrice(plan: SubscriptionPlan): string {
    return `$${plan.price.toFixed(2)}/${plan.interval}`;
  }

  /**
   * Calculate annual savings
   */
  calculateAnnualSavings(monthlyPrice: number): number {
    const annualPrice = monthlyPrice * 12 * 0.8; // 20% discount
    const savings = (monthlyPrice * 12) - annualPrice;
    return Math.round(savings);
  }
}

export const subscriptionService = new SubscriptionService();
