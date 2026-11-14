import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { wishlistService } from '../../services/wishlistService';
import type { Product } from '../../types';

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
  isLoading: boolean;
  error: string | null;
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
  isLoading: false,
  error: null,
};

// Async Thunk: Fetch saved shoes from MongoDB
export const fetchServerWishlist = createAsyncThunk(
  'wishlist/fetchServerWishlist',
  async (_, { rejectWithValue }) => {
    try {
      const res = await wishlistService.getWishlist();
      if (res.success) {
        return res.data;
      }
      return rejectWithValue('Failed to retrieve wishlist');
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to retrieve wishlist');
    }
  }
);

// Async Thunk: Sync guest wishlist to MongoDB upon login
export const syncWishlistWithServer = createAsyncThunk(
  'wishlist/syncWishlistWithServer',
  async (productIds: string[], { rejectWithValue }) => {
    try {
      if (productIds.length === 0) {
        const res = await wishlistService.getWishlist();
        return res.data;
      }
      await wishlistService.syncWishlist(productIds);
      const res = await wishlistService.getWishlist();
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to sync wishlist');
    }
  }
);

// Async Thunk: Toggle Wishlist
export const toggleWishlistAsync = createAsyncThunk(
  'wishlist/toggleWishlistAsync',
  async (item: WishlistItem) => {
    try {
      await wishlistService.toggle(item.productId);
      return item;
    } catch {
      // Return item anyway for optimistic local toggle
      return item;
    }
  }
);

// Async Thunk: Move to Cart
export const moveToCartAsync = createAsyncThunk(
  'wishlist/moveToCartAsync',
  async (productId: string, { rejectWithValue }) => {
    try {
      await wishlistService.moveToCart(productId);
      return productId;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to move shoe to bag');
    }
  }
);

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
  extraReducers: (builder) => {
    // fetchServerWishlist
    builder.addCase(fetchServerWishlist.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchServerWishlist.fulfilled, (state, action) => {
      state.isLoading = false;
      const products = action.payload as Product[];
      state.items = products.map((p) => ({
        productId: p.id,
        name: p.name,
        slug: p.slug,
        image: p.images?.[0] || '',
        brandName: typeof p.brandId === 'object' && p.brandId !== null ? (p.brandId as any).name : 'STRIDEX',
        basePrice: p.basePrice,
        discountPrice: p.discountPrice || 0,
      }));
      saveWishlistToStorage(state.items);
    });
    builder.addCase(fetchServerWishlist.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // syncWishlistWithServer
    builder.addCase(syncWishlistWithServer.fulfilled, (state, action) => {
      const products = action.payload as Product[];
      state.items = products.map((p) => ({
        productId: p.id,
        name: p.name,
        slug: p.slug,
        image: p.images?.[0] || '',
        brandName: typeof p.brandId === 'object' && p.brandId !== null ? (p.brandId as any).name : 'STRIDEX',
        basePrice: p.basePrice,
        discountPrice: p.discountPrice || 0,
      }));
      saveWishlistToStorage(state.items);
    });

    // toggleWishlistAsync
    builder.addCase(toggleWishlistAsync.fulfilled, (state, action) => {
      const item = action.payload;
      const existsIndex = state.items.findIndex((i) => i.productId === item.productId);
      if (existsIndex >= 0) {
        state.items.splice(existsIndex, 1);
      } else {
        state.items.push(item);
      }
      saveWishlistToStorage(state.items);
    });

    // moveToCartAsync
    builder.addCase(moveToCartAsync.fulfilled, (state, action) => {
      state.items = state.items.filter((i) => i.productId !== action.payload);
      saveWishlistToStorage(state.items);
    });
  },
});

export const { toggleWishlist, removeFromWishlist, clearWishlist } =
  wishlistSlice.actions;

export default wishlistSlice.reducer;
