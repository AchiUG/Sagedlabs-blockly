import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { prisma } from '@/lib/db';
import CoursesCatalogPage from '@/components/pages/courses-catalog-page';
import { redirect } from 'next/navigation';

export default async function Courses() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  // Fetch all courses
  const courses = await prisma.course.findMany({
    include: {
      instructor: {
        select: {
          id: true,
          name: true,
          firstName: true,
          lastName: true,
        },
      },
      modules: {
        include: {
          lessons: true,
        },
      },
      _count: {
        select: {
          enrollments: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  // Fetch user enrollments
  const enrollments = await prisma.enrollment.findMany({
    where: {
      userId: session.user.id,
    },
    select: {
      courseId: true,
    },
  });

  const enrolledCourseIds = enrollments.map((e) => e.courseId);

  return (
    <CoursesCatalogPage
      courses={courses}
      enrolledCourseIds={enrolledCourseIds}
      session={session}
      isTestUser={session.user.email === 'test@sagedlabs.com'}
    />
  );
}
