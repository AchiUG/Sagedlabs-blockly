
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Header from '@/components/navigation/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Mail, 
  Lock, 
  Award, 
  BookOpen, 
  Settings,
  Shield,
  Bell,
  CheckCircle
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface ProfilePageProps {
  user: any;
  session: any;
}

export default function ProfilePage({ user, session }: ProfilePageProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    bio: user?.bio || '',
    institution: user?.institution || '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const hasGoogleAuth = user?.accounts?.some((acc: any) => acc.provider === 'google');
  const hasPasswordAuth = user?.password;

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('Profile updated successfully!');
        router.refresh();
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to update profile');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/user/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      if (response.ok) {
        toast.success('Password updated successfully!');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to update password');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = () => {
    const firstName = user?.firstName || user?.name?.split(' ')[0] || '';
    const lastName = user?.lastName || user?.name?.split(' ')[1] || '';
    return `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="relative saged-hero-gradient rounded-2xl p-8 overflow-hidden">
            <div className="absolute inset-0 african-pattern"></div>
            <div className="relative flex items-center space-x-6">
              <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                <AvatarImage src={user?.image} />
                <AvatarFallback className="text-2xl font-bold bg-orange-600 text-white">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {user?.name || `${user?.firstName} ${user?.lastName}`}
                </h1>
                <p className="text-gray-700 mb-2">{user?.email}</p>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="bg-white/50">
                    {user?.role}
                  </Badge>
                  {hasGoogleAuth && (
                    <Badge variant="outline" className="bg-white/50 flex items-center space-x-1">
                      <svg className="w-3 h-3" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      </svg>
                      <span>Google</span>
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="saged-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Enrolled Courses</p>
                  <p className="text-2xl font-bold text-gray-900">{user?.enrollments?.length || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="saged-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Certificates</p>
                  <p className="text-2xl font-bold text-gray-900">{user?.certificates?.length || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="saged-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {user?.enrollments?.filter((e: any) => e.status === 'COMPLETED')?.length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Settings Tabs */}
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-5">
            <TabsTrigger value="profile" className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>Profile</span>
            </TabsTrigger>
            <TabsTrigger value="certificates" className="flex items-center space-x-2">
              <Award className="w-4 h-4" />
              <span>Certificates</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span>Security</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center space-x-2">
              <Bell className="w-4 h-4" />
              <span>Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>Preferences</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card className="saged-card">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal information and profile details</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      disabled
                      className="bg-gray-100"
                    />
                    <p className="text-sm text-gray-500">Email cannot be changed</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="institution">Institution</Label>
                    <Input
                      id="institution"
                      value={formData.institution}
                      onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                      placeholder="Your university or organization"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      rows={4}
                      placeholder="Tell us about yourself"
                    />
                  </div>

                  <Button type="submit" className="saged-button" disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Certificates Tab */}
          <TabsContent value="certificates">
            <Card className="saged-card">
              <CardHeader>
                <CardTitle>My Certificates</CardTitle>
                <CardDescription>View and download your earned certificates</CardDescription>
              </CardHeader>
              <CardContent>
                {user?.certificates && user.certificates.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {user.certificates.map((certificate: any) => (
                      <div key={certificate.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <Award className="w-8 h-8 text-amber-600" />
                          <Badge className="bg-green-100 text-green-700">Earned</Badge>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {certificate.course?.title || 'Certificate'}
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                          Issued on {new Date(certificate.issuedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                        <div className="space-y-2">
                          {certificate.credentialUrl && (
                            <Button
                              variant="outline"
                              className="w-full"
                              size="sm"
                              onClick={() => window.open(certificate.credentialUrl, '_blank')}
                            >
                              View Certificate
                            </Button>
                          )}
                          {certificate.certificateUrl && (
                            <Button
                              variant="outline"
                              className="w-full"
                              size="sm"
                              onClick={() => window.open(certificate.certificateUrl, '_blank')}
                            >
                              Download PDF
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Award className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No certificates yet
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Complete courses to earn certificates and showcase your achievements
                    </p>
                    <Button onClick={() => router.push('/my-learning')} className="saged-button">
                      Browse My Courses
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <Card className="saged-card">
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your password and security preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {hasPasswordAuth ? (
                  <form onSubmit={handlePasswordUpdate} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        required
                      />
                    </div>

                    <Button type="submit" className="saged-button" disabled={isLoading}>
                      {isLoading ? 'Updating...' : 'Update Password'}
                    </Button>
                  </form>
                ) : (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-700">
                      You signed up using Google. Password management is handled through your Google account.
                    </p>
                  </div>
                )}

                <div className="pt-6 border-t">
                  <h3 className="text-lg font-semibold mb-4">Connected Accounts</h3>
                  <div className="space-y-3">
                    {hasGoogleAuth && (
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <svg className="w-6 h-6" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                          </svg>
                          <div>
                            <p className="font-medium">Google</p>
                            <p className="text-sm text-gray-600">Connected</p>
                          </div>
                        </div>
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                    )}
                    {hasPasswordAuth && (
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Lock className="w-6 h-6 text-gray-600" />
                          <div>
                            <p className="font-medium">Email & Password</p>
                            <p className="text-sm text-gray-600">Connected</p>
                          </div>
                        </div>
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card className="saged-card">
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Manage how you receive notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  toast.success('Notification preferences updated!');
                }} className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-gray-600">Receive email updates about your courses</p>
                      </div>
                      <input type="checkbox" className="w-5 h-5 text-orange-600" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">Course Updates</p>
                        <p className="text-sm text-gray-600">Get notified when new content is added</p>
                      </div>
                      <input type="checkbox" className="w-5 h-5 text-orange-600" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">Assignment Reminders</p>
                        <p className="text-sm text-gray-600">Receive reminders about upcoming deadlines</p>
                      </div>
                      <input type="checkbox" className="w-5 h-5 text-orange-600" defaultChecked />
                    </div>
                  </div>
                  <Button type="submit" className="saged-button">
                    Save Notification Settings
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences">
            <Card className="saged-card">
              <CardHeader>
                <CardTitle>Learning Preferences</CardTitle>
                <CardDescription>Customize your learning experience</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  toast.success('Learning preferences saved!');
                }} className="space-y-6">
                  <div>
                    <Label>Preferred Learning Time</Label>
                    <select className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                      <option>Morning (6am - 12pm)</option>
                      <option>Afternoon (12pm - 6pm)</option>
                      <option>Evening (6pm - 12am)</option>
                      <option>Night (12am - 6am)</option>
                    </select>
                  </div>
                  <div>
                    <Label>Difficulty Level</Label>
                    <select className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500">
                      <option>Beginner</option>
                      <option>Intermediate</option>
                      <option>Advanced</option>
                    </select>
                  </div>
                  <Button type="submit" className="saged-button">Save Preferences</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
