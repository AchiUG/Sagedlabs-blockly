import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-config";
import { prisma } from "@/lib/db";
import { XP_REWARDS } from "@/lib/gamification";

// Simulated database (in-memory for prototype)
// In production, this would use a dedicated Assessment model
const assessments: Record<string, any> = {};

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const { name, answers, mcScore, type } = body;

    const id = Math.random().toString(36).substring(2, 15);
    
    const submissionData = {
      ...body,
      id,
      userId: session?.user?.id || null,
      submittedAt: new Date().toISOString()
    };
    
    assessments[id] = submissionData;
    
    // If user is logged in, perform platform-side updates
    if (session?.user?.id) {
      const userId = session.user.id;

      // 1. Mark the final assessment lesson as complete
      // We need to find the lesson ID first
      const lesson = await prisma.lesson.findFirst({
        where: { title: 'Final Wisdom Assessment' }
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
          totalXP: { increment: XP_REWARDS.ASSIGNMENT_SUBMIT + (mcScore * 25) }
        }
      }).catch(() => {
          console.log("Gamification record not found for user", userId);
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

// Export the store for the GET route to use
export { assessments };
