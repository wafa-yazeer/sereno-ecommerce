import React from 'react';
import { CheckCircle, Truck, Package, ArrowRight, Copy } from 'lucide-react';
import { Order } from '../types';

interface OrderSuccessModalProps {
  order: Order | null;
  onClose: () => void;
  onViewOrders: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  order,
  onClose,
  onViewOrders,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!order) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(order.orderNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
      <div 
        className="relative bg-[#11141c] border border-[#2e3549] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl p-6 sm:p-8 text-center text-[#e0e2ec]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Animated Check icon */}
        <div className="w-16 h-16 rounded-full bg-emerald-950/60 border border-emerald-500/50 text-emerald-400 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-emerald-950/50">
          <CheckCircle className="w-8 h-8" />
        </div>

        <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-white mb-2">
          Order Confirmed
        </h2>
        <p className="text-xs sm:text-sm text-[#9da4b8] max-w-sm mx-auto mb-6">
          Thank you for choosing Sereno. Your handcrafted timepiece has been reserved and queued for dispatch.
        </p>

        {/* Order Details Card */}
        <div className="bg-[#161a25] border border-[#272d3e] rounded-xl p-5 text-left mb-6 space-y-3 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#232733]">
            <span className="text-neutral-400">Order Number:</span>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-white text-sm">{order.orderNumber}</span>
              <button
                onClick={handleCopy}
                className="text-neutral-400 hover:text-[#c5a880] p-1"
                title="Copy order number"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-neutral-400">Tracking Number:</span>
            <span className="font-mono text-[#c5a880] flex items-center gap-1">
              <Truck className="w-3.5 h-3.5" />
              <span>{order.trackingNumber}</span>
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-neutral-400">Total Billed:</span>
            <span className="font-mono font-bold text-white">${order.total.toFixed(2)} USD</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-neutral-400">Recipient:</span>
            <span className="text-white">{order.customerName}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-neutral-400">Delivery To:</span>
            <span className="text-white truncate max-w-[200px]">{order.city}, {order.country}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => {
              onClose();
              onViewOrders();
            }}
            className="flex-1 py-3 px-4 rounded-xl bg-[#c5a880] text-black font-semibold text-xs uppercase tracking-wider hover:bg-white transition-all flex items-center justify-center gap-2"
          >
            <Package className="w-4 h-4" />
            <span>Track in Orders Hub</span>
          </button>
          
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl bg-[#1c2230] border border-[#2b3347] text-white font-medium text-xs hover:bg-[#252d40] transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};
