import api from './api';
import type { Product, PaginatedResponse, ProductGender } from '../types';

export interface ProductQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  brand?: string;
  category?: string;
  gender?: ProductGender | string;
  featured?: boolean;
  active?: boolean;
  minPrice?: number;
  maxPrice?: number;
  size?: number | string;
  color?: string;
  sort?: 'newest' | 'oldest' | 'price_asc' | 'price_desc' | 'name_asc';
}

export interface ProductPayload {
  name: string;
  description: string;
  brandId: string;
  categoryId: string;
  basePrice: number; // In LKR
  discountPrice?: number; // In LKR
  images?: string[];
  gender?: ProductGender;
  material?: string;
  isFeatured?: boolean;
  isActive?: boolean;
  variants?: Array<{
    size: number | string;
    color: string;
    stockQuantity: number;
    SKU?: string;
  }>;
}

export const productService = {
  getAll: async (params?: ProductQueryParams): Promise<PaginatedResponse<Product>> => {
    const res = await api.get<PaginatedResponse<Product>>('/products', { params });
    return res.data;
  },

  getById: async (id: string): Promise<{ success: boolean; data: Product }> => {
    const res = await api.get(`/products/${id}`);
    return res.data;
  },

  create: async (payload: ProductPayload): Promise<{ success: boolean; message: string; data: Product }> => {
    const res = await api.post('/products', payload);
    return res.data;
  },

  update: async (id: string, payload: Partial<ProductPayload>): Promise<{ success: boolean; message: string; data: Product }> => {
    const res = await api.put(`/products/${id}`, payload);
    return res.data;
  },

  delete: async (id: string): Promise<{ success: boolean; message: string }> => {
    const res = await api.delete(`/products/${id}`);
    return res.data;
  },
};
