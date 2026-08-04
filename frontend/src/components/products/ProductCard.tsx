'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Star, Eye, TrendingUp, Zap } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import type { Product } from '@/types';
import toast from 'react-hot-toast';
import Badge from '@/components/ui/Badge';
import WishlistButton from './WishlistButton';
import QuickViewModal from './QuickViewModal';
import { useRouter } from 'next/navigation';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const router = useRouter();
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (product.stock === 0) return;
    addItem(product, 1);
    toast.success(`${product.name} added to cart!`, {
      icon: '🛒',
      style: { borderRadius: '12px', fontWeight: '500' },
    });
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    if (product.stock === 0) return;
    addItem(product, 1);
    toast.success('Proceeding to checkout...');
    router.push('/checkout');
  };

  const imageUrl = product.images?.[0]?.url || 'https://via.placeholder.com/400x300?text=No+Image';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-premium border border-slate-100 hover:border-primary-200 transition-all duration-300"
    >
      <Link href={`/products/${product._id}`}>
        <div className="relative overflow-hidden h-52 bg-slate-50">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover img-zoom"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            loading="lazy"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {discount > 0 && (
              <span className="bg-accent-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                -{discount}%
              </span>
            )}
            {product.isFeatured && (
              <span className="bg-gradient-to-r from-primary-600 to-primary-500 text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                <TrendingUp size={10} /> Featured
              </span>
            )}
            {product.stock === 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                Out of Stock
              </span>
            )}
            {product.stock > 0 && product.stock <= 10 && (
              <span className="bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-full animate-pulse">
                Only {product.stock} left
              </span>
            )}
          </div>

          {/* Wishlist */}
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <WishlistButton product={product} />
          </div>

          {/* Quick view */}
          <button
            onClick={(e) => { e.preventDefault(); setQuickViewOpen(true); }}
            className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary-600 hover:text-white cursor-pointer"
            aria-label="Quick view"
          >
            <Eye size={16} className="text-slate-600 group-hover:text-white" />
          </button>
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs font-semibold text-primary-600 uppercase tracking-wide">{product.brand}</p>
            <Badge color={product.stock > 0 ? 'emerald' : 'red'} className="text-[10px]">
              {product.stock > 0 ? 'In Stock' : 'Sold Out'}
            </Badge>
          </div>
          <h3 className="font-semibold text-slate-800 text-sm line-clamp-2 leading-snug mb-2 group-hover:text-primary-600 transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-3">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={12}
                  className={i < Math.floor(product.rating)
                    ? 'fill-amber-400 text-amber-400'
                    : 'fill-slate-200 text-slate-200'}
                />
              ))}
            </div>
            <span className="text-xs text-slate-500">({product.numReviews})</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg font-bold text-slate-800">${product.price.toFixed(2)}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-slate-400 line-through">${product.originalPrice.toFixed(2)}</span>
            )}
          </div>
        </div>
      </Link>

      <div className="px-4 pb-4 space-y-2">
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className={`
            w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer
            ${product.stock === 0
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white shadow-premium-sm hover:shadow-premium active:scale-95'}
          `}
        >
          <ShoppingCart size={16} />
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
        <button
          onClick={handleBuyNow}
          disabled={product.stock === 0}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-semibold border border-primary-300 text-primary-600 hover:bg-primary-50 transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Zap size={15} /> Buy Now
        </button>
      </div>

      <QuickViewModal product={quickViewOpen ? product : null} onClose={() => setQuickViewOpen(false)} />
    </motion.div>
  );
}
