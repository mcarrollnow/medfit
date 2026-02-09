import { Resend } from 'resend'
import { siteConfig } from '@/lib/site-config'

// ===== SMS =====

interface SendSmsOptions {
  to: string
  body: string
  metadata?: {
    type?: string
    payment_id?: string
    rep_id?: string
    [key: string]: string | undefined
  }
}

export async function sendSMS(options: SendSmsOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const { to, body, metadata = {} } = options

  try {
    // Get the base URL from environment or use production URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : siteConfig.appUrl
    
    const serviceKey = process.env.INTERNAL_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!serviceKey) {
      console.error('[SMS] Missing service key')
      return { success: false, error: 'Missing service key configuration' }
    }

    console.log('[SMS] Sending SMS to:', to)
    
    const response = await fetch(`${baseUrl}/api/internal/send-sms`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-service-key': serviceKey
      },
      body: JSON.stringify({
        to,
        body,
        metadata
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[SMS] Gateway error:', errorText)
      return { success: false, error: `SMS gateway error: ${response.status}` }
    }

    const result = await response.json()
    console.log('[SMS] Sent successfully:', result)
    
    return { 
      success: true, 
      messageId: result.sms_id 
    }
  } catch (error: any) {
    console.error('[SMS] Error:', error)
    return { success: false, error: error.message }
  }
}

// ===== EMAIL =====

interface SendEmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

export async function sendEmail(options: SendEmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const { to, subject, html, text } = options

  const apiKey = process.env.RESEND_API_KEY
  
  if (!apiKey) {
    console.warn('[Email] Resend not configured - skipping email send')
    return { success: false, error: 'Email service not configured' }
  }

  const resend = new Resend(apiKey)
  const fromEmail = siteConfig.noReplyEmail

  try {
    console.log('[Email] Sending to:', to)
    
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to,
      subject,
      html,
      text: text || undefined
    })

    if (error) {
      console.error('[Email] Resend error:', error)
      return { success: false, error: error.message }
    }

    console.log('[Email] Sent successfully:', data)
    return { success: true, messageId: data?.id }
  } catch (error: any) {
    console.error('[Email] Error:', error)
    return { success: false, error: error.message }
  }
}

// ===== EMAIL TEMPLATE HELPERS =====

/**
 * Fetch a saved email template from the database by key.
 * Returns null if not found or empty.
 */
export async function getEmailTemplate(templateKey: string): Promise<{ subject: string; html_content: string } | null> {
  try {
    const { getSupabaseAdminClient } = await import('@/lib/supabase-admin')
    const supabase = getSupabaseAdminClient()
    if (!supabase) return null

    const { data, error } = await supabase
      .from('transactional_email_templates')
      .select('subject, html_content')
      .eq('template_key', templateKey)
      .eq('is_active', true)
      .single()

    if (error || !data || !data.html_content) return null
    return data
  } catch {
    return null
  }
}

/**
 * Replace template variables like {{customer_name}} with actual values.
 */
export function replaceTemplateVariables(template: string, variables: Record<string, string>): string {
  let result = template
  for (const [key, value] of Object.entries(variables)) {
    result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value)
  }
  return result
}

// ===== PAYMENT NOTIFICATION TEMPLATES =====

interface PaymentNotificationData {
  repName: string
  paymentAmount: number
  currency: string
  paymentReportUrl: string
}

export function getPaymentSmsMessage(data: PaymentNotificationData): string {
  return `💰 Commission Payment Received!\n\nHi ${data.repName}, you've received a commission payment of ${data.paymentAmount.toFixed(6)} ${data.currency}.\n\nView details: ${data.paymentReportUrl}\n\n(You'll need your PIN to access the report)`
}

export function getPaymentEmailHtml(data: PaymentNotificationData): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Commission Payment Received</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; background-color: #0a0a0a;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%); border-radius: 24px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1);">
                
                <!-- Header -->
                <tr>
                  <td style="padding: 40px 40px 20px 40px; text-align: center;">
                    <div style="width: 60px; height: 60px; margin: 0 auto 20px auto; background: rgba(34, 197, 94, 0.2); border-radius: 16px; display: flex; align-items: center; justify-content: center;">
                      <span style="font-size: 32px;">💰</span>
                    </div>
                    <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">Commission Payment Received</h1>
                  </td>
                </tr>
                
                <!-- Amount Card -->
                <tr>
                  <td style="padding: 20px 40px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background: rgba(34, 197, 94, 0.1); border-radius: 16px; border: 1px solid rgba(34, 197, 94, 0.2);">
                      <tr>
                        <td style="padding: 30px; text-align: center;">
                          <p style="color: rgba(255,255,255,0.6); font-size: 14px; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 1px;">Amount Received</p>
                          <p style="color: #22c55e; font-size: 36px; font-weight: 700; margin: 0;">${data.paymentAmount.toFixed(6)} ${data.currency}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td style="padding: 20px 40px;">
                    <p style="color: rgba(255,255,255,0.8); font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                      Hi ${data.repName},
                    </p>
                    <p style="color: rgba(255,255,255,0.8); font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                      Great news! A commission payment has been sent to your wallet. Click the button below to view the full payment report, including transaction details and commission breakdown.
                    </p>
                    
                    <!-- Button -->
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" style="padding: 10px 0 30px 0;">
                          <a href="${data.paymentReportUrl}" style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); color: #ffffff; padding: 16px 40px; text-decoration: none; border-radius: 12px; font-size: 16px; font-weight: 600; display: inline-block;">
                            View Payment Report
                          </a>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Security Note -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="background: rgba(255,255,255,0.05); border-radius: 12px;">
                      <tr>
                        <td style="padding: 20px;">
                          <p style="color: rgba(255,255,255,0.6); font-size: 14px; margin: 0;">
                            🔒 Use your <strong style="color: white;">PIN</strong> to access the payment report.
                          </p>
                        </td>
                      </tr>
                    </table>
                    
                    <p style="color: rgba(255,255,255,0.4); font-size: 14px; line-height: 1.6; margin: 30px 0 0 0;">
                      Or copy this link: <span style="color: rgba(255,255,255,0.6); word-break: break-all;">${data.paymentReportUrl}</span>
                    </p>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="padding: 30px 40px; border-top: 1px solid rgba(255,255,255,0.1);">
                    <p style="color: rgba(255,255,255,0.4); font-size: 12px; margin: 0; text-align: center;">
                      © ${new Date().getFullYear()} Modern Health Pro. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `
}

// ===== SEND PAYMENT NOTIFICATION =====

export async function sendPaymentNotification(
  repEmail: string,
  repPhone: string | null,
  repName: string,
  paymentAmount: number,
  currency: string,
  paymentReportToken: string,
  notificationMethod: 'email' | 'sms' | 'both' = 'email'
): Promise<{ success: boolean; emailSent?: boolean; smsSent?: boolean; error?: string }> {
  
  const baseUrl = siteConfig.appUrl
  const paymentReportUrl = `${baseUrl}/payment-report/${paymentReportToken}`
  
  const notificationData: PaymentNotificationData = {
    repName,
    paymentAmount,
    currency,
    paymentReportUrl
  }

  let emailSent = false
  let smsSent = false
  const errors: string[] = []

  // Send Email
  if (notificationMethod === 'email' || notificationMethod === 'both') {
    if (repEmail) {
      // Try saved template first
      let emailHtml: string | null = null
      let emailSubject = `💰 Commission Payment: ${paymentAmount.toFixed(6)} ${currency}`
      
      const savedTemplate = await getEmailTemplate('commission_payment')
      if (savedTemplate && savedTemplate.html_content) {
        emailHtml = replaceTemplateVariables(savedTemplate.html_content, {
          rep_name: repName,
          payment_amount: paymentAmount.toFixed(6),
          currency: currency,
          payment_report_url: paymentReportUrl,
          company_name: 'Modern Health Pro',
        })
        emailSubject = replaceTemplateVariables(savedTemplate.subject, {
          payment_amount: paymentAmount.toFixed(6),
          currency: currency,
        })
      }

      const emailResult = await sendEmail({
        to: repEmail,
        subject: emailSubject,
        html: emailHtml || getPaymentEmailHtml(notificationData)
      })
      
      if (emailResult.success) {
        emailSent = true
        console.log('[PaymentNotification] Email sent to:', repEmail)
      } else {
        errors.push(`Email: ${emailResult.error}`)
      }
    } else {
      errors.push('Email: No email address provided')
    }
  }

  // Send SMS
  if (notificationMethod === 'sms' || notificationMethod === 'both') {
    if (repPhone) {
      const smsResult = await sendSMS({
        to: repPhone,
        body: getPaymentSmsMessage(notificationData),
        metadata: {
          type: 'commission_payment'
        }
      })
      
      if (smsResult.success) {
        smsSent = true
        console.log('[PaymentNotification] SMS sent to:', repPhone)
      } else {
        errors.push(`SMS: ${smsResult.error}`)
      }
    } else {
      errors.push('SMS: No phone number provided')
    }
  }

  const success = emailSent || smsSent
  
  return {
    success,
    emailSent,
    smsSent,
    error: errors.length > 0 ? errors.join('; ') : undefined
  }
}

