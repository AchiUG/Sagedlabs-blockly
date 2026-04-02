
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import ArchetypeQuiz from '@/components/archetype-quiz';
import PathwaySelector from '@/components/pathway-selector';
import SubscriptionSelector from '@/components/subscription-selector';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, Sparkles, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { subscriptionService, type SubscriptionTier } from '@/lib/services/subscription-service';
import type { ArchetypeType } from '@/lib/services/archetype-service';

type FlowStep = 'quiz' | 'result' | 'pathway' | 'subscription' | 'registration';

interface ArchetypeResult {
  profile: any;
  metadata: any;
}

export default function DiscoverJourneyPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<FlowStep>('quiz');
  const [archetypeResult, setArchetypeResult] = useState<ArchetypeResult | null>(null);
  const [selectedPathway, setSelectedPathway] = useState<string>('');
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier>('pro');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    walletEnabled: false,
    acceptTerms: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const stepProgress = {
    quiz: 20,
    result: 40,
    pathway: 60,
    subscription: 80,
    registration: 90,
  };

  const handleQuizComplete = (result: ArchetypeResult) => {
    setArchetypeResult(result);
    setCurrentStep('result');
  };

  const handleContinueFromResult = () => {
    if (archetypeResult) {
      setCurrentStep('pathway');
    }
  };

  const handlePathwaySelect = (pathway: string) => {
    setSelectedPathway(pathway);
  };

  const handleContinueFromPathway = () => {
    if (selectedPathway) {
      if (archetypeResult) {
        const recommended = subscriptionService.getRecommendedPlan(
          archetypeResult.profile.primary
        );
        setSelectedTier(recommended);
      }
      setCurrentStep('subscription');
    } else {
      toast.error('Please select a pathway');
    }
  };

  const handleSubscriptionSelect = (tier: SubscriptionTier) => {
    setSelectedTier(tier);
  };

  const handleContinueFromSubscription = () => {
    setCurrentStep('registration');
  };

  const handleSubmitRegistration = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.acceptTerms) {
      toast.error('Please accept the terms and conditions');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/signup-with-journey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          archetype: archetypeResult?.profile.primary,
          archetypeSecondary: archetypeResult?.profile.secondary,
          pathwayType: selectedPathway,
          subscriptionTier: selectedTier,
          walletEnabled: formData.walletEnabled,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      toast.success('Welcome to SAGED! Redirecting to login...');
      setTimeout(() => {
        router.push('/login?journey=complete');
      }, 2000);

    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    const steps: FlowStep[] = ['quiz', 'result', 'pathway', 'subscription', 'registration'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#7C5E4A]/5 via-white to-[#CC8B3C]/5">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#7C5E4A] mb-3">
            <Sparkles className="inline-block w-8 h-8 mr-2 text-[#CC8B3C]" />
            Discover Your Learning Journey
          </h1>
          <p className="text-lg text-gray-600">
            Take our archetype quiz to personalize your AI learning experience
          </p>
        </div>

        <div className="mb-8">
          <Progress value={stepProgress[currentStep]} className="h-2" />
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>Step {Object.keys(stepProgress).indexOf(currentStep) + 1} of 5</span>
            <span>{stepProgress[currentStep]}% Complete</span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {currentStep === 'quiz' && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ArchetypeQuiz onComplete={handleQuizComplete} />
            </motion.div>
          )}

          {currentStep === 'result' && archetypeResult && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="max-w-3xl mx-auto border-2 border-[#CC8B3C]/20">
                <CardHeader className="text-center">
                  <CardTitle className="text-3xl text-[#7C5E4A]">
                    Your Archetype: {archetypeResult.metadata.title}
                  </CardTitle>
                  <CardDescription className="text-lg">
                    {archetypeResult.metadata.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-[#CC8B3C]/5 p-6 rounded-lg">
                    <h3 className="font-semibold text-[#7C5E4A] mb-3">Your Strengths:</h3>
                    <ul className="space-y-2">
                      {archetypeResult.profile.strengths.map((strength: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <Sparkles className="w-4 h-4 text-[#CC8B3C] mt-1 flex-shrink-0" />
                          <span>{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h3 className="font-semibold text-[#7C5E4A] mb-2">Your Learning Path:</h3>
                    <p className="text-gray-700">{archetypeResult.profile.recommendedPath}</p>
                  </div>

                  <div className="bg-green-50 p-6 rounded-lg">
                    <h3 className="font-semibold text-[#7C5E4A] mb-2">Starting Point:</h3>
                    <p className="text-gray-700">
                      Stage {archetypeResult.profile.startingStage}:{' '}
                      {archetypeResult.profile.startingStageTitle}
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      {archetypeResult.metadata.welcomeMessage}
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      onClick={handleBack}
                      className="flex-1"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Retake Quiz
                    </Button>
                    <Button
                      onClick={handleContinueFromResult}
                      className="flex-1 bg-[#CC8B3C] hover:bg-[#CC8B3C]/90"
                    >
                      Continue
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {currentStep === 'pathway' && archetypeResult && (
            <motion.div
              key="pathway"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="max-w-5xl mx-auto">
                <Card className="mb-6">
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl text-[#7C5E4A]">
                      Choose Your Pathway
                    </CardTitle>
                    <CardDescription>
                      Select the learning track that aligns with your goals
                    </CardDescription>
                  </CardHeader>
                </Card>

                <PathwaySelector
                  selectedPathway={selectedPathway}
                  onSelect={handlePathwaySelect}
                  archetype={archetypeResult.profile.primary}
                />

                <div className="flex gap-4 mt-6">
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    className="flex-1"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button
                    onClick={handleContinueFromPathway}
                    className="flex-1 bg-[#CC8B3C] hover:bg-[#CC8B3C]/90"
                    disabled={!selectedPathway}
                  >
                    Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 'subscription' && (
            <motion.div
              key="subscription"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="max-w-6xl mx-auto">
                <Card className="mb-6">
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl text-[#7C5E4A]">
                      Select Your Subscription
                    </CardTitle>
                    <CardDescription>
                      Choose the plan that fits your learning goals
                    </CardDescription>
                  </CardHeader>
                </Card>

                <SubscriptionSelector
                  recommendedTier={selectedTier}
                  onSelect={handleSubscriptionSelect}
                  selectedTier={selectedTier}
                />

                <div className="flex gap-4 mt-6">
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    className="flex-1"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button
                    onClick={handleContinueFromSubscription}
                    className="flex-1 bg-[#CC8B3C] hover:bg-[#CC8B3C]/90"
                  >
                    Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 'registration' && (
            <motion.div
              key="registration"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="max-w-2xl mx-auto">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl text-[#7C5E4A]">
                    Complete Your Registration
                  </CardTitle>
                  <CardDescription>
                    Just a few more details to get started
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitRegistration} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) =>
                            setFormData({ ...formData, firstName: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) =>
                            setFormData({ ...formData, lastName: e.target.value })
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">Password *</Label>
                      <Input
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password *</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          setFormData({ ...formData, confirmPassword: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="walletEnabled"
                        checked={formData.walletEnabled}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, walletEnabled: checked as boolean })
                        }
                      />
                      <Label htmlFor="walletEnabled" className="text-sm">
                        Enable Web3 wallet for blockchain certificates (optional)
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="acceptTerms"
                        checked={formData.acceptTerms}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, acceptTerms: checked as boolean })
                        }
                      />
                      <Label htmlFor="acceptTerms" className="text-sm">
                        I accept the terms and conditions *
                      </Label>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleBack}
                        className="flex-1"
                        disabled={isLoading}
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 bg-[#CC8B3C] hover:bg-[#CC8B3C]/90"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Creating Account...
                          </>
                        ) : (
                          <>
                            Complete Registration
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
