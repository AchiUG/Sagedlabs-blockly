
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-config";
import { createCheckoutSession } from "@/lib/services/stripe";
import { SUMMER_PROGRAM_CONFIG, type SummerTierId } from "@/lib/config/summer-program";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();
    const { tierId, programId, referralCode, courseId } = body;

    // Summer Program Checkout
    if (programId === SUMMER_PROGRAM_CONFIG.programId) {
      const tier = SUMMER_PROGRAM_CONFIG.tiers[tierId as SummerTierId];
      if (!tier) {
        return NextResponse.json({ error: "Invalid pricing tier" }, { status: 400 });
      }

      // Handle authentication for checkout
      if (!session || !session.user) {
        return NextResponse.json({ 
          error: "Authentication required",
          redirect: `/auth/signup?program=young-sages&tier=${tierId}` 
        }, { status: 401 });
      }

      const checkoutSession = await createCheckoutSession(
        (session.user as any).id,
        session.user.email!,
        tier.price,
        `SAGED Young Sages - ${tier.label}`,
        {
          program: SUMMER_PROGRAM_CONFIG.programId,
          tierId: tierId,
          referralCode: referralCode || ""
        }
      );

      return NextResponse.json({ url: checkoutSession.url });
    }

    // Standard platform subscription or course checkout
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Generic course checkout (non-summer-program)
    if (courseId) {
      const course = await prisma.course.findUnique({
        where: { id: courseId },
        select: { id: true, title: true, price: true, isPublished: true },
      });

      if (!course || !course.isPublished) {
        return NextResponse.json({ error: "Course not found" }, { status: 404 });
      }

      // If the course is free, skip Stripe and just enroll.
      if (!course.price || course.price <= 0) {
        await prisma.enrollment.upsert({
          where: { userId_courseId: { userId: (session.user as any).id, courseId: course.id } },
          update: { status: "ACTIVE" },
          create: { userId: (session.user as any).id, courseId: course.id, status: "ACTIVE", progress: 0 },
        });
        return NextResponse.json({ url: null, enrolled: true });
      }

      const checkoutSession = await createCheckoutSession(
        (session.user as any).id,
        session.user.email!,
        course.price,
        course.title,
        { courseId: course.id }
      );

      return NextResponse.json({ url: checkoutSession.url });
    }

    const checkoutSession = await createCheckoutSession(
      (session.user as any).id,
      session.user.email!,
      SUMMER_PROGRAM_CONFIG.basePrice,
      "SAGED Young Sages Summer 2026"
    );

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error: any) {
    console.error("Checkout session error:", error);
    return NextResponse.json({ error: error.message || "Failed to create checkout session" }, { status: 500 });
  }
}
