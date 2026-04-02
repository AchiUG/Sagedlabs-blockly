
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { lessonId, completed } = await request.json();

    if (!lessonId) {
      return NextResponse.json({ error: 'Lesson ID is required' }, { status: 400 });
    }

    // Check if progress exists
    const existingProgress = await prisma.progress.findFirst({
      where: {
        userId: session.user.id,
        lessonId,
      },
    });

    let progress;

    if (existingProgress) {
      // Update existing progress
      progress = await prisma.progress.update({
        where: { id: existingProgress.id },
        data: {
          completed,
          lastAccessed: new Date(),
        },
      });
    } else {
      // Create new progress
      progress = await prisma.progress.create({
        data: {
          userId: session.user.id,
          lessonId,
          completed,
          lastAccessed: new Date(),
        },
      });
    }

    // Update enrollment progress
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        module: {
          include: {
            course: true,
          },
        },
      },
    });

    if (lesson) {
      // Get all lessons in the course
      const allLessons = await prisma.lesson.findMany({
        where: {
          module: {
            courseId: lesson.module.courseId,
          },
        },
      });

      // Get completed lessons
      const completedLessons = await prisma.progress.findMany({
        where: {
          userId: session.user.id,
          lesson: {
            module: {
              courseId: lesson.module.courseId,
            },
          },
          completed: true,
        },
      });

      const progressPercentage = Math.round(
        (completedLessons.length / allLessons.length) * 100
      );

      // Update enrollment progress
      await prisma.enrollment.updateMany({
        where: {
          userId: session.user.id,
          courseId: lesson.module.courseId,
        },
        data: {
          progress: progressPercentage,
        },
      });
    }

    return NextResponse.json({ success: true, progress });
  } catch (error) {
    console.error('Error updating lesson progress:', error);
    return NextResponse.json(
      { error: 'Failed to update lesson progress' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');

    if (!courseId) {
      return NextResponse.json({ error: 'Course ID is required' }, { status: 400 });
    }

    const progress = await prisma.progress.findMany({
      where: {
        userId: session.user.id,
        lesson: {
          module: {
            courseId,
          },
        },
      },
      include: {
        lesson: {
          include: {
            module: true,
          },
        },
      },
    });

    return NextResponse.json(progress);
  } catch (error) {
    console.error('Error fetching lesson progress:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lesson progress' },
      { status: 500 }
    );
  }
}
