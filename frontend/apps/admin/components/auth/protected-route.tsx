'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth-store';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, user, isLoading, fetchUser } = useAuthStore();

  useEffect(() => {
    const checkAuth = async () => {
      if (!isAuthenticated) {
        const token = localStorage.getItem('access_token');
        if (token) {
          await fetchUser();
        } else {
          router.push('/login');
        }
      } else if (user && !['super_admin', 'admin', 'manager'].includes(user.role)) {
        router.push('/login');
      }
    };

    checkAuth();
  }, [isAuthenticated, user, fetchUser, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || (user && !['super_admin', 'admin', 'manager'].includes(user.role))) {
    return null;
  }

  return <>{children}</>;
}
