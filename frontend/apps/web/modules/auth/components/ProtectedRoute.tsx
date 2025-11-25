'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
}

export const ProtectedRoute = ({ children, requiredRoles }: ProtectedRouteProps) => {
  const router = useRouter();
  const { isAuthenticated, user, isLoading, fetchUser, hasRole } = useAuth();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        router.push('/login');
        return;
      }

      if (!user && token) {
        try {
          await fetchUser();
        } catch {
          router.push('/login');
        }
      }
    };

    checkAuth();
  }, [user, router, fetchUser]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }

    if (!isLoading && isAuthenticated && requiredRoles && !hasRole(requiredRoles)) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router, requiredRoles, hasRole]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (requiredRoles && !hasRole(requiredRoles)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
          <p className="mt-2 text-gray-600">
            You dont have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
