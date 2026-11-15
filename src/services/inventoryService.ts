import api from './api';

export type StockMovementType =
  | 'STOCK_IN'
  | 'STOCK_OUT'
  | 'DAMAGED'
  | 'ADJUSTMENT'
  | 'ORDER_FULFILLMENT'
  | 'ORDER_CANCELLATION';

export interface StockMovement {
  id: string;
  productId: { _id: string; name: string; slug: string; images: string[] };
  variantId: { _id: string; SKU: string; size: number | string; color: string; minStockThreshold: number };
  movementType: StockMovementType;
  previousQuantity: number;
  changedQuantity: number;
  newQuantity: number;
  reason: string;
  performedBy: { _id: string; fullName: string; email: string; role: string };
  createdAt: string;
}

export interface InventoryDashboardStats {
  totalVariants: number;
  availableStock: number;
  lowStockCount: number;
  outOfStockCount: number;
  totalStockValueLKR: number;
  recentMovements: StockMovement[];
}

export interface InventoryVariantItem {
  id: string;
  _id: string;
  productId: { _id: string; name: string; slug: string; basePrice: number; images: string[] };
  SKU: string;
  size: number | string;
  color: string;
  stockQuantity: number;
  reservedQuantity: number;
  minStockThreshold: number;
  effectiveThreshold: number;
  stockStatus: 'HEALTHY' | 'LOW_STOCK' | 'OUT_OF_STOCK';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StockAdjustmentPayload {
  variantId: string;
  movementType: 'STOCK_IN' | 'STOCK_OUT' | 'DAMAGED' | 'ADJUSTMENT';
  quantity: number;
  reason: string;
}

export const inventoryService = {
  getDashboardStats: async (): Promise<{ success: boolean; data: InventoryDashboardStats }> => {
    const res = await api.get('/inventory/dashboard');
    return res.data;
  },

  getVariants: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }): Promise<{
    success: boolean;
    data: InventoryVariantItem[];
    pagination: { page: number; limit: number; totalItems: number; totalPages: number };
  }> => {
    const res = await api.get('/inventory/variants', { params });
    return res.data;
  },

  adjustStock: async (
    payload: StockAdjustmentPayload
  ): Promise<{ success: boolean; message: string; data: { variant: any; movement: StockMovement } }> => {
    const res = await api.post('/inventory/adjust', payload);
    return res.data;
  },

  updateThreshold: async (
    variantId: string,
    minStockThreshold: number
  ): Promise<{ success: boolean; message: string; data: any }> => {
    const res = await api.patch(`/inventory/variants/${variantId}/threshold`, { minStockThreshold });
    return res.data;
  },

  getMovements: async (params?: {
    page?: number;
    limit?: number;
    type?: string;
  }): Promise<{
    success: boolean;
    data: StockMovement[];
    pagination: { page: number; limit: number; totalItems: number; totalPages: number };
  }> => {
    const res = await api.get('/inventory/movements', { params });
    return res.data;
  },

  getLowStockReport: async (): Promise<{
    success: boolean;
    data: Array<InventoryVariantItem & { severity: 'LOW_STOCK' | 'OUT_OF_STOCK' }>;
    total: number;
  }> => {
    const res = await api.get('/inventory/low-stock-report');
    return res.data;
  },
};
