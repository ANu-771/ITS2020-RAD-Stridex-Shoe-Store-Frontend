export const UserRole = {
  ADMIN: 'ADMIN',
  USER: 'USER',
  MANAGER: 'MANAGER',
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export interface User {
  id: string;
  name: string;
  email: string;
  roles: UserRole[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  productCount?: number;
}

export interface ShoeProduct {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  discountPrice?: number;
  sizes: number[];
  colors: string[];
  stockQuantity: number;
  images: string[];
  featured?: boolean;
}
