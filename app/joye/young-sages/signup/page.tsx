'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Sparkles, BookOpen, Users, Brain, Heart, Lightbulb, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';

const formSchema = z.object({
  // Identity & Contact
  childFirstName: z.string().min(1, 'First name is required').max(50),
  childLastName: z.string().min(1, 'Last name is required').max(50),
  childAge: z.number({ required_error: 'Age is required' }).min(8, 'Must be 8-14 years old').max(14, 'Must be 8-14 years old'),
  guardianName: z.string().min(1, 'Guardian name is required').max(100),
  guardianEmail: z.string().email('Valid email required'),
  guardianPhone: z.string().optional(),
  country: z.string().min(1, 'Country is required'),
  timezone: z.string().optional(),
  
  // Access & Setup
  hasComputer: z.boolean(),
  hasInternet: z.boolean(),
  accessNotes: z.string().optional(),
  
  // SAGE-D Pillars
  selfAwareness: z.number().min(1).max(5),
  agency: z.number().min(1).max(5),
  growth: z.number().min(1).max(5),
  ethics: z.number().min(1).max(5),
  design: z.number().min(1).max(5),
  
  // Motivation
  whyJoin: z.string().min(20, 'Please tell us a bit more (at least 20 characters)'),
  priorExperience: z.string().optional(),
  learningGoals: z.string().optional(),
  
  // Consent
  parentalConsent: z.literal(true, { errorMap: () => ({ message: 'Parental consent is required' }) }),
  mediaConsent: z.boolean(),
  rulesAccepted: z.literal(true, { errorMap: () => ({ message: 'You must accept the program rules' }) }),
  
  // Honeypot
  website: z.string().max(0).optional(),
});

type FormData = z.infer<typeof formSchema>;

const SECTIONS = [
  { id: 'identity', title: 'Identity & Contact', icon: Users },
  { id: 'access', title: 'Access & Setup', icon: BookOpen },
  { id: 'saged', title: 'SAGE-D Self-Check', icon: Sparkles },
  { id: 'motivation', title: 'Motivation', icon: Brain },
  { id: 'confirmation', title: 'Confirmation', icon: CheckCircle2 },
];

const COUNTRIES = [
  'United States', 'Canada', 'United Kingdom', 'Nigeria', 'Kenya', 'South Africa',
  'Ghana', 'Ethiopia', 'Tanzania', 'Uganda', 'India', 'Australia', 'Germany',
  'France', 'Brazil', 'Mexico', 'Japan', 'South Korea', 'Other'
];

const TIMEZONES = [
  'UTC-8 (Pacific)', 'UTC-7 (Mountain)', 'UTC-6 (Central)', 'UTC-5 (Eastern)',
  'UTC+0 (GMT)', 'UTC+1 (West Africa)', 'UTC+2 (Central Africa)', 'UTC+3 (East Africa)',
  'UTC+5:30 (India)', 'UTC+8 (Asia Pacific)', 'UTC+9 (Japan/Korea)', 'UTC+10 (Australia East)'
];

export default function YoungSagesSignupPage() {
  const router = useRouter();
  const [currentSection, setCurrentSection] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  const { register, handleSubmit, formState: { errors }, watch, setValue, trigger } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      hasComputer: true,
      hasInternet: true,
      selfAwareness: 3,
      agency: 3,
      growth: 3,
      ethics: 3,
      design: 3,
      parentalConsent: false as unknown as true,
      mediaConsent: false,
      rulesAccepted: false as unknown as true,
      website: '',
    },
  });
  
  const watchedValues = watch();
  
  const validateCurrentSection = async () => {
    const sectionFields: Record<number, (keyof FormData)[]> = {
      0: ['childFirstName', 'childLastName', 'childAge', 'guardianName', 'guardianEmail', 'country'],
      1: ['hasComputer', 'hasInternet'],
      2: ['selfAwareness', 'agency', 'growth', 'ethics', 'design'],
      3: ['whyJoin'],
      4: ['parentalConsent', 'rulesAccepted'],
    };
    
    const result = await trigger(sectionFields[currentSection]);
    return result;
  };
  
  const handleNext = async () => {
    const isValid = await validateCurrentSection();
    if (isValid && currentSection < SECTIONS.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };
  
  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };
  
  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      const response = await fetch('/api/joye/young-sages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit application');
      }
      
      router.push(`/joye/young-sages/success?status=${result.status}`);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const renderPillarScale = (name: 'selfAwareness' | 'agency' | 'growth' | 'ethics' | 'design', label: string, description: string, icon: React.ReactNode) => (
    <div className="space-y-3 p-4 bg-white/50 rounded-lg border">
      <div className="flex items-center gap-2">
        {icon}
        <Label className="font-semibold text-[#124734]">{label}</Label>
      </div>
      <p className="text-sm text-gray-600">{description}</p>
      <RadioGroup
        value={String(watchedValues[name])}
        onValueChange={(val) => setValue(name, parseInt(val))}
        className="flex gap-4 justify-center"
      >
        {[1, 2, 3, 4, 5].map((val) => (
          <div key={val} className="flex flex-col items-center gap-1">
            <RadioGroupItem value={String(val)} id={`${name}-${val}`} className="border-[#124734]" />
            <Label htmlFor={`${name}-${val}`} className="text-xs text-gray-500">
              {val === 1 ? 'Learning' : val === 3 ? 'Growing' : val === 5 ? 'Strong' : ''}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f5f0] via-white to-[#e8f5e9] py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-[#D9A441]/20 text-[#8B6914] px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            JOYE × SAGED Partnership
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#124734] mb-2">
            Young Sages Cohort Signup
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            Join our 8-week journey into AI thinking! Through stories, systems, and creativity,
            young minds (ages 8-14) will explore how intelligence works.
          </p>
        </div>
        
        {/* Progress Steps */}
        <div className="flex justify-center gap-2 mb-8">
          {SECTIONS.map((section, idx) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => idx <= currentSection && setCurrentSection(idx)}
                disabled={idx > currentSection}
                className={`flex items-center gap-1 px-3 py-2 rounded-full text-sm transition-all ${
                  idx === currentSection
                    ? 'bg-[#124734] text-white'
                    : idx < currentSection
                    ? 'bg-[#124734]/20 text-[#124734] cursor-pointer hover:bg-[#124734]/30'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden md:inline">{section.title}</span>
                <span className="md:hidden">{idx + 1}</span>
              </button>
            );
          })}
        </div>
        
        <Card className="border-[#124734]/20 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-[#124734] to-[#1a5c45] text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              {(() => {
                const Icon = SECTIONS[currentSection].icon;
                return <Icon className="w-5 h-5" />;
              })()}
              {SECTIONS[currentSection].title}
            </CardTitle>
            <CardDescription className="text-white/80">
              Step {currentSection + 1} of {SECTIONS.length}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-6">
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Honeypot field - hidden from users */}
              <input
                type="text"
                {...register('website')}
                className="absolute -left-[9999px]"
                tabIndex={-1}
                autoComplete="off"
              />
              
              {/* Section 1: Identity & Contact */}
              {currentSection === 0 && (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600 mb-4 bg-[#D9A441]/10 p-3 rounded-lg">
                    🌟 Let&apos;s get to know your young learner! This information helps us create the best experience.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="childFirstName">Child&apos;s First Name *</Label>
                      <Input
                        id="childFirstName"
                        {...register('childFirstName')}
                        placeholder="e.g., Amara"
                        className="mt-1"
                      />
                      {errors.childFirstName && <p className="text-red-500 text-sm mt-1">{errors.childFirstName.message}</p>}
                    </div>
                    <div>
                      <Label htmlFor="childLastName">Child&apos;s Last Name *</Label>
                      <Input
                        id="childLastName"
                        {...register('childLastName')}
                        placeholder="e.g., Johnson"
                        className="mt-1"
                      />
                      {errors.childLastName && <p className="text-red-500 text-sm mt-1">{errors.childLastName.message}</p>}
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="childAge">Child&apos;s Age (8-14) *</Label>
                    <Select
                      onValueChange={(val) => setValue('childAge', parseInt(val))}
                      value={watchedValues.childAge ? String(watchedValues.childAge) : undefined}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select age" />
                      </SelectTrigger>
                      <SelectContent>
                        {[8, 9, 10, 11, 12, 13, 14].map((age) => (
                          <SelectItem key={age} value={String(age)}>{age} years old</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.childAge && <p className="text-red-500 text-sm mt-1">{errors.childAge.message}</p>}
                  </div>
                  
                  <div className="border-t pt-4 mt-4">
                    <p className="text-sm font-medium text-[#124734] mb-3">👨‍👩‍👧 Parent/Guardian Information</p>
                    
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="guardianName">Parent/Guardian Full Name *</Label>
                        <Input
                          id="guardianName"
                          {...register('guardianName')}
                          placeholder="e.g., Sarah Johnson"
                          className="mt-1"
                        />
                        {errors.guardianName && <p className="text-red-500 text-sm mt-1">{errors.guardianName.message}</p>}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="guardianEmail">Email Address *</Label>
                          <Input
                            id="guardianEmail"
                            type="email"
                            {...register('guardianEmail')}
                            placeholder="e.g., parent@email.com"
                            className="mt-1"
                          />
                          {errors.guardianEmail && <p className="text-red-500 text-sm mt-1">{errors.guardianEmail.message}</p>}
                        </div>
                        <div>
                          <Label htmlFor="guardianPhone">Phone (Optional)</Label>
                          <Input
                            id="guardianPhone"
                            {...register('guardianPhone')}
                            placeholder="e.g., +1 555-123-4567"
                            className="mt-1"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="country">Country *</Label>
                          <Select
                            onValueChange={(val) => setValue('country', val)}
                            value={watchedValues.country}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select country" />
                            </SelectTrigger>
                            <SelectContent>
                              {COUNTRIES.map((country) => (
                                <SelectItem key={country} value={country}>{country}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country.message}</p>}
                        </div>
                        <div>
                          <Label htmlFor="timezone">Timezone (Optional)</Label>
                          <Select
                            onValueChange={(val) => setValue('timezone', val)}
                            value={watchedValues.timezone}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select timezone" />
                            </SelectTrigger>
                            <SelectContent>
                              {TIMEZONES.map((tz) => (
                                <SelectItem key={tz} value={tz}>{tz}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Section 2: Access & Setup */}
              {currentSection === 1 && (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600 mb-4 bg-[#D9A441]/10 p-3 rounded-lg">
                    💻 We want to make sure every young learner can participate fully!
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-4 bg-white rounded-lg border">
                      <Checkbox
                        id="hasComputer"
                        checked={watchedValues.hasComputer}
                        onCheckedChange={(checked) => setValue('hasComputer', !!checked)}
                      />
                      <div>
                        <Label htmlFor="hasComputer" className="font-medium">Access to a Computer or Tablet</Label>
                        <p className="text-sm text-gray-500">A laptop, desktop, or tablet that can run a web browser</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-4 bg-white rounded-lg border">
                      <Checkbox
                        id="hasInternet"
                        checked={watchedValues.hasInternet}
                        onCheckedChange={(checked) => setValue('hasInternet', !!checked)}
                      />
                      <div>
                        <Label htmlFor="hasInternet" className="font-medium">Reliable Internet Connection</Label>
                        <p className="text-sm text-gray-500">For live Saturday sessions and accessing course materials</p>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="accessNotes">Any Access Concerns?</Label>
                      <Textarea
                        id="accessNotes"
                        {...register('accessNotes')}
                        placeholder="Let us know if there are any challenges we should be aware of..."
                        className="mt-1"
                        rows={3}
                      />
                      <p className="text-xs text-gray-500 mt-1">We&apos;ll work with you to find solutions!</p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Section 3: SAGE-D Self-Check */}
              {currentSection === 2 && (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600 mb-4 bg-[#D9A441]/10 p-3 rounded-lg">
                    🌱 The SAGE-D pillars guide our learning journey. Help us understand where your child is today—there are no wrong answers!
                  </p>
                  
                  <div className="space-y-4">
                    {renderPillarScale(
                      'selfAwareness',
                      'S — Self-Awareness',
                      'How well does your child understand their own feelings and thoughts?',
                      <Heart className="w-4 h-4 text-pink-500" />
                    )}
                    
                    {renderPillarScale(
                      'agency',
                      'A — Agency',
                      'Does your child take initiative and make independent choices?',
                      <Lightbulb className="w-4 h-4 text-yellow-500" />
                    )}
                    
                    {renderPillarScale(
                      'growth',
                      'G — Growth Mindset',
                      'How does your child respond to challenges and new learning?',
                      <Sparkles className="w-4 h-4 text-green-500" />
                    )}
                    
                    {renderPillarScale(
                      'ethics',
                      'E — Ethics & Empathy',
                      'Does your child show care for others and think about fairness?',
                      <Users className="w-4 h-4 text-blue-500" />
                    )}
                    
                    {renderPillarScale(
                      'design',
                      'D — Design Thinking',
                      'Does your child enjoy creating, building, or solving puzzles?',
                      <Brain className="w-4 h-4 text-purple-500" />
                    )}
                  </div>
                </div>
              )}
              
              {/* Section 4: Motivation */}
              {currentSection === 3 && (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600 mb-4 bg-[#D9A441]/10 p-3 rounded-lg">
                    💭 Tell us about your hopes for this journey! We&apos;d love to hear from both parents and young learners.
                  </p>
                  
                  <div>
                    <Label htmlFor="whyJoin">Why does your child want to join Young Sages? *</Label>
                    <Textarea
                      id="whyJoin"
                      {...register('whyJoin')}
                      placeholder="What excites your child about learning AI and technology? What do they hope to discover?"
                      className="mt-1"
                      rows={4}
                    />
                    {errors.whyJoin && <p className="text-red-500 text-sm mt-1">{errors.whyJoin.message}</p>}
                  </div>
                  
                  <div>
                    <Label htmlFor="priorExperience">Any prior coding or technology experience?</Label>
                    <Textarea
                      id="priorExperience"
                      {...register('priorExperience')}
                      placeholder="It's okay if the answer is none! We welcome all experience levels."
                      className="mt-1"
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="learningGoals">What would make this program a success for your family?</Label>
                    <Textarea
                      id="learningGoals"
                      {...register('learningGoals')}
                      placeholder="Any specific skills, mindsets, or experiences you hope for..."
                      className="mt-1"
                      rows={3}
                    />
                  </div>
                </div>
              )}
              
              {/* Section 5: Confirmation */}
              {currentSection === 4 && (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600 mb-4 bg-[#D9A441]/10 p-3 rounded-lg">
                    ✅ Almost there! Please review and confirm the following.
                  </p>
                  
                  <div className="bg-white rounded-lg border p-4 space-y-4">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="parentalConsent"
                        checked={watchedValues.parentalConsent === true}
                        onCheckedChange={(checked) => setValue('parentalConsent', checked === true ? true : false as unknown as true, { shouldValidate: true })}
                      />
                      <div>
                        <Label htmlFor="parentalConsent" className="font-medium">Parental Consent *</Label>
                        <p className="text-sm text-gray-500">
                          I confirm I am the parent/guardian and give permission for my child to participate in the Young Sages program.
                        </p>
                      </div>
                    </div>
                    {errors.parentalConsent && <p className="text-red-500 text-sm">{errors.parentalConsent.message}</p>}
                    
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="mediaConsent"
                        checked={watchedValues.mediaConsent}
                        onCheckedChange={(checked) => setValue('mediaConsent', !!checked)}
                      />
                      <div>
                        <Label htmlFor="mediaConsent" className="font-medium">Media Consent (Optional)</Label>
                        <p className="text-sm text-gray-500">
                          I allow my child&apos;s work and first name to be featured in SAGED educational materials.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="rulesAccepted"
                        checked={watchedValues.rulesAccepted === true}
                        onCheckedChange={(checked) => setValue('rulesAccepted', checked === true ? true : false as unknown as true, { shouldValidate: true })}
                      />
                      <div>
                        <Label htmlFor="rulesAccepted" className="font-medium">Program Rules *</Label>
                        <p className="text-sm text-gray-500">
                          I understand this is an 8-week commitment with weekly lessons and Saturday live sessions. My child will participate respectfully and complete weekly activities.
                        </p>
                      </div>
                    </div>
                    {errors.rulesAccepted && <p className="text-red-500 text-sm">{errors.rulesAccepted.message}</p>}
                  </div>
                  
                  <div className="bg-[#124734]/5 rounded-lg p-4 border border-[#124734]/20">
                    <h4 className="font-semibold text-[#124734] mb-2">📋 Application Summary</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div><span className="text-gray-500">Learner:</span> {watchedValues.childFirstName} {watchedValues.childLastName}</div>
                      <div><span className="text-gray-500">Age:</span> {watchedValues.childAge} years</div>
                      <div><span className="text-gray-500">Guardian:</span> {watchedValues.guardianName}</div>
                      <div><span className="text-gray-500">Country:</span> {watchedValues.country}</div>
                    </div>
                  </div>
                  
                  {submitError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                      {submitError}
                    </div>
                  )}
                </div>
              )}
              
              {/* Navigation */}
              <div className="flex justify-between mt-8 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentSection === 0}
                  className="gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Previous
                </Button>
                
                {currentSection < SECTIONS.length - 1 ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="gap-2 bg-[#124734] hover:bg-[#0e3627]"
                  >
                    Next
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="gap-2 bg-[#D9A441] hover:bg-[#c4932f] text-white"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Submit Application
                      </>
                    )}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
        
        {/* Footer Info */}
        <div className="text-center mt-6 text-sm text-gray-500">
          <p>🔒 Your information is secure and will only be used for this program.</p>
          <p className="mt-1">Questions? Contact us at <span className="text-[#124734]">support@sagedlabs.com</span></p>
        </div>
      </div>
    </div>
  );
}
