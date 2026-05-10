
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/services/stripe";
import { prisma } from "@/lib/db";
import Stripe from "stripe";

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  let event: Stripe.Event;

  try {
    if (!sig || !endpointSecret) {
      throw new Error("Missing signature or endpoint secret");
    }
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object as Stripe.Checkout.Session;
      
      const userId = session.metadata?.userId;
      const program = session.metadata?.program;

      if (userId && program === 'YOUNG_SAGES_SEASON_1') {
        // Upgrade the user in the database
        await prisma.user.update({
          where: { id: userId },
          data: {
            subscriptionTier: 'YOUNG_SAGES',
            subscriptionStatus: 'ACTIVE',
            subscriptionStartDate: new Date(),
          },
        });
        
        console.log(`User ${userId} upgraded to YOUNG_SAGES successfully.`);
      }
      break;
    
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
