import api from './api';

export interface MonthlySalesPoint {
  month: string;
  orders: number;
  revenue: number;
}

export interface LowStockAlertItem {
  variantId: string;
  productName: string;
  image: string;
  SKU: string;
  size: number | string;
  color: string;
  stockQuantity: number;
  threshold: number;
  severity: 'LOW_STOCK' | 'OUT_OF_STOCK';
}

export interface AdminDashboardMetrics {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  monthlySales: MonthlySalesPoint[];
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    customerName: string;
    date: string;
    finalTotal: number;
    paymentStatus: string;
    orderStatus: string;
    itemsCount: number;
  }>;
  topSellingShoes: Array<{
    name: string;
    image: string;
    pairsSold: number;
    revenue: number;
  }>;
  lowStockAlerts: LowStockAlertItem[];
}

export interface AdminCustomerItem {
  id: string;
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: string;
  ordersCount: number;
  totalSpent: number;
  lastOrderDate?: string;
  createdAt: string;
}

export const adminDashboardService = {
  getStats: async (): Promise<{ success: boolean; data: AdminDashboardMetrics }> => {
    const res = await api.get('/admin/dashboard/stats');
    return res.data;
  },

  getCustomers: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<{
    success: boolean;
    data: AdminCustomerItem[];
    pagination: { page: number; limit: number; totalItems: number; totalPages: number };
  }> => {
    const res = await api.get('/admin/customers', { params });
    return res.data;
  },

  getSalesReport: async (): Promise<{
    success: boolean;
    data: {
      totalSalesRevenue: number;
      totalOrders: number;
      totalPairsSold: number;
      averageOrderValue: number;
    };
  }> => {
    const res = await api.get('/admin/reports/sales');
    return res.data;
  },

  getInventoryValuation: async (): Promise<{
    success: boolean;
    data: {
      totalUnits: number;
      totalValuation: number;
      activeVariantsCount: number;
    };
  }> => {
    const res = await api.get('/admin/reports/inventory-valuation');
    return res.data;
  },
};
