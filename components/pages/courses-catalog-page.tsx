
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Header from '@/components/navigation/header';
import {
  BookOpen,
  Clock,
  Users,
  Lock,
  CheckCircle,
  Search,
  GraduationCap,
} from 'lucide-react';

interface CoursesPageProps {
  courses: any[];
  enrolledCourseIds: string[];
  session: any;
  isTestUser: boolean;
}

export default function CoursesCatalogPage({
  courses,
  enrolledCourseIds,
  session,
  isTestUser,
}: CoursesPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');

  // Filter courses based on search and level
  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel;
    return matchesSearch && matchesLevel;
  });

  const isEnrolled = (courseId: string) => enrolledCourseIds.includes(courseId);

  const getTotalLessons = (course: any) => {
    return course.modules.reduce(
      (acc: number, module: any) => acc + module.lessons.length,
      0
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Course Catalog</h1>
          <p className="text-gray-600">
            Browse all available courses. Enroll to gain access and start learning.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="all">All Levels</option>
            <option value="BEGINNER">Beginner</option>
            <option value="INTERMEDIATE">Intermediate</option>
            <option value="ADVANCED">Advanced</option>
          </select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Courses</p>
                  <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Enrolled</p>
                  <p className="text-2xl font-bold text-gray-900">{enrolledCourseIds.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Available</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {courses.length - enrolledCourseIds.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Courses Grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => {
              const enrolled = isEnrolled(course.id);
              const totalLessons = getTotalLessons(course);
              const canAccess = isTestUser || enrolled;

              return (
                <Card
                  key={course.id}
                  className={`hover:shadow-lg transition-shadow ${
                    !canAccess ? 'opacity-75' : ''
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="secondary">{course.level}</Badge>
                      {enrolled && (
                        <Badge className="bg-green-100 text-green-700">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Enrolled
                        </Badge>
                      )}
                      {!canAccess && (
                        <Badge variant="outline" className="bg-gray-100 text-gray-700">
                          <Lock className="w-3 h-3 mr-1" />
                          Locked
                        </Badge>
                      )}
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
                          <BookOpen className="w-4 h-4 mr-1" />
                          {course.modules.length} modules
                        </span>
                        <span className="flex items-center">
                          <GraduationCap className="w-4 h-4 mr-1" />
                          {totalLessons} lessons
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {course.duration}
                        </span>
                        <span className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {course._count.enrollments} enrolled
                        </span>
                      </div>

                      {canAccess ? (
                        <Link href={`/courses/${course.id}`}>
                          <Button className="w-full">
                            {enrolled ? 'Continue Learning' : 'View Course'}
                          </Button>
                        </Link>
                      ) : (
                        <Button className="w-full" disabled>
                          <Lock className="w-4 h-4 mr-2" />
                          Enrollment Required
                        </Button>
                      )}
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
                No courses found
              </h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search or filters
              </p>
              <Button onClick={() => { setSearchQuery(''); setSelectedLevel('all'); }}>
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Information Box */}
        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  About Course Access
                </h3>
                <p className="text-gray-700">
                  Courses marked with a lock icon require enrollment to access. Contact your administrator or purchase a subscription to enroll in additional courses. 
                  {isTestUser && ' As a test user, you have access to all courses for evaluation purposes.'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
