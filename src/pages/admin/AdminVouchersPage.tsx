import { useState, useEffect } from 'react';
import type { FC } from 'react';
import {
  Gift,
  Search,
  CheckCircle2,
  Clock,
  Eye,
  Ban,
  X,
  Copy,
  Receipt,
  RefreshCw,
} from 'lucide-react';
import { giftVoucherService } from '../../services/giftVoucherService';
import type {
  GiftVoucher,
  AdminVouchersMetrics,
  VoucherRedemptionRecord,
} from '../../services/giftVoucherService';
import { formatLKR } from '../../utils/currency';
import { useToast } from '../../context/ToastContext';
import Swal from 'sweetalert2';

export const AdminVouchersPage: FC = () => {
  const { showToast } = useToast();
  const [vouchers, setVouchers] = useState<GiftVoucher[]>([]);
  const [metrics, setMetrics] = useState<AdminVouchersMetrics | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filters & Pagination
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>('ALL');
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Modals
  const [verifyModalVoucher, setVerifyModalVoucher] = useState<GiftVoucher | null>(null);
  const [adminNotes, setAdminNotes] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  const [detailsModalVoucher, setDetailsModalVoucher] = useState<GiftVoucher | null>(null);
  const [redemptions, setRedemptions] = useState<VoucherRedemptionRecord[]>([]);
  const [isLoadingRedemptions, setIsLoadingRedemptions] = useState<boolean>(false);

  const [revokeModalVoucher, setRevokeModalVoucher] = useState<GiftVoucher | null>(null);
  const [revocationReason, setRevocationReason] = useState<string>('');
  const [isRevoking, setIsRevoking] = useState<boolean>(false);

  const fetchVouchers = async () => {
    setIsLoading(true);
    try {
      const res = await giftVoucherService.getAdminVouchers({
        search: search.trim() || undefined,
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
        paymentStatus: paymentStatusFilter !== 'ALL' ? paymentStatusFilter : undefined,
        page,
        limit: 15,
      });

      if (res.success && res.data) {
        setVouchers(res.data.vouchers);
        setMetrics(res.data.metrics);
        setTotalPages(res.data.pagination.totalPages || 1);
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to fetch vouchers', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, [search, statusFilter, paymentStatusFilter, page]);

  // Open Verify Modal
  const handleOpenVerify = (voucher: GiftVoucher) => {
    setVerifyModalVoucher(voucher);
    setAdminNotes('Bank transfer verified against corporate bank statement');
  };

  // Submit Verification & Code Generation
  const handleConfirmVerify = async () => {
    if (!verifyModalVoucher) return;
    setIsVerifying(true);
    try {
      const res = await giftVoucherService.verifyPaymentAndIssue(
        verifyModalVoucher._id,
        adminNotes.trim()
      );
      if (res.success) {
        setVerifyModalVoucher(null);
        await Swal.fire({
          title: 'Voucher Code Issued!',
          html: `
            <div style="font-size: 14px; color: #718078; line-height: 1.6; text-align: center;">
              <p>Payment has been verified successfully.</p>
              <div style="margin: 16px 0; padding: 12px; background: #F2FAF4; border: 1px dashed #72C98A; border-radius: 12px;">
                <p style="font-size: 11px; text-transform: uppercase; color: #718078; font-weight: 700;">Unique Digital Code</p>
                <p style="font-family: monospace; font-size: 18px; font-weight: 800; color: #26352D; letter-spacing: 1px;">
                  ${res.data.code}
                </p>
              </div>
              <p style="font-size: 12px;">The voucher is now <strong>ACTIVE</strong> and available in the customer's account for immediate redemption.</p>
            </div>
          `,
          icon: 'success',
          confirmButtonText: 'Done',
          confirmButtonColor: '#72C98A',
        });
        fetchVouchers();
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to verify payment', 'error');
    } finally {
      setIsVerifying(false);
    }
  };

  // Open Details Modal & Load Redemptions
  const handleOpenDetails = async (voucher: GiftVoucher) => {
    setDetailsModalVoucher(voucher);
    setIsLoadingRedemptions(true);
    try {
      const res = await giftVoucherService.getVoucherRedemptions(voucher._id);
      if (res.success) {
        setRedemptions(res.data || []);
      }
    } catch {
      setRedemptions([]);
    } finally {
      setIsLoadingRedemptions(false);
    }
  };

  // Open Revoke Modal
  const handleOpenRevoke = (voucher: GiftVoucher) => {
    setRevokeModalVoucher(voucher);
    setRevocationReason('Administrative cancellation / customer refund');
  };

  // Submit Revocation
  const handleConfirmRevoke = async () => {
    if (!revokeModalVoucher || !revocationReason.trim()) {
      showToast('Please provide a reason for revocation', 'error');
      return;
    }
    setIsRevoking(true);
    try {
      const res = await giftVoucherService.revokeVoucher(
        revokeModalVoucher._id,
        revocationReason.trim()
      );
      if (res.success) {
        showToast('Voucher revoked successfully', 'success');
        setRevokeModalVoucher(null);
        fetchVouchers();
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to revoke voucher', 'error');
    } finally {
      setIsRevoking(false);
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    showToast(`Voucher code ${code} copied to clipboard!`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-outfit text-2xl font-bold text-[#26352D] flex items-center space-x-2">
            <Gift className="w-6 h-6 text-[#72C98A]" />
            <span>Digital Gift Voucher Management</span>
          </h2>
          <p className="text-xs text-[#718078]">
            Verify bank deposits, issue secure voucher codes, and track customer redemption history.
          </p>
        </div>
        <button
          onClick={fetchVouchers}
          disabled={isLoading}
          className="px-4 py-2 rounded-xl border border-[#DCEBE0] bg-white hover:bg-[#F2FAF4] text-[#26352D] text-xs font-semibold flex items-center space-x-2 cursor-pointer transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* KPI Cards */}
      {metrics && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-[#DCEBE0] shadow-sm">
            <span className="text-[11px] font-semibold text-[#718078]">Total Purchases</span>
            <p className="font-outfit font-extrabold text-2xl text-[#26352D] mt-1">
              {metrics.totalPurchases}
            </p>
            <span className="text-[10px] text-[#718078]">
              Val: {formatLKR(metrics.totalIssuedValue)}
            </span>
          </div>

          <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200 shadow-sm">
            <span className="text-[11px] font-bold text-amber-700 flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Pending Verification</span>
            </span>
            <p className="font-outfit font-extrabold text-2xl text-amber-900 mt-1">
              {metrics.pendingVerification}
            </p>
            <span className="text-[10px] text-amber-700">Awaiting bank check</span>
          </div>

          <div className="bg-[#F2FAF4] p-4 rounded-2xl border border-[#72C98A]/30 shadow-sm">
            <span className="text-[11px] font-bold text-[#72C98A] flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Active / Issued</span>
            </span>
            <p className="font-outfit font-extrabold text-2xl text-[#26352D] mt-1">
              {metrics.issuedActive}
            </p>
            <span className="text-[10px] text-[#718078]">
              Rem: {formatLKR(metrics.totalRemainingBalance)}
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#DCEBE0] shadow-sm">
            <span className="text-[11px] font-semibold text-[#718078]">Fully Redeemed</span>
            <p className="font-outfit font-extrabold text-2xl text-[#26352D] mt-1">
              {metrics.fullyRedeemed}
            </p>
            <span className="text-[10px] text-[#718078]">Used in orders</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#DCEBE0] shadow-sm">
            <span className="text-[11px] font-semibold text-[#718078]">Expired / Revoked</span>
            <p className="font-outfit font-extrabold text-2xl text-red-600 mt-1">
              {metrics.revokedOrExpired}
            </p>
            <span className="text-[10px] text-[#718078]">Inactive vouchers</span>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#DCEBE0] shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-[#718078] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search code, recipient, email or bank ref..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#DCEBE0] text-xs focus:outline-none focus:border-[#72C98A]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 rounded-xl border border-[#DCEBE0] bg-white text-xs text-[#26352D] focus:outline-none focus:border-[#72C98A]"
          >
            <option value="ALL">All Voucher Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="ACTIVE">Active</option>
            <option value="USED">Used</option>
            <option value="EXPIRED">Expired</option>
            <option value="REVOKED">Revoked</option>
          </select>

          {/* Payment Status Filter */}
          <select
            value={paymentStatusFilter}
            onChange={(e) => {
              setPaymentStatusFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 rounded-xl border border-[#DCEBE0] bg-white text-xs text-[#26352D] focus:outline-none focus:border-[#72C98A]"
          >
            <option value="ALL">All Payment Statuses</option>
            <option value="PENDING">Payment Pending</option>
            <option value="PAID">Paid / Verified</option>
            <option value="FAILED">Failed</option>
          </select>
        </div>
      </div>

      {/* Vouchers Table */}
      <div className="bg-white rounded-2xl border border-[#DCEBE0] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F2FAF4] text-[#718078] font-bold border-b border-[#DCEBE0]">
              <tr>
                <th className="p-4">Voucher Code / Ref</th>
                <th className="p-4">Purchaser</th>
                <th className="p-4">Recipient</th>
                <th className="p-4">Value / Balance</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Status</th>
                <th className="p-4">Purchase Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCEBE0]">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-[#718078]">
                    <div className="inline-flex items-center space-x-2">
                      <Clock className="w-4 h-4 animate-spin text-[#72C98A]" />
                      <span>Loading gift vouchers...</span>
                    </div>
                  </td>
                </tr>
              ) : vouchers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-[#718078]">
                    No digital gift vouchers found matching current filters.
                  </td>
                </tr>
              ) : (
                vouchers.map((v) => {
                  const purchaserName =
                    typeof v.purchaserId === 'object' && v.purchaserId?.fullName
                      ? v.purchaserId.fullName
                      : 'Customer';
                  const purchaserEmail =
                    typeof v.purchaserId === 'object' && v.purchaserId?.email
                      ? v.purchaserId.email
                      : '';

                  return (
                    <tr key={v._id} className="hover:bg-[#F2FAF4]/50 transition-colors">
                      {/* Code / Ref */}
                      <td className="p-4">
                        {v.code ? (
                          <div className="flex items-center space-x-1.5">
                            <span className="font-mono font-bold text-[#26352D] bg-[#F2FAF4] px-2 py-0.5 rounded border border-[#DCEBE0]">
                              {v.code}
                            </span>
                            <button
                              onClick={() => copyCode(v.code!)}
                              title="Copy code"
                              className="text-[#718078] hover:text-[#72C98A] cursor-pointer"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div>
                            <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                              Pending Code Issuance
                            </span>
                            {v.bankTransferReference && (
                              <p className="text-[10px] text-[#718078] mt-1 font-mono">
                                Ref: {v.bankTransferReference}
                              </p>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Purchaser */}
                      <td className="p-4">
                        <p className="font-bold text-[#26352D]">{purchaserName}</p>
                        <p className="text-[11px] text-[#718078]">{purchaserEmail}</p>
                      </td>

                      {/* Recipient */}
                      <td className="p-4">
                        <p className="font-bold text-[#26352D]">{v.recipientName}</p>
                        <p className="text-[11px] text-[#718078]">{v.recipientEmail}</p>
                      </td>

                      {/* Value / Balance */}
                      <td className="p-4">
                        <p className="font-outfit font-extrabold text-[#26352D]">
                          {formatLKR(v.originalValue)}
                        </p>
                        {v.status === 'ACTIVE' && (
                          <p className="text-[11px] text-[#72C98A] font-semibold">
                            Balance: {formatLKR(v.remainingBalance)}
                          </p>
                        )}
                      </td>

                      {/* Payment Status */}
                      <td className="p-4">
                        {v.paymentStatus === 'PAID' ? (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#DDF3E2] text-[#26352D]">
                            <CheckCircle2 className="w-3 h-3 text-[#72C98A]" />
                            <span>Paid</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                            <Clock className="w-3 h-3" />
                            <span>Pending</span>
                          </span>
                        )}
                      </td>

                      {/* Voucher Status */}
                      <td className="p-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            v.status === 'ACTIVE'
                              ? 'bg-[#72C98A]/15 text-[#26352D] border border-[#72C98A]/40'
                              : v.status === 'USED'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : v.status === 'REVOKED'
                              ? 'bg-red-50 text-red-700 border border-red-200'
                              : v.status === 'EXPIRED'
                              ? 'bg-gray-100 text-gray-700 border border-gray-300'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {v.status}
                        </span>
                      </td>

                      {/* Purchase Date */}
                      <td className="p-4 text-[#718078]">
                        {new Date(v.createdAt).toLocaleDateString('en-LK', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          {/* If pending payment, show Verify & Issue button */}
                          {v.purchaseStatus === 'PENDING_PAYMENT' && (
                            <button
                              onClick={() => handleOpenVerify(v)}
                              className="px-3 py-1.5 rounded-xl bg-[#72C98A] hover:bg-[#59B976] text-white text-[11px] font-bold shadow-sm transition-all cursor-pointer flex items-center space-x-1"
                              title="Verify Bank Deposit & Issue Code"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Verify & Issue</span>
                            </button>
                          )}

                          {/* View details */}
                          <button
                            onClick={() => handleOpenDetails(v)}
                            className="p-1.5 rounded-lg border border-[#DCEBE0] bg-white hover:bg-[#F2FAF4] text-[#718078] hover:text-[#26352D] transition-colors cursor-pointer"
                            title="View Voucher Details & Redemptions"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Revoke (if active) */}
                          {v.status === 'ACTIVE' && (
                            <button
                              onClick={() => handleOpenRevoke(v)}
                              className="p-1.5 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 transition-colors cursor-pointer"
                              title="Revoke Voucher"
                            >
                              <Ban className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-[#DCEBE0] flex items-center justify-between text-xs text-[#718078]">
            <span>
              Page {page} of {totalPages}
            </span>
            <div className="flex space-x-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="px-3 py-1.5 rounded-lg border border-[#DCEBE0] disabled:opacity-40 cursor-pointer"
              >
                Previous
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="px-3 py-1.5 rounded-lg border border-[#DCEBE0] disabled:opacity-40 cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* 1. MODAL: VERIFY PAYMENT & ISSUE CODE */}
      {/* ========================================================= */}
      {verifyModalVoucher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-[#DCEBE0] shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-[#DCEBE0]">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-[#DDF3E2] text-[#72C98A] flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-outfit font-bold text-lg text-[#26352D]">
                    Verify Bank Payment & Issue Voucher
                  </h3>
                  <p className="text-xs text-[#718078]">
                    Generates a unique cryptographic voucher code (STRIDEX-XXXX)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setVerifyModalVoucher(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Voucher Details Snapshot */}
            <div className="p-4 rounded-2xl bg-[#F2FAF4] border border-[#DCEBE0] space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-[#718078]">Voucher Amount:</span>
                <span className="font-outfit font-extrabold text-base text-[#26352D]">
                  {formatLKR(verifyModalVoucher.originalValue)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#718078]">Recipient:</span>
                <span className="font-bold text-[#26352D]">
                  {verifyModalVoucher.recipientName} ({verifyModalVoucher.recipientEmail})
                </span>
              </div>
              {verifyModalVoucher.bankTransferReference && (
                <div className="flex justify-between items-center">
                  <span className="text-[#718078]">Deposit Reference:</span>
                  <span className="font-mono font-bold text-[#26352D]">
                    {verifyModalVoucher.bankTransferReference}
                  </span>
                </div>
              )}
            </div>

            {/* Admin Notes */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#26352D]">Admin Verification Notes</label>
              <input
                type="text"
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="e.g. Deposit verified against Commercial Bank statement #9401"
                className="w-full px-4 py-2.5 rounded-xl border border-[#DCEBE0] text-xs focus:outline-none focus:border-[#72C98A]"
              />
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setVerifyModalVoucher(null)}
                className="px-4 py-2.5 rounded-xl border border-[#DCEBE0] text-xs font-semibold text-[#718078] hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isVerifying}
                onClick={handleConfirmVerify}
                className="px-6 py-2.5 rounded-xl bg-[#72C98A] hover:bg-[#59B976] disabled:bg-gray-300 text-white text-xs font-bold shadow-md cursor-pointer flex items-center space-x-2"
              >
                {isVerifying ? (
                  <>
                    <Clock className="w-4 h-4 animate-spin" />
                    <span>Generating Code...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm & Issue Voucher</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. MODAL: DETAILS & REDEMPTION HISTORY */}
      {/* ========================================================= */}
      {detailsModalVoucher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-[#DCEBE0] shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b border-[#DCEBE0]">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-[#DDF3E2] text-[#72C98A] flex items-center justify-center">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-outfit font-bold text-lg text-[#26352D]">
                    Voucher Audit & Redemption History
                  </h3>
                  <p className="text-xs text-[#718078]">ID: {detailsModalVoucher._id}</p>
                </div>
              </div>
              <button
                onClick={() => setDetailsModalVoucher(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Voucher Snapshot Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-[#F2FAF4] rounded-xl border border-[#DCEBE0]">
                <span className="text-[#718078] text-[10px]">Voucher Code</span>
                <p className="font-mono font-bold text-[#26352D] mt-0.5">
                  {detailsModalVoucher.code || 'None'}
                </p>
              </div>
              <div className="p-3 bg-[#F2FAF4] rounded-xl border border-[#DCEBE0]">
                <span className="text-[#718078] text-[10px]">Original Value</span>
                <p className="font-outfit font-extrabold text-[#26352D] mt-0.5">
                  {formatLKR(detailsModalVoucher.originalValue)}
                </p>
              </div>
              <div className="p-3 bg-[#F2FAF4] rounded-xl border border-[#DCEBE0]">
                <span className="text-[#718078] text-[10px]">Remaining Balance</span>
                <p className="font-outfit font-extrabold text-[#72C98A] mt-0.5">
                  {formatLKR(detailsModalVoucher.remainingBalance)}
                </p>
              </div>
              <div className="p-3 bg-[#F2FAF4] rounded-xl border border-[#DCEBE0]">
                <span className="text-[#718078] text-[10px]">Current Status</span>
                <p className="font-bold text-[#26352D] uppercase mt-0.5">
                  {detailsModalVoucher.status}
                </p>
              </div>
            </div>

            {/* Recipient & Message */}
            <div className="p-4 bg-gray-50 rounded-2xl border border-[#DCEBE0] space-y-2 text-xs">
              <p>
                <strong>Recipient:</strong> {detailsModalVoucher.recipientName} (
                {detailsModalVoucher.recipientEmail})
              </p>
              {detailsModalVoucher.personalMessage && (
                <p>
                  <strong>Personal Message:</strong> <em>"{detailsModalVoucher.personalMessage}"</em>
                </p>
              )}
              {detailsModalVoucher.adminNotes && (
                <p>
                  <strong>Admin Notes:</strong> {detailsModalVoucher.adminNotes}
                </p>
              )}
            </div>

            {/* Redemption History Table */}
            <div className="space-y-3">
              <h4 className="font-outfit font-bold text-sm text-[#26352D]">
                Redemption Ledger ({redemptions.length} orders)
              </h4>
              {isLoadingRedemptions ? (
                <p className="text-xs text-[#718078]">Loading redemptions...</p>
              ) : redemptions.length === 0 ? (
                <p className="text-xs text-[#718078] italic">
                  This voucher has not yet been redeemed in any shoe orders.
                </p>
              ) : (
                <div className="border border-[#DCEBE0] rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#F2FAF4] text-[#718078] font-bold">
                      <tr>
                        <th className="p-3">Order Number</th>
                        <th className="p-3">Customer</th>
                        <th className="p-3">Amount Redeemed</th>
                        <th className="p-3">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#DCEBE0]">
                      {redemptions.map((r) => (
                        <tr key={r._id}>
                          <td className="p-3 font-mono font-bold text-[#26352D]">
                            {r.orderId?.orderNumber || 'STX-ORDER'}
                          </td>
                          <td className="p-3 text-[#26352D]">
                            {r.customerId?.fullName || 'Customer'}
                          </td>
                          <td className="p-3 font-outfit font-bold text-[#72C98A]">
                            {formatLKR(r.amountRedeemed)}
                          </td>
                          <td className="p-3 text-[#718078]">
                            {new Date(r.redeemedAt).toLocaleDateString('en-LK', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setDetailsModalVoucher(null)}
                className="px-6 py-2.5 rounded-xl bg-[#26352D] text-white text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. MODAL: REVOKE VOUCHER */}
      {/* ========================================================= */}
      {revokeModalVoucher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full border border-red-200 shadow-2xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
                <Ban className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-outfit font-bold text-lg text-[#26352D]">Revoke Gift Voucher</h3>
                <p className="text-xs text-[#718078] font-mono">{revokeModalVoucher.code}</p>
              </div>
            </div>

            <p className="text-xs text-[#718078] leading-relaxed">
              Revoking this voucher will immediately deactivate it, preventing any further checkout redemption.
            </p>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#26352D]">Reason for Revocation *</label>
              <textarea
                rows={3}
                value={revocationReason}
                onChange={(e) => setRevocationReason(e.target.value)}
                placeholder="e.g. Chargeback, customer refund, or administrative cancellation"
                className="w-full px-3 py-2 rounded-xl border border-[#DCEBE0] text-xs focus:outline-none focus:border-red-400"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setRevokeModalVoucher(null)}
                className="px-4 py-2 rounded-xl border border-[#DCEBE0] text-xs font-semibold text-[#718078]"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isRevoking || !revocationReason.trim()}
                onClick={handleConfirmRevoke}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white text-xs font-bold shadow-md cursor-pointer"
              >
                {isRevoking ? 'Revoking...' : 'Confirm Revoke'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
