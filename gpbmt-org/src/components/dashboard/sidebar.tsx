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
  FileText,
  CreditCard,
  FolderTree,
  Building,
  UserCog,
  ClipboardList,
  UserPlus,
  Receipt,
  Shield,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePermissions } from '@/hooks/use-permissions';
import { PERMISSIONS } from '@/lib/auth/permissions';

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  permissions?: string[]; // Required permissions (OR logic - any one)
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

/**
 * Navigation configuration with permission requirements
 * Items are grouped by category for better organization
 */
const navGroups: NavGroup[] = [
  {
    label: 'Tổng quan',
    items: [
      {
        href: '/dashboard',
        label: 'Trang chủ',
        icon: LayoutDashboard,
        // No permissions required - all authenticated users can access
      },
    ],
  },
  {
    label: 'Quản lý Giáo xứ',
    items: [
      {
        href: '/dashboard/parishes',
        label: 'Giáo xứ',
        icon: Church,
        permissions: [PERMISSIONS.PARISHES_READ],
      },
      {
        href: '/dashboard/parishioners',
        label: 'Giáo dân',
        icon: Users,
        permissions: [PERMISSIONS.PARISHIONERS_READ],
      },
    ],
  },
  {
    label: 'Tài chính',
    items: [
      {
        href: '/dashboard/finance/transactions',
        label: 'Giao dịch',
        icon: Receipt,
        permissions: [PERMISSIONS.TRANSACTIONS_READ],
      },
      {
        href: '/dashboard/finance/funds',
        label: 'Quỹ',
        icon: Wallet,
        permissions: [PERMISSIONS.TRANSACTIONS_READ],
      },
      {
        href: '/dashboard/finance/categories',
        label: 'Danh mục',
        icon: FolderTree,
        permissions: [PERMISSIONS.TRANSACTIONS_READ],
      },
      {
        href: '/dashboard/finance/bank-accounts',
        label: 'Tài khoản ngân hàng',
        icon: CreditCard,
        permissions: [PERMISSIONS.TRANSACTIONS_READ],
      },
      {
        href: '/dashboard/finance/entities',
        label: 'Đối tác',
        icon: Building,
        permissions: [PERMISSIONS.TRANSACTIONS_READ],
      },
    ],
  },
  {
    label: 'Nhân sự',
    items: [
      {
        href: '/dashboard/hr/employees',
        label: 'Nhân viên',
        icon: UserPlus,
        permissions: [PERMISSIONS.PAYROLLS_READ, PERMISSIONS.PAYROLLS_MANAGE],
      },
      {
        href: '/dashboard/hr/payrolls',
        label: 'Bảng lương',
        icon: ClipboardList,
        permissions: [PERMISSIONS.PAYROLLS_READ, PERMISSIONS.PAYROLLS_MANAGE],
      },
    ],
  },
  {
    label: 'Quản trị',
    items: [
      {
        href: '/dashboard/administration/assets',
        label: 'Tài sản',
        icon: Building2,
        permissions: [PERMISSIONS.ASSETS_READ],
      },
      {
        href: '/dashboard/administration/rental-contracts',
        label: 'Hợp đồng thuê',
        icon: FileText,
        permissions: [PERMISSIONS.ASSETS_READ],
      },
    ],
  },
  {
    label: 'Hệ thống',
    items: [
      {
        href: '/dashboard/system/users',
        label: 'Người dùng',
        icon: UserCog,
        permissions: [PERMISSIONS.USERS_READ],
      },
      {
        href: '/dashboard/system/audit-logs',
        label: 'Nhật ký hoạt động',
        icon: Shield,
        permissions: [PERMISSIONS.AUDIT_LOGS_READ],
      },
      {
        href: '/dashboard/settings',
        label: 'Cài đặt',
        icon: Settings,
        // Settings available to all authenticated users
      },
    ],
  },
];

export function DashboardSidebar(): React.ReactElement {
  const pathname = usePathname();
  const { canAny, isLoading } = usePermissions();

  /**
   * Check if user can access a nav item based on permissions
   */
  const canAccessItem = (item: NavItem): boolean => {
    // No permissions required = accessible to all
    if (!item.permissions || item.permissions.length === 0) {
      return true;
    }
    return canAny(item.permissions);
  };

  /**
   * Filter nav groups to only show accessible items
   */
  const filteredGroups = navGroups
    .map((group) => ({
      ...group,
      items: group.items.filter(canAccessItem),
    }))
    .filter((group) => group.items.length > 0);

  if (isLoading) {
    return (
      <aside className="w-64 bg-white shadow-sm min-h-[calc(100vh-73px)] border-r">
        <nav className="p-4">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-8 bg-gray-200 rounded" />
            ))}
          </div>
        </nav>
      </aside>
    );
  }

  return (
    <aside className="w-64 bg-white shadow-sm min-h-[calc(100vh-73px)] border-r overflow-y-auto">
      <nav className="p-4 space-y-6">
        {filteredGroups.map((group) => (
          <div key={group.label}>
            <h3 className="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              {group.label}
            </h3>
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  (item.href !== '/dashboard' && pathname.startsWith(`${item.href}/`));

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
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
