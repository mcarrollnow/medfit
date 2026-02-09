import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdminClient } from '@/lib/supabase-admin'
import { verifyAdmin } from '@/lib/auth-server'

function generateSimpleQRPlaceholder(): string {
  // Simple QR-like placeholder SVG
  return `<svg viewBox="0 0 21 21" width="14mm" height="14mm" xmlns="http://www.w3.org/2000/svg"><rect width="21" height="21" fill="#fff"/><rect x="0" y="0" width="7" height="7" fill="#000"/><rect x="1" y="1" width="5" height="5" fill="#fff"/><rect x="2" y="2" width="3" height="3" fill="#000"/><rect x="14" y="0" width="7" height="7" fill="#000"/><rect x="15" y="1" width="5" height="5" fill="#fff"/><rect x="16" y="2" width="3" height="3" fill="#000"/><rect x="0" y="14" width="7" height="7" fill="#000"/><rect x="1" y="15" width="5" height="5" fill="#fff"/><rect x="2" y="16" width="3" height="3" fill="#000"/><rect x="8" y="8" width="5" height="5" fill="#000"/><rect x="9" y="9" width="3" height="3" fill="#fff"/><rect x="10" y="10" width="1" height="1" fill="#000"/></svg>`
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Verify admin authentication
    const authResult = await verifyAdmin(request)
    if (!authResult.authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = getSupabaseAdminClient()
    if (!supabase) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    // Fetch order with customer details
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(`
        id,
        order_number,
        created_at,
        tracking_number,
        shipping_carrier,
        customers (
          id,
          shipping_address_line1,
          shipping_address_line2,
          shipping_city,
          shipping_state,
          shipping_zip,
          shipping_country,
          phone,
          company_name,
          users!customers_user_id_fkey (
            first_name,
            last_name,
            email,
            phone
          )
        ),
        order_items (
          id,
          product_name,
          product_barcode,
          quantity,
          unit_price
        )
      `)
      .eq('id', id)
      .single()

    if (orderError || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Extract customer info
    const customer = order.customers as any
    const user = Array.isArray(customer?.users) ? customer.users[0] : customer?.users

    const recipient = {
      name: user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Customer' : 'Customer',
      company: customer?.company_name,
      address_line1: customer?.shipping_address_line1 || '',
      address_line2: customer?.shipping_address_line2,
      city: customer?.shipping_city || '',
      state: customer?.shipping_state || '',
      zip: customer?.shipping_zip || '',
      country: customer?.shipping_country || 'US',
      phone: user?.phone || customer?.phone
    }

    const sender = {
      name: 'Modern Health Pro',
      company: 'Modern Health Pro',
      address_line1: process.env.BUSINESS_ADDRESS_LINE1 || '',
      city: process.env.BUSINESS_CITY || '',
      state: process.env.BUSINESS_STATE || '',
      zip: process.env.BUSINESS_ZIP || '',
      country: 'US'
    }

    const trackingNumber = order.tracking_number || '—'
    const shipDate = order.created_at
      ? new Date(order.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
      : new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    const carrier = order.shipping_carrier || 'Standard'

    // Generate barcode pattern
    const barcodeHeights = [75, 85, 70, 90, 80, 75, 85, 70, 95, 80, 75, 90, 70, 85, 80, 75, 85, 70, 90, 80, 75, 85, 70, 95, 80, 75, 90, 70, 85, 80]
    const barcodeHTML = barcodeHeights.map((height, i) =>
      `<div style="width: ${i % 3 === 0 ? '3px' : '1.5px'}; height: ${height}%; background: #000;"></div>`
    ).join('')

    // Generate QR placeholder
    const qrCodeSVG = generateSimpleQRPlaceholder()

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Shipping Label - Order #${order.order_number}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet">
  <style>
    @page {
      size: 100mm 150mm;
      margin: 0;
    }
    @media print {
      body { margin: 0; }
      .no-print { display: none !important; }
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: #f5f5f5;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20px;
    }
    .print-bar {
      margin-bottom: 20px;
      display: flex;
      gap: 12px;
    }
    .print-bar button {
      padding: 10px 24px;
      font-size: 14px;
      font-weight: 600;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .print-btn {
      background: #000;
      color: #fff;
    }
    .print-btn:hover { background: #333; }
    .back-btn {
      background: #e5e5e5;
      color: #333;
    }
    .back-btn:hover { background: #d5d5d5; }
    .label-wrapper {
      width: 100mm;
      height: 150mm;
      background: white;
      box-shadow: 0 4px 24px rgba(0,0,0,0.15);
    }
    .label {
      width: 100%;
      height: 100%;
      padding: 4mm;
      display: flex;
      flex-direction: column;
    }
    .card {
      border: 2px solid #000;
      border-radius: 8px;
      height: 100%;
      padding: 4mm;
      display: flex;
      flex-direction: column;
    }
    .bordered-box { border: 1px solid #000; border-radius: 6px; }
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 3mm;
      padding-bottom: 3mm;
      border-bottom: 2px solid #000;
    }
    .header-label {
      font-family: 'Inter', sans-serif;
      font-size: 7pt;
      letter-spacing: 0.15em;
      color: #666;
      text-transform: uppercase;
      margin-bottom: 1mm;
    }
    .header-title {
      font-family: 'Playfair Display', serif;
      font-size: 18pt;
      font-weight: 600;
    }
    .header-title span { font-style: italic; font-weight: 400; }
    .header-icon { padding: 2mm; }
    .header-icon svg { width: 8mm; height: 8mm; stroke: #000; stroke-width: 1.5; fill: none; }
    .separator { height: 1px; background: #ccc; margin-bottom: 3mm; }
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2mm 4mm;
      margin-bottom: 3mm;
      padding-bottom: 3mm;
      border-bottom: 1px solid #ccc;
    }
    .info-label { font-size: 6pt; letter-spacing: 0.1em; color: #666; text-transform: uppercase; margin-bottom: 0.5mm; }
    .info-value { font-size: 9pt; font-weight: 500; }
    .address-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 3mm; flex: 1; margin-bottom: 3mm; }
    .address-box { padding: 3mm; }
    .address-label { font-size: 6pt; letter-spacing: 0.15em; color: #666; text-transform: uppercase; margin-bottom: 1.5mm; }
    .address-name { font-family: 'Playfair Display', serif; font-size: 12pt; font-weight: 600; margin-bottom: 1.5mm; }
    .address-detail { font-size: 9pt; color: #333; line-height: 1.4; }
    .bottom-section {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 3mm;
      padding-top: 3mm;
      border-top: 1px solid #ccc;
    }
    .qr-box { padding: 2mm; display: flex; flex-direction: column; align-items: center; }
    .qr-code-img { width: 14mm; height: 14mm; margin-bottom: 1.5mm; }
    .qr-code-img svg { width: 100%; height: 100%; }
    .qr-label { font-size: 5pt; letter-spacing: 0.1em; color: #666; text-transform: uppercase; }
    .barcode-section { flex: 1; display: flex; flex-direction: column; align-items: center; }
    .barcode-bars { width: 100%; display: flex; align-items: flex-end; justify-content: center; gap: 2px; height: 12mm; margin-bottom: 1.5mm; }
    .barcode-text { font-size: 8pt; font-weight: 500; letter-spacing: 0.05em; }
    .carrier-box { padding: 2mm; display: flex; flex-direction: column; align-items: center; }
    .carrier-box svg { width: 8mm; height: 8mm; stroke: #000; stroke-width: 1.5; fill: none; margin-bottom: 1.5mm; }
    .carrier-label { font-size: 5pt; letter-spacing: 0.1em; color: #666; text-transform: uppercase; }
    .footer { margin-top: 3mm; padding-top: 2mm; border-top: 2px solid #000; text-align: center; }
    .footer-text { font-size: 7pt; color: #333; font-style: italic; }
  </style>
</head>
<body>
  <div class="print-bar no-print">
    <button class="print-btn" onclick="window.print()">Print Label</button>
    <button class="back-btn" onclick="window.close()">Close</button>
  </div>
  <div class="label-wrapper">
    <div class="label">
      <div class="card">
        <div class="header">
          <div>
            <p class="header-label">Shipping Label</p>
            <h1 class="header-title">Modern Health<span> Pro</span></h1>
          </div>
          <div class="bordered-box header-icon">
            <svg viewBox="0 0 24 24"><path d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
          </div>
        </div>
        <div class="separator"></div>
        <div class="info-grid">
          <div>
            <p class="info-label">Tracking No.</p>
            <p class="info-value">${trackingNumber}</p>
          </div>
          <div>
            <p class="info-label">Ship Date</p>
            <p class="info-value">${shipDate}</p>
          </div>
          <div>
            <p class="info-label">Weight</p>
            <p class="info-value">—</p>
          </div>
          <div>
            <p class="info-label">Service</p>
            <p class="info-value">${carrier}</p>
          </div>
        </div>
        <div class="separator"></div>
        <div class="address-grid">
          <div class="bordered-box address-box">
            <p class="address-label">From</p>
            <h3 class="address-name">${sender.company}</h3>
            <div class="address-detail">
              <p>${sender.address_line1}</p>
              <p>${sender.city}, ${sender.state} ${sender.zip}</p>
              <p>${sender.country}</p>
            </div>
          </div>
          <div class="bordered-box address-box">
            <p class="address-label">Ship To</p>
            <h3 class="address-name">${recipient.name}</h3>
            <div class="address-detail">
              <p>${recipient.address_line1}</p>
              ${recipient.address_line2 ? `<p>${recipient.address_line2}</p>` : ''}
              <p>${recipient.city}, ${recipient.state} ${recipient.zip}</p>
              <p>${recipient.country}</p>
            </div>
          </div>
        </div>
        <div class="separator"></div>
        <div class="bottom-section">
          <div class="bordered-box qr-box">
            <div class="qr-code-img">${qrCodeSVG}</div>
            <p class="qr-label">Scan for Photos</p>
          </div>
          <div class="barcode-section">
            <div class="barcode-bars">${barcodeHTML}</div>
            <p class="barcode-text">${trackingNumber}</p>
          </div>
          <div class="bordered-box carrier-box">
            <svg viewBox="0 0 24 24"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
            <p class="carrier-label">Express</p>
          </div>
        </div>
        <div class="footer">
          <p class="footer-text">Handle with care · Keep dry · This side up</p>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      }
    })
  } catch (error) {
    console.error('Error generating shipping label:', error)
    return NextResponse.json({ error: 'Failed to generate shipping label' }, { status: 500 })
  }
}
