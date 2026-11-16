import { useState } from 'react';
import type { FC, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Gift,
  CheckCircle2,
  Building2,
  CreditCard,
  Banknote,
  Send,
  ShieldCheck,
  ArrowRight,
  Clock,
  Info,
} from 'lucide-react';
import { ShoeAvatarIcon } from '../../components/common/ShoeAvatarIcon';
import { useAppSelector } from '../../hooks/reduxHooks';
import { giftVoucherService } from '../../services/giftVoucherService';
import { formatLKR } from '../../utils/currency';
import { useToast } from '../../context/ToastContext';
import Swal from 'sweetalert2';

const APPROVED_AMOUNTS = [2500, 5000, 10000, 15000] as const;

export const GiftVouchersPage: FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const [selectedAmount, setSelectedAmount] = useState<number>(5000);
  const [formData, setFormData] = useState({
    recipientName: '',
    recipientEmail: '',
    personalMessage: '',
    bankTransferReference: '',
    paymentMethod: 'BANK_TRANSFER' as 'BANK_TRANSFER' | 'CASH_ON_DELIVERY' | 'ONLINE_CARD',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // SweetAlert2 for Card Payment Click
  const handleCardPaymentClick = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    Swal.fire({
      title: 'Online Payment Coming Soon!',
      html: `
        <div style="font-size: 14px; color: #718078; line-height: 1.6; text-align: center;">
          <p>Visa, MasterCard and AMEX online payments are currently unavailable for digital vouchers.</p>
          <p style="margin-top: 14px; font-weight: 700; color: #26352D;">
            Please select Direct Bank Transfer to purchase your digital voucher.
          </p>
        </div>
      `,
      icon: 'info',
      confirmButtonText: 'OK, Got It',
      confirmButtonColor: '#72C98A',
      background: '#FFFFFF',
      color: '#26352D',
      customClass: {
        popup: 'rounded-3xl border border-[#DCEBE0] shadow-xl p-6',
        confirmButton: 'px-7 py-2.5 rounded-xl font-bold text-xs shadow-sm cursor-pointer',
        title: 'font-outfit font-bold text-xl text-[#26352D]',
      },
    });
  };

  const handleCodClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    showToast('Cash on Delivery is not available for digital vouchers (no physical delivery).', 'info');
  };

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!formData.recipientName.trim() || formData.recipientName.length < 2) {
      errors.recipientName = 'Recipient name must be at least 2 characters long';
    }
    if (!formData.recipientEmail.trim() || !formData.recipientEmail.includes('@')) {
      errors.recipientEmail = 'Valid recipient email address is required';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePurchase = async (e: FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      navigate('/login?redirect=/gift-vouchers');
      return;
    }

    if (!validate()) {
      showToast('Please correct the highlighted form errors', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        amount: selectedAmount,
        recipientName: formData.recipientName.trim(),
        recipientEmail: formData.recipientEmail.trim().toLowerCase(),
        personalMessage: formData.personalMessage.trim(),
        paymentMethod: 'BANK_TRANSFER' as const,
        bankTransferReference: formData.bankTransferReference.trim(),
      };

      const res = await giftVoucherService.purchaseVoucher(payload);
      if (res.success) {
        await Swal.fire({
          title: 'Voucher Purchase Submitted!',
          html: `
            <div style="font-size: 14px; color: #718078; line-height: 1.6; text-align: left;">
              <p style="margin-bottom: 12px; font-weight: 600; color: #26352D;">
                Thank you, ${user?.fullName}! Your gift voucher purchase of <span style="color: #72C98A; font-weight: 800;">${formatLKR(selectedAmount)}</span> for <span style="font-weight: 700; color: #26352D;">${formData.recipientName}</span> has been initiated.
              </p>
              <div style="background: #F2FAF4; border: 1px solid #DCEBE0; border-radius: 16px; padding: 14px; margin: 12px 0;">
                <p style="font-weight: 700; color: #26352D; margin-bottom: 6px;">Next Step: Complete Bank Transfer</p>
                <p style="font-size: 13px;">Please deposit ${formatLKR(selectedAmount)} to Commercial Bank or HNB. Once verified by our team, your unique voucher code will be issued and activated.</p>
              </div>
              <p style="font-size: 12px; color: #718078; text-align: center;">You can track pending purchases and view issued codes under <strong>My Vouchers</strong>.</p>
            </div>
          `,
          icon: 'success',
          confirmButtonText: 'View My Vouchers',
          confirmButtonColor: '#72C98A',
          background: '#FFFFFF',
          color: '#26352D',
          customClass: {
            popup: 'rounded-3xl border border-[#DCEBE0] shadow-xl p-6',
            confirmButton: 'px-7 py-2.5 rounded-xl font-bold text-xs shadow-sm cursor-pointer',
            title: 'font-outfit font-bold text-2xl text-[#26352D]',
          },
        });

        navigate('/my-vouchers');
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to initiate voucher purchase';
      showToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F2FAF4] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* ======================================================== */}
        {/* 1. HERO BANNER */}
        {/* ======================================================== */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#071A33] via-[#0B2D52] to-[#1677FF]/40 text-white p-8 sm:p-12 shadow-xl border border-white/10">
          <div className="absolute -right-12 -top-12 w-64 h-64 bg-[#72C98A]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-[#72C98A] text-xs font-semibold tracking-wide uppercase">
              <ShoeAvatarIcon className="w-4 h-4" />
              <span>STRIDEX Digital Footwear Voucher</span>
            </div>
            <h1 className="font-outfit text-4xl sm:text-5xl font-extrabold tracking-tight">
              Give the Gift of <span className="text-[#72C98A]">Premium Style</span>
            </h1>
            <p className="text-sm sm:text-base text-gray-200 leading-relaxed font-inter">
              Delight your friends and family with the ultimate choice in athletic footwear. Purchase a STRIDEX digital gift voucher online and let them step into their style with authentic sneakers.
            </p>
            <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold">
              <span className="flex items-center space-x-1.5 bg-white/10 px-3 py-1.5 rounded-xl">
                <CheckCircle2 className="w-4 h-4 text-[#72C98A]" />
                <span>100% Digital & Instant Account Delivery</span>
              </span>
              <span className="flex items-center space-x-1.5 bg-white/10 px-3 py-1.5 rounded-xl">
                <CheckCircle2 className="w-4 h-4 text-[#72C98A]" />
                <span>Valid for 365 Days</span>
              </span>
              <span className="flex items-center space-x-1.5 bg-white/10 px-3 py-1.5 rounded-xl">
                <CheckCircle2 className="w-4 h-4 text-[#72C98A]" />
                <span>Redeemable Across Entire Catalog</span>
              </span>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 2. HOW IT WORKS */}
        {/* ======================================================== */}
        <div className="bg-white rounded-3xl p-8 border border-[#DCEBE0] shadow-sm space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="font-outfit text-2xl sm:text-3xl font-extrabold text-[#26352D]">
              How Digital Vouchers Work
            </h2>
            <p className="text-xs sm:text-sm text-[#718078]">
              Fast, transparent, and seamlessly integrated into the STRIDEX checkout experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-4">
            <div className="p-5 rounded-2xl bg-[#F2FAF4] border border-[#DCEBE0] space-y-3 text-center">
              <div className="w-12 h-12 rounded-2xl bg-[#72C98A]/15 text-[#72C98A] flex items-center justify-center font-outfit font-extrabold text-lg mx-auto">
                1
              </div>
              <h3 className="font-outfit font-bold text-base text-[#26352D]">Select Value</h3>
              <p className="text-xs text-[#718078] leading-relaxed">
                Choose an approved voucher amount from Rs. 2,500 up to Rs. 15,000.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#F2FAF4] border border-[#DCEBE0] space-y-3 text-center">
              <div className="w-12 h-12 rounded-2xl bg-[#72C98A]/15 text-[#72C98A] flex items-center justify-center font-outfit font-extrabold text-lg mx-auto">
                2
              </div>
              <h3 className="font-outfit font-bold text-base text-[#26352D]">Bank Transfer</h3>
              <p className="text-xs text-[#718078] leading-relaxed">
                Transfer the exact amount to Commercial Bank or HNB and submit your purchase.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#F2FAF4] border border-[#DCEBE0] space-y-3 text-center">
              <div className="w-12 h-12 rounded-2xl bg-[#72C98A]/15 text-[#72C98A] flex items-center justify-center font-outfit font-extrabold text-lg mx-auto">
                3
              </div>
              <h3 className="font-outfit font-bold text-base text-[#26352D]">Admin Activation</h3>
              <p className="text-xs text-[#718078] leading-relaxed">
                Our team verifies the deposit and issues a unique voucher code (STRIDEX-XXXX).
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#F2FAF4] border border-[#DCEBE0] space-y-3 text-center">
              <div className="w-12 h-12 rounded-2xl bg-[#72C98A]/15 text-[#72C98A] flex items-center justify-center font-outfit font-extrabold text-lg mx-auto">
                4
              </div>
              <h3 className="font-outfit font-bold text-base text-[#26352D]">Shop & Redeem</h3>
              <p className="text-xs text-[#718078] leading-relaxed">
                Apply the voucher at online checkout for instant discount on any shoe order.
              </p>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 3. VOUCHER SELECTION & PURCHASE FORM */}
        {/* ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Value Selector */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-[#DCEBE0] shadow-sm space-y-6">
            <div className="space-y-1">
              <h2 className="font-outfit text-xl font-bold text-[#26352D] flex items-center space-x-2">
                <Gift className="w-5 h-5 text-[#72C98A]" />
                <span>1. Select Voucher Value</span>
              </h2>
              <p className="text-xs text-[#718078]">
                Prices are strictly in Sri Lankan Rupees (LKR).
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {APPROVED_AMOUNTS.map((amt) => {
                const isSelected = selectedAmount === amt;
                return (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setSelectedAmount(amt)}
                    className={`relative p-5 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#72C98A] bg-[#F2FAF4] shadow-md ring-2 ring-[#72C98A]/30'
                        : 'border-[#DCEBE0] bg-white hover:border-[#72C98A]/50 hover:bg-[#F2FAF4]/50'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-3 right-3 text-[#72C98A]">
                        <CheckCircle2 className="w-5 h-5 fill-[#72C98A] text-white" />
                      </div>
                    )}
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#718078]">
                      E-Gift Card
                    </span>
                    <p className="font-outfit font-extrabold text-xl sm:text-2xl text-[#26352D] mt-1">
                      {formatLKR(amt)}
                    </p>
                    <span className="inline-block mt-2 text-[11px] font-semibold text-[#72C98A] bg-[#DDF3E2] px-2 py-0.5 rounded-full">
                      100% Footwear Value
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Visual Voucher Mockup Card */}
            <div className="mt-6 rounded-2xl bg-gradient-to-r from-[#26352D] to-[#0B2D52] p-6 text-white shadow-lg space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-outfit font-extrabold text-lg tracking-wider text-[#72C98A]">
                  STRIDEX
                </span>
                <span className="text-[10px] tracking-widest uppercase font-mono text-gray-300">
                  DIGITAL VOUCHER
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-300">Voucher Denomination</p>
                <p className="font-outfit font-extrabold text-3xl text-white">
                  {formatLKR(selectedAmount)}
                </p>
              </div>
              <div className="pt-2 border-t border-white/10 flex justify-between items-center text-[11px] text-gray-300">
                <span>Code issued after bank verification</span>
                <span className="font-semibold text-[#72C98A]">Valid 1 Year</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#F2FAF4] border border-[#DCEBE0] flex items-center space-x-3 text-xs text-[#718078]">
              <Info className="w-5 h-5 text-[#72C98A] shrink-0" />
              <span>
                Already purchased vouchers? Check your codes anytime under{' '}
                <Link to="/my-vouchers" className="text-[#26352D] font-bold underline">
                  My Vouchers
                </Link>
                .
              </span>
            </div>
          </div>

          {/* Right: Purchase Details & Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#DCEBE0] shadow-sm space-y-6">
            <div className="space-y-1">
              <h2 className="font-outfit text-xl font-bold text-[#26352D] flex items-center space-x-2">
                <Send className="w-5 h-5 text-[#72C98A]" />
                <span>2. Recipient & Payment Details</span>
              </h2>
              <p className="text-xs text-[#718078]">
                Provide recipient information for voucher personalization and redemption.
              </p>
            </div>

            {!isAuthenticated ? (
              <div className="p-8 rounded-2xl bg-[#F2FAF4] border border-[#DCEBE0] text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-[#DDF3E2] text-[#72C98A] flex items-center justify-center mx-auto">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-outfit font-bold text-lg text-[#26352D]">
                    Sign In to Purchase Digital Vouchers
                  </h3>
                  <p className="text-xs text-[#718078] max-w-md mx-auto">
                    To keep your voucher purchases secure and link issued codes directly to your STRIDEX customer profile, please sign in or create an account.
                  </p>
                </div>
                <Link
                  to="/login?redirect=/gift-vouchers"
                  className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-[#72C98A] hover:bg-[#59B976] text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
                >
                  <span>Sign In / Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <form onSubmit={handlePurchase} className="space-y-6">
                {/* Purchaser Display (Read-Only) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-[#F2FAF4] border border-[#DCEBE0]">
                  <div>
                    <span className="text-[11px] font-semibold text-[#718078]">Purchaser Name</span>
                    <p className="font-outfit font-bold text-sm text-[#26352D]">{user?.fullName}</p>
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-[#718078]">Purchaser Account</span>
                    <p className="font-inter text-xs text-[#718078]">{user?.email}</p>
                  </div>
                </div>

                {/* Recipient Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#26352D]">
                      Recipient Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Kasun Perera"
                      value={formData.recipientName}
                      onChange={(e) =>
                        setFormData({ ...formData, recipientName: e.target.value })
                      }
                      className={`w-full px-4 py-2.5 rounded-xl border text-xs focus:outline-none transition-colors ${
                        formErrors.recipientName
                          ? 'border-red-400 bg-red-50/20'
                          : 'border-[#DCEBE0] bg-white focus:border-[#72C98A]'
                      }`}
                    />
                    {formErrors.recipientName && (
                      <p className="text-[11px] text-red-500">{formErrors.recipientName}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#26352D]">
                      Recipient Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. kasun@example.com"
                      value={formData.recipientEmail}
                      onChange={(e) =>
                        setFormData({ ...formData, recipientEmail: e.target.value })
                      }
                      className={`w-full px-4 py-2.5 rounded-xl border text-xs focus:outline-none transition-colors ${
                        formErrors.recipientEmail
                          ? 'border-red-400 bg-red-50/20'
                          : 'border-[#DCEBE0] bg-white focus:border-[#72C98A]'
                      }`}
                    />
                    {formErrors.recipientEmail && (
                      <p className="text-[11px] text-red-500">{formErrors.recipientEmail}</p>
                    )}
                  </div>
                </div>

                {/* Personal Message */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#26352D]">
                    Personal Gift Message <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Happy Birthday! Enjoy picking your favorite sneakers at STRIDEX."
                    value={formData.personalMessage}
                    onChange={(e) =>
                      setFormData({ ...formData, personalMessage: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border border-[#DCEBE0] bg-white text-xs focus:outline-none focus:border-[#72C98A] transition-colors"
                  />
                </div>

                {/* Payment Options Selection */}
                <div className="space-y-3 pt-2">
                  <label className="text-xs font-bold text-[#26352D]">
                    Payment Method (Sri Lanka Standard)
                  </label>

                  {/* Option 1: Direct Bank Transfer (Active) */}
                  <div className="rounded-2xl border-2 border-[#72C98A] bg-[#F2FAF4] p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="voucherPayment"
                          id="voucherBank"
                          checked={formData.paymentMethod === 'BANK_TRANSFER'}
                          onChange={() =>
                            setFormData({ ...formData, paymentMethod: 'BANK_TRANSFER' })
                          }
                          className="w-4 h-4 text-[#72C98A] focus:ring-[#72C98A]"
                        />
                        <label
                          htmlFor="voucherBank"
                          className="font-outfit font-bold text-sm text-[#26352D] flex items-center space-x-2 cursor-pointer"
                        >
                          <Building2 className="w-4 h-4 text-[#72C98A]" />
                          <span>Direct Bank Transfer (Commercial Bank / HNB)</span>
                        </label>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#72C98A] text-white">
                        Recommended
                      </span>
                    </div>

                    {/* Official Bank Account Accordion */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                      <div className="p-3 bg-white rounded-xl border border-[#DCEBE0] space-y-1">
                        <p className="font-bold text-[#26352D]">Commercial Bank</p>
                        <p className="text-[#718078]">Acc: <strong className="text-[#26352D] font-mono">1000-8492-3810</strong></p>
                        <p className="text-[11px] text-[#718078]">Branch: Colombo 03</p>
                        <p className="text-[10px] text-[#718078]">Name: STRIDEX Footwear Ltd</p>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-[#DCEBE0] space-y-1">
                        <p className="font-bold text-[#26352D]">Hatton National Bank (HNB)</p>
                        <p className="text-[#718078]">Acc: <strong className="text-[#26352D] font-mono">0390-1029-4821</strong></p>
                        <p className="text-[11px] text-[#718078]">Branch: Kollupitiya</p>
                        <p className="text-[10px] text-[#718078]">Name: STRIDEX Footwear Ltd</p>
                      </div>
                    </div>

                    <div className="space-y-1 pt-1">
                      <label className="text-[11px] font-semibold text-[#718078]">
                        Bank Deposit Slip / Reference Number <span className="text-gray-400">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. REF-83921 / Bank Reference"
                        value={formData.bankTransferReference}
                        onChange={(e) =>
                          setFormData({ ...formData, bankTransferReference: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-[#DCEBE0] bg-white text-xs focus:outline-none focus:border-[#72C98A]"
                      />
                    </div>
                  </div>

                  {/* Option 2: Cash on Delivery (Disabled for Digital Item) */}
                  <div
                    onClick={handleCodClick}
                    className="rounded-2xl border border-[#DCEBE0] bg-gray-50/80 p-4 flex items-center justify-between opacity-60 cursor-not-allowed"
                  >
                    <div className="flex items-center space-x-3">
                      <Banknote className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-outfit font-bold text-xs text-gray-500">
                          Cash on Delivery (COD)
                        </p>
                        <p className="text-[10px] text-gray-400">
                          Not available for digital gift vouchers (no physical delivery)
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-200 text-gray-600">
                      Physical Orders Only
                    </span>
                  </div>

                  {/* Option 3: Visa / MasterCard / AMEX (SweetAlert2) */}
                  <div
                    onClick={handleCardPaymentClick}
                    className="rounded-2xl border border-[#DCEBE0] bg-white hover:border-[#72C98A]/60 p-4 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <CreditCard className="w-5 h-5 text-[#72C98A]" />
                      <div>
                        <p className="font-outfit font-bold text-xs text-[#26352D]">
                          Visa / MasterCard / AMEX
                        </p>
                        <p className="text-[10px] text-[#718078]">
                          Card gateway coming soon to STRIDEX
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#DDF3E2] text-[#26352D]">
                      Coming Soon
                    </span>
                  </div>
                </div>

                {/* Order Summary & Submit Button */}
                <div className="pt-4 border-t border-[#DCEBE0] space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-inter text-xs text-[#718078]">Total Payable Amount</span>
                    <span className="font-outfit font-extrabold text-2xl text-[#26352D]">
                      {formatLKR(selectedAmount)}
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-xl bg-[#72C98A] hover:bg-[#59B976] disabled:bg-gray-300 text-white font-outfit font-bold text-sm shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Clock className="w-4 h-4 animate-spin" />
                        <span>Processing Purchase...</span>
                      </>
                    ) : (
                      <>
                        <Gift className="w-4 h-4" />
                        <span>Confirm & Purchase Voucher ({formatLKR(selectedAmount)})</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
