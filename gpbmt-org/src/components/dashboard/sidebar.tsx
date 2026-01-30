'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Church,
  Users,
  Wallet,
  Building2,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { href: '/dashboard', label: 'Tổng quan', icon: LayoutDashboard },
  { href: '/dashboard/parishes', label: 'Giáo xứ', icon: Church },
  { href: '/dashboard/parishioners', label: 'Giáo dân', icon: Users },
  { href: '/dashboard/finance', label: 'Tài chính', icon: Wallet },
  { href: '/dashboard/assets', label: 'Tài sản', icon: Building2 },
  { href: '/dashboard/settings', label: 'Cài đặt', icon: Settings },
];

export function DashboardSidebar(): React.ReactElement {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white shadow-sm min-h-[calc(100vh-73px)] border-r">
      <nav className="p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center space-x-3 px-3 py-2 rounded-md text-sm transition-colors',
                isActive
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
