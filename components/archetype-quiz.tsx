
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  GraduationCap, 
  Code, 
  Crown, 
  ChevronRight, 
  RotateCcw,
  Award,
  Coins,
  TrendingUp,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { archetypeService, type ArchetypeType } from '@/lib/services/archetype-service';

const questions = [
  {
    id: 1,
    question: "What drives your interest in AI?",
    options: [
      { text: "Teaching and mentoring others", archetype: "educator" },
      { text: "Building and creating solutions", archetype: "technologist" },
      { text: "Learning fundamentals first", archetype: "young_sage" },
      { text: "Mastering deep expertise", archetype: "sage_mastery" }
    ]
  },
  {
    id: 2,
    question: "How do you approach learning?",
    options: [
      { text: "I prefer sharing what I learn with my community", archetype: "educator" },
      { text: "I like hands-on projects and experimentation", archetype: "technologist" },
      { text: "I need strong foundational understanding", archetype: "young_sage" },
      { text: "I dive deep into specialized topics", archetype: "sage_mastery" }
    ]
  },
  {
    id: 3,
    question: "What's your current stage?",
    options: [
      { text: "I'm passionate about teaching AI concepts", archetype: "educator" },
      { text: "I'm focused on technical implementation", archetype: "technologist" },
      { text: "I'm just starting my AI journey", archetype: "young_sage" },
      { text: "I'm an experienced practitioner seeking mastery", archetype: "sage_mastery" }
    ]
  },
  {
    id: 4,
    question: "What impact do you want to create?",
    options: [
      { text: "Empower others through education", archetype: "educator" },
      { text: "Build solutions for African challenges", archetype: "technologist" },
      { text: "Develop a solid foundation for my future", archetype: "young_sage" },
      { text: "Become a thought leader and mentor", archetype: "sage_mastery" }
    ]
  }
];

const archetypes = {
  young_sage: {
    title: "Young Sage",
    icon: Sparkles,
    color: "#CC8B3C",
    bgColor: "rgba(204, 139, 60, 0.1)",
    description: "You're at the beginning of your AI journey, eager to build a strong foundation.",
    path: "Start with foundational courses in AI philosophy and technical basics.",
    nextSteps: [
      "Complete Foundations of Intelligence",
      "Master Python and Math fundamentals",
      "Join study groups with peers"
    ]
  },
  educator: {
    title: "AI Educator",
    icon: GraduationCap,
    color: "#C2694D",
    bgColor: "rgba(194, 105, 77, 0.1)",
    description: "You're passionate about teaching AI concepts and empowering others.",
    path: "Focus on pedagogy, curriculum design, and community building.",
    nextSteps: [
      "Learn AI pedagogy techniques",
      "Create educational content",
      "Lead community study groups"
    ]
  },
  technologist: {
    title: "AI Technologist",
    icon: Code,
    color: "#2563EB",
    bgColor: "rgba(37, 99, 235, 0.1)",
    description: "You're driven to build AI solutions that solve real African challenges.",
    path: "Deep-dive into technical implementation and project work.",
    nextSteps: [
      "Master ML/DL frameworks",
      "Build real-world projects",
      "Contribute to open source"
    ]
  },
  sage_mastery: {
    title: "Sage Mastery",
    icon: Crown,
    color: "#7C5E4A",
    bgColor: "rgba(124, 94, 74, 0.1)",
    description: "You're an experienced practitioner seeking deep expertise and thought leadership.",
    path: "Advanced topics, research, and mentorship opportunities.",
    nextSteps: [
      "Engage with cutting-edge research",
      "Mentor other learners",
      "Contribute to SAGE-D curriculum"
    ]
  }
};

// Pathway stages for visualization
const pathwayStages = [
  { stage: 1, title: 'Seeker', icon: Sparkles },
  { stage: 2, title: 'Apprentice', icon: GraduationCap },
  { stage: 3, title: 'Cultivator', icon: TrendingUp },
  { stage: 4, title: 'Griot-Scholar', icon: Award },
  { stage: 5, title: 'Architect', icon: Code },
  { stage: 6, title: 'Guardian', icon: Crown },
  { stage: 7, title: 'Sage', icon: Crown }
];

interface ArchetypeQuizProps {
  onComplete?: (result: { profile: any; metadata: any }) => void;
}

export default function ArchetypeQuiz({ onComplete }: ArchetypeQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [result, setResult] = useState<ArchetypeType | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showPathway, setShowPathway] = useState(false);

  const handleAnswer = (archetype: string) => {
    const newAnswers = [...answers, archetype];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate result using service
      const profile = archetypeService.calculateArchetype(newAnswers);
      const metadata = archetypeService.getArchetypeMetadata(profile.primary);
      setResult(profile.primary);
      
      // Call onComplete callback if provided
      if (onComplete) {
        onComplete({ profile, metadata });
      }
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setResult(null);
    setShowQuiz(true);
    setShowPathway(false);
  };

  if (!showQuiz && !result) {
    return (
      <section className="py-20 bg-gradient-to-br from-blue-50 to-orange-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              🚀 Discover Your AI Archetype
            </h2>
            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              Take our 5-minute quiz to discover your <strong>AI-Educator or Technologist Archetype</strong> and get a personalized learning path.
            </p>
            <Button 
              size="lg" 
              className="saged-button text-lg px-8 py-6 h-auto"
              onClick={() => setShowQuiz(true)}
            >
              Start Quiz <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
            <p className="text-sm text-gray-600 mt-6">
              4 quick questions • Personalized recommendations • Free
            </p>
          </motion.div>
        </div>
      </section>
    );
  }

  if (result) {
    const archetype = archetypes[result as keyof typeof archetypes];
    const metadata = archetypeService.getArchetypeMetadata(result);
    const profile = archetypeService.calculateArchetype(answers);
    const IconComponent = archetype.icon;

    // Show pathway preview if requested
    if (showPathway) {
      return (
        <section className="py-20 bg-gradient-to-br from-blue-50 to-orange-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Your Learning Journey
                </h2>
                <p className="text-xl text-gray-700 mb-2">
                  Progress from <strong>{profile.startingStageTitle}</strong> to <strong>Sage</strong>
                </p>
                <p className="text-gray-600">
                  Estimated duration: {metadata.estimatedDuration}
                </p>
              </div>

              {/* Pathway Stages */}
              <div className="grid grid-cols-1 md:grid-cols-7 gap-4 mb-12">
                {pathwayStages.map((stage, index) => {
                  const StageIcon = stage.icon;
                  const isStarting = stage.stage === profile.startingStage;
                  const isAccessible = stage.stage >= profile.startingStage;

                  return (
                    <Card 
                      key={stage.stage}
                      className={`relative ${isStarting ? 'ring-2 ring-orange-500 shadow-lg' : ''} ${!isAccessible ? 'opacity-50' : ''}`}
                    >
                      <CardContent className="p-4 text-center">
                        <div className={`w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center ${isStarting ? 'bg-orange-100' : 'bg-gray-100'}`}>
                          <StageIcon className={`w-6 h-6 ${isStarting ? 'text-orange-600' : 'text-gray-600'}`} />
                        </div>
                        <div className="text-xs font-semibold text-gray-500 mb-1">
                          Stage {stage.stage}
                        </div>
                        <div className="text-sm font-bold text-gray-900">
                          {stage.title}
                        </div>
                        {isStarting && (
                          <Badge className="mt-2 bg-orange-500 text-white text-xs">
                            You start here
                          </Badge>
                        )}
                      </CardContent>
                      {index < pathwayStages.length - 1 && (
                        <ArrowRight className="hidden md:block absolute -right-6 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      )}
                    </Card>
                  );
                })}
              </div>

              {/* Token Earning Preview */}
              <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 mb-8">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Coins className="w-8 h-8 text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        Earn SAGE Tokens as You Learn
                      </h3>
                      <p className="text-gray-700 mb-4">
                        Your journey begins with <strong>10 SAGE Tokens</strong>. Earn more by completing modules, reflecting on your learning, and contributing to the community.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center space-x-2">
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                          <span className="text-sm text-gray-700">Complete onboarding: <strong>+10 tokens</strong></span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                          <span className="text-sm text-gray-700">First reflection: <strong>+1 Reflection Token</strong></span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                          <span className="text-sm text-gray-700">Complete modules: <strong>+25 tokens each</strong></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* First Module Preview */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="text-2xl">Your First Module</CardTitle>
                  <CardDescription>Recommended based on your archetype</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start space-x-4">
                    <div 
                      className="w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: metadata.bgColor }}
                    >
                      <IconComponent className="w-8 h-8" style={{ color: metadata.color }} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-semibold text-gray-900 mb-2">
                        {metadata.firstCourse}
                      </h4>
                      <p className="text-gray-600 mb-4">
                        {metadata.description}
                      </p>
                      <Badge variant="secondary">Unlocked on signup</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="saged-button text-lg px-8 py-6 h-auto"
                  onClick={() => {
                    // Store archetype in sessionStorage for registration
                    sessionStorage.setItem('archetypeResult', JSON.stringify(profile));
                    window.location.href = '/auth/signup';
                  }}
                >
                  Join Now & Start Learning
                  <ChevronRight className="ml-2 w-5 h-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => setShowPathway(false)}
                >
                  Back to Results
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      );
    }

    return (
      <section className="py-20 bg-gradient-to-br from-blue-50 to-orange-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-2 shadow-xl" style={{ borderColor: archetype.color }}>
              <CardHeader className="text-center pb-4">
                <div 
                  className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: archetype.bgColor }}
                >
                  <IconComponent className="w-10 h-10" style={{ color: archetype.color }} />
                </div>
                <CardTitle className="text-3xl mb-2">Your Archetype: {archetype.title}</CardTitle>
                <CardDescription className="text-lg">{archetype.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gradient-to-r from-blue-50 to-orange-50 p-6 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-lg mb-3 flex items-center text-gray-900">
                    <Coins className="w-5 h-5 mr-2 text-amber-600" />
                    Your Journey Begins as a {profile.startingStageTitle}
                  </h4>
                  <p className="text-gray-700 mb-4">
                    Start free and earn your first <strong>10 SAGE Tokens</strong> upon completing onboarding.
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowPathway(true)}
                    className="w-full sm:w-auto"
                  >
                    Preview Your Complete Pathway
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>

                <div>
                  <h4 className="font-semibold text-lg mb-3 flex items-center">
                    <ChevronRight className="w-5 h-5 mr-2" style={{ color: archetype.color }} />
                    Your Recommended Path
                  </h4>
                  <p className="text-gray-700 pl-7">{archetype.path}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-lg mb-3 flex items-center">
                    <ChevronRight className="w-5 h-5 mr-2" style={{ color: archetype.color }} />
                    Next Steps
                  </h4>
                  <ul className="space-y-2 pl-7">
                    {archetype.nextSteps.map((step, index) => (
                      <li key={index} className="flex items-start text-gray-700">
                        <span className="mr-2">•</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 border-t flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg" 
                    className="saged-button"
                    onClick={() => {
                      // Store archetype in sessionStorage for registration
                      sessionStorage.setItem('archetypeResult', JSON.stringify(profile));
                      window.location.href = '/auth/signup';
                    }}
                  >
                    Join Now
                    <ChevronRight className="ml-2 w-5 h-5" />
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline"
                    onClick={resetQuiz}
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Retake Quiz
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-orange-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-2 border-blue-200 shadow-lg">
              <CardHeader>
                <div className="flex justify-between items-center mb-4">
                  <Badge variant="secondary">
                    Question {currentQuestion + 1} of {questions.length}
                  </Badge>
                  <div className="flex gap-2">
                    {questions.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full ${
                          index <= currentQuestion ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <CardTitle className="text-2xl">
                  {questions[currentQuestion].question}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {questions[currentQuestion].options.map((option, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start text-left h-auto py-4 px-6 hover:border-blue-500 hover:bg-blue-50 transition-all"
                    onClick={() => handleAnswer(option.archetype)}
                  >
                    <span className="text-base">{option.text}</span>
                  </Button>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
