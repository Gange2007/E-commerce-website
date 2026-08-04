'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Package, Loader2 } from 'lucide-react';
import { productAPI, categoryAPI } from '@/lib/api';
import type { Category } from '@/types';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import toast from 'react-hot-toast';

export default function EditProductPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    brand: '',
    category: '',
    stock: '',
    isFeatured: false,
    tags: '',
    images: [{ url: '' }, { url: '' }, { url: '' }],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, catRes] = await Promise.all([
          productAPI.getById(id),
          categoryAPI.getAll(),
        ]);
        const product = productRes.data.product;
        setCategories(catRes.data.categories);

        setForm({
          name: product.name || '',
          description: product.description || '',
          price: product.price?.toString() || '',
          originalPrice: product.originalPrice?.toString() || '',
          brand: product.brand || '',
          category: product.category?._id || '',
          stock: product.stock?.toString() || '',
          isFeatured: product.isFeatured || false,
          tags: product.tags?.join(', ') || '',
          images: [
            { url: product.images?.[0]?.url || '' },
            { url: product.images?.[1]?.url || '' },
            { url: product.images?.[2]?.url || '' },
          ],
        });
      } catch {
        toast.error('Failed to load product');
        router.push('/admin/products');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, router]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Product name is required';
    if (!form.description.trim()) e.description = 'Description is required';
    if (!form.price || Number(form.price) <= 0) e.price = 'Valid price is required';
    if (!form.brand.trim()) e.brand = 'Brand is required';
    if (!form.category) e.category = 'Category is required';
    if (!form.stock || Number(form.stock) < 0) e.stock = 'Valid stock is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      const productData = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
        brand: form.brand.trim(),
        category: form.category,
        stock: Number(form.stock),
        isFeatured: form.isFeatured,
        tags: form.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        images: form.images.filter((img) => img.url.trim()),
      };

      await productAPI.update(id, productData);
      toast.success('Product updated successfully!');
      router.push('/admin/products');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update product');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <ArrowLeft size={20} className="text-slate-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Edit Product</h1>
          <p className="text-slate-500 text-sm">Update product details</p>
        </div>
      </div>

      <motion.form
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-6"
      >
        <div>
          <h2 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <Package size={16} /> Basic Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Input
                label="Product Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                error={errors.name}
                placeholder="Wireless Headphones Pro"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
              <textarea
                rows={4}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Detailed product description..."
                className={`w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none text-sm resize-none ${
                  errors.description ? 'border-red-400' : ''
                }`}
              />
              {errors.description && <p className="mt-1.5 text-sm text-red-500">{errors.description}</p>}
            </div>
            <Input
              label="Price ($)"
              type="number"
              step="0.01"
              min="0"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              error={errors.price}
              placeholder="99.99"
            />
            <Input
              label="Original Price ($)"
              type="number"
              step="0.01"
              min="0"
              value={form.originalPrice}
              onChange={(e) => setForm({ ...form, originalPrice: e.target.value })}
              placeholder="129.99"
            />
            <Input
              label="Brand"
              value={form.brand}
              onChange={(e) => setForm({ ...form, brand: e.target.value })}
              error={errors.brand}
              placeholder="Brand name"
            />
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className={`w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none text-sm bg-white ${
                  errors.category ? 'border-red-400' : ''
                }`}
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
              {errors.category && <p className="mt-1.5 text-sm text-red-500">{errors.category}</p>}
            </div>
            <Input
              label="Stock"
              type="number"
              min="0"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
              error={errors.stock}
              placeholder="100"
            />
          </div>
        </div>

        <div className="border-t border-slate-100 pt-6">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">Product Images</h2>
          <div className="space-y-3">
            {form.images.map((img, i) => (
              <Input
                key={i}
                label={`Image URL ${i + 1}`}
                value={img.url}
                onChange={(e) => {
                  const images = [...form.images];
                  images[i] = { url: e.target.value };
                  setForm({ ...form, images });
                }}
                placeholder="https://images.unsplash.com/..."
              />
            ))}
          </div>
        </div>

        <div className="border-t border-slate-100 pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Tags (comma separated)"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              placeholder="wireless, headphones, audio"
            />
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Featured Product</label>
              <label className="inline-flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                  className="w-5 h-5 rounded-md border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-slate-600">Show as featured product</span>
              </label>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-6 flex gap-3">
          <Button variant="ghost" className="border border-slate-200" onClick={() => router.back()} type="button">
            Cancel
          </Button>
          <Button type="submit" loading={saving} icon={<Save size={16} />} fullWidth>
            Update Product
          </Button>
        </div>
      </motion.form>
    </div>
  );
}

