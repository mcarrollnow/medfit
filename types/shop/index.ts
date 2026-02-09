// Shop-specific types
export interface Product {
  id: string;
  barcode: string;
  name: string;
  base_name: string;
  variant: string;
  description?: string;
  retail_price: string;
  wholesale_price?: string;
  b2b_price?: string;
  is_active: boolean;
  in_stock: boolean;
  current_stock?: number;
  low_stock_threshold?: number;
  tags?: string[];
  category?: string;
  sub_category?: string;
  benefits?: string[];
  color: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export type CartItem = Product & {
  quantity: number
}
