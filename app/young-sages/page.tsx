"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sparkles,
  Brain,
  Users,
  Gamepad2,
  CheckCircle2,
  ArrowRight,
  Mail,
  Calendar,
  BookOpen,
  Star,
  Loader2,
  Heart,
} from "lucide-react";

export default function YoungSagesLandingPage() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          firstName,
          source: "young-sages-landing",
          interests: ["young-sages", "ai-education"],
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: "success", text: data.message });
        setEmail("");
        setFirstName("");
      } else {
        setMessage({ type: "error", text: data.message });
      }
    } catch {
      setMessage({ type: "error", text: "Something went wrong. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: Brain,
      title: "AI Thinking Skills",
      description: "Learn how intelligent systems observe, remember, and make decisions",
    },
    {
      icon: BookOpen,
      title: "Story-Based Learning",
      description: "Follow Leuk the Hare through African folktales reimagined for the AI age",
    },
    {
      icon: Gamepad2,
      title: "Interactive Games",
      description: "Play classroom games that teach pattern recognition and strategic thinking",
    },
    {
      icon: Users,
      title: "Community Learning",
      description: "Join a cohort of curious young minds exploring AI together",
    },
  ];

  const programHighlights = [
    "8 weeks of guided learning",
    "Interactive Blocks Lab coding",
    "Live classroom sessions",
    "Certificate of completion",
    "No prior coding experience needed",
    "Designed for ages 8-14",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-yellow-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/savanna-pattern.svg')] opacity-5" />
        <div className="container mx-auto px-4 py-16 md:py-24 relative">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Now Enrolling: Season 1 Cohort
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              <span className="text-amber-600">Young Sages</span>
              <br />
              <span className="text-2xl md:text-4xl font-medium text-gray-700">
                Stories, Systems & Introduction to AI Thinking
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              An 8-week adventure where children ages 8-14 learn to think like AI through African folktales, 
              interactive games, and hands-on coding with Leuk the Hare.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/auth/signup/young-sages">
                <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-6 text-lg">
                  Apply Now <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <a href="#newsletter">
                <Button size="lg" variant="outline" className="border-amber-600 text-amber-700 hover:bg-amber-50 px-8 py-6 text-lg">
                  <Mail className="mr-2 w-5 h-5" /> Get Updates
                </Button>
              </a>
            </div>

            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-amber-600">8</div>
                <div className="text-sm text-gray-600">Weeks</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-amber-600">32</div>
                <div className="text-sm text-gray-600">Lessons</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-amber-600">8-14</div>
                <div className="text-sm text-gray-600">Ages</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-amber-600">10</div>
                <div className="text-sm text-gray-600">Spots per Cohort</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Meet Leuk Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Meet <span className="text-amber-600">Leuk the Hare</span>
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  In West African folklore, the hare is the wisest animal—using observation, 
                  memory, and clever strategies to outsmart even the mighty lion.
                </p>
                <p className="text-lg text-gray-600 mb-6">
                  Through Leuk&apos;s adventures, your child will discover the same thinking patterns 
                  that power today&apos;s AI systems: <strong>observing signals</strong>, <strong>storing memories</strong>, 
                  and <strong>making smart decisions</strong>.
                </p>
                <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
                  <p className="text-amber-800 italic">
                    &quot;Intelligence is not just memory. It is updating memory when patterns change.&quot;
                  </p>
                  <p className="text-amber-600 text-sm mt-2">— Lesson from Week 2</p>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square bg-gradient-to-br from-amber-100 to-orange-100 rounded-3xl flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-9xl mb-4">🐰</div>
                    <p className="text-2xl font-bold text-amber-700">Leuk the Wise</p>
                    <p className="text-amber-600">Your AI Thinking Guide</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-gradient-to-b from-amber-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
              What Your Child Will Learn
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="border-2 border-amber-100 hover:border-amber-300 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-amber-100 p-3 rounded-xl">
                        <feature.icon className="w-6 h-6 text-amber-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                        <p className="text-gray-600">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Program Highlights */}
      <section className="py-16 bg-amber-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              Program Highlights
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {programHighlights.map((highlight, index) => (
                <div key={index} className="flex items-center gap-2 justify-center bg-white/10 rounded-lg p-4">
                  <CheckCircle2 className="w-5 h-5 text-amber-200 flex-shrink-0" />
                  <span className="text-sm md:text-base">{highlight}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section id="newsletter" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card className="border-2 border-amber-200 shadow-xl">
              <CardContent className="p-8 md:p-12">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4">
                    <Mail className="w-8 h-8 text-amber-600" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                    Stay in the Loop
                  </h2>
                  <p className="text-gray-600">
                    Get updates on enrollment, program news, and free AI thinking resources for parents.
                  </p>
                </div>

                <form onSubmit={handleSubscribe} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      type="text"
                      placeholder="First Name (optional)"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="border-amber-200 focus:border-amber-400 focus:ring-amber-400"
                    />
                    <Input
                      type="email"
                      placeholder="Your email address *"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="border-amber-200 focus:border-amber-400 focus:ring-amber-400"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white py-6 text-lg"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                        Subscribing...
                      </>
                    ) : (
                      <>
                        <Star className="mr-2 w-5 h-5" />
                        Join the Young Sages Community
                      </>
                    )}
                  </Button>
                </form>

                {message && (
                  <div
                    className={`mt-4 p-4 rounded-lg text-center ${
                      message.type === "success"
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-red-50 text-red-700 border border-red-200"
                    }`}
                  >
                    {message.text}
                  </div>
                )}

                <p className="text-xs text-gray-500 text-center mt-4">
                  We respect your privacy. Unsubscribe anytime.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-gradient-to-b from-amber-50 to-orange-100">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="text-6xl mb-6">🐰✨🦁</div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ready to Begin the Adventure?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Limited to 10 students per cohort for personalized attention.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup/young-sages">
                <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-6 text-lg">
                  Apply for Season 1 <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/joye/young-sages/signup">
                <Button size="lg" variant="outline" className="border-amber-600 text-amber-700 hover:bg-amber-50 px-8 py-6 text-lg">
                  <Calendar className="mr-2 w-5 h-5" /> Detailed Application
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="w-4 h-4 text-red-400" />
            <span>A program by</span>
            <Link href="/" className="text-amber-400 hover:text-amber-300 font-semibold">
              SAGED
            </Link>
          </div>
          <p className="text-gray-400 text-sm">
            Empowering the next generation of AI-literate thinkers
          </p>
        </div>
      </footer>
    </div>
  );
}
