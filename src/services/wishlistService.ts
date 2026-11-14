import api from './api';
import type { Product } from '../types';

export const wishlistService = {
  getWishlist: async (): Promise<{ success: boolean; data: Product[] }> => {
    const res = await api.get('/wishlist');
    return res.data;
  },

  toggle: async (productId: string): Promise<{ success: boolean; message: string; isWishlisted: boolean; productId: string }> => {
    const res = await api.post('/wishlist/toggle', { productId });
    return res.data;
  },

  remove: async (productId: string): Promise<{ success: boolean; message: string; productId: string }> => {
    const res = await api.delete(`/wishlist/${productId}`);
    return res.data;
  },

  moveToCart: async (productId: string): Promise<{ success: boolean; message: string }> => {
    const res = await api.post(`/wishlist/${productId}/move-to-cart`);
    return res.data;
  },

  syncWishlist: async (productIds: string[]): Promise<{ success: boolean; message: string; totalItems: number }> => {
    const res = await api.post('/wishlist/sync', { productIds });
    return res.data;
  },
};
