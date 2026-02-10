// Authorize.net API Integration
// Using Accept Hosted for PCI SAQ A compliance

import crypto from 'crypto'
import { siteConfig } from '@/lib/site-config'

// Helper to ensure URL starts with https://
function ensureHttpsUrl(url: string | null | undefined): string {
  console.log('[Authorize.net] ensureHttpsUrl input:', url)
  
  // Handle null/undefined/empty
  if (!url || url.trim() === '') {
    console.log('[Authorize.net] URL is empty, using fallback')
    return siteConfig.appUrl
  }
  
  const trimmedUrl = url.trim()
  
  if (trimmedUrl.startsWith('https://')) {
    return trimmedUrl
  }
  if (trimmedUrl.startsWith('http://')) {
    // Upgrade to https
    return trimmedUrl.replace('http://', 'https://')
  }
  // URL doesn't have protocol, add https://
  return `https://${trimmedUrl}`
}

export interface AuthorizeNetConfig {
  apiLoginId: string
  transactionKey: string
  signatureKey: string
  environment: 'sandbox' | 'production'
}

export interface LineItem {
  itemId: string
  name: string
  description?: string
  quantity: number
  unitPrice: number
}

export interface HostedPaymentPageRequest {
  amount: number
  orderId: string
  orderNumber: string
  customerEmail?: string
  customerId?: string
  returnUrl: string
  cancelUrl: string
  description?: string
  lineItems?: LineItem[]
  discount?: number // Positive number representing discount amount
}

export interface HostedPaymentPageResponse {
  token: string
  formUrl: string
}

export interface TransactionResponse {
  transId: string
  responseCode: string
  messageCode: string
  description: string
  authCode: string
  avsResultCode: string
  cvvResultCode: string
  accountNumber: string // Last 4 digits
  accountType: string // Visa, Mastercard, etc.
  amount: number
  order?: {
    invoiceNumber?: string
    description?: string
  }
}

export interface WebhookPayload {
  notificationId: string
  eventType: string
  eventDate: string
  webhookId: string
  payload: {
    responseCode: number
    authCode: string
    avsResponse: string
    authAmount: number
    entityName: string
    id: string // Transaction ID
  }
}

// Get Authorize.net config from environment
export function getAuthorizeNetConfig(): AuthorizeNetConfig | null {
  const apiLoginId = process.env.AUTHORIZE_NET_API_LOGIN_ID
  const transactionKey = process.env.AUTHORIZE_NET_TRANSACTION_KEY
  const signatureKey = process.env.AUTHORIZE_NET_SIGNATURE_KEY
  const environment = (process.env.AUTHORIZE_NET_ENVIRONMENT || 'sandbox') as 'sandbox' | 'production'

  if (!apiLoginId || !transactionKey) {
    return null
  }

  return { apiLoginId, transactionKey, signatureKey: signatureKey || '', environment }
}

// Get API endpoint based on environment
function getApiEndpoint(environment: 'sandbox' | 'production'): string {
  return environment === 'production'
    ? 'https://api.authorize.net/xml/v1/request.api'
    : 'https://apitest.authorize.net/xml/v1/request.api'
}

// Get hosted form URL based on environment
function getHostedFormUrl(environment: 'sandbox' | 'production'): string {
  return environment === 'production'
    ? 'https://accept.authorize.net/payment/payment'
    : 'https://test.authorize.net/payment/payment'
}

// Create a hosted payment page token
export async function createHostedPaymentPage(
  config: AuthorizeNetConfig,
  request: HostedPaymentPageRequest
): Promise<{ success: boolean; data?: HostedPaymentPageResponse; error?: string }> {
  try {
    const endpoint = getApiEndpoint(config.environment)
    const formUrl = getHostedFormUrl(config.environment)

    // Validate URLs - must start with https://
    const returnUrl = ensureHttpsUrl(request.returnUrl)
    const cancelUrl = ensureHttpsUrl(request.cancelUrl)

    console.log('[Authorize.net] Input URLs:', { 
      inputReturnUrl: request.returnUrl, 
      inputCancelUrl: request.cancelUrl 
    })
    console.log('[Authorize.net] Validated URLs:', { returnUrl, cancelUrl })
    
    // Extra validation check
    if (!returnUrl.startsWith('https://')) {
      console.error('[Authorize.net] CRITICAL: returnUrl still does not start with https://', returnUrl)
      return { success: false, error: `Invalid return URL: ${returnUrl}` }
    }

    const requestBody = {
      getHostedPaymentPageRequest: {
        merchantAuthentication: {
          name: config.apiLoginId,
          transactionKey: config.transactionKey,
        },
        transactionRequest: {
          transactionType: 'authCaptureTransaction',
          amount: request.amount.toFixed(2),
          order: {
            invoiceNumber: request.orderNumber,
            description: request.description || `Order ${request.orderNumber}`,
          },
          // Add line items if provided (up to 30 items supported, positive prices only)
          lineItems: request.lineItems && request.lineItems.length > 0 ? {
            lineItem: request.lineItems
              .filter(item => item.unitPrice > 0) // Only positive prices allowed
              .slice(0, 30)
              .map((item, idx) => ({
                itemId: item.itemId || String(idx + 1),
                name: item.name.substring(0, 31), // Max 31 chars
                description: (item.description || '').substring(0, 255), // Max 255 chars
                quantity: String(item.quantity),
                unitPrice: item.unitPrice.toFixed(2),
              }))
          } : undefined,
          customer: request.customerId ? {
            id: request.customerId,
            email: request.customerEmail,
          } : undefined,
        },
        hostedPaymentSettings: {
          setting: [
            {
              settingName: 'hostedPaymentReturnOptions',
              settingValue: JSON.stringify({
                showReceipt: true,
                url: returnUrl,
                urlText: 'Return to Invoice',
                cancelUrl: cancelUrl,
                cancelUrlText: 'Cancel',
              }),
            },
            {
              settingName: 'hostedPaymentButtonOptions',
              settingValue: JSON.stringify({
                text: `Pay $${request.amount.toFixed(2)}`,
              }),
            },
            {
              settingName: 'hostedPaymentStyleOptions',
              settingValue: JSON.stringify({
                bgColor: '#0a0a0a',
              }),
            },
            {
              settingName: 'hostedPaymentOrderOptions',
              settingValue: JSON.stringify({
                show: true,
                merchantName: 'Medfit 90',
              }),
            },
            {
              settingName: 'hostedPaymentBillingAddressOptions',
              settingValue: JSON.stringify({
                show: true,
                required: false,
              }),
            },
            {
              settingName: 'hostedPaymentShippingAddressOptions',
              settingValue: JSON.stringify({
                show: false,
                required: false,
              }),
            },
          ],
        },
      },
    }

    console.log('[Authorize.net] Sending request to:', endpoint)
    console.log('[Authorize.net] Environment:', config.environment)
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })

    const data = await response.json()
    
    // Log only result code, not full response (PCI compliant)
    console.log('[Authorize.net] API Response:', { resultCode: data.messages?.resultCode })

    if (data.messages?.resultCode === 'Ok' && data.token) {
      // URL encode the token to handle special characters like +
      const encodedToken = encodeURIComponent(data.token)
      const finalUrl = `${formUrl}?token=${encodedToken}`
      console.log('[Authorize.net] Success! Form URL:', finalUrl)
      return {
        success: true,
        data: {
          token: data.token,
          formUrl: finalUrl,
        },
      }
    }

    const errorMessage = data.messages?.message?.[0]?.text || 'Failed to create hosted payment page'
    console.error('[Authorize.net] API Error:', errorMessage)
    return { success: false, error: errorMessage }
  } catch (error: any) {
    console.error('[Authorize.net] Error creating hosted payment page:', error)
    return { success: false, error: error.message }
  }
}

// Get transaction details
export async function getTransactionDetails(
  config: AuthorizeNetConfig,
  transactionId: string
): Promise<{ success: boolean; data?: TransactionResponse; error?: string }> {
  try {
    const endpoint = getApiEndpoint(config.environment)

    const requestBody = {
      getTransactionDetailsRequest: {
        merchantAuthentication: {
          name: config.apiLoginId,
          transactionKey: config.transactionKey,
        },
        transId: transactionId,
      },
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })

    const data = await response.json()

    if (data.messages?.resultCode === 'Ok' && data.transaction) {
      const tx = data.transaction
      return {
        success: true,
        data: {
          transId: tx.transId,
          responseCode: tx.responseCode,
          messageCode: tx.messages?.message?.[0]?.code || '',
          description: tx.messages?.message?.[0]?.description || '',
          authCode: tx.authCode || '',
          avsResultCode: tx.AVSResponse || '',
          cvvResultCode: tx.cardCodeResponse || '',
          accountNumber: tx.payment?.creditCard?.cardNumber || '',
          accountType: tx.payment?.creditCard?.cardType || '',
          amount: parseFloat(tx.authAmount) || 0,
          // Include order info so we can match by invoice number (our order_number)
          order: tx.order ? {
            invoiceNumber: tx.order.invoiceNumber || undefined,
            description: tx.order.description || undefined,
          } : undefined,
        },
      }
    }

    const errorMessage = data.messages?.message?.[0]?.text || 'Failed to get transaction details'
    return { success: false, error: errorMessage }
  } catch (error: any) {
    console.error('[Authorize.net] Error getting transaction details:', error)
    return { success: false, error: error.message }
  }
}

// Refund a transaction
export async function refundTransaction(
  config: AuthorizeNetConfig,
  transactionId: string,
  amount: number,
  lastFourDigits: string
): Promise<{ success: boolean; refundTransId?: string; error?: string }> {
  try {
    const endpoint = getApiEndpoint(config.environment)

    const requestBody = {
      createTransactionRequest: {
        merchantAuthentication: {
          name: config.apiLoginId,
          transactionKey: config.transactionKey,
        },
        transactionRequest: {
          transactionType: 'refundTransaction',
          amount: amount.toFixed(2),
          payment: {
            creditCard: {
              cardNumber: lastFourDigits,
              expirationDate: 'XXXX',
            },
          },
          refTransId: transactionId,
        },
      },
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })

    const data = await response.json()

    if (data.messages?.resultCode === 'Ok' && data.transactionResponse?.transId) {
      return {
        success: true,
        refundTransId: data.transactionResponse.transId,
      }
    }

    const errorMessage = 
      data.transactionResponse?.errors?.error?.[0]?.errorText ||
      data.messages?.message?.[0]?.text || 
      'Failed to process refund'
    return { success: false, error: errorMessage }
  } catch (error: any) {
    console.error('[Authorize.net] Error processing refund:', error)
    return { success: false, error: error.message }
  }
}

// Verify webhook signature
export function verifyWebhookSignature(
  signatureKey: string,
  payload: string,
  signature: string
): boolean {
  if (!signatureKey) return false
  
  const hash = crypto
    .createHmac('sha512', signatureKey)
    .update(payload)
    .digest('hex')
    .toUpperCase()
  
  return hash === signature.toUpperCase()
}

// Parse webhook event type to status
export function getStatusFromEventType(eventType: string): string {
  const eventMap: Record<string, string> = {
    'net.authorize.payment.authcapture.created': 'succeeded',
    'net.authorize.payment.authorization.created': 'authorized',
    'net.authorize.payment.capture.created': 'captured',
    'net.authorize.payment.refund.created': 'refunded',
    'net.authorize.payment.void.created': 'voided',
    'net.authorize.payment.fraud.held': 'fraud_held',
    'net.authorize.payment.fraud.approved': 'approved',
    'net.authorize.payment.fraud.declined': 'declined',
  }
  return eventMap[eventType] || 'unknown'
}

// Process payment with tokenized card data from Accept.js
export interface BillingAddress {
  firstName: string
  lastName: string
  address: string
  city: string
  state: string
  zip: string
  country: string
}

export interface TokenPaymentRequest {
  amount: number
  orderId: string
  orderNumber: string
  customerEmail?: string
  customerId?: string
  cardholderName?: string
  opaqueData: {
    dataDescriptor: string
    dataValue: string
  }
  billingAddress?: BillingAddress | null
}

export async function processPaymentWithToken(
  config: AuthorizeNetConfig,
  request: TokenPaymentRequest
): Promise<{ success: boolean; transactionId?: string; authCode?: string; error?: string }> {
  try {
    const endpoint = getApiEndpoint(config.environment)

    const requestBody = {
      createTransactionRequest: {
        merchantAuthentication: {
          name: config.apiLoginId,
          transactionKey: config.transactionKey,
        },
        transactionRequest: {
          transactionType: 'authCaptureTransaction',
          amount: request.amount.toFixed(2),
          payment: {
            opaqueData: {
              dataDescriptor: request.opaqueData.dataDescriptor,
              dataValue: request.opaqueData.dataValue,
            },
          },
          order: {
            invoiceNumber: request.orderNumber,
            description: `Order ${request.orderNumber}`,
          },
          customer: request.customerId ? {
            id: request.customerId,
            email: request.customerEmail,
          } : undefined,
          billTo: request.billingAddress ? {
            firstName: request.billingAddress.firstName,
            lastName: request.billingAddress.lastName,
            address: request.billingAddress.address,
            city: request.billingAddress.city,
            state: request.billingAddress.state,
            zip: request.billingAddress.zip,
            country: request.billingAddress.country || 'US',
          } : request.cardholderName ? {
            firstName: request.cardholderName.split(' ')[0] || '',
            lastName: request.cardholderName.split(' ').slice(1).join(' ') || '',
          } : undefined,
        },
      },
    }

    console.log('[Authorize.net] Sending payment request')

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })

    const data = await response.json()

    // Log only non-sensitive response info (PCI compliant)
    console.log('[Authorize.net] Payment response:', {
      resultCode: data.messages?.resultCode,
      transId: data.transactionResponse?.transId,
      responseCode: data.transactionResponse?.responseCode
    })

    if (data.messages?.resultCode === 'Ok' && data.transactionResponse) {
      const txResponse = data.transactionResponse
      
      // Check for transaction-level errors
      if (txResponse.errors) {
        const errorMessage = txResponse.errors[0]?.errorText || 'Transaction failed'
        return { success: false, error: errorMessage }
      }
      
      // Check response code (1 = Approved)
      if (txResponse.responseCode === '1') {
        return {
          success: true,
          transactionId: txResponse.transId,
          authCode: txResponse.authCode,
        }
      }
      
      // Handle other response codes
      const responseMessages: Record<string, string> = {
        '2': 'Transaction declined',
        '3': 'Transaction error',
        '4': 'Held for review',
      }
      return { 
        success: false, 
        error: responseMessages[txResponse.responseCode] || 'Transaction failed' 
      }
    }

    const errorMessage = data.messages?.message?.[0]?.text || 'Payment processing failed'
    return { success: false, error: errorMessage }
    
  } catch (error: any) {
    console.error('[Authorize.net] Error processing payment:', error)
    return { success: false, error: error.message }
  }
}

// Check if Authorize.net is configured
export function isAuthorizeNetConfigured(): boolean {
  return !!getAuthorizeNetConfig()
}
