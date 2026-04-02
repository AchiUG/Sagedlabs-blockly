
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { VerificationService } from '@/lib/services/verification.service';

/**
 * POST /api/svu/verification
 * Submit an activity for verification
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { activityId, verificationType, evidence, notes } = body;

    if (!activityId || !verificationType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const verification = await VerificationService.submitForVerification({
      activityId,
      verificationType,
      evidence,
      notes
    });

    return NextResponse.json({
      success: true,
      verification
    });
  } catch (error: any) {
    console.error('Error submitting verification:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to submit verification' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/svu/verification
 * Get pending verifications (admin only)
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');

    const verifications = await VerificationService.getPendingVerifications(limit);

    return NextResponse.json({ verifications });
  } catch (error: any) {
    console.error('Error fetching verifications:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch verifications' },
      { status: 500 }
    );
  }
}
