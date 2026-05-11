
/**
 * Summer Program 2026 Configuration
 * Central source of truth for pricing, tiers, and Stripe mapping.
 */

export type SummerTierId = 'STANDARD' | 'EARLY_SAGE' | 'COMMUNITY' | 'REFERRAL' | 'SCHOLARSHIP';

export interface SummerTier {
  id: SummerTierId;
  label: string;
  price: number;
  priceMax?: number;
  discountLabel?: string;
  description: string;
  stripePriceId: string;
  stripeCouponId?: string;
  actionLabel: string;
  type: 'direct' | 'application';
}

export const SUMMER_PROGRAM_CONFIG = {
  programId: 'YOUNG_SAGES_SUMMER_2026',
  programName: 'SAGED Young Sages Summer Program',
  courseId: 'cmowyejrt0001oi21f9o94j64', // The database ID for the Young Sages course
  basePrice: 799,
  currency: 'USD',
  tiers: {
    STANDARD: {
      id: 'STANDARD',
      label: 'Full Program Tuition',
      price: 799,
      description: 'Standard 8-week virtual program including all live sessions and resources.',
      stripePriceId: 'price_placeholder_standard',
      actionLabel: 'Enroll Now',
      type: 'direct',
    },
    EARLY_SAGE: {
      id: 'EARLY_SAGE',
      label: 'Early Sage Discount',
      price: 679,
      discountLabel: 'Save 15%',
      description: 'Available for the first families to enroll during the early registration window.',
      stripePriceId: 'price_placeholder_standard',
      stripeCouponId: 'coupon_early_sage_15',
      actionLabel: 'Claim Early Discount',
      type: 'direct',
    },
    COMMUNITY: {
      id: 'COMMUNITY',
      label: 'SAGED Community Discount',
      price: 719,
      discountLabel: 'Save 10%',
      description: 'For families who follow SAGED on social media and share the program flyer.',
      stripePriceId: 'price_placeholder_standard',
      stripeCouponId: 'coupon_community_10',
      actionLabel: 'Claim Community Discount',
      type: 'direct',
    },
    REFERRAL: {
      id: 'REFERRAL',
      label: 'SAGED Referral Reward',
      price: 699,
      discountLabel: 'Save $100',
      description: 'For families referred by an existing SAGED supporter or participant.',
      stripePriceId: 'price_placeholder_referral_699',
      actionLabel: 'Use Referral Reward',
      type: 'direct',
    },
    SCHOLARSHIP: {
      id: 'SCHOLARSHIP',
      label: 'SAGED Thinker Scholarship',
      price: 479,
      priceMax: 639,
      discountLabel: 'Save Up To 40%',
      description: 'Merit-based scholarship awarded through our creativity and problem-solving challenge.',
      stripePriceId: 'price_placeholder_scholarship',
      actionLabel: 'Apply for Scholarship',
      type: 'application',
    }
  } as Record<SummerTierId, SummerTier>
};
