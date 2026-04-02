
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { VerificationService } from '@/lib/services/verification.service';
import { TokenService } from '@/lib/services/token.service';

/**
 * POST /api/svu/verification/approve
 * Approve a verification (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { verificationId, impactScore } = body;

    if (!verificationId) {
      return NextResponse.json(
        { error: 'Verification ID required' },
        { status: 400 }
      );
    }

    const result = await VerificationService.approveVerification(
      verificationId,
      session.user.id,
      impactScore
    );

    // Auto-mint tokens for verified activity
    try {
      const activityId = result.verification.activityId;
      await TokenService.autoMintForVerifiedActivity(activityId);
    } catch (error) {
      console.error('Error auto-minting tokens:', error);
      // Don't fail the verification if token minting fails
    }

    return NextResponse.json({
      success: true,
      result
    });
  } catch (error: any) {
    console.error('Error approving verification:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to approve verification' },
      { status: 500 }
    );
  }
}
