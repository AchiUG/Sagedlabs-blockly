
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { ContributionService } from '@/lib/services/contribution.service';

/**
 * GET /api/svu/balance
 * Get user's SVU balance
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const balance = await ContributionService.getUserBalance(session.user.id);
    const statsByPillar = await ContributionService.getSVUStatsByPillar(session.user.id);

    return NextResponse.json({
      balance,
      statsByPillar
    });
  } catch (error: any) {
    console.error('Error fetching balance:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch balance' },
      { status: 500 }
    );
  }
}
