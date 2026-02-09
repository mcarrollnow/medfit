import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdminClient } from '@/lib/supabase-admin'

// Inbound Email Webhook
// Receives parsed email data from Cloudflare Email Worker or Postmark

// Cloudflare Worker format
interface CloudflareEmail {
  from: string
  to: string
  subject: string
  text: string
  date: string
}

// Postmark format (legacy support)
interface PostmarkInboundEmail {
  From: string
  FromName: string
  To: string
  Subject: string
  TextBody: string
  HtmlBody: string
  Date: string
  MessageID: string
}

interface ShipmentInfo {
  packageId: string
  trackingNumber: string
}

// Parse the email to extract Package ID and Tracking # pairs
// Format from "Postal & More" receipts:
//   Package ID: ORD-MHI6PPKW-DOMZ    0.42
//   Tracking #:   9400111899560281575973
function parseShipments(text: string): ShipmentInfo[] {
  const shipments: ShipmentInfo[] = []
  
  // Split into lines for easier parsing
  const lines = text.split('\n').map(l => l.trim())
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    
    // Look for Package ID line
    // Format: "Package ID: ORD-XXXXXXXX-XXXX    0.42"
    const packageMatch = line.match(/Package\s*ID:\s*(ORD-[A-Z0-9]+-[A-Z0-9]+)/i)
    
    if (packageMatch) {
      const packageId = packageMatch[1].toUpperCase()
      
      // Look for Tracking # on the next few lines
      for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
        const trackingLine = lines[j]
        const trackingMatch = trackingLine.match(/Tracking\s*#:\s*(\d{20,22})/i)
        
        if (trackingMatch) {
          shipments.push({
            packageId,
            trackingNumber: trackingMatch[1]
          })
          break
        }
      }
    }
  }
  
  return shipments
}

// Fallback: Extract all USPS tracking numbers
function extractUSPSTrackingNumbers(text: string): string[] {
  // USPS tracking: 20-22 digits, often starting with 9400, 9200, etc.
  const pattern = /\b(9[234]\d{19,20})\b/g
  const matches = text.match(pattern)
  return matches ? [...new Set(matches)] : []
}

// Fallback: Extract all order numbers
function extractOrderNumbers(text: string): string[] {
  // Match format: ORD-XXXXXXXX-XXXX (alphanumeric segments)
  const pattern = /\bORD-[A-Z0-9]+-[A-Z0-9]+\b/gi
  const matches = text.match(pattern)
  return matches ? [...new Set(matches.map(m => m.toUpperCase()))] : []
}

// Log result to tracking_email_logs table
async function logResult(
  supabase: ReturnType<typeof getSupabaseAdminClient>,
  orderNumber: string,
  trackingNumber: string,
  status: string,
  emailFrom?: string,
  emailSubject?: string,
  details?: string
) {
  if (!supabase) return
  
  try {
    await supabase.from('tracking_email_logs').insert({
      order_number: orderNumber,
      tracking_number: trackingNumber,
      status,
      source: 'email',
      email_from: emailFrom,
      email_subject: emailSubject,
      details
    })
  } catch (error) {
    console.error('[Tracking Inbound] Failed to log result:', error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Detect format: Cloudflare uses lowercase, Postmark uses PascalCase
    const isCloudflare = 'from' in body && 'text' in body
    const isPostmark = 'From' in body && ('TextBody' in body || 'HtmlBody' in body)
    
    let emailFrom: string
    let emailSubject: string
    let emailTo: string
    let fullText: string
    
    if (isCloudflare) {
      const email = body as CloudflareEmail
      emailFrom = email.from
      emailSubject = email.subject
      emailTo = email.to
      fullText = email.text
    } else if (isPostmark) {
      const email = body as PostmarkInboundEmail
      emailFrom = email.From
      emailSubject = email.Subject
      emailTo = email.To
      const textContent = email.TextBody || ''
      const htmlContent = (email.HtmlBody || '').replace(/<[^>]*>/g, ' ')
      fullText = textContent || htmlContent
    } else {
      console.error('[Tracking Inbound] Unknown email format')
      return NextResponse.json({ error: 'Unknown email format' }, { status: 400 })
    }
    
    console.log('[Tracking Inbound] ========================================')
    console.log('[Tracking Inbound] Received email from:', emailFrom)
    console.log('[Tracking Inbound] Subject:', emailSubject)
    console.log('[Tracking Inbound] To:', emailTo)
    console.log('[Tracking Inbound] Format:', isCloudflare ? 'Cloudflare' : 'Postmark')
    console.log('[Tracking Inbound] Email body length:', fullText.length)
    
    const supabase = getSupabaseAdminClient()
    if (!supabase) {
      console.error('[Tracking Inbound] Failed to get admin client')
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }
    
    // Check if automation is enabled
    const { data: settingsData } = await supabase
      .from('app_settings')
      .select('value')
      .eq('key', 'tracking_email_settings')
      .single()
    
    const settings = settingsData?.value as { enabled?: boolean } | undefined
    if (settings && settings.enabled === false) {
      console.log('[Tracking Inbound] Automation is disabled, skipping processing')
      return NextResponse.json({ 
        success: true, 
        message: 'Automation is disabled',
        processed: 0 
      })
    }
    
    // Parse shipments from the structured format
    let shipments = parseShipments(fullText)
    
    console.log('[Tracking Inbound] Parsed shipments:', shipments)
    
    // If structured parsing failed, try fallback extraction
    if (shipments.length === 0) {
      console.log('[Tracking Inbound] Structured parsing found nothing, trying fallback...')
      
      const trackingNumbers = extractUSPSTrackingNumbers(fullText)
      const orderNumbers = extractOrderNumbers(fullText)
      
      console.log('[Tracking Inbound] Fallback - Tracking numbers:', trackingNumbers)
      console.log('[Tracking Inbound] Fallback - Order numbers:', orderNumbers)
      
      // If we have matching counts, pair them
      if (trackingNumbers.length > 0 && trackingNumbers.length === orderNumbers.length) {
        shipments = trackingNumbers.map((tracking, i) => ({
          packageId: orderNumbers[i],
          trackingNumber: tracking
        }))
      }
    }
    
    if (shipments.length === 0) {
      console.log('[Tracking Inbound] No shipments found in email')
      return NextResponse.json({ 
        success: true, 
        message: 'No shipments found in email',
        processed: 0 
      })
    }
    
    let updatedCount = 0
    const results: Array<{ packageId: string; trackingNumber: string; status: string; details?: string }> = []
    
    for (const shipment of shipments) {
      console.log(`[Tracking Inbound] Processing: ${shipment.packageId} -> ${shipment.trackingNumber}`)
      
      // Find the order by order_number
      const { data: order, error: findError } = await supabase
        .from('orders')
        .select('id, order_number, status, tracking_number')
        .eq('order_number', shipment.packageId)
        .single()
      
      if (findError || !order) {
        console.log(`[Tracking Inbound] Order not found: ${shipment.packageId}`)
        const result = { 
          packageId: shipment.packageId,
          trackingNumber: shipment.trackingNumber,
          status: 'order_not_found',
          details: findError?.message
        }
        results.push(result)
        await logResult(supabase, shipment.packageId, shipment.trackingNumber, 'order_not_found', emailFrom, emailSubject, findError?.message)
        continue
      }
      
      // Check if already has tracking
      if (order.tracking_number) {
        console.log(`[Tracking Inbound] Order ${shipment.packageId} already has tracking: ${order.tracking_number}`)
        const result = { 
          packageId: shipment.packageId,
          trackingNumber: shipment.trackingNumber,
          status: 'already_has_tracking',
          details: `Existing tracking: ${order.tracking_number}`
        }
        results.push(result)
        await logResult(supabase, shipment.packageId, shipment.trackingNumber, 'already_has_tracking', emailFrom, emailSubject, `Existing: ${order.tracking_number}`)
        continue
      }
      
      // Update the order with tracking info
      const { error: updateError } = await supabase
        .from('orders')
        .update({
          tracking_number: shipment.trackingNumber,
          shipping_carrier: 'USPS',
          shipped_at: new Date().toISOString(),
          status: 'shipped'
        })
        .eq('id', order.id)
      
      if (updateError) {
        console.error(`[Tracking Inbound] Failed to update order ${shipment.packageId}:`, updateError)
        const result = { 
          packageId: shipment.packageId,
          trackingNumber: shipment.trackingNumber,
          status: 'update_failed',
          details: updateError.message
        }
        results.push(result)
        await logResult(supabase, shipment.packageId, shipment.trackingNumber, 'update_failed', emailFrom, emailSubject, updateError.message)
        continue
      }
      
      updatedCount++
      console.log(`[Tracking Inbound] ✓ Updated order ${shipment.packageId} with tracking ${shipment.trackingNumber}`)
      results.push({ 
        packageId: shipment.packageId,
        trackingNumber: shipment.trackingNumber,
        status: 'updated'
      })
      await logResult(supabase, shipment.packageId, shipment.trackingNumber, 'updated', emailFrom, emailSubject)
    }
    
    console.log('[Tracking Inbound] ========================================')
    console.log(`[Tracking Inbound] Complete: ${updatedCount}/${shipments.length} orders updated`)
    
    return NextResponse.json({
      success: true,
      message: `Processed ${shipments.length} shipment(s), updated ${updatedCount} order(s)`,
      shipments,
      results
    })
    
  } catch (error) {
    console.error('[Tracking Inbound] Error processing email:', error)
    return NextResponse.json({ 
      error: 'Failed to process email',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// Cloudflare/Postmark may send a GET/HEAD to verify the webhook URL
export async function GET() {
  return NextResponse.json({ 
    status: 'ok', 
    message: 'Tracking inbound email webhook is active',
    expectedFormat: 'Postal & More e-Receipt with Package ID and Tracking #',
    supports: ['Cloudflare Email Worker', 'Postmark Inbound']
  })
}

export async function HEAD() {
  return new NextResponse(null, { status: 200 })
}
