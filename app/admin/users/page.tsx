
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth-config';
import { prisma } from '@/lib/db';
import UserManagement from '@/components/admin/user-management';

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/auth/signin');
  }

  const userRole = (session.user as any)?.role;
  
  if (userRole !== 'ADMIN') {
    redirect('/dashboard');
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { 
          enrollments: true
        }
      }
    }
  });

  return <UserManagement users={users} />;
}
