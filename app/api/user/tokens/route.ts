
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get token balance
    let tokenBalance = await prisma.tokenBalance.findUnique({
      where: { userId: user.id }
    });

    // Create if doesn't exist
    if (!tokenBalance) {
      tokenBalance = await prisma.tokenBalance.create({
        data: {
          userId: user.id,
          sageTokens: 0,
          reflectionTokens: 0,
          lifetimeTokens: 0,
        }
      });
    }

    // Get recent transactions
    const transactions = await prisma.tokenTransaction.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    return NextResponse.json({
      balance: tokenBalance,
      transactions,
    });

  } catch (error: any) {
    console.error('Get tokens error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch token balance' },
      { status: 500 }
    );
  }
}
