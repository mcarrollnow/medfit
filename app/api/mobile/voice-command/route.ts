import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdminClient } from '@/lib/supabase-admin'
import { getAuthorizeNetConfig, createHostedPaymentPage } from '@/lib/authorize-net'
import { sendEmail } from '@/lib/notifications'
import { siteConfig } from '@/lib/site-config'

// CORS headers for mobile app
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, x-mobile-api-key, Authorization',
}

// Handle preflight
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders })
}

// Verify mobile API key
function verifyMobileApiKey(request: NextRequest): boolean {
  const apiKey = request.headers.get('x-mobile-api-key') || 
                 request.headers.get('authorization')?.replace('Bearer ', '')
  const validKey = process.env.MOBILE_API_KEY
  
  if (!validKey) {
    console.warn('[Mobile API] MOBILE_API_KEY not configured')
    return false
  }
  
  return apiKey === validKey
}

interface VoiceCommandRequest {
  command: string
}

interface ParsedIntent {
  action: 'create_invoice' | 'get_orders_by_rep' | 'get_orders_ready_to_ship' | 'get_recent_orders' | 'check_inventory' | 'create_customer' | 'low_stock_report' | 'lookup_customer' | 'unknown'
  params: Record<string, any>
}

// Parse the voice command using Claude
async function parseCommand(command: string): Promise<ParsedIntent> {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('Anthropic API key not configured')
  }

  const systemPrompt = `You are a voice command parser for a medical supplies business. Parse the user's command and extract the intent and parameters.

AVAILABLE ACTIONS:
1. create_invoice - Create an invoice for a customer
   Parameters: customer_name, products (array of {name, quantity, pricing_tier}), total_override (optional number)
   
2. get_orders_by_rep - Get orders for a specific sales rep
   Parameters: rep_name, days (default 30)
   
3. get_orders_ready_to_ship - Get orders that are paid and need shipping
   Parameters: none
   
4. get_recent_orders - Get recent orders
   Parameters: limit (default 10), days (default 7)

5. check_inventory - Check stock level for a specific product
   Parameters: product_name (the product to check)

6. low_stock_report - Get all products that are low on stock
   Parameters: threshold (default 10, minimum stock to consider "low")

7. create_customer - Create a new customer account and send invite
   Parameters: email, first_name, last_name, company_name (optional), phone (optional)

8. lookup_customer - Look up/find a customer by name or company
   Parameters: search_term (the name or company to search for)

KNOWN PRODUCTS (normalize to these names):
- Tirzepatide (also: terzepatide, tirz, tirzep) - comes in 5mg, 10mg, 15mg
- Semaglutide (also: sema, semagutide) - comes in 2.4mg, 5mg, 10mg
- BPC-157
- TB-500
- NAD+
- Glutathione
- Methylene Blue
- Rapamycin

PRICING TIERS:
- "cost" or "cost price" = cost
- "b2b" or "wholesale" or "b2b price" = b2b (DEFAULT if not specified)
- "retail" or "retail price" = retail

IMPORTANT:
- Include dosage in product name if mentioned (e.g., "Semaglutide 10mg")
- If user says "one" or "a", quantity = 1
- If user mentions a dollar amount as "total", include it as total_override
- Correct common transcription errors (terzepatide -> Tirzepatide)
- For create_customer, extract email carefully from speech (e.g., "john at gmail dot com" = john@gmail.com)

RESPONSE FORMAT (JSON only):
{
  "action": "...",
  "params": { ... }
}

Examples:
- "Create invoice for John Mullins for 10 Tirzepatide 5mg at B2B price, total $4000" ->
  {"action": "create_invoice", "params": {"customer_name": "John Mullins", "products": [{"name": "Tirzepatide 5mg", "quantity": 10, "pricing_tier": "b2b"}], "total_override": 4000}}

- "Check inventory on Semaglutide 10mg" ->
  {"action": "check_inventory", "params": {"product_name": "Semaglutide 10mg"}}

- "What's low in stock" or "Show low inventory" ->
  {"action": "low_stock_report", "params": {"threshold": 10}}

- "Create customer John Smith email john at example dot com" ->
  {"action": "create_customer", "params": {"email": "john@example.com", "first_name": "John", "last_name": "Smith"}}

- "Pull up recent orders for rep Nathan" ->
  {"action": "get_orders_by_rep", "params": {"rep_name": "Nathan", "days": 30}}

- "Pull up customer John Mullins" or "Find customer John" or "Look up Acme Wellness" ->
  {"action": "lookup_customer", "params": {"search_term": "John Mullins"}}

Return ONLY valid JSON, no other text.`

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [
        { role: 'user', content: `Parse this voice command: "${command}"` }
      ],
      system: systemPrompt
    })
  })

  const data = await response.json()
  const text = data.content[0].text

  try {
    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || 
                     text.match(/```\s*([\s\S]*?)\s*```/) ||
                     [null, text]
    return JSON.parse(jsonMatch[1] || text)
  } catch {
    return { action: 'unknown', params: {} }
  }
}

// Create invoice using Authorize.net
async function createInvoice(params: any, supabase: any) {
  const { customer_name, products, total_override } = params

  if (!customer_name) {
    throw new Error('Customer name is required')
  }

  // Find customer by searching users table (first_name, last_name) via customers table
  let customer = null
  
  // First try to find by company name in customers table
  const { data: byCompany } = await supabase
    .from('customers')
    .select(`
      id,
      company_name,
      users:user_id (
        email,
        first_name,
        last_name
      )
    `)
    .ilike('company_name', `%${customer_name}%`)
    .limit(1)

  if (byCompany?.length > 0) {
    const c = byCompany[0]
    const user = Array.isArray(c.users) ? c.users[0] : c.users
    customer = {
      id: c.id,
      name: c.company_name || `${user?.first_name || ''} ${user?.last_name || ''}`.trim(),
      email: user?.email
    }
  }

  // If not found by company, search by user first/last name - STRICT matching
  if (!customer) {
    const nameParts = customer_name.trim().split(/\s+/)
    const firstName = nameParts[0]?.toLowerCase()
    const lastName = nameParts.slice(1).join(' ')?.toLowerCase()

    console.log('[Voice Command] Searching for customer:', { firstName, lastName })

    // Search customers table directly (with joined user data)
    const { data: customers } = await supabase
      .from('customers')
      .select(`
        id,
        company_name,
        users:user_id (
          id,
          email,
          first_name,
          last_name
        )
      `)
      .limit(200)

    console.log('[Voice Command] Found', customers?.length || 0, 'customers in database')

    if (customers && customers.length > 0) {
      type CustomerRecord = typeof customers[number]
      type UserRecord = { id: string; email: string; first_name: string; last_name: string }
      type ScoredCustomer = { customer: CustomerRecord; user: UserRecord | null; score: number }
      
      // Score each customer for best match
      const scoredCustomers: ScoredCustomer[] = customers.map((c: CustomerRecord) => {
        const user = Array.isArray(c.users) ? c.users[0] : c.users
        if (!user) return { customer: c, user: null, score: 0 }
        
        const uFirstName = (user.first_name || '').toLowerCase()
        const uLastName = (user.last_name || '').toLowerCase()
        let score = 0

        // Exact full name match = highest score
        if (uFirstName === firstName && uLastName === lastName) {
          score = 100
        }
        // First AND last name both match
        else if (uFirstName === firstName && lastName && uLastName.includes(lastName)) {
          score = 80
        }
        // Last name exact + first name match
        else if (lastName && uLastName === lastName && uFirstName.includes(firstName)) {
          score = 70
        }
        // First name only match - ONLY if no last name was provided AND unique
        else if (uFirstName === firstName && !lastName) {
          // Count how many customers have this first name
          const sameFirstNameCount = customers.filter((c2: CustomerRecord) => {
            const u2 = Array.isArray(c2.users) ? c2.users[0] : c2.users
            return u2 && (u2.first_name || '').toLowerCase() === firstName
          }).length
          // Only match if unique (no ambiguity)
          score = sameFirstNameCount === 1 ? 40 : 0
        }

        return { customer: c, user, score }
      }).filter((s: ScoredCustomer) => s.score > 0 && s.user)

      // Sort by score descending
      scoredCustomers.sort((a: ScoredCustomer, b: ScoredCustomer) => b.score - a.score)

      console.log('[Voice Command] Scored customers:', 
        scoredCustomers.slice(0, 5).map((s: ScoredCustomer) => `${s.user?.first_name} ${s.user?.last_name} (${s.score})`))

      if (scoredCustomers.length > 0) {
        const bestMatch = scoredCustomers[0]
        
        // If multiple matches with similar scores, return them all for user to choose
        const similarMatches = scoredCustomers.filter((s: ScoredCustomer) => s.score >= bestMatch.score - 20)
        
        if (similarMatches.length > 1 && bestMatch.score < 100) {
          // Multiple potential matches - return error with options
          console.warn('[Voice Command] AMBIGUOUS customer match. Candidates:', 
            similarMatches.map((s: ScoredCustomer) => `${s.user?.first_name} ${s.user?.last_name} (${s.score})`))
          
          const options = similarMatches.slice(0, 5).map((s: ScoredCustomer) => ({
            id: s.customer.id,
            name: `${s.user?.first_name} ${s.user?.last_name}`.trim(),
            email: s.user?.email,
            company: s.customer.company_name
          }))
          
          throw {
            type: 'MULTIPLE_MATCHES',
            message: `Multiple customers match "${customer_name}". Please be more specific or choose one:`,
            options
          }
        }

        customer = {
          id: bestMatch.customer.id,
          name: `${bestMatch.user?.first_name} ${bestMatch.user?.last_name}`.trim(),
          email: bestMatch.user?.email
        }
        
        console.log('[Voice Command] Matched customer:', customer.name, 'score:', bestMatch.score)
      }
    }
  }

  if (!customer) {
    throw new Error(`Customer "${customer_name}" not found. Try the full name as it appears in the system.`)
  }

  if (!customer.email) {
    throw new Error(`Customer "${customer_name}" has no email address`)
  }

  console.log('[Voice Command] Found customer:', customer)

  // Match products and get prices using fuzzy matching
  const invoiceItems = []
  for (const product of products || []) {
    // Normalize product name for better matching
    const itemNameLower = (product.name || '')
      .toLowerCase()
      .replace(/milligram/gi, 'mg')
      .replace(/microgram/gi, 'mcg')
      .replace(/milliliter/gi, 'ml')
    
    // Extract dosage pattern if present (e.g., "5mg", "10 mg", "5 mg")
    const dosageMatch = itemNameLower.match(/(\d+)\s*mg/i)
    const dosage = dosageMatch ? dosageMatch[1] : null
    
    // Get search terms
    const searchTerms = itemNameLower
      .split(/[\s-]+/)
      .filter(t => t.length > 2 || /^\d+mg$/i.test(t) || /^\d+$/.test(t))
    
    // Find main search term (first substantial word that isn't a number)
    const mainTerm = searchTerms.find(t => t.length > 3 && !/^\d+/.test(t)) || searchTerms[0]
    
    let bestMatch: any = null
    
    if (mainTerm) {
      const { data: dbProducts } = await supabase
        .from('products')
        .select('id, name, base_name, variant, cost_price, b2b_price, retail_price')
        .or(`name.ilike.%${mainTerm}%,base_name.ilike.%${mainTerm}%`)
        .eq('is_active', true)
        .limit(20)

      if (dbProducts && dbProducts.length > 0) {
        for (const p of dbProducts) {
          const productNameLower = (p.name || '').toLowerCase()
          const productVariant = (p.variant || '').toLowerCase()
          
          // Extract dosage from product name
          const productDosageMatch = productNameLower.match(/(\d+)\s*mg/i) || productVariant.match(/(\d+)\s*mg/i)
          const productDosage = productDosageMatch ? productDosageMatch[1] : null
          
          // Calculate score
          const matchedTerms = searchTerms.filter(t => 
            productNameLower.includes(t) || productVariant.includes(t)
          )
          let score = matchedTerms.length / Math.max(searchTerms.length, 1)
          
          // Dosage matching
          if (dosage && productDosage) {
            if (dosage === productDosage) {
              score += 0.5 // Exact dosage match
            } else {
              score = score * 0.1 // Dosage mismatch penalty
            }
          }
          
          if (!bestMatch || score > bestMatch.score) {
            bestMatch = { ...p, score }
          }
        }
      }
    }

    if (bestMatch && bestMatch.score >= 0.2) {
      const tier = product.pricing_tier || 'b2b'
      const price = tier === 'cost' ? bestMatch.cost_price : 
                    tier === 'retail' ? bestMatch.retail_price : 
                    bestMatch.b2b_price || bestMatch.retail_price || 0

      console.log('[Voice Command] Matched product:', product.name, '->', bestMatch.name, 'score:', bestMatch.score, 'price:', price)
      
      invoiceItems.push({
        product_id: bestMatch.id,
        description: bestMatch.name,
        quantity: product.quantity || 1,
        unit_price: price,
        pricing_tier: tier,
      })
    } else {
      console.log('[Voice Command] No match for product:', product.name, 'best score:', bestMatch?.score)
    }
  }

  // Calculate totals
  let subtotal = invoiceItems.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0)
  
  // If no products matched but we have a total override, create a generic line item
  if (invoiceItems.length === 0 && total_override && total_override > 0) {
    const productNames = (products || []).map(p => p.name).join(', ') || 'Products'
    invoiceItems.push({
      product_id: null,
      description: productNames,
      quantity: 1,
      unit_price: total_override,
      pricing_tier: 'custom',
    })
    subtotal = total_override
    console.log('[Voice Command] Using total override with generic item:', productNames, total_override)
  }
  
  if (invoiceItems.length === 0) {
    throw new Error(`Could not find products matching: ${(products || []).map(p => p.name).join(', ')}. Please use product names from the inventory.`)
  }
  
  const total = total_override || subtotal
  const manual_adjustment = total_override ? (total_override - subtotal) : 0
  
  console.log('[Voice Command] Invoice totals - subtotal:', subtotal, 'total:', total, 'adjustment:', manual_adjustment)

  // Create Authorize.net hosted payment page
  const config = getAuthorizeNetConfig()
  if (!config) {
    throw new Error('Authorize.net not configured')
  }

  const invoiceNumber = `INV-${Date.now().toString(36).toUpperCase()}`
  const origin = siteConfig.appUrl

  const paymentResult = await createHostedPaymentPage(config, {
    amount: total,
    orderId: invoiceNumber,
    orderNumber: invoiceNumber,
    customerEmail: customer.email,
    returnUrl: `${origin}/payment/success`,
    cancelUrl: `${origin}/payment/cancelled`,
    description: `Invoice ${invoiceNumber}`,
    lineItems: invoiceItems.map((item, idx) => ({
      itemId: String(idx + 1),
      name: item.description,
      description: '',
      quantity: item.quantity,
      unitPrice: item.unit_price,
    })),
  })

  // Store invoice
  const { data: invoice, error } = await supabase
    .from('authorize_net_invoices')
    .insert({
      invoice_number: invoiceNumber,
      customer_email: customer.email,
      customer_name: customer.name,
      items: JSON.stringify(invoiceItems),
      subtotal,
      manual_adjustment,
      total,
      status: 'draft',
      payment_url: paymentResult.success ? paymentResult.data?.formUrl : null,
      payment_token: paymentResult.success ? paymentResult.data?.token : null,
    })
    .select()
    .single()

  if (error) throw error

  // Send email
  if (paymentResult.success && paymentResult.data?.formUrl) {
    const invoicePageUrl = `${origin}/invoice/${invoice.id}`
    
    await sendEmail({
      to: customer.email,
      subject: `Invoice ${invoiceNumber} - $${total.toFixed(2)}`,
      html: generateInvoiceEmail(invoiceNumber, customer.name, total, invoicePageUrl),
    })

    await supabase
      .from('authorize_net_invoices')
      .update({ status: 'sent', sent_at: new Date().toISOString() })
      .eq('id', invoice.id)
  }

  return { invoice: { ...invoice, total } }
}

// Get orders for a specific rep
async function getOrdersByRep(params: any, supabase: any) {
  const { rep_name, days = 30 } = params

  // Find rep user
  const { data: reps } = await supabase
    .from('users')
    .select('id, first_name, last_name, email')
    .eq('role', 'rep')
    .or(`first_name.ilike.%${rep_name}%,last_name.ilike.%${rep_name}%`)
    .limit(5)

  if (!reps?.length) {
    throw new Error(`Rep "${rep_name}" not found`)
  }

  // Find best match
  const rep = reps.find(r => 
    `${r.first_name} ${r.last_name}`.toLowerCase().includes(rep_name.toLowerCase()) ||
    r.first_name?.toLowerCase().includes(rep_name.toLowerCase()) ||
    r.last_name?.toLowerCase().includes(rep_name.toLowerCase())
  ) || reps[0]
  
  const repName = `${rep.first_name || ''} ${rep.last_name || ''}`.trim()
  console.log('[Voice Command] Found rep:', repName)
  const sinceDate = new Date()
  sinceDate.setDate(sinceDate.getDate() - days)

  // Get customers assigned to this rep
  const { data: assignments } = await supabase
    .from('customer_rep_assignments')
    .select('customer_id')
    .eq('rep_id', rep.id)
    .eq('is_current', true)

  if (!assignments?.length) {
    return { orders: [], rep_name: repName, message: 'No customers assigned to this rep' }
  }

  const customerIds = assignments.map((a: any) => a.customer_id)

  // Get orders for these customers
  const { data: orders } = await supabase
    .from('orders')
    .select('id, order_number, total_amount, status, payment_status, created_at, customer:customers(company_name, user_id)')
    .in('customer_id', customerIds)
    .gte('created_at', sinceDate.toISOString())
    .order('created_at', { ascending: false })
    .limit(50)

  return {
    orders: orders?.map((o: any) => ({
      ...o,
      customer_name: o.customer?.company_name || 'Unknown',
    })) || [],
    rep_name: repName,
    days,
  }
}

// Get orders ready to ship
async function getOrdersReadyToShip(supabase: any) {
  const { data: orders } = await supabase
    .from('orders')
    .select('id, order_number, total_amount, status, payment_status, created_at, customer:customers(company_name), guest_name')
    .eq('payment_status', 'paid')
    .in('status', ['confirmed', 'processing', 'paid'])
    .is('tracking_number', null)
    .order('created_at', { ascending: true })
    .limit(50)

  return {
    orders: orders?.map((o: any) => ({
      ...o,
      customer_name: o.customer?.company_name || o.guest_name || 'Guest',
    })) || [],
  }
}

// Get recent orders
async function getRecentOrders(params: any, supabase: any) {
  const { limit = 10, days = 7 } = params
  
  const sinceDate = new Date()
  sinceDate.setDate(sinceDate.getDate() - days)

  const { data: orders } = await supabase
    .from('orders')
    .select('id, order_number, total_amount, status, payment_status, created_at, customer:customers(company_name), guest_name')
    .gte('created_at', sinceDate.toISOString())
    .order('created_at', { ascending: false })
    .limit(limit)

  return {
    orders: orders?.map((o: any) => ({
      ...o,
      customer_name: o.customer?.company_name || o.guest_name || 'Guest',
    })) || [],
  }
}

// Check inventory for a specific product
async function checkInventory(params: any, supabase: any) {
  const { product_name } = params

  if (!product_name) {
    throw new Error('Product name is required')
  }

  // Normalize search term
  const searchName = product_name
    .toLowerCase()
    .replace(/milligram/gi, 'mg')
    .replace(/microgram/gi, 'mcg')
    .replace(/milliliter/gi, 'ml')

  const mainTerm = searchName.split(/[\s-]+/).find(t => t.length > 3 && !/^\d+/.test(t)) || searchName.split(' ')[0]

  const { data: products } = await supabase
    .from('products')
    .select('id, name, base_name, variant, current_stock, cost_price, b2b_price, retail_price, is_active')
    .or(`name.ilike.%${mainTerm}%,base_name.ilike.%${mainTerm}%`)
    .eq('is_active', true)
    .order('name')
    .limit(10)

  if (!products?.length) {
    throw new Error(`No products found matching "${product_name}"`)
  }

  return {
    products: products.map((p: any) => ({
      id: p.id,
      name: p.name,
      current_stock: p.current_stock || 0,
      cost_price: p.cost_price,
      b2b_price: p.b2b_price,
      retail_price: p.retail_price,
    })),
    search_term: product_name,
  }
}

// Get low stock report
async function getLowStockReport(params: any, supabase: any) {
  const { threshold = 10 } = params

  const { data: products } = await supabase
    .from('products')
    .select('id, name, base_name, variant, current_stock')
    .eq('is_active', true)
    .lt('current_stock', threshold)
    .order('current_stock', { ascending: true })
    .limit(50)

  return {
    products: products?.map((p: any) => ({
      id: p.id,
      name: p.name,
      current_stock: p.current_stock || 0,
    })) || [],
    threshold,
  }
}

// Lookup customer by name or company
async function lookupCustomer(params: any, supabase: any) {
  const { search_term } = params

  if (!search_term) {
    throw new Error('Search term is required')
  }

  const customers: any[] = []
  const seenIds = new Set()

  // Split search term for first/last name matching
  const nameParts = search_term.trim().split(/\s+/)
  const firstName = nameParts[0]
  const lastName = nameParts.slice(1).join(' ') || firstName

  console.log('[Voice Command] Looking up customer:', { search_term, firstName, lastName })

  // Search by company name in customers table
  const { data: byCompany } = await supabase
    .from('customers')
    .select(`
      id,
      company_name,
      phone,
      shipping_city,
      shipping_state,
      users:user_id (
        id,
        email,
        first_name,
        last_name,
        phone
      )
    `)
    .ilike('company_name', `%${search_term}%`)
    .limit(10)

  console.log('[Voice Command] Company matches:', byCompany?.length || 0)

  // Add company matches
  for (const c of byCompany || []) {
    if (!seenIds.has(c.id)) {
      const user = Array.isArray(c.users) ? c.users[0] : c.users
      customers.push({
        id: c.id,
        company_name: c.company_name,
        first_name: user?.first_name,
        last_name: user?.last_name,
        email: user?.email,
        phone: c.phone || user?.phone,
        city: c.shipping_city,
        state: c.shipping_state,
      })
      seenIds.add(c.id)
    }
  }

  // Search by user first/last name - build OR query
  const searchConditions = [
    `first_name.ilike.%${firstName}%`,
    `last_name.ilike.%${lastName}%`,
  ]
  
  // Also search for full name in either field
  if (firstName !== lastName) {
    searchConditions.push(`first_name.ilike.%${lastName}%`)
    searchConditions.push(`last_name.ilike.%${firstName}%`)
  }

  const { data: byName } = await supabase
    .from('users')
    .select('id, email, first_name, last_name, phone')
    .eq('role', 'customer')
    .or(searchConditions.join(','))
    .limit(10)

  console.log('[Voice Command] Name matches:', byName?.length || 0)

  // Add name matches (need to get their customer record)
  for (const u of byName || []) {
    const { data: customerRecord } = await supabase
      .from('customers')
      .select('id, company_name, phone, shipping_city, shipping_state')
      .eq('user_id', u.id)
      .maybeSingle()

    if (customerRecord && !seenIds.has(customerRecord.id)) {
      customers.push({
        id: customerRecord.id,
        company_name: customerRecord.company_name,
        first_name: u.first_name,
        last_name: u.last_name,
        email: u.email,
        phone: customerRecord.phone || u.phone,
        city: customerRecord.shipping_city,
        state: customerRecord.shipping_state,
      })
      seenIds.add(customerRecord.id)
    }
  }

  console.log('[Voice Command] Total customers found:', customers.length)

  if (customers.length === 0) {
    throw new Error(`No customers found matching "${search_term}"`)
  }

  return {
    customers,
    search_term,
  }
}

// Create a new customer account
async function createCustomer(params: any, supabase: any) {
  const { email, first_name, last_name, company_name, phone } = params

  if (!email) {
    throw new Error('Email is required')
  }

  // Normalize email (convert "at" and "dot" to proper format)
  const normalizedEmail = email
    .toLowerCase()
    .replace(/\s+at\s+/gi, '@')
    .replace(/\s+dot\s+/gi, '.')
    .replace(/\s/g, '')
    .trim()

  // Check if customer already exists
  const { data: existingUser } = await supabase
    .from('users')
    .select('id, email')
    .eq('email', normalizedEmail)
    .single()

  if (existingUser) {
    throw new Error(`Customer with email "${normalizedEmail}" already exists`)
  }

  // Generate a temporary password
  const tempPassword = `MHP${Date.now().toString(36).toUpperCase()}!`

  // Create auth user
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: normalizedEmail,
    password: tempPassword,
    email_confirm: true,
    user_metadata: {
      first_name: first_name || '',
      last_name: last_name || '',
      role: 'customer',
    },
  })

  if (authError) {
    console.error('[Voice Command] Auth user creation error:', authError)
    throw new Error(`Failed to create user: ${authError.message}`)
  }

  const authUserId = authData.user?.id
  if (!authUserId) {
    throw new Error('Failed to get auth user ID')
  }

  // Check if user record was auto-created by a database trigger
  let user: any = null
  const { data: autoCreatedUser } = await supabase
    .from('users')
    .select('*')
    .eq('auth_id', authUserId)
    .maybeSingle()

  if (autoCreatedUser) {
    // User record was auto-created by trigger, update it with additional info
    console.log('[Voice Command] User record auto-created by trigger, updating:', autoCreatedUser.id)
    
    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .update({
        email: normalizedEmail,
        first_name: first_name?.trim() || null,
        last_name: last_name?.trim() || null,
        phone: phone?.trim() || null,
        role: 'customer'
      })
      .eq('id', autoCreatedUser.id)
      .select()
      .single()

    if (updateError) {
      console.error('[Voice Command] User update error:', updateError)
    }
    user = updatedUser || autoCreatedUser
  } else {
    // Create user record manually
    const { data: newUser, error: userError } = await supabase
      .from('users')
      .insert({
        auth_id: authUserId,
        email: normalizedEmail,
        first_name: first_name?.trim() || null,
        last_name: last_name?.trim() || null,
        phone: phone?.trim() || null,
        role: 'customer',
      })
      .select()
      .single()

    if (userError) {
      console.error('[Voice Command] User creation error:', userError)
      // Clean up auth user
      await supabase.auth.admin.deleteUser(authUserId)
      throw new Error(`Failed to create user record: ${userError.message}`)
    }
    user = newUser
  }

  if (!user) {
    await supabase.auth.admin.deleteUser(authUserId)
    throw new Error('Failed to create or find user record')
  }

  // Check if customer record was auto-created
  let customer: any = null
  const { data: existingCustomer } = await supabase
    .from('customers')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle()

  if (existingCustomer) {
    // Update existing customer record
    const { data: updatedCustomer, error: updateError } = await supabase
      .from('customers')
      .update({
        company_name: company_name?.trim() || existingCustomer.company_name,
        phone: phone?.trim() || existingCustomer.phone,
      })
      .eq('id', existingCustomer.id)
      .select()
      .single()
    
    if (updateError) {
      console.error('[Voice Command] Customer update error:', updateError)
    }
    customer = updatedCustomer || existingCustomer
  } else {
    // Create customer record
    const { data: newCustomer, error: customerError } = await supabase
      .from('customers')
      .insert({
        user_id: user.id,
        company_name: company_name?.trim() || null,
        phone: phone?.trim() || null,
      })
      .select()
      .single()

    if (customerError) {
      console.error('[Voice Command] Customer creation error:', customerError)
    }
    customer = newCustomer
  }

  // Send password reset email for them to set their own password
  const origin = siteConfig.appUrl
  const { error: resetError } = await supabase.auth.admin.generateLink({
    type: 'recovery',
    email: normalizedEmail,
    options: {
      redirectTo: `${origin}/set-password`,
    },
  })

  if (resetError) {
    console.log('[Voice Command] Password reset link generation warning:', resetError.message)
  }

  // Send welcome email
  try {
    await sendEmail({
      to: normalizedEmail,
      subject: 'Welcome to Medfit 90',
      html: generateWelcomeEmail(first_name || 'there', origin),
    })
  } catch (emailError) {
    console.log('[Voice Command] Welcome email warning:', emailError)
  }

  return {
    customer: {
      id: customer?.id || user.id,
      email: normalizedEmail,
      first_name,
      last_name,
      company_name,
    },
    message: `Customer account created. Welcome email sent to ${normalizedEmail}`,
  }
}

function generateWelcomeEmail(firstName: string, origin: string): string {
  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>Welcome</title></head>
<body style="margin:0;padding:0;background:#121212;font-family:-apple-system,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#121212;padding:48px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;">
<tr><td align="center" style="padding-bottom:32px;">
<p style="margin:0;font-size:10px;letter-spacing:0.3em;color:#a3a3a3;text-transform:uppercase;">Medfit 90</p>
</td></tr>
<tr><td style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:24px;padding:48px;">
<p style="margin:0 0 8px;font-size:10px;letter-spacing:0.3em;color:#a3a3a3;text-transform:uppercase;">Welcome</p>
<p style="margin:0 0 24px;font-size:28px;color:#f5f5f5;font-weight:300;">Hello ${firstName}!</p>
<p style="margin:0 0 32px;font-size:15px;color:#a3a3a3;line-height:1.6;">Your account has been created. Check your email for a password reset link to set your password and get started.</p>
<table width="100%"><tr><td align="center">
<a href="${origin}/login" style="display:inline-block;padding:16px 48px;background:#fff;color:#000;text-decoration:none;border-radius:12px;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;font-weight:600;">Login</a>
</td></tr></table>
</td></tr>
</table>
</td></tr>
</table>
</body></html>`
}

function generateInvoiceEmail(invoiceNumber: string, customerName: string, total: number, invoiceUrl: string): string {
  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>Invoice</title></head>
<body style="margin:0;padding:0;background:#121212;font-family:-apple-system,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#121212;padding:48px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;">
<tr><td align="center" style="padding-bottom:32px;">
<p style="margin:0;font-size:10px;letter-spacing:0.3em;color:#a3a3a3;text-transform:uppercase;">Medfit 90</p>
</td></tr>
<tr><td style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:24px;padding:48px;">
<p style="margin:0 0 8px;font-size:10px;letter-spacing:0.3em;color:#a3a3a3;text-transform:uppercase;">Invoice</p>
<p style="margin:0 0 24px;font-size:36px;color:#f5f5f5;font-weight:300;">${invoiceNumber}</p>
<p style="margin:0 0 32px;font-size:15px;color:#a3a3a3;line-height:1.6;">Hello ${customerName},<br><br>A new invoice has been prepared for you.</p>
<table width="100%" style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:16px;padding:24px;margin-bottom:32px;">
<tr><td>
<p style="margin:0 0 6px;font-size:9px;letter-spacing:0.3em;color:#737373;text-transform:uppercase;">Total Due</p>
<p style="margin:0;font-size:42px;color:#f5f5f5;font-weight:300;">$${total.toFixed(2)}</p>
</td></tr>
</table>
<table width="100%"><tr><td align="center">
<a href="${invoiceUrl}" style="display:inline-block;padding:16px 48px;background:#fff;color:#000;text-decoration:none;border-radius:12px;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;font-weight:600;">View Invoice & Pay</a>
</td></tr></table>
</td></tr>
</table>
</td></tr>
</table>
</body></html>`
}

export async function POST(request: NextRequest) {
  try {
    // Verify mobile API key
    if (!verifyMobileApiKey(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body: VoiceCommandRequest = await request.json()
    const { command } = body

    if (!command) {
      return NextResponse.json({ error: 'Command is required' }, { status: 400 })
    }

    console.log('[Voice Command] Received:', command)

    const supabase = getSupabaseAdminClient()
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
    }

    // Parse the command with AI
    const intent = await parseCommand(command)
    console.log('[Voice Command] Parsed intent:', intent)

    let result: any

    switch (intent.action) {
      case 'create_invoice':
        result = await createInvoice(intent.params, supabase)
        return NextResponse.json({
          success: true,
          action_type: 'invoice_created',
          title: 'Invoice Created',
          message: `Invoice sent to ${result.invoice.customer_email}`,
          data: result,
        })

      case 'get_orders_by_rep':
        result = await getOrdersByRep(intent.params, supabase)
        return NextResponse.json({
          success: true,
          action_type: 'orders_list',
          title: `Orders for ${result.rep_name}`,
          message: `${result.orders.length} orders in the last ${result.days} days`,
          data: result,
        })

      case 'get_orders_ready_to_ship':
        result = await getOrdersReadyToShip(supabase)
        return NextResponse.json({
          success: true,
          action_type: 'orders_list',
          title: 'Ready to Ship',
          message: `${result.orders.length} orders need shipping`,
          data: result,
        })

      case 'get_recent_orders':
        result = await getRecentOrders(intent.params, supabase)
        return NextResponse.json({
          success: true,
          action_type: 'orders_list',
          title: 'Recent Orders',
          message: `${result.orders.length} recent orders`,
          data: result,
        })

      case 'check_inventory':
        result = await checkInventory(intent.params, supabase)
        return NextResponse.json({
          success: true,
          action_type: 'inventory_list',
          title: `Inventory: ${result.search_term}`,
          message: `Found ${result.products.length} matching products`,
          data: result,
        })

      case 'low_stock_report':
        result = await getLowStockReport(intent.params, supabase)
        return NextResponse.json({
          success: true,
          action_type: 'inventory_list',
          title: 'Low Stock Report',
          message: `${result.products.length} products below ${result.threshold} units`,
          data: result,
        })

      case 'create_customer':
        result = await createCustomer(intent.params, supabase)
        return NextResponse.json({
          success: true,
          action_type: 'customer_created',
          title: 'Customer Created',
          message: result.message,
          data: result,
        })

      case 'lookup_customer':
        result = await lookupCustomer(intent.params, supabase)
        return NextResponse.json({
          success: true,
          action_type: 'customer_list',
          title: `Customers: ${result.search_term}`,
          message: `Found ${result.customers.length} matching customer${result.customers.length !== 1 ? 's' : ''}`,
          data: result,
        })

      default:
        return NextResponse.json({
          success: false,
          error: "I didn't understand that command. Try: 'Create invoice', 'Check inventory on [product]', 'Show low stock', 'Create customer [name] email [email]', or 'Show orders ready to ship'",
        })
    }

  } catch (error: any) {
    console.error('[Voice Command] Error:', error)
    
    // Handle multiple customer matches - return options for user to choose
    if (error.type === 'MULTIPLE_MATCHES') {
      return NextResponse.json({
        success: false,
        action_type: 'customer_selection_required',
        title: 'Multiple Customers Found',
        message: error.message,
        options: error.options,
      }, { status: 200 }) // 200 so the app can display the options
    }
    
    return NextResponse.json({
      success: false,
      error: error.message || 'Command failed',
    }, { status: 500 })
  }
}
