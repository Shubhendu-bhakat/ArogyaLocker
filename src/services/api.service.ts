import axios from 'axios';
import type { User } from './auth.service';

// API base URL
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-production-api.com/api' 
  : 'http://localhost:5000/api';

// Define response types
export interface LoginResponse {
  user: User;
  token: string;
}

export interface RegisterResponse extends LoginResponse {}
export type UpdateProfileResponse = User;

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    // Don't add token for endpoints that don't require auth
    if (!config.url?.includes('/auth/login') && 
        !config.url?.includes('/auth/register') && 
        !config.url?.includes('/auth/reset-password')) {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        throw new Error('Authentication required');
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const errorMessage = error.response?.data?.message || error.message;
    return Promise.reject(new Error(errorMessage));
  }
);

// Auth API endpoints
export const authApi = {
  // Register new user
  register: async (name: string, email: string, password: string, phone?: string) => {
    return await api.post<any, RegisterResponse>('/auth/register', { name, email, password, phone });
  },
  
  // Login user
  login: async (email: string, password: string) => {
    return await api.post<any, LoginResponse>('/auth/login', { email, password });
  },
  
  // Get current user
  getCurrentUser: async () => {
    return await api.get<any, User>('/auth/me');
  },
  
  // Update user profile
  updateProfile: async (userData: Partial<User>) => {
    return await api.put<any, UpdateProfileResponse>('/auth/profile', userData);
  },
  
  // Reset password
  resetPassword: async (email: string, newPassword: string) => {
    return await api.post<any, void>('/auth/reset-password', { email, newPassword });
  },
};

export default {
  auth: authApi,
  api // Export the axios instance for use elsewhere
}; 