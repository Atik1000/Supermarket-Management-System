'use client';

import { useState, useEffect, useMemo } from 'react';
import { ProtectedRoute } from '@/modules/auth/components/ProtectedRoute';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import { useUsers } from '@/modules/users/hooks/useUsers';
import { UserTable } from '@/modules/users/components/UserTable';
import { UserFiltersBar } from '@/modules/users/components/UserFiltersBar';
import { UserFormModal } from '@/modules/users/components/UserFormModal';
import { Button } from '@/components/ui/Button';
import { ErrorAlert, SuccessAlert } from '@/components/ui/Alert';
import { LoadingPage } from '@/components/ui/Loading';
import { User } from '@/modules/auth/types';
import { UserFormData, UserFilters } from '@/modules/users/types';

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const {
    users,
    loading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
  } = useUsers();

  const [filters, setFilters] = useState<UserFilters>({
    search: '',
    role: 'all',
  });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.email.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.username.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.full_name.toLowerCase().includes(filters.search.toLowerCase());
      const matchesRole = filters.role === 'all' || user.role === filters.role;
      return matchesSearch && matchesRole;
    });
  }, [users, filters]);

  const handleCreateUser = async (data: UserFormData) => {
    await createUser(data);
    setSuccessMessage('User created successfully');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleUpdateUser = async (data: UserFormData) => {
    if (!selectedUser) return;
    const updateData = {
      email: data.email,
      username: data.username,
      phone: data.phone,
      first_name: data.first_name,
      last_name: data.last_name,
      role: data.role,
    };
    await updateUser(selectedUser.id, updateData);
    setSuccessMessage('User updated successfully');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    await deleteUser(userId);
    setSuccessMessage('User deleted successfully');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleToggleStatus = async (userId: number, isActive: boolean) => {
    await toggleUserStatus(userId, isActive);
    setSuccessMessage(`User ${isActive ? 'deactivated' : 'activated'} successfully`);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  if (loading && users.length === 0) {
    return <LoadingPage message="Loading users..." />;
  }

  return (
    <ProtectedRoute requiredRoles={['super_admin', 'admin', 'manager']}>
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  User Management
                </h1>
                <p className="mt-2 text-sm text-gray-600">
                  Manage all users in the system
                </p>
              </div>
              <Button onClick={() => setShowCreateModal(true)}>
                <svg
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Create User
              </Button>
            </div>
          </div>

          {/* Filters */}
          <UserFiltersBar filters={filters} onFiltersChange={setFilters} />

          {/* Messages */}
          {error && <ErrorAlert message={error} />}
          {successMessage && <SuccessAlert message={successMessage} />}

          {/* Users Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden mt-6">
            <UserTable
              users={filteredUsers}
              onEdit={openEditModal}
              onDelete={handleDeleteUser}
              onToggleStatus={handleToggleStatus}
              isSuperAdmin={currentUser?.role === 'super_admin'}
            />
          </div>
        </div>

        {/* Create User Modal */}
        <UserFormModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateUser}
          mode="create"
          isSuperAdmin={currentUser?.role === 'super_admin'}
        />

        {/* Edit User Modal */}
        {selectedUser && (
          <UserFormModal
            isOpen={showEditModal}
            onClose={() => {
              setShowEditModal(false);
              setSelectedUser(null);
            }}
            onSubmit={handleUpdateUser}
            initialData={{
              email: selectedUser.email,
              username: selectedUser.username,
              phone: selectedUser.phone,
              first_name: selectedUser.first_name,
              last_name: selectedUser.last_name,
              role: selectedUser.role,
            }}
            mode="edit"
            isSuperAdmin={currentUser?.role === 'super_admin'}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}
