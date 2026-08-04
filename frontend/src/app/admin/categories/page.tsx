'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Edit3,
  Trash2,
  ListTree,
  X,
} from 'lucide-react';
import { categoryAPI } from '@/lib/api';
import type { Category } from '@/types';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { Skeleton } from '@/components/ui/Skeleton';
import toast from 'react-hot-toast';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', image: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fetchCategories = async () => {
    try {
      const res = await categoryAPI.getAll();
      setCategories(res.data.categories);
    } catch {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', description: '', image: '' });
    setErrors({});
    setModalOpen(true);
  };

  const openEdit = (cat: Category) => {
    setEditing(cat);
    setForm({
      name: cat.name,
      description: cat.description || '',
      image: cat.image || '',
    });
    setErrors({});
    setModalOpen(true);
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Category name is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      if (editing) {
        await categoryAPI.update(editing._id, form);
        toast.success('Category updated');
      } else {
        await categoryAPI.create(form);
        toast.success('Category created');
      }
      setModalOpen(false);
      fetchCategories();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save category');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await categoryAPI.delete(deleteId);
      toast.success('Category deleted');
      setDeleteId(null);
      fetchCategories();
    } catch {
      toast.error('Failed to delete category');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Categories</h1>
          <p className="text-slate-500 text-sm mt-1">{categories.length} total categories</p>
        </div>
        <Button onClick={openCreate} icon={<Plus size={16} />}>
          Add Category
        </Button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
          <ListTree size={48} className="text-slate-200 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-slate-700 mb-2">No categories</h3>
          <p className="text-slate-500 mb-4">Create your first category to organize products</p>
          <Button onClick={openCreate} icon={<Plus size={16} />}>
            Add Category
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-lg">
                    {cat.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 text-sm">{cat.name}</h3>
                    <p className="text-xs text-slate-500">{cat.slug}</p>
                  </div>
                </div>
                <Badge color={cat.isActive ? 'emerald' : 'red'}>
                  {cat.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              {cat.description && (
                <p className="text-sm text-slate-500 mb-4 line-clamp-2">{cat.description}</p>
              )}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <p className="text-xs text-slate-400">
                  Created {new Date(cat.createdAt).toLocaleDateString()}
                </p>
                <div className="flex gap-1">
                  <button
                    onClick={() => openEdit(cat)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all cursor-pointer"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    onClick={() => setDeleteId(cat._id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Category' : 'Add Category'}
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="Category Name"
            value={form.name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, name: e.target.value })}
            error={errors.name}
            placeholder="Electronics"
          />
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setForm({ ...form, description: e.target.value })}
              placeholder="Brief description..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none text-sm resize-none"
            />
          </div>
          <Input
            label="Image URL (optional)"
            value={form.image}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, image: e.target.value })}
            placeholder="https://images.unsplash.com/..."
          />
          <div className="flex gap-3 pt-2">
            <Button variant="ghost" className="!border !border-slate-200" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button fullWidth loading={saving} onClick={handleSave}>
              {editing ? 'Update' : 'Create'} Category
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Category"
        message="Are you sure you want to delete this category? Products in this category may be affected."
        confirmText="Delete"
        loading={deleting}
      />
    </div>
  );
}

