
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-config';
import { prisma } from '@/lib/db';
import bcryptjs from 'bcryptjs';

export async function PUT(
  request: NextRequest,
  { params }: { params: { userId: string } }
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
    const { firstName, lastName, email, password, role, institution, bio } = body;

    const updateData: any = {
      firstName,
      lastName,
      name: `${firstName} ${lastName}`,
      email,
      role,
      institution,
      bio
    };

    // Only update password if provided
    if (password && password.length > 0) {
      updateData.password = await bcryptjs.hash(password, 12);
    }

    const user = await prisma.user.update({
      where: { id: params.userId },
      data: updateData,
      include: {
        _count: {
          select: {
            enrollments: true
          }
        }
      }
    });

    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { userId: string } }
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

    await prisma.user.delete({
      where: { id: params.userId }
    });

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
