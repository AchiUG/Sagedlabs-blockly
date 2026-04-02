
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  BarChart3,
  Settings,
  Home,
  ShieldCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  {
    title: 'Admin Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Student Management',
    href: '/admin/users',
    icon: Users,
  },
  {
    title: 'Curriculum Overview',
    href: '/admin/courses',
    icon: BookOpen,
  },
  {
    title: 'Analytics & Reports',
    href: '/admin/analytics',
    icon: BarChart3,
  },
  {
    title: 'Settings',
    href: '/admin/settings',
    icon: Settings,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-lg text-gray-900">Admin Panel</h2>
            <p className="text-xs text-gray-500">SAGED LMS</p>
          </div>
        </div>
      </div>

      <nav className="p-4 space-y-1">
        <Link
          href="/dashboard"
          className={cn(
            'flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
            'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          )}
        >
          <Home className="w-5 h-5" />
          <span>Student Dashboard</span>
        </Link>

        <div className="pt-4 pb-2">
          <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Administration
          </p>
        </div>

        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-orange-50 text-orange-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
