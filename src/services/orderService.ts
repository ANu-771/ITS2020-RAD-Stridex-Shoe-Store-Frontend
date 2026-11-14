import api from './api';

export interface OrderItem {
  productId: string | { _id: string; name: string; slug: string; images: string[] };
  variantId: string | { _id: string; SKU: string };
  name: string;
  image: string;
  size: number | string;
  color: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

export interface CustomerDetails {
  fullName: string;
  phone: string;
  email: string;
  deliveryAddress: string;
  city: string;
  postalCode: string;
  deliveryNotes?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  customerDetails: CustomerDetails;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  finalTotal: number;
  paymentMethod: 'CASH_ON_DELIVERY' | 'ONLINE_CARD' | 'BANK_TRANSFER';
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED';
  orderStatus: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderPayload {
  customerDetails: CustomerDetails;
  items?: Array<{
    productId: string;
    variantId?: string;
    size: number | string;
    color: string;
    quantity: number;
  }>;
  paymentMethod?: 'CASH_ON_DELIVERY' | 'ONLINE_CARD' | 'BANK_TRANSFER';
}

export const orderService = {
  createOrder: async (payload: CreateOrderPayload): Promise<{ success: boolean; message: string; data: Order }> => {
    const res = await api.post('/orders', payload);
    return res.data;
  },

  getMyOrders: async (): Promise<{ success: boolean; data: Order[] }> => {
    const res = await api.get('/orders');
    return res.data;
  },

  getOrderById: async (id: string): Promise<{ success: boolean; data: Order }> => {
    const res = await api.get(`/orders/${id}`);
    return res.data;
  },
};
