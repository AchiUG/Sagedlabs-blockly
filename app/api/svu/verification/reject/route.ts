
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { VerificationService } from '@/lib/services/verification.service';

/**
 * POST /api/svu/verification/reject
 * Reject a verification (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { verificationId, reason } = body;

    if (!verificationId || !reason) {
      return NextResponse.json(
        { error: 'Verification ID and reason required' },
        { status: 400 }
      );
    }

    const verification = await VerificationService.rejectVerification(
      verificationId,
      session.user.id,
      reason
    );

    return NextResponse.json({
      success: true,
      verification
    });
  } catch (error: any) {
    console.error('Error rejecting verification:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to reject verification' },
      { status: 500 }
    );
  }
}
