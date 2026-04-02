
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { EarnDownService } from '@/lib/services/earn-down.service';

/**
 * GET /api/svu/earn-down/summary
 * Get earn-down summary for user
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const summary = await EarnDownService.getEarnDownSummary(session.user.id);

    return NextResponse.json(summary);
  } catch (error: any) {
    console.error('Error fetching earn-down summary:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch summary' },
      { status: 500 }
    );
  }
}
