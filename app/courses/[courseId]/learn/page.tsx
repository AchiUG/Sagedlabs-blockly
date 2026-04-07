
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import CourseLearningPage from '@/components/pages/course-learning-page';

export default async function CourseLearnPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  // Fetch course with all modules and lessons
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      modules: {
        include: {
          lessons: {
            orderBy: { orderIndex: 'asc' },
          },
          assignments: true,
        },
        orderBy: { orderIndex: 'asc' },
      },
      instructor: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  if (!course) {
    redirect('/courses');
  }

  // Check enrollment
  const enrollment = await prisma.enrollment.findFirst({
    where: {
      userId: session.user.id,
      courseId: courseId,
    },
  });

  if (!enrollment) {
    redirect(`/courses/${courseId}`);
  }

  // Get user progress
  const userProgress = await prisma.progress.findMany({
    where: {
      userId: session.user.id,
      lesson: {
        module: {
          courseId: courseId,
        },
      },
    },
    include: {
      lesson: true,
    },
  });

  return (
    <CourseLearningPage
      course={course}
      enrollment={enrollment}
      userProgress={userProgress}
      session={session}
    />
  );
}
