
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      email,
      password,
      firstName,
      lastName,
      archetype,
      archetypeSecondary,
      pathwayType,
      subscriptionTier,
      walletEnabled
    } = body;

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!archetype || !pathwayType || !subscriptionTier) {
      return NextResponse.json(
        { error: 'Archetype, pathway, and subscription are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 12);

    // Create user with full journey data
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        name: `${firstName} ${lastName}`,
        role: 'STUDENT',
        archetype,
        archetypeSecondary,
        pathwayType,
        subscriptionTier,
        subscriptionStatus: 'active',
        subscriptionStartDate: new Date(),
        onboardingCompleted: false,
        onboardingStep: 'welcome',
        walletEnabled: walletEnabled || false,
      }
    });

    // Initialize user gamification
    await prisma.userGamification.create({
      data: {
        userId: user.id,
        totalXP: 0,
        currentLevel: 1,
        currentStage: 1,
        stageTitle: 'Seeker',
        streakDays: 0,
        lastActiveDate: new Date(),
      }
    });

    // Initialize token balance with welcome tokens (10 SAGE tokens)
    await prisma.tokenBalance.create({
      data: {
        userId: user.id,
        sageTokens: 10,
        reflectionTokens: 0,
        lifetimeTokens: 10,
      }
    });

    // Record the welcome token transaction
    await prisma.tokenTransaction.create({
      data: {
        userId: user.id,
        amount: 10,
        tokenType: 'SAGE',
        reason: 'Welcome bonus - Join SAGED community',
        metadata: JSON.stringify({
          archetype,
          pathwayType,
          subscriptionTier
        })
      }
    });

    return NextResponse.json({
      message: 'User created successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        archetype: user.archetype,
        pathwayType: user.pathwayType,
        subscriptionTier: user.subscriptionTier,
      }
    });

  } catch (error: any) {
    console.error('Signup with journey error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
