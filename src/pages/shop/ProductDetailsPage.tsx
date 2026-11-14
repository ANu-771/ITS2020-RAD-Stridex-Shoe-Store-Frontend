import { useState, useEffect, useMemo } from 'react';
import type { FC } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Heart, 
  ShoppingBag, 
  Truck, 
  ShieldCheck, 
  RefreshCw, 
  ChevronRight, 
  Minus, 
  Plus, 
  Star,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { productService } from '../../services/productService';
import type { Product, Brand, Category, ProductVariant } from '../../types';
import { formatLKR, calculateDiscountPercentage } from '../../utils/currency';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { addToCart } from '../../store/slices/cartSlice';
import { toggleWishlist } from '../../store/slices/wishlistSlice';
import { useToast } from '../../context/ToastContext';
import { ProductCard } from '../../components/shop/ProductCard';

export const ProductDetailsPage: FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const { items: wishlistItems } = useAppSelector((state) => state.wishlist);

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string | number>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'delivery'>('desc');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch Product Details
  useEffect(() => {
    if (!slug) return;
    const fetchProduct = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await productService.getById(slug);
        if (res.success && res.data) {
          const p = res.data;
          setProduct(p);
          const firstImg = p.images && p.images.length > 0 
            ? p.images[0] 
            : 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80';
          setSelectedImage(firstImg);

          // Initialize size and color from variants
          if (p.variants && p.variants.length > 0) {
            setSelectedSize(p.variants[0].size);
            setSelectedColor(p.variants[0].color);
          } else if (p.availableSizes && p.availableSizes.length > 0) {
            setSelectedSize(p.availableSizes[0]);
          }

          // Fetch related products in the same category
          const catId = typeof p.categoryId === 'object' && p.categoryId !== null 
            ? (p.categoryId as Category).id 
            : p.categoryId;
          
          if (catId) {
            productService.getAll({ category: String(catId), limit: 4 }).then((relatedRes) => {
              if (relatedRes.success) {
                setRelatedProducts(relatedRes.data.filter((item) => item.id !== p.id).slice(0, 4));
              }
            });
          }
        } else {
          setError('Product not found');
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load footwear details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  // Extract brand and category names
  const brand = product?.brandId as Brand | undefined;
  const category = product?.categoryId as Category | undefined;
  const brandName = typeof product?.brandId === 'object' && product?.brandId !== null
    ? (product.brandId as Brand).name
    : 'STRIDEX';
  const categoryName = typeof product?.categoryId === 'object' && product?.categoryId !== null
    ? (product.categoryId as Category).name
    : 'Footwear';

  const isWishlisted = product ? wishlistItems.some((item) => item.productId === product.id) : false;

  // Derive unique sizes and colors from variants
  const uniqueSizes = useMemo(() => {
    if (!product?.variants) return product?.availableSizes || [];
    const sizes = Array.from(new Set(product.variants.map((v) => v.size)));
    return sizes.sort((a, b) => Number(a) - Number(b));
  }, [product]);

  const uniqueColors = useMemo(() => {
    if (!product?.variants) return product?.availableColors || [];
    return Array.from(new Set(product.variants.map((v) => v.color)));
  }, [product]);

  // Find exact active variant
  const activeVariant: ProductVariant | undefined = useMemo(() => {
    if (!product?.variants) return undefined;
    return product.variants.find(
      (v) => String(v.size) === String(selectedSize) && v.color.toLowerCase() === selectedColor.toLowerCase()
    );
  }, [product, selectedSize, selectedColor]);

  // Stock Calculation
  const currentStock = activeVariant
    ? activeVariant.stockQuantity - (activeVariant.reservedQuantity || 0)
    : (product?.totalStock ?? 10);

  const isOutOfStock = currentStock <= 0;

  // Price Calculations in Sri Lankan Rupees
  const hasDiscount = Boolean(product && product.discountPrice > 0 && product.discountPrice < product.basePrice);
  const activePrice = hasDiscount && product ? product.discountPrice : (product?.basePrice ?? 0);
  const discountPercent = hasDiscount && product
    ? calculateDiscountPercentage(product.basePrice, product.discountPrice)
    : 0;
  const savingsAmount = hasDiscount && product ? product.basePrice - product.discountPrice : 0;

  const handleAddToCart = () => {
    if (!product) return;
    if (isOutOfStock) {
      showToast('This size/color combination is currently out of stock', 'error');
      return;
    }

    dispatch(
      addToCart({
        id: `${product.id}-${selectedSize}-${selectedColor}`,
        productId: product.id,
        variantId: activeVariant?.id,
        name: product.name,
        slug: product.slug,
        image: selectedImage || (product.images?.[0] ?? ''),
        brandName,
        size: selectedSize || 'Standard',
        color: selectedColor || 'Standard',
        price: activePrice,
        originalPrice: hasDiscount ? product.basePrice : undefined,
        quantity,
        maxStock: currentStock,
      })
    );

    showToast(`Added ${quantity}x "${product.name}" (Size ${selectedSize}) to bag!`, 'success');
  };

  const handleWishlistToggle = () => {
    if (!product) return;
    dispatch(
      toggleWishlist({
        productId: product.id,
        name: product.name,
        slug: product.slug,
        image: selectedImage || (product.images?.[0] ?? ''),
        brandName,
        basePrice: product.basePrice,
        discountPrice: product.discountPrice || 0,
      })
    );
    if (isWishlisted) {
      showToast(`Removed from saved shoes`, 'info');
    } else {
      showToast(`Added "${product.name}" to your wishlist!`, 'success');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F2FAF4] py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse">
          <div className="aspect-square bg-white rounded-3xl border border-[#DCEBE0]" />
          <div className="space-y-6">
            <div className="h-4 bg-[#E8F3EB] rounded w-1/4" />
            <div className="h-8 bg-[#E8F3EB] rounded w-3/4" />
            <div className="h-6 bg-[#E8F3EB] rounded w-1/3" />
            <div className="h-24 bg-[#E8F3EB] rounded" />
            <div className="h-12 bg-[#E8F3EB] rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#F2FAF4] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl border border-[#DCEBE0] p-10 max-w-md text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-[#E45D5D]/10 text-[#E45D5D] flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="font-outfit font-bold text-2xl text-[#26352D]">Product Unavailable</h2>
          <p className="text-xs text-[#718078]">
            {error || 'We could not locate this shoe. It may have been archived or removed.'}
          </p>
          <Link
            to="/shop"
            className="inline-block px-6 py-2.5 bg-[#72C98A] text-white text-xs font-bold rounded-xl hover:bg-[#59B976] transition-all"
          >
            Return to Store
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2FAF4] py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-xs text-[#718078] mb-6 overflow-x-auto whitespace-nowrap">
        <Link to="/" className="hover:text-[#72C98A] transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#DCEBE0]" />
        <Link to="/shop" className="hover:text-[#72C98A] transition-colors">Shop</Link>
        {category && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-[#DCEBE0]" />
            <Link to={`/category/${category.slug}`} className="hover:text-[#72C98A] transition-colors">
              {categoryName}
            </Link>
          </>
        )}
        <ChevronRight className="w-3.5 h-3.5 text-[#DCEBE0]" />
        <span className="text-[#26352D] font-semibold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Showcase Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 bg-white rounded-3xl border border-[#DCEBE0] p-6 sm:p-10 shadow-xs mb-16">
        {/* ======================================================== */}
        {/* LEFT: IMAGE GALLERY (MAIN + THUMBNAILS)                 */}
        {/* ======================================================== */}
        <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
          {/* Thumbnails strip */}
          {product.images && product.images.length > 1 && (
            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto max-h-[500px] no-scrollbar">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImage(img)}
                  className={`relative w-18 h-18 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 transition-all p-1.5 bg-[#F2FAF4] shrink-0 ${
                    selectedImage === img
                      ? 'border-[#72C98A] shadow-sm'
                      : 'border-[#DCEBE0] hover:border-[#72C98A]/50 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`${product.name} thumbnail ${idx + 1}`} className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}

          {/* Large Hero Display */}
          <div className="relative flex-1 aspect-square rounded-2xl bg-[#F2FAF4] border border-[#DCEBE0] flex items-center justify-center p-6 sm:p-10 overflow-hidden">
            {/* Top Badges */}
            <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
              {product.isFeatured && (
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#26352D] text-white shadow-xs">
                  Featured Drop
                </span>
              )}
              {hasDiscount && (
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#72C98A] text-white shadow-xs">
                  {discountPercent}% OFF
                </span>
              )}
            </div>

            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-full object-contain transition-transform duration-500 hover:scale-105"
            />
          </div>
        </div>

        {/* ======================================================== */}
        {/* RIGHT: PRODUCT DETAILS & PURCHASE CONTROLS               */}
        {/* ======================================================== */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Brand & Category Tags */}
            <div className="flex items-center justify-between">
              <Link
                to={`/shop?brand=${brand?.slug || brandName}`}
                className="text-xs font-bold tracking-widest uppercase text-[#59B976] hover:underline"
              >
                {brandName}
              </Link>
              <div className="flex items-center space-x-1 text-amber-500 text-xs font-bold">
                <Star className="w-4 h-4 fill-current" />
                <span>4.9</span>
                <span className="text-[#718078] font-normal">(128 reviews)</span>
              </div>
            </div>

            {/* Shoe Name */}
            <h1 className="font-outfit text-2xl sm:text-3xl font-extrabold text-[#26352D] leading-tight">
              {product.name}
            </h1>

            {/* Sri Lankan Rupee Pricing */}
            <div className="flex items-baseline space-x-3 pt-1">
              <span className="font-outfit text-3xl font-extrabold text-[#26352D]">
                {formatLKR(activePrice)}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-base text-[#718078] line-through">
                    {formatLKR(product.basePrice)}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#DDF3E2] text-[#35A866] border border-[#BDECCB]">
                    Save {formatLKR(savingsAmount)}
                  </span>
                </>
              )}
            </div>

            {/* Quick Specs summary */}
            <div className="flex flex-wrap gap-2 pt-2 text-xs text-[#718078]">
              <span className="bg-[#F2FAF4] px-3 py-1 rounded-full border border-[#DCEBE0]">
                Gender: <strong className="text-[#26352D]">{product.gender}</strong>
              </span>
              {product.material && (
                <span className="bg-[#F2FAF4] px-3 py-1 rounded-full border border-[#DCEBE0]">
                  Material: <strong className="text-[#26352D]">{product.material}</strong>
                </span>
              )}
            </div>

            {/* Color Selector */}
            {uniqueColors.length > 0 && (
              <div className="pt-2">
                <div className="flex justify-between text-xs font-bold text-[#26352D] uppercase tracking-wider mb-2">
                  <span>Selected Color: <strong className="text-[#72C98A]">{selectedColor}</strong></span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {uniqueColors.map((col) => (
                    <button
                      key={col}
                      type="button"
                      onClick={() => setSelectedColor(col)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                        selectedColor === col
                          ? 'border-[#72C98A] bg-[#DDF3E2] text-[#26352D] shadow-xs'
                          : 'border-[#DCEBE0] text-[#718078] hover:border-[#72C98A]'
                      }`}
                    >
                      {col}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selector */}
            {uniqueSizes.length > 0 && (
              <div className="pt-2">
                <div className="flex justify-between text-xs font-bold text-[#26352D] uppercase tracking-wider mb-2">
                  <span>Select EU Size: <strong className="text-[#72C98A]">{selectedSize}</strong></span>
                  <Link to="/contact#faq" className="text-[11px] text-[#72C98A] hover:underline normal-case">
                    Size Guide
                  </Link>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {uniqueSizes.map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setSelectedSize(sz)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                        selectedSize === sz
                          ? 'border-[#26352D] bg-[#26352D] text-white shadow-xs'
                          : 'border-[#DCEBE0] text-[#26352D] hover:border-[#72C98A] hover:bg-[#F2FAF4]'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Live Stock & SKU Status */}
            <div className="pt-2 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                {isOutOfStock ? (
                  <span className="flex items-center space-x-1.5 text-[#E45D5D] font-bold">
                    <AlertCircle className="w-4 h-4" />
                    <span>Out of Stock</span>
                  </span>
                ) : (
                  <span className="flex items-center space-x-1.5 text-[#35A866] font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>In Stock ({currentStock} pairs available)</span>
                  </span>
                )}
              </div>
              {activeVariant?.SKU && (
                <span className="text-[11px] text-[#718078]">
                  SKU: <strong className="font-mono text-[#26352D]">{activeVariant.SKU}</strong>
                </span>
              )}
            </div>

            {/* Quantity Selector & Add to Bag CTA */}
            <div className="pt-4 flex items-center gap-3">
              <div className="flex items-center border border-[#DCEBE0] rounded-2xl bg-[#F2FAF4] p-1">
                <button
                  type="button"
                  disabled={quantity <= 1 || isOutOfStock}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-2 text-[#718078] hover:text-[#26352D] disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center font-outfit font-bold text-sm text-[#26352D]">
                  {quantity}
                </span>
                <button
                  type="button"
                  disabled={quantity >= currentStock || isOutOfStock}
                  onClick={() => setQuantity((q) => Math.min(currentStock, q + 1))}
                  className="p-2 text-[#718078] hover:text-[#26352D] disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="flex-1 py-3.5 px-6 rounded-2xl bg-[#72C98A] hover:bg-[#59B976] text-white font-bold text-sm shadow-lg shadow-green-500/20 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>{isOutOfStock ? 'Sold Out' : 'Add to Bag'}</span>
              </button>

              {/* Wishlist Button */}
              <button
                type="button"
                onClick={handleWishlistToggle}
                aria-label="Save shoe"
                className={`p-3.5 rounded-2xl border transition-all ${
                  isWishlisted
                    ? 'bg-[#E45D5D] text-white border-[#E45D5D]'
                    : 'bg-white border-[#DCEBE0] text-[#718078] hover:text-[#E45D5D] hover:border-[#E45D5D]'
                }`}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>

          {/* Delivery & Assurance Micro-Cards */}
          <div className="pt-4 border-t border-[#DCEBE0] grid grid-cols-3 gap-2 text-center text-[11px] text-[#718078]">
            <div className="p-2 rounded-xl bg-[#F2FAF4] border border-[#DCEBE0] flex flex-col items-center">
              <Truck className="w-4 h-4 text-[#72C98A] mb-1" />
              <span>Island-wide Express</span>
            </div>
            <div className="p-2 rounded-xl bg-[#F2FAF4] border border-[#DCEBE0] flex flex-col items-center">
              <ShieldCheck className="w-4 h-4 text-[#72C98A] mb-1" />
              <span>100% Authentic</span>
            </div>
            <div className="p-2 rounded-xl bg-[#F2FAF4] border border-[#DCEBE0] flex flex-col items-center">
              <RefreshCw className="w-4 h-4 text-[#72C98A] mb-1" />
              <span>30-Day Size Swaps</span>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* TABS: DESCRIPTION, SPECS & ISLAND-WIDE DELIVERY          */}
      {/* ======================================================== */}
      <div className="bg-white rounded-3xl border border-[#DCEBE0] p-6 sm:p-10 shadow-xs mb-16">
        <div className="flex border-b border-[#DCEBE0] gap-6 text-sm font-bold">
          <button
            onClick={() => setActiveTab('desc')}
            className={`pb-4 border-b-2 transition-all ${
              activeTab === 'desc'
                ? 'border-[#72C98A] text-[#26352D]'
                : 'border-transparent text-[#718078] hover:text-[#26352D]'
            }`}
          >
            Product Overview
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`pb-4 border-b-2 transition-all ${
              activeTab === 'specs'
                ? 'border-[#72C98A] text-[#26352D]'
                : 'border-transparent text-[#718078] hover:text-[#26352D]'
            }`}
          >
            Material & Construction
          </button>
          <button
            onClick={() => setActiveTab('delivery')}
            className={`pb-4 border-b-2 transition-all ${
              activeTab === 'delivery'
                ? 'border-[#72C98A] text-[#26352D]'
                : 'border-transparent text-[#718078] hover:text-[#26352D]'
            }`}
          >
            Delivery & Sri Lanka Policy
          </button>
        </div>

        <div className="pt-6">
          {activeTab === 'desc' && (
            <div className="space-y-4 text-sm text-[#718078] leading-relaxed">
              <p className="text-base text-[#26352D] font-medium">{product.description}</p>
              <p>
                The {product.name} delivers athletic precision combined with trendsetting streetwear architecture. Engineered to maximize breathability, step stability, and responsive energy rebound whether you are conquering marathon pavements or elevating urban ensembles.
              </p>
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-[#26352D]">
              <div className="p-4 rounded-2xl bg-[#F2FAF4] border border-[#DCEBE0] space-y-1">
                <span className="text-[#718078] font-bold uppercase">Upper Material</span>
                <p className="font-semibold text-sm">{product.material || 'Engineered Breathable Mesh & Synthetic Overlays'}</p>
              </div>
              <div className="p-4 rounded-2xl bg-[#F2FAF4] border border-[#DCEBE0] space-y-1">
                <span className="text-[#718078] font-bold uppercase">Target Gender</span>
                <p className="font-semibold text-sm">{product.gender}</p>
              </div>
              <div className="p-4 rounded-2xl bg-[#F2FAF4] border border-[#DCEBE0] space-y-1">
                <span className="text-[#718078] font-bold uppercase">Midsole Cushioning</span>
                <p className="font-semibold text-sm">STRIDEX Dual-Density Responsive Phylon Foam</p>
              </div>
              <div className="p-4 rounded-2xl bg-[#F2FAF4] border border-[#DCEBE0] space-y-1">
                <span className="text-[#718078] font-bold uppercase">Outsole Traction</span>
                <p className="font-semibold text-sm">Abrasion-Resistant Multi-Directional Gum Rubber</p>
              </div>
            </div>
          )}

          {activeTab === 'delivery' && (
            <div className="space-y-3 text-xs text-[#718078] leading-relaxed">
              <p>
                <strong>Island-wide Express Shipping:</strong> Colombo 1–15 orders are delivered within 24 to 48 hours. Island-wide regional deliveries (Kandy, Galle, Jaffna, Kurunegala, etc.) typically arrive within 2–4 business days via verified courier partners.
              </p>
              <p>
                <strong>Free Delivery Eligibility:</strong> Orders exceeding <strong>Rs. 15,000.00</strong> receive complimentary island-wide shipping.
              </p>
              <p>
                <strong>30-Day Size Exchange:</strong> Unworn footwear in original packaging may be exchanged for alternative sizes at our Colombo Flagship Showroom or via door-to-door courier swap.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* RELATED SHOES SECTION                                    */}
      {/* ======================================================== */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-outfit text-2xl font-extrabold text-[#26352D]">
              You May Also Like
            </h2>
            <Link
              to="/shop"
              className="text-xs font-bold text-[#72C98A] hover:text-[#59B976] flex items-center space-x-1"
            >
              <span>View All Footwear</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
