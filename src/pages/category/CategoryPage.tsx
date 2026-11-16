import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, SlidersHorizontal } from 'lucide-react';
import { ShoeAvatarIcon } from '../../components/common/ShoeAvatarIcon';
import { categoryService } from '../../services/categoryService';
import { productService } from '../../services/productService';
import type { Category, Product } from '../../types';
import { ProductCard } from '../../components/shop/ProductCard';
import { ProductSkeleton } from '../../components/shop/ProductSkeleton';

export const CategoryPage: FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!slug) return;
    const loadCategoryData = async () => {
      setIsLoading(true);
      try {
        const [catRes, prodRes] = await Promise.all([
          categoryService.getById(slug),
          productService.getAll({ category: slug, limit: 20 }),
        ]);
        if (catRes.success) setCategory(catRes.data);
        if (prodRes.success) setProducts(prodRes.data);
      } catch (err) {
        console.error('Failed to load category', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadCategoryData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  return (
    <div className="min-h-screen bg-[#F2FAF4] py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Back to Shop */}
      <div className="mb-6">
        <Link
          to="/shop"
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#718078] hover:text-[#26352D] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Shoes</span>
        </Link>
      </div>

      {/* Category Hero Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#DDF3E2] via-white to-[#F2FAF4] border border-[#DCEBE0] p-8 sm:p-12 mb-10 overflow-hidden shadow-xs">
        <div className="max-w-2xl relative z-10 space-y-3">
          <div className="inline-flex items-center space-x-2 text-xs font-bold text-[#72C98A] uppercase tracking-widest bg-white px-3 py-1 rounded-full border border-[#DCEBE0]">
            <ShoeAvatarIcon className="w-3.5 h-3.5" />
            <span>Category Spotlight</span>
          </div>
          <h1 className="font-outfit text-3xl sm:text-4xl font-extrabold text-[#26352D]">
            {category?.name || 'Footwear Category'}
          </h1>
          <p className="text-sm text-[#718078] leading-relaxed">
            {category?.description || 'Browse our specialized selection designed for optimum athletic performance and modern aesthetic appeal.'}
          </p>
        </div>

        {/* Quick link to Filtered Shop */}
        <div className="mt-6 flex items-center space-x-4">
          <Link
            to={`/shop?category=${slug}`}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#72C98A] hover:bg-[#59B976] text-white text-xs font-bold shadow-sm transition-all"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Refine & Filter in Shop</span>
          </Link>
        </div>
      </div>

      {/* Product List */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-outfit text-xl font-bold text-[#26352D]">
            Available Models ({products.length})
          </h2>
          <span className="text-xs text-[#718078]">Prices in Sri Lankan Rupees (LKR)</span>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#DCEBE0] p-12 text-center space-y-4">
            <h3 className="font-outfit font-bold text-lg text-[#26352D]">No products found</h3>
            <p className="text-xs text-[#718078]">
              We haven't added models to this category yet. Check back soon!
            </p>
            <Link
              to="/shop"
              className="inline-block px-5 py-2.5 bg-[#72C98A] text-white text-xs font-bold rounded-xl"
            >
              Explore Other Categories
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
