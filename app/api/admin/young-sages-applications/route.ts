import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'INSTRUCTOR')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    
    const whereClause = status && status !== 'ALL' 
      ? { status: status as 'PENDING' | 'ACCEPTED' | 'WAITLISTED' | 'REJECTED' }
      : {};
    
    const applications = await prisma.youngSagesApplication.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    });
    
    // Get counts by status
    const counts = await prisma.youngSagesApplication.groupBy({
      by: ['status'],
      _count: { status: true },
    });
    
    const statusCounts = {
      PENDING: 0,
      ACCEPTED: 0,
      WAITLISTED: 0,
      REJECTED: 0,
      TOTAL: applications.length,
    };
    
    counts.forEach((c) => {
      statusCounts[c.status] = c._count.status;
    });
    
    return NextResponse.json({ applications, counts: statusCounts });
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    );
  }
}
