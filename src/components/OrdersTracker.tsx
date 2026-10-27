import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Search, 
  Truck, 
  Clock, 
  CheckCircle2, 
  Calendar, 
  MapPin, 
  ExternalLink,
  MessageSquare,
  User as UserIcon,
  ShieldCheck,
  Lock
} from 'lucide-react';
import { Order, User } from '../types';
import { api } from '../services/api';

interface OrdersTrackerProps {
  currentUser?: User | null;
  onOpenAuth?: () => void;
  onSelectProductForReview?: (productId: string) => void;
}

export const OrdersTracker: React.FC<OrdersTrackerProps> = ({
  currentUser,
  onOpenAuth,
  onSelectProductForReview,
}) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      // Normal users only see their own orders.
      const data = await api.getOrders({
        search: search.trim() || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        email: currentUser?.email ? currentUser.email : undefined,
      });
      setOrders(data);
      if (data.length > 0) {
        setSelectedOrder(data[0]);
      } else {
        setSelectedOrder(null);
      }
    } catch (err) {
      console.error('Failed to load orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, currentUser]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders();
  };

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-950/70 text-emerald-400 border-emerald-800/50';
      case 'Shipped':
        return 'bg-cyan-950/70 text-cyan-400 border-cyan-800/50';
      case 'Processing':
        return 'bg-amber-950/70 text-amber-400 border-amber-800/50';
      case 'Cancelled':
        return 'bg-rose-950/70 text-rose-400 border-rose-800/50';
      default:
        return 'bg-neutral-800 text-neutral-300 border-neutral-700';
    }
  };

  const getStepProgress = (status: Order['status']) => {
    const steps = ['Pending', 'Processing', 'Shipped', 'Delivered'];
    if (status === 'Cancelled') return -1;
    return steps.indexOf(status);
  };

  return (
    <section className="py-8 sm:py-12 bg-[#0b0c10] min-h-[80vh]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Minimal Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#c5a880] font-semibold mb-1">
            <Package className="w-4 h-4" />
            <span>Order Tracking</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl text-white font-normal">
            Your Timepieces & Shipments
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            View real-time delivery status, insured shipping details, and product manifests.
          </p>
        </div>

        {/* User Account Info Banner */}
        {currentUser ? (
          <div className="mb-6 p-4 rounded-xl bg-[#141926] border border-[#23293a] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#1b2234] border border-[#c5a880]/30 flex items-center justify-center text-[#c5a880]">
                <UserIcon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <span>{currentUser.name}</span>
                  <span className="text-[10px] bg-[#c5a880]/20 text-[#c5a880] border border-[#c5a880]/40 px-1.5 py-0.2 rounded font-mono uppercase">
                    Personal Account
                  </span>
                </div>
                <div className="text-[11px] text-neutral-400">{currentUser.email}</div>
              </div>
            </div>

            <div className="text-xs text-neutral-400 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#c5a880]" />
              <span>Private & Encrypted Orders</span>
            </div>
          </div>
        ) : onOpenAuth ? (
          <div className="mb-6 p-4 rounded-xl bg-[#141926] border border-[#23293a] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-[#c5a880] shrink-0" />
              <div>
                <div className="text-xs font-bold text-white">Track Your Personal Orders</div>
                <div className="text-[11px] text-neutral-400">Sign in to your account to view your past purchases and shipment progress.</div>
              </div>
            </div>
            <button
              onClick={onOpenAuth}
              className="px-4 py-2 bg-[#c5a880] text-black font-bold text-xs uppercase tracking-wider rounded-lg hover:bg-white transition-colors whitespace-nowrap cursor-pointer"
            >
              Sign In
            </button>
          </div>
        ) : null}

        {/* Search & Filter Bar */}
        <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#121622] p-3 rounded-xl border border-[#222736]">
          <form onSubmit={handleSearchSubmit} className="flex-1 w-full flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search by Order ID (e.g. SRN-2026-9042)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#181d2a] border border-[#282f42] rounded-lg py-1.5 pl-8 pr-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#c5a880]"
              />
            </div>
            <button
              type="submit"
              className="px-3.5 py-1.5 bg-[#202636] text-xs font-semibold text-white rounded-lg hover:bg-[#2c354b] transition-colors cursor-pointer"
            >
              Search
            </button>
          </form>

          {/* Status filter tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
            {['all', 'Processing', 'Shipped', 'Delivered'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  statusFilter === st
                    ? 'bg-[#c5a880] text-black font-semibold'
                    : 'bg-[#181d2a] text-neutral-400 hover:text-white border border-[#262c3e]'
                }`}
              >
                {st === 'all' ? 'All' : st}
              </button>
            ))}
          </div>
        </div>

        {/* Content Layout */}
        {loading ? (
          <div className="py-16 text-center text-neutral-400 text-xs">
            <div className="inline-block w-7 h-7 border-2 border-[#c5a880] border-t-transparent rounded-full animate-spin mb-2"></div>
            <p>Loading your orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 bg-[#131722] border border-[#222736] rounded-2xl p-6">
            <Package className="w-10 h-10 text-neutral-600 mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-white mb-1">No orders found</h3>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto mb-4">
              You haven&apos;t placed any orders under this account yet. Explore the watch collection to acquire a piece.
            </p>
            {search && (
              <button
                onClick={() => { setSearch(''); setStatusFilter('all'); fetchOrders(); }}
                className="px-4 py-2 rounded-lg bg-[#c5a880] text-black text-xs font-semibold hover:bg-white cursor-pointer"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left: Orders List */}
            <div className="lg:col-span-5 space-y-2.5">
              {orders.map((order) => {
                const isSelected = selectedOrder?.id === order.id;
                return (
                  <div
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#181d2a] border-[#c5a880] shadow-md'
                        : 'bg-[#131722] border-[#222736] hover:border-[#2d3448]'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-1.5">
                      <div>
                        <div className="font-mono text-xs font-bold text-white">
                          {order.orderNumber}
                        </div>
                        <p className="text-[11px] text-neutral-400 mt-0.5">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${getStatusBadge(order.status)}`}>
                        {order.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-neutral-400 pt-2 border-t border-[#1e2333]">
                      <span>{order.items.length} timepiece{order.items.length > 1 ? 's' : ''}</span>
                      <span className="font-mono font-bold text-white">${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right: Selected Order Detail */}
            <div className="lg:col-span-7">
              {selectedOrder ? (
                <div className="bg-[#131722] border border-[#222736] rounded-2xl p-5 sm:p-6 space-y-6">
                  
                  {/* Title & Status */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#222736]">
                    <div>
                      <div className="text-[10px] text-[#c5a880] font-mono tracking-wider">VERIFIED ORDER</div>
                      <h2 className="font-serif text-xl font-bold text-white">{selectedOrder.orderNumber}</h2>
                      <p className="text-xs text-neutral-400 mt-0.5 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#c5a880]" />
                        <span>Placed on {new Date(selectedOrder.createdAt).toLocaleDateString()}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full border uppercase tracking-wider ${getStatusBadge(selectedOrder.status)}`}>
                        {selectedOrder.status}
                      </span>
                    </div>
                  </div>

                  {/* Visual Status Progression */}
                  <div>
                    <h3 className="text-xs uppercase font-bold tracking-widest text-neutral-400 mb-3">
                      Shipment Progression
                    </h3>
                    <div className="grid grid-cols-4 gap-2 text-center text-xs">
                      {[
                        { title: 'Confirmed', icon: Clock, idx: 0 },
                        { title: 'Inspected', icon: Package, idx: 1 },
                        { title: 'In Transit', icon: Truck, idx: 2 },
                        { title: 'Delivered', icon: CheckCircle2, idx: 3 },
                      ].map((step) => {
                        const currentStep = getStepProgress(selectedOrder.status);
                        const isDone = currentStep >= step.idx;
                        const isCurrent = currentStep === step.idx;
                        const Icon = step.icon;

                        return (
                          <div key={step.title} className="flex flex-col items-center">
                            <div
                              className={`w-9 h-9 rounded-full flex items-center justify-center mb-1.5 border transition-all ${
                                isDone
                                  ? 'bg-[#c5a880] text-black border-[#c5a880]'
                                  : 'bg-[#181d2a] text-neutral-500 border-[#262c3e]'
                              } ${isCurrent ? 'ring-2 ring-[#c5a880]/30' : ''}`}
                            >
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                            <span className={`text-[10px] font-medium ${isDone ? 'text-white' : 'text-neutral-500'}`}>
                              {step.title}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Courier Tracking ID box */}
                    <div className="mt-4 p-3.5 rounded-xl bg-[#181d2a] border border-[#272e40] flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5">
                        <Truck className="w-4 h-4 text-[#c5a880]" />
                        <div>
                          <span className="text-neutral-400 text-[10px] block">Insured Waybill:</span>
                          <span className="font-mono font-bold text-white text-xs">{selectedOrder.trackingNumber || 'CH-EXPRESS-90218'}</span>
                        </div>
                      </div>
                      <span className="text-emerald-400 text-[10px] font-semibold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                        Priority Swiss Air
                      </span>
                    </div>
                  </div>

                  {/* Purchased Watch Products */}
                  <div>
                    <h3 className="text-xs uppercase font-bold tracking-widest text-neutral-400 mb-2.5">
                      Ordered Products ({selectedOrder.items.length})
                    </h3>
                    <div className="divide-y divide-[#1e2333] border border-[#222736] rounded-xl bg-[#151924] overflow-hidden">
                      {selectedOrder.items.map((it, idx) => (
                        <div key={idx} className="p-3 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={it.productImage || it.imageUrl}
                              alt={it.productName}
                              className="w-12 h-12 rounded-lg bg-[#1c212e] object-contain p-1 border border-[#272d3d]"
                            />
                            <div>
                              <div className="text-xs font-semibold text-white font-serif">{it.productName}</div>
                              <div className="text-[10px] text-neutral-400 font-mono">Qty: {it.quantity} • ${(it.price).toFixed(2)} ea</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="font-mono text-xs font-bold text-white">
                              ${(it.price * it.quantity).toFixed(2)}
                            </span>
                            {onSelectProductForReview && (
                              <button
                                type="button"
                                onClick={() => onSelectProductForReview(it.productId)}
                                className="px-2.5 py-1 rounded-lg bg-[#1e2434] hover:bg-[#c5a880] hover:text-black text-[#c5a880] border border-[#2f384f] text-[10px] font-semibold flex items-center gap-1 transition-all cursor-pointer"
                              >
                                <MessageSquare className="w-3 h-3" />
                                <span>Feedback</span>
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shipping & Delivery Details (READ ONLY / LOCKED) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#222736] text-xs">
                    <div className="bg-[#151924] p-3.5 rounded-xl border border-[#23293a] space-y-1">
                      <div className="flex items-center gap-1.5 text-[#c5a880] text-[10px] uppercase font-bold tracking-wider mb-1.5">
                        <Lock className="w-3 h-3" />
                        <span>Shipping Destination (Locked)</span>
                      </div>
                      <p className="text-white font-medium">{selectedOrder.customerName}</p>
                      <p className="text-neutral-400 text-[11px]">{selectedOrder.shippingAddress}</p>
                      <p className="text-neutral-400 text-[11px]">{selectedOrder.city}, {selectedOrder.postalCode}</p>
                      <p className="text-neutral-400 text-[11px]">{selectedOrder.country}</p>
                      <p className="text-neutral-500 text-[10px] pt-1">Contact: {selectedOrder.customerPhone}</p>
                    </div>

                    <div className="space-y-1.5 bg-[#151924] p-3.5 rounded-xl border border-[#23293a] text-xs">
                      <div className="flex justify-between text-neutral-400">
                        <span>Subtotal</span>
                        <span className="font-mono text-white">${selectedOrder.subtotal.toFixed(2)}</span>
                      </div>
                      {selectedOrder.discount > 0 && (
                        <div className="flex justify-between text-emerald-400">
                          <span>Discount</span>
                          <span className="font-mono">-${selectedOrder.discount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-neutral-400">
                        <span>Courier Shipping</span>
                        <span className="font-mono text-white">
                          {selectedOrder.shippingFee === 0 ? 'Free' : `$${selectedOrder.shippingFee}.00`}
                        </span>
                      </div>
                      <div className="pt-2 border-t border-[#222736] flex justify-between font-bold text-white">
                        <span>Total Paid</span>
                        <span className="font-serif text-[#c5a880] text-sm">${selectedOrder.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                </div>
              ) : null}
            </div>

          </div>
        )}

      </div>
    </section>
  );
};
