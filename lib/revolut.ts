/**
 * Revolut Business API Client
 * Documentation: https://developer.revolut.com/docs/business/
 */

export interface RevolutAccount {
  id: string
  name: string
  balance: number
  currency: string
  state: 'active' | 'inactive'
  public: boolean
  created_at: string
  updated_at: string
}

export interface RevolutCounterparty {
  id: string
  name: string
  phone?: string
  profile_type: 'personal' | 'business'
  country?: string
  state: 'created' | 'deleted'
  created_at: string
  updated_at: string
  accounts?: RevolutCounterpartyAccount[]
}

export interface RevolutCounterpartyAccount {
  id: string
  name?: string
  bank_country?: string
  currency: string
  type: 'revolut' | 'external'
  account_no?: string
  iban?: string
  sort_code?: string
  routing_number?: string
  bic?: string
  recipient_charges?: 'no' | 'expected'
}

export interface RevolutTransaction {
  id: string
  type: 'atm' | 'card_payment' | 'card_refund' | 'card_chargeback' | 'card_credit' | 
        'exchange' | 'transfer' | 'loan' | 'fee' | 'refund' | 'topup' | 'topup_return' |
        'tax' | 'tax_refund'
  request_id?: string
  state: 'created' | 'pending' | 'completed' | 'declined' | 'failed' | 'reverted'
  reason_code?: string
  created_at: string
  updated_at: string
  completed_at?: string
  reference?: string
  legs: RevolutTransactionLeg[]
  card?: {
    card_number: string
    first_name: string
    last_name: string
    phone: string
  }
  merchant?: {
    name: string
    city: string
    category_code: string
    country: string
  }
  related_transaction_id?: string
}

export interface RevolutTransactionLeg {
  leg_id: string
  account_id: string
  counterparty?: {
    id?: string
    account_id?: string
    account_type?: string
  }
  amount: number
  currency: string
  bill_amount?: number
  bill_currency?: string
  description?: string
  balance?: number
}

export interface RevolutTransferRequest {
  request_id: string
  account_id: string
  receiver: {
    counterparty_id: string
    account_id?: string
    card_id?: string
  }
  amount: number
  currency: string
  reference?: string
  charge_bearer?: 'shared' | 'debtor'
  transfer_reason_code?: string
  exchange_reason_code?: string
}

export interface RevolutTransferResponse {
  id: string
  state: 'created' | 'pending' | 'completed' | 'declined' | 'failed' | 'reverted'
  created_at: string
  completed_at?: string
}

export interface RevolutExchangeRequest {
  request_id: string
  from: {
    account_id: string
    currency: string
    amount: number
  }
  to: {
    account_id: string
    currency: string
  }
  reference?: string
}

export interface RevolutExchangeResponse {
  id: string
  state: 'created' | 'pending' | 'completed' | 'declined' | 'failed' | 'reverted'
  created_at: string
  completed_at?: string
}

export interface CreateCounterpartyRequest {
  company_name?: string
  individual_name?: {
    first_name: string
    last_name: string
  }
  profile_type: 'personal' | 'business'
  name?: string
  bank_country: string
  currency: string
  phone?: string
  email?: string
  address?: {
    street_line1: string
    street_line2?: string
    city: string
    region?: string
    postcode: string
    country: string
  }
  // For Revolut accounts
  revolut_account_id?: string
  // For external bank accounts
  account_no?: string
  iban?: string
  sort_code?: string
  routing_number?: string
  bic?: string
}

// Card counterparty for sending to debit/credit cards
export interface CreateCardCounterpartyRequest {
  individual_name: {
    first_name: string
    last_name: string
  }
  card_number: string
}

export interface CardPaymentRequest {
  request_id: string
  account_id: string
  receiver: {
    counterparty_id: string
    card_id: string
  }
  amount: number
  currency: string
  reference?: string
}

// ==================== TEAM MEMBERS ====================

export interface TeamMember {
  id: string
  email: string
  first_name?: string
  last_name?: string
  phone?: string
  role: 'owner' | 'admin' | 'member'
  state: 'active' | 'invited' | 'deleted'
  created_at: string
  updated_at: string
}

// ==================== CARDS ====================

export interface RevolutCard {
  id: string
  last_four: string
  expiry: string
  state: 'active' | 'inactive' | 'frozen' | 'terminated'
  virtual: boolean
  label?: string
  holder_id: string
  holder?: {
    id: string
    first_name: string
    last_name: string
  }
  accounts?: {
    id: string
    currency: string
  }[]
  spending_limits?: SpendingLimit[]
  created_at: string
  updated_at: string
}

export interface SpendingLimit {
  amount: number
  currency: string
  period: 'day' | 'week' | 'month' | 'quarter' | 'year' | 'all_time' | 'single_transaction'
}

export interface CreateCardRequest {
  request_id: string
  virtual: boolean
  holder_id: string
  label?: string
  accounts?: string[]
  categories?: string[]
  single_use?: boolean
  spending_limits?: SpendingLimit[]
}

export interface UpdateCardRequest {
  label?: string
  categories?: string[]
  spending_limits?: SpendingLimit[]
  accounts?: string[]
}

class RevolutClient {
  private baseUrl: string
  private accessToken: string | null = null
  private tokenExpiresAt: number = 0

  constructor() {
    // Use sandbox URL for development, production URL for live
    const isSandbox = process.env.REVOLUT_ENVIRONMENT !== 'production'
    this.baseUrl = isSandbox 
      ? 'https://sandbox-b2b.revolut.com/api/1.0'
      : 'https://b2b.revolut.com/api/1.0'
  }

  private async getAccessToken(): Promise<string> {
    // If we have a cached token that's still valid (with 5 min buffer), use it
    if (this.accessToken && Date.now() < this.tokenExpiresAt - 300000) {
      return this.accessToken
    }

    // If using API key directly (simpler approach - doesn't expire as quickly)
    const apiKey = process.env.REVOLUT_API_KEY
    if (apiKey) {
      this.accessToken = apiKey
      // API keys from Revolut typically last longer, set a generous expiry
      this.tokenExpiresAt = Date.now() + 3600000 // 1 hour cache
      return apiKey
    }

    // If using OAuth flow with refresh token - auto-refresh when expired
    const refreshToken = process.env.REVOLUT_REFRESH_TOKEN
    const clientId = process.env.REVOLUT_CLIENT_ID
    const clientAssertionType = 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer'
    
    if (!refreshToken || !clientId) {
      throw new Error('Revolut credentials not configured. Set REVOLUT_API_KEY or REVOLUT_REFRESH_TOKEN and REVOLUT_CLIENT_ID')
    }

    // For production, you'd generate a JWT client assertion here
    // This is a simplified version - in production use proper JWT signing
    const tokenUrl = process.env.REVOLUT_ENVIRONMENT === 'production'
      ? 'https://b2b.revolut.com/api/1.0/auth/token'
      : 'https://sandbox-b2b.revolut.com/api/1.0/auth/token'

    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: clientId,
        client_assertion_type: clientAssertionType,
        // client_assertion would be a signed JWT in production
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to get access token: ${error}`)
    }

    const data = await response.json()
    this.accessToken = data.access_token
    // Token expires in ~40 minutes, cache it
    this.tokenExpiresAt = Date.now() + (data.expires_in ? data.expires_in * 1000 : 2400000)
    return data.access_token
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = await this.getAccessToken()
    
    const url = `${this.baseUrl}${endpoint}`
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    if (!response.ok) {
      const error = await response.text()
      console.error(`[Revolut API] Error ${response.status}:`, error)
      throw new Error(`Revolut API Error: ${response.status} - ${error}`)
    }

    // Handle empty responses
    const text = await response.text()
    if (!text) {
      return {} as T
    }
    
    return JSON.parse(text)
  }

  // ==================== ACCOUNTS ====================

  async getAccounts(): Promise<RevolutAccount[]> {
    return this.request<RevolutAccount[]>('/accounts')
  }

  async getAccount(accountId: string): Promise<RevolutAccount> {
    return this.request<RevolutAccount>(`/accounts/${accountId}`)
  }

  // ==================== COUNTERPARTIES ====================

  async getCounterparties(): Promise<RevolutCounterparty[]> {
    return this.request<RevolutCounterparty[]>('/counterparties')
  }

  async getCounterparty(counterpartyId: string): Promise<RevolutCounterparty> {
    return this.request<RevolutCounterparty>(`/counterparties/${counterpartyId}`)
  }

  async createCounterparty(data: CreateCounterpartyRequest): Promise<RevolutCounterparty> {
    return this.request<RevolutCounterparty>('/counterparty', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async deleteCounterparty(counterpartyId: string): Promise<void> {
    await this.request<void>(`/counterparty/${counterpartyId}`, {
      method: 'DELETE',
    })
  }

  // Create a counterparty for card payments
  async createCardCounterparty(data: CreateCardCounterpartyRequest): Promise<RevolutCounterparty> {
    return this.request<RevolutCounterparty>('/counterparty', {
      method: 'POST',
      body: JSON.stringify({
        individual_name: data.individual_name,
        card: {
          card_number: data.card_number,
        },
      }),
    })
  }

  // Send payment to a card
  async createCardPayment(data: CardPaymentRequest): Promise<RevolutTransferResponse> {
    return this.request<RevolutTransferResponse>('/pay', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // ==================== TRANSACTIONS ====================

  async getTransactions(params?: {
    from?: string // ISO 8601 date
    to?: string // ISO 8601 date
    counterparty?: string
    count?: number
    type?: string
  }): Promise<RevolutTransaction[]> {
    const searchParams = new URLSearchParams()
    if (params?.from) searchParams.set('from', params.from)
    if (params?.to) searchParams.set('to', params.to)
    if (params?.counterparty) searchParams.set('counterparty', params.counterparty)
    if (params?.count) searchParams.set('count', params.count.toString())
    if (params?.type) searchParams.set('type', params.type)

    const query = searchParams.toString()
    return this.request<RevolutTransaction[]>(`/transactions${query ? `?${query}` : ''}`)
  }

  async getTransaction(transactionId: string): Promise<RevolutTransaction> {
    return this.request<RevolutTransaction>(`/transaction/${transactionId}`)
  }

  // ==================== TRANSFERS ====================

  async createTransfer(data: RevolutTransferRequest): Promise<RevolutTransferResponse> {
    return this.request<RevolutTransferResponse>('/pay', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // ==================== EXCHANGES ====================

  async createExchange(data: RevolutExchangeRequest): Promise<RevolutExchangeResponse> {
    return this.request<RevolutExchangeResponse>('/exchange', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getExchangeRate(from: string, to: string, amount?: number): Promise<{
    from: { amount: number; currency: string }
    to: { amount: number; currency: string }
    rate: number
    fee: { amount: number; currency: string }
    rate_date: string
  }> {
    const params = new URLSearchParams({
      from,
      to,
    })
    if (amount) params.set('amount', amount.toString())

    return this.request(`/rate?${params.toString()}`)
  }

  // ==================== TRANSFER REASONS ====================

  async getTransferReasons(
    counterpartyCountry?: string,
    currency?: string
  ): Promise<{ reason: string; code: string }[]> {
    const params = new URLSearchParams()
    if (counterpartyCountry) params.set('counterparty_country', counterpartyCountry)
    if (currency) params.set('currency', currency)

    const query = params.toString()
    return this.request(`/transfer-reasons${query ? `?${query}` : ''}`)
  }

  async getExchangeReasons(): Promise<{ reason: string; code: string }[]> {
    return this.request('/exchange-reasons')
  }

  // ==================== WEBHOOKS ====================

  async getWebhooks(): Promise<{ url: string; events: string[] }[]> {
    return this.request('/webhooks')
  }

  async createWebhook(url: string, events?: string[]): Promise<void> {
    await this.request('/webhook', {
      method: 'POST',
      body: JSON.stringify({ url, events }),
    })
  }

  async deleteWebhook(url: string): Promise<void> {
    await this.request('/webhook', {
      method: 'DELETE',
      body: JSON.stringify({ url }),
    })
  }

  // ==================== TEAM MEMBERS ====================

  async getTeamMembers(): Promise<TeamMember[]> {
    return this.request<TeamMember[]>('/team-members')
  }

  async getTeamMember(memberId: string): Promise<TeamMember> {
    return this.request<TeamMember>(`/team-members/${memberId}`)
  }

  // ==================== CARDS ====================

  async getCards(): Promise<RevolutCard[]> {
    return this.request<RevolutCard[]>('/cards')
  }

  async getCard(cardId: string): Promise<RevolutCard> {
    return this.request<RevolutCard>(`/cards/${cardId}`)
  }

  async createCard(data: CreateCardRequest): Promise<RevolutCard> {
    return this.request<RevolutCard>('/cards', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateCard(cardId: string, data: UpdateCardRequest): Promise<RevolutCard> {
    return this.request<RevolutCard>(`/cards/${cardId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  async freezeCard(cardId: string): Promise<RevolutCard> {
    return this.request<RevolutCard>(`/cards/${cardId}/freeze`, {
      method: 'POST',
    })
  }

  async unfreezeCard(cardId: string): Promise<RevolutCard> {
    return this.request<RevolutCard>(`/cards/${cardId}/unfreeze`, {
      method: 'POST',
    })
  }

  async terminateCard(cardId: string): Promise<void> {
    await this.request<void>(`/cards/${cardId}`, {
      method: 'DELETE',
    })
  }

  async getCardSensitiveDetails(cardId: string): Promise<{
    pan: string
    cvv: string
  }> {
    return this.request(`/cards/${cardId}/sensitive-details`)
  }
}

// Export singleton instance
export const revolut = new RevolutClient()

// ==================== MERCHANT API ====================
// For receiving card payments

export interface MerchantOrder {
  id: string
  public_id: string
  type: 'payment' | 'refund'
  state: 'pending' | 'processing' | 'authorised' | 'completed' | 'cancelled' | 'failed'
  created_at: string
  updated_at: string
  completed_at?: string
  description?: string
  capture_mode: 'automatic' | 'manual'
  cancel_authorised_after?: number
  merchant_order_ext_ref?: string
  customer_email?: string
  settlement_currency?: string
  order_amount: {
    value: number
    currency: string
  }
  order_outstanding_amount?: {
    value: number
    currency: string
  }
  refunded_amount?: {
    value: number
    currency: string
  }
  payments?: MerchantPayment[]
  checkout_url?: string
}

export interface MerchantPayment {
  id: string
  state: 'pending' | 'processing' | 'authorised' | 'captured' | 'completed' | 'cancelled' | 'failed'
  payment_method?: {
    type: string
    card?: {
      card_brand: string
      card_last_four: string
      cardholder_name: string
    }
  }
  amount: {
    value: number
    currency: string
  }
  created_at: string
  updated_at: string
}

export interface CreateOrderRequest {
  amount: number
  currency: string
  description?: string
  merchant_order_ext_ref?: string
  customer_email?: string
  capture_mode?: 'automatic' | 'manual'
  settlement_currency?: string
  enforce_challenge?: 'no_preference' | 'challenge' | 'no_challenge'
}

export interface PaymentLinkRequest {
  amount: number
  currency: string
  description?: string
  reference?: string
  customer_email?: string
  redirect_url?: string
  expiry_period?: string // e.g., "P7D" for 7 days
}

class RevolutMerchantClient {
  private baseUrl: string

  constructor() {
    const isSandbox = process.env.REVOLUT_ENVIRONMENT !== 'production'
    this.baseUrl = isSandbox
      ? 'https://sandbox-merchant.revolut.com/api/1.0'
      : 'https://merchant.revolut.com/api/1.0'
  }

  private async getApiKey(): Promise<string> {
    const apiKey = process.env.REVOLUT_MERCHANT_API_KEY
    if (!apiKey) {
      throw new Error('REVOLUT_MERCHANT_API_KEY not configured')
    }
    return apiKey
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const apiKey = await this.getApiKey()

    const url = `${this.baseUrl}${endpoint}`
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Revolut-Api-Version': '2024-09-01',
        ...options.headers,
      },
    })

    if (!response.ok) {
      const error = await response.text()
      console.error(`[Revolut Merchant API] Error ${response.status}:`, error)
      throw new Error(`Revolut Merchant API Error: ${response.status} - ${error}`)
    }

    const text = await response.text()
    if (!text) {
      return {} as T
    }

    return JSON.parse(text)
  }

  // Create a new order for payment
  async createOrder(data: CreateOrderRequest): Promise<MerchantOrder> {
    return this.request<MerchantOrder>('/orders', {
      method: 'POST',
      body: JSON.stringify({
        amount: Math.round(data.amount * 100), // Convert to minor units (cents)
        currency: data.currency,
        description: data.description,
        merchant_order_ext_ref: data.merchant_order_ext_ref,
        customer_email: data.customer_email,
        capture_mode: data.capture_mode || 'automatic',
        settlement_currency: data.settlement_currency,
        enforce_challenge: data.enforce_challenge,
      }),
    })
  }

  // Get all orders
  async getOrders(params?: {
    created_before?: string
    limit?: number
    merchant_order_ext_ref?: string
    state?: string
    email?: string
  }): Promise<MerchantOrder[]> {
    const searchParams = new URLSearchParams()
    if (params?.created_before) searchParams.set('created_before', params.created_before)
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    if (params?.merchant_order_ext_ref) searchParams.set('merchant_order_ext_ref', params.merchant_order_ext_ref)
    if (params?.state) searchParams.set('state', params.state)
    if (params?.email) searchParams.set('email', params.email)

    const query = searchParams.toString()
    return this.request<MerchantOrder[]>(`/orders${query ? `?${query}` : ''}`)
  }

  // Get a specific order
  async getOrder(orderId: string): Promise<MerchantOrder> {
    return this.request<MerchantOrder>(`/orders/${orderId}`)
  }

  // Capture an authorized payment
  async captureOrder(orderId: string, amount?: number): Promise<MerchantOrder> {
    const body = amount ? { amount: Math.round(amount * 100) } : {}
    return this.request<MerchantOrder>(`/orders/${orderId}/capture`, {
      method: 'POST',
      body: JSON.stringify(body),
    })
  }

  // Cancel/refund an order
  async cancelOrder(orderId: string): Promise<MerchantOrder> {
    return this.request<MerchantOrder>(`/orders/${orderId}/cancel`, {
      method: 'POST',
    })
  }

  // Refund an order
  async refundOrder(orderId: string, amount: number, description?: string, merchant_order_ext_ref?: string): Promise<MerchantOrder> {
    return this.request<MerchantOrder>(`/orders/${orderId}/refund`, {
      method: 'POST',
      body: JSON.stringify({
        amount: Math.round(amount * 100),
        description,
        merchant_order_ext_ref,
      }),
    })
  }
}

export const revolutMerchant = new RevolutMerchantClient()

// Export types
export type {
  RevolutClient,
}

