
'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Calendar, User, ArrowRight, Filter, Bookmark } from 'lucide-react';

// Sample blog posts data
const blogPosts = [
  {
    id: 1,
    title: "The Future of AI in Healthcare: An African Perspective",
    excerpt: "Exploring how artificial intelligence can address healthcare challenges across the African continent, from diagnostic tools to predictive analytics.",
    author: "Dr. Kwame Asante",
    date: "2024-09-15",
    readTime: "8 min read",
    category: "AI in Healthcare",
    image: "https://img.freepik.com/free-photo/doctor-using-ai-chatbot-digital-technology_53876-145899.jpg",
    featured: true
  },
  {
    id: 2,
    title: "Building Inclusive AI: Lessons from Ubuntu Philosophy",
    excerpt: "How traditional African philosophies can guide the development of more inclusive and ethical AI systems for global benefit.",
    author: "Prof. Amina Hassan",
    date: "2024-09-12",
    readTime: "6 min read",
    category: "AI Ethics",
    image: "https://images.squarespace-cdn.com/content/v1/56d8b1cfab48de1decc6152d/1459184234440-H7O9BAPUK0R0KZMJYH8Z/image-asset.jpeg",
    featured: true
  },
  {
    id: 3,
    title: "Computer Vision for Agricultural Innovation",
    excerpt: "Leveraging computer vision and machine learning to revolutionize farming practices and food security across Sub-Saharan Africa.",
    author: "Dr. Joseph Mwangi",
    date: "2024-09-10",
    readTime: "9 min read",
    category: "Technical Deep Dive",
    image: "https://i.ytimg.com/vi/ZK21sncBbKk/maxresdefault.jpg",
    featured: false
  },
  {
    id: 4,
    title: "Ubuntu AI Ethics: Community-Centered Machine Learning",
    excerpt: "Drawing from Ubuntu's emphasis on interconnectedness and humanity to develop AI systems that prioritize community wellbeing and social justice.",
    author: "Dr. Chimamanda Adichie",
    date: "2024-09-10",
    readTime: "7 min read",
    category: "AI Ethics",
    image: "https://i.ytimg.com/vi/sPN_SAZGXdA/maxresdefault.jpg",
    featured: false
  },
  {
    id: 4,
    title: "From Lagos to Silicon Valley: My AI Journey",
    excerpt: "A personal reflection on navigating cultural identity while building AI solutions, from a Nigerian engineer's perspective at Google.",
    author: "Adaora Okwu",
    date: "2024-09-08",
    readTime: "5 min read",
    category: "Student Voices",
    image: "https://media.licdn.com/dms/image/v2/D5612AQHO9hF9z3xExg/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1712846777478?e=2147483647&v=beta&t=wzpcceVLmcWcnnKZTpxHzM74JTHHZELQIeYwCkX3-uw",
    featured: false
  },
  {
    id: 5,
    title: "Natural Language Processing for African Languages: Current State and Future Prospects",
    excerpt: "Analyzing the challenges and opportunities in developing NLP models for Swahili, Yoruba, Amharic, and other African languages.",
    author: "Dr. Fatima Al-Zahra",
    date: "2024-09-05",
    readTime: "10 min read",
    category: "Global AI News",
    image: "https://i.ytimg.com/vi/g779p_rIb_M/hqdefault.jpg?sqp=-oaymwEmCOADEOgC8quKqQMa8AEB-AH-DoACuAiKAgwIABABGDEgVyh_MA8=&rs=AOn4CLB4mE2U9awLCMk4Zb5Li4_WTH2yZw",
    featured: false
  },
  {
    id: 6,
    title: "Deep Learning Frameworks: A Comparative Study for African Developers",
    excerpt: "Comprehensive comparison of TensorFlow, PyTorch, and emerging frameworks, with focus on accessibility and resource efficiency for African contexts.",
    author: "Samuel Nkomo",
    date: "2024-09-01",
    readTime: "12 min read",
    category: "Technical Deep Dive",
    image: "https://viso.ai/wp-content/uploads/2023/02/pytorch-vs-tensorflow-popularity-comparison.png",
    featured: false
  }
];

// Categories with counts
const categories = [
  { name: "All", count: blogPosts.length },
  { name: "AI Ethics", count: blogPosts.filter(post => post.category === "AI Ethics").length },
  { name: "Technical Deep Dive", count: blogPosts.filter(post => post.category === "Technical Deep Dive").length },
  { name: "AI in Healthcare", count: blogPosts.filter(post => post.category === "AI in Healthcare").length },
  { name: "Student Voices", count: blogPosts.filter(post => post.category === "Student Voices").length },
  { name: "Global AI News", count: blogPosts.filter(post => post.category === "Global AI News").length },
];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const handleCategoryFilter = (categoryName: string) => {
    setSelectedCategory(categoryName);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search functionality would be implemented here
  };

  const filteredPosts = useMemo(() => {
    return blogPosts.filter(post => {
      const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchTerm]);

  const featuredPosts = filteredPosts.filter(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-orange-50/30">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">AI Insights & Stories</h1>
            <p className="text-xl opacity-90 leading-relaxed">
              Discover the latest trends, research, and stories from the AI community. 
              Explore perspectives from African innovators and global thought leaders.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        {/* Search and Filter */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            <form onSubmit={handleSearch} className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="search"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </form>
            
            <div className="flex items-center space-x-4">
              <Button 
                size="sm" 
                variant="outline" 
                className="flex items-center"
                onClick={() => {
                  // Toggle filter dropdown or modal
                  console.log('Filter functionality');
                }}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <div className="flex space-x-2">
                {categories.map((category) => (
                  <Button 
                    key={category.name}
                    size="sm" 
                    variant={selectedCategory === category.name ? "default" : "outline"}
                    className={selectedCategory === category.name ? "bg-orange-600 hover:bg-orange-700" : ""}
                    onClick={() => handleCategoryFilter(category.name)}
                  >
                    {category.name} ({category.count})
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Articles</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {featuredPosts.map((post) => (
                <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                  <div className="relative aspect-video bg-gray-200">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Badge className="absolute top-4 left-4 bg-orange-600">{post.category}</Badge>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <User className="w-4 h-4 mr-1" />
                      {post.author}
                      <Calendar className="w-4 h-4 ml-4 mr-1" />
                      {post.date}
                      <span className="ml-4">{post.readTime}</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-gray-900">{post.title}</h3>
                    <p className="text-gray-600 mb-4">{post.excerpt}</p>
                    <Link href={`/blog/${post.id}`}>
                      <Button variant="outline" className="group-hover:bg-orange-600 group-hover:text-white transition-colors">
                        Read More
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Regular Posts */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Latest Articles</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularPosts.map((post) => (
              <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                <div className="relative aspect-video bg-gray-200">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge className="absolute top-4 left-4 bg-orange-600">{post.category}</Badge>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <User className="w-4 h-4 mr-1" />
                    {post.author}
                    <Calendar className="w-4 h-4 ml-4 mr-1" />
                    {post.date}
                    <span className="ml-4">{post.readTime}</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-900">{post.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{post.excerpt}</p>
                  <Link href={`/blog/${post.id}`}>
                    <Button variant="outline" size="sm" className="group-hover:bg-orange-600 group-hover:text-white transition-colors">
                      Read More
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* No Results */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No articles found matching your criteria.</p>
            <Button 
              onClick={() => {
                setSelectedCategory("All");
                setSearchTerm("");
              }}
              className="mt-4"
              variant="outline"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
