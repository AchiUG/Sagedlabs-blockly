
"use client"

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Header from '@/components/navigation/header';
import Footer from '@/components/navigation/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Target, 
  Users, 
  Briefcase, 
  Crown, 
  ArrowRight, 
  Coins, 
  Award,
  BookOpen,
  TrendingUp,
  Gift,
  Globe,
  GraduationCap,
  Heart,
  Lightbulb,
  Sparkles
} from 'lucide-react';

const pathways = [
  {
    name: "Young Sages Program",
    audience: "Students (ages 8–17)",
    goal: "Ignite imagination & AI curiosity through play and storytelling",
    journey: "Dreamer → Builder → Navigator",
    endMastery: "Future-ready & wonder-driven youth",
    icon: Sparkles,
    color: "#F59E0B"
  },
  {
    name: "Educator Pathway",
    audience: "Teachers, mentors, facilitators",
    goal: "Integrate AI into teaching & lead others responsibly",
    journey: "Seeker → Apprentice → Cultivator → Griot-Scholar",
    endMastery: "Architect of Learning",
    icon: GraduationCap,
    color: "#3B82F6"
  },
  {
    name: "Technologist Pathway",
    audience: "IT professionals, creatives, engineers",
    goal: "Master contextual AI design, ethics, and systems thinking",
    journey: "Seeker → Apprentice → Cultivator → Scholar-Architect",
    endMastery: "Guardian of Systems",
    icon: Briefcase,
    color: "#8B5CF6"
  },
  {
    name: "SAGE Mastery Track",
    audience: "Cross-disciplinary alumni from any path",
    goal: "Integrate all pathways — create, defend, and teach systems of wisdom",
    journey: "Architect → Guardian → Sage",
    endMastery: "Keeper of Agency & Wisdom",
    icon: Crown,
    color: "#EC4899"
  }
];

const stages = [
  { id: 1, name: "Seeker", description: "Curious beginner exploring knowledge", color: "#60A5FA" },
  { id: 2, name: "Apprentice", description: "Guided learner under mentors", color: "#34D399" },
  { id: 3, name: "Cultivator", description: "Peer mentor helping others", color: "#FBBF24" },
  { id: 4, name: "Griot-Scholar", description: "Cultural educator and storyteller", color: "#F97316" },
  { id: 5, name: "Architect", description: "Systems builder and designer", color: "#A78BFA" },
  { id: 6, name: "Guardian", description: "Protector of knowledge and ethics", color: "#EC4899" },
  { id: 7, name: "Sage", description: "Wisdom keeper and master", color: "#8B5CF6" }
];

const subscriptionTiers = [
  {
    tier: "Basic (Seeker)",
    description: "Entry-level access to foundational micro-courses and community forum.",
    monthlyCost: "$9.99/month",
    benefits: "Access to 10+ 30-minute AI micro-courses; earn first SAGE Tokens by completing reflections and quizzes.",
    tokenEarningRate: "1 SAGE Token / module completed",
    color: "#60A5FA"
  },
  {
    tier: "Pro (Apprentice)",
    description: "Full access to all educator & technologist pathways, plus mentor pairing and AI project labs.",
    monthlyCost: "$19.99/month",
    benefits: "Unlock CREATE™ framework learning tracks, access mentorship circle, and join AI-assisted projects.",
    tokenEarningRate: "2 SAGE Tokens / module + 5 per project completed",
    color: "#34D399",
    popular: true
  },
  {
    tier: "Mentor (Cultivator / Griot-Scholar)",
    description: "Advanced track for those teaching, mentoring, or creating their own courses.",
    monthlyCost: "$49/month",
    benefits: "Publish your own micro-courses, earn revenue share, gain certification as SAGE-D Mentor, and get priority in research tasks.",
    tokenEarningRate: "3 SAGE Tokens / module + 10 per cohort taught",
    color: "#FBBF24"
  }
];

const tokenUtilities = [
  {
    icon: Gift,
    useCase: "Redeem for Learning Credits",
    description: "Use tokens to unlock premium modules, one-on-one coaching, or new pathways."
  },
  {
    icon: Coins,
    useCase: "Monetize Insights",
    description: "Exchange tokens for paid \"AI Research Micro-tasks\" — e.g., summarize a policy or generate contextual insights for partners."
  },
  {
    icon: TrendingUp,
    useCase: "Convert to Wallet Value",
    description: "Linked to the SAGE-D crypto wallet; tokens can be withdrawn or transferred as rewards for verified output."
  },
  {
    icon: Award,
    useCase: "Depth Portfolio Weighting",
    description: "Higher SAGE Token scores boost your verified SAGE-D profile and LinkedIn referral rank."
  },
  {
    icon: Users,
    useCase: "Teach-to-Earn",
    description: "Educators can teach short modules and earn SAGE Tokens for every learner completion."
  },
  {
    icon: Globe,
    useCase: "Diaspora Impact Projects",
    description: "Donate or stake tokens into SAGE-D Impact Labs — supporting African-led AI and education projects."
  }
];

const earningExamples = [
  { activity: "Complete 3 modules/week", reward: "12 SAGE Tokens/month" },
  { activity: "Host a learning circle", reward: "+15 SAGE Tokens" },
  { activity: "Publish a verified micro-course", reward: "+25 SAGE Tokens" },
  { activity: "Peer-review or mentor others", reward: "+10 SAGE Tokens" },
  { activity: "Reach Griot-Scholar level", reward: "unlock SAGE Faculty Wallet (100 Token Bonus)" }
];

export default function CurriculumPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="saged-hero-gradient py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              SAGE-D Curriculum
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              A comprehensive learning ecosystem designed to transform learners into wisdom keepers
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pathways Overview */}
      <section className="py-20 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Learning Pathways
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Four distinct pathways designed for different learner archetypes
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {pathways.map((pathway) => {
              const IconComponent = pathway.icon;
              return (
                <Card key={pathway.name} className="saged-card border-2 hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center mb-4">
                      <div 
                        className="w-14 h-14 rounded-full flex items-center justify-center mr-4"
                        style={{ backgroundColor: `${pathway.color}20` }}
                      >
                        <IconComponent className="w-7 h-7" style={{ color: pathway.color }} />
                      </div>
                      <div>
                        <CardTitle className="text-2xl" style={{ color: pathway.color }}>
                          {pathway.name}
                        </CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-semibold text-gray-500">AUDIENCE</p>
                        <p className="text-gray-700">{pathway.audience}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-500">GOAL</p>
                        <p className="text-gray-700">{pathway.goal}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-500">JOURNEY</p>
                        <p className="text-gray-700 font-medium">{pathway.journey}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-500">END MASTERY</p>
                        <p className="text-gray-900 font-bold">{pathway.endMastery}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Traditional Table View */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 border-b">Pathway</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 border-b">Audience</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 border-b">Goal</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 border-b">Journey</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 border-b">End Mastery</th>
                </tr>
              </thead>
              <tbody>
                {pathways.map((pathway, index) => (
                  <tr key={pathway.name} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 border-b">
                      <span className="font-bold" style={{ color: pathway.color }}>
                        {pathway.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 border-b">{pathway.audience}</td>
                    <td className="px-6 py-4 text-sm text-gray-700 border-b">{pathway.goal}</td>
                    <td className="px-6 py-4 text-sm text-gray-700 border-b font-medium">{pathway.journey}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 border-b font-semibold">{pathway.endMastery}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Stage Progression */}
      <section className="py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Stage Progression
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Your journey from Seeker to Sage — a spiral of continuous growth
            </p>
          </div>

          {/* Spiral/Tree Visualization */}
          <div className="grid md:grid-cols-7 gap-4 mb-12">
            {stages.map((stage, index) => (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="text-center border-2 hover:shadow-lg transition-all duration-300" style={{ borderColor: stage.color }}>
                  <CardHeader>
                    <div 
                      className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl font-bold text-white"
                      style={{ backgroundColor: stage.color }}
                    >
                      {stage.id}
                    </div>
                    <CardTitle className="text-lg" style={{ color: stage.color }}>
                      {stage.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-gray-600">{stage.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Flow Arrows */}
          <div className="text-center">
            <p className="text-gray-600 text-lg mb-4">Your learning journey unfolds through continuous stages of mastery</p>
            <div className="flex items-center justify-center space-x-2 text-blue-600">
              <ArrowRight className="w-6 h-6" />
              <ArrowRight className="w-6 h-6" />
              <ArrowRight className="w-6 h-6" />
              <span className="text-sm font-medium">Continuous Growth</span>
              <ArrowRight className="w-6 h-6" />
              <ArrowRight className="w-6 h-6" />
              <ArrowRight className="w-6 h-6" />
            </div>
          </div>
        </div>
      </section>

      {/* Subscription Tiers */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Subscription & Token Economy
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Flexible pricing that rewards your learning journey
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {subscriptionTiers.map((tier, index) => (
              <Card 
                key={tier.tier} 
                className={`relative border-2 hover:shadow-xl transition-all duration-300 ${
                  tier.popular ? 'border-blue-500 shadow-lg' : 'border-gray-200'
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-blue-600 text-white px-4 py-1">MOST POPULAR</Badge>
                  </div>
                )}
                <CardHeader>
                  <div 
                    className="w-14 h-14 rounded-full flex items-center justify-center mb-4 mx-auto"
                    style={{ backgroundColor: `${tier.color}30` }}
                  >
                    <BookOpen className="w-7 h-7" style={{ color: tier.color }} />
                  </div>
                  <CardTitle className="text-2xl text-center mb-2">{tier.tier}</CardTitle>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-gray-900">{tier.monthlyCost}</p>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">{tier.description}</p>
                  </div>
                  <div className="border-t pt-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Benefits:</p>
                    <p className="text-sm text-gray-600">{tier.benefits}</p>
                  </div>
                  <div className="border-t pt-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Token Earning:</p>
                    <Badge variant="secondary" className="w-full justify-center py-2">
                      {tier.tokenEarningRate}
                    </Badge>
                  </div>
                  <Link href="/auth/signup">
                    <Button 
                      className={`w-full ${tier.popular ? 'saged-button' : 'saged-button-outline'}`}
                      size="lg"
                    >
                      Get Started
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Traditional Table View */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 border-b">Tier</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 border-b">Description</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 border-b">Monthly Cost</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 border-b">Benefits</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 border-b">Token Earning Rate</th>
                </tr>
              </thead>
              <tbody>
                {subscriptionTiers.map((tier, index) => (
                  <tr key={tier.tier} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 border-b">
                      <span className="font-bold" style={{ color: tier.color }}>
                        {tier.tier}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 border-b">{tier.description}</td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900 border-b">{tier.monthlyCost}</td>
                    <td className="px-6 py-4 text-sm text-gray-700 border-b">{tier.benefits}</td>
                    <td className="px-6 py-4 text-sm text-gray-700 border-b">{tier.tokenEarningRate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* SAGE Token Utility */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              SAGE Token Utility
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              SAGE Token represents earned depth and contribution within the SAGE-D ecosystem
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {tokenUtilities.map((utility) => {
              const IconComponent = utility.icon;
              return (
                <Card key={utility.useCase} className="saged-card border-0 hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center mb-4">
                      <IconComponent className="w-7 h-7 text-white" />
                    </div>
                    <CardTitle className="text-lg">{utility.useCase}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm">{utility.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Earning Examples */}
          <Card className="border-2 border-blue-200 bg-white">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl mb-2">Earning Opportunities</CardTitle>
              <CardDescription>Multiple ways to earn SAGE Tokens as you learn and contribute</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {earningExamples.map((example, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">{example.activity}</span>
                    <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                      {example.reward}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Integration Info */}
          <div className="mt-12 text-center">
            <Card className="inline-block border-blue-200 bg-white max-w-3xl">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Ecosystem Integration</h3>
                <ul className="text-left space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <Lightbulb className="w-5 h-5 mr-3 mt-1 text-blue-600 flex-shrink-0" />
                    <span>Connect to SAGE-D's <strong>AI-Assisted Learning Platform</strong> — each reflection, quiz, or synthesis project is automatically recorded on your Depth Portfolio.</span>
                  </li>
                  <li className="flex items-start">
                    <Award className="w-5 h-5 mr-3 mt-1 text-blue-600 flex-shrink-0" />
                    <span>Integrate with <strong>LinkedIn credentialing API</strong> for verified recommendations.</span>
                  </li>
                  <li className="flex items-start">
                    <Target className="w-5 h-5 mr-3 mt-1 text-blue-600 flex-shrink-0" />
                    <span>SAGE Tokens appear as <strong>Proof-of-Depth badges</strong> on learner dashboards.</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Layer */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Ready to Begin Your Journey?
            </h2>
            <p className="text-xl text-gray-600">
              Choose your path and start earning while you learn
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            <Link href="/auth/signup" className="block">
              <Button className="w-full h-20 text-lg saged-button">
                Join Now
              </Button>
            </Link>
            <Link href="/courses" className="block">
              <Button className="w-full h-20 text-lg saged-button-outline">
                View Courses
              </Button>
            </Link>
            <Link href="/community" className="block">
              <Button className="w-full h-20 text-lg saged-button-outline">
                Become a Mentor
              </Button>
            </Link>
            <Link href="/partnerships" className="block">
              <Button className="w-full h-20 text-lg saged-button-outline">
                Partner with Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
