
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendPasswordResetEmail } from "@/lib/services/resend";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      // For security, don't reveal if user exists
      return NextResponse.json({ success: true, message: "If an account exists with that email, a reset link has been sent." });
    }

    // Generate token
    const token = crypto.randomUUID();
    const expires = new Date(Date.now() + 3600000); // 1 hour

    // Save token to DB
    await prisma.passwordResetToken.upsert({
      where: { email_token: { email: user.email, token } },
      update: { token, expires },
      create: { email: user.email, token, expires },
    });

    // Send email
    await sendPasswordResetEmail(user.email, token);

    return NextResponse.json({ success: true, message: "If an account exists with that email, a reset link has been sent." });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
