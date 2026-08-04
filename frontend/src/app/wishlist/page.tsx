'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingCart, Trash2, ArrowRight, ArrowLeft } from 'lucide-react';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCartStore } from '@/store/cartStore';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';

export default function WishlistPage() {
  const { items, removeFromWishlist, clearWishlist } = useWishlistStore();
  const { addItem } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAddToCart = (product: any) => {
    addItem(product, 1);
    toast.success('Added to cart! 🛒');
  };

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-24 h-24 rounded-full bg-primary-50 flex items-center justify-center mx-auto mb-6">
            <Heart size={40} className="text-primary-300" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Your wishlist is empty</h2>
          <p className="text-slate-500 mb-8">Save your favorite products to find them here</p>
          <Link href="/products">
            <Button icon={<ArrowLeft size={18} />} size="lg">Start Shopping</Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">My Wishlist</h1>
          <p className="text-slate-500 mt-1">{items.length} saved items</p>
        </div>
        <button
          onClick={() => { clearWishlist(); toast('Wishlist cleared', { icon: '💔' }); }}
          className="text-sm text-red-500 hover:text-red-600 font-medium flex items-center gap-1.5 cursor-pointer"
        >
          <Trash2 size={15} /> Clear Wishlist
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence>
          {items.map((product) => (
            <motion.div
              key={product._id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-premium border border-slate-100 transition-all duration-300"
            >
              <Link href={`/products/${product._id}`}>
                <div className="relative h-48 bg-slate-50 overflow-hidden">
                  <Image
                    src={product.images?.[0]?.url || 'https://via.placeholder.com/400'}
                    alt={product.name}
                    fill
                    className="object-cover img-zoom"
                  />
                  <button
                    onClick={(e) => { e.preventDefault(); removeFromWishlist(product._id); toast('Removed from wishlist', { icon: '💔' }); }}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                    aria-label="Remove"
                  >
                    <Heart size={15} className="fill-current" />
                  </button>
                </div>
                <div className="p-4">
                  <p className="text-xs font-semibold text-primary-600 uppercase tracking-wide mb-1">{product.brand}</p>
                  <h3 className="font-semibold text-slate-800 text-sm line-clamp-2 mb-2 group-hover:text-primary-600 transition-colors">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-slate-800">${product.price.toFixed(2)}</span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-sm text-slate-400 line-through">${product.originalPrice.toFixed(2)}</span>
                    )}
                  </div>
                </div>
              </Link>
              <div className="px-4 pb-4">
                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock === 0}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white shadow-premium-sm transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ShoppingCart size={16} /> {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
