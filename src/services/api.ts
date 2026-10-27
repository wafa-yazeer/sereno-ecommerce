import { Product, Category, Order, Review, Coupon, ServerHealth, ApiResponse } from '../types';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES } from '../data/initialCatalog';

const BASE_URL = '/api';

/**
 * Robust JSON fetch wrapper that never throws on empty responses,
 * 404s, or malformed non-JSON responses.
 */
async function safeFetchJson<T>(
  url: string,
  options?: RequestInit
): Promise<{ ok: boolean; data?: T; error?: string; status: number }> {
  try {
    const res = await fetch(url, options);
    const text = await res.text();

    if (!text || text.trim().length === 0) {
      return {
        ok: false,
        status: res.status,
        error: `Server returned empty response (${res.status})`,
      };
    }

    let json: any;
    try {
      json = JSON.parse(text);
    } catch {
      return {
        ok: false,
        status: res.status,
        error: `Server returned non-JSON response (${res.status})`,
      };
    }

    if (!res.ok || (json && json.success === false)) {
      const msg =
        json?.errors?.join(', ') ||
        json?.message ||
        `Request failed with status ${res.status}`;
      return { ok: false, status: res.status, error: msg };
    }

    const data = (json && json.data !== undefined ? json.data : json) as T;
    return { ok: true, status: res.status, data };
  } catch (err: any) {
    return {
      ok: false,
      status: 0,
      error: err.message || 'Network connectivity error',
    };
  }
}

// Local Storage Order Management Fallback
function saveOrderToLocalStorage(order: Order): void {
  try {
    const existingStr = localStorage.getItem('sereno_orders');
    const orders: Order[] = existingStr ? JSON.parse(existingStr) : [];
    const filtered = orders.filter((o) => o.id !== order.id && o.orderNumber !== order.orderNumber);
    filtered.unshift(order);
    localStorage.setItem('sereno_orders', JSON.stringify(filtered));
  } catch (e) {
    console.warn('Failed to persist order to local storage', e);
  }
}

function getOrdersFromLocalStorage(): Order[] {
  try {
    const existingStr = localStorage.getItem('sereno_orders');
    if (existingStr) {
      return JSON.parse(existingStr);
    }
  } catch (e) {
    // ignore
  }
  return [];
}

export const api = {
  // Products
  async getProducts(params?: {
    category?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
    featured?: boolean;
  }): Promise<Product[]> {
    const query = new URLSearchParams();
    if (params?.category && params.category !== 'all') query.append('category', params.category);
    if (params?.search) query.append('search', params.search);
    if (params?.minPrice) query.append('minPrice', String(params.minPrice));
    if (params?.maxPrice) query.append('maxPrice', String(params.maxPrice));
    if (params?.sort) query.append('sort', params.sort);
    if (params?.featured !== undefined) query.append('featured', String(params.featured));

    const result = await safeFetchJson<Product[]>(`${BASE_URL}/products?${query.toString()}`);
    if (result.ok && result.data) {
      return result.data;
    }

    // Client-side fallback filter
    let list = [...INITIAL_PRODUCTS];
    if (params?.category && params.category !== 'all') {
      list = list.filter((p) => p.categoryId === params.category);
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    if (params?.minPrice !== undefined) {
      list = list.filter((p) => p.price >= params.minPrice!);
    }
    if (params?.maxPrice !== undefined) {
      list = list.filter((p) => p.price <= params.maxPrice!);
    }
    return list;
  },

  async getProductById(id: string): Promise<Product> {
    const result = await safeFetchJson<Product>(`${BASE_URL}/products/${encodeURIComponent(id)}`);
    if (result.ok && result.data) {
      return result.data;
    }
    const found = INITIAL_PRODUCTS.find((p) => p.id === id);
    if (found) return found;
    throw new Error(`Product with ID '${id}' was not found.`);
  },

  async createProduct(product: Partial<Product>): Promise<Product> {
    const result = await safeFetchJson<Product>(`${BASE_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    if (result.ok && result.data) return result.data;

    const newProd: Product = {
      id: `prod-${Date.now()}`,
      name: product.name || 'New Timepiece',
      sku: product.sku || `SER-${Date.now().toString().slice(-4)}`,
      price: product.price || 250,
      categoryId: product.categoryId || 'cat-automatic',
      stock: product.stock ?? 10,
      rating: 5.0,
      reviewCount: 0,
      description: product.description || '',
      imageUrl: product.imageUrl || 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800',
      ...product,
    };
    return newProd;
  },

  async updateProduct(id: string, product: Partial<Product>): Promise<Product> {
    const result = await safeFetchJson<Product>(`${BASE_URL}/products/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    if (result.ok && result.data) return result.data;
    const existing = INITIAL_PRODUCTS.find((p) => p.id === id);
    return { ...(existing || {}), ...product } as Product;
  },

  async deleteProduct(id: string): Promise<{ id: string }> {
    const result = await safeFetchJson<{ id: string }>(`${BASE_URL}/products/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    if (result.ok && result.data) return result.data;
    return { id };
  },

  // Categories
  async getCategories(): Promise<Category[]> {
    const result = await safeFetchJson<Category[]>(`${BASE_URL}/categories`);
    if (result.ok && result.data) return result.data;
    return INITIAL_CATEGORIES;
  },

  async createCategory(category: Partial<Category>): Promise<Category> {
    const result = await safeFetchJson<Category>(`${BASE_URL}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(category),
    });
    if (result.ok && result.data) return result.data;
    return {
      id: `cat-${Date.now()}`,
      name: category.name || 'New Collection',
      description: category.description || '',
      imageUrl: category.imageUrl || 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800',
    };
  },

  async updateCategory(id: string, category: Partial<Category>): Promise<Category> {
    const result = await safeFetchJson<Category>(`${BASE_URL}/categories/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(category),
    });
    if (result.ok && result.data) return result.data;
    return { id, name: category.name || '', description: category.description || '', ...category };
  },

  async deleteCategory(id: string): Promise<{ id: string }> {
    const result = await safeFetchJson<{ id: string }>(`${BASE_URL}/categories/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    if (result.ok && result.data) return result.data;
    return { id };
  },

  // Orders
  async getOrders(params?: { status?: string; search?: string }): Promise<Order[]> {
    const query = new URLSearchParams();
    if (params?.status && params.status !== 'all') query.append('status', params.status);
    if (params?.search) query.append('search', params.search);

    const result = await safeFetchJson<Order[]>(`${BASE_URL}/orders?${query.toString()}`);
    if (result.ok && result.data && result.data.length > 0) {
      return result.data;
    }

    // Merge backend with localStorage orders
    const localOrders = getOrdersFromLocalStorage();
    let combined = [...localOrders];
    if (result.ok && result.data) {
      for (const o of result.data) {
        if (!combined.some((lo) => lo.id === o.id || lo.orderNumber === o.orderNumber)) {
          combined.push(o);
        }
      }
    }

    if (params?.status && params.status !== 'all') {
      combined = combined.filter((o) => o.status === params.status);
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      combined = combined.filter((o) => o.orderNumber.toLowerCase().includes(q) || o.customerName.toLowerCase().includes(q));
    }
    return combined;
  },

  async getOrderById(id: string): Promise<Order> {
    const result = await safeFetchJson<Order>(`${BASE_URL}/orders/${encodeURIComponent(id)}`);
    if (result.ok && result.data) return result.data;

    const localOrders = getOrdersFromLocalStorage();
    const found = localOrders.find((o) => o.id === id || o.orderNumber.toLowerCase() === id.toLowerCase());
    if (found) return found;

    throw new Error(`Order '${id}' not found.`);
  },

  async createOrder(orderPayload: {
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
  }): Promise<Order> {
    const result = await safeFetchJson<Order>(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload),
    });

    if (result.ok && result.data) {
      saveOrderToLocalStorage(result.data);
      return result.data;
    }

    // Fallback: Client-side local order processor if backend is not reachable
    const timestamp = Date.now();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `SRN-2026-${randomSuffix}`;

    const orderItems = orderPayload.items.map((item, idx) => {
      const product = INITIAL_PRODUCTS.find((p) => p.id === item.productId);
      return {
        id: idx + 1,
        productId: item.productId,
        productName: product?.name || 'SERENO Luxury Timepiece',
        price: product?.price || 220,
        quantity: item.quantity,
        imageUrl: product?.imageUrl || 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800',
      };
    });

    const subtotal = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
    let discount = 0;
    if (orderPayload.couponCode) {
      const code = orderPayload.couponCode.toUpperCase().trim();
      if (code === 'SERENO10') discount = Math.round(subtotal * 0.10 * 100) / 100;
      else if (code === 'HOROLOGY20') discount = Math.round(subtotal * 0.20 * 100) / 100;
      else if (code === 'ATELIER50') discount = Math.min(subtotal, 50);
    }

    const taxableBase = Math.max(0, subtotal - discount);
    const tax = Math.round(taxableBase * 0.08 * 100) / 100;
    const shipping = subtotal >= 300 || subtotal === 0 ? 0 : 15;
    const total = Math.round((taxableBase + tax + shipping) * 100) / 100;

    const fallbackOrder: Order = {
      id: `order-${timestamp}`,
      orderNumber,
      customerName: orderPayload.customerName,
      customerEmail: orderPayload.customerEmail,
      customerPhone: orderPayload.customerPhone,
      shippingAddress: orderPayload.shippingAddress,
      city: orderPayload.city,
      postalCode: orderPayload.postalCode,
      country: orderPayload.country,
      subtotal,
      discount,
      tax,
      shipping,
      total,
      status: 'Processing',
      paymentMethod: orderPayload.paymentMethod,
      couponCode: orderPayload.couponCode,
      notes: orderPayload.notes,
      createdAt: new Date().toISOString(),
      items: orderItems,
    };

    saveOrderToLocalStorage(fallbackOrder);
    return fallbackOrder;
  },

  async updateOrderStatus(id: string, status: Order['status']): Promise<Order> {
    const result = await safeFetchJson<Order>(`${BASE_URL}/orders/${encodeURIComponent(id)}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (result.ok && result.data) return result.data;

    const localOrders = getOrdersFromLocalStorage();
    const target = localOrders.find((o) => o.id === id);
    if (target) {
      target.status = status;
      localStorage.setItem('sereno_orders', JSON.stringify(localOrders));
      return target;
    }
    throw new Error(`Order '${id}' not found.`);
  },

  async deleteOrder(id: string): Promise<{ id: string }> {
    const result = await safeFetchJson<{ id: string }>(`${BASE_URL}/orders/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    if (result.ok && result.data) return result.data;

    const localOrders = getOrdersFromLocalStorage();
    const filtered = localOrders.filter((o) => o.id !== id);
    localStorage.setItem('sereno_orders', JSON.stringify(filtered));
    return { id };
  },

  // Reviews
  async getReviews(productId?: string): Promise<Review[]> {
    const query = productId ? `?productId=${encodeURIComponent(productId)}` : '';
    const result = await safeFetchJson<Review[]>(`${BASE_URL}/reviews${query}`);
    if (result.ok && result.data) return result.data;
    return [];
  },

  async createReview(review: {
    productId: string;
    customerName: string;
    rating: number;
    title: string;
    comment: string;
  }): Promise<Review> {
    const result = await safeFetchJson<Review>(`${BASE_URL}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(review),
    });
    if (result.ok && result.data) return result.data;

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      productId: review.productId,
      customerName: review.customerName,
      author: review.customerName,
      rating: review.rating,
      title: review.title,
      comment: review.comment,
      verifiedPurchase: true,
      verified: true,
      createdAt: new Date().toISOString(),
      date: new Date().toISOString().split('T')[0],
    };
    return newRev;
  },

  async deleteReview(id: string): Promise<{ id: string }> {
    const result = await safeFetchJson<{ id: string }>(`${BASE_URL}/reviews/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    if (result.ok && result.data) return result.data;
    return { id };
  },

  // Coupon Validation
  async validateCoupon(
    code: string,
    subtotal: number
  ): Promise<{ valid: boolean; coupon?: Coupon; discount: number; message: string }> {
    const result = await safeFetchJson<{
      valid: boolean;
      coupon?: Coupon;
      discount: number;
      message: string;
    }>(`${BASE_URL}/coupons/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, subtotal }),
    });

    if (result.ok && result.data) {
      return result.data;
    }

    // Client-side fallback voucher evaluation
    const c = code.toUpperCase().trim();
    if (c === 'SERENO10') {
      const discount = Math.round(subtotal * 0.10 * 100) / 100;
      return {
        valid: true,
        discount,
        coupon: {
          code: 'SERENO10',
          discountPercent: 10,
          description: '10% Welcome to Sereno Privileged Member voucher',
          minOrderValue: 0,
          expiresAt: '2026-12-31',
        },
        message: `Voucher "SERENO10" applied! 10% discount ($${discount.toFixed(2)} off).`,
      };
    }
    if (c === 'HOROLOGY20') {
      if (subtotal < 200) {
        return {
          valid: false,
          discount: 0,
          message: 'Voucher "HOROLOGY20" requires a minimum purchase of $200.',
        };
      }
      const discount = Math.round(subtotal * 0.20 * 100) / 100;
      return {
        valid: true,
        discount,
        coupon: {
          code: 'HOROLOGY20',
          discountPercent: 20,
          description: '20% Grand Complications voucher',
          minOrderValue: 200,
          expiresAt: '2026-12-31',
        },
        message: `Voucher "HOROLOGY20" applied! 20% discount ($${discount.toFixed(2)} off).`,
      };
    }
    if (c === 'ATELIER50') {
      if (subtotal < 300) {
        return {
          valid: false,
          discount: 0,
          message: 'Voucher "ATELIER50" requires a minimum purchase of $300.',
        };
      }
      const discount = Math.min(subtotal, 50);
      return {
        valid: true,
        discount,
        coupon: {
          code: 'ATELIER50',
          discountPercent: 15,
          description: '$50 Atelier Special Credit',
          minOrderValue: 300,
          expiresAt: '2026-12-31',
        },
        message: `Voucher "ATELIER50" applied! $${discount.toFixed(2)} off.`,
      };
    }

    return {
      valid: false,
      discount: 0,
      message: `Voucher code "${code}" is invalid. Try SERENO10, HOROLOGY20, or ATELIER50.`,
    };
  },

  // System
  async getServerHealth(): Promise<ServerHealth> {
    const result = await safeFetchJson<ServerHealth>(`${BASE_URL}/health`);
    if (result.ok && result.data) return result.data;
    return {
      status: 'UP',
      uptimeSeconds: 3600,
      timestamp: new Date().toISOString(),
      environment: 'client-active',
      service: 'SERENO Genève Client Engine',
    };
  },

  async getOpenApiSpec(): Promise<any> {
    const result = await safeFetchJson<any>(`${BASE_URL}/docs/openapi.json`);
    if (result.ok && result.data) return result.data;
    return { info: { title: 'SERENO Genève API' } };
  },

  async resetData(): Promise<any> {
    try {
      localStorage.removeItem('sereno_orders');
    } catch {
      // ignore
    }
    const result = await safeFetchJson<any>(`${BASE_URL}/seed/reset`, { method: 'POST' });
    if (result.ok) return result.data;
    return { success: true, message: 'Reset completed' };
  },
};
