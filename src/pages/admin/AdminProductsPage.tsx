import { useState, useEffect, useCallback } from 'react';
import type { FC } from 'react';
import { 
  Plus, 
  Search, 
  Layers, 
  Edit, 
  Trash2, 
  Eye, 
  Package, 
  ChevronLeft, 
  ChevronRight,
  RefreshCw,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { ShoeAvatarIcon } from '../../components/common/ShoeAvatarIcon';
import { productService } from '../../services/productService';
import type { ProductQueryParams } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { brandService } from '../../services/brandService';
import { ProductFormModal } from './ProductFormModal';
import { ProductDetailsModal } from './ProductDetailsModal';
import { VariantManagerModal } from './VariantManagerModal';
import { ConfirmationModal } from '../../components/common/ConfirmationModal';
import { formatLKR } from '../../utils/currency';
import type { Product, Brand, Category, Pagination } from '../../types';

export const AdminProductsPage: FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    totalItems: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // Filters & Search
  const [search, setSearch] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [selectedSort, setSelectedSort] = useState<'newest' | 'price_asc' | 'price_desc'>('newest');

  // Loading & Error states
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [productToView, setProductToView] = useState<Product | null>(null);

  const [isVariantOpen, setIsVariantOpen] = useState(false);
  const [productForVariants, setProductForVariants] = useState<Product | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch metadata (Brands & Categories)
  const fetchMetadata = async () => {
    try {
      const [brandRes, catRes] = await Promise.all([
        brandService.getAll(),
        categoryService.getAll(),
      ]);
      setBrands(brandRes.data);
      setCategories(catRes.data);
    } catch {
      // Non-blocking metadata fetch
    }
  };

  // Fetch products
  const fetchProducts = useCallback(async (page: number = 1) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const params: ProductQueryParams = {
        page,
        limit: 10,
        search: search.trim() || undefined,
        brand: selectedBrand || undefined,
        category: selectedCategory || undefined,
        gender: selectedGender || undefined,
        sort: selectedSort,
      };

      const res = await productService.getAll(params);
      setProducts(res.data);
      setPagination(res.pagination);
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Failed to load products');
    } finally {
      setIsLoading(false);
    }
  }, [search, selectedBrand, selectedCategory, selectedGender, selectedSort]);

  useEffect(() => {
    fetchMetadata();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchProducts]);

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    try {
      await productService.delete(productToDelete.id);
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
      fetchProducts(pagination.page);
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Failed to delete product');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-3xl border border-[#DCEBE0] shadow-sm">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#DDF3E2] text-[#26352D] text-xs font-semibold mb-1">
            <Package className="w-3.5 h-3.5 text-[#72C98A]" />
            <span>Footwear Catalog Management</span>
          </div>
          <h1 className="font-outfit text-2xl sm:text-3xl font-extrabold text-[#26352D]">
            Products & Shoes Directory
          </h1>
          <p className="text-xs text-[#718078]">
            Manage shoe listings, specifications, LKR pricing, and sizing inventory
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => fetchProducts(pagination.page)}
            className="p-2.5 rounded-xl border border-[#DCEBE0] bg-[#F2FAF4] hover:bg-[#DDF3E2] text-[#26352D] transition-colors"
            title="Refresh Products"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => {
              setProductToEdit(null);
              setIsFormOpen(true);
            }}
            className="px-5 py-2.5 rounded-xl bg-[#72C98A] hover:bg-[#59B976] text-white text-xs font-bold shadow-md shadow-green-500/20 transition-all flex items-center space-x-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Shoe</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#DCEBE0] shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 text-xs">
        {/* Search */}
        <div className="relative lg:col-span-2">
          <Search className="w-4 h-4 text-[#718078] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search shoes by model or material..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#DCEBE0] bg-[#F2FAF4]/50 text-[#26352D] focus:outline-none focus:border-[#72C98A]"
          />
        </div>

        {/* Brand Filter */}
        <div>
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-[#DCEBE0] bg-white text-[#26352D] focus:outline-none focus:border-[#72C98A]"
          >
            <option value="">All Brands</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-[#DCEBE0] bg-white text-[#26352D] focus:outline-none focus:border-[#72C98A]"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Gender Filter */}
        <div>
          <select
            value={selectedGender}
            onChange={(e) => setSelectedGender(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-[#DCEBE0] bg-white text-[#26352D] focus:outline-none focus:border-[#72C98A]"
          >
            <option value="">All Genders</option>
            <option value="MEN">Men's Footwear</option>
            <option value="WOMEN">Women's Footwear</option>
            <option value="UNISEX">Unisex</option>
          </select>
        </div>

        {/* Sort */}
        <div>
          <select
            value={selectedSort}
            onChange={(e) => setSelectedSort(e.target.value as any)}
            className="w-full px-3 py-2 rounded-xl border border-[#DCEBE0] bg-white text-[#26352D] focus:outline-none focus:border-[#72C98A]"
          >
            <option value="newest">Newest First</option>
            <option value="price_asc">Price: Low to High (LKR)</option>
            <option value="price_desc">Price: High to Low (LKR)</option>
          </select>
        </div>
      </div>

      {/* Error notification */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-[#E45D5D]/10 border border-[#E45D5D]/20 text-[#E45D5D] text-xs">
          {errorMessage}
        </div>
      )}

      {/* Products Table Card */}
      <div className="bg-white rounded-3xl border border-[#DCEBE0] shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-8 h-8 border-3 border-[#72C98A] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-[#718078]">Loading footwear catalog from MongoDB Atlas...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <Package className="w-12 h-12 text-[#718078] mx-auto opacity-40" />
            <h3 className="font-outfit text-base font-bold text-[#26352D]">No Products Found</h3>
            <p className="text-xs text-[#718078] max-w-sm mx-auto">
              No shoe products match your filter criteria. Try clearing search filters or add a new shoe.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F2FAF4] text-[#718078] font-bold uppercase tracking-wider border-b border-[#DCEBE0]">
                <tr>
                  <th className="px-5 py-3.5">Shoe Item</th>
                  <th className="px-5 py-3.5">Brand & Category</th>
                  <th className="px-5 py-3.5">Price (LKR)</th>
                  <th className="px-5 py-3.5">Variants & Stock</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DCEBE0]">
                {products.map((p) => {
                  const brandObj = typeof p.brandId === 'object' ? (p.brandId as Brand) : null;
                  const catObj = typeof p.categoryId === 'object' ? (p.categoryId as Category) : null;
                  const thumb = p.images && p.images.length > 0 ? p.images[0] : '';
                  const hasDiscount = p.discountPrice > 0 && p.discountPrice < p.basePrice;

                  return (
                    <tr key={p.id} className="hover:bg-[#F2FAF4]/50 transition-colors">
                      {/* Shoe Image & Title */}
                      <td className="px-5 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 rounded-xl bg-[#F2FAF4] border border-[#DCEBE0] overflow-hidden shrink-0 flex items-center justify-center p-1">
                            {thumb ? (
                              <img src={thumb} alt="" className="w-full h-full object-contain" />
                            ) : (
                              <Package className="w-5 h-5 text-[#718078]" />
                            )}
                          </div>
                          <div>
                            <div className="font-outfit font-bold text-sm text-[#26352D]">
                              {p.name}
                            </div>
                            <div className="text-[11px] text-[#718078] flex items-center space-x-2">
                              <span>{p.gender}</span>
                              {p.material && (
                                <>
                                  <span>•</span>
                                  <span>{p.material}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Brand & Category */}
                      <td className="px-5 py-4">
                        <div className="space-y-1">
                          <div className="font-semibold text-[#26352D]">
                            {brandObj?.name || 'Unbranded'}
                          </div>
                          <span className="inline-block px-2 py-0.5 rounded-full bg-[#DDF3E2] text-[10px] font-bold text-[#26352D]">
                            {catObj?.name || 'General'}
                          </span>
                        </div>
                      </td>

                      {/* Sri Lankan Rupee Pricing */}
                      <td className="px-5 py-4">
                        <div className="space-y-0.5">
                          <div className="font-outfit font-extrabold text-sm text-[#26352D]">
                            {formatLKR(hasDiscount ? p.discountPrice : p.basePrice)}
                          </div>
                          {hasDiscount && (
                            <div className="text-[10px] text-[#718078] line-through">
                              {formatLKR(p.basePrice)}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Variant & Total Stock */}
                      <td className="px-5 py-4">
                        <div className="space-y-1">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              (p.totalStock || 0) > 10
                                ? 'bg-[#35A866]/15 text-[#35A866]'
                                : (p.totalStock || 0) > 0
                                ? 'bg-[#F2B84B]/20 text-[#26352D]'
                                : 'bg-[#E45D5D]/15 text-[#E45D5D]'
                            }`}
                          >
                            {p.totalStock || 0} units in stock
                          </span>
                          <div className="text-[10px] text-[#718078]">
                            {p.variantCount || 0} size/color variants
                          </div>
                        </div>
                      </td>

                      {/* Status Badges */}
                      <td className="px-5 py-4">
                        <div className="flex flex-col space-y-1 items-start">
                          <span
                            className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                              p.isActive
                                ? 'bg-[#35A866]/15 text-[#35A866]'
                                : 'bg-[#718078]/15 text-[#718078]'
                            }`}
                          >
                            {p.isActive ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                            <span>{p.isActive ? 'Active' : 'Draft'}</span>
                          </span>

                          {p.isFeatured && (
                            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#72C98A]/20 text-[#26352D]">
                              <ShoeAvatarIcon className="w-3 h-3 text-[#59B976]" />
                              <span>Featured</span>
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <button
                            onClick={() => {
                              setProductToView(p);
                              setIsDetailsOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-[#718078] hover:text-[#26352D] hover:bg-[#F2FAF4] transition-colors"
                            title="View Full Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setProductForVariants(p);
                              setIsVariantOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-[#72C98A] hover:bg-[#DDF3E2] transition-colors"
                            title="Manage Sizing & Stock Variants"
                          >
                            <Layers className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setProductToEdit(p);
                              setIsFormOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-[#26352D] hover:bg-[#F2FAF4] transition-colors"
                            title="Edit Shoe"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setProductToDelete(p);
                              setIsDeleteModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-[#E45D5D] hover:bg-[#E45D5D]/10 transition-colors"
                            title="Delete Shoe"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        {pagination.totalPages > 1 && (
          <div className="px-6 py-4 bg-[#F2FAF4] border-t border-[#DCEBE0] flex items-center justify-between text-xs">
            <span className="text-[#718078]">
              Showing page <strong className="text-[#26352D]">{pagination.page}</strong> of{' '}
              <strong className="text-[#26352D]">{pagination.totalPages}</strong> (Total:{' '}
              {pagination.totalItems} shoes)
            </span>

            <div className="flex items-center space-x-2">
              <button
                disabled={!pagination.hasPrevPage}
                onClick={() => fetchProducts(pagination.page - 1)}
                className="p-1.5 rounded-lg border border-[#DCEBE0] bg-white text-[#26352D] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#DDF3E2] transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={!pagination.hasNextPage}
                onClick={() => fetchProducts(pagination.page + 1)}
                className="p-1.5 rounded-lg border border-[#DCEBE0] bg-white text-[#26352D] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#DDF3E2] transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Product Modal */}
      <ProductFormModal
        isOpen={isFormOpen}
        productToEdit={productToEdit}
        brands={brands}
        categories={categories}
        onClose={() => setIsFormOpen(false)}
        onSaved={() => fetchProducts(pagination.page)}
      />

      {/* Product Details Modal */}
      <ProductDetailsModal
        isOpen={isDetailsOpen}
        product={productToView}
        onClose={() => setIsDetailsOpen(false)}
        onManageVariants={() => {
          setProductForVariants(productToView);
          setIsVariantOpen(true);
        }}
      />

      {/* Product Variant Manager Modal */}
      <VariantManagerModal
        isOpen={isVariantOpen}
        product={productForVariants}
        onClose={() => setIsVariantOpen(false)}
        onVariantsUpdated={() => fetchProducts(pagination.page)}
      />

      {/* Delete Product Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        title="Delete Shoe Product?"
        message={`Are you sure you want to delete '${productToDelete?.name}'? This action cannot be undone and will cascade delete all ${productToDelete?.variantCount || 0} associated stock variants.`}
        confirmLabel="Delete Product"
        isDangerous={true}
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setProductToDelete(null);
        }}
      />
    </div>
  );
};
