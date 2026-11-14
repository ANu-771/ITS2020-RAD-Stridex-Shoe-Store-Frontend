import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
  id: string; // Composite key: `${productId}-${size}-${color}`
  productId: string;
  variantId?: string;
  name: string;
  slug: string;
  image: string;
  brandName: string;
  size: number | string;
  color: string;
  price: number; // in LKR
  originalPrice?: number;
  quantity: number;
  maxStock: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean; // Controls slide-over cart drawer
}

const loadCartFromStorage = (): CartItem[] => {
  try {
    const saved = localStorage.getItem('stridex_cart');
    if (saved) return JSON.parse(saved);
  } catch {
    // Ignore JSON errors
  }
  return [];
};

const saveCartToStorage = (items: CartItem[]) => {
  try {
    localStorage.setItem('stridex_cart', JSON.stringify(items));
  } catch {
    // Ignore storage errors
  }
};

const initialState: CartState = {
  items: loadCartFromStorage(),
  isOpen: false,
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existing = state.items.find((item) => item.id === action.payload.id);
      if (existing) {
        const nextQty = existing.quantity + action.payload.quantity;
        existing.quantity = Math.min(nextQty, existing.maxStock || 99);
      } else {
        state.items.push(action.payload);
      }
      saveCartToStorage(state.items);
      state.isOpen = true; // Automatically open cart drawer when adding
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      saveCartToStorage(state.items);
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>
    ) => {
      const item = state.items.find((i) => i.id === action.payload.id);
      if (item) {
        if (action.payload.quantity <= 0) {
          state.items = state.items.filter((i) => i.id !== action.payload.id);
        } else {
          item.quantity = Math.min(action.payload.quantity, item.maxStock || 99);
        }
        saveCartToStorage(state.items);
      }
    },
    clearCart: (state) => {
      state.items = [];
      saveCartToStorage([]);
    },
    toggleCartOpen: (state) => {
      state.isOpen = !state.isOpen;
    },
    setCartOpen: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  toggleCartOpen,
  setCartOpen,
} = cartSlice.actions;

export default cartSlice.reducer;
