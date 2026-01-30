import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { LoginForm } from '@/components/forms/login-form';

export const metadata: Metadata = {
  title: 'Đăng nhập - GPBMT.ORG',
  description: 'Đăng nhập vào hệ thống quản lý Giáo phận Buôn Ma Thuột',
};

export default function LoginPage(): ReactNode {
  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">GPBMT.ORG</h1>
        <p className="text-sm text-gray-600 mt-1">
          Hệ thống quản lý Giáo phận Buôn Ma Thuột
        </p>
      </div>

      <h2 className="text-lg font-semibold text-gray-800 mb-4">Đăng nhập</h2>

      <LoginForm />

      <p className="text-xs text-gray-500 text-center mt-6">
        Liên hệ quản trị viên nếu bạn gặp vấn đề khi đăng nhập
      </p>
    </div>
  );
}
