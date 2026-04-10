
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-config';
import { prisma } from '@/lib/db';

type ModuleRouteParams = {
  courseId: string;
  moduleId: string;
};

export async function PUT(
  request: NextRequest,
  context: { params: Promise<ModuleRouteParams> }
) {
  const { moduleId } = await context.params;

  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description } = body;

    const module = await prisma.module.update({
      where: { id: moduleId },
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
  context: { params: Promise<ModuleRouteParams> }
) {
  const { moduleId } = await context.params;

  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Delete all lessons in the module first
    await prisma.lesson.deleteMany({
      where: { moduleId }
    });

    // Delete the module
    await prisma.module.delete({
      where: { id: moduleId }
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
