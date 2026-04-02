
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth-config';
import { prisma } from '@/lib/db';
import ProfilePage from '@/components/pages/profile-page';

export const dynamic = 'force-dynamic';

export default async function Profile() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  const userId = (session.user as any)?.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      accounts: true,
      enrollments: {
        include: {
          course: true,
        },
      },
      certificates: {
        include: {
          course: true,
        },
      },
    },
  });

  return <ProfilePage user={user} session={session} />;
}
