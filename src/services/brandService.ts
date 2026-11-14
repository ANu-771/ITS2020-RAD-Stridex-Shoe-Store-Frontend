import api from './api';
import type { Brand } from '../types';

export interface BrandPayload {
  name: string;
  description?: string;
  logo?: string;
  isActive?: boolean;
}

export const brandService = {
  getAll: async (params?: { active?: boolean; search?: string }): Promise<{ success: boolean; data: Brand[] }> => {
    const res = await api.get('/brands', { params });
    return res.data;
  },

  getById: async (id: string): Promise<{ success: boolean; data: Brand }> => {
    const res = await api.get(`/brands/${id}`);
    return res.data;
  },

  create: async (payload: BrandPayload): Promise<{ success: boolean; message: string; data: Brand }> => {
    const res = await api.post('/brands', payload);
    return res.data;
  },

  update: async (id: string, payload: Partial<BrandPayload>): Promise<{ success: boolean; message: string; data: Brand }> => {
    const res = await api.put(`/brands/${id}`, payload);
    return res.data;
  },

  delete: async (id: string): Promise<{ success: boolean; message: string }> => {
    const res = await api.delete(`/brands/${id}`);
    return res.data;
  },
};
