import React, { useState, useEffect } from 'react';
import { 
  Layers, 
  Package, 
  FolderTree, 
  ShoppingBag, 
  MessageSquare, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  CheckCircle, 
  AlertCircle, 
  RotateCcw,
  DollarSign,
  TrendingUp,
  X,
  Briefcase,
  ShieldCheck,
  User as UserIcon,
  Lock,
  Key,
  LogOut,
  ArrowLeft,
  Users,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { Product, Category, Order, Review, User } from '../types';
import { api } from '../services/api';

interface AdminPortalProps {
  currentUser?: User | null;
  onOpenAuth?: () => void;
  onAdminLogin?: (user: User) => void;
  onAdminLogout?: () => void;
  onNavigateToUserPortal?: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  currentUser,
  onOpenAuth,
  onAdminLogin,
  onAdminLogout,
  onNavigateToUserPortal,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'products' | 'categories' | 'orders' | 'reviews' | 'users'>('products');
  
  // Data states
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Admin Login Form States
  const [adminEmail, setAdminEmail] = useState('admin@sereno.ch');
  const [adminPassword, setAdminPassword] = useState('admin123');
  const [adminLoginLoading, setAdminLoginLoading] = useState(false);
  const [adminLoginError, setAdminLoginError] = useState('');

  // Modals state
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Product Form State
  const [prodForm, setProdForm] = useState<Partial<Product>>({
    name: '',
    sku: '',
    categoryId: '',
    price: 199,
    originalPrice: 299,
    stock: 15,
    description: '',
    dialColor: 'Midnight Onyx',
    caseSize: '42 MM',
    movement: 'Automatic Calibre 8215',
    glass: 'Domed Sapphire Crystal',
    waterResistance: '10 ATM (100m)',
    strap: 'Solid 316L Stainless Steel',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
    badge: 'New Arrival',
    featured: false,
  });

  // Category Form State
  const [catForm, setCatForm] = useState<Partial<Category>>({
    name: '',
    description: '',
    imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800',
  });

  const notify = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [prodsData, catsData, ordersData, reviewsData, usersData] = await Promise.all([
        api.getProducts(),
        api.getCategories(),
        api.getOrders(),
        api.getReviews(),
        api.getUsers(),
      ]);
      setProducts(prodsData);
      setCategories(catsData);
      setOrders(ordersData);
      setReviews(reviewsData);
      setUsersList(usersData);
    } catch (err: any) {
      notify('error', err.message || 'Failed to load database records');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminLoginError('');
    setAdminLoginLoading(true);
    try {
      const response = await api.login({ email: adminEmail.trim(), password: adminPassword });
      if (response.user.role !== 'manager') {
        throw new Error('Access denied: This account is registered as a Customer. Please sign in with Store Manager or Executive Administrator credentials.');
      }
      notify('success', `Access granted. Welcome to the Management Atelier, ${response.user.name}!`);
      if (onAdminLogin) {
        onAdminLogin(response.user);
      }
      loadAllData();
    } catch (err: any) {
      setAdminLoginError(err.message || 'Invalid administrator email or password credentials.');
    } finally {
      setAdminLoginLoading(false);
    }
  };

  const fillAdminCredentials = (email: string, pass: string) => {
    setAdminEmail(email);
    setAdminPassword(pass);
    setAdminLoginError('');
  };

  useEffect(() => {
    if (currentUser?.role === 'manager') {
      loadAllData();
    }
  }, [currentUser]);

  // ================= PRODUCTS CRUD HANDLERS =================
  const handleOpenCreateProduct = () => {
    setEditingProduct(null);
    setProdForm({
      name: '',
      sku: `SER-${Math.floor(100 + Math.random() * 900)}-MOD`,
      categoryId: categories[0]?.id || '',
      price: 249,
      originalPrice: 349,
      stock: 12,
      description: 'Crafted with precision engineering and high-grade finishing.',
      dialColor: 'Obsidian Black',
      caseSize: '42 MM',
      movement: 'Seiko NH35 Automatic',
      glass: 'Double-Domed Sapphire Crystal',
      waterResistance: '10 ATM (100m)',
      strap: '316L Stainless Steel Oyster',
      imageUrl: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800',
      badge: 'New Arrival',
      featured: true,
    });
    setShowProductModal(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setProdForm({ ...prod });
    setShowProductModal(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        // PUT /api/products/:id
        const updated = await api.updateProduct(editingProduct.id, prodForm);
        setProducts(products.map((p) => (p.id === updated.id ? updated : p)));
        notify('success', `Product "${updated.name}" updated successfully via PUT /api/products/${updated.id}`);
      } else {
        // POST /api/products
        const created = await api.createProduct(prodForm);
        setProducts([created, ...products]);
        notify('success', `Product "${created.name}" created successfully via POST /api/products`);
      }
      setShowProductModal(false);
      loadAllData(); // Refresh category counts
    } catch (err: any) {
      notify('error', err.message || 'Product save failed');
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This performs a DELETE /api/products/${id} request.`)) {
      return;
    }
    try {
      await api.deleteProduct(id);
      setProducts(products.filter((p) => p.id !== id));
      notify('success', `Product "${name}" deleted via DELETE /api/products/${id}`);
      loadAllData();
    } catch (err: any) {
      notify('error', err.message || 'Delete failed');
    }
  };

  // ================= CATEGORIES CRUD HANDLERS =================
  const handleOpenCreateCategory = () => {
    setEditingCategory(null);
    setCatForm({
      name: '',
      description: 'Exclusive collection of specialized luxury timepieces.',
      imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800',
    });
    setShowCategoryModal(true);
  };

  const handleOpenEditCategory = (cat: Category) => {
    setEditingCategory(cat);
    setCatForm({ ...cat });
    setShowCategoryModal(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        // PUT /api/categories/:id
        const updated = await api.updateCategory(editingCategory.id, catForm);
        setCategories(categories.map((c) => (c.id === updated.id ? updated : c)));
        notify('success', `Category "${updated.name}" updated via PUT /api/categories/${updated.id}`);
      } else {
        // POST /api/categories
        const created = await api.createCategory(catForm);
        setCategories([...categories, created]);
        notify('success', `Category "${created.name}" created via POST /api/categories`);
      }
      setShowCategoryModal(false);
    } catch (err: any) {
      notify('error', err.message || 'Category save failed');
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (categories.length <= 1) {
      alert('At least one category must remain in the store.');
      return;
    }
    if (!confirm(`Delete category "${name}"? Any items will be reassigned to the default collection.`)) {
      return;
    }
    try {
      await api.deleteCategory(id);
      setCategories(categories.filter((c) => c.id !== id));
      notify('success', `Category "${name}" deleted via DELETE /api/categories/${id}`);
      loadAllData();
    } catch (err: any) {
      notify('error', err.message || 'Delete failed');
    }
  };

  // ================= ORDERS CRUD HANDLERS =================
  const handleUpdateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      const updated = await api.updateOrderStatus(orderId, newStatus);
      setOrders(orders.map((o) => (o.id === orderId ? updated : o)));
      notify('success', `Order ${updated.orderNumber} status changed to ${newStatus} via PUT /api/orders/:id/status`);
    } catch (err: any) {
      notify('error', err.message || 'Failed to update order status');
    }
  };

  const handleDeleteOrder = async (orderId: string, orderNumber: string) => {
    if (!confirm(`Delete order "${orderNumber}" from system database? (DELETE /api/orders/${orderId})`)) {
      return;
    }
    try {
      await api.deleteOrder(orderId);
      setOrders(orders.filter((o) => o.id !== orderId));
      notify('success', `Order ${orderNumber} deleted successfully.`);
    } catch (err: any) {
      notify('error', err.message || 'Failed to delete order');
    }
  };

  // ================= REVIEWS CRUD HANDLERS =================
  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('Delete customer review? (DELETE /api/reviews/:id)')) return;
    try {
      await api.deleteReview(reviewId);
      setReviews(reviews.filter((r) => r.id !== reviewId));
      notify('success', 'Customer review removed and ratings recalculated.');
      loadAllData();
    } catch (err: any) {
      notify('error', err.message || 'Delete failed');
    }
  };

  // Reset database handler
  const handleResetDatabase = async () => {
    if (!confirm('Reset entire store database to original seed state? This resets all products, categories, orders, and reviews.')) {
      return;
    }
    try {
      await api.resetData();
      await loadAllData();
      notify('success', 'Store catalog and demonstration inventory reset successfully.');
    } catch (err: any) {
      notify('error', err.message || 'Reset failed');
    }
  };

  // Summary Metrics calculations
  const totalRevenue = orders
    .filter((o) => o.status !== 'Cancelled')
    .reduce((acc, o) => acc + o.total, 0);

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // =========================================================
  // ADMIN AUTHENTICATION GATE (RESTRICTED ACCESS)
  // =========================================================
  if (currentUser?.role !== 'manager') {
    return (
      <div className="py-12 bg-[#0b0c10] min-h-[85vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-[#11141c] border border-[#2d374d] rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          {/* Subtle gold luxury background glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-[#c5a880] to-transparent"></div>

          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-14 h-14 mx-auto rounded-full bg-[#1b2131] border border-[#c5a880]/50 flex items-center justify-center text-[#c5a880] mb-3 shadow-lg">
              <Lock className="w-7 h-7" />
            </div>
            <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#c5a880] font-bold">
              Restricted Back-Office
            </div>
            <h1 className="font-serif text-2xl font-bold text-white mt-1">
              Management Atelier (Admin Portal)
            </h1>
            <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
              This administrative portal requires authorized Store Manager or Executive credentials to modify timepiece inventory, update shipping milestones, and moderate reviews.
            </p>
          </div>

          {/* Current Customer Notice if logged in as Customer */}
          {currentUser && (
            <div className="mb-5 p-3 rounded-xl bg-amber-950/40 border border-amber-800/50 text-xs text-amber-200 flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white">Signed in as Collector (Customer):</p>
                <p className="text-[11px] text-amber-300 font-mono mt-0.5">{currentUser.name} ({currentUser.email})</p>
                <p className="text-[11px] text-neutral-400 mt-1">
                  Customer accounts do not possess administrative permissions. Sign in with an authorized manager account below.
                </p>
              </div>
            </div>
          )}

          {/* Error Alert */}
          {adminLoginError && (
            <div className="mb-4 p-3 rounded-lg bg-rose-950/60 border border-rose-800/60 text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{adminLoginError}</span>
            </div>
          )}

          {/* Admin Login Form */}
          <form onSubmit={handleAdminLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                Administrator / Manager Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="admin@sereno.ch"
                  className="w-full bg-[#181d2a] border border-[#2d374d] rounded-xl py-2.5 pl-9 pr-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#c5a880]"
                />
                <UserIcon className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1.5">
                Security Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#181d2a] border border-[#2d374d] rounded-xl py-2.5 pl-9 pr-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#c5a880]"
                />
                <Key className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={adminLoginLoading}
              className="w-full py-3 px-4 rounded-xl bg-[#c5a880] hover:bg-white text-black font-serif font-bold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 cursor-pointer"
            >
              {adminLoginLoading ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Briefcase className="w-4 h-4" />
                  <span>Authenticate & Enter Atelier</span>
                </>
              )}
            </button>
          </form>

          {/* Quick-Fill Demo Credentials */}
          <div className="mt-6 pt-5 border-t border-[#232838]">
            <p className="text-[11px] font-mono text-neutral-400 text-center uppercase tracking-wider mb-2.5">
              Quick-Fill Verified Test Credentials
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => fillAdminCredentials('admin@sereno.ch', 'admin123')}
                className="p-2.5 rounded-lg bg-[#181d2a] hover:bg-[#232b3d] border border-[#2e374c] hover:border-[#c5a880]/60 text-left transition-all group"
              >
                <div className="text-[10px] font-bold text-[#c5a880] uppercase tracking-wider flex items-center justify-between">
                  <span>Executive Admin</span>
                  <span className="text-[9px] text-emerald-400 font-mono">1-Click</span>
                </div>
                <div className="text-white font-medium text-[11px] truncate mt-0.5">admin@sereno.ch</div>
                <div className="text-[10px] text-neutral-500 font-mono">Pass: admin123</div>
              </button>

              <button
                type="button"
                onClick={() => fillAdminCredentials('manager@sereno.ch', 'admin')}
                className="p-2.5 rounded-lg bg-[#181d2a] hover:bg-[#232b3d] border border-[#2e374c] hover:border-[#c5a880]/60 text-left transition-all group"
              >
                <div className="text-[10px] font-bold text-[#c5a880] uppercase tracking-wider flex items-center justify-between">
                  <span>Store Manager</span>
                  <span className="text-[9px] text-emerald-400 font-mono">1-Click</span>
                </div>
                <div className="text-white font-medium text-[11px] truncate mt-0.5">manager@sereno.ch</div>
                <div className="text-[10px] text-neutral-500 font-mono">Pass: admin</div>
              </button>
            </div>
          </div>

          {/* Back to Collector Shop (User Portal) */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={onNavigateToUserPortal}
              className="text-xs text-neutral-400 hover:text-[#c5a880] transition-colors inline-flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Collector Boutique (User Portal)</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-10 bg-[#0b0c10] min-h-[90vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header & DB Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#232733]">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#c5a880] font-bold mb-1">
              <Layers className="w-4 h-4" />
              <span>SERENO Genève • Boutique Administration Suite</span>
            </div>
            <h1 className="font-serif text-3xl font-bold text-white">
              Management Atelier (Admin Portal)
            </h1>
            <p className="text-xs text-neutral-400 mt-1">
              Live catalog controls, real-time inventory adjustments, order fulfillment, and client reviews.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {onNavigateToUserPortal && (
              <button
                onClick={onNavigateToUserPortal}
                className="px-3.5 py-2 rounded-lg bg-[#181d2a] border border-[#2d374d] text-[#c5a880] hover:text-white hover:border-[#c5a880] text-xs font-semibold flex items-center gap-1.5 transition-colors"
                title="Go to customer shop view"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Collector Boutique (User Portal)</span>
              </button>
            )}

            {onAdminLogout && (
              <button
                onClick={onAdminLogout}
                className="px-3.5 py-2 rounded-lg bg-rose-950/40 hover:bg-rose-950/80 border border-rose-800/40 text-rose-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                title="Sign out from management atelier"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Admin Sign Out</span>
              </button>
            )}

            <button
              onClick={handleResetDatabase}
              className="px-3 py-2 rounded-lg bg-[#1a1f2c] border border-[#2b3347] text-neutral-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Restore default catalog inventory"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#c5a880]" />
              <span className="hidden sm:inline">Reset Defaults</span>
            </button>

            {activeSubTab === 'products' && (
              <button
                onClick={handleOpenCreateProduct}
                className="px-4 py-2 rounded-lg bg-[#c5a880] text-black text-xs font-bold uppercase tracking-wider hover:bg-white transition-colors flex items-center gap-1.5 shadow"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Watch</span>
              </button>
            )}

            {activeSubTab === 'categories' && (
              <button
                onClick={handleOpenCreateCategory}
                className="px-4 py-2 rounded-lg bg-[#c5a880] text-black text-xs font-bold uppercase tracking-wider hover:bg-white transition-colors flex items-center gap-1.5 shadow"
              >
                <Plus className="w-4 h-4" />
                <span>Add Category</span>
              </button>
            )}
          </div>
        </div>

        {/* Manager Mode Banner */}
        <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-[#141926] via-[#1c2234] to-[#141926] border border-[#2d374d] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 shrink-0">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <span>Manager Session: {currentUser?.name || 'Authorized Boutique Director'}</span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded font-mono uppercase font-bold">
                  Store Manager Verified
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                Authenticated account: <strong className="text-white">{currentUser?.email}</strong>. Full access granted to catalog, inventory, order tracking, and client reviews.
              </p>
            </div>
          </div>
        </div>

        {/* Global Alert Notification */}
        {notification && (
          <div
            className={`mb-6 p-4 rounded-xl text-xs flex items-center gap-3 border ${
              notification.type === 'success'
                ? 'bg-emerald-950/60 border-emerald-800/50 text-emerald-300'
                : 'bg-rose-950/60 border-rose-800/50 text-rose-300'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
        )}

        {/* Enterprise KPI Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#121622] border border-[#222736] p-4 rounded-xl">
            <div className="text-[11px] text-neutral-400 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>Catalog Inventory</span>
              <Package className="w-3.5 h-3.5 text-[#c5a880]" />
            </div>
            <div className="text-2xl font-serif font-bold text-white">{products.length}</div>
            <div className="text-[10px] text-neutral-500 mt-1">Across {categories.length} horology collections</div>
          </div>

          <div className="bg-[#121622] border border-[#222736] p-4 rounded-xl">
            <div className="text-[11px] text-neutral-400 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>Customer Orders</span>
              <ShoppingBag className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="text-2xl font-serif font-bold text-white">{orders.length}</div>
            <div className="text-[10px] text-emerald-400 mt-1">
              {orders.filter((o) => o.status === 'Delivered').length} Delivered successfully
            </div>
          </div>

          <div className="bg-[#121622] border border-[#222736] p-4 rounded-xl">
            <div className="text-[11px] text-neutral-400 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>Total Revenue</span>
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-2xl font-serif font-bold text-white">${totalRevenue.toFixed(2)}</div>
            <div className="text-[10px] text-neutral-500 mt-1">Active order receivables</div>
          </div>

          <div className="bg-[#121622] border border-[#222736] p-4 rounded-xl">
            <div className="text-[11px] text-neutral-400 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>Customer Reviews</span>
              <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-2xl font-serif font-bold text-white">{reviews.length}</div>
            <div className="text-[10px] text-amber-400 mt-1">4.9 Star average satisfaction</div>
          </div>
        </div>

        {/* Sub Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-[#232733] pb-4 mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveSubTab('products')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors ${
              activeSubTab === 'products'
                ? 'bg-[#c5a880] text-black font-bold'
                : 'bg-[#141822] text-neutral-400 hover:text-white'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Products Resource ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('categories')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors ${
              activeSubTab === 'categories'
                ? 'bg-[#c5a880] text-black font-bold'
                : 'bg-[#141822] text-neutral-400 hover:text-white'
            }`}
          >
            <FolderTree className="w-4 h-4" />
            <span>Categories Resource ({categories.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('orders')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors ${
              activeSubTab === 'orders'
                ? 'bg-[#c5a880] text-black font-bold'
                : 'bg-[#141822] text-neutral-400 hover:text-white'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Orders Resource ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('reviews')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors ${
              activeSubTab === 'reviews'
                ? 'bg-[#c5a880] text-black font-bold'
                : 'bg-[#141822] text-neutral-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Customer Reviews ({reviews.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('users')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors ${
              activeSubTab === 'users'
                ? 'bg-[#c5a880] text-black font-bold'
                : 'bg-[#141822] text-neutral-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Accounts & Collectors ({usersList.length})</span>
          </button>
        </div>

        {/* ========================================================= */}
        {/* TAB 1: PRODUCTS RESOURCE CRUD */}
        {/* ========================================================= */}
        {activeSubTab === 'products' && (
          <div className="bg-[#121622] border border-[#232838] rounded-2xl overflow-hidden shadow-xl">
            {/* Table search filter */}
            <div className="p-4 border-b border-[#232838] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter watches by name or SKU..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#181d2a] border border-[#2b3347] rounded-lg py-2 pl-9 pr-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#c5a880]"
                />
              </div>

              <span className="text-xs text-neutral-400">
                Displaying <strong className="text-white">{filteredProducts.length}</strong> watches
              </span>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#d1d5e2]">
                <thead className="bg-[#171c28] text-[#8e95a8] uppercase text-[10px] tracking-wider border-b border-[#232838]">
                  <tr>
                    <th className="p-4">Watch</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Stock</th>
                    <th className="p-4">Calibre</th>
                    <th className="p-4">Rating</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e2333]">
                  {filteredProducts.map((prod) => (
                    <tr key={prod.id} className="hover:bg-[#181d2a] transition-colors">
                      <td className="p-4 flex items-center gap-3">
                        <img
                          src={prod.imageUrl}
                          alt={prod.name}
                          className="w-11 h-11 rounded-lg bg-[#1c2230] object-contain p-1 border border-[#2a3142]"
                        />
                        <div>
                          <div className="font-semibold text-white font-serif text-sm">{prod.name}</div>
                          <div className="font-mono text-[10px] text-neutral-400">{prod.sku}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="bg-[#1c2230] px-2.5 py-1 rounded border border-[#293043] text-neutral-300">
                          {prod.categoryName}
                        </span>
                      </td>
                      <td className="p-4 font-mono font-bold text-white text-sm">
                        ${prod.price}
                      </td>
                      <td className="p-4">
                        {prod.stock <= 0 ? (
                          <span className="text-rose-400 font-bold">Out of stock (0)</span>
                        ) : prod.stock < 8 ? (
                          <span className="text-amber-400 font-bold">Low ({prod.stock})</span>
                        ) : (
                          <span className="text-emerald-400 font-medium">{prod.stock} units</span>
                        )}
                      </td>
                      <td className="p-4 font-mono text-[11px] text-neutral-400">
                        {prod.movement.split(' ')[0]} {prod.caseSize}
                      </td>
                      <td className="p-4 font-mono text-amber-400">
                        ★ {prod.rating} ({prod.reviewCount})
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEditProduct(prod)}
                          className="p-1.5 rounded-md bg-[#212737] hover:bg-[#2d364c] text-white transition-colors"
                          title="Edit product"
                        >
                          <Edit className="w-3.5 h-3.5 text-[#c5a880]" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(prod.id, prod.name)}
                          className="p-1.5 rounded-md bg-[#212737] hover:bg-rose-950 text-rose-400 transition-colors"
                          title="Delete product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: CATEGORIES RESOURCE CRUD */}
        {/* ========================================================= */}
        {activeSubTab === 'categories' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <div key={cat.id} className="bg-[#121622] border border-[#232838] rounded-xl p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="font-serif text-lg font-bold text-white">{cat.name}</h3>
                    <span className="text-xs font-mono bg-[#1c2230] text-[#c5a880] px-2 py-0.5 rounded border border-[#2b3347]">
                      {cat.itemCount ?? 0} Watches
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed mb-4">{cat.description}</p>
                  <div className="font-mono text-[10px] text-neutral-500 mb-4">Slug: /{cat.slug}</div>
                </div>

                <div className="pt-3 border-t border-[#1e2333] flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleOpenEditCategory(cat)}
                    className="px-3 py-1.5 rounded-lg bg-[#1c2230] hover:bg-[#272f42] text-xs font-semibold text-white flex items-center gap-1.5 transition-colors"
                  >
                    <Edit className="w-3.5 h-3.5 text-[#c5a880]" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(cat.id, cat.name)}
                    className="px-3 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/40 text-rose-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: ORDERS RESOURCE CRUD */}
        {/* ========================================================= */}
        {activeSubTab === 'orders' && (
          <div className="bg-[#121622] border border-[#232838] rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#d1d5e2]">
                <thead className="bg-[#171c28] text-[#8e95a8] uppercase text-[10px] tracking-wider border-b border-[#232838]">
                  <tr>
                    <th className="p-4">Order ID</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Total</th>
                    <th className="p-4">Status & Transition</th>
                    <th className="p-4">Tracking Code</th>
                    <th className="p-4">Date</th>
                    <th className="p-4 text-right">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e2333]">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-[#181d2a] transition-colors">
                      <td className="p-4 font-mono font-bold text-white">
                        {order.orderNumber}
                      </td>
                      <td className="p-4">
                        <div className="text-white font-medium">{order.customerName}</div>
                        <div className="text-neutral-500 text-[10px]">{order.customerEmail}</div>
                      </td>
                      <td className="p-4 font-mono font-bold text-emerald-400">
                        ${order.total.toFixed(2)}
                      </td>
                      <td className="p-4">
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as Order['status'])}
                          className="bg-[#181d2a] border border-[#2a3245] rounded px-2.5 py-1 text-xs font-semibold text-white focus:outline-none focus:border-[#c5a880]"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="p-4 font-mono text-[11px] text-[#c5a880]">
                        {order.trackingNumber}
                      </td>
                      <td className="p-4 text-[11px] text-neutral-400">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleDeleteOrder(order.id, order.orderNumber)}
                          className="p-1.5 rounded-md bg-[#212737] hover:bg-rose-950 text-rose-400 transition-colors"
                          title="Delete order"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: REVIEWS RESOURCE CRUD */}
        {/* ========================================================= */}
        {activeSubTab === 'reviews' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map((rev) => (
              <div key={rev.id} className="bg-[#121622] border border-[#232838] p-5 rounded-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="text-xs font-bold text-white">{rev.customerName}</span>
                      <div className="text-[10px] text-[#c5a880] font-mono">{rev.productName}</div>
                    </div>
                    <span className="text-xs font-mono font-bold text-amber-400">★ {rev.rating}/5</span>
                  </div>
                  <h4 className="text-xs font-semibold text-white mb-1">&quot;{rev.title}&quot;</h4>
                  <p className="text-xs text-neutral-400 leading-relaxed">{rev.comment}</p>
                </div>
                <div className="pt-3 border-t border-[#1e2333] mt-3 flex items-center justify-between text-[10px] text-neutral-500">
                  <span>{new Date(rev.createdAt).toLocaleDateString()}</span>
                  <button
                    onClick={() => handleDeleteReview(rev.id)}
                    className="text-rose-400 hover:underline flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Delete Review</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: REGISTERED ACCOUNTS & COLLECTORS RESOURCE */}
        {/* ========================================================= */}
        {activeSubTab === 'users' && (
          <div className="bg-[#121622] border border-[#232838] rounded-2xl overflow-hidden shadow-xl">
            <div className="p-5 border-b border-[#232838] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#c5a880]" />
                  <span>Registered Collectors & Administrative Accounts</span>
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Full list of authenticated clients and authorized store managers.
                </p>
              </div>
              <span className="text-xs font-mono bg-[#1c2230] text-[#c5a880] px-3 py-1.5 rounded-lg border border-[#2b3347] self-start sm:self-auto">
                {usersList.length} Registered Accounts
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#d1d5e2]">
                <thead className="bg-[#171c28] text-[#8e95a8] uppercase text-[10px] tracking-wider border-b border-[#232838]">
                  <tr>
                    <th className="p-4">User & Name</th>
                    <th className="p-4">Access Role</th>
                    <th className="p-4">Direct Contact</th>
                    <th className="p-4">Residence / City</th>
                    <th className="p-4">Registration Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e2333]">
                  {usersList.map((u) => (
                    <tr key={u.id} className="hover:bg-[#181d2a] transition-colors">
                      <td className="p-4 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#1e2538] border border-[#2e3954] text-[#c5a880] font-bold flex items-center justify-center shrink-0">
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-white">{u.name}</div>
                          <div className="font-mono text-[11px] text-neutral-400">{u.email}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold uppercase border ${
                          u.role === 'manager'
                            ? 'bg-amber-950/60 border-amber-600/60 text-amber-300'
                            : 'bg-cyan-950/60 border-cyan-600/60 text-cyan-300'
                        }`}>
                          {u.role === 'manager' ? 'Store Manager' : 'Collector'}
                        </span>
                      </td>
                      <td className="p-4 text-neutral-300 font-mono text-[11px]">
                        {u.phone || '—'}
                      </td>
                      <td className="p-4 text-neutral-300">
                        {u.city ? `${u.city}, ${u.country || 'Switzerland'}` : '—'}
                      </td>
                      <td className="p-4 text-neutral-400 text-[11px]">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Active'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* ========================================================= */}
      {/* PRODUCT CREATE / EDIT MODAL */}
      {/* ========================================================= */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#11141c] border border-[#2b3245] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 text-[#e0e2ec]">
            <div className="flex items-center justify-between pb-4 border-b border-[#232733] mb-6">
              <h2 className="font-serif text-xl font-bold text-white">
                {editingProduct ? `Edit Product: ${editingProduct.name}` : 'Create New Watch Resource'}
              </h2>
              <button onClick={() => setShowProductModal(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-400 mb-1">Watch Title</label>
                  <input
                    type="text"
                    required
                    value={prodForm.name || ''}
                    onChange={(e) => setProdForm({ ...prodForm, name: e.target.value })}
                    className="w-full bg-[#181d2a] border border-[#2b3347] rounded-lg p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">SKU Code</label>
                  <input
                    type="text"
                    required
                    value={prodForm.sku || ''}
                    onChange={(e) => setProdForm({ ...prodForm, sku: e.target.value })}
                    className="w-full bg-[#181d2a] border border-[#2b3347] rounded-lg p-2.5 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">Category</label>
                  <select
                    value={prodForm.categoryId || categories[0]?.id}
                    onChange={(e) => setProdForm({ ...prodForm, categoryId: e.target.value })}
                    className="w-full bg-[#181d2a] border border-[#2b3347] rounded-lg p-2.5 text-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">Retail Price ($ USD)</label>
                  <input
                    type="number"
                    required
                    min={10}
                    value={prodForm.price || ''}
                    onChange={(e) => setProdForm({ ...prodForm, price: Number(e.target.value) })}
                    className="w-full bg-[#181d2a] border border-[#2b3347] rounded-lg p-2.5 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">Original MSRP ($ USD)</label>
                  <input
                    type="number"
                    value={prodForm.originalPrice || ''}
                    onChange={(e) => setProdForm({ ...prodForm, originalPrice: Number(e.target.value) })}
                    className="w-full bg-[#181d2a] border border-[#2b3347] rounded-lg p-2.5 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={prodForm.stock !== undefined ? prodForm.stock : ''}
                    onChange={(e) => setProdForm({ ...prodForm, stock: Number(e.target.value) })}
                    className="w-full bg-[#181d2a] border border-[#2b3347] rounded-lg p-2.5 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">Calibre / Movement</label>
                  <input
                    type="text"
                    value={prodForm.movement || ''}
                    onChange={(e) => setProdForm({ ...prodForm, movement: e.target.value })}
                    className="w-full bg-[#181d2a] border border-[#2b3347] rounded-lg p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">Case Size (e.g. 42 MM)</label>
                  <input
                    type="text"
                    value={prodForm.caseSize || ''}
                    onChange={(e) => setProdForm({ ...prodForm, caseSize: e.target.value })}
                    className="w-full bg-[#181d2a] border border-[#2b3347] rounded-lg p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">Water Resistance</label>
                  <input
                    type="text"
                    value={prodForm.waterResistance || ''}
                    onChange={(e) => setProdForm({ ...prodForm, waterResistance: e.target.value })}
                    className="w-full bg-[#181d2a] border border-[#2b3347] rounded-lg p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">Product Badge</label>
                  <select
                    value={prodForm.badge || ''}
                    onChange={(e) => setProdForm({ ...prodForm, badge: e.target.value as any })}
                    className="w-full bg-[#181d2a] border border-[#2b3347] rounded-lg p-2.5 text-white"
                  >
                    <option value="">None</option>
                    <option value="New Arrival">New Arrival</option>
                    <option value="50% OFF">50% OFF</option>
                    <option value="20% OFF">20% OFF</option>
                    <option value="Bestseller">Bestseller</option>
                    <option value="Limited Edition">Limited Edition</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Image URL</label>
                <input
                  type="url"
                  required
                  value={prodForm.imageUrl || ''}
                  onChange={(e) => setProdForm({ ...prodForm, imageUrl: e.target.value })}
                  className="w-full bg-[#181d2a] border border-[#2b3347] rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={prodForm.description || ''}
                  onChange={(e) => setProdForm({ ...prodForm, description: e.target.value })}
                  className="w-full bg-[#181d2a] border border-[#2b3347] rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#232733]">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-4 py-2 rounded-lg bg-[#181d2a] text-neutral-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-[#c5a880] text-black font-bold uppercase tracking-wider hover:bg-white"
                >
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* CATEGORY CREATE / EDIT MODAL */}
      {/* ========================================================= */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#11141c] border border-[#2b3245] rounded-2xl w-full max-w-lg p-6 text-[#e0e2ec]">
            <div className="flex items-center justify-between pb-4 border-b border-[#232733] mb-6">
              <h2 className="font-serif text-xl font-bold text-white">
                {editingCategory ? `Edit Category: ${editingCategory.name}` : 'Create New Category Resource'}
              </h2>
              <button onClick={() => setShowCategoryModal(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-400 mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  value={catForm.name || ''}
                  onChange={(e) => setCatForm({ ...catForm, name: e.target.value })}
                  className="w-full bg-[#181d2a] border border-[#2b3347] rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={catForm.description || ''}
                  onChange={(e) => setCatForm({ ...catForm, description: e.target.value })}
                  className="w-full bg-[#181d2a] border border-[#2b3347] rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Banner Image URL</label>
                <input
                  type="url"
                  required
                  value={catForm.imageUrl || ''}
                  onChange={(e) => setCatForm({ ...catForm, imageUrl: e.target.value })}
                  className="w-full bg-[#181d2a] border border-[#2b3347] rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#232733]">
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  className="px-4 py-2 rounded-lg bg-[#181d2a] text-neutral-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-[#c5a880] text-black font-bold uppercase tracking-wider hover:bg-white"
                >
                  {editingCategory ? 'Update Category' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
