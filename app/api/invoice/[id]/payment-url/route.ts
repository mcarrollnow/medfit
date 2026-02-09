import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdminClient } from '@/lib/supabase-admin'
import { getAuthorizeNetConfig, createHostedPaymentPage } from '@/lib/authorize-net'
import { siteConfig } from '@/lib/site-config'

// GET - Generate a fresh payment URL for an invoice
// Tokens expire after 15 minutes, so we generate a new one each time
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: invoiceId } = await params
    
    const config = getAuthorizeNetConfig()
    if (!config) {
      console.error('[Invoice Payment] Authorize.net not configured')
      return NextResponse.json({ error: 'Payment service not configured' }, { status: 500 })
    }

    const supabase = getSupabaseAdminClient()
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 })
    }

    // Fetch the invoice
    const { data: invoice, error } = await supabase
      .from('authorize_net_invoices')
      .select('*')
      .eq('id', invoiceId)
      .single()

    if (error || !invoice) {
      console.error('[Invoice Payment] Invoice not found:', invoiceId)
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
    }

    // Check if already paid
    if (invoice.status === 'paid') {
      return NextResponse.json({ error: 'Invoice already paid' }, { status: 400 })
    }

    // Build return URLs
    const origin = request.headers.get('origin')
    const appUrl = process.env.NEXT_PUBLIC_APP_URL
    const mainAppUrl = process.env.NEXT_PUBLIC_MAIN_APP_URL
    
    let baseUrl = origin || appUrl || mainAppUrl || siteConfig.appUrl

    // Authorize.net requires a publicly accessible URL
    if (baseUrl.includes('localhost') || baseUrl.includes('127.0.0.1')) {
      baseUrl = siteConfig.appUrl
    }
    
    if (!baseUrl.startsWith('https://')) {
      baseUrl = baseUrl.startsWith('http://') 
        ? baseUrl.replace('http://', 'https://') 
        : `https://${baseUrl}`
    }

    const returnUrl = `${baseUrl}/payment/success?invoice=${invoiceId}`
    const cancelUrl = `${baseUrl}/invoice/${invoiceId}`

    console.log('[Invoice Payment] Generating fresh token for invoice:', invoice.invoice_number)

    // Parse items from database
    const rawItems = typeof invoice.items === 'string' ? JSON.parse(invoice.items) : invoice.items || []
    
    // Build line items for payment page display (positive prices only)
    const lineItems = rawItems.map((item: any, idx: number) => ({
      itemId: String(idx + 1),
      name: item.name || item.description || `Item ${idx + 1}`,
      description: item.description || '',
      quantity: item.quantity || 1,
      unitPrice: item.unit_price || 0,
    }))

    // Calculate discount amount for display
    const discountAmount = invoice.manual_adjustment && invoice.manual_adjustment < 0 
      ? Math.abs(invoice.manual_adjustment) 
      : 0

    // Build description with discount info if applicable
    let orderDescription = `Invoice ${invoice.invoice_number}`
    if (discountAmount > 0) {
      orderDescription = `Invoice ${invoice.invoice_number} | Subtotal: $${invoice.subtotal.toFixed(2)} | Discount: -$${discountAmount.toFixed(2)}`
    }

    // Generate a fresh payment token
    const result = await createHostedPaymentPage(config, {
      amount: invoice.total,
      orderId: invoice.invoice_number,
      orderNumber: invoice.invoice_number,
      customerEmail: invoice.customer_email,
      returnUrl,
      cancelUrl,
      description: orderDescription,
      lineItems,
      discount: discountAmount > 0 ? discountAmount : undefined,
    })

    if (!result.success || !result.data) {
      console.error('[Invoice Payment] Failed to create payment page:', result.error)
      return NextResponse.json(
        { error: result.error || 'Failed to initialize payment' },
        { status: 500 }
      )
    }

    console.log('[Invoice Payment] Fresh token generated successfully')

    return NextResponse.json({
      payment_url: result.data.formUrl,
      expires_in: 900, // 15 minutes in seconds
    })

  } catch (error: any) {
    console.error('[Invoice Payment] Error:', error.message || error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate payment URL' },
      { status: 500 }
    )
  }
}
