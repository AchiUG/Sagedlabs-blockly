'use client';

import { useState, useEffect } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Lock, User, BookOpen, Sparkles, Users, Star } from 'lucide-react';

export default function YoungSagesSignUpPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
      if (session) {
        router.replace('/dashboard');
      }
    };
    checkSession();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/signup/young-sages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Welcome to Young Sages! Signing you in...');
        
        // Auto sign in after successful signup
        const signInResult = await signIn('credentials', {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });

        if (!signInResult?.error) {
          router.replace('/dashboard');
        }
      } else {
        setError(data.error || 'An error occurred');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">Young Sages</span>
          </div>
          <Link href="/auth/signin">
            <Button variant="outline" size="sm">
              Sign In
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex min-h-screen">
        {/* Left side - Hero content */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12">
          <div className="max-w-lg">
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Star className="w-4 h-4" />
              Season 1 Cohort (YS-S01)
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              Join the <span className="text-amber-600">Young Sages</span> Adventure!
            </h1>
            <p className="text-xl text-gray-700 mb-4">
              Learn to think like AI—through African stories, creativity, and fun!
            </p>
            <p className="text-lg text-gray-600 mb-8">
              Perfect for ages 8-14. No coding experience needed.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">8-Week Journey</h3>
                  <p className="text-gray-600">Learn AI thinking with Leuk the Hare</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Weekly Live Sessions</h3>
                  <p className="text-gray-600">Saturday sessions with your cohort</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Blocks Lab Access</h3>
                  <p className="text-gray-600">Visual programming—no typing needed!</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Sign up form */}
        <div className="flex-1 flex items-center justify-center px-6 lg:px-12">
          <div className="w-full max-w-md">
            <Card className="shadow-xl border-amber-100">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-3xl">🐰</span>
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">Become a Young Sage</CardTitle>
                <CardDescription className="text-gray-600">
                  Join Leuk's adventure in AI thinking!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="p-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
                      {error}
                    </div>
                  )}
                  
                  {success && (
                    <div className="p-4 text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg">
                      {success}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                        First Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          id="firstName"
                          name="firstName"
                          type="text"
                          placeholder="Your first name"
                          value={formData.firstName}
                          onChange={handleChange}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                        Last Name
                      </label>
                      <Input
                        id="lastName"
                        name="lastName"
                        type="text"
                        placeholder="Your last name"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        className="pl-10"
                        required
                      />
                    </div>
                    <p className="text-xs text-gray-500">Parent's email recommended for younger learners</p>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium text-gray-700">
                      Create Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Create a strong password"
                        value={formData.password}
                        onChange={handleChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
                    <p className="font-medium">✨ What you'll get:</p>
                    <ul className="mt-1 space-y-1 text-amber-700">
                      <li>• Automatic enrollment in Young Sages course</li>
                      <li>• Access to Blocks Lab visual programming</li>
                      <li>• Placement in Season 1 cohort (YS-S01)</li>
                    </ul>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold py-3"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating your adventure...' : 'Start My Adventure! 🚀'}
                  </Button>

                  <div className="text-center text-sm text-gray-600 space-y-2">
                    <p>
                      Already have an account?{' '}
                      <Link href="/auth/signin" className="text-amber-600 hover:text-amber-700 font-medium">
                        Sign in here
                      </Link>
                    </p>
                    <p className="text-xs text-gray-500">
                      Looking for the full SAGED platform?{' '}
                      <Link href="/auth/signup" className="text-orange-600 hover:text-orange-700">
                        Sign up here
                      </Link>
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
