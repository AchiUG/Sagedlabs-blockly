'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Loader2, Users, CheckCircle2, Clock, XCircle, AlertCircle, 
  Eye, Edit2, RefreshCw, Sparkles, Mail, Globe, Calendar
} from 'lucide-react';
import { format } from 'date-fns';

type ApplicationStatus = 'PENDING' | 'ACCEPTED' | 'WAITLISTED' | 'REJECTED';

interface Application {
  id: string;
  childFirstName: string;
  childLastName: string;
  childAge: number;
  guardianName: string;
  guardianEmail: string;
  guardianPhone: string | null;
  country: string;
  timezone: string | null;
  hasComputer: boolean;
  hasInternet: boolean;
  accessNotes: string | null;
  selfAwareness: number;
  agency: number;
  growth: number;
  ethics: number;
  design: number;
  whyJoin: string;
  priorExperience: string | null;
  learningGoals: string | null;
  parentalConsent: boolean;
  mediaConsent: boolean;
  rulesAccepted: boolean;
  status: ApplicationStatus;
  adminNotes: string | null;
  needsEmailFollowup: boolean;
  createdAt: string;
  reviewedAt: string | null;
}

interface StatusCounts {
  PENDING: number;
  ACCEPTED: number;
  WAITLISTED: number;
  REJECTED: number;
  TOTAL: number;
}

const STATUS_CONFIG = {
  PENDING: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  ACCEPTED: { label: 'Accepted', color: 'bg-green-100 text-green-800', icon: CheckCircle2 },
  WAITLISTED: { label: 'Waitlisted', color: 'bg-blue-100 text-blue-800', icon: AlertCircle },
  REJECTED: { label: 'Rejected', color: 'bg-red-100 text-red-800', icon: XCircle },
};

const COHORT_SIZE = 10;

export default function YoungSagesApplicationsPage() {
  const { data: session, status: authStatus } = useSession() || {};
  const router = useRouter();
  
  const [applications, setApplications] = useState<Application[]>([]);
  const [counts, setCounts] = useState<StatusCounts>({ PENDING: 0, ACCEPTED: 0, WAITLISTED: 0, REJECTED: 0, TOTAL: 0 });
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [updating, setUpdating] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  
  useEffect(() => {
    if (authStatus === 'loading') return;
    
    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'INSTRUCTOR')) {
      router.push('/dashboard/unauthorized');
      return;
    }
    
    fetchApplications();
  }, [session, authStatus, router, filterStatus]);
  
  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/young-sages-applications?status=${filterStatus}`);
      const data = await res.json();
      setApplications(data.applications || []);
      setCounts(data.counts || { PENDING: 0, ACCEPTED: 0, WAITLISTED: 0, REJECTED: 0, TOTAL: 0 });
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const updateApplication = async (id: string, newStatus: ApplicationStatus, notes?: string) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/young-sages-applications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, adminNotes: notes }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        alert(data.error || 'Failed to update');
        return;
      }
      
      await fetchApplications();
      setSelectedApp(null);
    } catch (error) {
      console.error('Error updating application:', error);
      alert('Failed to update application');
    } finally {
      setUpdating(false);
    }
  };
  
  if (authStatus === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-[#124734]" />
      </div>
    );
  }
  
  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#124734] flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-[#D9A441]" />
            Young Sages Applications
          </h1>
          <p className="text-gray-600">Manage cohort applications for the Young Sages program</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={fetchApplications} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All ({counts.TOTAL})</SelectItem>
              <SelectItem value="PENDING">Pending ({counts.PENDING})</SelectItem>
              <SelectItem value="ACCEPTED">Accepted ({counts.ACCEPTED})</SelectItem>
              <SelectItem value="WAITLISTED">Waitlisted ({counts.WAITLISTED})</SelectItem>
              <SelectItem value="REJECTED">Rejected ({counts.REJECTED})</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <Card className="border-[#124734]/20">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#124734]/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-[#124734]" />
            </div>
            <div>
              <p className="text-2xl font-bold">{counts.TOTAL}</p>
              <p className="text-xs text-gray-500">Total</p>
            </div>
          </CardContent>
        </Card>
        
        {Object.entries(STATUS_CONFIG).map(([status, config]) => {
          const Icon = config.icon;
          return (
            <Card key={status} className="border-[#124734]/20">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${config.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{counts[status as ApplicationStatus]}</p>
                  <p className="text-xs text-gray-500">{config.label}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {/* Cohort Capacity */}
      <Card className="mb-6 border-[#D9A441]/30 bg-[#D9A441]/5">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-[#D9A441]" />
              <span className="font-medium">Cohort Capacity</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-32 h-3 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#124734] rounded-full transition-all"
                  style={{ width: `${Math.min(100, (counts.ACCEPTED / COHORT_SIZE) * 100)}%` }}
                />
              </div>
              <span className="font-semibold text-[#124734]">
                {counts.ACCEPTED} / {COHORT_SIZE}
              </span>
              {counts.ACCEPTED >= COHORT_SIZE && (
                <Badge variant="destructive">Full</Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Applications List */}
      <Card>
        <CardHeader>
          <CardTitle>Applications</CardTitle>
        </CardHeader>
        <CardContent>
          {applications.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No applications found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Learner</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Guardian</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applied</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {applications.map((app) => {
                    const config = STATUS_CONFIG[app.status];
                    const Icon = config.icon;
                    return (
                      <tr key={app.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium">{app.childFirstName} {app.childLastName}</p>
                            <p className="text-sm text-gray-500">Age {app.childAge}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <p className="text-sm">{app.guardianName}</p>
                            <p className="text-xs text-gray-500">{app.guardianEmail}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 text-sm">
                            <Globe className="w-3 h-3" />
                            {app.country}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Calendar className="w-3 h-3" />
                            {format(new Date(app.createdAt), 'MMM d, yyyy')}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge className={config.color}>
                            <Icon className="w-3 h-3 mr-1" />
                            {config.label}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedApp(app);
                                    setAdminNotes(app.adminNotes || '');
                                  }}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle className="flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-[#D9A441]" />
                                    Application Details
                                  </DialogTitle>
                                </DialogHeader>
                                {selectedApp && (
                                  <div className="space-y-6">
                                    {/* Learner Info */}
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <Label className="text-gray-500">Learner</Label>
                                        <p className="font-medium">{selectedApp.childFirstName} {selectedApp.childLastName}</p>
                                        <p className="text-sm text-gray-500">Age {selectedApp.childAge}</p>
                                      </div>
                                      <div>
                                        <Label className="text-gray-500">Guardian</Label>
                                        <p className="font-medium">{selectedApp.guardianName}</p>
                                        <p className="text-sm text-gray-500">{selectedApp.guardianEmail}</p>
                                        {selectedApp.guardianPhone && <p className="text-sm text-gray-500">{selectedApp.guardianPhone}</p>}
                                      </div>
                                      <div>
                                        <Label className="text-gray-500">Location</Label>
                                        <p>{selectedApp.country}</p>
                                        {selectedApp.timezone && <p className="text-sm text-gray-500">{selectedApp.timezone}</p>}
                                      </div>
                                      <div>
                                        <Label className="text-gray-500">Tech Access</Label>
                                        <p className="text-sm">
                                          Computer: {selectedApp.hasComputer ? '✅' : '❌'} | 
                                          Internet: {selectedApp.hasInternet ? '✅' : '❌'}
                                        </p>
                                        {selectedApp.accessNotes && <p className="text-xs text-gray-500 mt-1">{selectedApp.accessNotes}</p>}
                                      </div>
                                    </div>
                                    
                                    {/* SAGE-D Scores */}
                                    <div>
                                      <Label className="text-gray-500 mb-2 block">SAGE-D Self-Assessment</Label>
                                      <div className="flex gap-4">
                                        {[
                                          { key: 'selfAwareness', label: 'S' },
                                          { key: 'agency', label: 'A' },
                                          { key: 'growth', label: 'G' },
                                          { key: 'ethics', label: 'E' },
                                          { key: 'design', label: 'D' },
                                        ].map(({ key, label }) => (
                                          <div key={key} className="text-center">
                                            <div className="w-10 h-10 rounded-full bg-[#124734]/10 flex items-center justify-center font-bold text-[#124734]">
                                              {selectedApp[key as keyof Application] as number}
                                            </div>
                                            <p className="text-xs mt-1">{label}</p>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                    
                                    {/* Motivation */}
                                    <div>
                                      <Label className="text-gray-500">Why They Want to Join</Label>
                                      <p className="text-sm bg-gray-50 p-3 rounded mt-1">{selectedApp.whyJoin}</p>
                                    </div>
                                    
                                    {selectedApp.priorExperience && (
                                      <div>
                                        <Label className="text-gray-500">Prior Experience</Label>
                                        <p className="text-sm bg-gray-50 p-3 rounded mt-1">{selectedApp.priorExperience}</p>
                                      </div>
                                    )}
                                    
                                    {selectedApp.learningGoals && (
                                      <div>
                                        <Label className="text-gray-500">Learning Goals</Label>
                                        <p className="text-sm bg-gray-50 p-3 rounded mt-1">{selectedApp.learningGoals}</p>
                                      </div>
                                    )}
                                    
                                    {/* Consents */}
                                    <div>
                                      <Label className="text-gray-500">Consents</Label>
                                      <div className="text-sm mt-1">
                                        <p>Parental: {selectedApp.parentalConsent ? '✅' : '❌'}</p>
                                        <p>Media: {selectedApp.mediaConsent ? '✅' : '❌'}</p>
                                        <p>Rules: {selectedApp.rulesAccepted ? '✅' : '❌'}</p>
                                      </div>
                                    </div>
                                    
                                    {/* Admin Section */}
                                    <div className="border-t pt-4">
                                      <Label>Admin Notes</Label>
                                      <Textarea
                                        value={adminNotes}
                                        onChange={(e) => setAdminNotes(e.target.value)}
                                        placeholder="Add notes about this application..."
                                        className="mt-1"
                                        rows={3}
                                      />
                                    </div>
                                    
                                    {/* Status Update */}
                                    <div className="flex flex-wrap gap-2">
                                      <Button
                                        onClick={() => updateApplication(selectedApp.id, 'ACCEPTED', adminNotes)}
                                        disabled={updating || counts.ACCEPTED >= COHORT_SIZE}
                                        className="bg-green-600 hover:bg-green-700 gap-1"
                                      >
                                        <CheckCircle2 className="w-4 h-4" />
                                        Accept
                                      </Button>
                                      <Button
                                        onClick={() => updateApplication(selectedApp.id, 'WAITLISTED', adminNotes)}
                                        disabled={updating}
                                        variant="outline"
                                        className="gap-1"
                                      >
                                        <Clock className="w-4 h-4" />
                                        Waitlist
                                      </Button>
                                      <Button
                                        onClick={() => updateApplication(selectedApp.id, 'REJECTED', adminNotes)}
                                        disabled={updating}
                                        variant="destructive"
                                        className="gap-1"
                                      >
                                        <XCircle className="w-4 h-4" />
                                        Reject
                                      </Button>
                                      {updating && <Loader2 className="w-5 h-5 animate-spin" />}
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
