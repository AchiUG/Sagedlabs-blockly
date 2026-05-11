
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/services/stripe";
import Stripe from "stripe";
import { provisionFromCheckoutSession } from "@/lib/services/stripe-provisioning";

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
      {
        const session = event.data.object as Stripe.Checkout.Session;
        try {
          await provisionFromCheckoutSession(session);
          console.log(`✅ Provisioned from Stripe checkout session ${session.id}`);
        } catch (e: any) {
          console.error(`❌ Failed to provision from Stripe checkout session ${session.id}:`, e?.message || e);
          // Return a non-2xx so Stripe retries once the underlying issue is fixed.
          return NextResponse.json({ error: "Provisioning failed" }, { status: 500 });
        }
      }
      break;
    
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
