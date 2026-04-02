
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { prisma } from '@/lib/db';
import { onboardingService } from '@/lib/services/onboarding-service';
import { ArchetypeType } from '@/lib/services/archetype-service';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        firstName: true,
        archetype: true,
        onboardingStep: true,
        onboardingCompleted: true,
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const archetype = (user.archetype || 'young_sage') as ArchetypeType;
    const steps = onboardingService.getOnboardingSteps(archetype);
    const welcomeMessage = onboardingService.getWelcomeMessage(archetype, user.firstName || 'there');
    const createBotIntro = onboardingService.getCreateBotIntro(archetype);

    return NextResponse.json({
      steps,
      currentStep: user.onboardingStep,
      completed: user.onboardingCompleted,
      welcomeMessage,
      createBotIntro,
    });
  } catch (error: any) {
    console.error('Get onboarding steps error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch onboarding steps' },
      { status: 500 }
    );
  }
}
