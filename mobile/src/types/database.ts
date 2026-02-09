// Database types - mirrors the main dashboard types
export interface Database {
  public: {
    Tables: {
      orders: {
        Row: Order;
        Insert: Omit<Order, 'id' | 'created_at'>;
        Update: Partial<Order>;
      };
      products: {
        Row: Product;
        Insert: Omit<Product, 'id' | 'created_at'>;
        Update: Partial<Product>;
      };
      users: {
        Row: User;
        Insert: Omit<User, 'id' | 'created_at'>;
        Update: Partial<User>;
      };
    };
  };
}

export interface Order {
  id: string;
  created_at: string;
  customer_id: string;
  customer_name: string;
  customer_email: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  total: number;
  subtotal: number;
  shipping_address: string;
  tracking_number?: string;
  shipping_carrier?: string;
  notes?: string;
}

export type OrderStatus = 
  | 'new' 
  | 'pending_payment' 
  | 'payment_processing' 
  | 'paid' 
  | 'shipped' 
  | 'delivered'
  | 'cancelled';

export type PaymentStatus = 
  | 'pending' 
  | 'awaiting_payment' 
  | 'processing' 
  | 'paid' 
  | 'failed' 
  | 'refunded';

export interface Product {
  id: string;
  created_at: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  category: string;
  description?: string;
  image_url?: string;
}

export interface User {
  id: string;
  created_at: string;
  email: string;
  full_name: string;
  role: 'admin' | 'rep' | 'customer' | 'supplier';
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total: number;
}
