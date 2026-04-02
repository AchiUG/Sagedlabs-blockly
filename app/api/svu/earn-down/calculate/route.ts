
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { EarnDownService } from '@/lib/services/earn-down.service';

/**
 * POST /api/svu/earn-down/calculate
 * Calculate earn-down discount for a course
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { courseId, svuToApply } = body;

    if (!courseId || !svuToApply) {
      return NextResponse.json(
        { error: 'Course ID and SVU amount required' },
        { status: 400 }
      );
    }

    const calculation = await EarnDownService.calculateEarnDown(
      session.user.id,
      courseId,
      parseFloat(svuToApply)
    );

    return NextResponse.json(calculation);
  } catch (error: any) {
    console.error('Error calculating earn-down:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to calculate earn-down' },
      { status: 500 }
    );
  }
}
