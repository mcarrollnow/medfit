import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdminClient } from '@/lib/supabase-admin'
import { verifyAdmin } from '@/lib/auth-server'
import { sendEmail, getEmailTemplate, replaceTemplateVariables } from '@/lib/notifications'
import { siteConfig } from '@/lib/site-config'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdmin(request)
    if (!authResult.authenticated) {
      return NextResponse.json({ error: authResult.error }, { status: 401 })
    }

    const supabase = getSupabaseAdminClient()
    if (!supabase) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    const { id: orderId } = await params
    const body = await request.json()
    const { method, phone: customPhone } = body // 'email' or 'text', optional custom phone

    if (!method || !['email', 'text'].includes(method)) {
      return NextResponse.json({ error: 'Invalid method. Use "email" or "text"' }, { status: 400 })
    }

    // Get order details with customer info
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(`
        *,
        customers:customer_id (
          id,
          phone,
          company_name,
          users:user_id (
            first_name,
            last_name,
            email,
            phone
          )
        )
      `)
      .eq('id', orderId)
      .single()

    if (orderError || !order) {
      console.error('[Send Reminder] Order not found:', orderId, orderError)
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    const customer = order.customers
    const user = customer?.users
    const customerName = user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() : customer?.company_name || 'Customer'
    const customerEmail = user?.email
    const customerPhone = user?.phone || customer?.phone

    console.log('[Send Reminder] Sending reminder for order:', order.order_number, 'via', method)

    if (method === 'email') {
      if (!customerEmail) {
        return NextResponse.json({ error: 'Customer has no email address' }, { status: 400 })
      }

      // Get base URL
      const origin = siteConfig.appUrl
      const paymentUrl = `${origin}/payment/${orderId}`

      // Try to use saved template first
      let emailHtml: string | null = null
      let emailSubject = `Payment Reminder - Order ${order.order_number}`

      const savedTemplate = await getEmailTemplate('payment_reminder')
      if (savedTemplate && savedTemplate.html_content) {
        emailHtml = replaceTemplateVariables(savedTemplate.html_content, {
          customer_name: customerName,
          order_number: order.order_number,
          total_amount: (order.total_amount || 0).toFixed(2),
          payment_url: paymentUrl,
          company_name: 'Medfit 90',
        })
        emailSubject = replaceTemplateVariables(savedTemplate.subject, {
          order_number: order.order_number,
        })
        console.log('[Send Reminder] Using saved email template')
      }

      // Fallback to hardcoded template
      if (!emailHtml) {
        emailHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payment Reminder</title>
</head>
<body style="margin: 0; padding: 0; background-color: #121212; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color: #121212;">
    <tr>
      <td align="center" style="padding: 48px 16px;">
        <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="max-width: 600px; width: 100%;">
          
          <!-- Logo -->
          <tr>
            <td align="center" style="padding-bottom: 32px;">
              <p style="margin: 0; font-family: monospace; font-size: 10px; letter-spacing: 0.3em; color: #a3a3a3; text-transform: uppercase;">
                Medfit 90
              </p>
            </td>
          </tr>
          
          <!-- Main Card -->
          <tr>
            <td style="background-color: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 24px; padding: 48px;">
              
              <h1 style="margin: 0 0 24px 0; font-size: 28px; font-weight: 300; color: #f5f5f5;">
                Payment Reminder
              </h1>
              
              <p style="margin: 0 0 24px 0; font-size: 15px; color: #a3a3a3; line-height: 1.6;">
                Hello ${customerName},
              </p>
              
              <p style="margin: 0 0 24px 0; font-size: 15px; color: #a3a3a3; line-height: 1.6;">
                This is a friendly reminder that your order <strong style="color: #f5f5f5;">${order.order_number}</strong> is awaiting payment.
              </p>
              
              <div style="background-color: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 16px; padding: 24px; margin-bottom: 32px;">
                <p style="margin: 0 0 8px 0; font-family: monospace; font-size: 10px; letter-spacing: 0.2em; color: #737373; text-transform: uppercase;">
                  Amount Due
                </p>
                <p style="margin: 0; font-size: 36px; font-weight: 300; color: #f5f5f5;">
                  $${(order.total_amount || 0).toFixed(2)}
                </p>
              </div>
              
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center">
                    <a href="${paymentUrl}" style="display: inline-block; background-color: #ffffff; color: #000000; padding: 16px 48px; border-radius: 12px; text-decoration: none; font-family: monospace; font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; font-weight: 600;">
                      Pay Now
                    </a>
                  </td>
                </tr>
              </table>
              
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding-top: 32px; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #525252;">
                Questions? Contact us at <a href="mailto:${siteConfig.supportEmail}" style="color: #737373;">${siteConfig.supportEmail}</a>
              </p>
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
        to: customerEmail,
        subject: emailSubject,
        html: emailHtml,
      })

      if (!emailResult.success) {
        console.error('[Send Reminder] Email failed:', emailResult.error)
        return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
      }

      console.log('[Send Reminder] Email sent successfully to:', customerEmail)

      // Log the reminder in the database (optional - create a notifications table if needed)
      return NextResponse.json({ 
        success: true, 
        message: `Payment reminder sent via email to ${customerEmail}` 
      })

    } else if (method === 'text') {
      // Use custom phone if provided, otherwise use customer's phone
      const phoneToUse = customPhone || customerPhone
      
      if (!phoneToUse) {
        return NextResponse.json({ error: 'Customer has no phone number' }, { status: 400 })
      }

      // TODO: Implement SMS sending via your SMS provider (Twilio, etc.)
      // For now, return a placeholder response
      console.log('[Send Reminder] SMS would be sent to:', phoneToUse)
      
      // Placeholder - you'll need to implement actual SMS sending
      return NextResponse.json({ 
        success: true, 
        message: `Payment reminder queued for SMS to ${phoneToUse}`,
        note: 'SMS integration pending - please configure SMS provider'
      })
    }

    return NextResponse.json({ error: 'Unknown error' }, { status: 500 })
  } catch (error: any) {
    console.error('[Send Reminder] Error:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}
