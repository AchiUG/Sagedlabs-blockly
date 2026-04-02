export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import { prisma } from '@/lib/db';

const YOUNG_SAGES_GROUP_CODE = 'YS-S01';
const YOUNG_SAGES_COURSE_TITLE = 'Young Sages: Stories, Systems & Introduction to AI Thinking';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, firstName, lastName } = body;

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
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

    // Find or create the Young Sages group
    let group = await prisma.group.findUnique({
      where: { code: YOUNG_SAGES_GROUP_CODE }
    });

    // Find the Young Sages course
    const course = await prisma.course.findFirst({
      where: { title: YOUNG_SAGES_COURSE_TITLE }
    });

    if (!group) {
      // Create the group if it doesn't exist
      group = await prisma.group.create({
        data: {
          code: YOUNG_SAGES_GROUP_CODE,
          name: 'Young Sages Season 1',
          description: 'First cohort of Young Sages learners (ages 8-14)',
          courseId: course?.id || null,
          isActive: true,
        }
      });
    }

    // Check if group has capacity limit and if it's full
    if (group.maxMembers) {
      const memberCount = await prisma.user.count({
        where: { groupId: group.id }
      });
      if (memberCount >= group.maxMembers) {
        return NextResponse.json(
          { error: 'This cohort is currently full. Please check back later or contact support.' },
          { status: 400 }
        );
      }
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 12);

    // Create user with group assignment
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        name: `${firstName} ${lastName}`,
        role: 'STUDENT',
        groupId: group.id,
        archetype: 'young_sage',
        pathwayType: 'young_sage',
      }
    });

    // Auto-enroll in the Young Sages course if it exists
    if (course) {
      await prisma.enrollment.create({
        data: {
          userId: user.id,
          courseId: course.id,
          status: 'ACTIVE',
          progress: 0,
        }
      });
    }

    // Initialize gamification for the user
    try {
      await prisma.userGamification.create({
        data: {
          userId: user.id,
          totalXP: 0,
          currentLevel: 1,
          currentStage: 1,
          stageTitle: 'Seeker',
          streakDays: 0,
        }
      });
    } catch (e) {
      // Gamification record might already exist, ignore error
    }

    return NextResponse.json({
      message: 'Account created successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        groupCode: YOUNG_SAGES_GROUP_CODE,
      }
    });

  } catch (error: any) {
    console.error('Young Sages signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
