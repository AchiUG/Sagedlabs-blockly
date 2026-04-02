
'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  Menu, 
  X, 
  User, 
  LogOut, 
  Settings, 
  GraduationCap,
  BookOpenCheck,
  Users,
  BarChart3,
  Home,
  Shield,
  Blocks
} from 'lucide-react';

export default function Header() {
  const { data: session } = useSession() || {};
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const getNavigationLinks = () => {
    if (!session) return [];

    const role = (session.user as any)?.role;
    const baseLinks = [
      { href: '/dashboard', label: 'Dashboard', icon: Home },
      { href: '/courses', label: 'Courses', icon: BookOpen },
    ];

    switch (role) {
      case 'STUDENT':
        return [
          ...baseLinks,
          { href: '/learn', label: 'Blocks Lab', icon: Blocks },
          { href: '/my-learning', label: 'My Learning', icon: GraduationCap },
          { href: '/certificates', label: 'Certificates', icon: BookOpenCheck },
        ];
      case 'INSTRUCTOR':
        return [
          ...baseLinks,
          { href: '/instructor/courses', label: 'My Courses', icon: BookOpenCheck },
          { href: '/instructor/students', label: 'Students', icon: Users },
          { href: '/instructor/analytics', label: 'Analytics', icon: BarChart3 },
        ];
      case 'ADMIN':
        return [
          { href: '/admin/dashboard', label: 'Admin Dashboard', icon: Shield },
          { href: '/admin/users', label: 'Student Management', icon: Users },
          { href: '/admin/courses', label: 'Curriculum', icon: BookOpenCheck },
          { href: '/learn', label: 'Blocks Lab', icon: Blocks },
          { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
        ];
      default:
        return baseLinks;
    }
  };

  const navigationLinks = getNavigationLinks();

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b shadow-sm" style={{ borderColor: 'rgba(18, 71, 52, 0.15)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href={session ? '/dashboard' : '/'} className="flex items-center space-x-3 group">
            <div className="relative w-14 h-14 transition-transform duration-300 group-hover:scale-105">
              <Image
                src="/saged-logo.jpg"
                alt="SAGED Academy"
                fill
                className="object-contain drop-shadow-sm"
                style={{ 
                  mixBlendMode: 'multiply',
                  filter: 'brightness(1.1) contrast(1.05)'
                }}
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold transition-colors duration-200" style={{ color: '#124734' }}>
                SAGE-D<sup className="text-sm">™</sup>
              </span>
              <span className="text-xs tracking-wider" style={{ color: '#D9A441' }}>CONTEXT. AGENCY. MEANING.</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {session ? (
              <>
                {navigationLinks?.map((link) => {
                  const IconComponent = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex items-center space-x-2 text-gray-700 transition-colors duration-200"
                      style={{ 
                        color: '#374151',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.color = '#00A38B'}
                      onMouseLeave={(e) => e.currentTarget.style.color = '#374151'}
                    >
                      <IconComponent className="w-4 h-4" />
                      <span className="font-medium">{link.label}</span>
                    </Link>
                  );
                })}
              </>
            ) : (
              <>
                <Link href="/about" className="text-gray-700 hover:text-teal-600 font-medium transition-colors duration-200">
                  About Us
                </Link>
                <Link href="/curriculum" className="text-gray-700 hover:text-teal-600 font-medium transition-colors duration-200">
                  Programs
                </Link>
                <Link href="/courses" className="text-gray-700 hover:text-teal-600 font-medium transition-colors duration-200">
                  Curriculum
                </Link>
                <Link href="/community" className="text-gray-700 hover:text-teal-600 font-medium transition-colors duration-200">
                  Community
                </Link>
                <Link href="/blog" className="text-gray-700 hover:text-teal-600 font-medium transition-colors duration-200">
                  Blog
                </Link>
                <Link href="/partnerships" className="text-gray-700 hover:text-teal-600 font-medium transition-colors duration-200">
                  Partnerships
                </Link>
                <Link href="/contact" className="text-gray-700 hover:text-teal-600 font-medium transition-colors duration-200">
                  Contact
                </Link>
              </>
            )}
          </nav>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {session ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Welcome, {session.user?.name?.split(' ')[0]}
                </span>
                <div className="flex items-center space-x-2">
                  <Link href="/profile">
                    <Button variant="ghost" size="sm">
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" onClick={handleSignOut}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/auth/signin">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button className="saged-button" size="sm">
                    Join Us
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={toggleMobileMenu}>
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col space-y-4">
              {session ? (
                <>
                  <div className="px-4 py-2 text-sm text-gray-600 border-b border-gray-100">
                    Welcome, {session.user?.name}
                  </div>
                  {navigationLinks?.map((link) => {
                    const IconComponent = link.icon;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-teal-600 hover:bg-teal-50 rounded-md transition-colors duration-200"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <IconComponent className="w-4 h-4" />
                        <span className="font-medium">{link.label}</span>
                      </Link>
                    );
                  })}
                  <div className="border-t border-gray-100 pt-4 space-y-2">
                    <Link
                      href="/profile"
                      className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-teal-600 hover:bg-teal-50 rounded-md transition-colors duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      <span className="font-medium">Profile</span>
                    </Link>
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        handleSignOut();
                      }}
                      className="flex items-center space-x-2 px-4 py-2 w-full text-left text-gray-700 hover:text-teal-600 hover:bg-teal-50 rounded-md transition-colors duration-200"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="font-medium">Sign Out</span>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    href="/about"
                    className="px-4 py-2 text-gray-700 hover:text-teal-600 font-medium transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    About Us
                  </Link>
                  <Link
                    href="/curriculum"
                    className="px-4 py-2 text-gray-700 hover:text-teal-600 font-medium transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Programs & Courses
                  </Link>
                  <Link
                    href="/courses"
                    className="px-4 py-2 text-gray-700 hover:text-teal-600 font-medium transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Curriculum
                  </Link>
                  <Link
                    href="/community"
                    className="px-4 py-2 text-gray-700 hover:text-teal-600 font-medium transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Community & Impact
                  </Link>
                  <Link
                    href="/blog"
                    className="px-4 py-2 text-gray-700 hover:text-teal-600 font-medium transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Blog & Insights
                  </Link>
                  <Link
                    href="/partnerships"
                    className="px-4 py-2 text-gray-700 hover:text-teal-600 font-medium transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Partnerships
                  </Link>
                  <Link
                    href="/contact"
                    className="px-4 py-2 text-gray-700 hover:text-teal-600 font-medium transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Contact & Enrollment
                  </Link>
                  <div className="border-t border-gray-100 pt-4 space-y-2">
                    <Link
                      href="/auth/signin"
                      className="block px-4 py-2 text-gray-700 hover:text-teal-600 font-medium transition-colors duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/auth/signup"
                      className="block px-4 py-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Button className="saged-button w-full" size="sm">
                        Join Us
                      </Button>
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
