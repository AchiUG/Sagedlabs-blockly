
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth-config';
import { prisma } from '@/lib/db';
import CourseManagement from '@/components/admin/course-management';

export const dynamic = 'force-dynamic';

export default async function AdminCoursesPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/auth/signin');
  }

  const userRole = (session.user as any)?.role;
  
  if (userRole !== 'ADMIN') {
    redirect('/dashboard');
  }

  const courses = await prisma.course.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      instructor: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      _count: {
        select: { 
          enrollments: true,
          modules: true
        }
      }
    }
  });

  const instructors = await prisma.user.findMany({
    where: {
      role: { in: ['INSTRUCTOR', 'ADMIN'] }
    },
    select: {
      id: true,
      name: true,
      email: true
    }
  });

  return <CourseManagement courses={courses} instructors={instructors} />;
}
