import { useState, useEffect } from 'react';
import type { FC, FormEvent } from 'react';
import { X, Plus, Trash2, Boxes, AlertCircle, CheckCircle2 } from 'lucide-react';
import { variantService } from '../../services/variantService';
import type { Product, ProductVariant } from '../../types';

interface VariantManagerModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onVariantsUpdated: () => void;
}

export const VariantManagerModal: FC<VariantManagerModalProps> = ({
  product,
  isOpen,
  onClose,
  onVariantsUpdated,
}) => {
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // New variant form fields
  const [size, setSize] = useState<string>('41');
  const [color, setColor] = useState<string>('Core Black');
  const [stockQuantity, setStockQuantity] = useState<number>(10);
  const [customSKU, setCustomSKU] = useState<string>('');

  const fetchVariants = async () => {
    if (!product) return;
    setIsLoading(true);
    try {
      const res = await variantService.getByProduct(product.id);
      setVariants(res.data);
    } catch {
      setErrorMessage('Failed to fetch product variants');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && product) {
      fetchVariants();
      setErrorMessage(null);
      setSuccessMessage(null);
    }
  }, [isOpen, product]);

  const handleAddVariant = async (e: FormEvent) => {
    e.preventDefault();
    if (!product) return;

    setErrorMessage(null);
    setSuccessMessage(null);

    const generatedSKU =
      customSKU.trim() ||
      `${product.slug.toUpperCase().substring(0, 8)}-${size}-${color.replace(/\s+/g, '').toUpperCase()}`;

    setIsSubmitting(true);
    try {
      await variantService.create({
        productId: product.id,
        SKU: generatedSKU,
        size: isNaN(Number(size)) ? size : Number(size),
        color: color.trim(),
        stockQuantity: Number(stockQuantity),
        reservedQuantity: 0,
        isActive: true,
      });

      setSuccessMessage(`Variant Size ${size} (${color}) added successfully!`);
      setCustomSKU('');
      await fetchVariants();
      onVariantsUpdated();
    } catch (err: any) {
      setErrorMessage(
        err.response?.data?.message || 'Failed to add variant. Check for duplicates.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteVariant = async (variantId: string) => {
    setErrorMessage(null);
    try {
      await variantService.delete(variantId);
      setVariants((prev) => prev.filter((v) => v.id !== variantId));
      onVariantsUpdated();
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Failed to delete variant');
    }
  };

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-[#DCEBE0] shadow-2xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#DCEBE0]">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-[#DDF3E2] text-[#72C98A]">
              <Boxes className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-outfit text-xl font-bold text-[#26352D]">
                Shoe Variants: {product.name}
              </h2>
              <p className="text-xs text-[#718078]">
                Configure distinct Size, Color, and Stock inventory units for this model
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#718078] hover:text-[#26352D] hover:bg-[#F2FAF4] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Alerts */}
        {errorMessage && (
          <div className="mt-4 flex items-center space-x-2 p-3 rounded-xl bg-[#E45D5D]/10 border border-[#E45D5D]/20 text-[#E45D5D] text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mt-4 flex items-center space-x-2 p-3 rounded-xl bg-[#35A866]/10 border border-[#35A866]/20 text-[#35A866] text-xs">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Content Body: Add Form + Existing Variants Table */}
        <div className="flex-1 overflow-y-auto py-4 space-y-6">
          {/* Add Variant Form */}
          <form
            onSubmit={handleAddVariant}
            className="p-4 rounded-2xl bg-[#F2FAF4] border border-[#DCEBE0] space-y-4"
          >
            <div className="text-xs font-bold text-[#26352D] uppercase tracking-wider flex items-center space-x-1.5">
              <Plus className="w-3.5 h-3.5 text-[#72C98A]" />
              <span>Add Size & Color Variant</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#26352D] mb-1">
                  Size (EU) *
                </label>
                <input
                  type="text"
                  required
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  placeholder="e.g. 41"
                  className="w-full px-3 py-2 rounded-xl border border-[#DCEBE0] bg-white text-xs font-semibold text-[#26352D] focus:outline-none focus:border-[#72C98A]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#26352D] mb-1">
                  Color *
                </label>
                <input
                  type="text"
                  required
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder="e.g. Core Black"
                  className="w-full px-3 py-2 rounded-xl border border-[#DCEBE0] bg-white text-xs font-semibold text-[#26352D] focus:outline-none focus:border-[#72C98A]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#26352D] mb-1">
                  Stock Qty *
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={stockQuantity}
                  onChange={(e) => setStockQuantity(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-[#DCEBE0] bg-white text-xs font-semibold text-[#26352D] focus:outline-none focus:border-[#72C98A]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#26352D] mb-1">
                  SKU (Optional)
                </label>
                <input
                  type="text"
                  value={customSKU}
                  onChange={(e) => setCustomSKU(e.target.value)}
                  placeholder="Auto if blank"
                  className="w-full px-3 py-2 rounded-xl border border-[#DCEBE0] bg-white text-xs font-mono uppercase text-[#26352D] focus:outline-none focus:border-[#72C98A]"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 rounded-xl bg-[#72C98A] hover:bg-[#59B976] text-white text-xs font-semibold shadow-xs flex items-center space-x-1.5 cursor-pointer disabled:opacity-60"
              >
                {isSubmitting ? (
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Plus className="w-3.5 h-3.5" />
                )}
                <span>Add Variant</span>
              </button>
            </div>
          </form>

          {/* Variants List Table */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-[#26352D]">
              Existing Stock Variants ({variants.length})
            </div>

            {isLoading ? (
              <div className="py-8 text-center text-xs text-[#718078]">
                Loading inventory variants...
              </div>
            ) : variants.length === 0 ? (
              <div className="p-8 text-center bg-[#F2FAF4] rounded-2xl border border-dashed border-[#DCEBE0]">
                <p className="text-xs text-[#718078]">
                  No size variants added yet. Use the form above to stock this shoe.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-[#DCEBE0]">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F2FAF4] text-[#718078] font-semibold border-b border-[#DCEBE0]">
                    <tr>
                      <th className="px-4 py-3">SKU</th>
                      <th className="px-4 py-3">Size</th>
                      <th className="px-4 py-3">Color</th>
                      <th className="px-4 py-3">Stock Units</th>
                      <th className="px-4 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DCEBE0]">
                    {variants.map((v) => (
                      <tr key={v.id} className="hover:bg-[#F2FAF4]/50 transition-colors">
                        <td className="px-4 py-3 font-mono font-bold text-[#26352D] uppercase">
                          {v.SKU}
                        </td>
                        <td className="px-4 py-3 font-semibold text-[#26352D]">EU {v.size}</td>
                        <td className="px-4 py-3 text-[#26352D]">{v.color}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                              v.stockQuantity > 5
                                ? 'bg-[#35A866]/15 text-[#35A866]'
                                : v.stockQuantity > 0
                                ? 'bg-[#F2B84B]/20 text-[#26352D]'
                                : 'bg-[#E45D5D]/15 text-[#E45D5D]'
                            }`}
                          >
                            {v.stockQuantity} pairs
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleDeleteVariant(v.id)}
                            className="p-1.5 text-[#E45D5D] hover:bg-[#E45D5D]/10 rounded-lg transition-colors cursor-pointer"
                            title="Delete Variant"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-[#DCEBE0] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#26352D] hover:bg-black text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            Close Variant Manager
          </button>
        </div>
      </div>
    </div>
  );
};
