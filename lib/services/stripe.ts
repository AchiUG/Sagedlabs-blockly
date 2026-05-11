
import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  appInfo: {
    name: 'SAGED Platform',
    version: '0.1.0',
  },
});

export const createCheckoutSession = async (
  userId: string, 
  userEmail: string, 
  amount: number, // in dollars
  productName: string,
  metadata: Record<string, string> = {}
) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: productName,
              description: 'SAGED Young Sages Summer 2026 - 8-Week Program',
            },
            unit_amount: Math.round(amount * 100), // convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      // Include the Checkout Session ID so we can finalize provisioning on redirect
      // (useful if webhooks are delayed/misconfigured).
      success_url: `${process.env.NEXTAUTH_URL}/dashboard?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/young-sages?payment=cancelled`,
      customer_email: userEmail,
      metadata: {
        userId: userId,
        ...metadata
      },
    });

    return session;
  } catch (error) {
    console.error('Stripe session creation error:', error);
    throw error;
  }
};
