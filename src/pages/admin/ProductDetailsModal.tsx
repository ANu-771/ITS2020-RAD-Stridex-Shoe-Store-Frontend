import type { FC } from 'react';
import { X, Sparkles, Layers, CheckCircle2 } from 'lucide-react';
import { formatLKR } from '../../utils/currency';
import type { Product, Brand, Category } from '../../types';

interface ProductDetailsModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onManageVariants: () => void;
}

export const ProductDetailsModal: FC<ProductDetailsModalProps> = ({
  product,
  isOpen,
  onClose,
  onManageVariants,
}) => {
  if (!isOpen || !product) return null;

  const brandName = typeof product.brandId === 'object' ? (product.brandId as Brand).name : 'Brand';
  const categoryName = typeof product.categoryId === 'object' ? (product.categoryId as Category).name : 'Category';
  const mainImage = product.images && product.images.length > 0
    ? product.images[0]
    : 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=80';

  const hasDiscount = product.discountPrice > 0 && product.discountPrice < product.basePrice;
  const discountPercent = hasDiscount
    ? Math.round(((product.basePrice - product.discountPrice) / product.basePrice) * 100)
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 border border-[#DCEBE0] shadow-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#DCEBE0]">
          <div>
            <span className="text-[11px] font-bold text-[#72C98A] uppercase tracking-wider">
              {brandName} • {categoryName}
            </span>
            <h2 className="font-outfit text-2xl font-extrabold text-[#26352D]">
              {product.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#718078] hover:text-[#26352D] hover:bg-[#F2FAF4] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6">
          {/* Left: Product Images */}
          <div className="space-y-3">
            <div className="h-64 sm:h-72 w-full rounded-2xl bg-[#F2FAF4] border border-[#DCEBE0] overflow-hidden flex items-center justify-center p-4">
              <img
                src={mainImage}
                alt={product.name}
                className="w-full h-full object-contain drop-shadow-md"
              />
            </div>

            {product.images && product.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto pb-1">
                {product.images.map((img, i) => (
                  <div
                    key={i}
                    className="w-16 h-16 rounded-xl border border-[#DCEBE0] bg-[#F2FAF4] overflow-hidden shrink-0"
                  >
                    <img src={img} alt={`thumb-${i}`} className="w-full h-full object-contain p-1" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Pricing, Specs, and Meta */}
          <div className="space-y-5">
            {/* Sri Lankan Rupee Price Card */}
            <div className="p-4 rounded-2xl bg-[#DDF3E2]/50 border border-[#BDECCB] space-y-1">
              <div className="text-[11px] font-bold text-[#718078] uppercase">
                Sri Lankan Retail Pricing (LKR)
              </div>
              <div className="flex items-baseline space-x-3">
                <span className="font-outfit text-3xl font-extrabold text-[#26352D]">
                  {formatLKR(hasDiscount ? product.discountPrice : product.basePrice)}
                </span>
                {hasDiscount && (
                  <span className="text-sm font-semibold text-[#718078] line-through">
                    {formatLKR(product.basePrice)}
                  </span>
                )}
                {hasDiscount && (
                  <span className="px-2 py-0.5 rounded-full bg-[#E45D5D]/15 text-[#E45D5D] text-xs font-bold">
                    {discountPercent}% OFF
                  </span>
                )}
              </div>
            </div>

            {/* Attributes Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#F2FAF4] border border-[#DCEBE0]">
                <div className="text-[#718078] font-medium">Target Gender</div>
                <div className="font-bold text-[#26352D] mt-0.5">{product.gender}</div>
              </div>

              <div className="p-3 rounded-xl bg-[#F2FAF4] border border-[#DCEBE0]">
                <div className="text-[#718078] font-medium">Upper Material</div>
                <div className="font-bold text-[#26352D] mt-0.5">{product.material || 'Engineered'}</div>
              </div>

              <div className="p-3 rounded-xl bg-[#F2FAF4] border border-[#DCEBE0]">
                <div className="text-[#718078] font-medium">Catalog Status</div>
                <div className="font-bold text-[#35A866] mt-0.5 flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{product.isActive ? 'Active Storefront' : 'Draft / Inactive'}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#F2FAF4] border border-[#DCEBE0]">
                <div className="text-[#718078] font-medium">Featured Showcase</div>
                <div className="font-bold text-[#26352D] mt-0.5 flex items-center space-x-1">
                  {product.isFeatured ? (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-[#59B976]" />
                      <span className="text-[#59B976]">Hero Featured</span>
                    </>
                  ) : (
                    <span className="text-[#718078]">Standard</span>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <div className="text-xs font-bold text-[#26352D] mb-1">Product Description</div>
              <p className="text-xs text-[#718078] leading-relaxed font-sans">{product.description}</p>
            </div>
          </div>
        </div>

        {/* Variants Section */}
        <div className="pt-4 border-t border-[#DCEBE0] space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-outfit text-base font-bold text-[#26352D]">
                Stock & Sizing Breakdown
              </h3>
              <p className="text-[11px] text-[#718078]">
                Total warehouse stock: <strong className="text-[#26352D]">{product.totalStock || 0} units</strong> across {product.variants?.length || 0} variant SKUs
              </p>
            </div>
            <button
              onClick={() => {
                onClose();
                onManageVariants();
              }}
              className="px-3.5 py-1.5 rounded-xl bg-[#DDF3E2] hover:bg-[#BDECCB] text-[#26352D] text-xs font-semibold transition-colors flex items-center space-x-1.5"
            >
              <Layers className="w-3.5 h-3.5 text-[#72C98A]" />
              <span>Manage Variants</span>
            </button>
          </div>

          {product.variants && product.variants.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {product.variants.map((v) => (
                <div
                  key={v.id}
                  className="p-2.5 rounded-xl border border-[#DCEBE0] bg-[#F2FAF4] text-xs space-y-1"
                >
                  <div className="flex items-center justify-between font-bold text-[#26352D]">
                    <span>EU {v.size}</span>
                    <span className="text-[10px] text-[#35A866] bg-white px-1.5 py-0.5 rounded border border-[#DCEBE0]">
                      {v.stockQuantity} pairs
                    </span>
                  </div>
                  <div className="text-[11px] text-[#718078] truncate">{v.color}</div>
                  <div className="text-[9px] font-mono text-[#718078]/80 truncate">{v.SKU}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-[#F2FAF4] text-center text-xs text-[#718078]">
              No size variants loaded for this shoe.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-[#DCEBE0] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#26352D] hover:bg-black text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};
