export interface User {
  id: string;
  email: string;
  username: string;
  phone: string;
  first_name: string;
  last_name: string;
  role: 'super_admin' | 'admin' | 'manager' | 'cashier' | 'delivery' | 'customer';
  is_active: boolean;
  is_staff: boolean;
  profile?: UserProfile;
}

export interface UserProfile {
  id: string;
  user: string;
  avatar?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  date_of_birth?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface RegisterRequest {
  email: string;
  username: string;
  phone: string;
  password: string;
  first_name?: string;
  last_name?: string;
}

export interface RegisterResponse {
  user: User;
  message: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}
