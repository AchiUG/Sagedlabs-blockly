
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-config';
import { prisma } from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: { courseId: string; moduleId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, content, videoUrl, thumbnailUrl, duration, orderIndex } = body;

    const lesson = await prisma.lesson.create({
      data: {
        title,
        content,
        videoUrl,
        thumbnailUrl,
        duration: duration ? parseInt(duration) : null,
        orderIndex: orderIndex ?? 0,
        moduleId: params.moduleId
      }
    });

    return NextResponse.json(lesson);
  } catch (error: any) {
    console.error('Error creating lesson:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create lesson' },
      { status: 500 }
    );
  }
}
