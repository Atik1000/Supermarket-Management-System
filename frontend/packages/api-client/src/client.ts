import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

interface TokenRefreshResponse {
  access: string;
}

class ApiClient {
  private client: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (value?: unknown) => void;
    reject: (reason?: unknown) => void;
  }> = [];

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('access_token');
          if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            })
              .then(() => this.client(originalRequest))
              .catch((err) => Promise.reject(err));
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const refreshToken = typeof window !== 'undefined' 
              ? localStorage.getItem('refresh_token') 
              : null;

            if (!refreshToken) {
              throw new Error('No refresh token');
            }

            const response = await axios.post<TokenRefreshResponse>(
              `${API_BASE_URL}/auth/token/refresh/`,
              { refresh: refreshToken }
            );

            const { access } = response.data;

            if (typeof window !== 'undefined') {
              localStorage.setItem('access_token', access);
            }

            this.processQueue(null);
            this.isRefreshing = false;

            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${access}`;
            }

            return this.client(originalRequest);
          } catch (refreshError) {
            this.processQueue(refreshError);
            this.isRefreshing = false;

            if (typeof window !== 'undefined') {
              localStorage.removeItem('access_token');
              localStorage.removeItem('refresh_token');
              window.location.href = '/login';
            }

            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private processQueue(error: unknown) {
    this.failedQueue.forEach((promise) => {
      if (error) {
        promise.reject(error);
      } else {
        promise.resolve();
      }
    });

    this.failedQueue = [];
  }

  public getClient(): AxiosInstance {
    return this.client;
  }

  // Auth methods
  public async login(email: string, password: string) {
    const response = await this.client.post('/auth/login/', { email, password });
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
    }
    return response.data;
  }

  public async register(data: {
    email: string;
    username: string;
    phone: string;
    password: string;
    first_name?: string;
    last_name?: string;
  }) {
    const response = await this.client.post('/auth/register/', data);
    return response.data;
  }

  public logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  }

  public async getCurrentUser() {
    const response = await this.client.get('/auth/me/');
    return response.data;
  }
}

const apiClient = new ApiClient();
export default apiClient;
export { ApiClient };
