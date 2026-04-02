
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { prisma } from '@/lib/db';
import { calculateMasteryLevel } from '@/lib/gamification';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const searchParams = request.nextUrl.searchParams;
    const moduleId = searchParams.get('moduleId');

    if (moduleId) {
      const mastery = await prisma.masteryRecord.findUnique({
        where: {
          userId_moduleId: {
            userId,
            moduleId
          }
        }
      });

      return NextResponse.json({ mastery });
    }

    // Get all mastery records for user
    const masteryRecords = await prisma.masteryRecord.findMany({
      where: { userId },
      orderBy: { masteryLevel: 'desc' }
    });

    return NextResponse.json({ masteryRecords });
  } catch (error) {
    console.error('Error fetching mastery records:', error);
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
    const {
      moduleId,
      assessmentScore,
      timeInvested,
      practiceCount,
      checkpointsCompleted,
      totalCheckpoints
    } = await request.json();

    if (!moduleId) {
      return NextResponse.json({ error: 'Module ID required' }, { status: 400 });
    }

    const masteryLevel = calculateMasteryLevel({
      assessmentScore: assessmentScore || 0,
      timeInvested: timeInvested || 0,
      practiceCount: practiceCount || 0,
      checkpointsCompleted: checkpointsCompleted || 0,
      totalCheckpoints: totalCheckpoints || 1
    });

    const mastery = await prisma.masteryRecord.upsert({
      where: {
        userId_moduleId: {
          userId,
          moduleId
        }
      },
      create: {
        userId,
        moduleId,
        masteryLevel,
        assessmentScore: assessmentScore || 0,
        timeInvested: timeInvested || 0,
        practiceCount: (practiceCount || 0) + 1,
        lastPracticed: new Date()
      },
      update: {
        masteryLevel,
        assessmentScore: assessmentScore || undefined,
        timeInvested: timeInvested ? { increment: timeInvested } : undefined,
        practiceCount: { increment: 1 },
        lastPracticed: new Date()
      }
    });

    return NextResponse.json({ mastery });
  } catch (error) {
    console.error('Error updating mastery record:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
