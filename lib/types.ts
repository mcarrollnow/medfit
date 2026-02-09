// Order types
export interface Order {
  id: string
  order_number: string
  customer_id: string
  customer_name?: string
  customer_type?: string
  status: string
  subtotal: number
  discount_amount: number
  tax_amount: number
  shipping_amount: number
  total_amount: number
  payment_method?: string
  payment_status: string
  payment_date?: string
  notes?: string
  admin_notes?: string
  created_at: string
  updated_at: string
  assigned_wallet_id?: string
  expected_payment_amount?: number
  expected_payment_currency?: string
  transaction_hash?: string
  payment_initiated_at?: string
  payment_verified_at?: string
  payment_failed_reason?: string
  discount_code_id?: string
}

export interface CreateOrderRequest {
  items: Array<{
    product_id: string
    quantity: number
    unit_price: number
  }>
  shipping_address: {
    line1: string
    line2?: string
    city: string
    state: string
    zip: string
    country: string
  }
  customer_info: {
    first_name: string
    last_name: string
    email: string
    phone?: string
  }
  discount_code_id?: string
  discount_amount?: number
  payment_method: string
  notes?: string
}

export interface CreateOrderResponse {
  order: Order
  wallet?: {
    id: string
    address: string
    label: string
  }
}

export interface ShippingAddress {
  id: string
  customer_id: string
  label?: string
  address_line1: string
  address_line2?: string
  city: string
  state: string
  zip: string
  country: string
  is_default: boolean
  created_at: string
}

export type CustomerType = 'b2b' | 'retail'

export interface ValidateDiscountRequest {
  code: string
  orderAmount: number
}

export interface ValidateDiscountResponse {
  valid: boolean
  discount_amount: number
  discount_percentage?: number
  discount_code_id?: string
  message?: string
  error?: string
  discount?: {
    id: string
    code: string
    description?: string
    discount_type: 'percentage' | 'fixed' | 'set_price'
    discount_value: number
    free_shipping?: boolean
    valid_until?: string
    custom_product_prices?: Record<string, number>
  }
}
