
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/navigation/header";
import Footer from "@/components/navigation/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Sparkles, Mail, CheckCircle2 } from "lucide-react";

export default function WaitlistPage() {
  const params = useParams();
  const programSlug = params.program as string;
  
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const programNames: Record<string, string> = {
    "kikebo": "Young Sage Kikebo",
    "educator": "Educator Pathway",
    "technologist": "Technologist Pathway",
    "mastery": "SAGE Mastery Track",
    "default": "Our New Program"
  };

  const programName = programNames[programSlug.toLowerCase()] || programNames["default"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          firstName,
          source: `waitlist-${programSlug}`,
          interests: [programSlug, "waitlist"],
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitted(true);
      } else {
        setError(data.message || "Something went wrong.");
      }
    } catch (err) {
      setError("Failed to join waitlist. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center py-20 px-4">
        <div className="max-w-md w-full">
          {!submitted ? (
            <Card className="border-2 border-[#D9A441]/20 shadow-xl">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-amber-600" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Join the Waitlist
                </CardTitle>
                <CardDescription className="text-lg mt-2">
                  Be the first to know when <span className="text-amber-600 font-semibold">{programName}</span> launches.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">First Name</label>
                    <Input 
                      placeholder="Your name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Email Address *</label>
                    <Input 
                      type="email" 
                      placeholder="you@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  
                  {error && (
                    <p className="text-sm text-red-600 bg-red-50 p-2 rounded border border-red-100">
                      {error}
                    </p>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full bg-[#124734] hover:bg-[#0d3526] text-white py-6"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    ) : (
                      <Mail className="w-5 h-5 mr-2" />
                    )}
                    Join Waitlist
                  </Button>
                </form>
                <p className="text-xs text-center text-gray-500 mt-4">
                  We value your privacy. No spam, ever.
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-2 border-green-200 bg-green-50 shadow-xl text-center p-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-green-900 mb-2">You're on the list!</h2>
              <p className="text-green-800 text-lg mb-6">
                Thank you for your interest in {programName}. We'll notify you as soon as enrollment opens.
              </p>
              <Button 
                variant="outline" 
                className="w-full border-green-600 text-green-700 hover:bg-green-100"
                onClick={() => window.location.href = '/'}
              >
                Back to Homepage
              </Button>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
