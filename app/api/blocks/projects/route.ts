import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { prisma } from '@/lib/db';

// GET /api/blocks/projects?lessonId=... - Get user's project for a lesson
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const lessonId = searchParams.get('lessonId');

    if (!lessonId) {
      return NextResponse.json({ error: 'lessonId is required' }, { status: 400 });
    }

    const project = await prisma.blocksProject.findUnique({
      where: {
        lessonId_userId: {
          lessonId,
          userId: session.user.id,
        },
      },
      select: {
        id: true,
        lessonId: true,
        workspace: true,
        generatedCode: true,
        status: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ project });
  } catch (error) {
    console.error('Error fetching blocks project:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/blocks/projects - Save/update project
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { lessonId, workspace, generatedCode } = body;

    if (!lessonId || !workspace) {
      return NextResponse.json({ error: 'lessonId and workspace are required' }, { status: 400 });
    }

    // Check if lesson exists
    const lesson = await prisma.blocksLesson.findUnique({
      where: { id: lessonId },
    });

    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    // Check if project is already submitted (locked)
    const existingProject = await prisma.blocksProject.findUnique({
      where: {
        lessonId_userId: {
          lessonId,
          userId: session.user.id,
        },
      },
    });

    if (existingProject?.status === 'SUBMITTED') {
      return NextResponse.json({ error: 'Project is already submitted and locked' }, { status: 403 });
    }

    // Upsert the project
    const project = await prisma.blocksProject.upsert({
      where: {
        lessonId_userId: {
          lessonId,
          userId: session.user.id,
        },
      },
      update: {
        workspace,
        generatedCode: generatedCode || null,
        updatedAt: new Date(),
      },
      create: {
        lessonId,
        userId: session.user.id,
        workspace,
        generatedCode: generatedCode || null,
      },
    });

    return NextResponse.json({ 
      success: true, 
      project: {
        id: project.id,
        status: project.status,
        updatedAt: project.updatedAt,
      },
    });
  } catch (error) {
    console.error('Error saving blocks project:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
