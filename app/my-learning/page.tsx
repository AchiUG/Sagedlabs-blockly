
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth-config';
import { prisma } from '@/lib/db';
import MyLearningPage from '@/components/pages/my-learning-page';

export const dynamic = 'force-dynamic';

export default async function MyLearning() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  const userId = (session.user as any)?.id;

  // Fetch enrolled courses with progress
  const enrollments = await prisma.enrollment.findMany({
    where: { userId },
    include: {
      course: {
        include: {
          instructor: {
            select: {
              name: true,
              image: true
            }
          },
          modules: {
            include: {
              lessons: true,
              assignments: true
            },
            orderBy: { orderIndex: 'asc' }
          },
          _count: {
            select: { enrollments: true }
          }
        }
      }
    },
    orderBy: { enrolledAt: 'desc' }
  });

  // Fetch user progress for all enrolled courses
  const userProgress = await prisma.progress.findMany({
    where: {
      userId,
      lesson: {
        module: {
          courseId: {
            in: enrollments.map(e => e.course.id)
          }
        }
      }
    },
    include: {
      lesson: {
        include: {
          module: true
        }
      }
    }
  });

  // Fetch certificates
  const certificates = await prisma.certificate.findMany({
    where: { userId },
    include: {
      course: true
    },
    orderBy: { issuedAt: 'desc' }
  });

  // Fetch gamification data
  const gamification = await prisma.userGamification.findUnique({
    where: { userId }
  });

  const userBadges = await prisma.userBadge.findMany({
    where: { userId },
    include: {
      badge: true
    },
    orderBy: { earnedAt: 'desc' }
  });

  return (
    <MyLearningPage
      enrollments={enrollments}
      userProgress={userProgress}
      certificates={certificates}
      gamification={gamification}
      userBadges={userBadges}
      session={session}
    />
  );
}
