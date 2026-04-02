
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-config';
import { prisma } from '@/lib/db';

export async function PUT(
  request: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userRole = (session.user as any)?.role;
    if (userRole !== 'ADMIN') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { title, description, instructorId, price, duration, level, isPublished } = body;

    const course = await prisma.course.update({
      where: { id: params.courseId },
      data: {
        title,
        description,
        instructorId,
        price,
        duration,
        level,
        isPublished
      },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        _count: {
          select: {
            enrollments: true,
            modules: true
          }
        }
      }
    });

    return NextResponse.json(course);
  } catch (error) {
    console.error('Error updating course:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userRole = (session.user as any)?.role;
    if (userRole !== 'ADMIN') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    await prisma.course.delete({
      where: { id: params.courseId }
    });

    return NextResponse.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Error deleting course:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
