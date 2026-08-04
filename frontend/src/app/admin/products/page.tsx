'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Plus,
  Edit3,
  Trash2,
  Search,
  Package,
  ChevronDown,
  AlertTriangle,
} from 'lucide-react';
import { productAPI } from '@/lib/api';
import type { Product } from '@/types';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { Skeleton } from '@/components/ui/Skeleton';
import toast from 'react-hot-toast';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = { page, limit: 15 };
      if (search.trim()) params.keyword = search.trim();
      const res = await productAPI.getAll(params);
      setProducts(res.data.products);
      setPages(res.data.pages);
      setTotal(res.data.total);
    } catch {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await productAPI.delete(deleteId);
      toast.success('Product deleted');
      setDeleteId(null);
      fetchProducts();
    } catch {
      toast.error('Failed to delete product');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Products</h1>
          <p className="text-slate-500 text-sm mt-1">{total} total products</p>
        </div>
        <Link href="/admin/products/new">
          <Button icon={<Plus size={16} />}>
            Add Product
          </Button>
        </Link>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="relative max-w-md">
        <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none text-sm"
        />
      </form>

      {/* Table */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
          <Package size={48} className="text-slate-200 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-slate-700 mb-2">No products found</h3>
          <p className="text-slate-500 mb-4">
            {search ? 'Try a different search term' : 'Get started by adding your first product'}
          </p>
          {!search && (
            <Link href="/admin/products/new">
              <Button icon={<Plus size={16} />}>Add Product</Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="text-left py-3.5 px-4 font-semibold text-slate-600">Product</th>
                  <th className="text-left py-3.5 px-4 font-semibold text-slate-600 hidden sm:table-cell">Category</th>
                  <th className="text-left py-3.5 px-4 font-semibold text-slate-600 hidden md:table-cell">Price</th>
                  <th className="text-left py-3.5 px-4 font-semibold text-slate-600 hidden md:table-cell">Stock</th>
                  <th className="text-left py-3.5 px-4 font-semibold text-slate-600 hidden lg:table-cell">Sold</th>
                  <th className="text-right py-3.5 px-4 font-semibold text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, i) => (
                  <motion.tr
                    key={product._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-slate-50 flex-shrink-0">
                          <Image
                            src={product.images?.[0]?.url || 'https://via.placeholder.com/100'}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-slate-800 truncate max-w-[200px]">{product.name}</p>
                          <p className="text-xs text-slate-500">{product.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 hidden sm:table-cell">
                      <Badge color="indigo">{product.category?.name || 'N/A'}</Badge>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell">
<span className="font-semibold text-slate-800">${product.price.toFixed(2)}</span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-xs text-slate-400 line-through ml-1.5">${product.originalPrice.toFixed(2)}</span>
                      )}
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      <Badge color={product.stock > 10 ? 'emerald' : product.stock > 0 ? 'yellow' : 'red'}>
                        {product.stock}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 hidden lg:table-cell text-slate-600">{product.sold}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/admin/products/${product._id}`}>
                          <button className="p-2 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all cursor-pointer">
                            <Edit3 size={15} />
                          </button>
                        </Link>
                        <button
                          onClick={() => setDeleteId(product._id)}
                          className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pages > 1 && (
            <div className="flex items-center justify-center gap-2 p-4 border-t border-slate-100">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm text-slate-600 disabled:opacity-40 hover:border-indigo-300 transition-all cursor-pointer disabled:cursor-not-allowed"
              >
                Prev
              </button>
              {Array.from({ length: Math.min(pages, 5) }).map((_, i) => {
                const p = i + 1;
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                      page === p
                        ? 'bg-indigo-600 text-white'
                        : 'border border-slate-200 text-slate-600 hover:border-indigo-300'
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
              <button
                onClick={() => setPage(Math.min(pages, page + 1))}
                disabled={page === pages}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm text-slate-600 disabled:opacity-40 hover:border-indigo-300 transition-all cursor-pointer disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        confirmText="Delete"
        loading={deleting}
      />
    </div>
  );
}

