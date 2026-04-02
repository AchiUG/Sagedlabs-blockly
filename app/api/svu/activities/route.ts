
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { ContributionService } from '@/lib/services/contribution.service';

/**
 * GET /api/svu/activities
 * Get user's activity history
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || undefined;
    const pillarCode = searchParams.get('pillar') || undefined;
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    const result = await ContributionService.getUserActivities(
      session.user.id,
      { status, pillarCode, limit, offset }
    );

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error fetching activities:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch activities' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/svu/activities
 * Log a new activity
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      categoryId,
      pillarId,
      title,
      description,
      activityType,
      hoursSpent,
      reach,
      evidence,
      metadata
    } = body;

    // Validate required fields
    if (!categoryId || !pillarId || !title || !activityType || !hoursSpent) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await ContributionService.logActivity({
      userId: session.user.id,
      categoryId,
      pillarId,
      title,
      description,
      activityType,
      hoursSpent: parseFloat(hoursSpent),
      reach: reach ? parseInt(reach) : undefined,
      evidence,
      metadata
    });

    return NextResponse.json({
      success: true,
      activity: result.activity,
      contribution: result.contribution,
      svuEarned: result.svuResult.svuEarned,
      breakdown: result.svuResult.breakdown
    });
  } catch (error: any) {
    console.error('Error logging activity:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to log activity' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/svu/activities/:id
 * Delete an activity (before verification)
 */
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const activityId = searchParams.get('id');

    if (!activityId) {
      return NextResponse.json(
        { error: 'Activity ID required' },
        { status: 400 }
      );
    }

    await ContributionService.deleteActivity(activityId, session.user.id);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting activity:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete activity' },
      { status: 500 }
    );
  }
}
