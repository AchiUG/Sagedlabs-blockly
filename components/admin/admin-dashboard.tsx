
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/navigation/header';
import SAGEAdminChatbot from '@/components/sage-admin-chatbot';
import Link from 'next/link';
import { 
  Users, 
  BookOpen, 
  GraduationCap, 
  DollarSign, 
  TrendingUp,
  Settings,
  UserPlus,
  PlusCircle,
  Shield,
  Activity,
  Clock,
  Award
} from 'lucide-react';
import { motion } from 'framer-motion';

interface AdminDashboardProps {
  data: any;
  session: any;
}

export default function AdminDashboard({ data, session }: AdminDashboardProps) {
  const stats = [
    {
      label: 'Total Users',
      value: data.stats.totalUsers,
      icon: Users,
      color: 'blue',
      change: '+12.5%',
      link: '/admin/users'
    },
    {
      label: 'Total Courses',
      value: data.stats.totalCourses,
      icon: BookOpen,
      color: 'orange',
      change: '+8.2%',
      link: '/admin/courses'
    },
    {
      label: 'Enrollments',
      value: data.stats.totalEnrollments,
      icon: GraduationCap,
      color: 'green',
      change: '+15.3%',
      link: '/admin/enrollments'
    },
    {
      label: 'Revenue',
      value: `$${(data.stats.revenue / 1000).toFixed(0)}K`,
      icon: DollarSign,
      color: 'amber',
      change: '+23.1%',
      link: '/admin/revenue'
    }
  ];

  const roleStats = data.usersByRole.reduce((acc: any, item: any) => {
    acc[item.role] = item._count;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <Shield className="w-8 h-8 text-orange-600" />
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              </div>
              <p className="text-gray-600">
                Manage your SAGED LMS platform with full administrative access
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Link href="/admin/users">
                <Button className="bg-gradient-to-r from-orange-600 to-red-600">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add User
                </Button>
              </Link>
              <Link href="/admin/courses">
                <Button variant="outline">
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Add Course
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={stat.link}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                          <IconComponent className={`w-6 h-6 text-${stat.color}-600`} />
                        </div>
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                          {stat.change}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                      <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* User Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-orange-600" />
                <span>User Distribution</span>
              </CardTitle>
              <CardDescription>Users by role</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="text-sm font-medium">Students</span>
                <Badge variant="secondary">{roleStats.STUDENT || 0}</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <span className="text-sm font-medium">Instructors</span>
                <Badge variant="secondary">{roleStats.INSTRUCTOR || 0}</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <span className="text-sm font-medium">Admins</span>
                <Badge variant="secondary">{roleStats.ADMIN || 0}</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Enrollment Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-orange-600" />
                <span>Enrollment Status</span>
              </CardTitle>
              <CardDescription>Current enrollment distribution</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {data.enrollmentStats.map((stat: any) => (
                <div key={stat.status} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">{stat.status}</span>
                  <Badge variant="secondary">{stat._count}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Course Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-orange-600" />
                <span>Course Status</span>
              </CardTitle>
              <CardDescription>Published vs Draft courses</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {data.courseStats.map((stat: any) => (
                <div key={String(stat.isPublished)} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">
                    {stat.isPublished ? 'Published' : 'Draft'}
                  </span>
                  <Badge variant="secondary">{stat._count}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="w-5 h-5 text-orange-600" />
              <span>Quick Actions</span>
            </CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href="/admin/users">
                <Button variant="outline" className="w-full h-24 flex-col space-y-2">
                  <UserPlus className="w-6 h-6" />
                  <span>Manage Users</span>
                </Button>
              </Link>
              <Link href="/admin/courses">
                <Button variant="outline" className="w-full h-24 flex-col space-y-2">
                  <BookOpen className="w-6 h-6" />
                  <span>Manage Courses</span>
                </Button>
              </Link>
              <Link href="/admin/analytics">
                <Button variant="outline" className="w-full h-24 flex-col space-y-2">
                  <TrendingUp className="w-6 h-6" />
                  <span>View Analytics</span>
                </Button>
              </Link>
              <Link href="/admin/settings">
                <Button variant="outline" className="w-full h-24 flex-col space-y-2">
                  <Settings className="w-6 h-6" />
                  <span>Platform Settings</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Recent Users */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-orange-600" />
                  <span>Recent Users</span>
                </CardTitle>
                <CardDescription>Latest user registrations</CardDescription>
              </div>
              <Link href="/admin/users">
                <Button variant="outline" size="sm">View All</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.recentUsers.map((user: any) => (
                <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {user.name?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Badge className={
                      user.role === 'ADMIN' ? 'bg-red-100 text-red-700' :
                      user.role === 'INSTRUCTOR' ? 'bg-orange-100 text-orange-700' :
                      'bg-blue-100 text-blue-700'
                    }>
                      {user.role}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Courses */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5 text-orange-600" />
                  <span>Recent Courses</span>
                </CardTitle>
                <CardDescription>Latest course additions</CardDescription>
              </div>
              <Link href="/admin/courses">
                <Button variant="outline" size="sm">View All</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.recentCourses.map((course: any) => (
                <div key={course.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div>
                    <p className="font-medium text-gray-900">{course.title}</p>
                    <p className="text-sm text-gray-600">
                      Instructor: {course.instructor?.name || 'Not assigned'}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Badge variant="secondary">
                      {course._count.enrollments} enrollments
                    </Badge>
                    <Badge className={course.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'}>
                      {course.isPublished ? 'Published' : 'Draft'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* SAGE Admin Assistant Chatbot */}
        <SAGEAdminChatbot />
      </div>
    </div>
  );
}
