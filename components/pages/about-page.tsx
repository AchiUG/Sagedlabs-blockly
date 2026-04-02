
"use client"

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, Eye, Heart, Users, Award, MapPin, Calendar, ChevronRight } from 'lucide-react';
import Header from '@/components/navigation/header';
import Footer from '@/components/navigation/footer';

const leadership = [
  {
    name: "John Obia",
    role: "Founder & CEO",
    location: "Nigeria → Global",
    bio: "Visionary entrepreneur and AI strategist with extensive experience in technology innovation and education. Passionate about democratizing AI education across Africa and connecting diaspora communities through transformative learning experiences.",
    expertise: ["AI Strategy", "Education Innovation", "Entrepreneurship", "Community Building"]
  },
  {
    name: "Dr. Amara Okafor", 
    role: "Chief Technology Officer",
    location: "Nigeria → Stanford",
    bio: "Former Google AI researcher with 15+ years in machine learning. PhD from Stanford, leading our technical vision and platform development.",
    expertise: ["Machine Learning", "AI Architecture", "Platform Development"]
  },
  {
    name: "Prof. Kwame Asante",
    role: "Chief Academic Officer",
    location: "Ghana → MIT",
    bio: "MIT professor and computer vision expert. Leading researcher in AI applications for African agriculture and healthcare.",
    expertise: ["Computer Vision", "Deep Learning", "Agricultural AI"]
  },
  {
    name: "Dr. Fatima Al-Zahra",
    role: "Director of Research",
    location: "Morocco → Cambridge",
    bio: "Cambridge-trained NLP specialist focused on African language technologies and culturally-aware AI systems.",
    expertise: ["Natural Language Processing", "African Languages", "AI Ethics"]
  }
];

const impactStats = [
  { label: "Countries Reached", value: "54", description: "Across Africa and the Diaspora" },
  { label: "Scholarships Awarded", value: "2,500+", description: "To underserved communities" },
  { label: "Community Projects", value: "150+", description: "AI solutions for local challenges" },
  { label: "Industry Partnerships", value: "75+", description: "With leading tech companies" }
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-orange-50 to-red-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-orange-100 text-orange-700">About SAGED</Badge>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Bridging Continents Through
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600 block">
                AI Education
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              We're not just teaching AI—we're building a movement that celebrates African excellence, 
              connects diaspora communities, and develops solutions for our shared challenges.
            </p>
          </div>
        </div>
      </section>

      {/* SAGE-D Wordmark & Description */}
      <section className="py-16 px-4 bg-white border-y border-gray-100">
        <div className="max-w-5xl mx-auto text-center">
          {/* SAGE-D Wordmark */}
          <div className="mb-8">
            <h2 className="text-5xl font-bold mb-2" style={{ color: '#124734' }}>
              SAGE-D<sup className="text-2xl">™</sup>
            </h2>
            <p className="text-sm tracking-widest font-semibold" style={{ color: '#D9A441' }}>
              CONTEXT. AGENCY. MEANING.
            </p>
          </div>

          {/* Description Block */}
          <div className="max-w-3xl mx-auto mb-8">
            <p className="text-lg text-gray-700 leading-relaxed">
              SAGE-D is a provider of educational services. We offer online training programs, 
              structured courses, digital learning materials, and workshops that support skills 
              development for learners and professionals. Our services are delivered online and 
              through digital platforms.
            </p>
          </div>

          {/* Action Button */}
          <div className="flex justify-center">
            <Link href="/courses">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-teal-600 to-green-700 hover:from-teal-700 hover:to-green-800 px-8 py-6 text-lg"
              >
                <span className="mr-2">📚</span>
                Explore Courses
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12">
            <Card className="text-center p-8 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Mission</h3>
              <p className="text-gray-600 leading-relaxed">
                To democratize AI education through culturally-relevant curriculum that empowers African 
                communities globally while fostering innovation and entrepreneurship.
              </p>
            </Card>

            <Card className="text-center p-8 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Eye className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Vision</h3>
              <p className="text-gray-600 leading-relaxed">
                A future where Africa leads in AI innovation, with our diaspora communities connected 
                through technology that serves humanity and preserves our rich cultural heritage.
              </p>
            </Card>

            <Card className="text-center p-8 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Values</h3>
              <p className="text-gray-600 leading-relaxed">
                Ubuntu (humanity), excellence in education, cultural pride, community empowerment, 
                ethical AI development, and sustainable innovation for all.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Story & Background */}
      <section className="py-20 bg-gradient-to-r from-orange-50 to-amber-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-6 bg-orange-100 text-orange-700">Our Story</Badge>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Born from Necessity, Driven by Purpose</h2>
              <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                <p>
                  SAGED was founded in 2020 when John Obia, an entrepreneur and technology strategist, 
                  recognized the severe underrepresentation of African perspectives in AI development. 
                  Despite Africa's rapid tech growth, most AI education remained culturally disconnected 
                  from our communities' needs and values.
                </p>
                <p>
                  Together with leading diaspora researchers and academics, he envisioned an education 
                  platform that would not only teach cutting-edge AI skills but also celebrate African 
                  innovation, connect communities across continents, and develop solutions for challenges 
                  from agriculture to healthcare.
                </p>
                <p>
                  Today, SAGED represents more than education—it's a movement of African excellence 
                  in technology, bridging traditional wisdom with modern innovation under John's 
                  visionary leadership.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="bg-white p-6 rounded-2xl shadow-sm">
                  <Calendar className="w-8 h-8 text-orange-600 mb-3" />
                  <h4 className="font-bold text-gray-900 mb-2">Founded 2020</h4>
                  <p className="text-sm text-gray-600">During the global shift to online learning</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm">
                  <Users className="w-8 h-8 text-orange-600 mb-3" />
                  <h4 className="font-bold text-gray-900 mb-2">25K+ Learners</h4>
                  <p className="text-sm text-gray-600">Across 54 countries</p>
                </div>
              </div>
              <div className="space-y-4 mt-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm">
                  <MapPin className="w-8 h-8 text-orange-600 mb-3" />
                  <h4 className="font-bold text-gray-900 mb-2">Global Reach</h4>
                  <p className="text-sm text-gray-600">Connecting African diaspora worldwide</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm">
                  <Award className="w-8 h-8 text-orange-600 mb-3" />
                  <h4 className="font-bold text-gray-900 mb-2">94% Success</h4>
                  <p className="text-sm text-gray-600">Course completion rate</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-orange-100 text-orange-700">Leadership</Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Meet Our Visionary Leaders</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our leadership team brings together decades of experience from top global institutions 
              and leading tech companies, united by a shared commitment to African excellence in AI.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {leadership.map((leader, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-orange-400 to-red-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">
                      {leader.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{leader.name}</h3>
                  <p className="text-orange-600 font-medium mb-1">{leader.role}</p>
                  <p className="text-sm text-gray-500">{leader.location}</p>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">{leader.bio}</p>
                
                <div className="flex flex-wrap gap-2">
                  {leader.expertise.map((skill, skillIndex) => (
                    <Badge key={skillIndex} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Impact & Community Projects */}
      <section className="py-20 bg-gradient-to-r from-orange-50 to-red-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-orange-100 text-orange-700">Impact & Projects</Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Creating Real-World Change</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our impact extends beyond the classroom. We're building AI solutions that address 
              real challenges in African communities while creating opportunities for our learners.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {impactStats.map((stat, index) => (
              <Card key={index} className="text-center p-8 hover:shadow-lg transition-shadow">
                <div className="text-4xl font-bold text-orange-600 mb-2">{stat.value}</div>
                <div className="text-xl font-semibold text-gray-900 mb-2">{stat.label}</div>
                <div className="text-gray-600 text-sm">{stat.description}</div>
              </Card>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Agricultural Innovation</h3>
              <p className="text-gray-600 mb-4">
                AI-powered crop monitoring systems helping farmers increase yields by 40% 
                while reducing pesticide use across Kenya, Ghana, and Nigeria.
              </p>
              <Badge className="bg-green-100 text-green-700">150+ Farms Impacted</Badge>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Healthcare Diagnostics</h3>
              <p className="text-gray-600 mb-4">
                Mobile diagnostic tools using computer vision to detect malaria and other 
                diseases in remote communities across Sub-Saharan Africa.
              </p>
              <Badge className="bg-blue-100 text-blue-700">50K+ Lives Touched</Badge>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Financial Inclusion</h3>
              <p className="text-gray-600 mb-4">
                AI-driven credit scoring models helping microfinance institutions extend 
                services to previously underserved communities.
              </p>
              <Badge className="bg-purple-100 text-purple-700">25K+ Loans Enabled</Badge>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Join Our Mission</h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Whether you're a learner, educator, or organization, there's a place for you in the SAGED community. 
            Together, we can build an AI-powered future that serves all of humanity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 px-8">
                Start Your Journey
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/partnerships">
              <Button size="lg" variant="outline" className="border-orange-200 text-orange-700 hover:bg-orange-50 px-8">
                Partner With Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
