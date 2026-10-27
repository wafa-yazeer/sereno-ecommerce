export interface Category {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  imageUrl?: string;
  itemCount?: number;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  categoryId?: string;
  categoryName?: string;
  category?: Category;
  price: number;
  originalPrice?: number;
  stock: number;
  rating?: number;
  reviewCount?: number;
  description?: string;
  dialColor?: string;
  caseSize?: string;
  movement?: string;
  glass?: string;
  waterResistance?: string;
  strap?: string;
  imageUrl: string;
  galleryImages?: string[];
  badge?: string;
  featured?: boolean;
  createdAt?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type UserRole = 'customer' | 'manager';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  shippingAddress?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  createdAt?: string;
  avatarUrl?: string;
}

export interface AuthResponse {
  user: User;
  token?: string;
  message?: string;
}

export interface OrderItem {
  id?: number;
  productId: string;
  productName: string;
  sku?: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  productImage?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress: string;
  city: string;
  postalCode?: string;
  country: string;
  items: OrderItem[];
  subtotal: number;
  tax?: number;
  shipping?: number;
  shippingFee?: number;
  discount?: number;
  total: number;
  paymentMethod: string;
  couponCode?: string;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  notes?: string;
  trackingNumber?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Review {
  id: string;
  productId: string;
  productName?: string;
  author?: string;
  customerName?: string;
  rating: number;
  title: string;
  comment: string;
  date?: string;
  createdAt?: string;
  verified?: boolean;
  verifiedPurchase?: boolean;
}

export interface Coupon {
  code: string;
  discountType?: 'percentage' | 'fixed';
  discountValue?: number;
  discountPercent?: number;
  minSpend?: number;
  minOrderValue?: number;
  expiresAt?: string;
  description?: string;
  active?: boolean;
}

export interface ServerHealth {
  status: string;
  timestamp: string;
  uptime?: number;
  uptimeSeconds?: number;
  environment?: string;
  service?: string;
  database?: any;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: string[];
  timestamp?: string;
}
