import api from './api';

export interface CartServerItem {
  id: string;
  itemId?: string;
  productId: string;
  variantId: string;
  name: string;
  slug: string;
  image: string;
  brandName: string;
  size: number | string;
  color: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  maxStock: number;
  totalPrice: number;
  isAvailable: boolean;
}

export interface CartSummary {
  items: CartServerItem[];
  subtotal: number;
  deliveryFee: number;
  finalTotal: number;
  freeShippingThreshold: number;
  qualifiesForFreeShipping: boolean;
}

export interface AddToCartPayload {
  productId: string;
  variantId?: string;
  size: number | string;
  color: string;
  quantity: number;
}

export const cartService = {
  getCart: async (): Promise<{ success: boolean; data: CartSummary }> => {
    const res = await api.get('/cart');
    return res.data;
  },

  addItem: async (payload: AddToCartPayload): Promise<{ success: boolean; message: string; data: CartSummary }> => {
    const res = await api.post('/cart/items', payload);
    return res.data;
  },

  updateQuantity: async (itemId: string, quantity: number): Promise<{ success: boolean; message: string; data: CartSummary }> => {
    const res = await api.put(`/cart/items/${itemId}`, { quantity });
    return res.data;
  },

  removeItem: async (itemId: string): Promise<{ success: boolean; message: string; data: CartSummary }> => {
    const res = await api.delete(`/cart/items/${itemId}`);
    return res.data;
  },

  clearCart: async (): Promise<{ success: boolean; message: string; data: CartSummary }> => {
    const res = await api.delete('/cart');
    return res.data;
  },

  syncCart: async (items: AddToCartPayload[]): Promise<{ success: boolean; message: string; data: CartSummary }> => {
    const res = await api.post('/cart/sync', { items });
    return res.data;
  },
};
