
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-config';
import { prisma } from '@/lib/db';

export async function PUT(
  request: NextRequest,
  { params }: { params: { courseId: string; moduleId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description } = body;

    const module = await prisma.module.update({
      where: { id: params.moduleId },
      data: {
        title,
        description
      }
    });

    return NextResponse.json(module);
  } catch (error: any) {
    console.error('Error updating module:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update module' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { courseId: string; moduleId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Delete all lessons in the module first
    await prisma.lesson.deleteMany({
      where: { moduleId: params.moduleId }
    });

    // Delete the module
    await prisma.module.delete({
      where: { id: params.moduleId }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting module:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete module' },
      { status: 500 }
    );
  }
}
