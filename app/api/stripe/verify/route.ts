import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-config";
import { stripe } from "@/lib/services/stripe";
import { provisionFromCheckoutSession } from "@/lib/services/stripe-provisioning";

/**
 * POST /api/stripe/verify?session_id=cs_...
 *
 * Finalizes provisioning using the Checkout Session ID returned on the success redirect.
 * This acts as a safety-net when webhooks are delayed/misconfigured.
 */
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const sessionId = url.searchParams.get("session_id");
  if (!sessionId) {
    return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
  }

  try {
    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);

    const authedUserId = (session.user as any).id as string | undefined;
    const sessionUserId = checkoutSession.metadata?.userId;
    if (!authedUserId || !sessionUserId || authedUserId !== sessionUserId) {
      return NextResponse.json({ error: "Session/user mismatch" }, { status: 403 });
    }

    await provisionFromCheckoutSession(checkoutSession);

    return NextResponse.json({
      ok: true,
      payment_status: checkoutSession.payment_status,
    });
  } catch (e: any) {
    console.error("Stripe verify error:", e);
    return NextResponse.json(
      { error: e?.message || "Failed to verify session" },
      { status: 500 }
    );
  }
}

