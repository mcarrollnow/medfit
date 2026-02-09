import { NextRequest, NextResponse } from 'next/server'
import {
  getAuthorizeNetConfig,
  createHostedPaymentPage
} from '@/lib/authorize-net'
import { siteConfig } from '@/lib/site-config'

export async function POST(request: NextRequest) {
  try {
    const config = getAuthorizeNetConfig()
    
    if (!config) {
      console.error('[Authorize.net] API credentials not configured')
      return NextResponse.json(
        { error: 'Payment service not configured' },
        { status: 500 }
      )
    }

    const { 
      amount, 
      orderId, 
      orderNumber, 
      customerEmail, 
      customerId,
      description 
    } = await request.json()

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
    }

    if (!orderId || !orderNumber) {
      return NextResponse.json({ error: 'Order ID and order number are required' }, { status: 400 })
    }

    // Build return URLs - ensure we have a valid https URL
    const origin = request.headers.get('origin')
    const appUrl = process.env.NEXT_PUBLIC_APP_URL
    const mainAppUrl = process.env.NEXT_PUBLIC_MAIN_APP_URL
    
    console.log('[Authorize.net] URL sources:', { origin, appUrl, mainAppUrl })
    
    // Use the first valid URL, defaulting to production
    let baseUrl = origin || appUrl || mainAppUrl || siteConfig.appUrl
    
    // Handle localhost for development - use production URL for Authorize.net
    // because Authorize.net requires a publicly accessible URL
    if (baseUrl.includes('localhost') || baseUrl.includes('127.0.0.1')) {
      console.log('[Authorize.net] Localhost detected, using production URL for redirects')
      baseUrl = siteConfig.appUrl
    }
    
    // Ensure URL starts with https://
    if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
      baseUrl = `https://${baseUrl}`
    }
    
    // For production, always use https
    if (baseUrl.startsWith('http://')) {
      baseUrl = baseUrl.replace('http://', 'https://')
    }

    const returnUrl = `${baseUrl}/order-confirmation?orderId=${orderId}`
    const cancelUrl = `${baseUrl}/payment?orderId=${orderId}&total=${amount}`

    console.log('[Authorize.net] Creating hosted payment page:', { 
      amount, 
      orderId, 
      orderNumber,
      baseUrl,
      returnUrl 
    })

    const result = await createHostedPaymentPage(config, {
      amount,
      orderId,
      orderNumber,
      customerEmail,
      customerId,
      returnUrl,
      cancelUrl,
      description: description || `Order ${orderNumber}`,
    })

    if (!result.success || !result.data) {
      console.error('[Authorize.net] Failed to create hosted payment page:', result.error)
      return NextResponse.json(
        { error: result.error || 'Failed to initialize payment' },
        { status: 500 }
      )
    }

    console.log('[Authorize.net] Hosted payment page created successfully')

    return NextResponse.json({
      token: result.data.token,
      formUrl: result.data.formUrl,
    })

  } catch (error: any) {
    console.error('[Authorize.net] Error:', error.message || error)
    return NextResponse.json(
      { error: error.message || 'Payment initialization failed' },
      { status: 500 }
    )
  }
}
