'use client';

import type { User } from 'next-auth';
import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { LogOut, User as UserIcon } from 'lucide-react';

interface DashboardHeaderProps {
  user: User;
}

export function DashboardHeader({ user }: DashboardHeaderProps): React.ReactElement {
  const handleLogout = async (): Promise<void> => {
    await signOut({ callbackUrl: '/login' });
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-gray-900">GPBMT.ORG</h1>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <UserIcon className="h-4 w-4" />
            <span>{user.name}</span>
            <span className="text-gray-400">|</span>
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
              {user.roleName}
            </span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="flex items-center space-x-1"
          >
            <LogOut className="h-4 w-4" />
            <span>Đăng xuất</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
