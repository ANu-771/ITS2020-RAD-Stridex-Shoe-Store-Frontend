import api from './api';
import { UserRole } from '../types';

export interface AdminUserItem {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUserStats {
  totalUsers: number;
  totalCustomers: number;
  totalInventoryManagers: number;
  totalAdmins: number;
  activeUsers: number;
  inactiveUsers: number;
}

export interface GetUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: string;
}

export interface GetUsersResponse {
  success: boolean;
  data: AdminUserItem[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
  stats: AdminUserStats;
}

export interface GetUserDetailsResponse {
  success: boolean;
  data: AdminUserItem & {
    orderStats?: {
      totalOrders: number;
      totalSpent: number;
    };
  };
}

export interface UpdateUserResponse {
  success: boolean;
  message: string;
  data: AdminUserItem;
}

export const adminUserService = {
  getUsers: async (params: GetUsersParams = {}): Promise<GetUsersResponse> => {
    const res = await api.get<GetUsersResponse>('/admin/users', { params });
    return res.data;
  },

  getUserById: async (id: string): Promise<GetUserDetailsResponse> => {
    const res = await api.get<GetUserDetailsResponse>(`/admin/users/${id}`);
    return res.data;
  },

  updateUserRole: async (id: string, role: UserRole): Promise<UpdateUserResponse> => {
    const res = await api.patch<UpdateUserResponse>(`/admin/users/${id}/role`, { role });
    return res.data;
  },

  updateUserStatus: async (id: string, isActive: boolean): Promise<UpdateUserResponse> => {
    const res = await api.patch<UpdateUserResponse>(`/admin/users/${id}/status`, { isActive });
    return res.data;
  },
};
