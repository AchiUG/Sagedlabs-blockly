
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  MessageCircle, 
  FileText,
  Users,
  BookOpen,
  Award,
  HelpCircle,
  ExternalLink,
  Send
} from 'lucide-react';

const contactMethods = [
  {
    icon: Mail,
    title: "Email Support",
    description: "Get help via email",
    contact: "support@saged.ai",
    availability: "24/7 Response"
  },
  {
    icon: Phone,
    title: "Phone Support",
    description: "Speak with our team",
    contact: "+1 (555) 123-4567",
    availability: "Mon-Fri, 9AM-6PM EST"
  },
  {
    icon: MapPin,
    title: "Office Location",
    description: "Visit our headquarters",
    contact: "Cape Town, South Africa",
    availability: "By Appointment"
  }
];

const inquiryTypes = [
  {
    icon: BookOpen,
    title: "Course Enrollment",
    description: "Questions about courses and programs",
    action: "General Inquiry"
  },
  {
    icon: Award,
    title: "Certification",
    description: "Certification and accreditation queries",
    action: "General Inquiry"
  },
  {
    icon: Users,
    title: "Corporate Training",
    description: "Enterprise solutions and bulk enrollments",
    action: "General Inquiry"
  },
  {
    icon: FileText,
    title: "Technical Support",
    description: "Platform issues and technical assistance",
    action: "General Inquiry"
  }
];

const faqs = [
  {
    question: "How long does it take to complete a course?",
    answer: "Course duration varies from 4-12 weeks depending on the program and your learning pace."
  },
  {
    question: "Do you offer certificates?",
    answer: "Yes, we provide industry-recognized certificates upon successful completion of our courses."
  },
  {
    question: "Is there live instructor support?",
    answer: "All our courses include live mentorship sessions and direct access to instructors."
  },
  {
    question: "What are the technical requirements?",
    answer: "You'll need a computer with internet access and basic software installations as specified in each course."
  },
  {
    question: "Do you offer payment plans?",
    answer: "Yes, we offer flexible payment options including installment plans for most courses."
  }
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    inquiryType: 'general'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  const handleGeneralInquiry = () => {
    // Handle general inquiry button click
    console.log('General inquiry clicked');
  };

  const handleLiveChat = () => {
    // Handle live chat button click
    console.log('Live chat clicked');
  };

  const handleJoinDiscord = () => {
    // Handle Discord join button click
    console.log('Join Discord clicked');
  };

  const handleViewAllFAQs = () => {
    // Handle view all FAQs button click
    console.log('View all FAQs clicked');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-orange-50/30">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Get in Touch</h1>
            <p className="text-xl opacity-90 leading-relaxed">
              Ready to start your AI journey? We're here to help you every step of the way. 
              Reach out with questions, feedback, or enrollment inquiries.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900">Send us a Message</CardTitle>
                <p className="text-gray-600">
                  Fill out the form below and we'll get back to you within 24 hours.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Your full name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Inquiry Type
                    </label>
                    <select
                      name="inquiryType"
                      value={formData.inquiryType}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="general">General Inquiry</option>
                      <option value="enrollment">Course Enrollment</option>
                      <option value="technical">Technical Support</option>
                      <option value="partnership">Partnership</option>
                      <option value="media">Media & Press</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <Input
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="Brief subject of your inquiry"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={6}
                      placeholder="Please provide details about your inquiry..."
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700">
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Contact Methods */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {contactMethods.map((method, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="bg-orange-100 p-3 rounded-lg">
                      <method.icon className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{method.title}</h3>
                      <p className="text-gray-600 text-sm">{method.description}</p>
                      <p className="font-medium text-gray-900">{method.contact}</p>
                      <p className="text-sm text-gray-500">{method.availability}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={handleGeneralInquiry}
                >
                  <MessageCircle className="w-4 h-4 mr-3" />
                  General Inquiry
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={handleLiveChat}
                >
                  <MessageCircle className="w-4 h-4 mr-3" />
                  Live Chat
                  <Badge variant="secondary" className="ml-auto">Online</Badge>
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={handleJoinDiscord}
                >
                  <Users className="w-4 h-4 mr-3" />
                  Join Discord
                  <ExternalLink className="w-4 h-4 ml-auto" />
                </Button>
              </CardContent>
            </Card>

            {/* Inquiry Types */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-gray-900">Common Inquiries</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {inquiryTypes.map((type, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <type.icon className="w-5 h-5 text-orange-600" />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{type.title}</h4>
                      <p className="text-sm text-gray-600">{type.description}</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={handleGeneralInquiry}
                    >
                      {type.action}
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl text-gray-900">Frequently Asked Questions</CardTitle>
              <p className="text-gray-600">
                Quick answers to common questions about our courses and platform.
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                {faqs.map((faq, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-start space-x-3">
                      <HelpCircle className="w-5 h-5 text-orange-600 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-gray-900">{faq.question}</h3>
                        <p className="text-gray-600 text-sm mt-1">{faq.answer}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Separator className="my-8" />
              <div className="text-center">
                <p className="text-gray-600 mb-4">Can't find what you're looking for?</p>
                <Button 
                  variant="outline"
                  onClick={handleViewAllFAQs}
                >
                  View All FAQs
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Office Hours */}
        <div className="mt-12">
          <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
            <CardContent className="p-8 text-center">
              <Clock className="w-12 h-12 text-orange-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Office Hours</h3>
              <p className="text-gray-600 mb-4">
                Our support team is available during the following hours:
              </p>
              <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                <div>
                  <h4 className="font-semibold text-gray-900">Support Hours</h4>
                  <p className="text-gray-600">Monday - Friday: 9:00 AM - 6:00 PM EST</p>
                  <p className="text-gray-600">Saturday: 10:00 AM - 4:00 PM EST</p>
                  <p className="text-gray-600">Sunday: Closed</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Emergency Support</h4>
                  <p className="text-gray-600">24/7 via email for urgent technical issues</p>
                  <p className="text-gray-600">Response within 4 hours</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
