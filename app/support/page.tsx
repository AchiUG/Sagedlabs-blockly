
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  BookOpen, 
  Users, 
  MessageCircle, 
  HelpCircle, 
  Search,
  ExternalLink,
  Play,
  FileText,
  Settings,
  Award,
  Headphones
} from 'lucide-react';

const supportCategories = [
  {
    icon: BookOpen,
    title: "Getting Started",
    description: "New to SAGED? Start here for onboarding and setup guides.",
    articles: 12,
    action: "Getting Started Guide"
  },
  {
    icon: Settings,
    title: "Technical Support",
    description: "Platform issues, browser compatibility, and technical troubleshooting.",
    articles: 18,
    action: "Technical Requirements"
  },
  {
    icon: Play,
    title: "Course Help",
    description: "Navigate courses, access materials, and track your progress.",
    articles: 25,
    action: "Course Navigation"
  },
  {
    icon: Award,
    title: "Certificates & Completion",
    description: "Information about certifications, requirements, and downloading certificates.",
    articles: 8,
    action: "Certification Process"
  }
];

const communitySupport = [
  {
    icon: MessageCircle,
    title: "Discord Community",
    description: "Get help from fellow students and instructors",
    members: "15,000+",
    responseTime: "Usually within 30 minutes",
    action: "Join Discord Community"
  },
  {
    icon: Users,
    title: "Study Groups",
    description: "Join or create study groups for specific courses",
    groups: "200+",
    responseTime: "Peer-to-peer learning",
    action: "Study Groups"
  },
  {
    icon: Headphones,
    title: "Peer Mentorship",
    description: "Connect with advanced students and alumni",
    mentors: "500+",
    responseTime: "Within 24 hours",
    action: "Peer Mentorship"
  },
  {
    icon: HelpCircle,
    title: "Community Forums",
    description: "Browse discussions and ask questions",
    posts: "10,000+",
    responseTime: "Community moderated",
    action: "Community Forums"
  }
];

const faqs = [
  {
    category: "Getting Started",
    questions: [
      {
        question: "How do I create my SAGED account?",
        answer: "Visit our signup page and fill in your details. You'll receive a verification email to activate your account. Once verified, you can access your dashboard and browse available courses."
      },
      {
        question: "What are the system requirements?",
        answer: "SAGED works on any modern web browser (Chrome, Firefox, Safari, Edge). For coding exercises, you'll need a computer with at least 4GB RAM. Specific requirements are listed for each course."
      },
      {
        question: "How do I enroll in a course?",
        answer: "Browse our course catalog, click on a course you're interested in, and hit the 'Enroll Now' button. You can pay via credit card or use our payment plans for some courses."
      }
    ]
  },
  {
    category: "Courses & Learning",
    questions: [
      {
        question: "Can I access courses on mobile?",
        answer: "Yes! Our platform is fully responsive and works on smartphones and tablets. However, for the best coding experience, we recommend using a computer."
      },
      {
        question: "How long do I have access to a course?",
        answer: "Once enrolled, you have lifetime access to course materials. You can learn at your own pace and revisit content anytime."
      },
      {
        question: "What if I get stuck on an assignment?",
        answer: "Use our Discord community, attend office hours with instructors, or book a 1:1 mentorship session. We're here to help you succeed!"
      }
    ]
  },
  {
    category: "Certificates & Completion",
    questions: [
      {
        question: "How do I get a certificate?",
        answer: "Complete all required assignments and pass the final project with at least 70%. Your certificate will be automatically generated and available for download."
      },
      {
        question: "Are SAGED certificates recognized?",
        answer: "Our certificates are recognized by many employers and organizations. They demonstrate practical skills and are backed by our rigorous curriculum."
      }
    ]
  }
];

export default function SupportPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const handleGettingStartedGuide = () => {
    console.log('Getting Started Guide clicked');
  };

  const handleTechnicalRequirements = () => {
    console.log('Technical Requirements clicked');
  };

  const handleCourseNavigation = () => {
    console.log('Course Navigation clicked');
  };

  const handleCertificationProcess = () => {
    console.log('Certification Process clicked');
  };

  const handleJoinDiscordCommunity = () => {
    console.log('Join Discord Community clicked');
  };

  const handleStudyGroups = () => {
    console.log('Study Groups clicked');
  };

  const handlePeerMentorship = () => {
    console.log('Peer Mentorship clicked');
  };

  const handleCommunityForums = () => {
    console.log('Community Forums clicked');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-orange-50/30">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Support Center</h1>
            <p className="text-xl opacity-90 leading-relaxed">
              Get help with your SAGED learning journey. Find answers, tutorials, 
              and connect with our community for support.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16">
        {/* Search */}
        <div className="max-w-2xl mx-auto mb-16">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="search"
              placeholder="Search for help articles, guides, and FAQs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 py-4 text-lg"
            />
          </div>
        </div>

        {/* Support Categories */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Help Categories</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Browse our comprehensive help resources organized by category to quickly 
              find the information you need.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {supportCategories.map((category, index) => (
              <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow cursor-pointer group">
                <CardContent className="p-8 text-center">
                  <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-orange-200 transition-colors">
                    <category.icon className="w-8 h-8 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{category.title}</h3>
                  <p className="text-gray-600 mb-4">{category.description}</p>
                  <Badge variant="outline" className="mb-6">{category.articles} articles</Badge>
                  <Button 
                    variant="outline" 
                    className="w-full group-hover:bg-orange-600 group-hover:text-white transition-colors"
                    onClick={() => {
                      if (category.action === "Getting Started Guide") handleGettingStartedGuide();
                      else if (category.action === "Technical Requirements") handleTechnicalRequirements();
                      else if (category.action === "Course Navigation") handleCourseNavigation();
                      else if (category.action === "Certification Process") handleCertificationProcess();
                    }}
                  >
                    {category.action}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Community Support */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Community Support</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get help from our vibrant community of learners, instructors, and AI professionals. 
              Sometimes the best help comes from fellow students!
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {communitySupport.map((support, index) => (
              <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
                    <support.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{support.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{support.description}</p>
                  <div className="space-y-1 text-xs text-gray-500 mb-4">
                    <p>{support.members || support.groups || support.mentors || support.posts}</p>
                    <p>{support.responseTime}</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => {
                      if (support.action === "Join Discord Community") handleJoinDiscordCommunity();
                      else if (support.action === "Study Groups") handleStudyGroups();
                      else if (support.action === "Peer Mentorship") handlePeerMentorship();
                      else if (support.action === "Community Forums") handleCommunityForums();
                    }}
                  >
                    {support.action}
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Quick answers to the most common questions about SAGED courses, platform, 
              and learning experience.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {faqs.map((section, sectionIndex) => (
              <Card key={sectionIndex} className="mb-8 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl text-gray-900">{section.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {section.questions.map((faq, faqIndex) => (
                      <AccordionItem key={faqIndex} value={`item-${sectionIndex}-${faqIndex}`}>
                        <AccordionTrigger className="text-left">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact Support */}
        <div>
          <Card className="shadow-xl bg-gradient-to-r from-gray-900 to-orange-900 text-white">
            <CardContent className="p-12 text-center">
              <MessageCircle className="w-16 h-16 mx-auto mb-6 opacity-90" />
              <h2 className="text-3xl font-bold mb-6">Still Need Help?</h2>
              <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
                Can't find the answer you're looking for? Our support team is here to help. 
                We typically respond within 24 hours.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-orange-600 hover:bg-orange-700"
                  onClick={() => {
                    console.log('Contact Support clicked');
                  }}
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Contact Support
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-gray-900"
                  onClick={() => {
                    console.log('Submit Feedback clicked');
                  }}
                >
                  <FileText className="w-5 h-5 mr-2" />
                  Submit Feedback
                </Button>
              </div>
              <p className="text-sm opacity-75 mt-6">
                Available Monday-Friday, 9AM-6PM EAT | Emergency support 24/7
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
