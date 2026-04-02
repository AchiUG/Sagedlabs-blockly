
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth-config';
import { prisma } from '@/lib/db';
import Dashboard from '@/components/pages/dashboard';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  const userId = (session.user as any)?.id;
  const userRole = (session.user as any).role;

  // Redirect admins to admin dashboard
  if (userRole === 'ADMIN') {
    redirect('/admin/dashboard');
  }

  // Fetch user data
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      enrollments: {
        include: {
          course: {
            include: {
              instructor: true,
              _count: {
                select: { enrollments: true }
              }
            }
          }
        }
      },
      certificates: {
        include: {
          course: true
        }
      },
      progress: {
        include: {
          lesson: {
            include: {
              module: {
                include: {
                  course: true
                }
              }
            }
          }
        }
      }
    }
  });

  // Calculate dashboard stats based on role
  let dashboardData = {};

  if (userRole === 'STUDENT') {
    const totalEnrollments = user?.enrollments?.length || 0;
    const completedEnrollments = user?.enrollments?.filter(e => e.status === 'COMPLETED')?.length || 0;
    const totalTimeSpent = user?.progress?.reduce((acc, p) => acc + (p.timeSpent || 0), 0) || 0;
    const certificates = user?.certificates?.length || 0;

    dashboardData = {
      totalCourses: totalEnrollments,
      enrolledCourses: totalEnrollments,
      completedCourses: completedEnrollments,
      certificates,
      totalTimeSpent: Math.round(totalTimeSpent / 60), // Convert minutes to hours
      recentCourses: user?.enrollments?.slice(0, 3) || [],
      recentProgress: user?.progress?.slice(-5) || []
    };
  } else if (userRole === 'INSTRUCTOR') {
    const instructorCourses = await prisma.course.findMany({
      where: { instructorId: userId },
      include: {
        _count: {
          select: { enrollments: true }
        },
        enrollments: {
          include: {
            user: true
          }
        }
      }
    });

    const totalStudents = instructorCourses.reduce((acc, course) => acc + course.enrollments.length, 0);
    const publishedCourses = instructorCourses.filter(c => c.isPublished).length;

    dashboardData = {
      totalCourses: instructorCourses.length,
      publishedCourses,
      totalStudents,
      averageRating: 4.7, // Mock data
      courses: instructorCourses
    };
  }

  return (
    <Dashboard 
      user={user} 
      session={session} 
      dashboardData={dashboardData}
      userRole={userRole} 
    />
  );
}
