import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '@/types';

interface WishlistState {
  items: Product[];
  isWishlisted: (productId: string) => boolean;
  toggleWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  clearWishlist: () => void;
  count: () => number;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      isWishlisted: (productId) =>
        get().items.some((p) => p._id === productId),

      toggleWishlist: (product) => {
        const exists = get().isWishlisted(product._id);
        if (exists) {
          set({ items: get().items.filter((p) => p._id !== product._id) });
        } else {
          set({ items: [product, ...get().items] });
        }
      },

      removeFromWishlist: (productId) => {
        set({ items: get().items.filter((p) => p._id !== productId) });
      },

      clearWishlist: () => set({ items: [] }),

      count: () => get().items.length,
    }),
    {
      name: 'wishlist-storage',
    }
  )
);
