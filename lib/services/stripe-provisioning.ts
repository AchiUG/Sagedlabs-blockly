import Stripe from "stripe";
import { prisma } from "@/lib/db";
import { SUMMER_PROGRAM_CONFIG } from "@/lib/config/summer-program";

/**
 * Finalize a completed Stripe Checkout Session:
 * - Persist a Payment record (idempotent)
 * - Provision access (enrollment / subscription fields)
 *
 * This is shared by both the webhook and the post-redirect verification endpoint.
 */
export async function provisionFromCheckoutSession(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;
  const programId = session.metadata?.program;
  const courseIdFromMetadata = session.metadata?.courseId;
  const tierId = session.metadata?.tierId;

  if (!userId) {
    throw new Error("Missing userId in checkout session metadata");
  }

  const courseId =
    courseIdFromMetadata ||
    (programId === SUMMER_PROGRAM_CONFIG.programId ? SUMMER_PROGRAM_CONFIG.courseId : undefined);

  const amount = session.amount_total ?? 0; // cents
  const currency = (session.currency || "usd").toUpperCase();
  const paymentStatus = session.payment_status; // 'paid' | 'unpaid' | 'no_payment_required'

  // Persist a payment row so we have a durable "user paid for X" record.
  // In dev, Next may be running with an older generated Prisma Client; guard so provisioning doesn't 500.
  const paymentDelegate = (prisma as any).payment as
    | {
        upsert: (args: any) => Promise<any>;
      }
    | undefined;

  if (!paymentDelegate?.upsert) {
    console.warn(
      "[stripe-provisioning] prisma.payment is unavailable. " +
        "Run `pnpm db:generate` and restart the Next dev server; then ensure the DB schema is pushed (e.g. `pnpm db:push`)."
    );
  } else {
    await paymentDelegate.upsert({
      where: { stripeCheckoutSessionId: session.id },
      update: {
        status: paymentStatus === "paid" ? "PAID" : "PENDING",
        stripePaymentIntentId:
          typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id,
        amount,
        currency,
        programId: programId || null,
        tierId: tierId || null,
        courseId: courseId || null,
      },
      create: {
        userId,
        courseId: courseId || null,
        programId: programId || null,
        tierId: tierId || null,
        stripeCheckoutSessionId: session.id,
        stripePaymentIntentId:
          typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id,
        amount,
        currency,
        status: paymentStatus === "paid" ? "PAID" : "PENDING",
      },
    });
  }

  // Provision access only when Stripe says it's paid.
  if (paymentStatus !== "paid") return;

  // For the Summer Program, upgrade the user (existing behavior).
  if (programId === SUMMER_PROGRAM_CONFIG.programId) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        subscriptionTier: SUMMER_PROGRAM_CONFIG.programId,
        subscriptionStatus: "ACTIVE",
        subscriptionStartDate: new Date(),
      },
    });
  }

  // Grant course access by creating/upserting an enrollment.
  if (courseId) {
    await prisma.enrollment.upsert({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
      update: {
        status: "ACTIVE",
      },
      create: {
        userId,
        courseId,
        status: "ACTIVE",
        progress: 0,
      },
    });
  }
}
