import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { prisma } from '@/lib/db';

// GET /api/blocks/lessons/[slug] - Get lesson metadata
type BlocksLessonParams = {
  slug: string;
};

export async function GET(
  request: NextRequest,
  context: { params: Promise<BlocksLessonParams> }
) {
  const { slug } = await context.params;

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const lesson = await prisma.blocksLesson.findUnique({
      where: { slug },
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        instructions: true,
        starterWorkspace: true,
        stageConfig: true,
        blockConfig: true,
        isPublished: true,
      },
    });

    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    if (!lesson.isPublished && session.user.role !== 'ADMIN' && session.user.role !== 'INSTRUCTOR') {
      return NextResponse.json({ error: 'Lesson not published' }, { status: 403 });
    }

    return NextResponse.json(lesson);
  } catch (error) {
    console.error('Error fetching blocks lesson:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
