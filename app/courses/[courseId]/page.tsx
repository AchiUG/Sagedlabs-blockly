
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-config';
import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import CourseDetailPage from '@/components/pages/course-detail-page';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: { courseId: string };
}

export default async function CourseDetail({ params }: PageProps) {
  const session = await getServerSession(authOptions);
  const { courseId } = params;

  // Determine if user is authenticated
  const isAuthenticated = !!session;

  // Fetch course details with conditional module/lesson data
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      instructor: {
        select: {
          name: true,
          bio: true,
          image: true
        }
      },
      category: true,
      // Only fetch full curriculum if user is authenticated
      modules: isAuthenticated ? {
        include: {
          lessons: {
            orderBy: { orderIndex: 'asc' }
          },
          assignments: {
            orderBy: { orderIndex: 'asc' }
          }
        },
        orderBy: { orderIndex: 'asc' }
      } : {
        // For non-authenticated users, only fetch module titles (first 3)
        take: 3,
        select: {
          id: true,
          title: true,
          description: true,
          orderIndex: true,
          _count: {
            select: {
              lessons: true,
              assignments: true
            }
          }
        },
        orderBy: { orderIndex: 'asc' }
      },
      _count: {
        select: { 
          enrollments: true,
          modules: true
        }
      }
    }
  });

  if (!course) {
    notFound();
  }

  // Check enrollment status
  let enrollment = null;
  let userProgress: any[] = [];

  if (session) {
    enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: (session.user as any)?.id,
          courseId: course.id
        }
      }
    });

    if (enrollment) {
      // Fetch user progress for this course
      userProgress = await prisma.progress.findMany({
        where: {
          userId: (session.user as any)?.id,
          lesson: {
            module: {
              courseId: course.id
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
    }
  }

  return (
    <CourseDetailPage 
      course={course}
      session={session}
      enrollment={enrollment}
      userProgress={userProgress}
      isAuthenticated={isAuthenticated}
    />
  );
}
