'use client';
import { motion } from 'framer-motion';

const brands = [
  'Apple', 'Samsung', 'Nike', 'Adidas', 'Sony', 'Dell',
  'HP', 'Lenovo', 'Puma', 'Levi\'s', 'LG', 'Philips',
  'Dyson', 'Whirlpool', 'Nivea', 'Biba', 'M.A.C', 'Yonex',
];

export default function BrandMarquee() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-8"
      >
        <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">Top Brands</span>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mt-2 font-display">Brands You Trust</h2>
      </motion.div>

      <div className="relative overflow-hidden">
        <div className="flex gap-12 animate-marquee w-max">
          {[...brands, ...brands].map((brand, i) => (
            <div
              key={i}
              className="flex items-center justify-center text-xl font-bold text-slate-300 hover:text-primary-400 transition-colors whitespace-nowrap cursor-default"
            >
              {brand}
            </div>
          ))}
        </div>
        {/* Gradient fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent pointer-events-none" />
      </div>
    </section>
  );
}
