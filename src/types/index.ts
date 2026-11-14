export const UserRole = {
  CUSTOMER: 'CUSTOMER',
  ADMIN: 'ADMIN',
  INVENTORY_MANAGER: 'INVENTORY_MANAGER',
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: UserRole;
  isActive: boolean;
  createdAt?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    accessToken: string;
  };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  imageUrl?: string;
  isActive: boolean;
  productCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  isActive: boolean;
  productCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductVariant {
  id: string;
  productId: string;
  SKU: string;
  size: number | string;
  color: string;
  stockQuantity: number;
  reservedQuantity: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type ProductGender = 'MEN' | 'WOMEN' | 'UNISEX' | 'KIDS';

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  brandId: Brand | string;
  categoryId: Category | string;
  basePrice: number; // In Sri Lankan Rupees (LKR)
  discountPrice: number; // In Sri Lankan Rupees (LKR)
  images: string[];
  gender: ProductGender;
  material?: string;
  isFeatured: boolean;
  isActive: boolean;
  variants?: ProductVariant[];
  totalStock?: number;
  variantCount?: number;
  availableSizes?: (number | string)[];
  availableColors?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Pagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: Pagination;
}
