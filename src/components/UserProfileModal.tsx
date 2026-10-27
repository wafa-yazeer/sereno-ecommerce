import React from 'react';
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
  Lock
} from 'lucide-react';
import { User } from '../types';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onUpdateUser?: (updated: User) => void;
  onLogout: () => void;
  onNavigateToOrders: () => void;
  onNavigateToManagerPortal?: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onLogout,
  onNavigateToOrders,
  onNavigateToManagerPortal,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-[#0e111a] border border-[#23293a] rounded-2xl shadow-2xl overflow-hidden my-8"
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
            <div className="w-14 h-14 rounded-full bg-[#181e2d] border border-[#c5a880]/50 flex items-center justify-center text-[#c5a880] shadow-xl">
              <UserIcon className="w-7 h-7" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-lg font-bold text-white">
                  {user.name}
                </h3>
                {user.role === 'manager' ? (
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded font-mono font-bold uppercase">
                    Manager
                  </span>
                ) : (
                  <span className="text-[10px] bg-[#c5a880]/20 text-[#c5a880] border border-[#c5a880]/40 px-2 py-0.5 rounded font-mono font-bold uppercase">
                    Collector
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5 text-xs text-[#a1a8bd] mt-1">
                <Mail className="w-3.5 h-3.5 text-[#c5a880]" />
                <span>{user.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {/* Quick Shortcuts */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                onClose();
                onNavigateToOrders();
              }}
              className="p-3 bg-[#161a26] hover:bg-[#1f2536] border border-[#262c3e] rounded-xl flex items-center gap-2.5 text-left transition-colors group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-lg bg-[#222839] flex items-center justify-center text-[#c5a880] group-hover:scale-105 transition-transform">
                <Package className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">My Orders</div>
                <div className="text-[10px] text-neutral-400">Track shipments</div>
              </div>
            </button>

            {user.role === 'manager' && onNavigateToManagerPortal ? (
              <button
                onClick={() => {
                  onClose();
                  onNavigateToManagerPortal();
                }}
                className="p-3 bg-amber-950/20 hover:bg-amber-950/40 border border-amber-800/40 rounded-xl flex items-center gap-2.5 text-left transition-colors group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-lg bg-amber-900/40 flex items-center justify-center text-amber-300 group-hover:scale-105 transition-transform">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-amber-200">Manager Portal</div>
                  <div className="text-[10px] text-amber-400/80">Store dashboard</div>
                </div>
              </button>
            ) : (
              <div className="p-3 bg-[#161a26] border border-[#262c3e] rounded-xl flex items-center gap-2.5 text-left">
                <div className="w-9 h-9 rounded-lg bg-[#222839] flex items-center justify-center text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Account Status</div>
                  <div className="text-[10px] text-neutral-400">Verified Member</div>
                </div>
              </div>
            )}
          </div>

          {/* Delivery & Shipping Information - VIEW ONLY / LOCKED */}
          <div className="border border-[#262c3e] rounded-xl p-4 bg-[#141824] space-y-3">
            <div className="flex items-center justify-between border-b border-[#23293a] pb-2">
              <h4 className="text-xs font-semibold text-white tracking-wide flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#c5a880]" />
                <span>Shipping Address</span>
              </h4>
              <span className="text-[10px] text-[#c5a880] flex items-center gap-1 font-mono bg-[#c5a880]/10 px-2 py-0.5 rounded border border-[#c5a880]/20">
                <Lock className="w-3 h-3" />
                <span>Locked Record</span>
              </span>
            </div>

            <div className="space-y-2 text-xs text-neutral-300">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#c5a880]" />
                <span>{user.phone || '+41 22 819 4400'}</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#c5a880] mt-0.5 shrink-0" />
                <span>
                  {user.shippingAddress
                    ? `${user.shippingAddress}, ${user.city || ''} ${user.postalCode || ''}, ${user.country || 'Switzerland'}`
                    : 'Rue du Rhône 42, Genève 1204, Switzerland'}
                </span>
              </div>
            </div>

            <p className="text-[10px] text-neutral-500 italic pt-1">
              For security and courier insurance, registered delivery destinations cannot be edited after placement.
            </p>
          </div>

          {/* Sign Out Button */}
          <div className="pt-2 border-t border-[#23283a] flex items-center justify-between">
            <span className="text-[11px] text-neutral-500">
              SERENO Horology Client
            </span>
            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="py-2 px-4 rounded-xl border border-rose-900/60 bg-rose-950/30 hover:bg-rose-900/50 text-rose-300 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
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
