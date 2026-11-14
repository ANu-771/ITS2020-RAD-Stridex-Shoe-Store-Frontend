import { useState, useEffect, useCallback } from 'react';
import type { FC } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Filter, 
  X, 
  SlidersHorizontal, 
  RotateCcw, 
  Search, 
  ChevronLeft, 
  ChevronRight,
  Heart,
  PackageOpen
} from 'lucide-react';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { brandService } from '../../services/brandService';
import type { Product, Category, Brand, ProductGender } from '../../types';
import { ProductCard } from '../../components/shop/ProductCard';
import { ProductSkeleton } from '../../components/shop/ProductSkeleton';
import { formatLKR } from '../../utils/currency';
import { useAppSelector } from '../../hooks/reduxHooks';

const SIZES = [38, 39, 40, 41, 42, 43, 44, 45, 46];
const COLORS = ['Black', 'White', 'Blue', 'Red', 'Grey', 'Green', 'Navy', 'Beige'];
const GENDERS: { label: string; value: ProductGender | '' }[] = [
  { label: 'All Genders', value: '' },
  { label: 'Men', value: 'MEN' },
  { label: 'Women', value: 'WOMEN' },
  { label: 'Unisex', value: 'UNISEX' },
  { label: 'Kids', value: 'KIDS' },
];

export const ShopPage: FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { items: wishlistItems } = useAppSelector((state) => state.wishlist);

  // Filter States
  const [search, setSearch] = useState<string>(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('category') || '');
  const [selectedBrand, setSelectedBrand] = useState<string>(searchParams.get('brand') || '');
  const [selectedGender, setSelectedGender] = useState<string>(searchParams.get('gender') || '');
  const [selectedSize, setSelectedSize] = useState<string>(searchParams.get('size') || '');
  const [selectedColor, setSelectedColor] = useState<string>(searchParams.get('color') || '');
  const [minPrice, setMinPrice] = useState<string>(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState<string>(searchParams.get('maxPrice') || '');
  const [sortBy, setSortBy] = useState<'newest' | 'price_asc' | 'price_desc' | 'name_asc'>(
    (searchParams.get('sort') as any) || 'newest'
  );
  const [currentPage, setCurrentPage] = useState<number>(Number(searchParams.get('page')) || 1);
  const isWishlistFilter = searchParams.get('filter') === 'wishlist';

  // Data States
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  // Load Categories & Brands Once
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [catRes, brandRes] = await Promise.all([
          categoryService.getAll({ active: true }),
          brandService.getAll({ active: true }),
        ]);
        if (catRes.success) setCategories(catRes.data);
        if (brandRes.success) setBrands(brandRes.data);
      } catch (err) {
        console.error('Failed to load shop filter metadata', err);
      }
    };
    fetchMetadata();
  }, []);

  // Sync state when URL params change externally (e.g. clicking a link in Navbar or Footer)
  useEffect(() => {
    setSearch(searchParams.get('search') || '');
    setSelectedCategory(searchParams.get('category') || '');
    setSelectedBrand(searchParams.get('brand') || '');
    setSelectedGender(searchParams.get('gender') || '');
    setSelectedSize(searchParams.get('size') || '');
    setSelectedColor(searchParams.get('color') || '');
    setMinPrice(searchParams.get('minPrice') || '');
    setMaxPrice(searchParams.get('maxPrice') || '');
    if (searchParams.get('sort')) {
      setSortBy(searchParams.get('sort') as any);
    }
    if (searchParams.get('page')) {
      setCurrentPage(Number(searchParams.get('page')) || 1);
    }
  }, [searchParams]);

  // Fetch Products from Backend API
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: any = {
        page: currentPage,
        limit: 12,
        sort: sortBy,
      };

      if (search) params.search = search;
      if (selectedCategory) params.category = selectedCategory;
      if (selectedBrand) params.brand = selectedBrand;
      if (selectedGender) params.gender = selectedGender;
      if (selectedSize) params.size = selectedSize;
      if (selectedColor) params.color = selectedColor;
      if (minPrice) params.minPrice = Number(minPrice);
      if (maxPrice) params.maxPrice = Number(maxPrice);
      if (searchParams.get('filter') === 'featured') params.featured = true;

      const res = await productService.getAll(params);
      if (res.success) {
        let items = res.data;
        // If wishlist filter active, filter locally to wishlisted products
        if (isWishlistFilter) {
          const wishIds = new Set(wishlistItems.map((w) => w.productId));
          items = items.filter((p) => wishIds.has(p.id));
        }
        setProducts(items);
        setTotalPages(res.pagination.totalPages || 1);
        setTotalItems(isWishlistFilter ? items.length : res.pagination.totalItems || items.length);
      }
    } catch (err) {
      console.error('Failed to fetch products', err);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, [
    currentPage,
    sortBy,
    search,
    selectedCategory,
    selectedBrand,
    selectedGender,
    selectedSize,
    selectedColor,
    minPrice,
    maxPrice,
    searchParams,
    isWishlistFilter,
    wishlistItems,
  ]);

  useEffect(() => {
    fetchProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [fetchProducts]);

  // Update URL search parameters
  const updateParams = (newParams: Record<string, string | null>) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([k, v]) => {
      if (!v) {
        next.delete(k);
      } else {
        next.set(k, v);
      }
    });
    // Reset to page 1 on filter changes unless changing page
    if (!('page' in newParams)) {
      next.set('page', '1');
      setCurrentPage(1);
    }
    setSearchParams(next);
  };

  const handleResetFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setSelectedBrand('');
    setSelectedGender('');
    setSelectedSize('');
    setSelectedColor('');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('newest');
    setCurrentPage(1);
    setSearchParams(new URLSearchParams());
  };

  const activeFilterCount = [
    selectedCategory,
    selectedBrand,
    selectedGender,
    selectedSize,
    selectedColor,
    minPrice,
    maxPrice,
    search,
    isWishlistFilter ? 'wishlist' : null,
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-[#F2FAF4] py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Top Banner & Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#DCEBE0]">
          <div>
            <div className="inline-flex items-center space-x-2 text-xs font-bold text-[#72C98A] uppercase tracking-widest mb-1">
              <span>Official STRIDEX Footwear Collection</span>
            </div>
            <h1 className="font-outfit text-3xl sm:text-4xl font-extrabold text-[#26352D]">
              {isWishlistFilter ? 'Your Saved Footwear' : 'Explore All Footwear'}
            </h1>
            <p className="text-[#718078] text-sm mt-1 max-w-xl">
              {isWishlistFilter
                ? 'Review and manage your dream footwear collection before it sells out.'
                : 'Browse our complete catalog of authentic athletic, lifestyle, and performance shoes. All prices in Sri Lankan Rupees (LKR).'}
            </p>
          </div>

          {/* Quick Stats & Mobile Filter Button */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white border border-[#DCEBE0] text-xs font-bold text-[#26352D] hover:border-[#72C98A] shadow-xs"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#72C98A]" />
              <span>Filters ({activeFilterCount})</span>
            </button>

            {/* Desktop Sort Dropdown */}
            <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-xl border border-[#DCEBE0] shadow-xs">
              <span className="text-xs text-[#718078] hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => {
                  const val = e.target.value as any;
                  setSortBy(val);
                  updateParams({ sort: val });
                }}
                className="bg-transparent text-xs font-semibold text-[#26352D] focus:outline-none cursor-pointer"
              >
                <option value="newest">Newest Drops</option>
                <option value="price_asc">Price: Low to High (LKR)</option>
                <option value="price_desc">Price: High to Low (LKR)</option>
                <option value="name_asc">Alphabetical (A - Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filter Pills Bar */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-4">
            <span className="text-xs font-semibold text-[#718078]">Active Filters:</span>

            {search && (
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white border border-[#DCEBE0] text-[#26352D]">
                <span>Search: "{search}"</span>
                <button onClick={() => updateParams({ search: null })}>
                  <X className="w-3 h-3 text-[#718078] hover:text-[#26352D]" />
                </button>
              </span>
            )}

            {selectedCategory && (
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white border border-[#DCEBE0] text-[#26352D]">
                <span>Category: {categories.find((c) => c.slug === selectedCategory || c.id === selectedCategory)?.name || selectedCategory}</span>
                <button onClick={() => updateParams({ category: null })}>
                  <X className="w-3 h-3 text-[#718078] hover:text-[#26352D]" />
                </button>
              </span>
            )}

            {selectedBrand && (
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white border border-[#DCEBE0] text-[#26352D]">
                <span>Brand: {brands.find((b) => b.slug === selectedBrand || b.id === selectedBrand)?.name || selectedBrand}</span>
                <button onClick={() => updateParams({ brand: null })}>
                  <X className="w-3 h-3 text-[#718078] hover:text-[#26352D]" />
                </button>
              </span>
            )}

            {selectedGender && (
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white border border-[#DCEBE0] text-[#26352D]">
                <span>Gender: {selectedGender}</span>
                <button onClick={() => updateParams({ gender: null })}>
                  <X className="w-3 h-3 text-[#718078] hover:text-[#26352D]" />
                </button>
              </span>
            )}

            {selectedSize && (
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white border border-[#DCEBE0] text-[#26352D]">
                <span>Size: EU {selectedSize}</span>
                <button onClick={() => updateParams({ size: null })}>
                  <X className="w-3 h-3 text-[#718078] hover:text-[#26352D]" />
                </button>
              </span>
            )}

            {selectedColor && (
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white border border-[#DCEBE0] text-[#26352D]">
                <span>Color: {selectedColor}</span>
                <button onClick={() => updateParams({ color: null })}>
                  <X className="w-3 h-3 text-[#718078] hover:text-[#26352D]" />
                </button>
              </span>
            )}

            {(minPrice || maxPrice) && (
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white border border-[#DCEBE0] text-[#26352D]">
                <span>
                  Price: {minPrice ? formatLKR(Number(minPrice)) : 'Rs. 0'} - {maxPrice ? formatLKR(Number(maxPrice)) : 'Any'}
                </span>
                <button onClick={() => updateParams({ minPrice: null, maxPrice: null })}>
                  <X className="w-3 h-3 text-[#718078] hover:text-[#26352D]" />
                </button>
              </span>
            )}

            {isWishlistFilter && (
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#DDF3E2] border border-[#BDECCB] text-[#26352D]">
                <Heart className="w-3 h-3 text-[#E45D5D] fill-current" />
                <span>Wishlist Only</span>
                <button onClick={() => updateParams({ filter: null })}>
                  <X className="w-3 h-3 text-[#718078] hover:text-[#26352D]" />
                </button>
              </span>
            )}

            <button
              onClick={handleResetFilters}
              className="inline-flex items-center space-x-1 text-xs text-[#E45D5D] hover:underline font-semibold ml-2 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset All</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Grid: Left Filters Sidebar + Right Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* ========================================================= */}
        {/* DESKTOP FILTER SIDEBAR                                    */}
        {/* ========================================================= */}
        <aside className="hidden lg:block lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl border border-[#DCEBE0] p-6 shadow-xs sticky top-28 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#DCEBE0]">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-[#72C98A]" />
                <h3 className="font-outfit font-bold text-base text-[#26352D]">Filter Shoes</h3>
              </div>
              {activeFilterCount > 0 && (
                <button
                  onClick={handleResetFilters}
                  className="text-xs text-[#718078] hover:text-[#E45D5D] transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Keyword Search */}
            <div>
              <label className="block text-xs font-bold text-[#26352D] uppercase tracking-wider mb-2">
                Search
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') updateParams({ search: search.trim() || null });
                  }}
                  placeholder="e.g. Nike, Adizero..."
                  className="w-full px-3 py-2 pl-8 rounded-xl bg-[#F2FAF4] border border-[#DCEBE0] focus:border-[#72C98A] focus:outline-none text-xs text-[#26352D]"
                />
                <Search className="w-3.5 h-3.5 text-[#718078] absolute left-2.5 top-2.5" />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-xs font-bold text-[#26352D] uppercase tracking-wider mb-2">
                Categories
              </label>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('');
                    updateParams({ category: null });
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    !selectedCategory ? 'bg-[#DDF3E2] text-[#26352D] font-bold' : 'text-[#718078] hover:bg-[#F2FAF4]'
                  }`}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(cat.slug);
                      updateParams({ category: cat.slug });
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                      selectedCategory === cat.slug || selectedCategory === cat.id
                        ? 'bg-[#DDF3E2] text-[#26352D] font-bold'
                        : 'text-[#718078] hover:bg-[#F2FAF4]'
                    }`}
                  >
                    <span>{cat.name}</span>
                    {cat.productCount !== undefined && (
                      <span className="text-[10px] text-[#718078] bg-white/70 px-1.5 py-0.2 rounded">
                        {cat.productCount}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Brand Filter */}
            <div>
              <label className="block text-xs font-bold text-[#26352D] uppercase tracking-wider mb-2">
                Brands
              </label>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedBrand('');
                    updateParams({ brand: null });
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    !selectedBrand ? 'bg-[#DDF3E2] text-[#26352D] font-bold' : 'text-[#718078] hover:bg-[#F2FAF4]'
                  }`}
                >
                  All Partner Brands
                </button>
                {brands.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => {
                      setSelectedBrand(b.slug);
                      updateParams({ brand: b.slug });
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                      selectedBrand === b.slug || selectedBrand === b.id
                        ? 'bg-[#DDF3E2] text-[#26352D] font-bold'
                        : 'text-[#718078] hover:bg-[#F2FAF4]'
                    }`}
                  >
                    <span>{b.name}</span>
                    {b.productCount !== undefined && (
                      <span className="text-[10px] text-[#718078] bg-white/70 px-1.5 py-0.2 rounded">
                        {b.productCount}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Gender Filter */}
            <div>
              <label className="block text-xs font-bold text-[#26352D] uppercase tracking-wider mb-2">
                Gender
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {GENDERS.map((g) => (
                  <button
                    key={g.label}
                    type="button"
                    onClick={() => {
                      setSelectedGender(g.value);
                      updateParams({ gender: g.value || null });
                    }}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors text-center border ${
                      selectedGender === g.value
                        ? 'bg-[#72C98A] text-white border-[#72C98A] font-bold shadow-xs'
                        : 'border-[#DCEBE0] text-[#718078] hover:bg-[#F2FAF4]'
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            {/* EU Size Filter */}
            <div>
              <label className="block text-xs font-bold text-[#26352D] uppercase tracking-wider mb-2">
                EU Shoe Size
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {SIZES.map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => {
                      const next = selectedSize === String(sz) ? '' : String(sz);
                      setSelectedSize(next);
                      updateParams({ size: next || null });
                    }}
                    className={`py-1.5 rounded-lg text-xs font-semibold text-center border transition-all ${
                      selectedSize === String(sz)
                        ? 'bg-[#26352D] text-white border-[#26352D] shadow-xs'
                        : 'border-[#DCEBE0] text-[#26352D] hover:border-[#72C98A] hover:bg-[#F2FAF4]'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Filter */}
            <div>
              <label className="block text-xs font-bold text-[#26352D] uppercase tracking-wider mb-2">
                Color
              </label>
              <div className="flex flex-wrap gap-1.5">
                {COLORS.map((col) => (
                  <button
                    key={col}
                    type="button"
                    onClick={() => {
                      const next = selectedColor === col ? '' : col;
                      setSelectedColor(next);
                      updateParams({ color: next || null });
                    }}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                      selectedColor === col
                        ? 'bg-[#72C98A] text-white border-[#72C98A]'
                        : 'border-[#DCEBE0] text-[#26352D] hover:bg-[#F2FAF4]'
                    }`}
                  >
                    {col}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter in Sri Lankan Rupees (LKR) */}
            <div>
              <label className="block text-xs font-bold text-[#26352D] uppercase tracking-wider mb-2">
                Price Range (LKR)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-[#718078]">Min (Rs.)</span>
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="0"
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-[#F2FAF4] border border-[#DCEBE0] focus:border-[#72C98A] focus:outline-none text-[#26352D]"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-[#718078]">Max (Rs.)</span>
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="50000"
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-[#F2FAF4] border border-[#DCEBE0] focus:border-[#72C98A] focus:outline-none text-[#26352D]"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => updateParams({ minPrice: minPrice || null, maxPrice: maxPrice || null })}
                className="w-full mt-2.5 py-1.5 bg-[#DDF3E2] hover:bg-[#BDECCB] text-[#26352D] font-bold text-xs rounded-lg transition-colors"
              >
                Apply LKR Filter
              </button>
            </div>
          </div>
        </aside>

        {/* ========================================================= */}
        {/* RIGHT: PRODUCTS GRID                                      */}
        {/* ========================================================= */}
        <main className="lg:col-span-3 space-y-6">
          {/* Header count indicator */}
          <div className="flex items-center justify-between text-xs text-[#718078]">
            <span>
              Showing <strong className="text-[#26352D]">{products.length}</strong> of{' '}
              <strong className="text-[#26352D]">{totalItems}</strong> authentic footwear pairs
            </span>
            <span>Page {currentPage} of {totalPages}</span>
          </div>

          {/* Loading Skeletons */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          ) : products.length === 0 ? (
            /* Empty State */
            <div className="bg-white rounded-2xl border border-[#DCEBE0] p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#F2FAF4] flex items-center justify-center mx-auto text-[#718078]">
                <PackageOpen className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="font-outfit font-bold text-lg text-[#26352D]">
                  No shoes match your criteria
                </h3>
                <p className="text-xs text-[#718078] max-w-sm mx-auto">
                  We couldn't find any footwear matching your exact combination of filters or price range.
                </p>
              </div>
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-6 py-2.5 bg-[#72C98A] text-white text-xs font-bold rounded-xl hover:bg-[#59B976] shadow-sm transition-all"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            /* Active Products Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination Bar */}
          {totalPages > 1 && (
            <div className="pt-8 border-t border-[#DCEBE0] flex items-center justify-between">
              <button
                type="button"
                disabled={currentPage <= 1 || isLoading}
                onClick={() => {
                  const prev = Math.max(1, currentPage - 1);
                  setCurrentPage(prev);
                  updateParams({ page: String(prev) });
                }}
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-white border border-[#DCEBE0] text-xs font-bold text-[#26352D] hover:bg-[#F2FAF4] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <div className="flex items-center space-x-1.5">
                {Array.from({ length: totalPages }).map((_, i) => {
                  const pNum = i + 1;
                  return (
                    <button
                      key={pNum}
                      type="button"
                      onClick={() => {
                        setCurrentPage(pNum);
                        updateParams({ page: String(pNum) });
                      }}
                      className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${
                        currentPage === pNum
                          ? 'bg-[#72C98A] text-white shadow-xs'
                          : 'bg-white border border-[#DCEBE0] text-[#26352D] hover:bg-[#F2FAF4]'
                      }`}
                    >
                      {pNum}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                disabled={currentPage >= totalPages || isLoading}
                onClick={() => {
                  const next = Math.min(totalPages, currentPage + 1);
                  setCurrentPage(next);
                  updateParams({ page: String(next) });
                }}
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-white border border-[#DCEBE0] text-xs font-bold text-[#26352D] hover:bg-[#F2FAF4] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </main>
      </div>

      {/* ========================================================= */}
      {/* MOBILE FILTER MODAL DRAWER                                */}
      {/* ========================================================= */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            onClick={() => setMobileFilterOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
          />
          <div className="relative ml-auto w-full max-w-xs h-full bg-white shadow-2xl flex flex-col p-6 overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#DCEBE0]">
              <h3 className="font-outfit font-bold text-lg text-[#26352D]">Filter Footwear</h3>
              <button onClick={() => setMobileFilterOpen(false)} className="p-1 text-[#718078]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6 py-4">
              {/* Categories */}
              <div>
                <label className="block text-xs font-bold text-[#26352D] uppercase tracking-wider mb-2">
                  Category
                </label>
                <div className="space-y-1">
                  <button
                    onClick={() => {
                      setSelectedCategory('');
                      updateParams({ category: null });
                      setMobileFilterOpen(false);
                    }}
                    className="block w-full text-left py-1 text-xs text-[#26352D]"
                  >
                    All Categories
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        setSelectedCategory(c.slug);
                        updateParams({ category: c.slug });
                        setMobileFilterOpen(false);
                      }}
                      className="block w-full text-left py-1 text-xs text-[#718078] hover:text-[#26352D]"
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Brands */}
              <div>
                <label className="block text-xs font-bold text-[#26352D] uppercase tracking-wider mb-2">
                  Brand
                </label>
                <div className="space-y-1">
                  <button
                    onClick={() => {
                      setSelectedBrand('');
                      updateParams({ brand: null });
                      setMobileFilterOpen(false);
                    }}
                    className="block w-full text-left py-1 text-xs text-[#26352D]"
                  >
                    All Brands
                  </button>
                  {brands.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => {
                        setSelectedBrand(b.slug);
                        updateParams({ brand: b.slug });
                        setMobileFilterOpen(false);
                      }}
                      className="block w-full text-left py-1 text-xs text-[#718078] hover:text-[#26352D]"
                    >
                      {b.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reset */}
              <button
                onClick={() => {
                  handleResetFilters();
                  setMobileFilterOpen(false);
                }}
                className="w-full py-2.5 bg-[#E45D5D]/10 text-[#E45D5D] rounded-xl text-xs font-bold"
              >
                Reset All Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
