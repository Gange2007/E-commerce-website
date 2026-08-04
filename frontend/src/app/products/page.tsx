'use client';
import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { SlidersHorizontal, ChevronDown, X, Search, Grid, List } from 'lucide-react';
import ProductCard from '@/components/products/ProductCard';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';
import { productAPI, categoryAPI } from '@/lib/api';
import type { Product, Category } from '@/types';

const sortOptions = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Most Popular', value: 'popular' },
  { label: 'Top Rated', value: 'rating' },
];

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtersLoading, setFiltersLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [filters, setFilters] = useState({
    keyword: searchParams.get('keyword') || '',
    category: searchParams.get('category') || '',
    brand: searchParams.get('brand') || '',
    subcategory: searchParams.get('subcategory') || '',
    sort: searchParams.get('sort') || 'newest',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    page: Number(searchParams.get('page')) || 1,
    featured: searchParams.get('featured') || '',
  });

  useEffect(() => {
    categoryAPI.getAll().then((r) => setCategories(r.data.categories));
  }, []);

  // Fetch brand/subcategory options whenever category changes
  useEffect(() => {
    setFiltersLoading(true);
    productAPI
      .getFilters(filters.category || undefined)
      .then((r) => {
        setBrands(r.data.brands || []);
        setSubcategories(r.data.subcategories || []);
      })
      .catch(() => {})
      .finally(() => setFiltersLoading(false));
  }, [filters.category]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = {
        sort: filters.sort,
        page: filters.page,
        limit: 12,
      };
      if (filters.keyword) params.keyword = filters.keyword;
      if (filters.category) params.category = filters.category;
      if (filters.brand) params.brand = filters.brand;
      if (filters.subcategory) params.subcategory = filters.subcategory;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.featured) params.featured = filters.featured;

      const res = await productAPI.getAll(params);
      setProducts(res.data.products);
      setTotal(res.data.total);
      setPages(res.data.pages);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

const updateFilter = (key: string, value: string | number) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: key !== 'page' ? 1 : (value as number) }));
  };

  const clearFilters = () => {
    setFilters({ keyword: '', category: '', brand: '', subcategory: '', sort: 'newest', minPrice: '', maxPrice: '', page: 1, featured: '' });
  };

  const hasActiveFilters = filters.keyword || filters.category || filters.brand || filters.subcategory || filters.minPrice || filters.maxPrice || filters.featured;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            {filters.keyword ? `Results for "${filters.keyword}"` : 'All Products'}
          </h1>
          <p className="text-slate-500 text-sm mt-1">{total} products found</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:border-indigo-300 hover:text-indigo-600 text-sm font-medium transition-all cursor-pointer"
          >
            <SlidersHorizontal size={16} /> Filters
            {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-indigo-500" />}
          </button>
          <div className="relative">
            <select
              value={filters.sort}
              onChange={(e) => updateFilter('sort', e.target.value)}
              className="appearance-none pl-3 pr-8 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-medium focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none cursor-pointer bg-white"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {filtersOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-slate-200 p-6 mb-6 shadow-sm"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Search</label>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={filters.keyword}
                  onChange={(e) => updateFilter('keyword', e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none text-sm"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Category</label>
              <div className="relative">
                <select
                  value={filters.category}
                  onChange={(e) => updateFilter('category', e.target.value)}
                  className="w-full appearance-none px-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none text-sm bg-white cursor-pointer"
                >
                  <option value="">All Categories</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Brand */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Brand</label>
              <div className="relative">
                <select
                  value={filters.brand}
                  onChange={(e) => updateFilter('brand', e.target.value)}
                  disabled={filtersLoading && brands.length === 0}
                  className="w-full appearance-none px-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none text-sm bg-white cursor-pointer disabled:opacity-60 disabled:cursor-wait"
                >
                  <option value="">All Brands</option>
                  {brands.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Subcategory */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Subcategory</label>
              <div className="relative">
                <select
                  value={filters.subcategory}
                  onChange={(e) => updateFilter('subcategory', e.target.value)}
                  disabled={filtersLoading && subcategories.length === 0}
                  className="w-full appearance-none px-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none text-sm bg-white cursor-pointer disabled:opacity-60 disabled:cursor-wait"
                >
                  <option value="">All Subcategories</option>
                  {subcategories.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Min Price ($)</label>
              <input
                type="number"
                placeholder="0"
                value={filters.minPrice}
                onChange={(e) => updateFilter('minPrice', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Max Price ($)</label>
              <input
                type="number"
                placeholder="9999"
                value={filters.maxPrice}
                onChange={(e) => updateFilter('maxPrice', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none text-sm"
              />
            </div>
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="mt-4 flex items-center gap-1.5 text-sm font-medium text-red-500 hover:text-red-600 cursor-pointer"
            >
              <X size={14} /> Clear all filters
            </button>
          )}
        </motion.div>
      )}

      {/* Active filter chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mb-5">
          {filters.keyword && (
            <span className="inline-flex items-center gap-1.5 bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-medium">
              Search: {filters.keyword}
              <button onClick={() => updateFilter('keyword', '')} className="cursor-pointer"><X size={12} /></button>
            </span>
          )}
{filters.category && (
            <span className="inline-flex items-center gap-1.5 bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-medium">
              Category: {categories.find(c => c._id === filters.category)?.name}
              <button onClick={() => updateFilter('category', '')} className="cursor-pointer"><X size={12} /></button>
            </span>
          )}
          {filters.brand && (
            <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-medium">
              Brand: {filters.brand}
              <button onClick={() => updateFilter('brand', '')} className="cursor-pointer"><X size={12} /></button>
            </span>
          )}
          {filters.subcategory && (
            <span className="inline-flex items-center gap-1.5 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium">
              Subcategory: {filters.subcategory}
              <button onClick={() => updateFilter('subcategory', '')} className="cursor-pointer"><X size={12} /></button>
            </span>
          )}
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 12 }).map((_, i) => <ProductCardSkeleton key={i} />)}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-slate-700 mb-2">No products found</h3>
          <p className="text-slate-500 mb-6">Try adjusting your filters or search term</p>
          <button onClick={clearFilters}
            className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors cursor-pointer">
            Clear Filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          {pages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              <button
                onClick={() => updateFilter('page', filters.page - 1)}
                disabled={filters.page === 1}
                className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 disabled:opacity-40 hover:border-indigo-300 hover:text-indigo-600 transition-all cursor-pointer disabled:cursor-not-allowed"
              >
                Previous
              </button>
              {Array.from({ length: pages }).map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => updateFilter('page', i + 1)}
                  className={`w-10 h-10 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                    filters.page === i + 1
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                      : 'border border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => updateFilter('page', filters.page + 1)}
                disabled={filters.page === pages}
                className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 disabled:opacity-40 hover:border-indigo-300 hover:text-indigo-600 transition-all cursor-pointer disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 12 }).map((_, i) => <ProductCardSkeleton key={i} />)}
        </div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
