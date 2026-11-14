import api from './api';
import type { Category } from '../types';

export interface CategoryPayload {
  name: string;
  description?: string;
  image?: string;
  isActive?: boolean;
}

export const categoryService = {
  getAll: async (params?: { active?: boolean; search?: string }): Promise<{ success: boolean; data: Category[] }> => {
    const res = await api.get('/categories', { params });
    return res.data;
  },

  getById: async (id: string): Promise<{ success: boolean; data: Category }> => {
    const res = await api.get(`/categories/${id}`);
    return res.data;
  },

  create: async (payload: CategoryPayload): Promise<{ success: boolean; message: string; data: Category }> => {
    const res = await api.post('/categories', payload);
    return res.data;
  },

  update: async (id: string, payload: Partial<CategoryPayload>): Promise<{ success: boolean; message: string; data: Category }> => {
    const res = await api.put(`/categories/${id}`, payload);
    return res.data;
  },

  delete: async (id: string): Promise<{ success: boolean; message: string }> => {
    const res = await api.delete(`/categories/${id}`);
    return res.data;
  },
};
