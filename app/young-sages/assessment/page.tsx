"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Brain, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  CheckCircle2, 
  Lightbulb,
  MessageSquare,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";

const QUESTIONS = [
  {
    id: 1,
    type: "mcq",
    question: "When Leuk the Hare enters the lion's den, what is the first thing he does?",
    options: [
      { text: "Runs away as fast as possible", value: "a" },
      { text: "Observes the signals (footprints) on the ground", value: "b" },
      { text: "Starts a fire to scare the lion", value: "c" },
      { text: "Sings a song to greet the lion", value: "d" }
    ],
    correctAnswer: "b"
  },
  {
    id: 2,
    type: "mcq",
    question: "Why did Leuk remember the pattern of the footprints?",
    options: [
      { text: "To count how many lions were in the savanna", value: "a" },
      { text: "To check if anyone came out of the cave after going in", value: "b" },
      { text: "To draw them later in the sand", value: "c" },
      { text: "He was just practicing his memory", value: "d" }
    ],
    correctAnswer: "b"
  },
  {
    id: 3,
    type: "mcq",
    question: "In AI systems, what is a 'signal'?",
    options: [
      { text: "A loud noise that warns everyone", value: "a" },
      { text: "Data from the environment that gives information", value: "b" },
      { text: "A traffic light in a smart city", value: "c" },
      { text: "A secret code used by robots", value: "d" }
    ],
    correctAnswer: "b"
  },
  {
    id: 4,
    type: "mcq",
    question: "What makes a 'Strategist' different from an 'Observer'?",
    options: [
      { text: "They have better eyesight and can see further", value: "a" },
      { text: "They use their memories to plan their next move", value: "b" },
      { text: "They are faster runners than observers", value: "c" },
      { text: "They are older and have more experience", value: "d" }
    ],
    correctAnswer: "b"
  },
  {
    id: 5,
    type: "written",
    question: "Imagine you are Leuk the Hare. You see a new pattern in the savanna. How would you use your 'AI Thinking' (Observe, Remember, Strategize) to stay safe?",
    placeholder: "I would observe...",
    icon: Lightbulb
  },
  {
    id: 6,
    type: "written",
    question: "If you could build a 'Sage Tool' to help your community, what would it be and how would it use observation?",
    placeholder: "My Sage Tool would be...",
    icon: MessageSquare
  }
];

export default function YoungSagesAssessmentPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [studentName, setStudentName] = useState("");
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalSteps = QUESTIONS.length + 1; // +1 for the name step
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      submitAssessment();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const submitAssessment = async () => {
    setIsSubmitting(true);
    
    // Calculate MC score
    let mcScore = 0;
    QUESTIONS.filter(q => q.type === "mcq").forEach(q => {
      if (answers[q.id] === q.correctAnswer) {
        mcScore += 1;
      }
    });

    try {
      const response = await fetch("/api/assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: studentName,
          answers,
          mcScore,
          type: "young-sages-final"
        }),
      });

      const data = await response.json();
      if (data.id) {
        router.push(`/young-sages/completion?id=${data.id}&name=${encodeURIComponent(studentName)}`);
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStepValid = () => {
    if (currentStep === 0) return studentName.trim().length > 0;
    const currentQuestion = QUESTIONS[currentStep - 1];
    return answers[currentQuestion.id] !== undefined && answers[currentQuestion.id].trim().length > 0;
  };

  return (
    <div className="min-h-screen bg-[#FDF8F0] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 bg-[#124734]/10 text-[#124734] px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Brain className="w-4 h-4" />
            Young Sages: Final Assessment
          </div>
          <h1 className="text-3xl font-bold text-[#124734] mb-2">Show Your Wisdom!</h1>
          <p className="text-gray-600">Complete this journey to become a true Sage.</p>
        </div>

        <div className="mb-6">
          <div className="flex justify-between text-xs font-medium text-gray-500 mb-2">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2 bg-amber-100" />
        </div>

        <Card className="shadow-xl border-t-4 border-[#124734]">
          <CardContent className="p-8">
            <AnimatePresence mode="wait">
              {currentStep === 0 ? (
                <motion.div
                  key="step-0"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center">
                    <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="w-8 h-8 text-[#D9A441]" />
                    </div>
                    <h2 className="text-2xl font-bold text-[#124734] mb-2">Welcome, Young Sage!</h2>
                    <p className="text-gray-600">Before we begin, tell us your name so we can prepare your certificate.</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Your First Name</label>
                    <Input 
                      placeholder="e.g. Ama" 
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      className="border-amber-200 focus:border-[#124734] focus:ring-[#124734]"
                    />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key={`step-${currentStep}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  {(() => {
                    const question = QUESTIONS[currentStep - 1];
                    return (
                      <>
                        <div>
                          <div className="flex items-center gap-3 mb-4">
                            <div className="bg-[#124734] text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                              {currentStep}
                            </div>
                            <h3 className="text-xl font-bold text-[#124734] leading-tight">
                              {question.question}
                            </h3>
                          </div>
                          
                          {question.type === "mcq" ? (
                            <div className="grid gap-3">
                              {question.options?.map((option) => (
                                <button
                                  key={option.value}
                                  onClick={() => setAnswers({ ...answers, [question.id]: option.value })}
                                  className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                                    answers[question.id] === option.value
                                      ? "border-[#124734] bg-[#124734]/5 text-[#124734] font-medium"
                                      : "border-gray-100 hover:border-amber-200 bg-white"
                                  }`}
                                >
                                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                    answers[question.id] === option.value ? "border-[#124734]" : "border-gray-300"
                                  }`}>
                                    {answers[question.id] === option.value && <div className="w-2.5 h-2.5 bg-[#124734] rounded-full" />}
                                  </div>
                                  {option.text}
                                </button>
                              ))}
                            </div>
                          ) : (
                            <div className="space-y-4">
                              <div className="bg-amber-50 p-4 rounded-lg flex items-start gap-3 border border-amber-100">
                                {question.icon && <question.icon className="w-5 h-5 text-[#D9A441] mt-0.5 flex-shrink-0" />}
                                <p className="text-sm text-amber-800 italic">
                                  There are no wrong answers here! Show us how you think.
                                </p>
                              </div>
                              <Textarea
                                placeholder={question.placeholder}
                                value={answers[question.id] || ""}
                                onChange={(e) => setAnswers({ ...answers, [question.id]: e.target.value })}
                                className="min-h-[150px] border-amber-200 focus:border-[#124734] focus:ring-[#124734]"
                              />
                            </div>
                          )}
                        </div>
                      </>
                    );
                  })()}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center justify-between mt-10 pt-6 border-t border-gray-100">
              <Button
                variant="ghost"
                onClick={handleBack}
                disabled={currentStep === 0 || isSubmitting}
                className="text-gray-500"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button
                onClick={handleNext}
                disabled={!isStepValid() || isSubmitting}
                className="bg-[#124734] hover:bg-[#0d3324] text-white px-8"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : currentStep === totalSteps - 1 ? (
                  <>
                    Finish Assessment
                    <CheckCircle2 className="w-4 h-4 ml-2" />
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-gray-400 mt-8">
          &ldquo;Intelligence is not just memory. It is updating memory when patterns change.&rdquo;
        </p>
      </div>
    </div>
  );
}
