import api from './api';

export interface Coupon {
  id: string;
  _id: string;
  code: string;
  description?: string;
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT';
  discountValue: number;
  minOrderAmount: number;
  maxDiscountAmount?: number;
  startDate: string;
  endDate: string;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
  createdAt: string;
}

export interface CouponPayload {
  code: string;
  description?: string;
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT';
  discountValue: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  startDate?: string;
  endDate: string;
  usageLimit?: number;
  isActive?: boolean;
}

export const couponService = {
  getAll: async (): Promise<{ success: boolean; data: Coupon[] }> => {
    const res = await api.get('/coupons');
    return res.data;
  },

  create: async (payload: CouponPayload): Promise<{ success: boolean; message: string; data: Coupon }> => {
    const res = await api.post('/coupons', payload);
    return res.data;
  },

  update: async (id: string, payload: Partial<CouponPayload>): Promise<{ success: boolean; message: string; data: Coupon }> => {
    const res = await api.put(`/coupons/${id}`, payload);
    return res.data;
  },

  delete: async (id: string): Promise<{ success: boolean; message: string }> => {
    const res = await api.delete(`/coupons/${id}`);
    return res.data;
  },

  validate: async (code: string, orderAmount: number): Promise<{
    success: boolean;
    message: string;
    data: {
      code: string;
      discountType: string;
      discountValue: number;
      discountAmount: number;
      finalAmount: number;
    };
  }> => {
    const res = await api.post('/coupons/validate', { code, orderAmount });
    return res.data;
  },
};
