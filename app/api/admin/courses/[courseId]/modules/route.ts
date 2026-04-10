
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-config';
import { prisma } from '@/lib/db';

type ModulesRouteParams = {
  courseId: string;
};

export async function POST(
  request: NextRequest,
  context: { params: Promise<ModulesRouteParams> }
) {
  const { courseId } = await context.params;

  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, orderIndex } = body;

    const module = await prisma.module.create({
      data: {
        title,
        description,
        orderIndex: orderIndex ?? 0,
        courseId
      }
    });

    return NextResponse.json(module);
  } catch (error: any) {
    console.error('Error creating module:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create module' },
      { status: 500 }
    );
  }
}
