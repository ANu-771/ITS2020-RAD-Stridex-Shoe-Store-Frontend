import api from './api';
import type { ProductVariant } from '../types';

export interface VariantPayload {
  productId: string;
  SKU: string;
  size: number | string;
  color: string;
  stockQuantity: number;
  reservedQuantity?: number;
  isActive?: boolean;
}

export const variantService = {
  getByProduct: async (productId: string): Promise<{ success: boolean; data: ProductVariant[] }> => {
    const res = await api.get(`/variants/product/${productId}`);
    return res.data;
  },

  getById: async (id: string): Promise<{ success: boolean; data: ProductVariant }> => {
    const res = await api.get(`/variants/${id}`);
    return res.data;
  },

  create: async (payload: VariantPayload): Promise<{ success: boolean; message: string; data: ProductVariant }> => {
    const res = await api.post('/variants', payload);
    return res.data;
  },

  update: async (id: string, payload: Partial<VariantPayload>): Promise<{ success: boolean; message: string; data: ProductVariant }> => {
    const res = await api.put(`/variants/${id}`, payload);
    return res.data;
  },

  delete: async (id: string): Promise<{ success: boolean; message: string }> => {
    const res = await api.delete(`/variants/${id}`);
    return res.data;
  },
};
