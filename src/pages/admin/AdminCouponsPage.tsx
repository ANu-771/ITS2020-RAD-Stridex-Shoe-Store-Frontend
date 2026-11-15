import { useState, useEffect } from 'react';
import type { FC, FormEvent } from 'react';
import { 
  Tag, 
  Plus, 
  Trash2, 
  Edit, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  X
} from 'lucide-react';
import { couponService } from '../../services/couponService';
import type { Coupon, CouponPayload } from '../../services/couponService';
import { formatLKR } from '../../utils/currency';
import { useToast } from '../../context/ToastContext';

export const AdminCouponsPage: FC = () => {
  const { showToast } = useToast();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Form Fields
  const [code, setCode] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [discountType, setDiscountType] = useState<'PERCENTAGE' | 'FIXED_AMOUNT'>('PERCENTAGE');
  const [discountValue, setDiscountValue] = useState<string>('10');
  const [minOrderAmount, setMinOrderAmount] = useState<string>('0');
  const [maxDiscountAmount, setMaxDiscountAmount] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [usageLimit, setUsageLimit] = useState<string>('');
  const [isActive, setIsActive] = useState<boolean>(true);

  const fetchCoupons = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await couponService.getAll();
      if (res.success) {
        setCoupons(res.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch coupons');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleOpenCreate = () => {
    setEditingCoupon(null);
    setCode('');
    setDescription('');
    setDiscountType('PERCENTAGE');
    setDiscountValue('10');
    setMinOrderAmount('0');
    setMaxDiscountAmount('');
    // Default expiry 30 days from now
    const d = new Date();
    d.setDate(d.getDate() + 30);
    setEndDate(d.toISOString().slice(0, 10));
    setUsageLimit('');
    setIsActive(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: Coupon) => {
    setEditingCoupon(c);
    setCode(c.code);
    setDescription(c.description || '');
    setDiscountType(c.discountType);
    setDiscountValue(String(c.discountValue));
    setMinOrderAmount(String(c.minOrderAmount || 0));
    setMaxDiscountAmount(c.maxDiscountAmount ? String(c.maxDiscountAmount) : '');
    setEndDate(new Date(c.endDate).toISOString().slice(0, 10));
    setUsageLimit(c.usageLimit ? String(c.usageLimit) : '');
    setIsActive(c.isActive);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      showToast('Coupon code is required', 'error');
      return;
    }
    if (!endDate) {
      showToast('Expiry date is required', 'error');
      return;
    }

    const payload: CouponPayload = {
      code: code.trim().toUpperCase(),
      description: description.trim() || undefined,
      discountType,
      discountValue: Number(discountValue),
      minOrderAmount: Number(minOrderAmount) || 0,
      maxDiscountAmount: maxDiscountAmount ? Number(maxDiscountAmount) : undefined,
      endDate: new Date(endDate).toISOString(),
      usageLimit: usageLimit ? Number(usageLimit) : undefined,
      isActive,
    };

    setIsSubmitting(true);
    try {
      if (editingCoupon) {
        const res = await couponService.update(editingCoupon.id || editingCoupon._id, payload);
        if (res.success) {
          showToast(`Coupon ${res.data.code} updated`, 'success');
        }
      } else {
        const res = await couponService.create(payload);
        if (res.success) {
          showToast(`Coupon ${res.data.code} created`, 'success');
        }
      }
      setIsModalOpen(false);
      fetchCoupons();
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to save coupon', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, couponCode: string) => {
    if (!window.confirm(`Delete coupon "${couponCode}"?`)) return;
    try {
      await couponService.delete(id);
      showToast(`Coupon "${couponCode}" deleted`, 'info');
      fetchCoupons();
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to delete coupon', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white p-5 rounded-2xl border border-[#DCEBE0] shadow-xs flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
        <div>
          <h2 className="font-outfit text-xl font-bold text-[#26352D]">
            Promotional Coupons & Vouchers ({coupons.length})
          </h2>
          <p className="text-xs text-[#718078]">
            Create and manage promotional discount codes applied during checkout in Sri Lankan Rupees.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 bg-[#72C98A] hover:bg-[#59B976] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center space-x-1.5 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Coupon</span>
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-3 animate-pulse">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 bg-white rounded-2xl border border-[#DCEBE0]" />
          ))}
        </div>
      ) : error ? (
        <div className="p-4 rounded-2xl bg-[#E45D5D]/10 text-[#E45D5D] text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      ) : coupons.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#DCEBE0] p-12 text-center space-y-3">
          <Tag className="w-8 h-8 text-[#718078] mx-auto" />
          <h3 className="font-outfit font-bold text-lg text-[#26352D]">No coupons created yet</h3>
          <p className="text-xs text-[#718078]">Click "Create New Coupon" to offer promotions to shoe shoppers.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-[#DCEBE0] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F2FAF4] text-[#718078] border-b border-[#DCEBE0] uppercase font-bold text-[10px] tracking-wider">
                  <th className="py-3 px-4">Coupon Code</th>
                  <th className="py-3 px-4">Discount</th>
                  <th className="py-3 px-4">Min. Spend</th>
                  <th className="py-3 px-4">Max Cap</th>
                  <th className="py-3 px-4">Expiry Date</th>
                  <th className="py-3 px-4">Usage</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DCEBE0]">
                {coupons.map((c) => (
                  <tr key={c.id || c._id} className="hover:bg-[#F2FAF4]/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#26352D]">
                      <span className="px-2.5 py-1 bg-[#DDF3E2] text-[#26352D] rounded-lg border border-[#BDECCB]">
                        {c.code}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-bold text-[#26352D]">
                      {c.discountType === 'PERCENTAGE'
                        ? `${c.discountValue}% OFF`
                        : `Rs. ${c.discountValue.toLocaleString()} OFF`}
                    </td>

                    <td className="py-3.5 px-4 text-[#718078]">
                      {c.minOrderAmount > 0 ? formatLKR(c.minOrderAmount) : 'No Minimum'}
                    </td>

                    <td className="py-3.5 px-4 text-[#718078]">
                      {c.maxDiscountAmount ? formatLKR(c.maxDiscountAmount) : 'No Limit'}
                    </td>

                    <td className="py-3.5 px-4 text-[#718078] whitespace-nowrap">
                      {new Date(c.endDate).toLocaleDateString()}
                    </td>

                    <td className="py-3.5 px-4 text-[#718078]">
                      {c.usedCount} / {c.usageLimit || '∞'}
                    </td>

                    <td className="py-3.5 px-4">
                      {c.isActive ? (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#DDF3E2] text-[#35A866]">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Active</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-600">
                          <XCircle className="w-3 h-3" />
                          <span>Inactive</span>
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => handleOpenEdit(c)}
                        className="p-1.5 hover:bg-[#DDF3E2] text-[#26352D] rounded-lg transition-colors cursor-pointer"
                        title="Edit Coupon"
                      >
                        <Edit className="w-4 h-4 text-[#718078]" />
                      </button>
                      <button
                        onClick={() => handleDelete(c.id || c._id, c.code)}
                        className="p-1.5 hover:bg-[#E45D5D]/10 text-[#E45D5D] rounded-lg transition-colors cursor-pointer"
                        title="Delete Coupon"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create / Edit Coupon Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-[#DCEBE0] p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#DCEBE0]">
              <h3 className="font-outfit text-xl font-bold text-[#26352D]">
                {editingCoupon ? `Edit Coupon "${editingCoupon.code}"` : 'Create New Promotional Coupon'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[#718078] hover:text-[#26352D] cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#26352D] mb-1">Coupon Code *</label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="e.g. STRIDEX15"
                    className="w-full px-3 py-2 rounded-xl border border-[#DCEBE0] bg-[#F2FAF4] text-[#26352D] font-mono font-bold focus:outline-none focus:ring-1 focus:ring-[#72C98A]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#26352D] mb-1">Discount Type *</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-[#DCEBE0] bg-[#F2FAF4] text-[#26352D] focus:outline-none"
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED_AMOUNT">Fixed Sri Lankan Rupees (LKR)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#26352D] mb-1">
                  Discount Value * ({discountType === 'PERCENTAGE' ? '%' : 'LKR'})
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#DCEBE0] bg-[#F2FAF4] text-[#26352D] font-bold focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#26352D] mb-1">Minimum Order Amount (LKR)</label>
                  <input
                    type="number"
                    min="0"
                    value={minOrderAmount}
                    onChange={(e) => setMinOrderAmount(e.target.value)}
                    placeholder="0 for none"
                    className="w-full px-3 py-2 rounded-xl border border-[#DCEBE0] bg-[#F2FAF4] text-[#26352D] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#26352D] mb-1">Max Cap (LKR - % only)</label>
                  <input
                    type="number"
                    min="0"
                    value={maxDiscountAmount}
                    onChange={(e) => setMaxDiscountAmount(e.target.value)}
                    placeholder="Optional max cap"
                    disabled={discountType === 'FIXED_AMOUNT'}
                    className="w-full px-3 py-2 rounded-xl border border-[#DCEBE0] bg-[#F2FAF4] text-[#26352D] disabled:opacity-40 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#26352D] mb-1">Expiry Date *</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#DCEBE0] bg-[#F2FAF4] text-[#26352D] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#26352D] mb-1">Usage Limit</label>
                  <input
                    type="number"
                    min="1"
                    value={usageLimit}
                    onChange={(e) => setUsageLimit(e.target.value)}
                    placeholder="Blank for unlimited"
                    className="w-full px-3 py-2 rounded-xl border border-[#DCEBE0] bg-[#F2FAF4] text-[#26352D] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#26352D] mb-1">Description / Campaign</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. 15% off first shoe purchase"
                  className="w-full px-3 py-2 rounded-xl border border-[#DCEBE0] bg-[#F2FAF4] text-[#26352D] focus:outline-none"
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="couponActive"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="rounded text-[#72C98A] focus:ring-[#72C98A]"
                />
                <label htmlFor="couponActive" className="font-semibold text-[#26352D]">
                  Coupon is Active and redeemable at checkout
                </label>
              </div>

              <div className="pt-3 flex items-center justify-end space-x-2 border-t border-[#DCEBE0]">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#718078] hover:bg-[#F2FAF4] rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-[#72C98A] hover:bg-[#59B976] text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : editingCoupon ? 'Update Coupon' : 'Create Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
