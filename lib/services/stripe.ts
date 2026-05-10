
import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-11-preview' as any, // Use the latest stable version or let it default
  appInfo: {
    name: 'SAGED Platform',
    version: '0.1.0',
  },
});

export const createCheckoutSession = async (userId: string, userEmail: string, priceId: string) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXTAUTH_URL}/dashboard?payment=success`,
      cancel_url: `${process.env.NEXTAUTH_URL}/young-sages?payment=cancelled`,
      customer_email: userEmail,
      metadata: {
        userId: userId,
        program: 'YOUNG_SAGES_SEASON_1',
      },
    });

    return session;
  } catch (error) {
    console.error('Stripe session creation error:', error);
    throw error;
  }
};
