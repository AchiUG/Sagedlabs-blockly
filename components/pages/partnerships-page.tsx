
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/navigation/header';
import Footer from '@/components/navigation/footer';
import { 
  School,
  GraduationCap, 
  FlaskConical, 
  Users, 
  Target,
  CheckCircle,
  ArrowRight,
  Mail,
  Lightbulb,
  Award,
  HeartHandshake,
  BookOpen,
  Sparkles,
  TrendingUp,
  UserCheck,
  ChevronRight
} from 'lucide-react';

const partnershipOptions = [
  {
    id: 'embedded-innovation',
    letter: 'A',
    icon: School,
    title: 'SAGE-D Embedded Innovation Classrooms + After-School Pods',
    description: 'Integrate SAGE-D AI & symbolic-relational modules directly into your educational programs.',
    color: 'from-blue-600 to-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    features: [
      "Integrate SAGE-D AI & symbolic-relational modules as electives or enrichment classes",
      "After-school SAGE-D AI/Innovation Pods for extended learning",
      "Hands-on project-based learning experiences",
      "Curriculum alignment with existing standards",
      "Regular progress assessments and reporting"
    ],
    benefits: [
      "Enhance your institution technology offerings",
      "Engage students with cutting-edge AI education",
      "Flexible implementation models",
      "Community-centered approach"
    ]
  },
  {
    id: 'teacher-fellowship',
    letter: 'B',
    icon: GraduationCap,
    title: 'SAGE-D Teacher Fellowship & Capacity Building',
    description: 'Empower your educators with comprehensive AI training and certification programs.',
    color: 'from-orange-600 to-orange-700',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    features: [
      "Anchor Facilitator Training for lead educators",
      "SAGE-D Educator Fellowship for Educators and Staff",
      "Train-the-trainer certification programs",
      "Ongoing professional development workshops",
      "Access to exclusive educator resources and community"
    ],
    benefits: [
      "Build internal AI expertise",
      "Sustain innovation beyond initial implementation",
      "Create multiplier effect through trained educators",
      "Continuous learning and growth opportunities"
    ]
  },
  {
    id: 'community-labs',
    letter: 'C',
    icon: FlaskConical,
    title: 'SAGE-D Community Project Labs & Local Data Challenges',
    description: 'Support community-driven innovation through collaborative project labs and data challenges.',
    color: 'from-emerald-600 to-emerald-700',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    features: [
      "Innovation challenge funds to support local community issues",
      "SAGE-D Solution Toolset for problem-solving",
      "Mentorship and technical support",
      "Access to data resources and infrastructure",
      "Community showcase and recognition events"
    ],
    benefits: [
      "Address real local challenges with AI",
      "Foster innovation culture",
      "Connect learning to community impact",
      "Build partnerships with local stakeholders"
    ]
  },
  {
    id: 'mentorship-continuity',
    letter: 'D',
    icon: HeartHandshake,
    title: 'SAGE-D Mentorship Continuity & Alumni Loop',
    description: 'Create a sustainable mentorship ecosystem through SAGE-D youth-to-mentor pipeline.',
    color: 'from-purple-600 to-purple-700',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    features: [
      "SAGE-D Graduate Program youth-to-mentor pipeline",
      "Structured mentorship frameworks and training",
      "Alumni network engagement opportunities",
      "Career pathways and professional development",
      "Community knowledge preservation and transfer"
    ],
    benefits: [
      "Sustainable long-term impact",
      "Build leadership from within",
      "Create generational knowledge transfer",
      "Strengthen community bonds"
    ]
  }
];

export default function PartnershipsPage() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-stone-900 via-stone-800 to-blue-900 text-white py-20">
        <div className="absolute inset-0 african-pattern opacity-20"></div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              SAGE-D Partnership Opportunities
            </h1>
            <p className="text-xl text-gray-200 leading-relaxed mb-8">
              Transform your institution with SAGE-D's innovative AI education programs. 
              Choose the partnership model that best fits your community's needs.
            </p>
            <Badge className="text-white px-4 py-2 text-lg" style={{ background: 'linear-gradient(135deg, #C2694D 0%, #2563EB 100%)' }}>
              4 Flexible Partnership Models
            </Badge>
          </div>
        </div>
      </section>

      {/* Partnership Options */}
      <section className="py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Select Your Partnership Path
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Each partnership model is designed to create lasting impact in African communities 
              through context-driven education and sustainable mentorship.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {partnershipOptions.map((option) => {
              const IconComponent = option.icon;
              const isExpanded = expandedCard === option.id;
              
              return (
                <Card 
                  key={option.id} 
                  className={`saged-card border-2 ${option.borderColor} hover:shadow-xl transition-all duration-300 cursor-pointer ${
                    selectedOption === option.id ? 'ring-4 ring-blue-400 shadow-2xl' : ''
                  }`}
                  onClick={() => {
                    setSelectedOption(option.id);
                    setExpandedCard(isExpanded ? null : option.id);
                  }}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-4">
                      <div 
                        className={`w-16 h-16 rounded-full bg-gradient-to-br ${option.color} text-white text-2xl font-bold flex items-center justify-center flex-shrink-0`}
                      >
                        {option.letter}
                      </div>
                      <div className={`w-14 h-14 ${option.bgColor} rounded-full flex items-center justify-center`}>
                        <IconComponent className="w-7 h-7" style={{ color: option.color.includes('blue') ? '#2563EB' : option.color.includes('orange') ? '#EA580C' : option.color.includes('emerald') ? '#059669' : '#9333EA' }} />
                      </div>
                    </div>
                    <CardTitle className="text-2xl mb-3 text-gray-900">{option.title}</CardTitle>
                    <CardDescription className="text-base text-gray-600">{option.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    {/* Features */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <Sparkles className="w-4 h-4 mr-2 text-blue-600" />
                        Program Features
                      </h4>
                      <ul className="space-y-2">
                        {option.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-600">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Benefits - Expandable */}
                    {isExpanded && (
                      <div className={`${option.bgColor} p-4 rounded-lg mb-4`}>
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                          <TrendingUp className="w-4 h-4 mr-2 text-emerald-600" />
                          Key Benefits
                        </h4>
                        <ul className="space-y-2">
                          {option.benefits.map((benefit, idx) => (
                            <li key={idx} className="flex items-start space-x-2">
                              <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: option.color.includes('blue') ? '#2563EB' : option.color.includes('orange') ? '#EA580C' : option.color.includes('emerald') ? '#059669' : '#9333EA' }} />
                              <span className="text-sm text-gray-700">{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Action Button */}
                    <Button 
                      className={`w-full bg-gradient-to-r ${option.color} hover:opacity-90 text-white`}
                      onClick={(e) => {
                        e.stopPropagation();
                        // Navigate to contact or application form
                        console.log(`Selected partnership: ${option.id}`);
                      }}
                    >
                      Learn More About This Partnership
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Partner Section */}
      <section className="py-20 bg-white border-y border-stone-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Why Partner with SAGE-D?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our partnership models are designed to create sustainable, community-centered impact
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="saged-card border-0 text-center">
              <CardContent className="p-6">
                <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
                  <Target className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 text-lg">Context-Driven</h3>
                <p className="text-gray-600">
                  Education grounded in African realities and lived experiences
                </p>
              </CardContent>
            </Card>

            <Card className="saged-card border-0 text-center">
              <CardContent className="p-6">
                <div className="w-14 h-14 rounded-full bg-orange-50 flex items-center justify-center mx-auto mb-4">
                  <UserCheck className="w-7 h-7 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 text-lg">Sustainable Impact</h3>
                <p className="text-gray-600">
                  Build capacity that grows and multiplies over time
                </p>
              </CardContent>
            </Card>

            <Card className="saged-card border-0 text-center">
              <CardContent className="p-6">
                <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                  <Lightbulb className="w-7 h-7 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 text-lg">Innovation Focus</h3>
                <p className="text-gray-600">
                  Turn local challenges into opportunities for creative solutions
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-stone-900 to-blue-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 african-pattern opacity-10"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Community?
          </h2>
          <p className="text-xl text-gray-200 mb-8 leading-relaxed">
            Let's discuss how SAGE-D can partner with your institution to build sustainable 
            AI education and innovation capacity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="bg-white text-blue-900 hover:bg-stone-100 font-medium px-8 py-4 rounded-none transition-colors duration-200 shadow-lg hover:shadow-xl text-lg h-auto">
                <Mail className="w-5 h-5 mr-2" />
                Contact Us About Partnerships
              </Button>
            </Link>
            <Link href="/contact">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-white text-white hover:bg-white hover:text-blue-900 px-8 py-4 rounded-none transition-colors duration-200 text-lg h-auto"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Request Partnership Guide
              </Button>
            </Link>
          </div>
          <p className="text-gray-300 mt-6">
            Response time: Within 24 hours | Free consultation included
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
