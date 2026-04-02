import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Blocks, Sparkles, BookOpen, Target, Trophy } from 'lucide-react';

export default async function LearnPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect('/auth/signin?callbackUrl=/learn');
  }

  // Fetch all published Blocks Lab lessons
  const lessons = await prisma.blocksLesson.findMany({
    where: { isPublished: true },
    orderBy: { orderIndex: 'asc' },
    select: {
      id: true,
      slug: true,
      title: true,
      description: true,
      orderIndex: true,
    },
  });

  // Fetch user's completed submissions
  const userSubmissions = await prisma.blocksSubmission.findMany({
    where: { userId: session.user.id },
    select: { lessonId: true },
  });

  const completedLessonIds = new Set(userSubmissions.map(s => s.lessonId));

  // Separate lessons into categories
  const originalLessons = lessons.filter(l => l.orderIndex < 10);
  const youngSagesLessons = lessons.filter(l => l.orderIndex >= 10);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="bg-[#124734] text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Blocks className="h-12 w-12" />
              <h1 className="text-4xl md:text-5xl font-bold">SAGED Blocks Lab</h1>
            </div>
            <p className="text-xl text-gray-200 mb-6">
              Learn to code by snapping blocks together. No typing required!
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                <Sparkles className="h-4 w-4" />
                <span>Visual Programming</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                <BookOpen className="h-4 w-4" />
                <span>Guided Lessons</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                <Target className="h-4 w-4" />
                <span>Auto-Save</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Progress Summary */}
        <div className="mb-12 p-6 bg-gradient-to-r from-[#124734]/5 to-[#D9A441]/5 rounded-2xl border border-[#124734]/10">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-[#124734] flex items-center justify-center">
              <Trophy className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Your Progress</h2>
              <p className="text-gray-600">
                {completedLessonIds.size} of {lessons.length} lessons completed
              </p>
            </div>
            <div className="ml-auto">
              <div className="w-48 h-3 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#124734] rounded-full transition-all"
                  style={{ width: `${(completedLessonIds.size / lessons.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Young Sages Section */}
        {youngSagesLessons.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">🐰</span>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Young Sages: Leuk Adventures</h2>
                <p className="text-gray-600">Follow Leuk the Hare on your AI thinking journey</p>
              </div>
            </div>

            {/* Interactive Classroom Games Card */}
            <div className="mb-8">
              <Link href="/learn/young-sages-games">
                <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 hover:border-amber-400 hover:shadow-xl transition-all cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-6">
                      <div className="text-6xl">🎴</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-amber-500 text-white">For Teachers</Badge>
                          <Badge variant="outline" className="border-amber-400 text-amber-700">Interactive</Badge>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">Classroom Card Games</h3>
                        <p className="text-gray-600 mb-3">
                          Teacher-controlled interactive games for Week 1 &amp; 2. Perfect for live classroom sessions with teams!
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>🎯 The Observer Game</span>
                          <span>🧠 Memory &amp; Updating Game</span>
                          <span>👥 Team Scoring</span>
                        </div>
                      </div>
                      <ArrowRight className="h-8 w-8 text-amber-500" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {youngSagesLessons.map((lesson, index) => (
                <Link key={lesson.id} href={`/learn/${lesson.slug}`}>
                  <Card className="h-full hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer border-2 hover:border-[#124734]">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-[#8B4513] to-[#A0522D] flex items-center justify-center text-white text-xl font-bold">
                          {index + 1}
                        </div>
                        {completedLessonIds.has(lesson.id) ? (
                          <Badge className="bg-green-500 text-white">✓ Completed</Badge>
                        ) : (
                          <Badge variant="outline">In Progress</Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg mt-3">{lesson.title}</CardTitle>
                      <CardDescription>{lesson.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center text-[#124734] font-medium">
                        <span>Start Lesson</span>
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Original Lessons Section */}
        {originalLessons.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">🧱</span>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Core Lessons</h2>
                <p className="text-gray-600">Master the fundamentals of block programming</p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {originalLessons.map((lesson, index) => (
                <Link key={lesson.id} href={`/learn/${lesson.slug}`}>
                  <Card className="h-full hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer border-2 hover:border-[#124734]">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#124734] to-[#1a5c47] flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                        {completedLessonIds.has(lesson.id) && (
                          <Badge className="bg-green-500 text-white text-xs">✓</Badge>
                        )}
                      </div>
                      <CardTitle className="text-base mt-2">{lesson.title}</CardTitle>
                      <CardDescription className="text-sm">{lesson.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center text-[#124734] text-sm font-medium">
                        <span>Open</span>
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Getting Started Guide */}
        <section className="mt-16 p-8 bg-gray-50 rounded-2xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">How Blocks Lab Works</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="h-16 w-16 mx-auto rounded-full bg-[#FFAB19] flex items-center justify-center text-white text-2xl font-bold mb-3">
                1
              </div>
              <h3 className="font-semibold mb-2">Drag Blocks</h3>
              <p className="text-sm text-gray-600">Pick blocks from the toolbox and drag them to the workspace</p>
            </div>
            <div className="text-center">
              <div className="h-16 w-16 mx-auto rounded-full bg-[#4C97FF] flex items-center justify-center text-white text-2xl font-bold mb-3">
                2
              </div>
              <h3 className="font-semibold mb-2">Snap Together</h3>
              <p className="text-sm text-gray-600">Connect blocks like puzzle pieces to build your program</p>
            </div>
            <div className="text-center">
              <div className="h-16 w-16 mx-auto rounded-full bg-[#5ba55b] flex items-center justify-center text-white text-2xl font-bold mb-3">
                3
              </div>
              <h3 className="font-semibold mb-2">Click Run</h3>
              <p className="text-sm text-gray-600">Press the Run button to see your program in action</p>
            </div>
            <div className="text-center">
              <div className="h-16 w-16 mx-auto rounded-full bg-[#9966FF] flex items-center justify-center text-white text-2xl font-bold mb-3">
                4
              </div>
              <h3 className="font-semibold mb-2">Save & Submit</h3>
              <p className="text-sm text-gray-600">Your work auto-saves. Submit when you're proud!</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
