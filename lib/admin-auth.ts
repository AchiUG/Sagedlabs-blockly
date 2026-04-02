
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth-config';
import { redirect } from 'next/navigation';

export async function requireAdmin() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin?callbackUrl=/admin/dashboard');
  }

  const userRole = (session.user as any).role;

  if (userRole !== 'ADMIN') {
    redirect('/dashboard?error=unauthorized');
  }

  return session;
}

export async function checkAdminAccess() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return { authorized: false, session: null };
  }

  const userRole = (session.user as any).role;
  
  return {
    authorized: userRole === 'ADMIN',
    session,
    role: userRole
  };
}
