"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Sparkles, Star, Heart, PartyPopper, ArrowRight,
  Loader2, CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

function CompletionContent() {
  const searchParams = useSearchParams();
  const assessmentId = searchParams.get("id");
  const studentName = searchParams.get("name") || "Young Sage";
  const [mcScore, setMcScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!assessmentId) { setLoading(false); return; }
    fetch(`/api/assessment/${assessmentId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.assessment) setMcScore(data.assessment.mcScore);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [assessmentId]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FDF8F0] via-[#F9F3E7] to-[#F0E5D3]">
      {/* Confetti-style header */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#124734] via-[#1a5740] to-[#124734] text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-6 left-[10%] text-5xl animate-pulse">✨</div>
          <div className="absolute top-10 right-[15%] text-4xl animate-pulse" style={{ animationDelay: "0.5s" }}>⭐</div>
          <div className="absolute bottom-6 left-[40%] text-5xl animate-pulse" style={{ animationDelay: "1s" }}>🎉</div>
          <div className="absolute top-4 left-[60%] text-3xl animate-pulse" style={{ animationDelay: "0.3s" }}>💫</div>
        </div>
        <div className="container mx-auto px-4 py-16 md:py-20 relative">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-[#D9A441] rounded-full mb-6 shadow-lg">
              <PartyPopper className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Assessment Complete!
            </h1>
            <p className="text-xl text-white/80">
              Amazing work, {studentName}!
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="https://media.istockphoto.com/id/2176225919/vector/bottom-letterhead-divider-templates-business-separator-footer-illustration-set.jpg?s=612x612&w=0&k=20&c=ZyiIuCaqEZqs4Lre-ADXdonQ0rEbfgzFJrrLzm9SKHU=">
            <path d="M0 60L48 55C96 50 192 40 288 35C384 30 480 30 576 33.3C672 36.7 768 43.3 864 45C960 46.7 1056 43.3 1152 38.3C1248 33.3 1344 26.7 1392 23.3L1440 20V60H1392C1344 60 1248 60 1152 60C1056 60 960 60 864 60C768 60 672 60 576 60C480 60 384 60 288 60C192 60 96 60 48 60H0Z" fill="#FDF8F0"/>
          </svg>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 max-w-2xl">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-[#124734]" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Score Preview */}
            <Card className="shadow-lg border-[#D9A441]/20 overflow-hidden">
              <CardContent className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-[#124734] mb-2">
                  Your Assessment Has Been Submitted
                </h2>
                <p className="text-gray-600 mb-6">
                  Your answers are now being reviewed by your teacher.
                </p>

                {mcScore !== null && (
                  <div className="bg-gradient-to-r from-[#124734]/5 to-[#D9A441]/5 rounded-xl p-6 mb-4">
                    <p className="text-sm text-gray-500 mb-1">Knowledge Questions Score</p>
                    <p className="text-4xl font-bold text-[#124734]">
                      {mcScore} <span className="text-lg font-normal text-gray-500">/ 6 correct</span>
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      {mcScore === 6 ? "Perfect score! 🌟" : mcScore >= 4 ? "Great work! 🎯" : mcScore >= 3 ? "Good effort! 💪" : "Keep learning! 📚"}
                    </p>
                  </div>
                )}

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-left">
                  <div className="flex items-start gap-3">
                    <Star className="w-5 h-5 text-[#D9A441] flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-gray-700">
                      <p className="font-semibold mb-1">What happens next?</p>
                      <ul className="space-y-1 text-gray-600">
                        <li>• Your teacher will review your written answers</li>
                        <li>• Each answer is scored on creativity, depth, and understanding</li>
                        <li>• Once reviewed, your results and certificate will be available</li>
                        <li>• A notification will be sent to your parent/guardian email</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Journey Recap */}
            <Card className="shadow-md">
              <CardContent className="p-6">
                <h3 className="font-bold text-[#124734] mb-4 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-rose-500" />
                  Your Sage Journey
                </h3>
                <div className="flex items-center justify-center gap-4 text-center py-4">
                  <div className="flex flex-col items-center">
                    <span className="text-3xl mb-1">👁️</span>
                    <span className="text-xs font-medium text-gray-600">Observer</span>
                  </div>
                  <ArrowRight className="w-5 h-5 text-[#D9A441]" />
                  <div className="flex flex-col items-center">
                    <span className="text-3xl mb-1">♟️</span>
                    <span className="text-xs font-medium text-gray-600">Strategist</span>
                  </div>
                  <ArrowRight className="w-5 h-5 text-[#D9A441]" />
                  <div className="flex flex-col items-center">
                    <span className="text-3xl mb-1">🛠️</span>
                    <span className="text-xs font-medium text-gray-600">Builder</span>
                  </div>
                  <ArrowRight className="w-5 h-5 text-[#D9A441]" />
                  <div className="flex flex-col items-center">
                    <span className="text-3xl mb-1">✨</span>
                    <span className="text-xs font-medium text-gray-600">Sage!</span>
                  </div>
                </div>
                <p className="text-center text-sm text-gray-500 italic mt-2">
                  &ldquo;Future-ready young thinkers capable of observing, strategizing, and building with intelligence and imagination.&rdquo;
                </p>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/young-sages">
                <Button variant="outline" className="border-[#124734] text-[#124734] hover:bg-[#124734]/5 w-full sm:w-auto">
                  Back to Young Sages
                </Button>
              </Link>
              <Link href="/">
                <Button className="bg-[#124734] hover:bg-[#0d3324] text-white w-full sm:w-auto">
                  Return Home
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AssessmentCompletePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FDF8F0] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#124734]" />
      </div>
    }>
      <CompletionContent />
    </Suspense>
  );
}
