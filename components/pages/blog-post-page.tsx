
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Calendar, 
  Clock, 
  User, 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark,
  ArrowLeft,
  ArrowRight,
  ThumbsUp,
  Eye
} from 'lucide-react';

// Blog posts data (same as blog page)
const blogPosts = [
  {
    id: 1,
    title: "The Future of AI in Healthcare: An African Perspective",
    excerpt: "Exploring how artificial intelligence can address healthcare challenges across the African continent, from diagnostic tools to predictive analytics.",
    author: "Dr. Kwame Asante",
    authorBio: "Dr. Kwame Asante is a leading AI researcher specializing in healthcare applications. He holds a PhD from MIT and currently leads the AI for Health initiative at the University of Cape Town.",
    authorImage: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face",
    date: "2024-09-15",
    readTime: "8 min read",
    category: "AI in Healthcare",
    image: "https://img.freepik.com/free-photo/doctor-using-ai-chatbot-digital-technology_53876-145899.jpg",
    content: `
      <p>The healthcare landscape across Africa is rapidly evolving, with artificial intelligence emerging as a transformative force. From rural clinics in Kenya to urban hospitals in South Africa, AI technologies are beginning to address some of the continent's most pressing healthcare challenges.</p>
      
      <h2>Current State of Healthcare in Africa</h2>
      <p>Africa faces unique healthcare challenges including limited infrastructure, shortage of healthcare professionals, and high burden of infectious diseases. However, these challenges also present opportunities for innovative AI solutions.</p>
      
      <h2>AI Applications in African Healthcare</h2>
      <h3>Diagnostic Tools</h3>
      <p>Machine learning algorithms are being developed to assist in diagnosing conditions like tuberculosis, malaria, and HIV/AIDS using smartphone cameras and basic medical equipment.</p>
      
      <h3>Predictive Analytics</h3>
      <p>AI models are helping predict disease outbreaks, optimize supply chains for medications, and improve resource allocation in healthcare facilities.</p>
      
      <h2>Success Stories</h2>
      <p>Several initiatives across the continent are showing promising results. In Ghana, AI-powered diagnostic tools have improved TB detection rates by 40%. In Nigeria, predictive models are helping optimize vaccine distribution.</p>
      
      <h2>Challenges and Opportunities</h2>
      <p>While the potential is enormous, challenges including data privacy, infrastructure limitations, and the need for local expertise must be addressed. Investment in education and local AI talent development is crucial for sustainable progress.</p>
      
      <h2>Looking Forward</h2>
      <p>The future of AI in African healthcare is bright. With continued investment, collaboration, and focus on local needs, AI can help create a more equitable and effective healthcare system across the continent.</p>
    `,
    views: 2847,
    likes: 247,
    comments: 18,
    tags: ["Healthcare", "AI", "Africa", "Machine Learning", "Digital Health"],
    featured: true
  },
  // Add more sample posts here for navigation...
];

const relatedPosts = [
  {
    id: 2,
    title: "Building Inclusive AI: Lessons from Ubuntu Philosophy",
    category: "AI Ethics",
    image: "https://i.ytimg.com/vi/sPN_SAZGXdA/maxresdefault.jpg",
    readTime: "6 min read"
  },
  {
    id: 3,
    title: "Computer Vision for Agricultural Innovation",
    category: "Technical Deep Dive",
    image: "https://i.ytimg.com/vi/zcztoDgjJe0/maxresdefault.jpg?sqp=-oaymwEmCIAKENAF8quKqQMa8AEB-AG2CIAC0AWKAgwIABABGFkgXyhlMA8=&rs=AOn4CLAK6BNZujr1k7N99sFEItv9StbeGA",
    readTime: "9 min read"
  }
];

interface BlogPostPageProps {
  slug: string;
}

export default function BlogPostPage({ slug }: BlogPostPageProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  // Find the post by slug (in real implementation, this would be from API)
  const post = blogPosts[0]; // Using first post for demo
  
  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Post not found</h1>
          <Link href="/blog">
            <Button>Back to Blog</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
  };

  const handleComment = () => {
    // Scroll to comments section or open comment modal
    console.log('Comment functionality');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-6 py-4">
          <Link href="/blog" className="inline-flex items-center text-orange-600 hover:text-orange-700">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>
        </div>
      </div>

      {/* Article Header */}
      <div className="bg-white">
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-4xl mx-auto">
            <Badge className="bg-orange-600 mb-4">{post.category}</Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {post.title}
            </h1>
            <p className="text-xl text-gray-600 mb-8">{post.excerpt}</p>
            
            {/* Author and Meta Info */}
            <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8">
              <div className="flex items-center space-x-4">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={post.authorImage} alt={post.author} />
                  <AvatarFallback>{post.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-gray-900">{post.author}</p>
                  <div className="flex items-center text-sm text-gray-500 space-x-4">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(post.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {post.readTime}
                    </div>
                    <div className="flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      {post.views.toLocaleString()} views
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Engagement Actions */}
              <div className="flex items-center space-x-4 ml-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLike}
                  className={`flex items-center ${isLiked ? 'text-red-600 border-red-600' : ''}`}
                >
                  <Heart className={`w-4 h-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
                  {(post.likes + likesCount).toLocaleString()}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleComment}
                  className="flex items-center"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  {post.comments}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSave}
                  className={`flex items-center ${isSaved ? 'text-orange-600 border-orange-600' : ''}`}
                >
                  <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                  Save
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Article Image */}
      <div className="relative aspect-video max-w-6xl mx-auto mb-12">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover rounded-lg"
          priority
        />
      </div>

      {/* Article Content */}
      <div className="container mx-auto px-6 pb-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg p-8 shadow-sm">
                <div 
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
                
                {/* Tags */}
                <div className="mt-8 pt-8 border-t">
                  <h3 className="font-semibold mb-4">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag, index) => (
                      <Badge key={index} variant="outline">{tag}</Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Author Bio */}
              <Card className="mt-8">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={post.authorImage} alt={post.author} />
                      <AvatarFallback>{post.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-bold text-lg">{post.author}</h3>
                      <p className="text-gray-600 mt-2">{post.authorBio}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-6 space-y-6">
                {/* Related Posts */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-bold text-lg mb-4">Related Articles</h3>
                    <div className="space-y-4">
                      {relatedPosts.map((relatedPost) => (
                        <div key={relatedPost.id} className="group cursor-pointer">
                          <Link href={`/blog/${relatedPost.id}`}>
                            <div className="flex space-x-3">
                              <div className="relative w-16 h-16 bg-gray-200 rounded flex-shrink-0">
                                <Image
                                  src={relatedPost.image}
                                  alt={relatedPost.title}
                                  fill
                                  className="object-cover rounded"
                                />
                              </div>
                              <div>
                                <h4 className="font-semibold text-sm group-hover:text-orange-600 transition-colors leading-tight">
                                  {relatedPost.title}
                                </h4>
                                <p className="text-xs text-gray-500 mt-1">{relatedPost.readTime}</p>
                              </div>
                            </div>
                          </Link>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Newsletter Signup */}
                <Card className="bg-gradient-to-br from-orange-50 to-red-50">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-lg mb-2">Stay Updated</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Get the latest AI insights and stories delivered to your inbox.
                    </p>
                    <Button 
                      className="w-full bg-orange-600 hover:bg-orange-700"
                      onClick={() => {
                        console.log('Newsletter subscription clicked');
                      }}
                    >
                      Subscribe
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
