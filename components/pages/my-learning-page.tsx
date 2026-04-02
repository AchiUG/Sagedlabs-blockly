
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/navigation/header';
import Link from 'next/link';
import Image from 'next/image';
import {
  BookOpen,
  Clock,
  Award,
  TrendingUp,
  CheckCircle,
  BookOpenCheck,
  Trophy,
  Target,
  Zap
} from 'lucide-react';

interface MyLearningPageProps {
  enrollments: any[];
  userProgress: any[];
  certificates: any[];
  gamification: any;
  userBadges: any[];
  session: any;
}

export default function MyLearningPage({
  enrollments,
  userProgress,
  certificates,
  gamification,
  userBadges,
  session
}: MyLearningPageProps) {
  // Calculate progress for each course
  const getProgress = (courseId: string) => {
    const enrollment = enrollments.find(e => e.course.id === courseId);
    if (!enrollment) return 0;
    return enrollment.progress || 0;
  };

  // Get completed lessons count
  const getCompletedLessons = (courseId: string) => {
    return userProgress.filter(
      p => p.lesson.module.courseId === courseId && p.completed
    ).length;
  };

  // Get total lessons count
  const getTotalLessons = (courseId: string) => {
    const enrollment = enrollments.find(e => e.course.id === courseId);
    if (!enrollment) return 0;
    return enrollment.course.modules.reduce(
      (acc: number, module: any) => acc + module.lessons.length,
      0
    );
  };

  // Categorize courses
  const inProgressCourses = enrollments.filter(e => {
    const progress = getProgress(e.course.id);
    return progress > 0 && progress < 100;
  });

  const notStartedCourses = enrollments.filter(e => {
    const progress = getProgress(e.course.id);
    return progress === 0;
  });

  const completedCourses = enrollments.filter(e => {
    const progress = getProgress(e.course.id);
    return progress === 100;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Learning Journey</h1>
            <p className="text-gray-600">
              Track your progress, earn badges, and continue your educational growth
            </p>
          </div>
          <Link href="/courses">
            <Button variant="outline" className="border-2">
              <BookOpen className="w-4 h-4 mr-2" />
              Browse Full Catalog
            </Button>
          </Link>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Courses</p>
                  <p className="text-2xl font-bold text-gray-900">{enrollments.length}</p>
                </div>
                <BookOpen className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">In Progress</p>
                  <p className="text-2xl font-bold text-gray-900">{inProgressCourses.length}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">{completedCourses.length}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Certificates</p>
                  <p className="text-2xl font-bold text-gray-900">{certificates.length}</p>
                </div>
                <Award className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gamification Stats */}
        {gamification && (
          <Card className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 border-none">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-white p-3 rounded-lg">
                    <Zap className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total XP</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {gamification.totalXP?.toLocaleString() || 0}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="bg-white p-3 rounded-lg">
                    <Target className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Current Level</p>
                    <p className="text-2xl font-bold text-gray-900">
                      Level {gamification.level || 1}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="bg-white p-3 rounded-lg">
                    <Trophy className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Badges Earned</p>
                    <p className="text-2xl font-bold text-gray-900">{userBadges.length}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Course Tabs */}
        <Tabs defaultValue="in-progress" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="in-progress">
              In Progress ({inProgressCourses.length})
            </TabsTrigger>
            <TabsTrigger value="not-started">
              Not Started ({notStartedCourses.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({completedCourses.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="in-progress">
            {inProgressCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {inProgressCourses.map((enrollment) => {
                  const course = enrollment.course;
                  const progress = getProgress(course.id);
                  const completedLessons = getCompletedLessons(course.id);
                  const totalLessons = getTotalLessons(course.id);

                  return (
                    <Card key={course.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between mb-2">
                          <Badge variant="secondary">{course.level}</Badge>
                          <Badge className="bg-orange-100 text-orange-700">
                            In Progress
                          </Badge>
                        </div>
                        <CardTitle className="text-xl mb-2">{course.title}</CardTitle>
                        <CardDescription className="line-clamp-2">
                          {course.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <div className="flex items-center justify-between mb-2 text-sm">
                              <span className="text-gray-600">Progress</span>
                              <span className="font-medium text-gray-900">{progress}%</span>
                            </div>
                            <Progress value={progress} className="h-2" />
                          </div>

                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <span className="flex items-center">
                              <BookOpenCheck className="w-4 h-4 mr-1" />
                              {completedLessons}/{totalLessons} lessons
                            </span>
                            <span className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {course.duration}
                            </span>
                          </div>

                          <Link href={`/courses/${course.id}/learn`}>
                            <Button className="w-full">Continue Learning</Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No courses in progress
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Start a new course to begin your learning journey
                  </p>
                  <Link href="/courses">
                    <Button>Browse Courses</Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="not-started">
            {notStartedCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {notStartedCourses.map((enrollment) => {
                  const course = enrollment.course;
                  const totalLessons = getTotalLessons(course.id);

                  return (
                    <Card key={course.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between mb-2">
                          <Badge variant="secondary">{course.level}</Badge>
                          <Badge className="bg-gray-100 text-gray-700">
                            Not Started
                          </Badge>
                        </div>
                        <CardTitle className="text-xl mb-2">{course.title}</CardTitle>
                        <CardDescription className="line-clamp-2">
                          {course.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <span className="flex items-center">
                              <BookOpenCheck className="w-4 h-4 mr-1" />
                              {totalLessons} lessons
                            </span>
                            <span className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {course.duration}
                            </span>
                          </div>

                          <Link href={`/courses/${course.id}/learn`}>
                            <Button className="w-full">Start Learning</Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    All courses started!
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Great job! You've started all your enrolled courses
                  </p>
                  <Link href="/courses">
                    <Button>Explore More Courses</Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="completed">
            {completedCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {completedCourses.map((enrollment) => {
                  const course = enrollment.course;
                  const hasCertificate = certificates.some(
                    c => c.courseId === course.id
                  );

                  return (
                    <Card key={course.id} className="hover:shadow-lg transition-shadow border-green-200">
                      <CardHeader>
                        <div className="flex items-start justify-between mb-2">
                          <Badge variant="secondary">{course.level}</Badge>
                          <Badge className="bg-green-100 text-green-700">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Completed
                          </Badge>
                        </div>
                        <CardTitle className="text-xl mb-2">{course.title}</CardTitle>
                        <CardDescription className="line-clamp-2">
                          {course.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {hasCertificate && (
                            <div className="flex items-center space-x-2 text-sm text-green-700 bg-green-50 p-3 rounded-lg">
                              <Award className="w-4 h-4" />
                              <span className="font-medium">Certificate Earned!</span>
                            </div>
                          )}

                          <div className="grid grid-cols-2 gap-2">
                            <Link href={`/courses/${course.id}`}>
                              <Button variant="outline" className="w-full" size="sm">
                                Review Course
                              </Button>
                            </Link>
                            {hasCertificate && (
                              <Link href="/certificates">
                                <Button variant="outline" className="w-full" size="sm">
                                  View Certificate
                                </Button>
                              </Link>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <CheckCircle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No completed courses yet
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Keep learning! Your completed courses will appear here
                  </p>
                  <Link href="/courses">
                    <Button>Continue Learning</Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
