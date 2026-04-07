
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { prisma } from '@/lib/db';

// POST /api/blocks/projects/reset - Hard reset a user's lesson progress
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { lessonId } = body;

    if (!lessonId) {
      return NextResponse.json({ error: 'lessonId is required' }, { status: 400 });
    }

    // 1. Fetch the lesson to get the starter workspace
    const lesson = await prisma.blocksLesson.findUnique({
      where: { id: lessonId }
    });

    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    // 2. Perform reset operations in a transaction
    await prisma.$transaction([
      // Delete any submissions for this lesson/user
      prisma.blocksSubmission.deleteMany({
        where: {
          lessonId,
          userId: session.user.id
        }
      }),
      // Reset the project record
      prisma.blocksProject.upsert({
        where: {
          lessonId_userId: {
            lessonId,
            userId: session.user.id
          }
        },
        update: {
          status: 'DRAFT',
          workspace: lesson.starterWorkspace || { blocks: { languageVersion: 0, blocks: [] } },
          generatedCode: null,
          updatedAt: new Date()
        },
        create: {
          lessonId,
          userId: session.user.id,
          status: 'DRAFT',
          workspace: lesson.starterWorkspace || { blocks: { languageVersion: 0, blocks: [] } }
        }
      })
    ]);

    return NextResponse.json({ success: true, message: 'Lesson reset successfully' });
  } catch (error) {
    console.error('Error resetting blocks project:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
