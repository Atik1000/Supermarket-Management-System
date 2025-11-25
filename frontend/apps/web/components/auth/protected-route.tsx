'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth-store';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: Array<'super_admin' | 'admin' | 'manager' | 'cashier' | 'delivery' | 'customer'>;
}

export function ProtectedRoute({ children, requiredRoles }: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, user, isLoading, fetchUser } = useAuthStore();

  useEffect(() => {
    const checkAuth = async () => {
      if (!isAuthenticated) {
        // Try to fetch user if we have a token
        const token = localStorage.getItem('access_token');
        if (token) {
          await fetchUser();
        } else {
          router.push('/login');
        }
      } else if (requiredRoles && user && !requiredRoles.includes(user.role)) {
        // User is authenticated but doesn't have required role
        router.push('/unauthorized');
      }
    };

    checkAuth();
  }, [isAuthenticated, user, fetchUser, router, requiredRoles]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || (requiredRoles && user && !requiredRoles.includes(user.role))) {
    return null;
  }

  return <>{children}</>;
}
