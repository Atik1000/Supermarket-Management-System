export interface User {
  id: number;
  email: string;
  username: string;
  phone: string;
  first_name: string;
  last_name: string;
  full_name: string;
  role: UserRole;
  is_active: boolean;
  is_staff: boolean;
  date_joined: string;
  profile?: UserProfile;
}

export interface UserProfile {
  id: number;
  avatar?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  date_of_birth?: string;
  created_at: string;
  updated_at: string;
}

export type UserRole = 'super_admin' | 'admin' | 'manager' | 'cashier' | 'delivery' | 'customer';

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  username: string;
  phone: string;
  password: string;
  password_confirm: string;
  first_name?: string;
  last_name?: string;
}

export interface AuthResponse {
  user: User;
  access: string;
  refresh: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}
