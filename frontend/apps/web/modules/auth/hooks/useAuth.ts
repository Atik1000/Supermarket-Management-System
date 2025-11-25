import { useAuthStore } from '@/lib/store/auth-store';

export const useAuth = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    fetchUser,
    clearError,
  } = useAuthStore();

  const hasRole = (roles: string[]): boolean => {
    return user ? roles.includes(user.role) : false;
  };

  const isAdmin = (): boolean => {
    return hasRole(['super_admin', 'admin', 'manager']);
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    fetchUser,
    clearError,
    hasRole,
    isAdmin,
  };
};
