
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth-config';
import { prisma } from '@/lib/db';
import CourseContentManagement from '@/components/admin/course-content-management';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{
    courseId: string;
  }>;
}

export default async function CourseContentPage({ params }: PageProps) {
  const { courseId } = await params;
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/auth/signin');
  }

  const userRole = (session.user as any)?.role;
  
  if (userRole !== 'ADMIN') {
    redirect('/dashboard');
  }

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      instructor: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      modules: {
        orderBy: { orderIndex: 'asc' },
        include: {
          lessons: {
            orderBy: { orderIndex: 'asc' }
          }
        }
      }
    }
  });

  if (!course) {
    redirect('/admin/courses');
  }

  return <CourseContentManagement course={course} />;
}
