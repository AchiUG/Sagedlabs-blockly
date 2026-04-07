import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import BlocksLabClient from './blocks-lab-client';

interface PageProps {
  params: Promise<{ lessonSlug: string }>;
}

export default async function BlocksLabPage({ params }: PageProps) {
  const { lessonSlug } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/auth/signin?callbackUrl=/learn/' + lessonSlug);
  }

  // Fetch lesson
  const lesson = await prisma.blocksLesson.findUnique({
    where: { slug: lessonSlug },
  });

  if (!lesson) {
    redirect('/courses');
  }

  // Check if lesson is published (unless admin/instructor)
  if (!lesson.isPublished && session.user.role !== 'ADMIN' && session.user.role !== 'INSTRUCTOR') {
    redirect('/courses');
  }

  // Fetch user's project if exists
  const project = await prisma.blocksProject.findUnique({
    where: {
      lessonId_userId: {
        lessonId: lesson.id,
        userId: session.user.id,
      },
    },
  });

  // Fetch next lesson for navigation
  const nextLesson = await prisma.blocksLesson.findFirst({
    where: {
      orderIndex: {
        gt: lesson.orderIndex,
      },
      isPublished: true,
    },
    orderBy: {
      orderIndex: 'asc',
    },
    select: {
      slug: true,
    },
  });

  return (
    <BlocksLabClient
      lesson={{
        id: lesson.id,
        slug: lesson.slug,
        title: lesson.title,
        description: lesson.description,
        instructions: lesson.instructions,
        starterWorkspace: lesson.starterWorkspace,
        stageConfig: lesson.stageConfig,
        blockConfig: lesson.blockConfig,
      }}
      nextLessonSlug={nextLesson?.slug || null}
      project={project ? {
        id: project.id,
        workspace: project.workspace,
        generatedCode: project.generatedCode,
        status: project.status,
        updatedAt: project.updatedAt.toISOString(),
      } : null}
      userId={session.user.id}
    />
  );
}
