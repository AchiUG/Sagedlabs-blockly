
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { prisma } from '@/lib/db';
import { calculateLevelFromXP, getStageFromXP } from '@/lib/gamification';
import { accredibleService } from '@/lib/accredible';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const { xp, reason } = await request.json();

    if (!xp || typeof xp !== 'number' || xp <= 0) {
      return NextResponse.json({ error: 'Invalid XP amount' }, { status: 400 });
    }

    // Get or create gamification profile
    let gamification = await prisma.userGamification.findUnique({
      where: { userId }
    });

    if (!gamification) {
      gamification = await prisma.userGamification.create({
        data: {
          userId,
          totalXP: 0,
          currentLevel: 1,
          currentStage: 1,
          stageTitle: 'Seeker',
          streakDays: 0,
          lastActiveDate: new Date()
        }
      });
    }

    const oldXP = gamification.totalXP;
    const newXP = oldXP + xp;
    const oldLevel = calculateLevelFromXP(oldXP);
    const newLevel = calculateLevelFromXP(newXP);
    const oldStage = getStageFromXP(oldXP);
    const newStage = getStageFromXP(newXP);

    // Update XP
    const updatedGamification = await prisma.userGamification.update({
      where: { userId },
      data: {
        totalXP: newXP,
        currentLevel: newLevel,
        currentStage: newStage.stage,
        stageTitle: newStage.title,
        lastActiveDate: new Date()
      }
    });

    // Check for level up or stage up
    const leveledUp = newLevel > oldLevel;
    const stagedUp = newStage.stage > oldStage.stage;

    // Auto-award stage badges
    if (stagedUp) {
      const stageBadge = await prisma.badge.findFirst({
        where: {
          category: 'SPECIAL',
          criteria: {
            contains: `"stage_reached","stage":${newStage.stage}`
          }
        }
      });

      if (stageBadge) {
        await prisma.userBadge.upsert({
          where: {
            userId_badgeId: {
              userId,
              badgeId: stageBadge.id
            }
          },
          create: {
            userId,
            badgeId: stageBadge.id,
            progress: 100
          },
          update: {}
        });
      }

      // Auto-issue certificate for stage completion
      try {
        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: { name: true, email: true }
        });

        if (user) {
          // Check if certificate already exists
          const existingCert = await prisma.certificate.findFirst({
            where: {
              userId,
              certificateType: 'STAGE',
              stageLevel: newStage.stage
            }
          });

          if (!existingCert) {
            // Create certificate via Accredible
            const recipientName = user.name || user.email;
            const accredibleResponse = await accredibleService.createCredential(
              recipientName,
              user.email,
              newStage.title,
              newStage.stage,
              new Date()
            );

            if (accredibleResponse) {
              // Save certificate to database
              await prisma.certificate.create({
                data: {
                  userId,
                  certificateType: 'STAGE',
                  stageLevel: newStage.stage,
                  stageLevelTitle: newStage.title,
                  accredibleId: accredibleResponse.credential.id,
                  verificationUrl: accredibleResponse.credential.url,
                  certificateUrl: accredibleResponse.credential.url,
                  credentialData: JSON.stringify(accredibleResponse.credential)
                }
              });
            }
          }
        }
      } catch (certError) {
        console.error('Error issuing certificate:', certError);
        // Don't fail the XP addition if certificate creation fails
      }
    }

    return NextResponse.json({
      success: true,
      gamification: updatedGamification,
      xpAdded: xp,
      reason,
      leveledUp,
      stagedUp,
      newLevel,
      newStage: newStage.title,
      certificateIssued: stagedUp
    });
  } catch (error) {
    console.error('Error adding XP:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
