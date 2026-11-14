import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface WishlistItem {
  productId: string;
  name: string;
  slug: string;
  image: string;
  brandName: string;
  basePrice: number;
  discountPrice: number;
}

interface WishlistState {
  items: WishlistItem[];
}

const loadWishlistFromStorage = (): WishlistItem[] => {
  try {
    const saved = localStorage.getItem('stridex_wishlist');
    if (saved) return JSON.parse(saved);
  } catch {
    // Ignore JSON errors
  }
  return [];
};

const saveWishlistToStorage = (items: WishlistItem[]) => {
  try {
    localStorage.setItem('stridex_wishlist', JSON.stringify(items));
  } catch {
    // Ignore storage errors
  }
};

const initialState: WishlistState = {
  items: loadWishlistFromStorage(),
};

export const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    toggleWishlist: (state, action: PayloadAction<WishlistItem>) => {
      const existsIndex = state.items.findIndex(
        (item) => item.productId === action.payload.productId
      );
      if (existsIndex >= 0) {
        state.items.splice(existsIndex, 1);
      } else {
        state.items.push(action.payload);
      }
      saveWishlistToStorage(state.items);
    },
    removeFromWishlist: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.productId !== action.payload);
      saveWishlistToStorage(state.items);
    },
    clearWishlist: (state) => {
      state.items = [];
      saveWishlistToStorage([]);
    },
  },
});

export const { toggleWishlist, removeFromWishlist, clearWishlist } =
  wishlistSlice.actions;

export default wishlistSlice.reducer;
