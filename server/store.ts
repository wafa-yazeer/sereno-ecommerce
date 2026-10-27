import { Product, Category, Order, Review, Coupon } from '../src/types';
import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_REVIEWS,
  INITIAL_COUPONS,
} from './data';

class DataStore {
  private categories: Category[];
  private products: Product[];
  private orders: Order[];
  private reviews: Review[];
  private coupons: Coupon[];
  private startTime: number;

  constructor() {
    this.startTime = Date.now();
    this.categories = JSON.parse(JSON.stringify(INITIAL_CATEGORIES));
    this.products = JSON.parse(JSON.stringify(INITIAL_PRODUCTS));
    this.orders = JSON.parse(JSON.stringify(INITIAL_ORDERS));
    this.reviews = JSON.parse(JSON.stringify(INITIAL_REVIEWS));
    this.coupons = JSON.parse(JSON.stringify(INITIAL_COUPONS));
    this.updateCategoryCounts();
  }

  public reset(): void {
    this.categories = JSON.parse(JSON.stringify(INITIAL_CATEGORIES));
    this.products = JSON.parse(JSON.stringify(INITIAL_PRODUCTS));
    this.orders = JSON.parse(JSON.stringify(INITIAL_ORDERS));
    this.reviews = JSON.parse(JSON.stringify(INITIAL_REVIEWS));
    this.coupons = JSON.parse(JSON.stringify(INITIAL_COUPONS));
    this.updateCategoryCounts();
  }

  public getUptimeSeconds(): number {
    return Math.floor((Date.now() - this.startTime) / 1000);
  }

  private updateCategoryCounts(): void {
    for (const cat of this.categories) {
      cat.itemCount = this.products.filter((p) => p.categoryId === cat.id).length;
    }
  }

  private recalculateProductRating(productId: string): void {
    const prodReviews = this.reviews.filter((r) => r.productId === productId);
    const prod = this.products.find((p) => p.id === productId);
    if (!prod) return;

    if (prodReviews.length === 0) {
      prod.rating = 5.0;
      prod.reviewCount = 0;
    } else {
      const sum = prodReviews.reduce((acc, r) => acc + r.rating, 0);
      prod.rating = Math.round((sum / prodReviews.length) * 10) / 10;
      prod.reviewCount = prodReviews.length;
    }
  }

  // ================= PRODUCTS CRUD =================
  public getProducts(params?: {
    category?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
    featured?: boolean;
  }): Product[] {
    let result = [...this.products];

    if (params?.category && params.category !== 'all') {
      result = result.filter(
        (p) => p.categoryId === params.category || p.categoryName.toLowerCase() === params.category?.toLowerCase()
      );
    }

    if (params?.search && params.search.trim() !== '') {
      const q = params.search.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.dialColor.toLowerCase().includes(q) ||
          p.movement.toLowerCase().includes(q)
      );
    }

    if (params?.minPrice !== undefined && !isNaN(params.minPrice)) {
      result = result.filter((p) => p.price >= params.minPrice!);
    }

    if (params?.maxPrice !== undefined && !isNaN(params.maxPrice)) {
      result = result.filter((p) => p.price <= params.maxPrice!);
    }

    if (params?.featured !== undefined) {
      result = result.filter((p) => p.featured === params.featured);
    }

    if (params?.sort) {
      switch (params.sort) {
        case 'price_asc':
          result.sort((a, b) => a.price - b.price);
          break;
        case 'price_desc':
          result.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          result.sort((a, b) => b.rating - a.rating);
          break;
        case 'newest':
          result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          break;
        default:
          break;
      }
    }

    return result;
  }

  public getProductById(id: string): Product | undefined {
    return this.products.find((p) => p.id === id || p.sku === id);
  }

  public createProduct(payload: Partial<Product>): Product {
    const category = this.categories.find((c) => c.id === payload.categoryId) || this.categories[0];
    const newId = 'prod-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 6);
    
    const newProduct: Product = {
      id: newId,
      name: payload.name?.trim() || 'Untitled Watch',
      sku: payload.sku?.trim() || `SER-${Math.floor(100 + Math.random() * 900)}-${(category.name.substring(0, 3)).toUpperCase()}`,
      categoryId: category.id,
      categoryName: category.name,
      price: Number(payload.price) || 199,
      originalPrice: payload.originalPrice ? Number(payload.originalPrice) : undefined,
      stock: Number(payload.stock) ?? 10,
      description: payload.description?.trim() || 'Exquisite horological timepiece with high precision movement.',
      dialColor: payload.dialColor?.trim() || 'Midnight Onyx',
      caseSize: payload.caseSize?.trim() || '42 MM',
      movement: payload.movement?.trim() || 'Automatic Calibre 8215',
      glass: payload.glass?.trim() || 'Domed Scratch-Resistant Sapphire Crystal',
      waterResistance: payload.waterResistance?.trim() || '10 ATM (100m)',
      strap: payload.strap?.trim() || 'Solid 316L Stainless Steel',
      rating: 5.0,
      reviewCount: 0,
      imageUrl: payload.imageUrl?.trim() || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
      galleryImages: payload.galleryImages && payload.galleryImages.length > 0 
        ? payload.galleryImages 
        : [payload.imageUrl?.trim() || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'],
      badge: payload.badge || 'New Arrival',
      featured: Boolean(payload.featured),
      createdAt: new Date().toISOString(),
    };

    this.products.unshift(newProduct);
    this.updateCategoryCounts();
    return newProduct;
  }

  public updateProduct(id: string, payload: Partial<Product>): Product | null {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) return null;

    const existing = this.products[index];
    let categoryName = existing.categoryName;
    let categoryId = existing.categoryId;

    if (payload.categoryId && payload.categoryId !== existing.categoryId) {
      const cat = this.categories.find((c) => c.id === payload.categoryId);
      if (cat) {
        categoryId = cat.id;
        categoryName = cat.name;
      }
    }

    const updated: Product = {
      ...existing,
      ...payload,
      id: existing.id, // Immutable ID
      categoryId,
      categoryName,
      price: payload.price !== undefined ? Number(payload.price) : existing.price,
      stock: payload.stock !== undefined ? Number(payload.stock) : existing.stock,
      originalPrice: payload.originalPrice !== undefined ? Number(payload.originalPrice) : existing.originalPrice,
    };

    this.products[index] = updated;
    this.updateCategoryCounts();
    return updated;
  }

  public deleteProduct(id: string): boolean {
    const initialLen = this.products.length;
    this.products = this.products.filter((p) => p.id !== id);
    if (this.products.length !== initialLen) {
      this.updateCategoryCounts();
      return true;
    }
    return false;
  }

  // ================= CATEGORIES CRUD =================
  public getCategories(): Category[] {
    this.updateCategoryCounts();
    return [...this.categories];
  }

  public getCategoryById(id: string): Category | undefined {
    this.updateCategoryCounts();
    return this.categories.find((c) => c.id === id || c.slug === id);
  }

  public createCategory(payload: Partial<Category>): Category {
    const slug = (payload.name || 'new-category')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const newId = 'cat-' + slug + '-' + Math.random().toString(36).substring(2, 5);

    const newCategory: Category = {
      id: newId,
      name: payload.name?.trim() || 'New Category',
      slug: payload.slug || slug,
      description: payload.description?.trim() || 'Collection of premium hand-crafted watches.',
      imageUrl: payload.imageUrl?.trim() || 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80',
      itemCount: 0,
    };

    this.categories.push(newCategory);
    return newCategory;
  }

  public updateCategory(id: string, payload: Partial<Category>): Category | null {
    const cat = this.categories.find((c) => c.id === id);
    if (!cat) return null;

    if (payload.name) cat.name = payload.name.trim();
    if (payload.slug) cat.slug = payload.slug.trim();
    if (payload.description) cat.description = payload.description.trim();
    if (payload.imageUrl) cat.imageUrl = payload.imageUrl.trim();

    // Update category name in products
    for (const prod of this.products) {
      if (prod.categoryId === id) {
        prod.categoryName = cat.name;
      }
    }

    return { ...cat };
  }

  public deleteCategory(id: string): boolean {
    const index = this.categories.findIndex((c) => c.id === id);
    if (index === -1) return false;

    // Reassign products in this category to first remaining category
    this.categories.splice(index, 1);
    const fallbackCategory = this.categories[0];
    if (fallbackCategory) {
      for (const prod of this.products) {
        if (prod.categoryId === id) {
          prod.categoryId = fallbackCategory.id;
          prod.categoryName = fallbackCategory.name;
        }
      }
    }
    this.updateCategoryCounts();
    return true;
  }

  // ================= ORDERS CRUD =================
  public getOrders(params?: { status?: string; search?: string }): Order[] {
    let result = [...this.orders];

    if (params?.status && params.status !== 'all') {
      result = result.filter((o) => o.status.toLowerCase() === params.status?.toLowerCase());
    }

    if (params?.search && params.search.trim() !== '') {
      const q = params.search.toLowerCase().trim();
      result = result.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.customerEmail.toLowerCase().includes(q) ||
          o.trackingNumber.toLowerCase().includes(q) ||
          o.city.toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return result;
  }

  public getOrderById(id: string): Order | undefined {
    return this.orders.find((o) => o.id === id || o.orderNumber === id);
  }

  public createOrder(payload: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    shippingAddress: string;
    city: string;
    postalCode: string;
    country: string;
    items: { productId: string; quantity: number }[];
    paymentMethod: 'Credit / Debit Card' | 'Cash on Delivery (COD)' | 'Bank Transfer';
    couponCode?: string;
    notes?: string;
  }): Order {
    if (!payload.items || payload.items.length === 0) {
      throw new Error('Order must contain at least one item');
    }

    // Build populated order items and verify inventory
    const orderItems = payload.items.map((item) => {
      const product = this.products.find((p) => p.id === item.productId);
      if (!product) {
        throw new Error(`Product with ID ${item.productId} not found`);
      }
      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${product.name}. Available: ${product.stock}, requested: ${item.quantity}`);
      }

      // Decrement stock
      product.stock -= item.quantity;

      return {
        productId: product.id,
        productName: product.name,
        productImage: product.imageUrl,
        sku: product.sku,
        price: product.price,
        quantity: item.quantity,
      };
    });

    const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Coupon discount calculation
    let discount = 0;
    if (payload.couponCode) {
      const couponValidation = this.validateCoupon(payload.couponCode, subtotal);
      if (couponValidation.valid) {
        discount = couponValidation.discount;
      }
    }

    // Taxes & Shipping logic:
    // Tax = 8% of discounted subtotal
    const taxableAmount = Math.max(0, subtotal - discount);
    const tax = Math.round(taxableAmount * 0.08 * 100) / 100;
    // Shipping: free if subtotal >= 300, else $15
    const shippingFee = subtotal >= 300 ? 0 : 15;
    const total = Math.round((taxableAmount + tax + shippingFee) * 100) / 100;

    const orderNumber = `SRN-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const trackingNumber = `FEDEX-SRN-${Math.floor(100000 + Math.random() * 900000)}`;
    const now = new Date().toISOString();

    const newOrder: Order = {
      id: 'ord-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 5),
      orderNumber,
      customerName: payload.customerName.trim(),
      customerEmail: payload.customerEmail.trim(),
      customerPhone: payload.customerPhone.trim(),
      shippingAddress: payload.shippingAddress.trim(),
      city: payload.city.trim(),
      postalCode: payload.postalCode.trim(),
      country: payload.country.trim() || 'United States',
      items: orderItems,
      subtotal,
      discount,
      tax,
      shippingFee,
      total,
      status: 'Processing',
      paymentMethod: payload.paymentMethod || 'Credit / Debit Card',
      trackingNumber,
      notes: payload.notes?.trim() || '',
      createdAt: now,
      updatedAt: now,
    };

    this.orders.unshift(newOrder);
    return newOrder;
  }

  public updateOrderStatus(id: string, status: Order['status']): Order | null {
    const order = this.orders.find((o) => o.id === id || o.orderNumber === id);
    if (!order) return null;

    const prevStatus = order.status;
    order.status = status;
    order.updatedAt = new Date().toISOString();

    // If cancelled from active state, restock items
    if (status === 'Cancelled' && prevStatus !== 'Cancelled') {
      for (const item of order.items) {
        const prod = this.products.find((p) => p.id === item.productId);
        if (prod) {
          prod.stock += item.quantity;
        }
      }
    }

    return { ...order };
  }

  public deleteOrder(id: string): boolean {
    const index = this.orders.findIndex((o) => o.id === id || o.orderNumber === id);
    if (index === -1) return false;
    this.orders.splice(index, 1);
    return true;
  }

  // ================= REVIEWS CRUD =================
  public getReviews(productId?: string): Review[] {
    if (productId) {
      return this.reviews.filter((r) => r.productId === productId);
    }
    return [...this.reviews];
  }

  public createReview(payload: {
    productId: string;
    customerName: string;
    rating: number;
    title: string;
    comment: string;
  }): Review {
    const prod = this.products.find((p) => p.id === payload.productId);
    if (!prod) {
      throw new Error(`Product ${payload.productId} not found`);
    }

    const newReview: Review = {
      id: 'rev-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 5),
      productId: payload.productId,
      productName: prod.name,
      customerName: payload.customerName.trim(),
      rating: Math.min(5, Math.max(1, Number(payload.rating) || 5)),
      title: payload.title.trim(),
      comment: payload.comment.trim(),
      verifiedPurchase: true,
      createdAt: new Date().toISOString(),
    };

    this.reviews.unshift(newReview);
    this.recalculateProductRating(payload.productId);
    return newReview;
  }

  public deleteReview(id: string): boolean {
    const rev = this.reviews.find((r) => r.id === id);
    if (!rev) return false;

    const productId = rev.productId;
    this.reviews = this.reviews.filter((r) => r.id !== id);
    this.recalculateProductRating(productId);
    return true;
  }

  // ================= COUPONS & LOGIC =================
  public validateCoupon(code: string, subtotal: number): {
    valid: boolean;
    coupon?: Coupon;
    discount: number;
    message: string;
  } {
    const cleanCode = code.trim().toUpperCase();
    const coupon = this.coupons.find((c) => c.code === cleanCode && c.active);

    if (!coupon) {
      return { valid: false, discount: 0, message: 'Invalid or expired promotional code.' };
    }

    if (subtotal < coupon.minSpend) {
      return {
        valid: false,
        discount: 0,
        message: `Coupon requires a minimum order of $${coupon.minSpend}. Current subtotal is $${subtotal}.`,
      };
    }

    const discountAmount = Math.round((subtotal * (coupon.discountPercent / 100)) * 100) / 100;
    return {
      valid: true,
      coupon,
      discount: discountAmount,
      message: `Coupon "${coupon.code}" applied! ${coupon.discountPercent}% discount ($${discountAmount.toFixed(2)} off).`,
    };
  }

  public getSummaryStats() {
    const totalRevenue = this.orders
      .filter((o) => o.status !== 'Cancelled')
      .reduce((sum, o) => sum + o.total, 0);

    const pendingOrders = this.orders.filter((o) => o.status === 'Pending' || o.status === 'Processing').length;
    const lowStockCount = this.products.filter((p) => p.stock < 10).length;

    return {
      totalProducts: this.products.length,
      totalCategories: this.categories.length,
      totalOrders: this.orders.length,
      totalReviews: this.reviews.length,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      pendingOrders,
      lowStockCount,
    };
  }
}

export const db = new DataStore();
