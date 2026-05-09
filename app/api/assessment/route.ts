import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-config";
import { prisma } from "@/lib/db";
import { XP_REWARDS } from "@/lib/gamification";

// No longer using in-memory store for production
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const { 
      name = "Young Sage", 
      answers = {}, 
      mcScore = 0, 
      type = "young-sages-final" 
    } = body;

    const userSession = session as any;
    let validUserId = null;

    if (userSession?.user?.id) {
      const userExists = await prisma.user.findUnique({
        where: { id: userSession.user.id }
      });
      if (userExists) {
        validUserId = userExists.id;
      }
    }

    // Create the assessment in the database
    const assessment = await (prisma as any).assessment.create({
      data: {
        name,
        type,
        answers: answers as any,
        mcScore: Number(mcScore) || 0,
        userId: validUserId,
      }
    });
    
    const id = assessment.id;
    
    // If user is logged in and exists, perform platform-side updates
    if (validUserId) {
      const userId = validUserId;

      // 1. Mark the final assessment lesson as complete
      // Find the lesson in the Young Sages course
      const lesson = await prisma.lesson.findFirst({
        where: { 
          OR: [
            { title: 'Final Wisdom Assessment' },
            { title: { contains: 'Assessment' } }
          ],
          module: {
            course: {
              title: { contains: 'Young Sages' }
            }
          }
        }
      });

      if (lesson) {
        await prisma.progress.upsert({
          where: {
            userId_lessonId: {
              userId,
              lessonId: lesson.id
            }
          },
          update: { completed: true, lastAccessed: new Date() },
          create: {
            userId,
            lessonId: lesson.id,
            completed: true
          }
        });
      }

      // 2. Award XP for completing the final assessment
      await prisma.userGamification.update({
        where: { userId },
        data: {
          totalXP: { increment: XP_REWARDS.ASSIGNMENT_SUBMIT + (Number(mcScore) * 25) }
        }
      }).catch((err) => {
        console.log("Gamification record update failed or not found for user", userId, err.message);
      });

      // 3. Award "Young Sage" badge
      try {
        const badge = await prisma.badge.findUnique({
          where: { name: 'Young Sage' }
        });

        if (badge) {
          await prisma.userBadge.upsert({
            where: {
              userId_badgeId: {
                userId,
                badgeId: badge.id
              }
            },
            update: {}, // Already earned
            create: {
              userId,
              badgeId: badge.id,
              earnedAt: new Date(),
              progress: 100
            }
          });
          console.log(`Badge "Young Sage" awarded to ${userId}`);
        }
      } catch (badgeError) {
        console.error("Error awarding badge:", badgeError);
      }
    }
    
    console.log(`Assessment submitted: ${id} by ${name}`);
    
    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error("Assessment submission error:", error);
    return NextResponse.json({ success: false, error: "Failed to submit" }, { status: 500 });
  }
}
