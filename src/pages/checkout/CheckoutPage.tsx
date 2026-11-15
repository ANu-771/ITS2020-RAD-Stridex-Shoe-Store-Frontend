import { useState } from 'react';
import type { FC, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  Banknote, 
  Building2, 
  CheckCircle2, 
  ArrowLeft, 
  ArrowRight,
  ShoppingBag,
  Clock
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { clearCart } from '../../store/slices/cartSlice';
import { orderService } from '../../services/orderService';
import type { Order } from '../../services/orderService';
import { formatLKR } from '../../utils/currency';
import { useToast } from '../../context/ToastContext';
import Swal from 'sweetalert2';

export const CheckoutPage: FC = () => {
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const { items } = useAppSelector((state) => state.cart);
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  // Form State
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    email: user?.email || '',
    deliveryAddress: '',
    city: 'Colombo',
    postalCode: '00300',
    deliveryNotes: '',
    paymentMethod: 'CASH_ON_DELIVERY' as 'CASH_ON_DELIVERY' | 'ONLINE_CARD' | 'BANK_TRANSFER',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  const handleCardPaymentClick = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    Swal.fire({
      title: 'Online Payment Coming Soon!',
      html: `
        <div style="font-size: 14px; color: #718078; line-height: 1.6; text-align: center;">
          <p>Visa, MasterCard and AMEX online payments are currently unavailable. We are working to bring secure online payments to STRIDEX soon.</p>
          <p style="margin-top: 14px; font-weight: 700; color: #26352D;">Please select Cash on Delivery to complete your order.</p>
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

  // Financial calculations
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const FREE_SHIPPING_THRESHOLD = 15000; // in LKR
  const STANDARD_DELIVERY_FEE = 650; // in LKR
  const deliveryFee = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : STANDARD_DELIVERY_FEE;
  const finalTotal = subtotal + deliveryFee;

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!formData.fullName.trim() || formData.fullName.length < 2) {
      errors.fullName = 'Full name must be at least 2 characters long';
    }
    if (!formData.phone.trim() || formData.phone.length < 9) {
      errors.phone = 'Valid Sri Lankan phone number is required (e.g. +94 77 123 4567)';
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      errors.email = 'Valid email address is required for order receipt';
    }
    if (!formData.deliveryAddress.trim() || formData.deliveryAddress.length < 5) {
      errors.deliveryAddress = 'Complete street delivery address is required';
    }
    if (!formData.city.trim() || formData.city.length < 2) {
      errors.city = 'Delivery city is required';
    }
    if (!formData.postalCode.trim() || formData.postalCode.length < 3) {
      errors.postalCode = 'Postal code is required';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      showToast('Please correct the highlighted form errors', 'error');
      return;
    }

    if (items.length === 0) {
      showToast('Your shopping bag is empty', 'error');
      return;
    }

    if ((formData.paymentMethod as string) === 'ONLINE_CARD') {
      handleCardPaymentClick();
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        customerDetails: {
          fullName: formData.fullName.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim(),
          deliveryAddress: formData.deliveryAddress.trim(),
          city: formData.city.trim(),
          postalCode: formData.postalCode.trim(),
          deliveryNotes: formData.deliveryNotes.trim(),
        },
        items: items.map((i) => ({
          productId: i.productId,
          variantId: i.variantId && /^[0-9a-fA-F]{24}$/.test(i.variantId) ? i.variantId : undefined,
          size: i.size,
          color: i.color,
          quantity: i.quantity,
        })),
        paymentMethod: formData.paymentMethod,
      };

      const res = await orderService.createOrder(payload);
      if (res.success && res.data) {
        setConfirmedOrder(res.data);
        dispatch(clearCart());
        showToast('Order confirmed successfully!', 'success');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err: any) {
      let msg = 'Failed to place order. Please check stock availability.';
      if (Array.isArray(err.response?.data?.message)) {
        msg = err.response.data.message
          .map((m: any) => m.message || (typeof m === 'string' ? m : JSON.stringify(m)))
          .join(', ');
      } else if (typeof err.response?.data?.message === 'string') {
        msg = err.response.data.message;
      } else if (err.message) {
        msg = err.message;
      }
      showToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // =========================================================
  // ORDER CONFIRMED SUCCESS VIEW
  // =========================================================
  if (confirmedOrder) {
    return (
      <div className="min-h-screen bg-[#F2FAF4] py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
        <div className="bg-white rounded-3xl border border-[#DCEBE0] p-8 sm:p-12 shadow-sm text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-[#DDF3E2] text-[#35A866] flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-[#72C98A] uppercase tracking-widest bg-[#F2FAF4] px-3.5 py-1 rounded-full border border-[#DCEBE0]">
              Order Confirmed & Allocated
            </span>
            <h1 className="font-outfit text-3xl sm:text-4xl font-extrabold text-[#26352D]">
              Thank You for Your Order!
            </h1>
            <p className="text-xs sm:text-sm text-[#718078] max-w-md mx-auto">
              Your order has been placed successfully and allocated directly from our warehouse.
            </p>
          </div>

          {/* Order Details Badge */}
          <div className="p-4 rounded-2xl bg-[#F2FAF4] border border-[#DCEBE0] inline-block text-left text-xs space-y-1">
            <div className="flex space-x-4">
              <span className="text-[#718078]">Order Number:</span>
              <strong className="font-mono text-sm text-[#26352D] font-bold">
                {confirmedOrder.orderNumber}
              </strong>
            </div>
            <div className="flex space-x-4">
              <span className="text-[#718078]">Payment Method:</span>
              <strong className="text-[#26352D] uppercase font-semibold">
                {confirmedOrder.paymentMethod.replace(/_/g, ' ')}
              </strong>
            </div>
            <div className="flex space-x-4">
              <span className="text-[#718078]">Payment Status:</span>
              <strong
                className={`font-bold ${
                  confirmedOrder.paymentStatus === 'PAID'
                    ? 'text-[#35A866]'
                    : confirmedOrder.paymentStatus === 'FAILED'
                    ? 'text-[#E45D5D]'
                    : 'text-amber-700'
                }`}
              >
                {confirmedOrder.paymentStatus}
              </strong>
            </div>
            <div className="flex space-x-4">
              <span className="text-[#718078]">Final Total:</span>
              <strong className="font-outfit text-sm text-[#26352D] font-extrabold">
                {formatLKR(confirmedOrder.finalTotal)}
              </strong>
            </div>
          </div>

          {/* Payment Method Notice */}
          {confirmedOrder.paymentMethod === 'CASH_ON_DELIVERY' ? (
            <div className="p-3.5 bg-[#DDF3E2]/60 rounded-2xl border border-[#BDECCB] max-w-lg mx-auto text-xs text-[#26352D] flex items-center justify-center space-x-2">
              <Banknote className="w-4 h-4 text-[#35A866] shrink-0" />
              <span>
                <strong>Cash on Delivery (Island-wide):</strong> Please have <strong>{formatLKR(confirmedOrder.finalTotal)}</strong> in Sri Lankan Rupees ready for the courier.
              </span>
            </div>
          ) : confirmedOrder.paymentMethod === 'BANK_TRANSFER' ? (
            <div className="p-4 bg-[#F2FAF4] rounded-2xl border border-[#DCEBE0] max-w-lg mx-auto text-xs text-[#26352D] space-y-2 text-left">
              <div className="flex items-center space-x-2 font-bold text-[#35A866]">
                <Building2 className="w-4 h-4" />
                <span>Direct Bank Transfer Instructions (Commercial Bank / HNB)</span>
              </div>
              <p className="text-[#718078]">
                Please transfer <strong>{formatLKR(confirmedOrder.finalTotal)}</strong> using your Order Number <strong>{confirmedOrder.orderNumber}</strong> as the payment reference.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px]">
                <div className="p-2.5 bg-white rounded-xl border border-[#DCEBE0]">
                  <strong className="text-[#26352D] block">Commercial Bank of Ceylon</strong>
                  <span className="text-[#718078]">Acc: 1000-8492-3810</span><br />
                  <span className="text-[#718078]">Name: STRIDEX Footwear Ltd</span><br />
                  <span className="text-[#718078]">Branch: Colombo 03</span>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-[#DCEBE0]">
                  <strong className="text-[#26352D] block">Hatton National Bank (HNB)</strong>
                  <span className="text-[#718078]">Acc: 0390-1029-4821</span><br />
                  <span className="text-[#718078]">Name: STRIDEX Footwear Ltd</span><br />
                  <span className="text-[#718078]">Branch: Kollupitiya</span>
                </div>
              </div>
            </div>
          ) : null}

          {/* Delivery Promise */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left max-w-lg mx-auto pt-2 text-xs">
            <div className="p-4 rounded-2xl border border-[#DCEBE0] bg-white flex items-start space-x-3">
              <Clock className="w-5 h-5 text-[#72C98A] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#26352D] block">Delivery Window</strong>
                <span className="text-[#718078]">24–48 hours in Colombo; 2–4 days island-wide.</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-[#DCEBE0] bg-white flex items-start space-x-3">
              <Truck className="w-5 h-5 text-[#72C98A] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#26352D] block">Delivery Address</strong>
                <span className="text-[#718078]">
                  {confirmedOrder.customerDetails.deliveryAddress}, {confirmedOrder.customerDetails.city}
                </span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-6 border-t border-[#DCEBE0] flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/orders"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#72C98A] hover:bg-[#59B976] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>View My Order History</span>
            </Link>

            <Link
              to="/shop"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-[#DCEBE0] hover:border-[#72C98A] text-[#26352D] font-bold text-xs transition-colors flex items-center justify-center"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  // EMPTY CART CHECKOUT GUARD
  // =========================================================
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#F2FAF4] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl border border-[#DCEBE0] p-10 max-w-md text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-[#F2FAF4] text-[#718078] flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="font-outfit font-bold text-2xl text-[#26352D]">Shopping Bag Empty</h2>
          <p className="text-xs text-[#718078]">
            You have no shoes in your shopping bag to checkout. Please explore our collections first.
          </p>
          <Link
            to="/shop"
            className="inline-block px-6 py-2.5 bg-[#72C98A] text-white text-xs font-bold rounded-xl hover:bg-[#59B976] transition-all"
          >
            Explore Footwear Catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2FAF4] py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header & Back Link */}
      <div className="flex items-center justify-between pb-4 border-b border-[#DCEBE0]">
        <div>
          <Link
            to="/cart"
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#718078] hover:text-[#26352D] transition-colors mb-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Shopping Bag</span>
          </Link>
          <h1 className="font-outfit text-3xl sm:text-4xl font-extrabold text-[#26352D]">
            Checkout & Delivery
          </h1>
        </div>

        <div className="hidden sm:flex items-center space-x-2 text-xs font-semibold text-[#35A866] bg-[#DDF3E2] px-3.5 py-1.5 rounded-full border border-[#BDECCB]">
          <ShieldCheck className="w-4 h-4" />
          <span>256-Bit SSL Encrypted Checkout</span>
        </div>
      </div>

      {/* Main Grid: Left Form + Right Order Summary */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ======================================================== */}
        {/* LEFT: DELIVERY INFORMATION & PAYMENT (7 COLS)           */}
        {/* ======================================================== */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Customer & Delivery Address Card */}
          <div className="bg-white rounded-3xl border border-[#DCEBE0] p-6 sm:p-8 space-y-6 shadow-xs">
            <h3 className="font-outfit font-bold text-xl text-[#26352D] flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-[#72C98A] text-white text-xs flex items-center justify-center font-bold">
                1
              </span>
              <span>Delivery Details (Sri Lanka)</span>
            </h3>

            {!isAuthenticated && (
              <div className="p-3.5 rounded-xl bg-[#DDF3E2] border border-[#BDECCB] text-xs text-[#26352D] flex items-center justify-between">
                <span>Have an account? Sign in for saved addresses and fast checkout.</span>
                <Link to="/login" className="font-bold underline text-[#26352D] hover:text-[#72C98A]">
                  Sign In
                </Link>
              </div>
            )}

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#26352D] mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Kasun Perera"
                    className={`w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#F2FAF4] border ${
                      formErrors.fullName ? 'border-[#E45D5D]' : 'border-[#DCEBE0]'
                    } focus:border-[#72C98A] focus:outline-none text-[#26352D]`}
                  />
                  {formErrors.fullName && (
                    <span className="text-[10px] text-[#E45D5D] mt-1 block">{formErrors.fullName}</span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#26352D] mb-1.5">
                    Contact Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. +94 77 123 4567"
                    className={`w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#F2FAF4] border ${
                      formErrors.phone ? 'border-[#E45D5D]' : 'border-[#DCEBE0]'
                    } focus:border-[#72C98A] focus:outline-none text-[#26352D]`}
                  />
                  {formErrors.phone && (
                    <span className="text-[10px] text-[#E45D5D] mt-1 block">{formErrors.phone}</span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#26352D] mb-1.5">
                  Email Address for Receipt & Tracking *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. kasun@example.com"
                  className={`w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#F2FAF4] border ${
                    formErrors.email ? 'border-[#E45D5D]' : 'border-[#DCEBE0]'
                  } focus:border-[#72C98A] focus:outline-none text-[#26352D]`}
                />
                {formErrors.email && (
                  <span className="text-[10px] text-[#E45D5D] mt-1 block">{formErrors.email}</span>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-[#26352D] mb-1.5">
                  Street Delivery Address *
                </label>
                <input
                  type="text"
                  required
                  value={formData.deliveryAddress}
                  onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                  placeholder="e.g. No. 450, Galle Road, Apt 4B"
                  className={`w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#F2FAF4] border ${
                    formErrors.deliveryAddress ? 'border-[#E45D5D]' : 'border-[#DCEBE0]'
                  } focus:border-[#72C98A] focus:outline-none text-[#26352D]`}
                />
                {formErrors.deliveryAddress && (
                  <span className="text-[10px] text-[#E45D5D] mt-1 block">{formErrors.deliveryAddress}</span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#26352D] mb-1.5">
                    City / Town *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="e.g. Colombo 03, Kandy, Galle"
                    className={`w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#F2FAF4] border ${
                      formErrors.city ? 'border-[#E45D5D]' : 'border-[#DCEBE0]'
                    } focus:border-[#72C98A] focus:outline-none text-[#26352D]`}
                  />
                  {formErrors.city && (
                    <span className="text-[10px] text-[#E45D5D] mt-1 block">{formErrors.city}</span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#26352D] mb-1.5">
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    placeholder="e.g. 00300"
                    className={`w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#F2FAF4] border ${
                      formErrors.postalCode ? 'border-[#E45D5D]' : 'border-[#DCEBE0]'
                    } focus:border-[#72C98A] focus:outline-none text-[#26352D]`}
                  />
                  {formErrors.postalCode && (
                    <span className="text-[10px] text-[#E45D5D] mt-1 block">{formErrors.postalCode}</span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#26352D] mb-1.5">
                  Delivery Instructions (Optional)
                </label>
                <textarea
                  rows={2}
                  value={formData.deliveryNotes}
                  onChange={(e) => setFormData({ ...formData, deliveryNotes: e.target.value })}
                  placeholder="e.g. Please leave with building security or call upon arrival"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#F2FAF4] border border-[#DCEBE0] focus:border-[#72C98A] focus:outline-none text-[#26352D]"
                />
              </div>
            </div>
          </div>

          {/* 2. Payment Method Card */}
          <div className="bg-white rounded-3xl border border-[#DCEBE0] p-6 sm:p-8 space-y-4 shadow-xs">
            <h3 className="font-outfit font-bold text-xl text-[#26352D] flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-[#72C98A] text-white text-xs flex items-center justify-center font-bold">
                2
              </span>
              <span>Payment Option</span>
            </h3>

            <div className="space-y-3">
              {/* Option 1: Cash on Delivery */}
              <label
                onClick={() => setFormData({ ...formData, paymentMethod: 'CASH_ON_DELIVERY' })}
                className={`flex items-start p-4 rounded-2xl border cursor-pointer transition-all ${
                  formData.paymentMethod === 'CASH_ON_DELIVERY'
                    ? 'border-[#72C98A] bg-[#DDF3E2]/40 shadow-xs'
                    : 'border-[#DCEBE0] hover:border-[#72C98A]/50 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={formData.paymentMethod === 'CASH_ON_DELIVERY'}
                  onChange={() => setFormData({ ...formData, paymentMethod: 'CASH_ON_DELIVERY' })}
                  className="mt-1 text-[#72C98A] focus:ring-[#72C98A]"
                />
                <div className="ml-3 flex-1">
                  <div className="flex items-center space-x-2">
                    <Banknote className="w-4 h-4 text-[#72C98A]" />
                    <strong className="font-outfit font-bold text-sm text-[#26352D]">
                      Cash on Delivery (COD)
                    </strong>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#DDF3E2] text-[#26352D]">
                      Island-wide
                    </span>
                  </div>
                  <p className="text-xs text-[#718078] mt-0.5">
                    Pay securely in Sri Lankan Rupees (LKR) when the courier hands your package to you.
                  </p>
                </div>
              </label>

              {/* Option 2: Visa / MasterCard / AMEX (Kept visible, triggers SweetAlert2 notification) */}
              <div
                onClick={handleCardPaymentClick}
                className="flex items-start p-4 rounded-2xl border border-[#DCEBE0] hover:border-[#72C98A]/50 bg-white cursor-pointer transition-all group"
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={false}
                  readOnly
                  className="mt-1 text-[#72C98A] focus:ring-[#72C98A] pointer-events-none"
                />
                <div className="ml-3 flex-1">
                  <div className="flex items-center space-x-2">
                    <CreditCard className="w-4 h-4 text-[#72C98A]" />
                    <strong className="font-outfit font-bold text-sm text-[#26352D]">
                      Visa / MasterCard / AMEX
                    </strong>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                      Coming Soon
                    </span>
                  </div>
                  <p className="text-xs text-[#718078] mt-0.5">
                    Pay with local or international debit/credit cards. 3D Secure verified.
                  </p>
                </div>
              </div>

              {/* Option 3: Direct Bank Transfer (Commercial Bank / HNB) */}
              <label
                onClick={() => setFormData({ ...formData, paymentMethod: 'BANK_TRANSFER' })}
                className={`flex items-start p-4 rounded-2xl border cursor-pointer transition-all ${
                  formData.paymentMethod === 'BANK_TRANSFER'
                    ? 'border-[#72C98A] bg-[#DDF3E2]/40 shadow-xs'
                    : 'border-[#DCEBE0] hover:border-[#72C98A]/50 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={formData.paymentMethod === 'BANK_TRANSFER'}
                  onChange={() => setFormData({ ...formData, paymentMethod: 'BANK_TRANSFER' })}
                  className="mt-1 text-[#72C98A] focus:ring-[#72C98A]"
                />
                <div className="ml-3 flex-1">
                  <div className="flex items-center space-x-2">
                    <Building2 className="w-4 h-4 text-[#72C98A]" />
                    <strong className="font-outfit font-bold text-sm text-[#26352D]">
                      Direct Bank Transfer (Commercial Bank / HNB)
                    </strong>
                  </div>
                  <p className="text-xs text-[#718078] mt-0.5">
                    Transfer directly to our Colombo branch account. Bank details provided on receipt.
                  </p>

                  {formData.paymentMethod === 'BANK_TRANSFER' && (
                    <div className="mt-3 p-3.5 bg-white rounded-xl border border-[#DCEBE0] text-xs space-y-2.5 animate-in fade-in duration-150">
                      <div className="text-[11px] font-bold text-[#26352D] uppercase tracking-wider">
                        Available Bank Accounts for Sri Lanka:
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                        <div className="p-2.5 bg-[#F2FAF4] rounded-lg border border-[#DCEBE0]">
                          <strong className="text-[#26352D] block">Commercial Bank of Ceylon</strong>
                          <span className="text-[#718078]">Account: 1000-8492-3810</span><br />
                          <span className="text-[#718078]">Name: STRIDEX Footwear Ltd</span><br />
                          <span className="text-[#718078]">Branch: Colombo 03</span>
                        </div>
                        <div className="p-2.5 bg-[#F2FAF4] rounded-lg border border-[#DCEBE0]">
                          <strong className="text-[#26352D] block">Hatton National Bank (HNB)</strong>
                          <span className="text-[#718078]">Account: 0390-1029-4821</span><br />
                          <span className="text-[#718078]">Name: STRIDEX Footwear Ltd</span><br />
                          <span className="text-[#718078]">Branch: Kollupitiya</span>
                        </div>
                      </div>
                      <p className="text-[10px] text-[#718078]">
                        Please use your Order Number as payment reference. Order will be confirmed upon bank transfer receipt.
                      </p>
                    </div>
                  )}
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* RIGHT: ORDER ITEMS & FINAL TOTAL (5 COLS)                 */}
        {/* ======================================================== */}
        <div className="lg:col-span-5 space-y-6 sticky top-28">
          <div className="bg-white rounded-3xl border border-[#DCEBE0] p-6 sm:p-8 space-y-6 shadow-xs">
            <h3 className="font-outfit font-bold text-xl text-[#26352D]">
              Order Summary ({items.length} {items.length === 1 ? 'pair' : 'pairs'})
            </h3>

            {/* Compact Item Breakdown */}
            <div className="max-h-64 overflow-y-auto divide-y divide-[#DCEBE0] pr-1 no-scrollbar">
              {items.map((item) => (
                <div key={item.id} className="py-3 flex items-center justify-between space-x-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-14 h-14 bg-[#F2FAF4] rounded-xl border border-[#DCEBE0] p-1 shrink-0 flex items-center justify-center">
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <h4 className="font-outfit font-bold text-xs text-[#26352D] line-clamp-1">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-[#718078]">
                        Size: {item.size} • Color: {item.color}
                      </p>
                      <p className="text-[11px] text-[#718078]">
                        Qty: <strong>{item.quantity}</strong> × {formatLKR(item.price)}
                      </p>
                    </div>
                  </div>
                  <strong className="font-outfit font-bold text-xs text-[#26352D] shrink-0">
                    {formatLKR(item.price * item.quantity)}
                  </strong>
                </div>
              ))}
            </div>

            {/* Calculations in Sri Lankan Rupees */}
            <div className="space-y-2.5 pt-3 border-t border-[#DCEBE0] text-xs text-[#718078]">
              <div className="flex justify-between">
                <span>Footwear Subtotal</span>
                <span className="font-outfit font-bold text-sm text-[#26352D]">
                  {formatLKR(subtotal)}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Island-wide Express Delivery</span>
                <span className="font-semibold text-[#35A866]">
                  {deliveryFee === 0 ? 'FREE' : formatLKR(deliveryFee)}
                </span>
              </div>

              <div className="pt-3 border-t border-[#DCEBE0] flex justify-between items-baseline">
                <div>
                  <strong className="font-outfit text-base text-[#26352D] block">Final Total</strong>
                  <span className="text-[10px] text-[#718078]">All taxes & duties included</span>
                </div>
                <strong className="font-outfit text-2xl font-extrabold text-[#26352D]">
                  {formatLKR(finalTotal)}
                </strong>
              </div>
            </div>

            {/* Submit Order Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-xl bg-[#72C98A] hover:bg-[#59B976] text-white font-bold text-xs shadow-lg shadow-green-500/25 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? (
                <span>Confirming Order with Warehouse...</span>
              ) : (
                <>
                  <span>Place Order • {formatLKR(finalTotal)}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="space-y-2 text-[10px] text-[#718078] text-center">
              <p>
                By placing your order, you agree to STRIDEX Sri Lanka terms of delivery and 30-day size exchange policies.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
