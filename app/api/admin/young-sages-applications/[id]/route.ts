import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const COHORT_SIZE = 10;

const updateSchema = z.object({
  status: z.enum(['PENDING', 'ACCEPTED', 'WAITLISTED', 'REJECTED']).optional(),
  adminNotes: z.string().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'INSTRUCTOR')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const application = await prisma.youngSagesApplication.findUnique({
      where: { id: params.id },
    });
    
    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }
    
    return NextResponse.json({ application });
  } catch (error) {
    console.error('Error fetching application:', error);
    return NextResponse.json(
      { error: 'Failed to fetch application' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized - Admin only' }, { status: 401 });
    }
    
    const body = await request.json();
    const validationResult = updateSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationResult.error.flatten() },
        { status: 400 }
      );
    }
    
    const { status, adminNotes } = validationResult.data;
    
    // Check if trying to accept and cohort is full
    if (status === 'ACCEPTED') {
      const acceptedCount = await prisma.youngSagesApplication.count({
        where: { 
          status: 'ACCEPTED',
          id: { not: params.id } // Exclude current application
        },
      });
      
      if (acceptedCount >= COHORT_SIZE) {
        return NextResponse.json(
          { error: `Cohort is full (${COHORT_SIZE} students accepted). Cannot accept more applications.` },
          { status: 400 }
        );
      }
    }
    
    const updateData: Record<string, unknown> = {};
    
    if (status) {
      updateData.status = status;
      updateData.reviewedAt = new Date();
      updateData.reviewedBy = session.user.id;
    }
    
    if (adminNotes !== undefined) {
      updateData.adminNotes = adminNotes;
    }
    
    const application = await prisma.youngSagesApplication.update({
      where: { id: params.id },
      data: updateData,
    });
    
    return NextResponse.json({ application, message: 'Application updated successfully' });
  } catch (error) {
    console.error('Error updating application:', error);
    return NextResponse.json(
      { error: 'Failed to update application' },
      { status: 500 }
    );
  }
}
