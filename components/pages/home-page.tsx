
"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, Users, Award, Target, ChevronRight, Star, Check, 
  Globe, Heart, Brain, Video, MessageCircle, Lightbulb, Zap,
  TrendingUp, Shield, Sparkles, ArrowRight, Play, CheckCircle2, ArrowUp,
  Map
} from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Header from '@/components/navigation/header';
import Footer from '@/components/navigation/footer';
import ArchetypeQuiz from '@/components/archetype-quiz';
import CreatePhilosophy from '@/components/create-philosophy';

// Fade-in animation component
const FadeInSection = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

const valueProps = [
  { icon: Check, text: "24 weeks of comprehensive content" },
  { icon: Check, text: "6 core modules + capstone project" },
  { icon: Check, text: "Active community of 3,500+ members" },
  { icon: Check, text: "15+ expert instructors" },
  { icon: Check, text: "Live weekly sessions & Q&A" },
  { icon: Check, text: "Cancel anytime, no questions" }
];

const whyChooseSaged = [
  {
    icon: Globe,
    title: "Afrocentric Perspective",
    description: "AI education rooted in African philosophy, context, and lived experience. We center African knowledge systems and perspectives in every module."
  },
  {
    icon: Users,
    title: "Thriving Community",
    description: "Join a global network of African AI practitioners, researchers, and innovators building together. Collaborate, learn, and grow with peers who share your vision."
  },
  {
    icon: Brain,
    title: "Comprehensive Curriculum",
    description: "From philosophical foundations to cutting-edge applications. Master AI from first principles through a structured 24-week program designed for African contexts."
  },
  {
    icon: Target,
    title: "Real-World Applications",
    description: "Work on projects addressing African challenges in agriculture, healthcare, education, and governance. Build solutions that matter for our communities."
  },
  {
    icon: Shield,
    title: "Ethical AI Focus",
    description: "Learn to build AI systems that respect African values, protect privacy, and promote equity. Technology that serves humanity, not exploits it."
  },
  {
    icon: TrendingUp,
    title: "Career Advancement",
    description: "Gain skills and credentials recognized by employers globally. Build a portfolio of projects and join alumni working at leading tech companies and startups."
  }
];

// Sample courses for homepage preview
const sampleCourses = [
  {
    number: "01",
    title: "Foundations of Intelligence",
    duration: "3 weeks",
    topics: ["Afrocentric Epistemology", "Learning Theories", "Philosophy of AI", "Ethics & History"],
    description: "Build your AI foundation on African knowledge systems"
  },
  {
    number: "02", 
    title: "Technical Foundations",
    duration: "5 weeks",
    topics: ["Python Programming", "Data Science", "Machine Learning", "Deep Learning", "Prompt Engineering"],
    description: "Master the technical skills needed for AI development"
  },
  {
    number: "03",
    title: "Intelligence as Agency",
    duration: "3 weeks",
    topics: ["AI Agents", "Ethical AI", "Narrative Power", "Institution Redesign"],
    description: "Understand AI as a tool for empowerment and change"
  }
];

const communityFeatures = [
  {
    icon: MessageCircle,
    title: "Active Forums",
    description: "Engage in thoughtful discussions with peers and instructors on AI ethics, technical challenges, and African innovation."
  },
  {
    icon: Video,
    title: "Weekly Live Sessions",
    description: "Join live Q&A sessions, workshops, and masterclasses with expert instructors and guest speakers from the field."
  },
  {
    icon: Users,
    title: "Study Groups",
    description: "Form study groups by module, region, or interest. Collaborate on projects and support each other's learning journey."
  },
  {
    icon: Award,
    title: "Project Showcase",
    description: "Share your capstone projects and receive feedback from the community. Build your portfolio with real work."
  }
];

const instructors = [
  {
    name: "John Obia",
    title: "Chief Sage Officer (CSO)",
    credentials: "Director, Design Oversight Cloud/AI, DTCC",
    image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 24 24' fill='none' stroke='%23cbd5e1' stroke-width='1.5'%3E%3Crect width='24' height='24' fill='%23f1f5f9'/%3E%3Cpath d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'/%3E%3Ccircle cx='12' cy='7' r='4'/%3E%3C/svg%3E"
  },
  {
    name: "Ayoge Bassey",
    title: "CEO",
    credentials: "LocalBaskets Canada",
    image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 24 24' fill='none' stroke='%23cbd5e1' stroke-width='1.5'%3E%3Crect width='24' height='24' fill='%23f1f5f9'/%3E%3Cpath d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'/%3E%3Ccircle cx='12' cy='7' r='4'/%3E%3C/svg%3E"
  },
  {
    name: "Achilike Ugonna Victor",
    title: "AI Operations Engineer & Program Coordinator",
    credentials: "SAGED",
    image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 24 24' fill='none' stroke='%23cbd5e1' stroke-width='1.5'%3E%3Crect width='24' height='24' fill='%23f1f5f9'/%3E%3Cpath d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'/%3E%3Ccircle cx='12' cy='7' r='4'/%3E%3C/svg%3E"
  },
  {
    name: "Naomi Nwokolo, Esq",
    title: "General Counsel and ESG Leader",
    credentials: "CEO, United Nations Global Compact",
    image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 24 24' fill='none' stroke='%23cbd5e1' stroke-width='1.5'%3E%3Crect width='24' height='24' fill='%23f1f5f9'/%3E%3Cpath d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'/%3E%3Ccircle cx='12' cy='7' r='4'/%3E%3C/svg%3E"
  }
];

const testimonials = [
  {
    name: "Kwesi Mensah",
    role: "AI Engineer, Accra",
    quote: "SAGED gave me the philosophical grounding and technical skills to build AI that truly serves African needs. The community is incredible.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
  },
  {
    name: "Amina Hassan",
    role: "Data Scientist, Nairobi",
    quote: "The Afrocentric approach opened my eyes to new possibilities. I'm now leading AI projects for financial inclusion in East Africa.",
    image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face"
  },
  {
    name: "Chidi Okonkwo",
    role: "Founder, Lagos",
    quote: "From philosophical foundations to building real products. SAGED prepared me to launch my AI startup focused on African agriculture.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
  }
];

export default function HomePage() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.3]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section - INSPIRE */}
      <section className="relative bg-gradient-to-br from-[#124734] via-[#1C2753] to-[#00A38B] text-white overflow-hidden min-h-screen flex items-center">
        <motion.div 
          className="absolute inset-0 african-pattern"
          style={{ y: heroY }}
        ></motion.div>
        <motion.div 
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 relative w-full"
          style={{ opacity: heroOpacity }}
        >
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1 
              className="hero-headline text-6xl md:text-7xl lg:text-8xl mb-8 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              Africa at the Center of Tomorrow's Intelligence
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-gray-200 mb-12 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              Master AI from an Afrocentric perspective. Learn from heritage, build for impact, and shape the future on Africa's own terms.
            </motion.p>

            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-3xl mx-auto mb-12 text-left"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.7 }}
            >
              {valueProps.map((prop, index) => {
                const IconComponent = prop.icon;
                return (
                  <motion.div 
                    key={index} 
                    className="flex items-start space-x-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.9 + index * 0.1 }}
                  >
                    <IconComponent className="w-5 h-5 text-[#D9A441] mt-1 flex-shrink-0" />
                    <span className="text-sm text-gray-200">{prop.text}</span>
                  </motion.div>
                );
              })}
            </motion.div>

            <motion.div 
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.4 }}
            >
              <Link href="/discover" className="block">
                <Button size="lg" className="saged-button text-lg px-8 py-6 h-auto font-bold">
                  Discover Your Path <ChevronRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/curriculum" className="block">
                <Button size="lg" className="saged-button text-lg px-8 py-6 h-auto font-bold">
                  View Learning Stages
                </Button>
              </Link>
            </motion.div>

            <motion.p 
              className="text-gray-400 mt-6 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.7 }}
            >
              3,500+ members • $97/month • 14-day money-back guarantee
            </motion.p>
          </div>
        </motion.div>
      </section>

      {/* Archetype Quiz - ENGAGE */}
      <div id="quiz">
        <FadeInSection>
          <ArchetypeQuiz />
        </FadeInSection>
      </div>

      {/* C.R.E.A.T.E. Philosophy - EDUCATE */}
      <FadeInSection delay={0.2}>
        <CreatePhilosophy />
      </FadeInSection>

      {/* Learning Pathways Map - INFORM */}
      <FadeInSection delay={0.2}>
        <section className="py-20 bg-gradient-to-b from-white to-stone-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Your Learning Journey
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Four progressive stages designed to take you from foundation to mastery
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { 
                  stage: "Stage 1", 
                  title: "Foundation", 
                  description: "Build your AI foundation with philosophy, ethics, and technical basics",
                  color: "#C2694D",
                  icon: Sparkles
                },
                { 
                  stage: "Stage 2", 
                  title: "Development", 
                  description: "Master technical skills: Python, ML, Deep Learning, and prompt engineering",
                  color: "#2563EB",
                  icon: Brain
                },
                { 
                  stage: "Stage 3", 
                  title: "Application", 
                  description: "Build AI agents and apply intelligence to real-world African challenges",
                  color: "#CC8B3C",
                  icon: Target
                },
                { 
                  stage: "Stage 4", 
                  title: "Mastery", 
                  description: "Complete your capstone project and become a certified AI practitioner",
                  color: "#7C5E4A",
                  icon: Award
                }
              ].map((pathway, index) => {
                const IconComponent = pathway.icon;
                return (
                  <Card key={index} className="saged-card border-2 hover:shadow-lg transition-all duration-300" style={{ borderColor: `${pathway.color}30` }}>
                    <CardHeader>
                      <div 
                        className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                        style={{ backgroundColor: `${pathway.color}15` }}
                      >
                        <IconComponent className="w-8 h-8" style={{ color: pathway.color }} />
                      </div>
                      <Badge className="w-fit mb-2" style={{ backgroundColor: pathway.color }}>
                        {pathway.stage}
                      </Badge>
                      <CardTitle className="text-xl">{pathway.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 leading-relaxed">{pathway.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="text-center mt-12">
              <Link href="/curriculum">
                <Button size="lg" variant="outline" className="border-2">
                  <Map className="w-5 h-5 mr-2" />
                  View Full Curriculum
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Sample Courses - DEMONSTRATE VALUE */}
      <FadeInSection delay={0.2}>
        <section id="sample-courses" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              What You'll Learn
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Sample modules from our comprehensive curriculum. <Link href="/discover" className="text-[#00A38B] hover:underline font-semibold">Discover your path</Link> to access the full catalog.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {sampleCourses.map((module, index) => {
              // Alternate colors for visual interest
              const isEarthTone = index % 2 === 0;
              return (
                <Card key={module.number} className="saged-card border-stone-200 hover:border-[#00A38B] transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-4">
                      <div 
                        className="text-5xl font-light"
                        style={{ color: isEarthTone ? 'rgba(194, 105, 77, 0.3)' : 'rgba(37, 99, 235, 0.3)' }}
                      >
                        {module.number}
                      </div>
                      <Badge variant="secondary" className="bg-stone-100 text-stone-700">
                        {module.duration}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl mb-2">{module.title}</CardTitle>
                    <CardDescription className="text-gray-600">{module.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {module.topics.map((topic, topicIndex) => (
                        <div key={topicIndex} className="flex items-start text-sm text-gray-600">
                          <ChevronRight 
                            className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" 
                            style={{ color: isEarthTone ? '#C2694D' : '#2563EB' }}
                          />
                          <span>{topic}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="text-center mb-8">
            <Link href="/courses">
              <Button size="lg" className="saged-button">
                View All Courses <ChevronRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <p className="text-sm text-gray-600 mt-4">Sign in to access the full curriculum with 20+ courses across all learning stages</p>
          </div>

          <div className="text-center">
            <Card className="inline-block border-[#00A38B]" style={{ background: 'linear-gradient(135deg, rgba(217, 164, 65, 0.1) 0%, rgba(0, 163, 139, 0.1) 100%)' }}>
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #D9A441 0%, #00A38B 100%)' }}>
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-center md:text-left">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Capstone Project</h3>
                    <p className="text-gray-700 text-lg">
                      Apply everything you've learned to design and build an AI solution addressing a real African challenge
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      </FadeInSection>

      {/* Community Features - SOCIAL PROOF */}
      <FadeInSection delay={0.2}>
        <section className="py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Join a Thriving Learning Community
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Connect, collaborate, and grow with 3,500+ members building Africa's AI future
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {communityFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              const colors = [
                { bg: 'rgba(194, 105, 77, 0.1)', icon: '#C2694D' },
                { bg: 'rgba(37, 99, 235, 0.1)', icon: '#2563EB' },
                { bg: 'rgba(204, 139, 60, 0.1)', icon: '#CC8B3C' },
                { bg: 'rgba(37, 99, 235, 0.1)', icon: '#2563EB' }
              ];
              return (
                <Card key={feature.title} className="saged-card border-0 text-center">
                  <CardHeader>
                    <div 
                      className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                      style={{ backgroundColor: colors[index].bg }}
                    >
                      <IconComponent className="w-7 h-7" style={{ color: colors[index].icon }} />
                    </div>
                    <CardTitle className="text-lg mb-2">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
      </FadeInSection>

      {/* Instructors - BUILD TRUST */}
      <FadeInSection delay={0.2}>
        <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Learn from Leading Experts
            </h2>
            <p className="text-xl text-gray-600">
              World-class instructors from top institutions
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {instructors.map((instructor) => (
              <div key={instructor.name} className="text-center group">
                <div className="relative w-48 h-48 mx-auto mb-4 rounded-full overflow-hidden bg-gray-200">
                  <Image
                    src={instructor.image}
                    alt={instructor.name}
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{instructor.name}</h3>
                <p className="font-medium mb-2" style={{ color: '#2563EB' }}>{instructor.title}</p>
                <p className="text-sm text-gray-600">{instructor.credentials}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      </FadeInSection>

      {/* Testimonials - SOCIAL PROOF */}
      <FadeInSection delay={0.2}>
        <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              What Our Members Say
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.name} className="saged-card border-0">
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 leading-relaxed italic">"{testimonial.quote}"</p>
                  <div>
                    <div className="font-bold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      </FadeInSection>

      {/* Pricing CTA - CONVERT */}
      <FadeInSection delay={0.2}>
        <section className="py-20 bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Ready to Join?
            </h2>
            <p className="text-xl text-gray-600">
              Simple, transparent pricing. One subscription, unlimited learning.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <Card className="border-2 border-gray-200">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl mb-4">Monthly</CardTitle>
                <div className="text-5xl font-bold text-gray-900">$97</div>
                <p className="text-gray-600 mt-2">/month</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Full access to all 6 modules</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Community forums & discussions</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Weekly live sessions</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Certificates of completion</span>
                  </li>
                </ul>
                <Link href="/discover">
                  <Button className="w-full saged-button-outline" size="lg">
                    Join Now
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-2 relative shadow-lg" style={{ borderColor: '#2563EB' }}>
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="text-white px-4 py-1" style={{ background: 'linear-gradient(135deg, #C2694D 0%, #2563EB 100%)' }}>BEST VALUE</Badge>
              </div>
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl mb-4">Annual</CardTitle>
                <div className="text-5xl font-bold text-gray-900">$970</div>
                <p className="text-gray-600 mt-2">/year</p>
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 mt-2">
                  Save $194
                </Badge>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700"><strong>Everything in Monthly, plus:</strong></span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Priority support</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">1-on-1 instructor sessions</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Annual member summit</span>
                  </li>
                </ul>
                <Link href="/discover">
                  <Button className="w-full saged-button" size="lg">
                    Join Now
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          <p className="text-center text-gray-600 mt-8 max-w-2xl mx-auto">
            14-day money-back guarantee • Cancel anytime • No questions asked
          </p>
        </div>
      </section>
      </FadeInSection>

      {/* Final CTA - CONVERT */}
      <FadeInSection delay={0.2}>
        <section className="py-20 text-white relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #7C5E4A 0%, #2563EB 100%)' }}>
        <div className="absolute inset-0 african-pattern"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <h2 className="hero-headline text-5xl md:text-6xl mb-6">
            Africa at the Center of Tomorrow's Intelligence
          </h2>
          <p className="text-xl text-gray-100 mb-8 leading-relaxed">
            Join 3,500+ members building a resilient human-machine future rooted in heritage, rich in perspective, and fully engaged with the global economy on Africa's own terms.
          </p>
          <Link href="/discover">
            <Button size="lg" className="bg-white text-blue-900 hover:bg-stone-100 font-medium px-8 py-4 rounded-none transition-colors duration-200 shadow-lg hover:shadow-xl text-lg h-auto">
              Join Our Community
            </Button>
          </Link>
        </div>
      </section>
      </FadeInSection>

      <Footer />

      {/* Scroll to Top Button */}
      <motion.button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-gradient-to-br from-orange-600 to-red-600 text-white shadow-lg hover:shadow-xl flex items-center justify-center z-50 transition-all duration-300 hover:scale-110"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ 
          opacity: showScrollTop ? 1 : 0,
          scale: showScrollTop ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
      >
        <ArrowUp className="w-6 h-6" />
      </motion.button>
    </div>
  );
}
