import api from './api';

export interface Review {
  id: string;
  _id: string;
  productId: { _id: string; name: string; slug: string; images: string[] };
  userId: { _id: string; fullName: string; email: string };
  rating: number;
  title: string;
  comment: string;
  status: 'APPROVED' | 'PENDING' | 'FLAGGED';
  createdAt: string;
}

export const reviewService = {
  getReviews: async (params?: { productId?: string; status?: string }): Promise<{ success: boolean; data: Review[] }> => {
    const res = await api.get('/reviews', { params });
    return res.data;
  },

  createReview: async (payload: {
    productId: string;
    rating: number;
    title: string;
    comment: string;
  }): Promise<{ success: boolean; message: string; data: Review }> => {
    const res = await api.post('/reviews', payload);
    return res.data;
  },

  updateStatus: async (
    id: string,
    status: 'APPROVED' | 'PENDING' | 'FLAGGED'
  ): Promise<{ success: boolean; message: string; data: Review }> => {
    const res = await api.patch(`/reviews/${id}/status`, { status });
    return res.data;
  },

  deleteReview: async (id: string): Promise<{ success: boolean; message: string }> => {
    const res = await api.delete(`/reviews/${id}`);
    return res.data;
  },
};
