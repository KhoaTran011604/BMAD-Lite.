'use client';

/**
 * PermissionDeniedToast Component
 *
 * Shows a toast notification when user is redirected due to permission denial.
 * Reads the error and attempted route from URL search params.
 */

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function PermissionDeniedToast(): React.ReactElement | null {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const error = searchParams.get('error');
    const attempted = searchParams.get('attempted');

    if (error === 'permission_denied') {
      // Show toast notification
      toast.error('Không có quyền truy cập', {
        description: attempted
          ? `Bạn không có quyền truy cập trang ${attempted}`
          : 'Bạn không có quyền truy cập trang này',
        duration: 5000,
      });

      // Clean up URL params
      const url = new URL(window.location.href);
      url.searchParams.delete('error');
      url.searchParams.delete('attempted');
      router.replace(url.pathname, { scroll: false });
    }
  }, [searchParams, router]);

  return null;
}
