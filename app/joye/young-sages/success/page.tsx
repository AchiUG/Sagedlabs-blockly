'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Clock, Mail, Home, Sparkles } from 'lucide-react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const status = searchParams.get('status') || 'PENDING';
  
  const isWaitlisted = status === 'WAITLISTED';
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f5f0] via-white to-[#e8f5e9] py-12 px-4 flex items-center justify-center">
      <Card className="max-w-lg w-full border-[#124734]/20 shadow-xl">
        <CardContent className="p-8 text-center">
          <div className={`w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center ${
            isWaitlisted ? 'bg-[#D9A441]/20' : 'bg-green-100'
          }`}>
            {isWaitlisted ? (
              <Clock className="w-10 h-10 text-[#D9A441]" />
            ) : (
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            )}
          </div>
          
          <h1 className="text-2xl font-bold text-[#124734] mb-2">
            {isWaitlisted ? 'You\'re on the Waitlist!' : 'Application Submitted!'}
          </h1>
          
          <p className="text-gray-600 mb-6">
            {isWaitlisted ? (
              <>Our first cohort is filling up fast! We&apos;ve added you to our waitlist and will notify you as soon as a spot opens up.</>
            ) : (
              <>Thank you for joining the Young Sages community! We&apos;re excited to review your application.</>
            )}
          </p>
          
          <div className="bg-[#124734]/5 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-[#124734] mb-2 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              What Happens Next?
            </h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>📧 Check your email for a confirmation message</li>
              <li>⏰ We&apos;ll review applications within 3-5 business days</li>
              <li>✅ You&apos;ll receive an acceptance email with next steps</li>
              <li>🎉 Program starts with a welcome session!</li>
            </ul>
          </div>
          
          <div className="bg-[#D9A441]/10 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 justify-center text-[#8B6914] font-medium mb-2">
              <Sparkles className="w-4 h-4" />
              While You Wait
            </div>
            <p className="text-sm text-gray-600">
              Follow the adventures of Leuk the Hare and start thinking about systems around you. What patterns do you notice in your daily life?
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/">
              <Button variant="outline" className="w-full sm:w-auto gap-2">
                <Home className="w-4 h-4" />
                Back to Home
              </Button>
            </Link>
            <Link href="/courses">
              <Button className="w-full sm:w-auto gap-2 bg-[#124734] hover:bg-[#0e3627]">
                Explore Courses
              </Button>
            </Link>
          </div>
          
          <p className="text-xs text-gray-400 mt-6">
            Questions? Contact us at support@sagedlabs.com
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-[#124734]">Loading...</div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
