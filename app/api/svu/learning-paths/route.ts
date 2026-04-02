
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * GET /api/svu/learning-paths
 * Get available learning paths
 */
export async function GET(request: NextRequest) {
  try {
    const learningPaths = await prisma.learningPath.findMany({
      orderBy: { code: 'asc' }
    });

    return NextResponse.json({ learningPaths });
  } catch (error: any) {
    console.error('Error fetching learning paths:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch learning paths' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/svu/learning-paths
 * Set user's primary learning path
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { pathCode } = body;

    if (!pathCode) {
      return NextResponse.json(
        { error: 'Path code required' },
        { status: 400 }
      );
    }

    // Find the path
    const path = await prisma.learningPath.findUnique({
      where: { code: pathCode }
    });

    if (!path) {
      return NextResponse.json(
        { error: 'Learning path not found' },
        { status: 404 }
      );
    }

    // Set all other paths to non-primary
    await prisma.userLearningPath.updateMany({
      where: { userId: session.user.id },
      data: { isPrimary: false }
    });

    // Set or create this path as primary
    const userPath = await prisma.userLearningPath.upsert({
      where: {
        userId_pathId: {
          userId: session.user.id,
          pathId: path.id
        }
      },
      update: { isPrimary: true },
      create: {
        userId: session.user.id,
        pathId: path.id,
        isPrimary: true
      },
      include: { path: true }
    });

    return NextResponse.json({
      success: true,
      userPath
    });
  } catch (error: any) {
    console.error('Error setting learning path:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to set learning path' },
      { status: 500 }
    );
  }
}
