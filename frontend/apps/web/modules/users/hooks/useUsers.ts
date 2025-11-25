import { useState, useCallback } from 'react';
import { apiClient } from '@/lib/api-client';
import { User } from '@/modules/auth/types';
import { UserFormData, UseUsersResult } from '../types';

export const useUsers = (): UseUsersResult => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const response = await apiClient.get<User[]>('/users/');
      setUsers(response.data);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Failed to load users');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createUser = useCallback(async (data: UserFormData) => {
    try {
      await apiClient.post('/users/', data);
      await fetchUsers();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      const errorMessage = error.response?.data?.message || 'Failed to create user';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [fetchUsers]);

  const updateUser = useCallback(async (id: number, data: Partial<UserFormData>) => {
    try {
      await apiClient.patch(`/users/${id}/`, data);
      await fetchUsers();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      const errorMessage = error.response?.data?.message || 'Failed to update user';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [fetchUsers]);

  const deleteUser = useCallback(async (id: number) => {
    try {
      await apiClient.delete(`/users/${id}/`);
      await fetchUsers();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      const errorMessage = error.response?.data?.message || 'Failed to delete user';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [fetchUsers]);

  const toggleUserStatus = useCallback(async (id: number, isActive: boolean) => {
    try {
      const endpoint = isActive ? 'deactivate' : 'activate';
      await apiClient.post(`/users/${id}/${endpoint}/`);
      await fetchUsers();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      const errorMessage = error.response?.data?.message || 'Failed to update user status';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [fetchUsers]);

  return {
    users,
    loading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
  };
};
