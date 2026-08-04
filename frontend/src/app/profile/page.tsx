'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Lock, Eye, EyeOff, Shield, Save } from 'lucide-react';
import { userAPI } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'password'>('info');

  useEffect(() => {
    setMounted(true);
  }, []);

  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: {
      street: user?.address?.street || '',
      city: user?.address?.city || '',
      state: user?.address?.state || '',
      zipCode: user?.address?.zipCode || '',
      country: user?.address?.country || '',
    },
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showPasswords, setShowPasswords] = useState({ current: false, new: false });
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingProfile(true);
    try {
      const res = await userAPI.updateProfile(profileForm);
      updateUser(res.data.user);
      toast.success('Profile updated successfully!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoadingProfile(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoadingPassword(true);
    try {
      await userAPI.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      toast.success('Password changed successfully!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Password change failed');
    } finally {
      setLoadingPassword(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-2xl p-6 mb-6 text-white">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-2xl font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl font-bold">{user?.name}</h1>
            <p className="text-indigo-200 text-sm">{user?.email}</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge color="indigo" className="!bg-white/20 !text-white text-xs">
                {user?.role === 'admin' ? (
                  <><Shield size={10} className="mr-1" /> Admin</>
                ) : (
                  <><User size={10} className="mr-1" /> Customer</>
                )}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 mb-6">
        {[
          { id: 'info', label: 'Profile Info', icon: User },
          { id: 'password', label: 'Change Password', icon: Lock },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as any)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
              activeTab === id
                ? 'bg-white shadow-sm text-indigo-600'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            <Icon size={16} /> {label}
          </button>
        ))}
      </div>

      {/* Profile Info */}
      {activeTab === 'info' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6"
        >
          <form onSubmit={handleProfileSave} className="space-y-5">
            <Input
              label="Full Name"
              value={profileForm.name}
              onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
              icon={<User size={17} />}
              placeholder="Your full name"
            />
            <Input
              label="Email Address"
              value={user?.email || ''}
              disabled
              icon={<Mail size={17} />}
              className="bg-slate-50 cursor-not-allowed"
            />
            <Input
              label="Phone Number"
              value={profileForm.phone}
              onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
              icon={<Phone size={17} />}
              placeholder="+1 (555) 123-4567"
            />

            <div className="border-t border-slate-100 pt-5">
              <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                <MapPin size={15} /> Address
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Input
                    label="Street Address"
                    value={profileForm.address.street}
                    onChange={(e) => setProfileForm({
                      ...profileForm,
                      address: { ...profileForm.address, street: e.target.value }
                    })}
                    placeholder="123 Main Street"
                  />
                </div>
                <Input
                  label="City"
                  value={profileForm.address.city}
                  onChange={(e) => setProfileForm({
                    ...profileForm,
                    address: { ...profileForm.address, city: e.target.value }
                  })}
                  placeholder="San Francisco"
                />
                <Input
                  label="State"
                  value={profileForm.address.state}
                  onChange={(e) => setProfileForm({
                    ...profileForm,
                    address: { ...profileForm.address, state: e.target.value }
                  })}
                  placeholder="California"
                />
                <Input
                  label="ZIP Code"
                  value={profileForm.address.zipCode}
                  onChange={(e) => setProfileForm({
                    ...profileForm,
                    address: { ...profileForm.address, zipCode: e.target.value }
                  })}
                  placeholder="94102"
                />
                <Input
                  label="Country"
                  value={profileForm.address.country}
                  onChange={(e) => setProfileForm({
                    ...profileForm,
                    address: { ...profileForm.address, country: e.target.value }
                  })}
                  placeholder="United States"
                />
              </div>
            </div>

            <Button type="submit" loading={loadingProfile} icon={<Save size={16} />}>
              Save Changes
            </Button>
          </form>
        </motion.div>
      )}

      {/* Change Password */}
      {activeTab === 'password' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6"
        >
          <form onSubmit={handlePasswordChange} className="space-y-5">
            <Input
              label="Current Password"
              type={showPasswords.current ? 'text' : 'password'}
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
              icon={<Lock size={17} />}
              placeholder="Enter current password"
              rightIcon={
                <button type="button" onClick={() => setShowPasswords(p => ({ ...p, current: !p.current }))} className="cursor-pointer">
                  {showPasswords.current ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              }
            />
            <Input
              label="New Password"
              type={showPasswords.new ? 'text' : 'password'}
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              icon={<Lock size={17} />}
              placeholder="At least 6 characters"
              rightIcon={
                <button type="button" onClick={() => setShowPasswords(p => ({ ...p, new: !p.new }))} className="cursor-pointer">
                  {showPasswords.new ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              }
            />
            <Input
              label="Confirm New Password"
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              icon={<Lock size={17} />}
              placeholder="Repeat new password"
            />
            <Button type="submit" loading={loadingPassword} icon={<Save size={16} />}>
              Change Password
            </Button>
          </form>
        </motion.div>
      )}
    </div>
  );
}
