import type { CartItem } from '../store/slices/cartSlice';
import type { WishlistItem } from '../store/slices/wishlistSlice';

// Dedicated Guest Storage Keys (Strictly separated from authenticated user data)
export const GUEST_CART_STORAGE_KEY = 'stridex_guest_cart';
export const GUEST_WISHLIST_STORAGE_KEY = 'stridex_guest_wishlist';

/**
 * Clean up legacy shared global storage keys if they exist from older versions
 * to prevent cross-contamination.
 */
export const cleanupLegacyStorage = (): void => {
  try {
    localStorage.removeItem('stridex_cart');
    localStorage.removeItem('stridex_wishlist');
  } catch {
    // Ignore storage errors
  }
};

/**
 * Safely retrieves the current authenticated user's ID from localStorage.
 */
export const getCurrentUserId = (): string | null => {
  try {
    const raw = localStorage.getItem('stridex_user');
    if (!raw) return null;
    const user = JSON.parse(raw);
    return user?.id || null;
  } catch {
    return null;
  }
};

/**
 * Generates an isolated user-scoped cart key, or the dedicated guest key.
 */
export const getUserCartKey = (userId?: string | null): string => {
  const uid = userId || getCurrentUserId();
  return uid ? `stridex_cart_${uid}` : GUEST_CART_STORAGE_KEY;
};

/**
 * Generates an isolated user-scoped wishlist key, or the dedicated guest key.
 */
export const getUserWishlistKey = (userId?: string | null): string => {
  const uid = userId || getCurrentUserId();
  return uid ? `stridex_wishlist_${uid}` : GUEST_WISHLIST_STORAGE_KEY;
};

// -------------------------------------------------------------
// Dedicated Guest Storage Functions
// -------------------------------------------------------------

export const loadGuestCart = (): CartItem[] => {
  cleanupLegacyStorage();
  try {
    const raw = localStorage.getItem(GUEST_CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveGuestCart = (items: CartItem[]): void => {
  try {
    localStorage.setItem(GUEST_CART_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Ignore storage quota errors
  }
};

export const clearGuestCart = (): void => {
  try {
    localStorage.removeItem(GUEST_CART_STORAGE_KEY);
  } catch {
    // Ignore storage errors
  }
};

export const loadGuestWishlist = (): WishlistItem[] => {
  cleanupLegacyStorage();
  try {
    const raw = localStorage.getItem(GUEST_WISHLIST_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveGuestWishlist = (items: WishlistItem[]): void => {
  try {
    localStorage.setItem(GUEST_WISHLIST_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Ignore storage quota errors
  }
};

export const clearGuestWishlist = (): void => {
  try {
    localStorage.removeItem(GUEST_WISHLIST_STORAGE_KEY);
  } catch {
    // Ignore storage errors
  }
};

// -------------------------------------------------------------
// Context-Aware Cart Storage Functions (User vs. Guest)
// -------------------------------------------------------------

export const loadCartStorage = (userId?: string | null): CartItem[] => {
  cleanupLegacyStorage();
  const key = getUserCartKey(userId);
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveCartStorage = (items: CartItem[], userId?: string | null): void => {
  const key = getUserCartKey(userId);
  try {
    localStorage.setItem(key, JSON.stringify(items));
  } catch {
    // Ignore storage quota errors
  }
};

export const clearUserCartStorage = (userId: string): void => {
  if (userId) {
    try {
      localStorage.removeItem(`stridex_cart_${userId}`);
    } catch {
      // Ignore
    }
  }
};

// -------------------------------------------------------------
// Context-Aware Wishlist Storage Functions (User vs. Guest)
// -------------------------------------------------------------

export const loadWishlistStorage = (userId?: string | null): WishlistItem[] => {
  cleanupLegacyStorage();
  const key = getUserWishlistKey(userId);
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveWishlistStorage = (items: WishlistItem[], userId?: string | null): void => {
  const key = getUserWishlistKey(userId);
  try {
    localStorage.setItem(key, JSON.stringify(items));
  } catch {
    // Ignore storage quota errors
  }
};

export const clearUserWishlistStorage = (userId: string): void => {
  if (userId) {
    try {
      localStorage.removeItem(`stridex_wishlist_${userId}`);
    } catch {
      // Ignore
    }
  }
};
