
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/navigation/header';
import Footer from '@/components/navigation/footer';

export const metadata = {
  title: 'Terms of Service - SAGED AI Learning',
  description: 'Terms of Service for SAGED AI Learning platform.',
};

export default function Terms() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
        <Card>
          <CardContent className="p-8">
            <div className="prose prose-lg max-w-none">
              <h2>1. Acceptance of Terms</h2>
              <p>By accessing and using SAGED AI Learning platform, you accept and agree to be bound by the terms and provision of this agreement.</p>
              
              <h2>2. Educational Services</h2>
              <p>SAGED provides online AI and machine learning courses, mentorship programs, and educational resources.</p>
              
              <h2>3. User Responsibilities</h2>
              <p>Users are responsible for maintaining the confidentiality of their account information and for all activities that occur under their account.</p>
              
              <h2>4. Intellectual Property</h2>
              <p>All course content, materials, and resources are the intellectual property of SAGED and are protected by copyright laws.</p>
              
              <h2>5. Refund Policy</h2>
              <p>We offer a 30-day money-back guarantee for all courses, subject to our refund policy terms.</p>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}
