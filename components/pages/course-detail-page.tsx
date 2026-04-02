
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Header from '@/components/navigation/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Clock, 
  Users, 
  Star,
  Play,
  CheckCircle,
  ChevronRight,
  Award,
  Target,
  User,
  Calendar,
  PlayCircle,
  FileText,
  BarChart3
} from 'lucide-react';

interface CourseDetailPageProps {
  course: any;
  session: any;
  enrollment: any;
  userProgress: any[];
  isAuthenticated: boolean;
}

export default function CourseDetailPage({ course, session, enrollment, userProgress, isAuthenticated }: CourseDetailPageProps) {
  const router = useRouter();
  const [isEnrolling, setIsEnrolling] = useState(false);

  const isEnrolled = !!enrollment;
  const totalLessons = isAuthenticated && course?.modules?.reduce((acc: number, module: any) => acc + (module.lessons?.length || 0), 0) || 0;
  const completedLessons = userProgress?.filter(p => p.completed)?.length || 0;
  const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const handleEnroll = async () => {
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    setIsEnrolling(true);
    try {
      const response = await fetch(`/api/courses/${course.id}/enroll`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Navigate to the course learning page after successful enrollment
        router.push(`/courses/${course.id}/learn`);
      } else {
        const error = await response.json();
        console.error('Enrollment failed:', error);
        setIsEnrolling(false);
      }
    } catch (error) {
      console.error('Enrollment error:', error);
      setIsEnrolling(false);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: course?.title || 'AI Course',
      text: course?.shortDescription || course?.description || 'Check out this AI course!',
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback to copying URL to clipboard
        await navigator.clipboard.writeText(window.location.href);
        alert('Course URL copied to clipboard!');
      }
    } catch (error) {
      // Fallback: copy URL to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('Course URL copied to clipboard!');
      } catch (clipboardError) {
        console.error('Failed to share course:', error);
      }
    }
  };

  const getLevelBadgeVariant = (level: string) => {
    switch (level) {
      case 'BEGINNER': return 'success';
      case 'INTERMEDIATE': return 'default';
      case 'ADVANCED': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Course Hero Section */}
      <section className="saged-hero-gradient py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <div className="flex items-center space-x-4">
                <Badge variant={getLevelBadgeVariant(course.level)}>
                  {course.level.toLowerCase()}
                </Badge>
                {course.category && (
                  <Badge variant="outline">
                    {course.category.name}
                  </Badge>
                )}
                {isEnrolled && (
                  <Badge variant="success">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Enrolled
                  </Badge>
                )}
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                {course.title}
              </h1>
              
              <p className="text-xl text-gray-700 leading-relaxed">
                {course.shortDescription || course.description}
              </p>

              <div className="flex items-center space-x-6 text-gray-600">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>{course._count?.enrollments || 0} students</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  <span>4.8 rating</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                {session ? (
                  isEnrolled ? (
                    <div className="space-y-4 w-full sm:w-auto">
                      <div className="flex items-center space-x-4">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">Progress</span>
                            <span className="text-sm font-medium text-gray-700">{progressPercentage}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div 
                              className="bg-orange-600 h-3 rounded-full transition-all duration-500"
                              style={{ width: `${progressPercentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                      <Link href={`/courses/${course.id}/learn`} className="block">
                        <Button size="lg" className="saged-button w-full sm:w-auto">
                          <Play className="w-5 h-5 mr-2" />
                          Continue Learning
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <Button 
                      size="lg" 
                      className="saged-button"
                      onClick={handleEnroll}
                      disabled={isEnrolling}
                    >
                      {isEnrolling ? 'Starting...' : 'Start Course'}
                    </Button>
                  )
                ) : (
                  <Link href="/auth/signup">
                    <Button size="lg" className="saged-button">
                      Join Now to Access
                    </Button>
                  </Link>
                )}
                <Button size="lg" variant="outline" onClick={handleShare}>
                  Share Course
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={course.imageUrl || '/placeholder-course.png'}
                  alt={course.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <Play className="w-10 h-10 text-white ml-1" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <Card className="saged-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-orange-600" />
                  <span>About This Course</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 leading-relaxed">{course.description}</p>
                
                {course.prerequisites && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Prerequisites</h4>
                    <p className="text-gray-700">{course.prerequisites}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Learning Objectives */}
            {course.learningObjectives && course.learningObjectives.length > 0 && (
              <Card className="saged-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Award className="w-5 h-5 text-orange-600" />
                    <span>What You'll Learn</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {course.learningObjectives.map((objective: string, index: number) => (
                      <li key={index} className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{objective}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Course Curriculum */}
            <Card className="saged-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5 text-orange-600" />
                  <span>Course Curriculum</span>
                </CardTitle>
                <CardDescription>
                  {isAuthenticated ? (
                    `${course.modules?.length || 0} modules • ${totalLessons} lessons`
                  ) : (
                    `${course._count?.modules || 0} modules • Sign in to see full details`
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isAuthenticated ? (
                  // Full curriculum for authenticated users
                  course.modules?.map((module: any, moduleIndex: number) => (
                    <div key={module.id} className="border border-gray-200 rounded-lg">
                      <div className="p-4 bg-gray-50 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-gray-900">
                            Module {moduleIndex + 1}: {module.title}
                          </h4>
                          <span className="text-sm text-gray-600">
                            {module.lessons?.length || 0} lessons
                          </span>
                        </div>
                        {module.description && (
                          <p className="text-sm text-gray-600 mt-1">{module.description}</p>
                        )}
                      </div>
                      <div className="p-4 space-y-3">
                        {module.lessons?.map((lesson: any, lessonIndex: number) => {
                          const isCompleted = userProgress.some(p => p.lessonId === lesson.id && p.completed);
                          return (
                            <div key={lesson.id} className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="flex-shrink-0">
                                  {isEnrolled ? (
                                    isCompleted ? (
                                      <CheckCircle className="w-5 h-5 text-green-600" />
                                    ) : (
                                      <PlayCircle className="w-5 h-5 text-orange-600" />
                                    )
                                  ) : (
                                    <PlayCircle className="w-5 h-5 text-gray-400" />
                                  )}
                                </div>
                                <div>
                                  <h5 className="font-medium text-gray-900">{lesson.title}</h5>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2 text-sm text-gray-600">
                                {lesson.duration && (
                                  <>
                                    <Clock className="w-4 h-4" />
                                    <span>{lesson.duration} min</span>
                                  </>
                                )}
                              </div>
                            </div>
                          );
                        })}
                        {module.assignments?.map((assignment: any) => (
                          <div key={assignment.id} className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <FileText className="w-5 h-5 text-blue-600" />
                              <div>
                                <h5 className="font-medium text-gray-900">{assignment.title}</h5>
                                <p className="text-sm text-gray-600">{assignment.type}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  // Preview for non-authenticated users (first 3 modules, no lessons shown)
                  <>
                    {course.modules?.map((module: any, moduleIndex: number) => (
                      <div key={module.id} className="border border-gray-200 rounded-lg bg-gray-50">
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-gray-900">
                              Module {moduleIndex + 1}: {module.title}
                            </h4>
                            <span className="text-sm text-gray-600">
                              {module._count?.lessons || 0} lessons
                            </span>
                          </div>
                          {module.description && (
                            <p className="text-sm text-gray-600">{module.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                    {course._count?.modules > 3 && (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50">
                        <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <h4 className="font-semibold text-gray-900 mb-2">
                          {course._count.modules - 3} More Modules Available
                        </h4>
                        <p className="text-gray-600 mb-4">
                          Sign in to view the complete course curriculum with all lessons and assignments
                        </p>
                        <Link href="/auth/signin">
                          <Button className="saged-button">
                            Sign In to View Full Curriculum
                          </Button>
                        </Link>
                      </div>
                    )}
                    {course._count?.modules <= 3 && (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50">
                        <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <h4 className="font-semibold text-gray-900 mb-2">
                          View Detailed Lessons & Assignments
                        </h4>
                        <p className="text-gray-600 mb-4">
                          Sign in to see complete lesson details, video content, and assignments
                        </p>
                        <Link href="/auth/signin">
                          <Button className="saged-button">
                            Sign In to View Full Details
                          </Button>
                        </Link>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Instructor */}
            <Card className="saged-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-orange-600" />
                  <span>Instructor</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{course.instructor?.name}</h4>
                    <p className="text-sm text-gray-600">AI & ML Expert</p>
                  </div>
                </div>
                {course.instructor?.bio && (
                  <p className="text-sm text-gray-700 leading-relaxed">{course.instructor.bio}</p>
                )}
              </CardContent>
            </Card>

            {/* Course Stats */}
            <Card className="saged-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-orange-600" />
                  <span>Course Stats</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-medium">{course.duration}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Level</span>
                  <Badge variant={getLevelBadgeVariant(course.level)}>
                    {course.level.toLowerCase()}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Students</span>
                  <span className="font-medium">{course._count?.enrollments || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Rating</span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="font-medium">4.8</span>
                  </div>
                </div>
                {course.price > 0 && (
                  <div className="flex items-center justify-between border-t pt-4">
                    <span className="text-gray-600">Price</span>
                    <span className="text-2xl font-bold text-gray-900">${course.price}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Start Learning Card for Mobile */}
            {!isEnrolled && (
              <div className="lg:hidden">
                <Card className="saged-card">
                  <CardContent className="p-6">
                    {session ? (
                      <Button 
                        size="lg" 
                        className="w-full saged-button"
                        onClick={handleEnroll}
                        disabled={isEnrolling}
                      >
                        {isEnrolling ? 'Starting...' : 'Start Learning'}
                      </Button>
                    ) : (
                      <Link href="/auth/signup">
                        <Button size="lg" className="w-full saged-button">
                          Join Now to Access
                        </Button>
                      </Link>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
