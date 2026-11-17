import { useState, useEffect, useCallback } from 'react';
import type { FC, FormEvent } from 'react';
import { 
  Plus, 
  Search, 
  Tag, 
  Edit, 
  Trash2, 
  RefreshCw, 
  AlertCircle,
  X 
} from 'lucide-react';
import { brandService } from '../../services/brandService';
import type { BrandPayload } from '../../services/brandService';
import { ConfirmationModal } from '../../components/common/ConfirmationModal';
import type { Brand } from '../../types';

export const AdminBrandsPage: FC = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [brandToEdit, setBrandToEdit] = useState<Brand | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [logo, setLogo] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Delete modal state
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState<Brand | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchBrands = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await brandService.getAll({ search: search.trim() || undefined });
      setBrands(res.data);
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Failed to fetch brands');
    } finally {
      setIsLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  const handleOpenCreate = () => {
    setBrandToEdit(null);
    setName('');
    setDescription('');
    setLogo('');
    setIsActive(true);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (brand: Brand) => {
    setBrandToEdit(brand);
    setName(brand.name);
    setDescription(brand.description || '');
    setLogo(brand.logo || '');
    setIsActive(brand.isActive);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const payload: BrandPayload = {
      name: name.trim(),
      description: description.trim(),
      logo: logo.trim(),
      isActive,
    };

    setIsSubmitting(true);
    try {
      if (brandToEdit) {
        await brandService.update(brandToEdit.id, payload);
      } else {
        await brandService.create(payload);
      }
      setIsModalOpen(false);
      fetchBrands();
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Failed to save brand');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!brandToDelete) return;
    setIsDeleting(true);
    try {
      await brandService.delete(brandToDelete.id);
      setIsDeleteOpen(false);
      setBrandToDelete(null);
      fetchBrands();
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Failed to delete brand');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-3xl border border-[#DCEBE0] shadow-sm">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#DDF3E2] text-[#26352D] text-xs font-semibold mb-1">
            <Tag className="w-3.5 h-3.5 text-[#72C98A]" />
            <span>Brand Directory</span>
          </div>
          <h1 className="font-outfit text-2xl sm:text-3xl font-extrabold text-[#26352D]">
            Footwear Brand Partners
          </h1>
          <p className="text-xs text-[#718078]">
            Manage brand identities, manufacturer profiles, and catalog relationships
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchBrands}
            className="p-2.5 rounded-xl border border-[#DCEBE0] bg-[#F2FAF4] hover:bg-[#DDF3E2] text-[#26352D] transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={handleOpenCreate}
            className="px-5 py-2.5 rounded-xl bg-[#72C98A] hover:bg-[#59B976] text-white text-xs font-bold shadow-md shadow-green-500/20 transition-all flex items-center space-x-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Brand</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#DCEBE0] shadow-sm flex items-center space-x-3 text-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#718078] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search brands by name..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#DCEBE0] bg-[#F2FAF4]/50 text-[#26352D] focus:outline-none focus:border-[#72C98A]"
          />
        </div>
      </div>

      {/* Error alert */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-[#E45D5D]/10 border border-[#E45D5D]/20 text-[#E45D5D] text-xs">
          {errorMessage}
        </div>
      )}

      {/* Grid of Brands */}
      {isLoading ? (
        <div className="py-20 text-center text-xs text-[#718078]">Loading brands...</div>
      ) : brands.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-3xl border border-[#DCEBE0] p-8">
          <p className="text-xs text-[#718078]">No brands found. Click 'Add Brand' above to register one.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {brands.map((brand) => (
            <div
              key={brand.id}
              className="bg-white rounded-2xl border border-[#DCEBE0] overflow-hidden shadow-xs hover:border-[#72C98A] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="h-32 w-full bg-[#F2FAF4] overflow-hidden relative flex items-center justify-center p-4">
                  {brand.logo ? (
                    <img src={brand.logo} alt={brand.name} className="h-full object-contain" />
                  ) : (
                    <Tag className="w-10 h-10 text-[#718078]" />
                  )}
                  <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-white/90 text-[10px] font-bold text-[#26352D] border border-[#DCEBE0]">
                    {brand.productCount || 0} Products
                  </span>
                </div>

                <div className="p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-outfit font-bold text-base text-[#26352D]">{brand.name}</h3>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        brand.isActive ? 'bg-[#35A866]/15 text-[#35A866]' : 'bg-[#718078]/15 text-[#718078]'
                      }`}
                    >
                      {brand.isActive ? 'Active' : 'Disabled'}
                    </span>
                  </div>
                  <p className="text-xs text-[#718078] line-clamp-2">{brand.description || 'No description provided.'}</p>
                  <div className="text-[10px] font-mono text-[#718078] pt-1">slug: /{brand.slug}</div>
                </div>
              </div>

              <div className="px-5 py-3 bg-[#F2FAF4] border-t border-[#DCEBE0] flex items-center justify-end space-x-2">
                <button
                  onClick={() => handleOpenEdit(brand)}
                  className="p-1.5 rounded-lg text-[#26352D] hover:bg-white transition-colors"
                  title="Edit Brand"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setBrandToDelete(brand);
                    setIsDeleteOpen(true);
                  }}
                  className="p-1.5 rounded-lg text-[#E45D5D] hover:bg-white transition-colors"
                  title="Delete Brand"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Brand Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 border border-[#DCEBE0] shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#DCEBE0]">
              <h3 className="font-outfit text-lg font-bold text-[#26352D]">
                {brandToEdit ? 'Edit Brand' : 'Register New Brand'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-[#718078] hover:text-[#26352D]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mt-3 p-3 rounded-xl bg-[#E45D5D]/10 text-[#E45D5D] text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-[#26352D] mb-1">Brand Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Asics Tiger"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#DCEBE0] bg-[#F2FAF4]/40 text-[#26352D] focus:outline-none focus:border-[#72C98A]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#26352D] mb-1">Logo URL</label>
                <input
                  type="url"
                  value={logo}
                  onChange={(e) => setLogo(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2 rounded-xl border border-[#DCEBE0] bg-[#F2FAF4]/40 text-[#26352D] focus:outline-none focus:border-[#72C98A]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#26352D] mb-1">Brand Bio / Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Heritage, performance focus, or footwear specialty..."
                  className="w-full px-3.5 py-2 rounded-xl border border-[#DCEBE0] bg-[#F2FAF4]/40 text-[#26352D] focus:outline-none focus:border-[#72C98A] resize-none"
                />
              </div>

              <label className="inline-flex items-center space-x-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 text-[#72C98A] rounded border-[#DCEBE0]"
                />
                <span className="font-semibold text-[#26352D]">Active on Website</span>
              </label>

              <div className="pt-3 border-t border-[#DCEBE0] flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-[#718078] hover:text-[#26352D] font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-[#72C98A] hover:bg-[#59B976] text-white font-semibold shadow-xs flex items-center space-x-1.5"
                >
                  {isSubmitting && <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                  <span>{brandToEdit ? 'Save Changes' : 'Register Brand'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteOpen}
        title="Delete Brand?"
        message={`Are you sure you want to delete '${brandToDelete?.name}'? This brand cannot be deleted if active shoes in the catalog are linked to it.`}
        confirmLabel="Delete Brand"
        isDangerous={true}
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setIsDeleteOpen(false);
          setBrandToDelete(null);
        }}
      />
    </div>
  );
};
