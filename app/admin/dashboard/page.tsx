
import { requireAdmin } from '@/lib/admin-auth';
import { prisma } from '@/lib/db';
import SAGEAdminChatbot from '@/components/sage-admin-chatbot';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, TrendingUp, DollarSign } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getAdminStats() {
  const [
    totalUsers,
    totalCourses,
    totalEnrollments,
    activeEnrollments,
    recentUsers,
    recentEnrollments,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.course.count(),
    prisma.enrollment.count(),
    prisma.enrollment.count({
      where: { status: 'ACTIVE' }
    }),
    prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      }
    }),
    prisma.enrollment.findMany({
      take: 5,
      orderBy: { enrolledAt: 'desc' },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          }
        },
        course: {
          select: {
            title: true,
          }
        }
      }
    }),
  ]);

  return {
    totalUsers,
    totalCourses,
    totalEnrollments,
    activeEnrollments,
    recentUsers,
    recentEnrollments,
  };
}

export default async function AdminDashboardPage() {
  const session = await requireAdmin();
  const stats = await getAdminStats();

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      description: 'Registered students and instructors',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Total Courses',
      value: stats.totalCourses,
      icon: BookOpen,
      description: 'Available in curriculum',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Active Enrollments',
      value: stats.activeEnrollments,
      icon: TrendingUp,
      description: 'Students currently learning',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Total Enrollments',
      value: stats.totalEnrollments,
      icon: DollarSign,
      description: 'All time enrollments',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">
          Welcome back, {session.user?.name || 'Administrator'}! Here's an overview of your platform.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="saged-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className={`w-10 h-10 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <p className="text-xs text-gray-500">{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* SAGE Admin Assistant - Takes 2 columns */}
        <div className="lg:col-span-2">
          <SAGEAdminChatbot />
        </div>

        {/* Recent Activity */}
        <div className="space-y-6">
          {/* Recent Users */}
          <Card className="saged-card">
            <CardHeader>
              <CardTitle className="text-lg">Recent Users</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {stats.recentUsers.length > 0 ? (
                stats.recentUsers.map((user) => (
                  <div key={user.id} className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {user.name || 'Unnamed User'}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${
                      user.role === 'ADMIN' 
                        ? 'bg-red-50 text-red-700' 
                        : user.role === 'INSTRUCTOR'
                        ? 'bg-blue-50 text-blue-700'
                        : 'bg-gray-50 text-gray-700'
                    }`}>
                      {user.role}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">No users yet</p>
              )}
            </CardContent>
          </Card>

          {/* Recent Enrollments */}
          <Card className="saged-card">
            <CardHeader>
              <CardTitle className="text-lg">Recent Enrollments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {stats.recentEnrollments.length > 0 ? (
                stats.recentEnrollments.map((enrollment) => (
                  <div key={enrollment.id} className="space-y-1">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {enrollment.course.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {enrollment.user.name || enrollment.user.email}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">No enrollments yet</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
