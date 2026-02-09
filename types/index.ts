export interface User {
  id: string;
  authId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'customer' | 'rep';
  profilePictureUrl?: string;
  isDeveloper?: boolean;
}

export interface ProductRating {
  label: string;
  value: number;
}

export interface Product {
  id: string;
  barcode: string;
  name: string;
  base_name: string;
  variant: string;
  category_id: string;
  category_name?: string;
  image_url: string;
  description?: string;
  cart_product_detail?: string;
  cart_image?: string;
  initial_stock: number;
  current_stock: number;
  restock_level: number;
  manual_adjustment: number;
  cost_price: number;
  b2b_price: number;
  retail_price: number;
  display_price?: number;
  is_active: boolean;
  created_at: string;
  color?: string;
  updated_at: string;
  last_stock_update?: string;
  ratings?: ProductRating[];
}

export interface Customer {
  id: string;
  user_id: string;
  company_name?: string;
  customer_type: 'retail' | 'b2b';
  phone?: string;
  shipping_address_line1?: string;
  shipping_address_line2?: string;
  shipping_city?: string;
  shipping_state?: string;
  shipping_zip?: string;
  shipping_country?: string;
  billing_address_line1?: string;
  billing_address_line2?: string;
  billing_city?: string;
  billing_state?: string;
  billing_zip?: string;
  billing_country?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  first_name?: string;
  last_name?: string;
  email?: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_id: string;
  customer_type: 'retail' | 'b2b';
  status: 'pending' | 'payment_requested' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  subtotal: number;
  discount_amount: number;
  tax_amount: number;
  shipping_amount: number;
  total_amount: number;
  payment_method?: string;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  payment_date?: string;
  notes?: string;
  admin_notes?: string;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
  tracking?: Tracking;
  customer_name?: string;
  customer_email?: string;
  item_count?: number;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_barcode: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
}

export interface Tracking {
  id: string;
  order_id: string;
  carrier?: string;
  tracking_number?: string;
  tracking_url?: string;
  status: 'pending' | 'in_transit' | 'delivered' | 'exception';
  shipped_date?: string;
  estimated_delivery?: string;
  delivered_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  events?: TrackingEvent[];
}

export interface TrackingEvent {
  id: string;
  tracking_id: string;
  event_date: string;
  status: string;
  location?: string;
  description?: string;
  created_at: string;
}

export interface DiscountCode {
  id: string;
  code: string;
  description?: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_order_amount: number;
  max_uses?: number;
  current_uses: number;
  customer_type?: 'retail' | 'b2b' | 'all';
  valid_from?: string;
  valid_until?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  order_id?: string;
  customer_id: string;
  issue_date: string;
  due_date?: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  subtotal: number;
  tax_amount: number;
  total_amount: number;
  paid_amount: number;
  balance_due: number;
  pdf_url?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  color?: string;
}

export interface WalletTransaction {
  id: string;
  wallet_id: string;
  transaction_hash: string;
  from_address: string;
  to_address: string;
  amount: string;
  status: 'pending' | 'confirmed' | 'failed';
  created_at: string;
  updated_at: string;
}

// Additional types from shop3
export type RewardTier = "Free" | "Bronze" | "Silver" | "Gold" | "Platinum" | "Diamond"

export type TierInfo = {
  name: RewardTier
  minSpend: number
  maxSpend: number | null
  pointsPerDollar: number
  color: string
  benefits: string[]
}

export type UserRewards = {
  userId: string
  totalSpent: number
  currentTier: RewardTier
  pointsBalance: number
  lifetimePoints: number
  nextTier: RewardTier | null
  amountToNextTier: number
}