import React, { useState } from 'react';
import { 
  X, 
  User as UserIcon, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  Briefcase, 
  LogOut, 
  Package, 
  CheckCircle, 
  Edit3, 
  Save, 
  Sparkles
} from 'lucide-react';
import { User, Order } from '../types';
import { api } from '../services/api';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onUpdateUser: (updated: User) => void;
  onLogout: () => void;
  onNavigateToOrders: () => void;
  onNavigateToManagerPortal?: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdateUser,
  onLogout,
  onNavigateToOrders,
  onNavigateToManagerPortal,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone || '');
  const [address, setAddress] = useState(user.shippingAddress || '');
  const [city, setCity] = useState(user.city || '');
  const [postalCode, setPostalCode] = useState(user.postalCode || '');
  const [country, setCountry] = useState(user.country || 'Switzerland');

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await api.updateProfile(user.id, {
        name,
        phone,
        shippingAddress: address,
        city,
        postalCode,
        country,
      });
      onUpdateUser({
        ...user,
        ...updated,
        name,
        phone,
        shippingAddress: address,
        city,
        postalCode,
        country,
      });
      setSaveSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to update profile', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-[#0e111a] border border-[#23293a] rounded-2xl shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#141926] via-[#1a2030] to-[#141926] p-6 border-b border-[#232a3d] relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#181e2d] border-2 border-[#c5a880]/50 flex items-center justify-center text-[#c5a880] shadow-xl">
              <UserIcon className="w-8 h-8" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-xl font-bold text-white">
                  {user.name}
                </h3>
                {user.role === 'manager' ? (
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded font-mono font-bold tracking-wider uppercase">
                    Store Manager
                  </span>
                ) : (
                  <span className="text-[10px] bg-[#c5a880]/20 text-[#c5a880] border border-[#c5a880]/40 px-2 py-0.5 rounded font-mono font-bold tracking-wider uppercase">
                    VIP Collector
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs text-[#a1a8bd] mt-1">
                <Mail className="w-3.5 h-3.5 text-[#c5a880]" />
                <span>{user.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {saveSuccess && (
            <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-800/50 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Profile and shipping details updated successfully!</span>
            </div>
          )}

          {/* Quick Shortcuts */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                onClose();
                onNavigateToOrders();
              }}
              className="p-3 bg-[#161a26] hover:bg-[#1f2536] border border-[#262c3e] rounded-xl flex items-center gap-2.5 text-left transition-colors group"
            >
              <div className="w-9 h-9 rounded-lg bg-[#222839] flex items-center justify-center text-[#c5a880] group-hover:scale-105 transition-transform">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">My Orders</div>
                <div className="text-[10px] text-neutral-400">Track shipments & status</div>
              </div>
            </button>

            {user.role === 'manager' && onNavigateToManagerPortal ? (
              <button
                onClick={() => {
                  onClose();
                  onNavigateToManagerPortal();
                }}
                className="p-3 bg-amber-950/20 hover:bg-amber-950/40 border border-amber-800/40 rounded-xl flex items-center gap-2.5 text-left transition-colors group"
              >
                <div className="w-9 h-9 rounded-lg bg-amber-900/40 flex items-center justify-center text-amber-300 group-hover:scale-105 transition-transform">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-amber-200">Manager Portal</div>
                  <div className="text-[10px] text-amber-400/80">Manage products & orders</div>
                </div>
              </button>
            ) : (
              <div className="p-3 bg-[#161a26] border border-[#262c3e] rounded-xl flex items-center gap-2.5 text-left">
                <div className="w-9 h-9 rounded-lg bg-[#222839] flex items-center justify-center text-emerald-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Privilege Level</div>
                  <div className="text-[10px] text-neutral-400">Swiss Insured Delivery</div>
                </div>
              </div>
            )}
          </div>

          {/* Delivery & Contact Information */}
          <div className="border border-[#262c3e] rounded-xl p-4 bg-[#141824]">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#c5a880]" />
                <span>Shipping & Delivery Details</span>
              </h4>
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="text-xs text-[#c5a880] hover:text-[#dfcaa7] flex items-center gap-1"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isEditing ? 'Cancel' : 'Edit'}</span>
              </button>
            </div>

            {isEditing ? (
              <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
                <div>
                  <label className="block text-neutral-400 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#1b2030] border border-[#2f374c] rounded-lg p-2 text-white focus:outline-none focus:border-[#c5a880]"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+41 22 819 4400"
                    className="w-full bg-[#1b2030] border border-[#2f374c] rounded-lg p-2 text-white focus:outline-none focus:border-[#c5a880]"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Street Address</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Rue du Rhône 42"
                    className="w-full bg-[#1b2030] border border-[#2f374c] rounded-lg p-2 text-white focus:outline-none focus:border-[#c5a880]"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-neutral-400 mb-1 text-[11px]">City</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-[#1b2030] border border-[#2f374c] rounded-lg p-2 text-white focus:outline-none focus:border-[#c5a880]"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 mb-1 text-[11px]">Postal Code</label>
                    <input
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="w-full bg-[#1b2030] border border-[#2f374c] rounded-lg p-2 text-white focus:outline-none focus:border-[#c5a880]"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 mb-1 text-[11px]">Country</label>
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full bg-[#1b2030] border border-[#2f374c] rounded-lg p-2 text-white focus:outline-none focus:border-[#c5a880]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full mt-2 py-2.5 bg-[#c5a880] hover:bg-[#d6be99] text-[#0b0c10] font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Saving Changes...' : 'Save Shipping Details'}</span>
                </button>
              </form>
            ) : (
              <div className="space-y-2 text-xs text-neutral-300">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#c5a880]" />
                  <span>{user.phone || 'No contact phone provided'}</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#c5a880] mt-0.5 shrink-0" />
                  <span>
                    {user.shippingAddress
                      ? `${user.shippingAddress}, ${user.city || ''} ${user.postalCode || ''}, ${user.country || 'Switzerland'}`
                      : 'No default address saved. Click "Edit" to add your address for faster checkout.'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Sign Out Button */}
          <div className="pt-2 border-t border-[#23283a] flex items-center justify-between">
            <span className="text-[11px] text-neutral-500">
              Session Active • SERENO Cloud
            </span>
            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="py-2 px-4 rounded-xl border border-rose-900/60 bg-rose-950/30 hover:bg-rose-900/50 text-rose-300 text-xs font-semibold flex items-center gap-2 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
