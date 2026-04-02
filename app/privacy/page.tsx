
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/navigation/header';
import Footer from '@/components/navigation/footer';

export const metadata = {
  title: 'Privacy Policy - SAGED AI Learning',
  description: 'Privacy Policy for SAGED AI Learning platform.',
};

export default function Privacy() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
        <Card>
          <CardContent className="p-8">
            <div className="prose prose-lg max-w-none">
              <h2>1. Information We Collect</h2>
              <p>We collect information you provide directly to us, such as when you create an account, enroll in courses, or contact us.</p>
              
              <h2>2. How We Use Your Information</h2>
              <p>We use the information we collect to provide, maintain, and improve our educational services and to communicate with you.</p>
              
              <h2>3. Information Sharing</h2>
              <p>We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.</p>
              
              <h2>4. Data Security</h2>
              <p>We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
              
              <h2>5. Contact Us</h2>
              <p>If you have questions about this Privacy Policy, please contact us at privacy@saged.ai.</p>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}
