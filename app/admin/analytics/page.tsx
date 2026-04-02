
import { requireAdmin } from '@/lib/admin-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, Users, BookOpen } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminAnalyticsPage() {
  await requireAdmin();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics & Reports</h1>
        <p className="text-gray-600">
          Track platform performance and generate detailed reports
        </p>
      </div>

      {/* Placeholder Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="saged-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span>Growth Metrics</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Track user growth, course enrollments, and engagement metrics over time.
            </p>
          </CardContent>
        </Card>

        <Card className="saged-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-600" />
              <span>User Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Monitor active users, session duration, and learning patterns.
            </p>
          </CardContent>
        </Card>

        <Card className="saged-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-purple-600" />
              <span>Course Performance</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Analyze course completion rates, average scores, and feedback.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="saged-card">
        <CardHeader>
          <CardTitle>Reports Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Analytics Dashboard Coming Soon
            </h3>
            <p className="text-gray-600">
              Advanced analytics and reporting features will be available here.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
