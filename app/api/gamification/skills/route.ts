
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;

    // Get all skills
    const allSkills = await prisma.skill.findMany({
      orderBy: { orderIndex: 'asc' },
      include: {
        parentSkill: true,
        childSkills: true
      }
    });

    // Get user's skill progress
    const userProgress = await prisma.skillProgress.findMany({
      where: { userId },
      include: { skill: true }
    });

    const progressMap = new Map(userProgress.map(p => [p.skillId, p]));

    const skillsWithProgress = allSkills.map(skill => {
      const progress = progressMap.get(skill.id);
      return {
        ...skill,
        userProgress: progress || {
          xpEarned: 0,
          isUnlocked: skill.parentSkillId === null, // Root skills start unlocked
          isMastered: false,
          lastPracticed: null
        }
      };
    });

    return NextResponse.json({ skills: skillsWithProgress });
  } catch (error) {
    console.error('Error fetching skills:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const { skillId, xpToAdd } = await request.json();

    if (!skillId || !xpToAdd) {
      return NextResponse.json({ error: 'Skill ID and XP required' }, { status: 400 });
    }

    const skill = await prisma.skill.findUnique({
      where: { id: skillId }
    });

    if (!skill) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
    }

    // Get or create skill progress
    let progress = await prisma.skillProgress.findUnique({
      where: {
        userId_skillId: {
          userId,
          skillId
        }
      }
    });

    const newXP = (progress?.xpEarned || 0) + xpToAdd;
    const isMastered = newXP >= skill.requiredXP;

    progress = await prisma.skillProgress.upsert({
      where: {
        userId_skillId: {
          userId,
          skillId
        }
      },
      create: {
        userId,
        skillId,
        xpEarned: newXP,
        isUnlocked: true,
        isMastered,
        lastPracticed: new Date()
      },
      update: {
        xpEarned: newXP,
        isMastered,
        lastPracticed: new Date()
      },
      include: { skill: true }
    });

    // Unlock child skills if mastered
    if (isMastered) {
      const childSkills = await prisma.skill.findMany({
        where: { parentSkillId: skillId }
      });

      for (const childSkill of childSkills) {
        await prisma.skillProgress.upsert({
          where: {
            userId_skillId: {
              userId,
              skillId: childSkill.id
            }
          },
          create: {
            userId,
            skillId: childSkill.id,
            xpEarned: 0,
            isUnlocked: true,
            isMastered: false,
            lastPracticed: new Date()
          },
          update: {
            isUnlocked: true
          }
        });
      }
    }

    return NextResponse.json({ progress, mastered: isMastered });
  } catch (error) {
    console.error('Error updating skill progress:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
