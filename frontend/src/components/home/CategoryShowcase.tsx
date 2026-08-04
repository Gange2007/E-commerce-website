'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Category } from '@/types';

interface CategoryShowcaseProps {
  categories: Category[];
}

const categoryIcons: Record<string, { emoji: string; gradient: string }> = {
  'Electronics': { emoji: '💻', gradient: 'from-indigo-500 to-purple-500' },
  'Clothing': { emoji: '👗', gradient: 'from-pink-500 to-rose-500' },
  'Fashion': { emoji: '👗', gradient: 'from-pink-500 to-rose-500' },
  'Beauty': { emoji: '💄', gradient: 'from-orange-500 to-red-500' },
  'Books': { emoji: '📚', gradient: 'from-emerald-500 to-teal-500' },
  'Sports': { emoji: '⚽', gradient: 'from-blue-500 to-cyan-500' },
  'Home & Garden': { emoji: '🏡', gradient: 'from-amber-500 to-orange-500' },
  'Home & Kitchen': { emoji: '🏡', gradient: 'from-amber-500 to-orange-500' },
  'Groceries': { emoji: '🛒', gradient: 'from-lime-500 to-green-500' },
  'Accessories': { emoji: '⌚', gradient: 'from-slate-500 to-gray-500' },
};

export default function CategoryShowcase({ categories }: CategoryShowcaseProps) {
  if (categories.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 font-display">Shop by Category</h2>
          <p className="text-slate-500 mt-1">Find exactly what you&apos;re looking for</p>
        </div>
        <Link href="/products" className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1">
          All Products <ArrowRight size={16} />
        </Link>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {categories.map((cat, i) => {
          const icon = categoryIcons[cat.name] || { emoji: '📦', gradient: 'from-primary-500 to-primary-600' };
          return (
            <motion.div
              key={cat._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Link href={`/products?category=${cat._id}`}>
                <motion.div
                  whileHover={{ y: -6, scale: 1.02 }}
                  className="group relative bg-white rounded-2xl p-6 text-center shadow-sm border border-slate-100 hover:border-primary-200 hover:shadow-premium-sm transition-all cursor-pointer overflow-hidden"
                >
                  {/* Gradient background on hover */}
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-gradient-to-br ${icon.gradient}`} />
                  <div className="relative">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${icon.gradient} flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                      <span className="text-2xl">{icon.emoji}</span>
                    </div>
                    <p className="text-sm font-semibold text-slate-700 group-hover:text-primary-600 transition-colors">
                      {cat.name}
                    </p>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
