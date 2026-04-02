
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth-config';
import { prisma } from '@/lib/db';
import AdminDashboard from '@/components/admin/admin-dashboard';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/auth/signin');
  }

  const userRole = (session.user as any)?.role;
  
  if (userRole !== 'ADMIN') {
    redirect('/dashboard');
  }

  // Fetch comprehensive admin statistics
  const [
    totalUsers,
    totalCourses,
    totalEnrollments,
    recentUsers,
    recentCourses,
    usersByRole,
    enrollmentStats,
    courseStats
  ] = await Promise.all([
    prisma.user.count(),
    prisma.course.count(),
    prisma.enrollment.count(),
    prisma.user.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: {
          select: { enrollments: true }
        }
      }
    }),
    prisma.course.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        instructor: {
          select: {
            name: true,
            email: true
          }
        },
        _count: {
          select: { enrollments: true }
        }
      }
    }),
    prisma.user.groupBy({
      by: ['role'],
      _count: true
    }),
    prisma.enrollment.groupBy({
      by: ['status'],
      _count: true
    }),
    prisma.course.groupBy({
      by: ['isPublished'],
      _count: true
    })
  ]);

  const adminData = {
    stats: {
      totalUsers,
      totalCourses,
      totalEnrollments,
      activeUsers: totalUsers, // All users for now
      revenue: 125000 // Mock data
    },
    recentUsers,
    recentCourses,
    usersByRole,
    enrollmentStats,
    courseStats
  };

  return <AdminDashboard data={adminData} session={session} />;
}
