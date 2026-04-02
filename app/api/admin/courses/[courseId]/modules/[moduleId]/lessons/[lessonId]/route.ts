
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-config';
import { prisma } from '@/lib/db';

export async function PUT(
  request: NextRequest,
  { params }: { params: { courseId: string; moduleId: string; lessonId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, content, videoUrl, thumbnailUrl, duration } = body;

    const lesson = await prisma.lesson.update({
      where: { id: params.lessonId },
      data: {
        title,
        content,
        videoUrl,
        thumbnailUrl,
        duration: duration ? parseInt(duration) : null
      }
    });

    return NextResponse.json(lesson);
  } catch (error: any) {
    console.error('Error updating lesson:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update lesson' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { courseId: string; moduleId: string; lessonId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.lesson.delete({
      where: { id: params.lessonId }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting lesson:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete lesson' },
      { status: 500 }
    );
  }
}
