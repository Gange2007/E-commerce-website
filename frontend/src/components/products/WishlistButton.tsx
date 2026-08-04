'use client';
import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useWishlistStore } from '@/store/wishlistStore';
import type { Product } from '@/types';
import toast from 'react-hot-toast';

interface WishlistButtonProps {
  product: Product;
  size?: 'sm' | 'md';
  className?: string;
}

export default function WishlistButton({ product, size = 'md', className = '' }: WishlistButtonProps) {
  const { isWishlisted, toggleWishlist } = useWishlistStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const active = mounted && isWishlisted(product._id);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    if (!active) {
      toast.success('Added to wishlist ❤️', { icon: '❤️' });
    } else {
      toast('Removed from wishlist', { icon: '💔' });
    }
  };

  const sizeClasses = size === 'sm' ? 'w-8 h-8' : 'w-9 h-9';

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleClick}
      aria-label={active ? 'Remove from wishlist' : 'Add to wishlist'}
      className={`${sizeClasses} rounded-full flex items-center justify-center transition-all shadow-sm cursor-pointer
        ${active
          ? 'bg-red-500 text-white'
          : 'bg-white/80 backdrop-blur-sm text-slate-500 hover:text-red-500 hover:bg-red-50 border border-slate-200'
        } ${className}`}
    >
      <Heart size={size === 'sm' ? 15 : 18} className={active ? 'fill-current' : ''} />
    </motion.button>
  );
}
