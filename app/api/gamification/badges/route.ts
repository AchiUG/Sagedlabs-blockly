
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;

    // Get all available badges
    const allBadges = await prisma.badge.findMany({
      orderBy: [{ category: 'asc' }, { rarity: 'asc' }]
    });

    // Get user's earned badges
    const userBadges = await prisma.userBadge.findMany({
      where: { userId },
      include: { badge: true }
    });

    const earnedBadgeIds = new Set(userBadges.map(ub => ub.badgeId));

    const badgesWithStatus = allBadges.map(badge => ({
      ...badge,
      earned: earnedBadgeIds.has(badge.id),
      earnedAt: userBadges.find(ub => ub.badgeId === badge.id)?.earnedAt || null,
      progress: userBadges.find(ub => ub.badgeId === badge.id)?.progress || 0
    }));

    return NextResponse.json({ badges: badgesWithStatus });
  } catch (error) {
    console.error('Error fetching badges:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const { badgeId, progress = 100 } = await request.json();

    if (!badgeId) {
      return NextResponse.json({ error: 'Badge ID required' }, { status: 400 });
    }

    const badge = await prisma.badge.findUnique({
      where: { id: badgeId }
    });

    if (!badge) {
      return NextResponse.json({ error: 'Badge not found' }, { status: 404 });
    }

    const userBadge = await prisma.userBadge.upsert({
      where: {
        userId_badgeId: {
          userId,
          badgeId
        }
      },
      create: {
        userId,
        badgeId,
        progress
      },
      update: {
        progress
      },
      include: { badge: true }
    });

    return NextResponse.json({ userBadge });
  } catch (error) {
    console.error('Error awarding badge:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
