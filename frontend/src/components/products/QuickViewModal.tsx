'use client';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { X, ShoppingCart, Eye, Star, Truck, Shield, RotateCcw } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import type { Product } from '@/types';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import WishlistButton from './WishlistButton';
import toast from 'react-hot-toast';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const addItem = useCartStore((s) => s.addItem);

  if (!product) return null;

  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    addItem(product, 1);
    toast.success('Added to cart! 🛒');
  };

  return (
    <AnimatePresence>
      {product && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative bg-white rounded-3xl shadow-2xl w-full max-w-3xl z-10 overflow-hidden"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 shadow-md hover:bg-slate-100 text-slate-500 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <div className="grid md:grid-cols-2">
              {/* Image */}
              <div className="relative h-64 md:h-full bg-slate-50">
                <Image
                  src={product.images?.[0]?.url || 'https://via.placeholder.com/500'}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
                {discount > 0 && (
                  <span className="absolute top-4 left-4 bg-accent-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                    -{discount}%
                  </span>
                )}
              </div>

              {/* Details */}
              <div className="p-6 md:p-8">
                <p className="text-sm font-semibold text-primary-600 mb-1">{product.brand}</p>
                <h2 className="text-xl font-bold text-slate-800 mb-2 line-clamp-2">{product.name}</h2>

                <div className="flex items-center gap-2 mb-3">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={i < Math.floor(product.rating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'fill-slate-200 text-slate-200'}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-slate-500">({product.numReviews} reviews)</span>
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl font-extrabold text-slate-800">${product.price.toFixed(2)}</span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-lg text-slate-400 line-through">${product.originalPrice.toFixed(2)}</span>
                  )}
                </div>

                <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-3">
                  {product.description}
                </p>

                <div className="flex items-center gap-2 mb-5">
                  {product.stock > 0 ? (
                    <Badge color="emerald">In Stock</Badge>
                  ) : (
                    <Badge color="red">Out of Stock</Badge>
                  )}
                  {product.category && <Badge color="purple">{product.category.name}</Badge>}
                </div>

                <div className="grid grid-cols-2 gap-3 mb-5">
                  <Button
                    variant="primary"
                    icon={<ShoppingCart size={16} />}
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                  >
                    Add to Cart
                  </Button>
                  <WishlistButton product={product} className="w-full !bg-white border border-slate-200" />
                </div>

                <Link href={`/products/${product._id}`}>
                  <Button variant="outline" fullWidth icon={<Eye size={16} />}>
                    View Full Details
                  </Button>
                </Link>

                <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-slate-100">
                  {[
                    { icon: Truck, label: 'Free Ship' },
                    { icon: Shield, label: 'Secure' },
                    { icon: RotateCcw, label: 'Returns' },
                  ].map(({ icon: Icon, label }) => (
                    <div key={label} className="flex flex-col items-center gap-1 text-center">
                      <Icon size={16} className="text-primary-500" />
                      <span className="text-[11px] text-slate-500">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
