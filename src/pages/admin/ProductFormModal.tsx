import { useState, useEffect } from 'react';
import type { FC, FormEvent, ChangeEvent } from 'react';
import { X, Upload, Plus, Trash2, AlertCircle } from 'lucide-react';
import { productService } from '../../services/productService';
import type { ProductPayload } from '../../services/productService';
import { uploadService } from '../../services/uploadService';
import { formatLKR } from '../../utils/currency';
import type { Product, Brand, Category, ProductGender } from '../../types';

interface ProductFormModalProps {
  isOpen: boolean;
  productToEdit: Product | null;
  brands: Brand[];
  categories: Category[];
  onClose: () => void;
  onSaved: () => void;
}

export const ProductFormModal: FC<ProductFormModalProps> = ({
  isOpen,
  productToEdit,
  brands,
  categories,
  onClose,
  onSaved,
}) => {
  const isEditing = Boolean(productToEdit);

  // Form states
  const [name, setName] = useState('');
  const [brandId, setBrandId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [basePrice, setBasePrice] = useState<number | ''>(25000); // LKR
  const [discountPrice, setDiscountPrice] = useState<number | ''>(0); // LKR
  const [gender, setGender] = useState<ProductGender>('UNISEX');
  const [material, setMaterial] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isActive, setIsActive] = useState(true);

  // Async & Error states
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name);
      setBrandId(
        typeof productToEdit.brandId === 'object'
          ? (productToEdit.brandId as Brand).id
          : productToEdit.brandId
      );
      setCategoryId(
        typeof productToEdit.categoryId === 'object'
          ? (productToEdit.categoryId as Category).id
          : productToEdit.categoryId
      );
      setBasePrice(productToEdit.basePrice);
      setDiscountPrice(productToEdit.discountPrice || 0);
      setGender(productToEdit.gender);
      setMaterial(productToEdit.material || '');
      setDescription(productToEdit.description);
      setImages(productToEdit.images || []);
      setIsFeatured(productToEdit.isFeatured);
      setIsActive(productToEdit.isActive);
    } else {
      // Default new product values
      setName('');
      setBrandId(brands[0]?.id || '');
      setCategoryId(categories[0]?.id || '');
      setBasePrice(25000);
      setDiscountPrice(0);
      setGender('UNISEX');
      setMaterial('');
      setDescription('');
      setImages([
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
      ]);
      setIsFeatured(false);
      setIsActive(true);
    }
    setErrorMessage(null);
  }, [productToEdit, isOpen, brands, categories]);

  const handleAddImageUrl = () => {
    if (imageUrlInput.trim()) {
      setImages([...images, imageUrlInput.trim()]);
      setImageUrlInput('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setErrorMessage(null);
    try {
      const url = await uploadService.uploadSingle(file);
      setImages((prev) => [...prev, url]);
    } catch (err: any) {
      const serverMsg = err.response?.data?.message || err.message;
      setErrorMessage(serverMsg || 'Failed to upload image. Please enter an image URL instead.');
    } finally {
      setIsUploading(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const numBase = Number(basePrice);
    const numDiscount = Number(discountPrice) || 0;

    if (numBase <= 0) {
      setErrorMessage('Base price in Sri Lankan Rupees must be greater than 0');
      return;
    }

    if (numDiscount > 0 && numDiscount > numBase) {
      setErrorMessage('Discount price in LKR cannot exceed the Base price');
      return;
    }

    if (!brandId) {
      setErrorMessage('Please select a Brand');
      return;
    }

    if (!categoryId) {
      setErrorMessage('Please select a Category');
      return;
    }

    const payload: ProductPayload = {
      name: name.trim(),
      description: description.trim(),
      brandId,
      categoryId,
      basePrice: numBase,
      discountPrice: numDiscount,
      images,
      gender,
      material: material.trim(),
      isFeatured,
      isActive,
    };

    setIsSubmitting(true);
    try {
      if (isEditing && productToEdit) {
        await productService.update(productToEdit.id, payload);
      } else {
        await productService.create(payload);
      }
      onSaved();
      onClose();
    } catch (err: any) {
      setErrorMessage(
        err.response?.data?.message || 'Failed to save product. Please check the inputs.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-[#DCEBE0] shadow-2xl max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#DCEBE0]">
          <div>
            <h2 className="font-outfit text-xl sm:text-2xl font-bold text-[#26352D]">
              {isEditing ? 'Edit Shoe Listing' : 'Add New Shoe Product'}
            </h2>
            <p className="text-xs text-[#718078]">
              Manage product specification and Sri Lankan Rupee pricing
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#718078] hover:text-[#26352D] hover:bg-[#F2FAF4] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mt-4 flex items-center space-x-2 p-3 rounded-xl bg-[#E45D5D]/10 border border-[#E45D5D]/20 text-[#E45D5D] text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Real-time Sri Lankan Rupee Preview Banner */}
        <div className="mt-4 p-3 rounded-xl bg-[#DDF3E2]/60 border border-[#BDECCB] flex items-center justify-between text-xs">
          <div>
            <span className="text-[#718078] font-medium">Sri Lankan Rupee Display: </span>
            <strong className="text-[#26352D] font-outfit text-sm">
              {formatLKR(Number(discountPrice) > 0 ? Number(discountPrice) : Number(basePrice))}
            </strong>
            {Number(discountPrice) > 0 && (
              <span className="text-[#718078] line-through ml-2">
                {formatLKR(Number(basePrice))}
              </span>
            )}
          </div>
          <span className="px-2 py-0.5 rounded bg-white text-[10px] font-bold text-[#26352D] border border-[#DCEBE0]">
            LKR Standard
          </span>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
          {/* Shoe Name */}
          <div>
            <label className="block font-semibold text-[#26352D] mb-1">Product Title *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Nike Air Max 270 React"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCEBE0] bg-[#F2FAF4]/40 text-[#26352D] focus:outline-none focus:border-[#72C98A]"
            />
          </div>

          {/* Brand & Category Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-[#26352D] mb-1">Brand *</label>
              <select
                required
                value={brandId}
                onChange={(e) => setBrandId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCEBE0] bg-white text-[#26352D] focus:outline-none focus:border-[#72C98A]"
              >
                <option value="">Select Brand</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#26352D] mb-1">Category *</label>
              <select
                required
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCEBE0] bg-white text-[#26352D] focus:outline-none focus:border-[#72C98A]"
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* LKR Pricing Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-[#26352D] mb-1">
                Base Price (LKR) *
              </label>
              <input
                type="number"
                min="0"
                step="100"
                required
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="25000"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCEBE0] bg-[#F2FAF4]/40 text-[#26352D] font-semibold focus:outline-none focus:border-[#72C98A]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#26352D] mb-1">
                Discount Price (LKR - 0 for none)
              </label>
              <input
                type="number"
                min="0"
                step="100"
                value={discountPrice}
                onChange={(e) => setDiscountPrice(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="21990"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCEBE0] bg-[#F2FAF4]/40 text-[#26352D] font-semibold focus:outline-none focus:border-[#72C98A]"
              />
            </div>
          </div>

          {/* Gender & Material */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-[#26352D] mb-1">Target Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as ProductGender)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCEBE0] bg-white text-[#26352D] focus:outline-none focus:border-[#72C98A]"
              >
                <option value="UNISEX">Unisex</option>
                <option value="MEN">Men</option>
                <option value="WOMEN">Women</option>
                <option value="KIDS">Kids</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#26352D] mb-1">Upper Material</label>
              <input
                type="text"
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                placeholder="e.g. Full Grain Leather, Breathable Mesh"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCEBE0] bg-[#F2FAF4]/40 text-[#26352D] focus:outline-none focus:border-[#72C98A]"
              />
            </div>
          </div>

          {/* Image Management */}
          <div className="space-y-2">
            <label className="block font-semibold text-[#26352D]">Product Imagery</label>
            <div className="flex gap-2">
              <input
                type="url"
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                placeholder="Paste public image URL..."
                className="flex-1 px-3.5 py-2 rounded-xl border border-[#DCEBE0] bg-[#F2FAF4]/40 text-[#26352D] focus:outline-none focus:border-[#72C98A]"
              />
              <button
                type="button"
                onClick={handleAddImageUrl}
                className="px-3 py-2 rounded-xl bg-[#DDF3E2] hover:bg-[#BDECCB] text-[#26352D] font-semibold transition-colors flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add URL</span>
              </button>
              <label className="px-3 py-2 rounded-xl border border-[#DCEBE0] hover:bg-[#F2FAF4] text-[#26352D] font-semibold transition-colors flex items-center space-x-1 cursor-pointer">
                <Upload className="w-3.5 h-3.5 text-[#72C98A]" />
                <span>{isUploading ? 'Uploading...' : 'Upload'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={isUploading}
                />
              </label>
            </div>

            {images.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {images.map((img, i) => (
                  <div
                    key={i}
                    className="relative w-16 h-16 rounded-xl border border-[#DCEBE0] bg-[#F2FAF4] overflow-hidden group"
                  >
                    <img src={img} alt="" className="w-full h-full object-contain p-1" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(i)}
                      className="absolute inset-0 bg-red-600/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block font-semibold text-[#26352D] mb-1">Description *</label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe footwear construction, sole cushioning, and athletic performance benefits..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCEBE0] bg-[#F2FAF4]/40 text-[#26352D] focus:outline-none focus:border-[#72C98A] resize-none"
            />
          </div>

          {/* Checkbox Toggles */}
          <div className="flex items-center space-x-6 pt-1">
            <label className="inline-flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 text-[#72C98A] rounded border-[#DCEBE0] focus:ring-[#72C98A]"
              />
              <span className="font-semibold text-[#26352D]">Featured Shoe Drop</span>
            </label>

            <label className="inline-flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 text-[#72C98A] rounded border-[#DCEBE0] focus:ring-[#72C98A]"
              />
              <span className="font-semibold text-[#26352D]">Active on Storefront</span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-[#DCEBE0] flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-[#718078] hover:text-[#26352D] hover:bg-[#F2FAF4] font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-[#72C98A] hover:bg-[#59B976] text-white font-semibold shadow-md shadow-green-500/20 transition-all cursor-pointer flex items-center space-x-1.5 disabled:opacity-60"
            >
              {isSubmitting && (
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              <span>{isEditing ? 'Save Changes' : 'Publish Shoe Product'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
