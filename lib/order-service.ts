import { apiClient } from './api-client'
import type {
  CreateOrderRequest,
  CreateOrderResponse,
  ShippingAddress,
  CustomerType,
  ValidateDiscountRequest,
  ValidateDiscountResponse,
} from './types'

export class OrderService {
  /**
   * Create a new order - Backend will assign wallet automatically
   */
  async createOrder(data: CreateOrderRequest): Promise<CreateOrderResponse> {
    return apiClient.post<CreateOrderResponse>('/orders', data)
  }

  /**
   * Get assigned wallet for an order
   */
  async getAssignedWallet(orderNumber: string): Promise<{ wallet: { id: string; address: string; label: string } }> {
    return apiClient.get(`/orders/assigned-wallet?orderNumber=${orderNumber}`)
  }

  /**
   * Initiate payment - Updates payment_status to 'payment_processing'
   */
  async initiatePayment(
    orderId: string, 
    walletId: string, 
    currency: 'ETH' | 'USDC',
    exactAmount?: string,  // Exact crypto amount calculated on frontend
    ethPrice?: number      // ETH price used for calculation
  ): Promise<{
    success: boolean
    walletAddress: string
    amount: number
    currency: string
    orderId: string
    paymentUrl?: string
    ethAmount?: string
    weiAmount?: string
    ethPrice?: number
    usdcAmount?: number
  }> {
    return apiClient.post('/orders/initiate-payment', {
      orderId,
      walletId,
      currency,
      exactAmount,
      ethPrice
    })
  }

  /**
   * Get saved shipping addresses for current user
   */
  async getSavedAddresses(): Promise<ShippingAddress[]> {
    return apiClient.get<ShippingAddress[]>('/shipping-addresses')
  }

  /**
   * Save a new shipping address
   */
  async saveAddress(address: Omit<ShippingAddress, 'id' | 'customer_id' | 'created_at' | 'updated_at'>): Promise<ShippingAddress> {
    return apiClient.post<ShippingAddress>('/shipping-addresses', address)
  }

  /**
   * Get customer type (retail, retailvip, b2bvip)
   */
  async getCustomerType(): Promise<CustomerType> {
    return apiClient.get<CustomerType>('/customer-type')
  }

  /**
   * Validate discount code
   */
  async validateDiscount(data: ValidateDiscountRequest): Promise<ValidateDiscountResponse> {
    return apiClient.post<ValidateDiscountResponse>('/validate-discount', data)
  }

  /**
   * Get customer profile information
   */
  async getCustomerProfile(): Promise<{
    first_name: string
    last_name: string
    email: string
    phone: string
    customer_type: string
    company_name: string
  }> {
    return apiClient.get('/customer-profile')
  }

  /**
   * Get order details
   */
  async getOrder(orderId: string): Promise<{
    id: string
    order_number: string
    assigned_wallet_id: string
    payment_status: string
    expected_payment_amount: number
    expected_payment_currency: string
  }> {
    // Use the same API as getOrderDetails but with limited fields
    const fullData = await this.getOrderDetails(orderId)
    return {
      id: fullData.id,
      order_number: fullData.order_number,
      assigned_wallet_id: '', // Not available in this API, will get from getAssignedWallet
      payment_status: fullData.payment_status,
      expected_payment_amount: fullData.expected_payment_amount,
      expected_payment_currency: fullData.expected_payment_currency
    }
  }

  /**
   * Get complete order details including items, shipping, customer info
   */
  async getOrderDetails(orderId: string): Promise<{
    id: string
    order_number: string
    subtotal: number
    shipping_amount: number
    total_amount: number
    discount_amount: number
    payment_status: string
    payment_method: string
    expected_payment_amount: number
    expected_payment_currency: string
    transaction_hash: string
    customer_name: string
    shipping_address_line1: string
    shipping_city: string
    shipping_state: string
    shipping_zip: string
    shipping_country: string
    discount_details?: {
      code: string
      amount: number
      description: string
    }
    items: Array<{
      id: string
      product_name: string
      quantity: number
      unit_price: number
      total_price: number
    }>
    transaction_details?: {
      tx_hash: string
      amount: string
      currency: string
      from_address: string
      to_address: string
      etherscan_url: string
    }
  }> {
    return apiClient.get(`/order-details?id=${orderId}`)
  }
}

export const orderService = new OrderService()
