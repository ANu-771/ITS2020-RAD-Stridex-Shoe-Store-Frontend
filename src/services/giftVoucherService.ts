import api from './api';

export type VoucherPurchaseStatus = 'PENDING_PAYMENT' | 'COMPLETED' | 'CANCELLED';
export type VoucherPaymentStatus = 'PENDING' | 'PAID' | 'FAILED';
export type VoucherStatus = 'PENDING' | 'ACTIVE' | 'USED' | 'EXPIRED' | 'REVOKED';

export interface GiftVoucher {
  _id: string;
  code?: string;
  originalValue: number;
  remainingBalance: number;
  purchaserId: {
    _id: string;
    fullName: string;
    email: string;
    phone?: string;
  } | string;
  recipientName: string;
  recipientEmail: string;
  personalMessage?: string;
  purchaseStatus: VoucherPurchaseStatus;
  paymentStatus: VoucherPaymentStatus;
  paymentMethod: 'BANK_TRANSFER';
  bankTransferReference?: string;
  status: VoucherStatus;
  issuedAt?: string;
  expiresAt?: string;
  revokedAt?: string;
  revocationReason?: string;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface VoucherRedemptionRecord {
  _id: string;
  voucherId: string;
  customerId: {
    _id: string;
    fullName: string;
    email: string;
  };
  orderId: {
    _id: string;
    orderNumber: string;
    finalTotal: number;
    createdAt: string;
  };
  amountRedeemed: number;
  redeemedAt: string;
}

export interface VoucherPurchasePayload {
  amount: number;
  recipientName: string;
  recipientEmail: string;
  personalMessage?: string;
  paymentMethod: 'BANK_TRANSFER' | 'CASH_ON_DELIVERY' | 'ONLINE_CARD';
  bankTransferReference?: string;
}

export interface VoucherValidateResult {
  valid: boolean;
  voucherId: string;
  code: string;
  originalValue: number;
  remainingBalance: number;
  applicableDiscount: number;
  remainingPayable: number;
  newVoucherBalanceAfterRedemption: number;
  recipientName: string;
  expiresAt?: string;
}

export interface BankPaymentInstructions {
  commercialBank: {
    bankName: string;
    accountNumber: string;
    accountName: string;
    branch: string;
  };
  hnb: {
    bankName: string;
    accountNumber: string;
    accountName: string;
    branch: string;
  };
  note: string;
}

export interface CustomerVouchersResponse {
  issuedVouchers: GiftVoucher[];
  pendingPurchases: GiftVoucher[];
  totalIssued: number;
  totalPending: number;
  bankInstructions: BankPaymentInstructions;
}

export interface AdminVouchersMetrics {
  totalPurchases: number;
  pendingVerification: number;
  issuedActive: number;
  fullyRedeemed: number;
  revokedOrExpired: number;
  totalIssuedValue: number;
  totalRedeemedValue: number;
  totalRemainingBalance: number;
}

export interface AdminVouchersResponse {
  vouchers: GiftVoucher[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
  metrics: AdminVouchersMetrics;
}

export interface AdminVouchersParams {
  status?: string;
  paymentStatus?: string;
  purchaseStatus?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export const giftVoucherService = {
  // Customer: Purchase voucher
  purchaseVoucher: async (payload: VoucherPurchasePayload) => {
    const res = await api.post<{ success: boolean; message: string; data: any }>(
      '/vouchers/purchase',
      payload
    );
    return res.data;
  },

  // Customer: Fetch customer's own vouchers
  getMyVouchers: async () => {
    const res = await api.get<{ success: boolean; data: CustomerVouchersResponse }>(
      '/vouchers/my-vouchers'
    );
    return res.data;
  },

  // Customer / Admin: Fetch single voucher
  getVoucherById: async (id: string) => {
    const res = await api.get<{
      success: boolean;
      data: { voucher: GiftVoucher; redemptions?: VoucherRedemptionRecord[]; bankInstructions?: BankPaymentInstructions };
    }>(`/vouchers/${id}`);
    return res.data;
  },

  // Public / Checkout: Validate voucher code against order subtotal
  validateVoucher: async (code: string, orderSubtotal?: number) => {
    const res = await api.post<{
      success: boolean;
      message: string;
      data: VoucherValidateResult;
    }>('/vouchers/validate', { code, orderSubtotal });
    return res.data;
  },

  // Admin: Fetch all vouchers with filters and metrics
  getAdminVouchers: async (params?: AdminVouchersParams) => {
    const res = await api.get<{ success: boolean; data: AdminVouchersResponse }>(
      '/vouchers',
      { params }
    );
    return res.data;
  },

  // Admin: Verify bank payment and issue active voucher code
  verifyPaymentAndIssue: async (id: string, adminNotes?: string) => {
    const res = await api.patch<{ success: boolean; message: string; data: GiftVoucher }>(
      `/vouchers/${id}/verify-payment`,
      { adminNotes }
    );
    return res.data;
  },

  // Admin: Revoke voucher
  revokeVoucher: async (id: string, reason: string) => {
    const res = await api.patch<{ success: boolean; message: string; data: GiftVoucher }>(
      `/vouchers/${id}/revoke`,
      { reason }
    );
    return res.data;
  },

  // Admin: Get redemption history
  getVoucherRedemptions: async (id: string) => {
    const res = await api.get<{ success: boolean; data: VoucherRedemptionRecord[] }>(
      `/vouchers/${id}/redemptions`
    );
    return res.data;
  },
};
