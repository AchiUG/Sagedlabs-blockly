import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

const subscribeSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  firstName: z.string().optional(),
  source: z.string().optional(),
  interests: z.array(z.string()).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = subscribeSchema.parse(body);

    // Check if already subscribed
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email: validatedData.email.toLowerCase() },
    });

    if (existing) {
      if (existing.isActive) {
        return NextResponse.json(
          { success: true, message: "You're already subscribed! 🎉" },
          { status: 200 }
        );
      } else {
        // Reactivate subscription
        await prisma.newsletterSubscriber.update({
          where: { email: validatedData.email.toLowerCase() },
          data: {
            isActive: true,
            unsubscribedAt: null,
            source: validatedData.source || existing.source,
            interests: validatedData.interests || existing.interests,
          },
        });
        return NextResponse.json(
          { success: true, message: "Welcome back! Your subscription has been reactivated. 🎉" },
          { status: 200 }
        );
      }
    }

    // Create new subscriber
    await prisma.newsletterSubscriber.create({
      data: {
        email: validatedData.email.toLowerCase(),
        firstName: validatedData.firstName,
        source: validatedData.source || "website",
        interests: validatedData.interests || [],
      },
    });

    return NextResponse.json(
      { success: true, message: "Welcome to the SAGED family! 🌟" },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error("Newsletter subscription error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
