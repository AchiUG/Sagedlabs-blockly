
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { stepId } = body;

    if (!stepId) {
      return NextResponse.json(
        { error: 'Step ID is required' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update user's onboarding step
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        onboardingStep: stepId,
        onboardingCompleted: stepId === 'completed',
      }
    });

    // Award tokens for completing onboarding steps (2 tokens per step)
    const tokenReward = 2;
    const tokenBalance = await prisma.tokenBalance.findUnique({
      where: { userId: user.id }
    });

    if (tokenBalance) {
      await prisma.tokenBalance.update({
        where: { userId: user.id },
        data: {
          sageTokens: { increment: tokenReward },
          lifetimeTokens: { increment: tokenReward },
          lastUpdated: new Date(),
        }
      });

      // Record transaction
      await prisma.tokenTransaction.create({
        data: {
          userId: user.id,
          amount: tokenReward,
          tokenType: 'SAGE',
          reason: `Completed onboarding step: ${stepId}`,
        }
      });
    }

    return NextResponse.json({
      message: 'Onboarding step completed',
      stepId,
      tokensEarned: tokenReward,
      completed: updatedUser.onboardingCompleted,
    });

  } catch (error: any) {
    console.error('Complete onboarding step error:', error);
    return NextResponse.json(
      { error: 'Failed to complete onboarding step' },
      { status: 500 }
    );
  }
}
