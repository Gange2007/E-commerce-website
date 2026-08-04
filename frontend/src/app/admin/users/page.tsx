'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Users, Shield, Trash2, User as UserIcon } from 'lucide-react';
import { adminAPI } from '@/lib/api';
import type { User } from '@/types';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { Skeleton } from '@/components/ui/Skeleton';
import toast from 'react-hot-toast';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = { page, limit: 20 };
      if (search.trim()) params.search = search.trim();
      const res = await adminAPI.getUsers(params);
      setUsers(res.data.users);
      setPages(res.data.pages);
      setTotal(res.data.total);
    } catch {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const handleRoleToggle = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      await adminAPI.updateUser(userId, { role: newRole });
      toast.success(`User role updated to ${newRole}`);
      fetchUsers();
    } catch {
      toast.error('Failed to update user role');
    }
  };

  const handleStatusToggle = async (userId: string, currentStatus: boolean) => {
    try {
      await adminAPI.updateUser(userId, { isActive: !currentStatus });
      toast.success(`User ${currentStatus ? 'deactivated' : 'activated'} successfully`);
      fetchUsers();
    } catch {
      toast.error('Failed to update user status');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await adminAPI.deleteUser(deleteId);
      toast.success('User deleted');
      setDeleteId(null);
      fetchUsers();
    } catch {
      toast.error('Failed to delete user');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Users</h1>
          <p className="text-slate-500 text-sm mt-1">{total} total users</p>
        </div>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="relative max-w-md">
        <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none text-sm"
        />
      </form>

      {/* Users Table */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
          <Users size={48} className="text-slate-200 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-slate-700 mb-2">
            {search ? 'No users found' : 'No users yet'}
          </h3>
          <p className="text-slate-500">
            {search ? 'Try a different search term' : 'Users will appear here once they register'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="text-left py-3.5 px-4 font-semibold text-slate-600">User</th>
                  <th className="text-left py-3.5 px-4 font-semibold text-slate-600 hidden sm:table-cell">Role</th>
                  <th className="text-left py-3.5 px-4 font-semibold text-slate-600 hidden md:table-cell">Status</th>
                  <th className="text-left py-3.5 px-4 font-semibold text-slate-600 hidden lg:table-cell">Joined</th>
                  <th className="text-right py-3.5 px-4 font-semibold text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, i) => (
                  <motion.tr
                    key={user._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-slate-800 truncate max-w-[180px] text-sm">
                            {user.name}
                          </p>
                          <p className="text-xs text-slate-500 truncate max-w-[180px]">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 hidden sm:table-cell">
                      {user.role === 'admin' ? (
                        <div className="flex items-center gap-1.5">
                          <Shield size={12} className="text-indigo-500" />
                          <Badge color="indigo">Admin</Badge>
                        </div>
                      ) : (
                        <Badge color="slate">User</Badge>
                      )}
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      <Badge color={user.isActive ? 'emerald' : 'red'}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 hidden lg:table-cell text-slate-500 text-xs">
                      {new Date(user.createdAt).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric',
                      })}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {/* Toggle Role */}
                        <button
                          onClick={() => handleRoleToggle(user._id, user.role)}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all cursor-pointer"
                          title={`Switch to ${user.role === 'admin' ? 'user' : 'admin'}`}
                        >
                          <Shield size={14} />
                        </button>

                        {/* Toggle Status */}
                        <button
                          onClick={() => handleStatusToggle(user._id, user.isActive)}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                            user.isActive
                              ? 'text-red-500 hover:bg-red-50'
                              : 'text-emerald-600 hover:bg-emerald-50'
                          }`}
                          title={user.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {user.isActive ? 'Deactivate' : 'Activate'}
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => setDeleteId(user._id)}
                          className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer"
                          title="Delete user"
                        >
                          <Trash2 size={14} />
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
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone."
        confirmText="Delete"
        loading={deleting}
      />
    </div>
  );
}

