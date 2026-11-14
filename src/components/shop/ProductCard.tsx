import type { FC, MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Eye, ShoppingBag } from 'lucide-react';
import type { Product, Brand } from '../../types';
import { formatLKR, calculateDiscountPercentage } from '../../utils/currency';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { toggleWishlist } from '../../store/slices/wishlistSlice';
import { addToCart } from '../../store/slices/cartSlice';
import { useToast } from '../../context/ToastContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: FC<ProductCardProps> = ({ product }) => {
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const { items: wishlistItems } = useAppSelector((state) => state.wishlist);

  const isWishlisted = wishlistItems.some((item) => item.productId === product.id);

  // Extract brand name safely
  const brandName = typeof product.brandId === 'object' && product.brandId !== null
    ? (product.brandId as Brand).name
    : 'STRIDEX';

  const defaultImage = product.images && product.images.length > 0 
    ? product.images[0] 
    : 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80';

  const hasDiscount = product.discountPrice > 0 && product.discountPrice < product.basePrice;
  const activePrice = hasDiscount ? product.discountPrice : product.basePrice;
  const discountPercent = hasDiscount
    ? calculateDiscountPercentage(product.basePrice, product.discountPrice)
    : 0;

  const isOutOfStock = product.totalStock !== undefined && product.totalStock <= 0;

  const handleWishlistToggle = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(
      toggleWishlist({
        productId: product.id,
        name: product.name,
        slug: product.slug,
        image: defaultImage,
        brandName,
        basePrice: product.basePrice,
        discountPrice: product.discountPrice || 0,
      })
    );
    if (isWishlisted) {
      showToast(`Removed "${product.name}" from your saved shoes`, 'info');
    } else {
      showToast(`Saved "${product.name}" to your wishlist!`, 'success');
    }
  };

  const handleQuickAdd = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isOutOfStock) {
      showToast('Sorry, this shoe is currently out of stock', 'error');
      return;
    }

    // Default to first variant if present, or create standard selection
    const firstVariant = product.variants && product.variants.length > 0 ? product.variants[0] : null;
    const selectedSize = firstVariant ? firstVariant.size : (product.availableSizes?.[0] || '42');
    const selectedColor = firstVariant ? firstVariant.color : (product.availableColors?.[0] || 'Standard');
    const maxStock = firstVariant ? firstVariant.stockQuantity : (product.totalStock || 10);

    dispatch(
      addToCart({
        id: `${product.id}-${selectedSize}-${selectedColor}`,
        productId: product.id,
        variantId: firstVariant?.id,
        name: product.name,
        slug: product.slug,
        image: defaultImage,
        brandName,
        size: selectedSize,
        color: selectedColor,
        price: activePrice,
        originalPrice: hasDiscount ? product.basePrice : undefined,
        quantity: 1,
        maxStock,
      })
    );

    showToast(`Added "${product.name}" (Size ${selectedSize}) to bag!`, 'success');
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-[#DCEBE0] hover:border-[#72C98A] transition-all duration-300 hover:shadow-lg flex flex-col justify-between overflow-hidden">
      {/* Upper Media Container */}
      <div className="relative aspect-square w-full bg-[#F2FAF4] overflow-hidden flex items-center justify-center p-4">
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start">
          {product.isFeatured && (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#26352D] text-white shadow-xs">
              Featured
            </span>
          )}
          {hasDiscount && (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#72C98A] text-white shadow-xs">
              {discountPercent}% OFF
            </span>
          )}
          {isOutOfStock && (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#E45D5D] text-white shadow-xs">
              Sold Out
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleWishlistToggle}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute top-3 right-3 z-10 p-2 rounded-full backdrop-blur-md transition-all ${
            isWishlisted
              ? 'bg-[#E45D5D] text-white shadow-sm'
              : 'bg-white/90 text-[#718078] hover:text-[#E45D5D] hover:bg-white shadow-xs'
          }`}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Product Image */}
        <Link to={`/product/${product.slug}`} className="w-full h-full flex items-center justify-center">
          <img
            src={defaultImage}
            alt={product.name}
            className={`w-full h-full object-contain transform transition-transform duration-500 group-hover:scale-105 ${
              isOutOfStock ? 'opacity-60 grayscale-[40%]' : ''
            }`}
            loading="lazy"
          />
        </Link>

        {/* Quick action bar overlay on hover */}
        <div className="absolute inset-x-3 bottom-3 z-10 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            type="button"
            onClick={handleQuickAdd}
            disabled={isOutOfStock}
            className="flex-1 py-2 px-3 rounded-xl bg-white/95 hover:bg-[#72C98A] text-[#26352D] hover:text-white border border-[#DCEBE0] hover:border-[#72C98A] text-xs font-bold shadow-md transition-all flex items-center justify-center space-x-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Quick Bag</span>
          </button>
          <Link
            to={`/product/${product.slug}`}
            className="p-2 rounded-xl bg-white/95 hover:bg-[#DDF3E2] text-[#26352D] border border-[#DCEBE0] text-xs shadow-md transition-all flex items-center justify-center"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Information Container */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Gender */}
          <div className="flex items-center justify-between text-[11px] text-[#718078] mb-1 font-medium">
            <span className="uppercase tracking-wider font-semibold text-[#59B976]">
              {brandName}
            </span>
            <span>{product.gender}</span>
          </div>

          {/* Product Name */}
          <Link
            to={`/product/${product.slug}`}
            className="block font-outfit font-bold text-sm sm:text-base text-[#26352D] hover:text-[#72C98A] transition-colors line-clamp-1"
            title={product.name}
          >
            {product.name}
          </Link>

          {/* Sizes preview if available */}
          {product.availableSizes && product.availableSizes.length > 0 && (
            <div className="mt-1.5 flex items-center gap-1 overflow-hidden">
              <span className="text-[10px] text-[#718078]">Sizes:</span>
              <div className="flex gap-1 overflow-x-auto no-scrollbar">
                {product.availableSizes.slice(0, 4).map((s, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] bg-[#F2FAF4] text-[#26352D] px-1.5 py-0.5 rounded border border-[#DCEBE0]"
                  >
                    {s}
                  </span>
                ))}
                {product.availableSizes.length > 4 && (
                  <span className="text-[10px] text-[#718078]">+{product.availableSizes.length - 4}</span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Pricing in Sri Lankan Rupees (LKR) */}
        <div className="mt-3 pt-3 border-t border-[#DCEBE0] flex items-baseline justify-between">
          <div className="flex items-baseline space-x-2">
            <span className="font-outfit text-base sm:text-lg font-extrabold text-[#26352D]">
              {formatLKR(activePrice)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-[#718078] line-through">
                {formatLKR(product.basePrice)}
              </span>
            )}
          </div>

          <span className="text-[10px] text-[#718078] font-semibold bg-[#F2FAF4] px-1.5 py-0.5 rounded border border-[#DCEBE0]">
            LKR
          </span>
        </div>
      </div>
    </div>
  );
};
