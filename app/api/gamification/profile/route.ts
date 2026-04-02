
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { prisma } from '@/lib/db';
import { calculateLevelFromXP, getStageFromXP, getXPProgressInLevel } from '@/lib/gamification';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;

    // Get or create gamification profile
    let gamification = await prisma.userGamification.findUnique({
      where: { userId }
    });

    if (!gamification) {
      gamification = await prisma.userGamification.create({
        data: {
          userId,
          totalXP: 0,
          currentLevel: 1,
          currentStage: 1,
          stageTitle: 'Seeker',
          streakDays: 0,
          lastActiveDate: new Date()
        }
      });
    }

    const stage = getStageFromXP(gamification.totalXP);
    const level = calculateLevelFromXP(gamification.totalXP);
    const xpProgress = getXPProgressInLevel(gamification.totalXP);

    // Get user's badges
    const userBadges = await prisma.userBadge.findMany({
      where: { userId },
      include: { badge: true },
      orderBy: { earnedAt: 'desc' }
    });

    // Get user's skills
    const skillProgress = await prisma.skillProgress.findMany({
      where: { userId },
      include: { skill: true },
      orderBy: { xpEarned: 'desc' }
    });

    return NextResponse.json({
      gamification: {
        ...gamification,
        currentLevel: level,
        currentStage: stage.stage,
        stageTitle: stage.title
      },
      stage,
      level,
      xpProgress,
      badges: userBadges,
      skills: skillProgress
    });
  } catch (error) {
    console.error('Error fetching gamification profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
