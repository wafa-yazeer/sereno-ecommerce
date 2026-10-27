import React, { useState } from 'react';
import { 
  X, 
  CreditCard, 
  Building2, 
  Truck, 
  Lock, 
  CheckCircle, 
  AlertCircle,
  ShieldCheck
} from 'lucide-react';
import { CartItem, Order, User } from '../types';
import { api } from '../services/api';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  couponCode: string;
  discountAmount: number;
  onOrderCompleted: (order: Order) => void;
  onClearCart: () => void;
  currentUser: User | null;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cart,
  couponCode,
  discountAmount,
  onOrderCompleted,
  onClearCart,
  currentUser,
}) => {
  const [customerName, setCustomerName] = useState(currentUser?.name || 'Alexander Vance');
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || 'alexander@sereno.ch');
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || '+41 22 819 4400');
  const [shippingAddress, setShippingAddress] = useState(currentUser?.shippingAddress || 'Rue du Rhône 42');
  const [city, setCity] = useState(currentUser?.city || 'Genève');
  const [postalCode, setPostalCode] = useState(currentUser?.postalCode || '1204');
  const [country, setCountry] = useState(currentUser?.country || 'Switzerland');
  const [paymentMethod, setPaymentMethod] = useState<'Credit / Debit Card' | 'Cash on Delivery (COD)' | 'Bank Transfer'>('Credit / Debit Card');
  const [notes, setNotes] = useState('White-glove Swiss insured delivery required.');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');

  // Sync state if currentUser changes
  React.useEffect(() => {
    if (currentUser) {
      if (currentUser.name) setCustomerName(currentUser.name);
      if (currentUser.email) setCustomerEmail(currentUser.email);
      if (currentUser.phone) setCustomerPhone(currentUser.phone);
      if (currentUser.shippingAddress) setShippingAddress(currentUser.shippingAddress);
      if (currentUser.city) setCity(currentUser.city);
      if (currentUser.postalCode) setPostalCode(currentUser.postalCode);
      if (currentUser.country) setCountry(currentUser.country);
    }
  }, [currentUser]);

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shippingFee = subtotal >= 300 || subtotal === 0 ? 0 : 15;
  const taxableBase = Math.max(0, subtotal - discountAmount);
  const tax = Math.round(taxableBase * 0.08 * 100) / 100;
  const total = Math.round((taxableBase + tax + shippingFee) * 100) / 100;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      setErrorMessage('Your shopping cart is empty.');
      return;
    }

    try {
      setSubmitting(true);
      setErrorMessage('');

      const itemsPayload = cart.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
      }));

      const newOrder = await api.createOrder({
        userId: currentUser?.id,
        customerName,
        customerEmail,
        customerPhone,
        shippingAddress,
        city,
        postalCode,
        country,
        items: itemsPayload,
        paymentMethod,
        couponCode: couponCode || undefined,
        notes,
      });

      onClearCart();
      onOrderCompleted(newOrder);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to place order. Please verify your address and inventory.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative bg-[#11141c] border border-[#2d3448] rounded-2xl w-full max-w-3xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl text-[#e0e2ec]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-[#141822] border-b border-[#232733] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#c5a880]" />
            <h2 className="font-serif text-lg font-semibold text-white tracking-wide">
              Secure Horology Checkout
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-[#202534] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmitOrder} className="overflow-y-auto p-6 sm:p-8 space-y-6">
          {errorMessage && (
            <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-800/50 text-rose-300 text-xs flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Section 1: Customer & Shipping Information */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#c5a880] flex items-center gap-2">
              <span>1. Client & Shipping Address</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-neutral-400 mb-1">Full Legal Name</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-[#181d2a] border border-[#2b3347] rounded-lg p-2.5 text-white focus:outline-none focus:border-[#c5a880]"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full bg-[#181d2a] border border-[#2b3347] rounded-lg p-2.5 text-white focus:outline-none focus:border-[#c5a880]"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Phone Number</label>
                <input
                  type="text"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full bg-[#181d2a] border border-[#2b3347] rounded-lg p-2.5 text-white focus:outline-none focus:border-[#c5a880]"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Country / Jurisdiction</label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full bg-[#181d2a] border border-[#2b3347] rounded-lg p-2.5 text-white focus:outline-none focus:border-[#c5a880]"
                >
                  <option value="United States">United States</option>
                  <option value="Switzerland">Switzerland</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Singapore">Singapore</option>
                  <option value="Sri Lanka">Sri Lanka</option>
                  <option value="United Arab Emirates">United Arab Emirates</option>
                  <option value="Japan">Japan</option>
                  <option value="Germany">Germany</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-neutral-400 mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  className="w-full bg-[#181d2a] border border-[#2b3347] rounded-lg p-2.5 text-white focus:outline-none focus:border-[#c5a880]"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">City</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-[#181d2a] border border-[#2b3347] rounded-lg p-2.5 text-white focus:outline-none focus:border-[#c5a880]"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Postal / ZIP Code</label>
                <input
                  type="text"
                  required
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="w-full bg-[#181d2a] border border-[#2b3347] rounded-lg p-2.5 text-white focus:outline-none focus:border-[#c5a880]"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Payment Method */}
          <div className="space-y-4 pt-4 border-t border-[#232733]">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#c5a880] flex items-center gap-2">
              <span>2. Payment Option</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                  paymentMethod === 'Credit / Debit Card'
                    ? 'border-[#c5a880] bg-[#1a202e] text-white'
                    : 'border-[#272d3f] bg-[#141823] text-neutral-400 hover:text-white'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Credit / Debit Card"
                  checked={paymentMethod === 'Credit / Debit Card'}
                  onChange={() => setPaymentMethod('Credit / Debit Card')}
                  className="sr-only"
                />
                <CreditCard className="w-5 h-5 text-[#c5a880]" />
                <span className="text-xs font-semibold text-center">Credit / Debit Card</span>
              </label>

              <label
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                  paymentMethod === 'Bank Transfer'
                    ? 'border-[#c5a880] bg-[#1a202e] text-white'
                    : 'border-[#272d3f] bg-[#141823] text-neutral-400 hover:text-white'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Bank Transfer"
                  checked={paymentMethod === 'Bank Transfer'}
                  onChange={() => setPaymentMethod('Bank Transfer')}
                  className="sr-only"
                />
                <Building2 className="w-5 h-5 text-[#c5a880]" />
                <span className="text-xs font-semibold text-center">Wire Transfer</span>
              </label>

              <label
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                  paymentMethod === 'Cash on Delivery (COD)'
                    ? 'border-[#c5a880] bg-[#1a202e] text-white'
                    : 'border-[#272d3f] bg-[#141823] text-neutral-400 hover:text-white'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Cash on Delivery (COD)"
                  checked={paymentMethod === 'Cash on Delivery (COD)'}
                  onChange={() => setPaymentMethod('Cash on Delivery (COD)')}
                  className="sr-only"
                />
                <Truck className="w-5 h-5 text-[#c5a880]" />
                <span className="text-xs font-semibold text-center">Cash On Delivery</span>
              </label>
            </div>

            {paymentMethod === 'Credit / Debit Card' && (
              <div className="bg-[#151924] border border-[#272d3e] p-4 rounded-xl space-y-3 text-xs">
                <div>
                  <label className="block text-neutral-400 mb-1">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full bg-[#1b202d] border border-[#2b3347] rounded-lg p-2 text-white font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-400 mb-1">Expiry Date</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full bg-[#1b202d] border border-[#2b3347] rounded-lg p-2 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 mb-1">CVC / CVV</label>
                    <input
                      type="text"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      className="w-full bg-[#1b202d] border border-[#2b3347] rounded-lg p-2 text-white font-mono"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Summary Breakdown */}
          <div className="bg-[#151924] border border-[#262c3e] p-4 rounded-xl space-y-2 text-xs">
            <div className="flex justify-between text-neutral-400">
              <span>Items Subtotal ({cart.reduce((sum, item) => sum + item.quantity, 0)} units)</span>
              <span className="font-mono text-white">${subtotal.toFixed(2)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-400">
                <span>Coupon Discount ({couponCode})</span>
                <span className="font-mono">-${discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-neutral-400">
              <span>State & Federal Horology Tax (8%)</span>
              <span className="font-mono text-white">${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>Insured Courier Shipping</span>
              <span className="font-mono text-white">
                {shippingFee === 0 ? <span className="text-emerald-400 font-bold">Complimentary</span> : `$${shippingFee}.00`}
              </span>
            </div>
            <div className="pt-2 border-t border-[#232733] flex justify-between text-sm font-bold text-white">
              <span>Grand Total</span>
              <span className="text-[#c5a880] font-serif text-lg">${total.toFixed(2)} USD</span>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              id="confirm-place-order-btn"
              type="submit"
              disabled={submitting || cart.length === 0}
              className="w-full py-4 rounded-xl bg-[#c5a880] text-black font-bold text-xs uppercase tracking-widest hover:bg-white active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-xl shadow-black disabled:opacity-50"
            >
              {submitting ? (
                <span>Securing & Authorizing Order...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Authorize & Place Order • ${total.toFixed(2)}</span>
                </>
              )}
            </button>
            <p className="text-[11px] text-center text-neutral-500 mt-2">
              Encrypted with 256-bit TLS bank-grade security • Official 5-Year Sereno Atelier Warranty Included
            </p>
          </div>
        </form>

      </div>
    </div>
  );
};
