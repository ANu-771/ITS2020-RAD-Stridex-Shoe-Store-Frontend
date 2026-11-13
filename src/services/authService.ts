import api from './api';
import type { User, AuthResponse } from '../types';

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export const authService = {
  // Public registration (enforced as CUSTOMER)
  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', payload);
    return response.data;
  },

  // User login
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', payload);
    return response.data;
  },

  // Fetch current user details
  getMe: async (): Promise<{ success: boolean; data: { user: User } }> => {
    const response = await api.get<{ success: boolean; data: { user: User } }>('/auth/me');
    return response.data;
  },

  // Refresh access token
  refreshToken: async (): Promise<{ success: boolean; data: { accessToken: string } }> => {
    const response = await api.post<{ success: boolean; data: { accessToken: string } }>(
      '/auth/refresh'
    );
    return response.data;
  },

  // User logout
  logout: async (): Promise<{ success: boolean; message: string }> => {
    const response = await api.post<{ success: boolean; message: string }>('/auth/logout');
    return response.data;
  },
};
