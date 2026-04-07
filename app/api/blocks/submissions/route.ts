import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { prisma } from '@/lib/db';
import { BlocksValidationService } from '@/lib/services/blocks-validation-service';

// POST /api/blocks/submissions - Submit a project
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { lessonId, projectId, reflection } = body;

    if (!lessonId || !projectId) {
      return NextResponse.json({ error: 'lessonId and projectId are required' }, { status: 400 });
    }

    // Fetch project and lesson details
    const [project, lesson] = await Promise.all([
      prisma.blocksProject.findUnique({
        where: { id: projectId },
      }),
      prisma.blocksLesson.findUnique({
        where: { id: lessonId },
      }),
    ]);

    if (!project || !lesson) {
      return NextResponse.json({ error: 'Project or Lesson not found' }, { status: 404 });
    }

    if (project.userId !== session.user.id) {
      return NextResponse.json({ error: 'Not authorized to submit this project' }, { status: 403 });
    }

    // Run validation
    const validation = BlocksValidationService.validate(lesson.slug, project.generatedCode);

    // Create submission and update project status
    const submission = await prisma.blocksSubmission.create({
      data: {
        lessonId,
        projectId,
        userId: session.user.id,
        reflection: reflection || null,
        feedback: validation.message,
        grade: validation.isValid ? 100 : 0,
        status: validation.isValid ? 'REVIEWED' : 'SUBMITTED', // Auto-review if perfect
      },
    });

    // Update project status to SUBMITTED
    await prisma.blocksProject.update({
      where: { id: projectId },
      data: { status: 'SUBMITTED' },
    });

    return NextResponse.json({ 
      success: true, 
      validation,
      submission: {
        id: submission.id,
        status: submission.status,
        createdAt: submission.createdAt,
      },
    });
  } catch (error) {
    console.error('Error submitting blocks project:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET /api/blocks/submissions?lessonId=... - Get submissions for a lesson (teacher view)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only teachers/admins can view all submissions
    if (session.user.role !== 'ADMIN' && session.user.role !== 'INSTRUCTOR') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const lessonId = searchParams.get('lessonId');

    if (!lessonId) {
      return NextResponse.json({ error: 'lessonId is required' }, { status: 400 });
    }

    const submissions = await prisma.blocksSubmission.findMany({
      where: { lessonId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        project: {
          select: {
            workspace: true,
            generatedCode: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ submissions });
  } catch (error) {
    console.error('Error fetching blocks submissions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
