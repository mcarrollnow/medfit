import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdminClient } from '@/lib/supabase-admin'
import { getAuthorizeNetConfig, createHostedPaymentPage } from '@/lib/authorize-net'
import { sendEmail, getEmailTemplate, replaceTemplateVariables } from '@/lib/notifications'
import { verifyAdmin, verifyMike, MIKE_USER_ID, MIKE_EMAIL } from '@/lib/auth-server'
import { siteConfig } from '@/lib/site-config'
import crypto from 'crypto'

interface InvoiceItem {
  product_id?: string
  name?: string
  description: string
  quantity: number
  unit_price: number
  pricing_tier?: 'cost' | 'b2b' | 'retail' | 'custom'
}

interface CreateInvoiceRequest {
  customer_email: string
  customer_name: string
  items: InvoiceItem[]
  due_date?: string
  notes?: string
  send_email?: boolean
  manual_adjustment?: number
  is_hidden?: boolean // Hidden invoices: no payment processing, no order, superadmin only
  supplier_id?: string // If set, new customer will be created as supplier_customer
}

// Generate a unique order number
function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `ORD-${timestamp}-${random}`
}

// GET - List all invoices
export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseAdminClient()
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '100')
    const includeHidden = searchParams.get('include_hidden') === 'true'

    // Check if user is Mike to allow viewing hidden invoices
    let canViewHidden = false
    if (includeHidden) {
      const authResult = await verifyMike(request)
      canViewHidden = authResult.authenticated
    }

    let query = supabase
      .from('authorize_net_invoices')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    // Filter out hidden invoices unless superadmin explicitly requests them
    if (!canViewHidden) {
      query = query.or('is_hidden.is.null,is_hidden.eq.false')
    }

    const { data: invoices, error } = await query

    if (error) {
      console.error('[Authorize.net Invoices] Error fetching:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ invoices: invoices || [] })
  } catch (error: any) {
    console.error('[Authorize.net Invoices] Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST - Create a new invoice
export async function POST(request: NextRequest) {
  try {
    const config = getAuthorizeNetConfig()
    if (!config) {
      console.error('[Authorize.net Invoices] API credentials not configured')
      return NextResponse.json({ error: 'Authorize.net not configured' }, { status: 500 })
    }

    const supabase = getSupabaseAdminClient()
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 })
    }

    const body: CreateInvoiceRequest = await request.json()
    const { customer_email, customer_name, items, due_date, notes, send_email, manual_adjustment = 0, is_hidden = false, supplier_id } = body

    if (!customer_email || !customer_name || !items?.length) {
      return NextResponse.json({ 
        error: 'Missing required fields: customer_email, customer_name, items' 
      }, { status: 400 })
    }

    // Hidden invoices require Mike's account only
    if (is_hidden) {
      const authResult = await verifyMike(request)
      if (!authResult.authenticated) {
        return NextResponse.json({ error: 'Access denied for hidden invoices' }, { status: 403 })
      }
      console.log('[Authorize.net Invoices] Creating hidden invoice by:', authResult.user?.email)
    }

    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0)
    const total = subtotal + manual_adjustment // Includes manual adjustment

    // Generate invoice number
    const invoiceNumber = `INV-${Date.now().toString(36).toUpperCase()}`

    // Get base URL for invoice links
    const productionUrl = siteConfig.appUrl
    let origin = request.headers.get('origin') || productionUrl
    
    // If running on localhost, use production URL
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
      origin = productionUrl
      console.log('[Authorize.net Invoices] Localhost detected, using production URL:', origin)
    }

    // For hidden invoices: skip payment processing entirely (view-only invoice)
    let paymentResult: { success: boolean; data?: { formUrl?: string; token?: string }; error?: string } = { success: false }
    
    if (!is_hidden) {
      const returnUrl = `${origin}/payment/success`
      const cancelUrl = `${origin}/payment/cancelled`

      // Build line items for payment page display (positive prices only)
      const lineItems = items.map((item, idx) => ({
        itemId: String(idx + 1),
        name: item.name || item.description || `Item ${idx + 1}`,
        description: item.description || '',
        quantity: item.quantity,
        unitPrice: item.unit_price,
      }))

      // Calculate discount amount for display (Authorize.net shows this in the order summary)
      const discountAmount = manual_adjustment < 0 ? Math.abs(manual_adjustment) : 0

      // Build description with discount info if applicable
      let orderDescription = `Invoice ${invoiceNumber}`
      if (discountAmount > 0) {
        orderDescription = `Invoice ${invoiceNumber} | Subtotal: $${subtotal.toFixed(2)} | Discount: -$${discountAmount.toFixed(2)}`
      }

      // Create hosted payment page for this invoice
      console.log('[Authorize.net Invoices] Creating payment page for', invoiceNumber, 'amount:', total, 'items:', lineItems.length, 'discount:', discountAmount)
      paymentResult = await createHostedPaymentPage(config, {
        amount: total,
        orderId: invoiceNumber,
        orderNumber: invoiceNumber,
        customerEmail: customer_email,
        returnUrl,
        cancelUrl,
        description: orderDescription,
        lineItems,
        discount: discountAmount > 0 ? discountAmount : undefined,
      })
      
      if (!paymentResult.success) {
        console.error('[Authorize.net Invoices] Payment page creation failed:', paymentResult.error)
      } else {
        console.log('[Authorize.net Invoices] Payment page created:', paymentResult.data?.formUrl?.substring(0, 80) + '...')
      }
    } else {
      console.log('[Authorize.net Invoices] Hidden invoice - skipping payment page creation')
    }

    // === CHECK IF CUSTOMER EXISTS ===
    let customerId: string | null = null
    let isNewCustomer = false
    let accountSetupToken: string | null = null

    // Search for customer by email through users table
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', customer_email.toLowerCase())
      .single()
    
    if (existingUser) {
      // Look for customer record linked to this user
      const { data: existingCustomer } = await supabase
        .from('customers')
        .select('id')
        .eq('user_id', existingUser.id)
        .single()
      
      if (existingCustomer) {
        customerId = existingCustomer.id
        console.log('[Authorize.net Invoices] Found existing customer:', customerId)
      }
    } else {
      // New customer - generate a setup token so they can create their account
      isNewCustomer = true
      accountSetupToken = crypto.randomBytes(32).toString('hex')
      console.log('[Authorize.net Invoices] New customer detected, setup token generated')
    }

    // Store invoice in database
    const invoiceData: any = {
      invoice_number: invoiceNumber,
      customer_email,
      customer_name,
      items: JSON.stringify(items),
      subtotal,
      manual_adjustment,
      total,
      status: is_hidden ? 'draft' : 'draft',
      due_date: due_date || null,
      notes: notes || null,
      payment_url: paymentResult.success ? paymentResult.data?.formUrl : null,
      payment_token: paymentResult.success ? paymentResult.data?.token : null,
      is_hidden,
      customer_id: customerId,
      account_setup_token: accountSetupToken,
      account_setup_completed: !isNewCustomer, // Existing customers don't need setup
      supplier_id: supplier_id || null, // Link to supplier for supplier_customer creation
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const { data: invoice, error: insertError } = await supabase
      .from('authorize_net_invoices')
      .insert(invoiceData)
      .select()
      .single()

    if (insertError) {
      console.error('[Authorize.net Invoices] Insert error:', insertError)
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    console.log('[Authorize.net Invoices] Invoice created:', {
      id: invoice?.id,
      number: invoiceNumber,
      send_email,
      isNewCustomer,
      customerId,
      paymentSuccess: paymentResult.success,
      hasPaymentUrl: !!paymentResult.data?.formUrl
    })

    // === CREATE ORDER FROM INVOICE (skip for hidden invoices) ===
    let orderId: string | null = null
    if (!is_hidden) {
      try {
        const orderNumber = generateOrderNumber()
        
        // Build order data
        const orderInsertData: any = {
          order_number: orderNumber,
          status: 'pending',
          payment_status: 'pending',
          payment_method: 'authorize_net',
          subtotal: subtotal,
          shipping_amount: 0,
          discount_amount: manual_adjustment < 0 ? Math.abs(manual_adjustment) : 0,
          total_amount: total,
          tax_amount: 0,
          notes: `${supplier_id ? '[Supplier Order] ' : ''}[Invoice: ${invoiceNumber}]${notes ? ` | ${notes}` : ''}`,
          is_guest_order: !customerId,
          guest_name: customerId ? null : customer_name,
          guest_email: customerId ? null : customer_email,
          payment_url: paymentResult.success ? paymentResult.data?.formUrl : null,
          source: supplier_id ? 'supplier' : 'direct',
          supplier_id: supplier_id || null,
        }
        
        // Only add customer_id if we found one
        if (customerId) {
          orderInsertData.customer_id = customerId
        }
        
        const { data: order, error: orderError } = await supabase
          .from('orders')
          .insert(orderInsertData)
          .select()
          .single()
        
        if (orderError) {
          console.error('[Authorize.net Invoices] Error creating order:', orderError)
        } else {
          orderId = order.id
          console.log('[Authorize.net Invoices] Created order:', order.id, order.order_number)
          
          // Create order items from invoice items
          const orderItems = items.map((item, idx) => ({
            order_id: order.id,
            product_id: item.product_id || null,
            product_name: item.name || item.description || `Item ${idx + 1}`,
            quantity: item.quantity,
            unit_price: item.unit_price,
            total_price: item.quantity * item.unit_price
          }))
          
          const { error: itemsError } = await supabase
            .from('order_items')
            .insert(orderItems)
          
          if (itemsError) {
            console.error('[Authorize.net Invoices] Error creating order items:', itemsError)
          } else {
            console.log('[Authorize.net Invoices] Created', orderItems.length, 'order items')
          }
          
          // Update invoice with order_id reference
          await supabase
            .from('authorize_net_invoices')
            .update({ order_id: order.id })
            .eq('id', invoice.id)
        }
      } catch (orderCreationError) {
        console.error('[Authorize.net Invoices] Error in order creation flow:', orderCreationError)
      }
    } else {
      console.log('[Authorize.net Invoices] Hidden invoice - skipping order creation')
    }

    // Generate invoice page URL
    const invoicePageUrl = invoice ? `${origin}/invoice/${invoice.id}` : null
    
    // For new customers, generate the setup URL
    const setupUrl = isNewCustomer && accountSetupToken && invoice
      ? `${origin}/invoice/${invoice.id}?setup=${accountSetupToken}`
      : null

    // The URL to use in the email - new customers go to setup, existing go to invoice
    const emailActionUrl = setupUrl || invoicePageUrl
    const emailActionText = isNewCustomer ? 'Set Up Account & View Invoice' : 'View Invoice & Pay'

    // Send email if requested
    if (send_email && invoice && (paymentResult.success || is_hidden)) {
      console.log('[Authorize.net Invoices] Preparing to send email to:', customer_email, isNewCustomer ? '(new customer)' : '(existing customer)')
      
      // Format date for email
      const issueDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
      const dueDateFormatted = due_date ? new Date(due_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Upon Receipt'

      // Try to use saved template first
      let emailHtml: string | null = null
      let emailSubject = `Invoice ${invoiceNumber} - $${total.toFixed(2)}`
      
      const savedTemplate = await getEmailTemplate('invoice')
      if (savedTemplate && savedTemplate.html_content) {
        emailHtml = replaceTemplateVariables(savedTemplate.html_content, {
          customer_name: customer_name,
          invoice_number: invoiceNumber,
          total: total.toFixed(2),
          subtotal: subtotal.toFixed(2),
          issue_date: issueDate,
          due_date: dueDateFormatted,
          invoice_url: emailActionUrl || '',
          company_name: 'Medfit 90',
        })
        emailSubject = replaceTemplateVariables(savedTemplate.subject, {
          invoice_number: invoiceNumber,
          total: total.toFixed(2),
        })
        console.log('[Authorize.net Invoices] Using saved email template')
      }

      // Fallback to hardcoded template if no saved template
      if (!emailHtml) {
        // Build the greeting based on new vs existing customer
        const greetingText = isNewCustomer
          ? `Hello ${customer_name},<br><br>A new invoice has been prepared for you. To view your invoice and make payment, please set up your account by clicking the button below. You'll just need to create a password — we already have your details.`
          : `Hello ${customer_name},<br><br>A new invoice has been prepared for you. Please find the summary below and click through to view the complete details.`

        emailHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Invoice from Medfit 90</title>
  <style>
    body, table, td, p, a, li, blockquote {
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
    table, td {
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }
    img {
      -ms-interpolation-mode: bicubic;
      border: 0;
      height: auto;
      line-height: 100%;
      outline: none;
      text-decoration: none;
    }
    body {
      margin: 0 !important;
      padding: 0 !important;
      width: 100% !important;
      background-color: #121212;
    }
    a {
      color: #f5f5f5;
    }
    @media only screen and (max-width: 600px) {
      .email-container {
        width: 100% !important;
        max-width: 100% !important;
      }
      .mobile-padding {
        padding-left: 24px !important;
        padding-right: 24px !important;
      }
      .mobile-stack {
        display: block !important;
        width: 100% !important;
        padding-bottom: 16px !important;
      }
      .hero-title {
        font-size: 36px !important;
      }
      .amount-large {
        font-size: 40px !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #121212;">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color: #121212;">
    <tr>
      <td align="center" style="padding: 48px 16px 64px;">
        <table role="presentation" cellpadding="0" cellspacing="0" width="600" class="email-container" style="max-width: 600px; width: 100%;">
          
          <!-- Logo -->
          <tr>
            <td align="center" style="padding-bottom: 48px;">
              <p style="margin: 0; font-family: 'SF Mono', 'Monaco', 'Courier New', monospace; font-size: 10px; letter-spacing: 0.3em; color: #a3a3a3; text-transform: uppercase;">
                Medfit 90
              </p>
            </td>
          </tr>
          
          <!-- Main Card -->
          <tr>
            <td>
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 24px;">
                <tr>
                  <td style="padding: 56px 48px;" class="mobile-padding">
                    
                    <!-- Eyebrow -->
                    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td style="font-family: 'SF Mono', 'Monaco', 'Courier New', monospace; font-size: 10px; letter-spacing: 0.3em; color: #a3a3a3; text-transform: uppercase; padding-bottom: 20px;">
                          Invoice
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Hero Title -->
                    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td class="hero-title" style="font-family: Georgia, 'Times New Roman', serif; font-size: 48px; font-weight: 300; color: #f5f5f5; line-height: 1.1; letter-spacing: -0.02em; padding-bottom: 32px;">
                          ${invoiceNumber}
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Greeting -->
                    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 15px; font-weight: 300; color: #a3a3a3; line-height: 1.7; padding-bottom: 40px;">
                          ${greetingText}
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Invoice Details Box -->
                    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 16px; margin-bottom: 40px;">
                      <tr>
                        <td style="padding: 32px;">
                          
                          <!-- Status & Dates -->
                          <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-bottom: 1px solid rgba(255, 255, 255, 0.06); padding-bottom: 24px; margin-bottom: 24px;">
                            <tr>
                              <td class="mobile-stack" width="33%" style="vertical-align: top;">
                                <p style="margin: 0 0 6px 0; font-family: 'SF Mono', 'Monaco', 'Courier New', monospace; font-size: 9px; letter-spacing: 0.3em; color: #737373; text-transform: uppercase;">Status</p>
                                <p style="margin: 0; font-family: Georgia, serif; font-size: 18px; font-weight: 300; color: #f5f5f5;">Due</p>
                              </td>
                              <td class="mobile-stack" width="33%" style="vertical-align: top;">
                                <p style="margin: 0 0 6px 0; font-family: 'SF Mono', 'Monaco', 'Courier New', monospace; font-size: 9px; letter-spacing: 0.3em; color: #737373; text-transform: uppercase;">Issued</p>
                                <p style="margin: 0; font-family: -apple-system, sans-serif; font-size: 14px; font-weight: 300; color: #f5f5f5;">${issueDate}</p>
                              </td>
                              <td class="mobile-stack" width="33%" style="vertical-align: top; text-align: right;">
                                <p style="margin: 0 0 6px 0; font-family: 'SF Mono', 'Monaco', 'Courier New', monospace; font-size: 9px; letter-spacing: 0.3em; color: #737373; text-transform: uppercase;">Due</p>
                                <p style="margin: 0; font-family: -apple-system, sans-serif; font-size: 14px; font-weight: 300; color: #f5f5f5;">${dueDateFormatted}</p>
                              </td>
                            </tr>
                          </table>
                          
                          <!-- Total Amount -->
                          <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                            <tr>
                              <td>
                                <p style="margin: 0 0 8px 0; font-family: 'SF Mono', 'Monaco', 'Courier New', monospace; font-size: 9px; letter-spacing: 0.3em; color: #737373; text-transform: uppercase;">Total Due</p>
                                <p class="amount-large" style="margin: 0; font-family: Georgia, 'Times New Roman', serif; font-size: 48px; font-weight: 300; color: #f5f5f5; letter-spacing: -0.02em;">$${total.toFixed(2)}</p>
                              </td>
                            </tr>
                          </table>
                          
                        </td>
                      </tr>
                    </table>
                    
                    <!-- CTA Button -->
                    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td align="center" style="padding-bottom: 24px;">
                          <table role="presentation" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="background-color: #ffffff; border-radius: 16px;">
                                <a href="${emailActionUrl}" target="_blank" style="display: inline-block; padding: 18px 56px; font-family: 'SF Mono', 'Monaco', 'Courier New', monospace; font-size: 11px; letter-spacing: 0.2em; color: #000000; text-decoration: none; text-transform: uppercase; font-weight: 600;">
                                  ${emailActionText}
                                </a>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Fallback Link -->
                    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td align="center" style="font-family: -apple-system, sans-serif; font-size: 12px; color: #525252;">
                          <a href="${emailActionUrl}" style="color: #737373; text-decoration: underline;">${emailActionUrl}</a>
                        </td>
                      </tr>
                    </table>
                    
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 48px 24px 0;">
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="border-top: 1px solid rgba(255, 255, 255, 0.06); padding-top: 32px;"></td>
                </tr>
              </table>
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center" style="padding-bottom: 16px;">
                    <p style="margin: 0; font-family: -apple-system, sans-serif; font-size: 12px; font-weight: 300; color: #525252; line-height: 1.6;">
                      Questions? Contact us at <a href="mailto:${siteConfig.supportEmail}" style="color: #737373; text-decoration: none;">${siteConfig.supportEmail}</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
      } // end fallback

      const emailResult = await sendEmail({
        to: customer_email,
        subject: emailSubject,
        html: emailHtml,
      })

      if (emailResult.success) {
        await supabase
          .from('authorize_net_invoices')
          .update({ 
            status: 'sent',
            sent_at: new Date().toISOString(),
          })
          .eq('id', invoice.id)
        
        console.log(`[Authorize.net Invoices] Email sent to ${customer_email}`)
      } else {
        console.error(`[Authorize.net Invoices] Failed to send email:`, emailResult.error)
      }
    }

    return NextResponse.json({ 
      invoice,
      payment_url: paymentResult.success ? paymentResult.data?.formUrl : null,
      invoice_url: invoicePageUrl,
      setup_url: setupUrl,
      order_id: orderId,
      is_hidden,
      is_new_customer: isNewCustomer,
    })
  } catch (error: any) {
    console.error('[Authorize.net Invoices] Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
