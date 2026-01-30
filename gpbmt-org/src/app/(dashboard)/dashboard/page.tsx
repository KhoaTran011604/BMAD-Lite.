import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { auth } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'Tổng quan - GPBMT.ORG',
  description: 'Bảng điều khiển hệ thống quản lý Giáo phận Buôn Ma Thuột',
};

export default async function DashboardPage(): Promise<ReactNode> {
  const session = await auth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tổng quan</h1>
        <p className="text-gray-600 mt-1">
          Chào mừng {session?.user?.name} đến với hệ thống quản lý GPBMT.ORG
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Giáo xứ"
          value="--"
          description="Tổng số giáo xứ"
          color="blue"
        />
        <StatCard
          title="Giáo dân"
          value="--"
          description="Tổng số giáo dân"
          color="green"
        />
        <StatCard
          title="Giao dịch"
          value="--"
          description="Chờ duyệt"
          color="yellow"
        />
        <StatCard
          title="Nhân sự"
          value="--"
          description="Nhân viên hoạt động"
          color="purple"
        />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Thông tin người dùng
        </h2>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <dt className="text-sm text-gray-500">Họ tên</dt>
            <dd className="text-sm font-medium text-gray-900">
              {session?.user?.name}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500">Email</dt>
            <dd className="text-sm font-medium text-gray-900">
              {session?.user?.email}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500">Vai trò</dt>
            <dd className="text-sm font-medium text-gray-900">
              {session?.user?.roleName}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500">Giáo xứ</dt>
            <dd className="text-sm font-medium text-gray-900">
              {session?.user?.parishName || 'Không có'}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  color: 'blue' | 'green' | 'yellow' | 'purple';
}

function StatCard({ title, value, description, color }: StatCardProps): ReactNode {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    green: 'bg-green-50 text-green-700 border-green-200',
    yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
  };

  return (
    <div className={`p-6 rounded-lg border ${colorClasses[color]}`}>
      <h3 className="text-sm font-medium opacity-80">{title}</h3>
      <p className="text-3xl font-bold mt-2">{value}</p>
      <p className="text-xs opacity-70 mt-1">{description}</p>
    </div>
  );
}
