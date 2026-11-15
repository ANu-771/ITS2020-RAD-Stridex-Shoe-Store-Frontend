import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Tag } from 'lucide-react';
import type { AiProductCard } from '../../types/ai.types';

interface AiProductRecommendationCardProps {
  product: AiProductCard;
  onNavigate?: () => void;
}

export const AiProductRecommendationCard: React.FC<AiProductRecommendationCardProps> = ({
  product,
  onNavigate,
}) => {
  const navigate = useNavigate();

  const handleViewProduct = () => {
    if (onNavigate) {
      onNavigate();
    }
    navigate(`/product/${product.slug}`);
  };

  const defaultImage =
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600';

  return (
    <div className="flex flex-col bg-white border border-[#DCEBE0] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 text-[#26352D] w-full max-w-[240px] shrink-0">
      {/* Product Image Thumbnail */}
      <div className="relative w-full h-28 bg-[#F2FAF4] overflow-hidden flex items-center justify-center p-2 group">
        <img
          src={product.image || defaultImage}
          alt={product.name}
          className="w-full h-full object-contain object-center transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = defaultImage;
          }}
        />

        {/* Brand Badge */}
        <span className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-[10px] font-bold text-[#26352D] px-2 py-0.5 rounded-md border border-[#DCEBE0]/80 uppercase tracking-wider">
          {product.brand}
        </span>

        {/* Stock Status Badge */}
        {!product.inStock && (
          <span className="absolute bottom-2 right-2 bg-[#E45D5D] text-white text-[9px] font-semibold px-1.5 py-0.5 rounded shadow-sm">
            Out of Stock
          </span>
        )}
      </div>

      {/* Details Area */}
      <div className="p-2.5 flex flex-col flex-1 justify-between gap-2">
        <div>
          {/* Product Name */}
          <h4
            className="font-bold text-xs text-[#1B2820] line-clamp-1 hover:text-[#72C98A] transition-colors cursor-pointer"
            onClick={handleViewProduct}
            title={product.name}
          >
            {product.name}
          </h4>

          {/* Price */}
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-xs font-extrabold text-[#72C98A]">
              {product.formattedPrice}
            </span>
            {product.discountPrice &&
              product.discountPrice > 0 &&
              product.discountPrice < (product.basePrice || 0) && (
                <span className="text-[10px] text-[#718078] line-through">
                  Rs. {product.basePrice?.toLocaleString('en-LK')}
                </span>
              )}
          </div>

          {/* Sizes Tag */}
          <div className="flex items-center gap-1 mt-1 text-[10px] text-[#718078]">
            <Tag className="w-2.5 h-2.5 text-[#72C98A]" />
            <span className="truncate">
              Sizes:{' '}
              <strong className="text-[#26352D] font-medium">
                {product.sizes && product.sizes.length > 0
                  ? product.sizes.slice(0, 4).join(', ') + (product.sizes.length > 4 ? '...' : '')
                  : 'Check'}
              </strong>
            </span>
          </div>
        </div>

        {/* View Product CTA */}
        <button
          type="button"
          onClick={handleViewProduct}
          className="w-full flex items-center justify-center gap-1 bg-[#F2FAF4] hover:bg-[#72C98A] text-[#26352D] hover:text-white border border-[#DCEBE0] hover:border-[#72C98A] py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all duration-150"
        >
          <span>View Product</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
