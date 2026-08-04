'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, TrendingUp, Truck, Shield, RotateCcw, Star, Zap } from 'lucide-react';

const collageItems = [
  {
    src: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
    alt: 'Laptop',
    className: 'top-0 left-0 w-40 h-40 md:w-48 md:h-48',
    float: 'animate-float',
    delay: 0,
  },
  {
    src: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
    alt: 'Phone',
    className: 'top-10 right-0 w-36 h-36 md:w-44 md:h-44',
    float: 'animate-float-slow',
    delay: 0.2,
  },
  {
    src: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    alt: 'Shoes',
    className: 'bottom-24 left-8 w-36 h-36 md:w-44 md:h-44',
    float: 'animate-float-slow',
    delay: 0.4,
  },
  {
    src: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
    alt: 'Watch',
    className: 'bottom-0 right-16 w-32 h-32 md:w-40 md:h-40',
    float: 'animate-float',
    delay: 0.1,
  },
  {
    src: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    alt: 'Headphones',
    className: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-44 h-44 md:w-56 md:h-56',
    float: 'animate-float',
    delay: 0.3,
  },
];

export default function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-600 text-white">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-white/5 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-medium mb-6 border border-white/20">
              <Zap size={14} className="text-accent-400" />
              Premium Collection 2024
            </span>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6 font-display">
              Shop Smarter,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-400 to-accent-300">
                Live Better
              </span>
            </h1>

            <p className="text-primary-200 text-lg md:text-xl mb-8 leading-relaxed">
              Discover thousands of premium products across every category. Free shipping, secure payments, easy returns.
            </p>

            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white font-semibold px-8 py-3.5 rounded-2xl shadow-lg shadow-accent-500/30 transition-all hover:scale-105 active:scale-95"
              >
                Shop Now <ArrowRight size={18} />
              </Link>
              <Link
                href="/products?featured=true"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold px-8 py-3.5 rounded-2xl border border-white/20 transition-all"
              >
                <TrendingUp size={18} /> Explore Products
              </Link>
            </div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-center lg:justify-start gap-6 mt-10"
            >
              {[
                { icon: Truck, label: 'Free Shipping' },
                { icon: Shield, label: 'Secure Pay' },
                { icon: RotateCcw, label: 'Easy Returns' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-sm text-primary-200">
                  <Icon size={18} className="text-accent-400" />
                  {label}
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex items-center justify-center lg:justify-start gap-6 mt-8"
            >
              {[['10K+', 'Products'], ['50K+', 'Customers'], ['4.9★', 'Rating']].map(([val, label]) => (
                <div key={label} className="text-center lg:text-left">
                  <p className="text-xl font-bold">{val}</p>
                  <p className="text-sm text-primary-300">{label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Product Collage */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="relative h-[420px] md:h-[480px] hidden md:block"
          >
            {collageItems.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                className={`absolute ${item.className} ${item.float}`}
              >
                <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl shadow-black/30 border-4 border-white/20">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 40vw, 200px"
                  />
                </div>
              </motion.div>
            ))}

            {/* Floating rating badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2 }}
              className="absolute bottom-6 left-0 bg-white/95 backdrop-blur rounded-2xl px-4 py-3 shadow-xl flex items-center gap-3"
            >
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                ))}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">4.9/5</p>
                <p className="text-xs text-slate-500">50K+ reviews</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
