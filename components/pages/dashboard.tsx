
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/navigation/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SAGEbotChatbot from '@/components/sagebot-chatbot';
import { 
  BookOpen, 
  Users, 
  Award, 
  Clock, 
  TrendingUp, 
  Play,
  CheckCircle,
  Star,
  BarChart3,
  PlusCircle,
  GraduationCap,
  Target
} from 'lucide-react';
import { GamificationWidget } from '@/components/gamification/gamification-widget';

interface DashboardProps {
  user: any;
  session: any;
  dashboardData: any;
  userRole: string;
}

export default function Dashboard({ user, session, dashboardData, userRole }: DashboardProps) {
  const renderStudentDashboard = () => (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="relative saged-hero-gradient rounded-2xl p-8 overflow-hidden">
        <div className="absolute inset-0 african-pattern"></div>
        <div className="relative">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.firstName}! 👋
          </h1>
          <p className="text-gray-700 mb-4">
            Continue your AI learning journey and track your progress.
          </p>
          <div className="flex flex-wrap gap-4 mt-4">
            <Link href="/courses">
              <Button variant="outline" className="bg-white/50 hover:bg-white border-orange-200">
                <BookOpen className="w-4 h-4 mr-2" />
                Browse Full Catalog
              </Button>
            </Link>
            <Link href="/my-learning">
              <Button variant="outline" className="bg-white/50 hover:bg-white border-orange-200">
                <Target className="w-4 h-4 mr-2" />
                My Learning Path
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Enrolled Courses', value: dashboardData.enrolledCourses, icon: BookOpen, color: 'orange' },
          { label: 'Completed', value: dashboardData.completedCourses, icon: CheckCircle, color: 'green' },
          { label: 'Certificates', value: dashboardData.certificates, icon: Award, color: 'amber' },
          { label: 'Hours Studied', value: dashboardData.totalTimeSpent, icon: Clock, color: 'blue' }
        ].map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="saged-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                      <IconComponent className={`w-6 h-6 text-${stat.color}-600`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Gamification Widget */}
      <GamificationWidget />

      {/* Current Courses */}
      <Card className="saged-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <GraduationCap className="w-5 h-5 text-orange-600" />
                <span>Continue Learning</span>
              </CardTitle>
              <CardDescription>Your current courses and progress</CardDescription>
            </div>
            <Link href="/my-learning">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {dashboardData.recentCourses?.length > 0 ? (
            dashboardData.recentCourses.map((enrollment: any) => (
              <div key={enrollment.id} className="flex items-center space-x-4 p-4 border border-orange-100 rounded-lg hover:bg-orange-50 transition-colors">
                <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                  <Image
                    src={enrollment.course.imageUrl || '/placeholder-course.png'}
                    alt={enrollment.course.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{enrollment.course.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    by {enrollment.course.instructor.name}
                  </p>
                  <div className="flex items-center space-x-4">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${enrollment.progress}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {Math.round(enrollment.progress)}%
                    </span>
                  </div>
                </div>
                <Link href={`/courses/${enrollment.course.id}`}>
                  <Button size="sm" variant="ghost">
                    <Play className="w-4 h-4 mr-1" />
                    Continue
                  </Button>
                </Link>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No courses enrolled yet</p>
              <Link href="/courses">
                <Button className="saged-button">Browse Courses</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* SAGEbot AI Assistant */}
      <SAGEbotChatbot />
    </div>
  );

  const renderInstructorDashboard = () => (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="relative saged-hero-gradient rounded-2xl p-8 overflow-hidden">
        <div className="absolute inset-0 african-pattern"></div>
        <div className="relative flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome, {user?.firstName}! 👨‍🏫
            </h1>
            <p className="text-gray-700">
              Manage your courses and track student progress.
            </p>
          </div>
          <Link href="/instructor/courses/new">
            <Button className="saged-button">
              <PlusCircle className="w-4 h-4 mr-2" />
              Create Course
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Courses', value: dashboardData.totalCourses, icon: BookOpen, color: 'orange' },
          { label: 'Published', value: dashboardData.publishedCourses, icon: CheckCircle, color: 'green' },
          { label: 'Total Students', value: dashboardData.totalStudents, icon: Users, color: 'blue' },
          { label: 'Avg. Rating', value: dashboardData.averageRating, icon: Star, color: 'yellow' }
        ].map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="saged-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                      <IconComponent className={`w-6 h-6 text-${stat.color}-600`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* My Courses */}
      <Card className="saged-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-orange-600" />
                <span>My Courses</span>
              </CardTitle>
              <CardDescription>Manage and monitor your course offerings</CardDescription>
            </div>
            <Link href="/instructor/courses">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {dashboardData.courses?.slice(0, 3)?.map((course: any) => (
            <div key={course.id} className="flex items-center space-x-4 p-4 border border-orange-100 rounded-lg hover:bg-orange-50 transition-colors">
              <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                <Image
                  src={course.imageUrl || '/placeholder-course.png'}
                  alt={course.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{course.title}</h3>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                  <span>{course._count.enrollments} students</span>
                  <Badge variant={course.isPublished ? 'success' : 'secondary'}>
                    {course.isPublished ? 'Published' : 'Draft'}
                  </Badge>
                </div>
              </div>
              <div className="flex space-x-2">
                <Link href={`/instructor/courses/${course.id}/edit`}>
                  <Button size="sm" variant="outline">Edit</Button>
                </Link>
                <Link href={`/instructor/courses/${course.id}/analytics`}>
                  <Button size="sm" variant="ghost">
                    <BarChart3 className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          )) || (
            <div className="text-center py-8">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No courses created yet</p>
              <Link href="/instructor/courses/new">
                <Button className="saged-button">
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Create Your First Course
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderAdminDashboard = () => (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="relative saged-hero-gradient rounded-2xl p-8 overflow-hidden">
        <div className="absolute inset-0 african-pattern"></div>
        <div className="relative">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Dashboard 🚀
          </h1>
          <p className="text-gray-700">
            Monitor platform performance and manage system settings.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
        {[
          { label: 'Total Users', value: dashboardData.totalUsers, icon: Users, color: 'blue' },
          { label: 'Total Courses', value: dashboardData.totalCourses, icon: BookOpen, color: 'orange' },
          { label: 'Enrollments', value: dashboardData.totalEnrollments, icon: Target, color: 'green' },
          { label: 'Active Users', value: dashboardData.activeUsers, icon: TrendingUp, color: 'purple' },
          { label: 'Revenue', value: `$${dashboardData.revenue?.toLocaleString()}`, icon: Award, color: 'yellow' }
        ].map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="saged-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                      <IconComponent className={`w-6 h-6 text-${stat.color}-600`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card className="saged-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-orange-600" />
            <span>Quick Actions</span>
          </CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <Link href="/admin/users" className="block">
              <Button variant="outline" className="w-full justify-start h-auto p-4">
                <Users className="w-5 h-5 mr-3" />
                <div className="text-left">
                  <div className="font-semibold">Manage Users</div>
                  <div className="text-sm text-gray-600">View and manage user accounts</div>
                </div>
              </Button>
            </Link>
            
            <Link href="/admin/courses" className="block">
              <Button variant="outline" className="w-full justify-start h-auto p-4">
                <BookOpen className="w-5 h-5 mr-3" />
                <div className="text-left">
                  <div className="font-semibold">Course Management</div>
                  <div className="text-sm text-gray-600">Review and approve courses</div>
                </div>
              </Button>
            </Link>
            
            <Link href="/admin/analytics" className="block">
              <Button variant="outline" className="w-full justify-start h-auto p-4">
                <BarChart3 className="w-5 h-5 mr-3" />
                <div className="text-left">
                  <div className="font-semibold">Analytics</div>
                  <div className="text-sm text-gray-600">Platform insights and reports</div>
                </div>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {userRole === 'STUDENT' && renderStudentDashboard()}
        {userRole === 'INSTRUCTOR' && renderInstructorDashboard()}
        {userRole === 'ADMIN' && renderAdminDashboard()}
      </main>
    </div>
  );
}
