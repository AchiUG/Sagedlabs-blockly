
import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth-config';
import Header from '@/components/navigation/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowLeft, Settings } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/auth/signin');
  }

  const userRole = (session.user as any)?.role;
  
  if (userRole !== 'ADMIN') {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link href="/admin" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Admin Dashboard
        </Link>

        <div className="flex items-center space-x-3 mb-8">
          <Settings className="w-8 h-8 text-orange-600" />
          <h1 className="text-3xl font-bold text-gray-900">Platform Settings</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
            <CardDescription>
              Configure platform-wide settings and preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <Settings className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Settings Panel Coming Soon
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Advanced platform configuration and settings management features are currently 
                under development. Check back soon for comprehensive system controls.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
