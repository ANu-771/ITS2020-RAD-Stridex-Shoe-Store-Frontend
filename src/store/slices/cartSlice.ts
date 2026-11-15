import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { cartService } from '../../services/cartService';
import type { CartServerItem, AddToCartPayload } from '../../services/cartService';
import { logout } from './authSlice';
import {
  loadCartStorage,
  saveCartStorage,
  loadGuestCart,
  getCurrentUserId,
} from '../../utils/cartStorage';

export interface CartItem {
  id: string; // Composite key: `${productId}-${size}-${color}`
  itemId?: string; // MongoDB Cart item _id
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
  isLoading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: loadCartStorage(getCurrentUserId()),
  isOpen: false,
  isLoading: false,
  error: null,
};

// Async Thunk: Fetch Cart from MongoDB
export const fetchServerCart = createAsyncThunk(
  'cart/fetchServerCart',
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem('stridex_access_token');
    if (!token) {
      return rejectWithValue('User not authenticated');
    }
    try {
      const res = await cartService.getCart();
      if (res.success) {
        return res.data.items;
      }
      return rejectWithValue('Failed to retrieve cart');
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to retrieve cart');
    }
  }
);

// Async Thunk: Sync local guest cart to server upon login
export const syncCartWithServer = createAsyncThunk(
  'cart/syncCartWithServer',
  async (items: CartItem[], { rejectWithValue }) => {
    try {
      const payload: AddToCartPayload[] = items.map((item) => ({
        productId: item.productId,
        variantId: item.variantId && /^[0-9a-fA-F]{24}$/.test(item.variantId) ? item.variantId : undefined,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
      }));

      if (payload.length === 0) {
        const res = await cartService.getCart();
        return res.data.items;
      }

      const res = await cartService.syncCart(payload);
      if (res.success) {
        return res.data.items;
      }
      return rejectWithValue('Failed to sync cart');
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to sync cart');
    }
  }
);

// Async Thunk: Add to Cart (syncs with server when authenticated, falls back gracefully for guests)
export const addToCartAsync = createAsyncThunk(
  'cart/addToCartAsync',
  async (item: CartItem) => {
    const token = localStorage.getItem('stridex_access_token');
    if (!token) {
      // Guest mode - purely client-side isolated storage
      return { fallbackItem: item };
    }
    try {
      const payload: AddToCartPayload = {
        productId: item.productId,
        variantId: item.variantId && /^[0-9a-fA-F]{24}$/.test(item.variantId) ? item.variantId : undefined,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
      };
      const res = await cartService.addItem(payload);
      if (res.success) {
        return { serverItems: res.data.items, fallbackItem: item };
      }
      return { fallbackItem: item };
    } catch {
      // Return fallback item so UI remains responsive even if server rejects or fails
      return { fallbackItem: item };
    }
  }
);

// Async Thunk: Update Quantity
export const updateQuantityAsync = createAsyncThunk(
  'cart/updateQuantityAsync',
  async (
    { id, itemId, quantity }: { id: string; itemId?: string; quantity: number }
  ) => {
    const token = localStorage.getItem('stridex_access_token');
    if (!token || !itemId) {
      return { id, quantity };
    }
    try {
      const res = await cartService.updateQuantity(itemId, quantity);
      if (res.success) {
        return { serverItems: res.data.items, id, quantity };
      }
      return { id, quantity };
    } catch {
      return { id, quantity };
    }
  }
);

// Async Thunk: Remove Item
export const removeFromCartAsync = createAsyncThunk(
  'cart/removeFromCartAsync',
  async ({ id, itemId }: { id: string; itemId?: string }) => {
    const token = localStorage.getItem('stridex_access_token');
    if (!token || !itemId) {
      return { id };
    }
    try {
      const res = await cartService.removeItem(itemId);
      if (res.success) {
        return { serverItems: res.data.items, id };
      }
      return { id };
    } catch {
      return { id };
    }
  }
);

// Async Thunk: Clear Cart
export const clearCartAsync = createAsyncThunk(
  'cart/clearCartAsync',
  async () => {
    const token = localStorage.getItem('stridex_access_token');
    if (!token) {
      return [];
    }
    try {
      await cartService.clearCart();
      return [];
    } catch {
      return [];
    }
  }
);

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
      saveCartStorage(state.items, getCurrentUserId());
      state.isOpen = true;
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      saveCartStorage(state.items, getCurrentUserId());
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
        saveCartStorage(state.items, getCurrentUserId());
      }
    },
    clearCart: (state) => {
      state.items = [];
      saveCartStorage([], getCurrentUserId());
    },
    resetCartState: (state) => {
      state.items = loadGuestCart();
      state.isOpen = false;
      state.isLoading = false;
      state.error = null;
    },
    loadCartForUser: (state, action: PayloadAction<string | null>) => {
      state.items = loadCartStorage(action.payload);
    },
    toggleCartOpen: (state) => {
      state.isOpen = !state.isOpen;
    },
    setCartOpen: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Automatically reset cart state when user logs out
    builder.addCase(logout, (state) => {
      state.items = loadGuestCart();
      state.isOpen = false;
      state.isLoading = false;
      state.error = null;
    });

    // fetchServerCart
    builder.addCase(fetchServerCart.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchServerCart.fulfilled, (state, action) => {
      state.isLoading = false;
      state.items = (action.payload as CartServerItem[]).map((i) => ({
        id: i.id,
        itemId: i.itemId,
        productId: i.productId,
        variantId: i.variantId,
        name: i.name,
        slug: i.slug,
        image: i.image,
        brandName: i.brandName,
        size: i.size,
        color: i.color,
        price: i.price,
        originalPrice: i.originalPrice,
        quantity: i.quantity,
        maxStock: i.maxStock,
      }));
      saveCartStorage(state.items, getCurrentUserId());
    });
    builder.addCase(fetchServerCart.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // syncCartWithServer
    builder.addCase(syncCartWithServer.fulfilled, (state, action) => {
      state.items = (action.payload as CartServerItem[]).map((i) => ({
        id: i.id,
        itemId: i.itemId,
        productId: i.productId,
        variantId: i.variantId,
        name: i.name,
        slug: i.slug,
        image: i.image,
        brandName: i.brandName,
        size: i.size,
        color: i.color,
        price: i.price,
        originalPrice: i.originalPrice,
        quantity: i.quantity,
        maxStock: i.maxStock,
      }));
      saveCartStorage(state.items, getCurrentUserId());
    });

    // addToCartAsync
    builder.addCase(addToCartAsync.fulfilled, (state, action) => {
      const payload = action.payload as any;
      if (payload.serverItems) {
        state.items = payload.serverItems.map((i: CartServerItem) => ({
          id: i.id,
          itemId: i.itemId,
          productId: i.productId,
          variantId: i.variantId,
          name: i.name,
          slug: i.slug,
          image: i.image,
          brandName: i.brandName,
          size: i.size,
          color: i.color,
          price: i.price,
          originalPrice: i.originalPrice,
          quantity: i.quantity,
          maxStock: i.maxStock,
        }));
      } else if (payload.fallbackItem) {
        const existing = state.items.find((item) => item.id === payload.fallbackItem.id);
        if (existing) {
          existing.quantity = Math.min(existing.quantity + payload.fallbackItem.quantity, existing.maxStock || 99);
        } else {
          state.items.push(payload.fallbackItem);
        }
      }
      saveCartStorage(state.items, getCurrentUserId());
      state.isOpen = true;
    });

    // updateQuantityAsync
    builder.addCase(updateQuantityAsync.fulfilled, (state, action) => {
      const payload = action.payload as any;
      if (payload.serverItems) {
        state.items = payload.serverItems.map((i: CartServerItem) => ({
          id: i.id,
          itemId: i.itemId,
          productId: i.productId,
          variantId: i.variantId,
          name: i.name,
          slug: i.slug,
          image: i.image,
          brandName: i.brandName,
          size: i.size,
          color: i.color,
          price: i.price,
          originalPrice: i.originalPrice,
          quantity: i.quantity,
          maxStock: i.maxStock,
        }));
      } else {
        const item = state.items.find((i) => i.id === payload.id);
        if (item) {
          if (payload.quantity <= 0) {
            state.items = state.items.filter((i) => i.id !== payload.id);
          } else {
            item.quantity = Math.min(payload.quantity, item.maxStock || 99);
          }
        }
      }
      saveCartStorage(state.items, getCurrentUserId());
    });

    // removeFromCartAsync
    builder.addCase(removeFromCartAsync.fulfilled, (state, action) => {
      const payload = action.payload as any;
      if (payload.serverItems) {
        state.items = payload.serverItems.map((i: CartServerItem) => ({
          id: i.id,
          itemId: i.itemId,
          productId: i.productId,
          variantId: i.variantId,
          name: i.name,
          slug: i.slug,
          image: i.image,
          brandName: i.brandName,
          size: i.size,
          color: i.color,
          price: i.price,
          originalPrice: i.originalPrice,
          quantity: i.quantity,
          maxStock: i.maxStock,
        }));
      } else {
        state.items = state.items.filter((item) => item.id !== payload.id);
      }
      saveCartStorage(state.items, getCurrentUserId());
    });

    // clearCartAsync
    builder.addCase(clearCartAsync.fulfilled, (state) => {
      state.items = [];
      saveCartStorage([], getCurrentUserId());
    });
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  resetCartState,
  loadCartForUser,
  toggleCartOpen,
  setCartOpen,
} = cartSlice.actions;

export default cartSlice.reducer;
