
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { ResilienceService } from '@/lib/services/resilience.service';

/**
 * GET /api/svu/resilience
 * Get user's AI-Age Resilience Score
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const score = await ResilienceService.calculateResilienceScore(session.user.id);
    const recommendations = await ResilienceService.getRecommendations(session.user.id);

    return NextResponse.json({
      score,
      recommendations
    });
  } catch (error: any) {
    console.error('Error fetching resilience score:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch resilience score' },
      { status: 500 }
    );
  }
}
