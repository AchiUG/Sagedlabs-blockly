import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import BlocksLabClient from './blocks-lab-client';

interface PageProps {
  params: { lessonSlug: string };
}

export default async function BlocksLabPage({ params }: PageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/auth/signin?callbackUrl=/learn/' + params.lessonSlug);
  }

  // Fetch lesson
  const lesson = await prisma.blocksLesson.findUnique({
    where: { slug: params.lessonSlug },
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
