
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-config';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
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

    const course = await prisma.course.create({
      data: {
        title,
        description,
        instructorId,
        price: price || 0,
        duration: duration || 0,
        level: level || 'BEGINNER',
        isPublished: isPublished || false
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

    return NextResponse.json(course, { status: 201 });
  } catch (error) {
    console.error('Error creating course:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
