import { User, UserRole } from '@/modules/auth/types';

export interface UserFormData {
  email: string;
  username: string;
  phone: string;
  password?: string;
  password_confirm?: string;
  first_name: string;
  last_name: string;
  role: UserRole;
}

export interface UserFilters {
  search: string;
  role: UserRole | 'all';
}

export interface UseUsersResult {
  users: User[];
  loading: boolean;
  error: string;
  fetchUsers: () => Promise<void>;
  createUser: (data: UserFormData) => Promise<void>;
  updateUser: (id: number, data: Partial<UserFormData>) => Promise<void>;
  deleteUser: (id: number) => Promise<void>;
  toggleUserStatus: (id: number, isActive: boolean) => Promise<void>;
}
