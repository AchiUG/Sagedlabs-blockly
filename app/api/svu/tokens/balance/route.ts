
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { TokenService } from '@/lib/services/token.service';

/**
 * GET /api/svu/tokens/balance
 * Get user's $SAGED token balance
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [balance, stats, poolDistribution] = await Promise.all([
      TokenService.getUserTokenBalance(session.user.id),
      TokenService.getTokenStats(session.user.id),
      TokenService.getTokenPoolDistribution(session.user.id)
    ]);

    return NextResponse.json({
      balance,
      stats,
      poolDistribution
    });
  } catch (error: any) {
    console.error('Error fetching token balance:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch token balance' },
      { status: 500 }
    );
  }
}
