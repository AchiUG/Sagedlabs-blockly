"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Copy,
  Check,
  Twitter,
  Facebook,
  Linkedin,
  MessageCircle,
  ArrowLeft,
  Share2,
  Mail,
} from "lucide-react";

export default function SharePage() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const baseUrl = "https://sagedlabs.com";
  const landingUrl = `${baseUrl}/young-sages`;
  const signupUrl = `${baseUrl}/auth/signup/young-sages`;
  const newsletterUrl = `${baseUrl}/young-sages#newsletter`;

  const socialPosts = [
    {
      platform: "Twitter/X",
      icon: Twitter,
      color: "bg-black text-white",
      content: `🐰✨ Introducing YOUNG SAGES!

An 8-week adventure where kids ages 8-14 learn to think like AI through African folktales.

✅ Story-based learning with Leuk the Hare
✅ Interactive coding & games
✅ No prior experience needed

Limited to 10 spots per cohort!

👉 ${landingUrl}

#AIeducation #CodingForKids #STEM #Africa`,
      shareUrl: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`🐰✨ Introducing YOUNG SAGES! An 8-week adventure where kids ages 8-14 learn to think like AI through African folktales.\n\nLimited to 10 spots!\n\n👉`)}&url=${encodeURIComponent(landingUrl)}`,
    },
    {
      platform: "LinkedIn",
      icon: Linkedin,
      color: "bg-blue-700 text-white",
      content: `Excited to announce YOUNG SAGES – a groundbreaking 8-week program teaching AI thinking skills to children ages 8-14!

🧠 What makes it unique?
• Story-based curriculum featuring Leuk the Hare from West African folklore
• Hands-on coding through visual block programming
• Interactive classroom games teaching pattern recognition
• No prior coding experience required

Our approach connects timeless wisdom from African folktales with cutting-edge AI concepts – making abstract ideas tangible for young minds.

Now enrolling for Season 1 (limited to 10 students per cohort).

Learn more: ${landingUrl}

#AIEducation #EdTech #CodingForKids #STEM #FutureOfLearning #Africa`,
      shareUrl: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(landingUrl)}`,
    },
    {
      platform: "Facebook",
      icon: Facebook,
      color: "bg-blue-600 text-white",
      content: `🐰✨ NEW: Young Sages Program!

Is your child curious about AI and technology? 

Young Sages is an 8-week adventure where children ages 8-14 learn to think like AI through:

📚 African folktales featuring Leuk the Wise Hare
🎮 Interactive classroom games
💻 Visual coding with the Blocks Lab
🤝 Small cohorts (only 10 students)

No prior coding experience needed!

Sign up for updates: ${newsletterUrl}

Apply now: ${signupUrl}`,
      shareUrl: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(landingUrl)}`,
    },
    {
      platform: "WhatsApp",
      icon: MessageCircle,
      color: "bg-green-500 text-white",
      content: `🐰✨ *Young Sages: AI Thinking for Kids*

Hi! Check out this amazing 8-week program for kids ages 8-14!

✅ Learn AI thinking through African folktales
✅ Interactive games & coding
✅ Only 10 spots per cohort!

Sign up here: ${landingUrl}`,
      shareUrl: `https://wa.me/?text=${encodeURIComponent(`🐰✨ *Young Sages: AI Thinking for Kids*\n\nCheck out this amazing 8-week program for kids ages 8-14!\n\n✅ Learn AI thinking through African folktales\n✅ Interactive games & coding\n✅ Only 10 spots per cohort!\n\nSign up: ${landingUrl}`)}`,
    },
    {
      platform: "Email",
      icon: Mail,
      color: "bg-gray-700 text-white",
      content: `Subject: Introducing Young Sages – AI Thinking for Kids 8-14

Hi,

I wanted to share an exciting new program called Young Sages!

It's an 8-week adventure where children ages 8-14 learn to think like AI through African folktales, interactive games, and hands-on coding.

What makes it special:
• Story-based learning with Leuk the Hare
• Interactive Blocks Lab coding
• Classroom games teaching pattern recognition
• No prior coding experience needed
• Limited to 10 students per cohort

Learn more and sign up: ${landingUrl}

I thought this might be perfect for [child's name]!

Best regards`,
      shareUrl: `mailto:?subject=${encodeURIComponent("Introducing Young Sages – AI Thinking for Kids 8-14")}&body=${encodeURIComponent(`Hi,\n\nI wanted to share an exciting new program called Young Sages!\n\nIt's an 8-week adventure where children ages 8-14 learn to think like AI through African folktales, interactive games, and hands-on coding.\n\nLearn more: ${landingUrl}\n\nBest regards`)}`,
    },
  ];

  const quickLinks = [
    { label: "Main Landing Page", url: landingUrl },
    { label: "Quick Signup", url: signupUrl },
    { label: "Newsletter Signup", url: newsletterUrl },
    { label: "Detailed Application", url: `${baseUrl}/joye/young-sages/signup` },
  ];

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/young-sages" className="inline-flex items-center text-amber-700 hover:text-amber-800 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Young Sages
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 flex items-center gap-3">
            <Share2 className="w-8 h-8 text-amber-600" />
            Share Young Sages
          </h1>
          <p className="text-gray-600 mt-2">
            Ready-to-use content for social media. Copy, customize, and share!
          </p>
        </div>

        {/* Quick Links */}
        <Card className="mb-8 border-amber-200">
          <CardHeader>
            <CardTitle className="text-lg">Quick Links to Share</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-3">
              {quickLinks.map((link, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border"
                >
                  <div>
                    <p className="font-medium text-sm">{link.label}</p>
                    <p className="text-xs text-gray-500 truncate max-w-[200px]">{link.url}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(link.url, 100 + index)}
                    className="flex-shrink-0"
                  >
                    {copiedIndex === 100 + index ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Social Posts */}
        <div className="space-y-6">
          {socialPosts.map((post, index) => (
            <Card key={index} className="border-amber-200 overflow-hidden">
              <CardHeader className={`${post.color} py-3`}>
                <CardTitle className="text-lg flex items-center gap-2">
                  <post.icon className="w-5 h-5" />
                  {post.platform}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded-lg border mb-4 font-sans">
                  {post.content}
                </pre>
                <div className="flex gap-3">
                  <Button
                    onClick={() => copyToClipboard(post.content, index)}
                    variant="outline"
                    className="flex-1"
                  >
                    {copiedIndex === index ? (
                      <>
                        <Check className="w-4 h-4 mr-2 text-green-600" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Text
                      </>
                    )}
                  </Button>
                  <a href={post.shareUrl} target="_blank" rel="noopener noreferrer">
                    <Button className={post.color}>
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Hashtags */}
        <Card className="mt-8 border-amber-200">
          <CardHeader>
            <CardTitle className="text-lg">Suggested Hashtags</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {[
                "#YoungSages",
                "#AIeducation",
                "#CodingForKids",
                "#STEM",
                "#EdTech",
                "#Africa",
                "#LeukTheHare",
                "#AILiteracy",
                "#FutureOfLearning",
                "#ComputationalThinking",
                "#KidsCoding",
                "#SAGED",
              ].map((tag) => (
                <span
                  key={tag}
                  className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-amber-200"
                  onClick={() => {
                    navigator.clipboard.writeText(tag);
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-3">Click any hashtag to copy</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
