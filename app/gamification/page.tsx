
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth-config';
import { GamificationProfile } from '@/components/gamification/gamification-profile';

export default async function GamificationPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/auth/signin');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Learning Journey</h1>
          <p className="text-gray-600 mt-2">
            Track your progress, earn badges, and advance through the stages of mastery
          </p>
        </div>

        <GamificationProfile />
      </div>
    </div>
  );
}
