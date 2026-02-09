// Types for the Supply Store

export interface SupplyStoreProduct {
  id: string
  sku: string
  product_name: string
  brand: string
  category: string
  description: string | null
  wholesale_price: number
  retail_price: number
  image_url: string | null
  source_url: string | null
  in_stock: boolean
  features: string[]
  specs: Record<string, string>
  business_types: ('gym' | 'medspa' | 'wellness')[]
  created_at: string
  updated_at: string
}

export type SupplyStoreBusinessType = 'gym' | 'medspa' | 'wellness'

export interface SupplyStoreBusinessTypeConfig {
  id: SupplyStoreBusinessType
  name: string
  description: string
  icon: 'dumbbell' | 'sparkles' | 'heart'
  categories: string[]
  accent: string
}

export const SUPPLY_STORE_BUSINESS_TYPES: Record<SupplyStoreBusinessType, SupplyStoreBusinessTypeConfig> = {
  gym: {
    id: 'gym',
    name: 'Gym Owners',
    description: 'Commercial gyms, boutique fitness studios, CrossFit boxes',
    icon: 'dumbbell',
    categories: ['Cardio Equipment', 'Strength Equipment', 'Recovery Equipment', 'Accessories & Consumables'],
    accent: 'hsl(220, 70%, 50%)',
  },
  medspa: {
    id: 'medspa',
    name: 'Med Spa Owners',
    description: 'Medical spas, aesthetic clinics, skincare centers',
    icon: 'sparkles',
    categories: ['Cold Plunge & Heat Therapy', 'Recovery Equipment', 'Supplements'],
    accent: 'hsl(340, 70%, 50%)',
  },
  wellness: {
    id: 'wellness',
    name: 'Wellness Centers',
    description: 'Recovery studios, cryotherapy centers, float spas',
    icon: 'heart',
    categories: ['Cold Plunge & Heat Therapy', 'Recovery Equipment', 'Accessories & Consumables', 'Supplements'],
    accent: 'hsl(160, 70%, 40%)',
  },
}

export const SUPPLY_STORE_CATEGORIES = [
  'Recovery Equipment',
  'Cold Plunge & Heat Therapy',
  'Cardio Equipment',
  'Strength Equipment',
  'Accessories & Consumables',
  'Supplements',
]

export interface SupplyStoreCartItem {
  product: SupplyStoreProduct
  quantity: number
}

export interface SupplyStoreOrder {
  id: string
  order_number: string
  user_id: string
  customer_email: string
  customer_name: string | null
  customer_company: string | null
  customer_phone: string | null
  shipping_address_line1: string | null
  shipping_address_line2: string | null
  shipping_city: string | null
  shipping_state: string | null
  shipping_postal_code: string | null
  shipping_country: string
  subtotal: number
  shipping_cost: number
  tax: number
  total: number
  status: 'pending' | 'processing' | 'paid' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
  stripe_checkout_session_id: string | null
  stripe_payment_intent_id: string | null
  tracking_number: string | null
  shipping_carrier: string | null
  shipped_at: string | null
  delivered_at: string | null
  customer_notes: string | null
  admin_notes: string | null
  created_at: string
  updated_at: string
}

export interface SupplyStoreOrderItem {
  id: string
  order_id: string
  product_id: string | null
  sku: string
  product_name: string
  brand: string | null
  category: string | null
  unit_price: number
  quantity: number
  total_price: number
  created_at: string
}

