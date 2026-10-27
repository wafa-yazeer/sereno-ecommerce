import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Search, 
  Truck, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Calendar, 
  MapPin, 
  CreditCard,
  RotateCcw,
  ExternalLink
} from 'lucide-react';
import { Order } from '../types';
import { api } from '../services/api';

export const OrdersTracker: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [actionMessage, setActionMessage] = useState('');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await api.getOrders({
        search: search.trim() || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
      });
      setOrders(data);
      if (data.length > 0 && !selectedOrder) {
        setSelectedOrder(data[0]);
      }
    } catch (err) {
      console.error('Failed to load orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders();
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm('Are you sure you wish to cancel this order? Reserved timepiece inventory will be returned to the store.')) {
      return;
    }

    try {
      const updated = await api.updateOrderStatus(orderId, 'Cancelled');
      setActionMessage(`Order ${updated.orderNumber} successfully cancelled.`);
      setSelectedOrder(updated);
      fetchOrders();
      setTimeout(() => setActionMessage(''), 4000);
    } catch (err: any) {
      alert(err.message || 'Failed to cancel order');
    }
  };

  const handleUpdateStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      const updated = await api.updateOrderStatus(orderId, newStatus);
      setActionMessage(`Order ${updated.orderNumber} status updated to "${newStatus}".`);
      setSelectedOrder(updated);
      fetchOrders();
      setTimeout(() => setActionMessage(''), 4000);
    } catch (err: any) {
      alert(err.message || 'Failed to update order status');
    }
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
    <section className="py-12 bg-[#0b0c10] min-h-[85vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#c5a880] font-semibold mb-1">
            <Package className="w-4 h-4" />
            <span>Order Fulfillment & Tracking</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-white font-normal">
            Track Your Timepiece
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Inspect real-time order status, courier tracking credentials, and delivery progression.
          </p>
        </div>

        {/* Action feedback banner */}
        {actionMessage && (
          <div className="mb-6 p-4 rounded-xl bg-cyan-950/60 border border-cyan-800/50 text-cyan-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{actionMessage}</span>
          </div>
        )}

        {/* Search & Status Filters */}
        <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#121622] p-4 rounded-xl border border-[#232838]">
          <form onSubmit={handleSearchSubmit} className="flex-1 w-full flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search by Order ID (e.g. SRN-2026-9042), customer name, or courier code..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#181d2a] border border-[#293043] rounded-lg py-2 pl-9 pr-4 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#c5a880]"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-[#23293a] text-xs font-semibold text-white rounded-lg hover:bg-[#30384e] transition-colors"
            >
              Lookup
            </button>
          </form>

          {/* Status filter tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
            {['all', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  statusFilter === st
                    ? 'bg-[#c5a880] text-black font-semibold'
                    : 'bg-[#181d2a] text-neutral-400 hover:text-white border border-[#272e42]'
                }`}
              >
                {st === 'all' ? 'All Orders' : st}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Layout: Left List + Right Detailed Card */}
        {loading ? (
          <div className="py-20 text-center text-neutral-400 text-xs">
            <div className="inline-block w-8 h-8 border-2 border-[#c5a880] border-t-transparent rounded-full animate-spin mb-3"></div>
            <p>Querying order database via REST API...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 bg-[#131722] border border-[#232838] rounded-2xl p-8">
            <Package className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-white mb-1">No orders found</h3>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto mb-4">
              Place a watch order from our collection or adjust your query criteria to view active shipments.
            </p>
            <button
              onClick={() => { setSearch(''); setStatusFilter('all'); fetchOrders(); }}
              className="px-4 py-2 rounded-lg bg-[#c5a880] text-black text-xs font-semibold hover:bg-white"
            >
              Reset Search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left: Orders List */}
            <div className="lg:col-span-5 space-y-3">
              {orders.map((order) => {
                const isSelected = selectedOrder?.id === order.id;
                return (
                  <div
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#181d2a] border-[#c5a880] shadow-lg'
                        : 'bg-[#131722] border-[#222736] hover:border-[#333a4d]'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-mono text-xs font-bold text-white flex items-center gap-2">
                          <span>{order.orderNumber}</span>
                        </div>
                        <p className="text-[11px] text-neutral-400 mt-0.5">{order.customerName}</p>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${getStatusBadge(order.status)}`}>
                        {order.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-neutral-400 pt-2 border-t border-[#1e2333]">
                      <span>{order.items.length} item{order.items.length > 1 ? 's' : ''}</span>
                      <span className="font-mono font-bold text-white">${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right: Selected Order Detail & Progression Timeline */}
            <div className="lg:col-span-7">
              {selectedOrder ? (
                <div className="bg-[#131722] border border-[#232838] rounded-2xl p-6 sm:p-8 space-y-8">
                  
                  {/* Title & Status */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#232838]">
                    <div>
                      <div className="text-[11px] text-neutral-400 font-mono">ORDER MANIFEST</div>
                      <h2 className="font-serif text-2xl font-bold text-white">{selectedOrder.orderNumber}</h2>
                      <p className="text-xs text-neutral-400 mt-0.5 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#c5a880]" />
                        <span>Placed on {new Date(selectedOrder.createdAt).toLocaleDateString()} at {new Date(selectedOrder.createdAt).toLocaleTimeString()}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full border uppercase tracking-wider ${getStatusBadge(selectedOrder.status)}`}>
                        {selectedOrder.status}
                      </span>
                      {selectedOrder.status !== 'Cancelled' && selectedOrder.status !== 'Delivered' && (
                        <button
                          onClick={() => handleCancelOrder(selectedOrder.id)}
                          className="px-3 py-1 bg-rose-950/60 hover:bg-rose-900 border border-rose-800/40 text-rose-300 text-xs rounded-lg transition-colors"
                        >
                          Cancel Order
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Visual Status Progression Stepper */}
                  {selectedOrder.status !== 'Cancelled' ? (
                    <div>
                      <h3 className="text-xs uppercase font-bold tracking-widest text-neutral-400 mb-4">
                        Courier Timeline & Milestone
                      </h3>
                      <div className="grid grid-cols-4 gap-2 text-center text-xs">
                        {[
                          { title: 'Confirmed', icon: Clock, idx: 0 },
                          { title: 'Quality Check', icon: Package, idx: 1 },
                          { title: 'Dispatched', icon: Truck, idx: 2 },
                          { title: 'Delivered', icon: CheckCircle2, idx: 3 },
                        ].map((step) => {
                          const currentStep = getStepProgress(selectedOrder.status);
                          const isDone = currentStep >= step.idx;
                          const isCurrent = currentStep === step.idx;
                          const Icon = step.icon;

                          return (
                            <div key={step.title} className="flex flex-col items-center">
                              <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 border transition-all ${
                                  isDone
                                    ? 'bg-[#c5a880] text-black border-[#c5a880]'
                                    : 'bg-[#181d2a] text-neutral-500 border-[#272d3e]'
                                } ${isCurrent ? 'ring-4 ring-[#c5a880]/20' : ''}`}
                              >
                                <Icon className="w-4 h-4" />
                              </div>
                              <span className={`text-[11px] font-medium ${isDone ? 'text-white' : 'text-neutral-500'}`}>
                                {step.title}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Courier Tracking ID box */}
                      <div className="mt-6 p-4 rounded-xl bg-[#181d2a] border border-[#282f42] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-3">
                          <Truck className="w-5 h-5 text-[#c5a880]" />
                          <div>
                            <span className="text-neutral-400 text-[11px] block">Courier Waybill Tracking:</span>
                            <span className="font-mono font-bold text-white text-sm">{selectedOrder.trackingNumber}</span>
                          </div>
                        </div>
                        <span className="text-emerald-400 text-xs font-semibold bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-800/40">
                          Priority Air Express
                        </span>
                      </div>

                      {/* Store Operator Quick Status Bar */}
                      <div className="mt-4 p-4 rounded-xl bg-[#151924] border border-[#272f44] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] uppercase tracking-wider font-semibold text-[#c5a880]">
                            Manage Status:
                          </span>
                          <select
                            value={selectedOrder.status}
                            onChange={(e) => handleUpdateStatus(selectedOrder.id, e.target.value as Order['status'])}
                            className="bg-[#1b2130] border border-[#30394f] rounded-lg px-2.5 py-1.5 text-xs font-semibold text-white focus:outline-none focus:border-[#c5a880]"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                          {selectedOrder.status !== 'Shipped' && selectedOrder.status !== 'Delivered' && (
                            <button
                              onClick={() => handleUpdateStatus(selectedOrder.id, 'Shipped')}
                              className="px-3 py-1.5 bg-cyan-950/70 hover:bg-cyan-900 border border-cyan-700/60 text-cyan-300 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                            >
                              <Truck className="w-3.5 h-3.5" />
                              <span>Mark as Shipped</span>
                            </button>
                          )}
                          {selectedOrder.status !== 'Delivered' && (
                            <button
                              onClick={() => handleUpdateStatus(selectedOrder.id, 'Delivered')}
                              className="px-3.5 py-1.5 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/60 text-emerald-300 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Mark as Delivered</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/40 text-rose-300 text-xs flex items-center gap-3">
                      <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
                      <div>
                        <div className="font-bold">Order Cancelled</div>
                        <div>This order was cancelled and inventory has been returned to stock.</div>
                      </div>
                    </div>
                  )}

                  {/* Itemized Watch List */}
                  <div>
                    <h3 className="text-xs uppercase font-bold tracking-widest text-neutral-400 mb-3">
                      Purchased Items ({selectedOrder.items.length})
                    </h3>
                    <div className="divide-y divide-[#1e2333] border border-[#232838] rounded-xl bg-[#161a25] overflow-hidden">
                      {selectedOrder.items.map((it, idx) => (
                        <div key={idx} className="p-3 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={it.productImage}
                              alt={it.productName}
                              className="w-12 h-12 rounded bg-[#1c212e] object-contain p-1 border border-[#2b3244]"
                            />
                            <div>
                              <div className="text-xs font-semibold text-white font-serif">{it.productName}</div>
                              <div className="text-[10px] text-neutral-400 font-mono">SKU: {it.sku} • Qty: {it.quantity}</div>
                            </div>
                          </div>
                          <div className="font-mono text-xs font-bold text-white">
                            ${(it.price * it.quantity).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shipping & Financial Breakdown */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-[#232838] text-xs">
                    <div>
                      <h4 className="text-neutral-400 uppercase tracking-wider text-[10px] font-bold mb-2 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#c5a880]" />
                        <span>Delivery Destination</span>
                      </h4>
                      <p className="text-white font-semibold">{selectedOrder.customerName}</p>
                      <p className="text-neutral-400">{selectedOrder.shippingAddress}</p>
                      <p className="text-neutral-400">{selectedOrder.city}, {selectedOrder.postalCode}</p>
                      <p className="text-neutral-400">{selectedOrder.country}</p>
                      <p className="text-neutral-400 mt-1">Contact: {selectedOrder.customerPhone}</p>
                    </div>

                    <div className="space-y-1.5 bg-[#171c28] p-4 rounded-xl border border-[#252b3b]">
                      <div className="flex justify-between text-neutral-400">
                        <span>Subtotal</span>
                        <span className="font-mono text-white">${selectedOrder.subtotal.toFixed(2)}</span>
                      </div>
                      {selectedOrder.discount > 0 && (
                        <div className="flex justify-between text-emerald-400">
                          <span>Voucher Discount</span>
                          <span className="font-mono">-${selectedOrder.discount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-neutral-400">
                        <span>Horology Tax</span>
                        <span className="font-mono text-white">${selectedOrder.tax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-neutral-400">
                        <span>Shipping Courier</span>
                        <span className="font-mono text-white">
                          {selectedOrder.shippingFee === 0 ? 'Complimentary' : `$${selectedOrder.shippingFee}.00`}
                        </span>
                      </div>
                      <div className="pt-2 border-t border-[#242b3d] flex justify-between font-bold text-sm text-white">
                        <span>Total Paid</span>
                        <span className="font-serif text-[#c5a880] text-base">${selectedOrder.total.toFixed(2)}</span>
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
