
'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Users, 
  Trophy, 
  Calendar, 
  MapPin, 
  ExternalLink,
  MessageCircle,
  Heart,
  Share2,
  Star,
  Award,
  Globe,
  Target,
  BookOpen,
  Code,
  Lightbulb,
  ArrowRight
} from 'lucide-react';

const communityStats = [
  { icon: Users, label: "Active Members", value: "15,000+" },
  { icon: Trophy, label: "Projects Completed", value: "2,500+" },
  { icon: Award, label: "Certifications Issued", value: "8,000+" },
  { icon: Globe, label: "Countries", value: "54" }
];

const successStories = [
  {
    id: 1,
    name: "Aisha Patel",
    title: "ML Engineer at Google",
    location: "Mumbai, India",
    image: "https://www.shutterstock.com/image-photo/closeup-headshot-face-portrait-beautiful-260nw-2570112617.jpg",
    story: "From a complete beginner to landing my dream job at Google in just 8 months. SAGED's hands-on approach and mentorship program made all the difference.",
    achievement: "Salary increase: 300%",
    course: "Deep Learning Specialization",
    featured: true
  },
  {
    id: 2,
    name: "Kwame Asante",
    title: "AI Startup Founder",
    location: "Accra, Ghana",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    story: "SAGED gave me the technical foundation and confidence to start my own AI company focused on agricultural solutions for African farmers.",
    achievement: "$2M in funding raised",
    course: "Computer Vision for Agriculture",
    featured: true
  },
  {
    id: 3,
    name: "Fatima Al-Zahra",
    title: "Research Scientist",
    location: "Cairo, Egypt",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    story: "The NLP course helped me transition from academia to industry research, working on Arabic language models.",
    achievement: "Published in top-tier conferences",
    course: "Natural Language Processing",
    featured: false
  }
];

const mentors = [
  {
    name: "Dr. Chinonso Okafor",
    title: "Senior AI Researcher, Meta",
    expertise: "Computer Vision, ML Systems",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    experience: "10+ years",
    students: "200+"
  },
  {
    name: "Prof. Amara Okafor",
    title: "AI Ethics Professor, Oxford",
    expertise: "AI Ethics, Responsible AI",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face",
    experience: "15+ years",
    students: "150+"
  },
  {
    name: "Samuel Nkomo",
    title: "ML Engineer, DeepMind",
    expertise: "Deep Learning, Robotics",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face",
    experience: "8+ years",
    students: "300+"
  }
];

const communityEvents = [
  {
    title: "AI for Good Hackathon",
    date: "Oct 15-17, 2024",
    type: "Virtual Event",
    participants: "500+ expected",
    description: "Build AI solutions for social impact across Africa",
    status: "Upcoming"
  },
  {
    title: "Women in AI Summit",
    date: "Nov 22, 2024",
    type: "Hybrid Event",
    participants: "200+ expected",
    description: "Celebrating and empowering women in AI across the continent",
    status: "Registration Open"
  },
  {
    title: "AI Research Symposium",
    date: "Dec 5-6, 2024",
    type: "In-Person",
    participants: "300+ expected",
    description: "Latest research and innovations from African AI researchers",
    status: "Coming Soon"
  }
];

const communityProjects = [
  {
    title: "African Language NLP Dataset",
    description: "Building comprehensive datasets for 20+ African languages",
    contributors: 45,
    status: "Active",
    tech: ["Python", "NLP", "Data Science"]
  },
  {
    title: "Medical AI for Rural Clinics",
    description: "Developing diagnostic tools for resource-constrained settings",
    contributors: 32,
    status: "Active", 
    tech: ["Computer Vision", "Mobile AI", "Healthcare"]
  },
  {
    title: "Climate Change Prediction Models",
    description: "ML models for climate pattern analysis in Sub-Saharan Africa",
    contributors: 28,
    status: "Completed",
    tech: ["Time Series", "ML", "Climate Science"]
  }
];

export default function CommunityPage() {
  const handleReadFullStory = () => {
    // Handle read full story click
    console.log('Read full story clicked');
  };

  const handleViewAllSuccessStories = () => {
    // Handle view all success stories click
    console.log('View all success stories clicked');
  };

  const handleApplyToMentor = () => {
    // Handle apply to mentor click
    console.log('Apply to mentor clicked');
  };

  const handleSubmitProjectProposal = () => {
    // Handle submit project proposal click
    console.log('Submit project proposal clicked');
  };

  const handleJoinDiscordCommunity = () => {
    // Handle join Discord community click
    console.log('Join Discord community clicked');
  };

  const handleAttendVirtualMeetup = () => {
    // Handle attend virtual meetup click
    console.log('Attend virtual meetup clicked');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-orange-50/30">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Our Community</h1>
            <p className="text-xl opacity-90 leading-relaxed">
              Join thousands of AI enthusiasts, professionals, and learners from across Africa 
              and beyond. Together, we're building the future of AI education and innovation.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16">
        {/* Community Stats */}
        <div className="grid md:grid-cols-4 gap-8 mb-16">
          {communityStats.map((stat, index) => (
            <Card key={index} className="text-center shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <stat.icon className="w-12 h-12 text-orange-600 mx-auto mb-4" />
                <h3 className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</h3>
                <p className="text-gray-600">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Success Stories */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Success Stories</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hear from community members who have transformed their careers and made 
              significant impact in the AI field through SAGED programs.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {successStories.filter(story => story.featured).map((story) => (
              <Card key={story.id} className="shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4 mb-6">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={story.image} alt={story.name} />
                      <AvatarFallback>{story.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900">{story.name}</h3>
                      <p className="text-orange-600 font-medium">{story.title}</p>
                      <p className="text-sm text-gray-500 flex items-center mt-1">
                        <MapPin className="w-4 h-4 mr-1" />
                        {story.location}
                      </p>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      {story.achievement}
                    </Badge>
                  </div>
                  <blockquote className="text-gray-600 mb-6 italic">
                    "{story.story}"
                  </blockquote>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{story.course}</Badge>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleReadFullStory}
                    >
                      Read Full Story
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button 
              variant="outline" 
              size="lg"
              onClick={handleViewAllSuccessStories}
            >
              View All Success Stories
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>

        {/* Mentorship Program */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Expert Mentorship</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Learn directly from industry leaders and experienced professionals who are 
              passionate about guiding the next generation of AI talent.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-8">
            {mentors.map((mentor, index) => (
              <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6 text-center">
                  <Avatar className="w-20 h-20 mx-auto mb-4">
                    <AvatarImage src={mentor.image} alt={mentor.name} />
                    <AvatarFallback>{mentor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <h3 className="font-bold text-lg text-gray-900 mb-1">{mentor.name}</h3>
                  <p className="text-orange-600 font-medium mb-2">{mentor.title}</p>
                  <p className="text-sm text-gray-600 mb-4">{mentor.expertise}</p>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="font-semibold text-gray-900">{mentor.experience}</p>
                      <p className="text-xs text-gray-500">Experience</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{mentor.students}</p>
                      <p className="text-xs text-gray-500">Students Mentored</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button 
              className="bg-orange-600 hover:bg-orange-700"
              onClick={handleApplyToMentor}
            >
              <Users className="w-4 h-4 mr-2" />
              Apply to Mentor
            </Button>
          </div>
        </div>

        {/* Community Projects */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Community Projects</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Collaborate on real-world AI projects that make a difference. Contributing to 
              community projects is a great way to learn, network, and build your portfolio.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-8">
            {communityProjects.map((project, index) => (
              <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-bold text-lg text-gray-900">{project.title}</h3>
                    <Badge 
                      variant={project.status === 'Active' ? 'default' : 'secondary'}
                      className={project.status === 'Active' ? 'bg-green-600' : ''}
                    >
                      {project.status}
                    </Badge>
                  </div>
                  <p className="text-gray-600 mb-4">{project.description}</p>
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <Users className="w-4 h-4 mr-1" />
                    {project.contributors} contributors
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech, techIndex) => (
                      <Badge key={techIndex} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button 
              variant="outline" 
              size="lg"
              onClick={handleSubmitProjectProposal}
            >
              <Lightbulb className="w-4 h-4 mr-2" />
              Submit Project Proposal
            </Button>
          </div>
        </div>

        {/* Events */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Upcoming Events</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join our regular events, workshops, and meetups to connect with fellow 
              AI enthusiasts and stay updated on the latest trends and technologies.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {communityEvents.map((event, index) => (
              <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Badge className="bg-orange-600">{event.status}</Badge>
                    <p className="text-sm text-gray-500">{event.type}</p>
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">{event.title}</h3>
                  <p className="text-gray-600 mb-4">{event.description}</p>
                  <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      {event.date}
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2" />
                      {event.participants}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Community Engagement */}
        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="shadow-lg bg-gradient-to-r from-orange-50 to-red-50">
            <CardContent className="p-8">
              <MessageCircle className="w-12 h-12 text-orange-600 mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Join the Conversation</h3>
              <p className="text-gray-600 mb-6">
                Connect with thousands of AI practitioners, researchers, and students in our 
                active Discord community. Get help, share projects, and stay updated on the 
                latest developments.
              </p>
              <Button 
                className="bg-orange-600 hover:bg-orange-700 w-full sm:w-auto"
                onClick={handleJoinDiscordCommunity}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Join Discord Community
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardContent className="p-8">
              <Calendar className="w-12 h-12 text-blue-600 mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Regular Meetups</h3>
              <p className="text-gray-600 mb-6">
                Attend our weekly virtual meetups featuring guest speakers, project showcases, 
                and networking sessions. Every Wednesday at 7 PM EAT.
              </p>
              <Button 
                className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
                onClick={handleAttendVirtualMeetup}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Attend Virtual Meetup
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
