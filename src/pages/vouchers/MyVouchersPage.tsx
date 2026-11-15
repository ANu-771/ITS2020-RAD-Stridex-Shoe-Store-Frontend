import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { Link } from 'react-router-dom';
import {
  Gift,
  Copy,
  CheckCircle2,
  Clock,
  ArrowRight,
  AlertCircle,
  ShoppingBag,
  Sparkles,
  Calendar,
  User,
  RefreshCw,
} from 'lucide-react';
import { giftVoucherService } from '../../services/giftVoucherService';
import type { GiftVoucher } from '../../services/giftVoucherService';
import { formatLKR } from '../../utils/currency';
import { useToast } from '../../context/ToastContext';

export const MyVouchersPage: FC = () => {
  const { showToast } = useToast();
  const [issuedVouchers, setIssuedVouchers] = useState<GiftVoucher[]>([]);
  const [pendingPurchases, setPendingPurchases] = useState<GiftVoucher[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const fetchVouchers = async () => {
    setIsLoading(true);
    try {
      const res = await giftVoucherService.getMyVouchers();
      if (res.success && res.data) {
        setIssuedVouchers(res.data.issuedVouchers || []);
        setPendingPurchases(res.data.pendingPurchases || []);
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to load your gift vouchers', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    showToast(`Voucher code ${code} copied to clipboard!`, 'success');
    setTimeout(() => {
      setCopiedCode(null);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#F2FAF4] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#DCEBE0] shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#DDF3E2] text-[#26352D] text-xs font-semibold">
              <Gift className="w-4 h-4 text-[#72C98A]" />
              <span>Digital Footwear Vouchers</span>
            </div>
            <h1 className="font-outfit text-3xl sm:text-4xl font-extrabold text-[#26352D]">
              My Gift Vouchers
            </h1>
            <p className="text-xs sm:text-sm text-[#718078] max-w-xl">
              Track your active STRIDEX voucher codes, check remaining balances, and view pending bank deposit verifications.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={fetchVouchers}
              disabled={isLoading}
              className="px-4 py-2.5 rounded-xl border border-[#DCEBE0] bg-[#F2FAF4] hover:bg-[#DDF3E2] text-[#26352D] text-xs font-semibold transition-colors flex items-center space-x-2 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            <Link
              to="/gift-vouchers"
              className="px-5 py-2.5 rounded-xl bg-[#72C98A] hover:bg-[#59B976] text-white text-xs font-bold shadow-sm transition-all flex items-center space-x-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Buy Gift Voucher</span>
            </Link>
          </div>
        </div>

        {/* ========================================================= */}
        {/* SECTION 1: ISSUED & ACTIVE DIGITAL VOUCHERS */}
        {/* ========================================================= */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-outfit text-xl font-bold text-[#26352D] flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-[#72C98A]" />
                <span>Issued Digital Vouchers ({issuedVouchers.length})</span>
              </h2>
              <p className="text-xs text-[#718078]">
                Active codes ready for redemption during checkout.
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="p-12 text-center text-[#718078] bg-white rounded-3xl border border-[#DCEBE0]">
              <RefreshCw className="w-6 h-6 animate-spin text-[#72C98A] mx-auto mb-2" />
              <p className="text-xs">Loading your vouchers...</p>
            </div>
          ) : issuedVouchers.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 border border-[#DCEBE0] text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#F2FAF4] text-[#718078] flex items-center justify-center mx-auto">
                <Gift className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="font-outfit font-bold text-lg text-[#26352D]">
                  No Issued Vouchers Yet
                </h3>
                <p className="text-xs text-[#718078] max-w-sm mx-auto">
                  You don't have any active digital gift vouchers. Purchase one online or redeem a gift sent to your account!
                </p>
              </div>
              <Link
                to="/gift-vouchers"
                className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-[#72C98A] hover:bg-[#59B976] text-white font-bold text-xs shadow-sm transition-all"
              >
                <span>Purchase Gift Voucher</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {issuedVouchers.map((v) => {
                const percentRemaining = Math.max(
                  0,
                  Math.min(100, Math.round((v.remainingBalance / v.originalValue) * 100))
                );

                return (
                  <div
                    key={v._id}
                    className="bg-white rounded-3xl border border-[#DCEBE0] shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col justify-between"
                  >
                    {/* Voucher Top Brand Strip */}
                    <div className="bg-gradient-to-r from-[#26352D] to-[#0B2D52] p-5 text-white flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Gift className="w-5 h-5 text-[#72C98A]" />
                        <span className="font-outfit font-extrabold text-sm tracking-wider">
                          STRIDEX E-VOUCHER
                        </span>
                      </div>
                      <span
                        className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full ${
                          v.status === 'ACTIVE'
                            ? 'bg-[#72C98A] text-white'
                            : v.status === 'USED'
                            ? 'bg-blue-500 text-white'
                            : 'bg-red-500 text-white'
                        }`}
                      >
                        {v.status}
                      </span>
                    </div>

                    {/* Voucher Body */}
                    <div className="p-6 space-y-5">
                      {/* Code Box with Copy Button */}
                      <div className="p-4 rounded-2xl bg-[#F2FAF4] border border-[#DCEBE0] flex items-center justify-between">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-[#718078] tracking-wider">
                            Voucher Code
                          </span>
                          <p className="font-mono font-extrabold text-lg sm:text-xl text-[#26352D] tracking-wider">
                            {v.code}
                          </p>
                        </div>
                        <button
                          onClick={() => handleCopyCode(v.code!)}
                          className="px-3.5 py-2 rounded-xl bg-white hover:bg-[#DDF3E2] border border-[#DCEBE0] text-xs font-bold text-[#26352D] flex items-center space-x-1.5 transition-colors cursor-pointer shadow-sm"
                          title="Copy Voucher Code"
                        >
                          {copiedCode === v.code ? (
                            <>
                              <CheckCircle2 className="w-4 h-4 text-[#72C98A]" />
                              <span className="text-[#72C98A]">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4 text-[#718078]" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Financial Balances */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-[11px] text-[#718078]">Original Value</span>
                          <p className="font-outfit font-extrabold text-lg text-[#26352D]">
                            {formatLKR(v.originalValue)}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-[11px] text-[#718078]">Remaining Balance</span>
                          <p className="font-outfit font-extrabold text-lg text-[#72C98A]">
                            {formatLKR(v.remainingBalance)}
                          </p>
                        </div>
                      </div>

                      {/* Balance Progress Meter */}
                      <div className="space-y-1">
                        <div className="w-full bg-[#F2FAF4] h-2 rounded-full overflow-hidden border border-[#DCEBE0]">
                          <div
                            className="bg-[#72C98A] h-full rounded-full transition-all duration-500"
                            style={{ width: `${percentRemaining}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[10px] text-[#718078]">
                          <span>{percentRemaining}% Available</span>
                          <span>{formatLKR(v.originalValue - v.remainingBalance)} Redeemed</span>
                        </div>
                      </div>

                      {/* Recipient & Metadata */}
                      <div className="pt-2 border-t border-[#DCEBE0] space-y-1 text-xs text-[#718078]">
                        <p className="flex items-center space-x-2">
                          <User className="w-3.5 h-3.5 text-[#72C98A]" />
                          <span>
                            Recipient: <strong className="text-[#26352D]">{v.recipientName}</strong> (
                            {v.recipientEmail})
                          </span>
                        </p>
                        {v.expiresAt && (
                          <p className="flex items-center space-x-2">
                            <Calendar className="w-3.5 h-3.5 text-[#72C98A]" />
                            <span>
                              Expires on:{' '}
                              <strong className="text-[#26352D]">
                                {new Date(v.expiresAt).toLocaleDateString('en-LK', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                })}
                              </strong>
                            </span>
                          </p>
                        )}
                        {v.personalMessage && (
                          <p className="text-[11px] italic text-[#718078] bg-[#F2FAF4] p-2 rounded-xl border border-[#DCEBE0] mt-2">
                            "{v.personalMessage}"
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Card Footer Action */}
                    {v.status === 'ACTIVE' && v.remainingBalance > 0 && (
                      <div className="p-4 bg-[#F2FAF4] border-t border-[#DCEBE0] flex items-center justify-between">
                        <span className="text-[11px] text-[#718078]">
                          Ready to use on any footwear order
                        </span>
                        <Link
                          to="/shop"
                          className="px-4 py-2 rounded-xl bg-[#72C98A] hover:bg-[#59B976] text-white text-xs font-bold transition-all flex items-center space-x-1.5 shadow-sm"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Redeem in Shop</span>
                        </Link>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ========================================================= */}
        {/* SECTION 2: PENDING BANK PAYMENT PURCHASES */}
        {/* ========================================================= */}
        {pendingPurchases.length > 0 && (
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-outfit text-xl font-bold text-[#26352D] flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-amber-600" />
                  <span>Pending Payment Purchases ({pendingPurchases.length})</span>
                </h2>
                <p className="text-xs text-[#718078]">
                  Vouchers awaiting bank deposit verification by our finance team.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold">Awaiting Bank Transfer Verification</p>
                <p className="leading-relaxed">
                  Your unique voucher code will be issued automatically and appear under "Issued Vouchers" once our team verifies your bank deposit. If you haven't deposited yet, please find the corporate bank accounts below.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingPurchases.map((p) => (
                <div
                  key={p._id}
                  className="bg-white rounded-2xl border border-amber-200 p-5 space-y-4 shadow-sm"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                        Verification Pending
                      </span>
                      <p className="font-outfit font-extrabold text-2xl text-[#26352D] mt-2">
                        {formatLKR(p.originalValue)}
                      </p>
                    </div>
                    <span className="text-[11px] text-[#718078]">
                      {new Date(p.createdAt).toLocaleDateString('en-LK', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs text-[#718078]">
                    <p>
                      <strong>Recipient:</strong> {p.recipientName} ({p.recipientEmail})
                    </p>
                    {p.bankTransferReference && (
                      <p>
                        <strong>Deposit Reference:</strong>{' '}
                        <span className="font-mono font-bold text-[#26352D]">
                          {p.bankTransferReference}
                        </span>
                      </p>
                    )}
                  </div>

                  {/* Wire info snippet */}
                  <div className="p-3 bg-[#F2FAF4] rounded-xl border border-[#DCEBE0] text-[11px] space-y-1">
                    <p className="font-bold text-[#26352D]">Direct Deposit Accounts:</p>
                    <p className="text-[#718078]">
                      • Commercial Bank: <strong className="font-mono text-[#26352D]">1000-8492-3810</strong> (Colombo 03)
                    </p>
                    <p className="text-[#718078]">
                      • HNB: <strong className="font-mono text-[#26352D]">0390-1029-4821</strong> (Kollupitiya)
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
