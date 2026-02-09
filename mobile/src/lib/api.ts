// API client for mobile app - connects to backend
import Constants from 'expo-constants';

const API_BASE_URL = Constants.expoConfig?.extra?.apiUrl || process.env.EXPO_PUBLIC_API_URL || 'https://modernhealth.pro';
const MOBILE_API_KEY = Constants.expoConfig?.extra?.mobileApiKey || process.env.EXPO_PUBLIC_MOBILE_API_KEY || '';

interface FetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
}

async function apiFetch<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { method = 'GET', body } = options;
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'x-mobile-api-key': MOBILE_API_KEY,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `API Error: ${response.status}`);
  }

  return response.json();
}

// Orders API
export async function getOrders(params?: { limit?: number; status?: string; days?: number }) {
  const searchParams = new URLSearchParams();
  if (params?.limit) searchParams.set('limit', String(params.limit));
  if (params?.status) searchParams.set('status', params.status);
  if (params?.days) searchParams.set('days', String(params.days));
  
  const query = searchParams.toString();
  return apiFetch<{ orders: Order[] }>(`/api/mobile/orders${query ? `?${query}` : ''}`);
}

export async function getOrder(id: string) {
  return apiFetch<Order>(`/api/mobile/orders/${id}`);
}

export async function updateOrder(id: string, updates: Partial<Order>) {
  return apiFetch<{ order: Order }>(`/api/mobile/orders/${id}`, {
    method: 'PUT',
    body: updates,
  });
}

// Customers API
export async function getCustomers(params?: { limit?: number; search?: string }) {
  const searchParams = new URLSearchParams();
  if (params?.limit) searchParams.set('limit', String(params.limit));
  if (params?.search) searchParams.set('search', params.search);
  
  const query = searchParams.toString();
  return apiFetch<{ customers: Customer[]; stats: CustomerStats }>(`/api/mobile/customers${query ? `?${query}` : ''}`);
}

export async function getCustomer(id: string) {
  return apiFetch<Customer>(`/api/mobile/customers/${id}`);
}

export async function updateCustomer(id: string, updates: Partial<Customer>) {
  return apiFetch<{ customer: Customer }>(`/api/mobile/customers/${id}`, {
    method: 'PUT',
    body: updates,
  });
}

// Products API
export async function getProducts() {
  return apiFetch<{ products: Product[]; stats: ProductStats }>(`/api/mobile/products`);
}

export async function getProduct(id: string) {
  return apiFetch<Product>(`/api/mobile/products/${id}`);
}

export async function updateProduct(id: string, updates: Partial<Product>) {
  return apiFetch<{ product: Product }>(`/api/mobile/products/${id}`, {
    method: 'PUT',
    body: updates,
  });
}

// Dashboard Stats
export async function getDashboardStats() {
  return apiFetch<DashboardStats>(`/api/mobile/stats`);
}

// Promo Codes API
export async function getPromoCodes() {
  return apiFetch<{ promoCodes: PromoCode[]; stats: PromoStats }>(`/api/mobile/promo-codes`);
}

// Types
export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  total: number;
  status: string;
  payment_status: string;
  created_at: string;
  tracking_number?: string;
  shipping_carrier?: string;
  order_items?: any[];
  customers?: any;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  city: string;
  state: string;
  orders: number;
  totalSpent: number;
  status: 'active' | 'inactive' | 'new';
  created_at: string;
}

export interface CustomerStats {
  total: number;
  new: number;
  active: number;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  stock: number;
  cost: number;
  b2b_price: number;
  retail_price: number;
}

export interface ProductStats {
  total: number;
  lowStock: number;
  outOfStock: number;
}

export interface DashboardStats {
  ordersToday: number;
  revenueToday: number;
  pendingOrders: number;
}

export interface PromoCode {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  usageCount: number;
  maxUses: number | null;
  status: 'active' | 'expired' | 'disabled';
}

export interface PromoStats {
  active: number;
  totalUses: number;
  totalRevenue: number;
}
