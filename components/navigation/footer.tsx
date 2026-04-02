
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BookOpen, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for subscribing to our newsletter!');
    setEmail('');
  };
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand & Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold">SAGED</span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Strategic African Global Education & Development - Empowering the next generation of AI professionals 
              through comprehensive education rooted in African excellence and diaspora collaboration.
            </p>
            <div className="flex space-x-4">
              <Button size="sm" variant="ghost" className="p-2 text-gray-400 hover:text-white">
                <Facebook className="w-5 h-5" />
              </Button>
              <Button size="sm" variant="ghost" className="p-2 text-gray-400 hover:text-white">
                <Twitter className="w-5 h-5" />
              </Button>
              <Button size="sm" variant="ghost" className="p-2 text-gray-400 hover:text-white">
                <Instagram className="w-5 h-5" />
              </Button>
              <Button size="sm" variant="ghost" className="p-2 text-gray-400 hover:text-white">
                <Linkedin className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
            <div className="space-y-3">
              <Link href="/about" className="block text-gray-400 hover:text-orange-400 transition-colors">
                About Us
              </Link>
              <Link href="/curriculum" className="block text-gray-400 hover:text-orange-400 transition-colors">
                Programs & Courses
              </Link>
              <Link href="/courses" className="block text-gray-400 hover:text-orange-400 transition-colors">
                Curriculum
              </Link>
              <Link href="/community" className="block text-gray-400 hover:text-orange-400 transition-colors">
                Community & Impact
              </Link>
              <Link href="/blog" className="block text-gray-400 hover:text-orange-400 transition-colors">
                Blog & Insights
              </Link>
              <Link href="/partnerships" className="block text-gray-400 hover:text-orange-400 transition-colors">
                Partnerships
              </Link>
              <Link href="/contact" className="block text-gray-400 hover:text-orange-400 transition-colors">
                Contact & Enrollment
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Contact Info</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-orange-500 flex-shrink-0" />
                <span className="text-gray-400">info@saged.ai</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-orange-500 flex-shrink-0" />
                <span className="text-gray-400">+1 (555) SAGED-AI</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-orange-500 flex-shrink-0" />
                <span className="text-gray-400">Global Online Campus</span>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold mb-2">Stay Updated</h3>
            <p className="text-gray-400">Subscribe to get the latest AI insights and course updates</p>
          </div>
          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Input 
              type="email" 
              placeholder="Enter your email" 
              className="bg-gray-800 border-gray-700 text-white flex-1"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button type="submit" className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700">
              Subscribe
            </Button>
          </form>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-400">
            &copy; 2024 SAGED - Strategic African Global Education & Development. All rights reserved.
          </p>
          <div className="mt-4 space-x-6 text-sm">
            <Link href="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</Link>
            <Link href="/terms" className="text-gray-400 hover:text-white">Terms of Service</Link>
            <Link href="/support" className="text-gray-400 hover:text-white">Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
