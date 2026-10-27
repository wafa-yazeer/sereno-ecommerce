import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Truck, Sparkles, Tag, Check } from 'lucide-react';
import { CartItem } from '../types';
import { api } from '../services/api';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onOpenCheckout: () => void;
  appliedCoupon: string;
  onApplyCoupon: (code: string, discount: number) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOpenCheckout,
  appliedCoupon,
  onApplyCoupon,
}) => {
  const [couponInput, setCouponInput] = useState('');
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  if (!isOpen) return null;

  const totalItemsCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const freeShippingThreshold = 300;
  const shipping = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 15;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    setValidatingCoupon(true);
    setCouponError('');
    setCouponSuccess('');

    try {
      const code = couponInput.trim().toUpperCase();
      // Test either against API or fallback local voucher
      if (code === 'SERENO10' || code === 'HOROLOGY10') {
        const disc = Math.round(subtotal * 0.1 * 100) / 100;
        onApplyCoupon(code, disc);
        setCouponSuccess(`10% Atelier privilege applied (-$${disc.toFixed(2)})`);
      } else {
        const res = await api.validateCoupon(code, subtotal);
        if (res.valid) {
          onApplyCoupon(code, res.discount);
          setCouponSuccess(`Voucher applied: -$${res.discount.toFixed(2)}`);
        } else {
          setCouponError(res.message || 'Invalid or expired boutique voucher code');
        }
      }
    } catch (err: any) {
      if (couponInput.trim().toUpperCase() === 'SERENO10') {
        const disc = Math.round(subtotal * 0.1 * 100) / 100;
        onApplyCoupon('SERENO10', disc);
        setCouponSuccess(`10% Atelier privilege applied (-$${disc.toFixed(2)})`);
      } else {
        setCouponError('Invalid boutique voucher code. Try code: SERENO10');
      }
    } finally {
      setValidatingCoupon(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div 
          className="w-screen max-w-md bg-[#10141d] border-l border-[#232733] text-[#e0e2ec] flex flex-col shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-[#232733] bg-[#141822] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#1b202e] border border-[#2b3347] flex items-center justify-center text-[#c5a880]">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-serif text-lg font-bold text-white tracking-wide">
                  Your Watch Reserve ({totalItemsCount})
                </h2>
                <p className="text-[11px] text-[#9ca3af]">Haute Horlogerie Cart</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-[#202534] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#161a25] border border-[#262c3d] flex items-center justify-center mx-auto text-neutral-500">
                  <Sparkles className="w-8 h-8 text-[#c5a880]/40" />
                </div>
                <h3 className="font-serif text-lg font-medium text-white">Your reserve is empty</h3>
                <p className="text-xs text-[#8f95a6] max-w-xs mx-auto leading-relaxed">
                  Browse our Swiss-assembled collections and select your preferred mechanical timepiece.
                </p>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-full bg-[#1a202c] border border-[#30384a] text-xs font-semibold text-[#c5a880] hover:bg-[#242c3d] transition-colors"
                >
                  Explore Catalog
                </button>
              </div>
            ) : (
              items.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="bg-[#151924] border border-[#242938] rounded-xl p-4 flex gap-4 transition-all hover:border-[#c5a880]/30"
                >
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-20 h-20 rounded-lg object-cover bg-[#0d1017] border border-[#242938] shrink-0"
                  />

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-serif text-sm font-semibold text-white truncate">
                          {product.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(product.id)}
                          className="text-neutral-500 hover:text-rose-400 p-1 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-[11px] text-[#9ca3af] mt-0.5">
                        {product.caseSize} • {product.movement}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="font-mono text-sm font-bold text-[#c5a880]">
                        ${product.price * quantity}
                      </span>

                      <div className="flex items-center border border-[#2e3549] rounded-lg bg-[#0f1219] overflow-hidden">
                        <button
                          onClick={() => onUpdateQuantity(product.id, Math.max(1, quantity - 1))}
                          className="px-2 py-1 text-neutral-400 hover:text-white transition-colors"
                          title="Decrease"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-mono font-medium text-white">
                          {quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(product.id, quantity + 1)}
                          disabled={quantity >= product.stock}
                          className="px-2 py-1 text-neutral-400 hover:text-white disabled:opacity-30 transition-colors"
                          title="Increase"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer with Subtotal, Voucher, and Checkout CTA */}
          {items.length > 0 && (
            <div className="p-6 border-t border-[#232733] bg-[#141822] space-y-4">
              {/* Voucher code input */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Voucher Code (SERENO10)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-[#0e1117] border border-[#2b3347] rounded-lg text-xs text-white uppercase placeholder:normal-case placeholder:text-neutral-500 focus:outline-none focus:border-[#c5a880]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={validatingCoupon || !couponInput.trim()}
                  className="px-4 py-2 bg-[#1f2636] border border-[#333d54] text-[#c5a880] text-xs font-semibold rounded-lg hover:bg-[#283248] disabled:opacity-40 transition-colors"
                >
                  Apply
                </button>
              </form>

              {couponSuccess && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 p-2 rounded-lg">
                  <Check className="w-3.5 h-3.5 shrink-0" />
                  <span>{couponSuccess}</span>
                </div>
              )}

              {couponError && (
                <div className="text-xs text-rose-400 bg-rose-950/40 border border-rose-800/40 p-2 rounded-lg">
                  {couponError}
                </div>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-[#9ba2b5] pt-1">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono text-white">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Insured Courier Delivery</span>
                  <span className="font-mono text-white">
                    {shipping === 0 ? <span className="text-emerald-400">Complimentary</span> : `$${shipping}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-white pt-2 border-t border-[#232733]">
                  <span>Total Due</span>
                  <span className="font-mono text-[#c5a880]">
                    ${(subtotal + shipping).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Security Banner */}
              <div className="flex items-center justify-center gap-4 text-[11px] text-[#8c92a4] pt-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#c5a880]" /> 5-Yr Guarantee
                </span>
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-[#c5a880]" /> Swiss Insured Dispatch
                </span>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={() => {
                  onClose();
                  onOpenCheckout();
                }}
                className="w-full py-3.5 px-6 rounded-full bg-white text-black hover:bg-[#e6d8c4] font-semibold text-sm transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-black/40"
              >
                <span>Proceed to White-Glove Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
