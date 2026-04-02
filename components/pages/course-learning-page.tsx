
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/navigation/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BookOpen,
  CheckCircle,
  Clock,
  PlayCircle,
  FileText,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  ExternalLink,
  Video,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface CourseLearningPageProps {
  course: any;
  enrollment: any;
  userProgress: any[];
  session: any;
}

export default function CourseLearningPage({
  course,
  enrollment,
  userProgress,
  session,
}: CourseLearningPageProps) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentLessonId, setCurrentLessonId] = useState<string | null>(null);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(
    new Set(userProgress.filter(p => p.completed).map(p => p.lessonId))
  );

  // Get all lessons from all modules
  const allLessons = course.modules.flatMap((module: any) =>
    module.lessons.map((lesson: any) => ({
      ...lesson,
      moduleTitle: module.title,
      moduleOrder: module.order,
    }))
  );

  // Set initial lesson if not set
  useEffect(() => {
    if (!currentLessonId && allLessons.length > 0) {
      // Find the first incomplete lesson, or the first lesson if all are complete
      const firstIncomplete = allLessons.find(
        (lesson: any) => !completedLessons.has(lesson.id)
      );
      setCurrentLessonId(firstIncomplete?.id || allLessons[0].id);
    }
  }, [currentLessonId, allLessons, completedLessons]);

  const currentLesson = allLessons.find((l: any) => l.id === currentLessonId);
  const currentLessonIndex = allLessons.findIndex((l: any) => l.id === currentLessonId);
  const totalLessons = allLessons.length;
  const progressPercentage = Math.round((completedLessons.size / totalLessons) * 100);

  const handleMarkComplete = async () => {
    if (!currentLessonId) return;

    try {
      const response = await fetch('/api/user/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId: currentLessonId,
          completed: true,
        }),
      });

      if (response.ok) {
        setCompletedLessons(prev => new Set([...prev, currentLessonId]));
        toast.success('Lesson marked as complete!');

        // Auto-advance to next lesson
        if (currentLessonIndex < totalLessons - 1) {
          setTimeout(() => {
            const nextLesson = allLessons[currentLessonIndex + 1];
            setCurrentLessonId(nextLesson.id);
          }, 1000);
        } else {
          toast.success('🎉 Congratulations! You completed all lessons!');
        }
      }
    } catch (error) {
      toast.error('Failed to mark lesson as complete');
    }
  };

  const handlePreviousLesson = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonId(allLessons[currentLessonIndex - 1].id);
    }
  };

  const handleNextLesson = () => {
    if (currentLessonIndex < totalLessons - 1) {
      setCurrentLessonId(allLessons[currentLessonIndex + 1].id);
    }
  };

  // Check if URL is a SharePoint/OneDrive link
  const isSharePointUrl = (url: string) => {
    return url.includes('sharepoint.com') || url.includes('onedrive.live.com') || url.includes('1drv.ms');
  };

  // Extract video/embed URL from videoUrl or content
  const getVideoEmbedUrl = (lesson: any) => {
    const url = lesson.videoUrl || '';
    if (!url) return '';
    
    // YouTube
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
    }
    
    // Vimeo
    if (url.includes('vimeo.com')) {
      const videoId = url.match(/vimeo\.com\/(\d+)/)?.[1];
      return videoId ? `https://player.vimeo.com/video/${videoId}` : '';
    }
    
    // SharePoint/OneDrive - return the raw URL (handled separately in the UI)
    if (isSharePointUrl(url)) {
      return url;
    }
    
    // Other direct links
    return url;
  };

  const videoEmbedUrl = currentLesson ? getVideoEmbedUrl(currentLesson) : '';
  const isExternalVideo = currentLesson?.videoUrl ? isSharePointUrl(currentLesson.videoUrl) : false;
  const isLessonComplete = currentLessonId ? completedLessons.has(currentLessonId) : false;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="flex h-[calc(100vh-64px)]">
        {/* Sidebar - Course Content */}
        <div
          className={`${
            sidebarOpen ? 'w-80' : 'w-0'
          } transition-all duration-300 border-r border-gray-200 bg-white overflow-hidden flex flex-col`}
        >
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-900 truncate">{course.title}</h3>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Progress</span>
                <span className="font-medium">{progressPercentage}%</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
              <p className="text-xs text-gray-500">
                {completedLessons.size} of {totalLessons} lessons completed
              </p>
            </div>
          </div>

          {/* Lesson List */}
          <div className="flex-1 overflow-y-auto">
            {course.modules.map((module: any) => (
              <div key={module.id} className="border-b border-gray-200">
                <div className="p-4 bg-gray-50">
                  <h4 className="font-semibold text-gray-900 text-sm">
                    {module.title}
                  </h4>
                  <p className="text-xs text-gray-600 mt-1">
                    {module.lessons.length} lessons
                  </p>
                </div>
                <div className="divide-y divide-gray-100">
                  {module.lessons.map((lesson: any) => {
                    const isComplete = completedLessons.has(lesson.id);
                    const isCurrent = lesson.id === currentLessonId;

                    return (
                      <button
                        key={lesson.id}
                        onClick={() => setCurrentLessonId(lesson.id)}
                        className={`w-full p-3 text-left hover:bg-gray-50 transition-colors ${
                          isCurrent ? 'bg-orange-50 border-l-4 border-orange-600' : ''
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 mt-0.5">
                            {isComplete ? (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            ) : (
                              <PlayCircle className={`w-5 h-5 ${isCurrent ? 'text-orange-600' : 'text-gray-400'}`} />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium ${isCurrent ? 'text-orange-900' : 'text-gray-900'} line-clamp-2`}>
                              {lesson.title}
                            </p>
                            {lesson.duration && (
                              <p className="text-xs text-gray-500 mt-1 flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                {lesson.duration} min
                              </p>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Bar */}
          <div className="p-4 bg-white border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {!sidebarOpen && (
                  <button
                    onClick={() => setSidebarOpen(true)}
                    className="p-2 hover:bg-gray-100 rounded"
                  >
                    <Menu className="w-5 h-5" />
                  </button>
                )}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {currentLesson?.title || 'Select a lesson'}
                  </h2>
                  {currentLesson && (
                    <p className="text-sm text-gray-600">
                      Lesson {currentLessonIndex + 1} of {totalLessons}
                    </p>
                  )}
                </div>
              </div>
              <Link href={`/courses/${course.id}`}>
                <Button variant="outline" size="sm">
                  Exit Course
                </Button>
              </Link>
            </div>
          </div>

          {/* Video Player / Content Area */}
          <div className="flex-1 overflow-y-auto bg-black">
            {currentLesson ? (
              <div className="h-full flex flex-col">
                {videoEmbedUrl && isExternalVideo ? (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center p-10 max-w-lg mx-4">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-orange-500/30">
                        <Video className="w-12 h-12 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-3">
                        {currentLesson.title}
                      </h3>
                      <p className="text-gray-400 mb-8 text-base">
                        This video is hosted externally. Click the button below to watch it.
                      </p>
                      <a
                        href={videoEmbedUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 text-lg"
                      >
                        <PlayCircle className="w-6 h-6" />
                        Watch Video
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    </div>
                  </div>
                ) : videoEmbedUrl ? (
                  <div className="flex-1 flex items-center justify-center">
                    <iframe
                      src={videoEmbedUrl}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={currentLesson.title}
                    />
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center p-8 bg-gray-900 rounded-lg max-w-2xl mx-4">
                      <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-white mb-2">
                        No Video Available
                      </h3>
                      <p className="text-gray-400 mb-4">
                        {currentLesson.content || 'This lesson does not have video content yet.'}
                      </p>
                      <p className="text-sm text-gray-500">
                        Contact your instructor to add video content for this lesson.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-white">
                <div className="text-center">
                  <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-400">Select a lesson to start learning</p>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Controls */}
          {currentLesson && (
            <div className="p-4 bg-white border-t border-gray-200">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="resources">Resources</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="space-y-4">
                  {currentLesson.content && (
                    <div className="prose max-w-none">
                      <p className="text-gray-700">{currentLesson.content}</p>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="resources">
                  <p className="text-gray-600 text-sm">
                    No additional resources available for this lesson.
                  </p>
                </TabsContent>
              </Tabs>

              <div className="flex items-center justify-between mt-4">
                <Button
                  variant="outline"
                  onClick={handlePreviousLesson}
                  disabled={currentLessonIndex === 0}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </Button>

                <Button
                  onClick={handleMarkComplete}
                  disabled={isLessonComplete}
                  className={isLessonComplete ? 'bg-green-600' : 'saged-button'}
                >
                  {isLessonComplete ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Completed
                    </>
                  ) : (
                    'Mark as Complete'
                  )}
                </Button>

                <Button
                  variant="outline"
                  onClick={handleNextLesson}
                  disabled={currentLessonIndex === totalLessons - 1}
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
