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

export interface OrderTimeline {
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  timestamp: string;
  title: string;
  description: string;
}

export interface PaymentDetails {
  transactionId?: string;
  paidAt?: string;
  simulatedStatus?: string;
  note?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string | { _id: string; fullName: string; email: string };
  customerDetails: CustomerDetails;
  deliveryAddress?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  totalAmount?: number;
  finalTotal: number;
  voucherDiscount?: number;
  voucherCode?: string;
  paymentMethod: 'CASH_ON_DELIVERY' | 'ONLINE_CARD' | 'BANK_TRANSFER';
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  orderStatus: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  stockRestored?: boolean;
  cancelledAt?: string;
  cancellationReason?: string;
  paymentDetails?: PaymentDetails;
  trackingTimeline?: OrderTimeline[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderSummaryMetrics {
  totalOrders: number;
  totalRevenue: number;
  pendingCount: number;
  confirmedCount: number;
  processingCount: number;
  shippedCount: number;
  deliveredCount: number;
  cancelledCount: number;
  codPendingCount: number;
}

export interface AdminOrdersResponse {
  success: boolean;
  data: Order[];
  summary: OrderSummaryMetrics;
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
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
  voucherCode?: string;
  paymentMethod?: 'CASH_ON_DELIVERY' | 'ONLINE_CARD' | 'BANK_TRANSFER';
}

export interface UpdateOrderStatusPayload {
  orderStatus: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  note?: string;
}

export interface UpdatePaymentStatusPayload {
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  note?: string;
}

export interface AdminOrdersParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  paymentStatus?: string;
  paymentMethod?: string;
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

  cancelOrder: async (
    orderId: string,
    reason?: string
  ): Promise<{ success: boolean; message: string; data: Order }> => {
    const res = await api.post(`/orders/${orderId}/cancel`, { reason });
    return res.data;
  },

  getAllOrdersAdmin: async (params?: AdminOrdersParams): Promise<AdminOrdersResponse> => {
    const res = await api.get('/orders/admin/all', { params });
    return res.data;
  },

  updateOrderStatusAdmin: async (
    orderId: string,
    payload: UpdateOrderStatusPayload
  ): Promise<{ success: boolean; message: string; data: Order }> => {
    const res = await api.patch(`/orders/${orderId}/status`, payload);
    return res.data;
  },

  updatePaymentStatusAdmin: async (
    orderId: string,
    payload: UpdatePaymentStatusPayload
  ): Promise<{ success: boolean; message: string; data: Order }> => {
    const res = await api.patch(`/orders/${orderId}/payment-status`, payload);
    return res.data;
  },
};
