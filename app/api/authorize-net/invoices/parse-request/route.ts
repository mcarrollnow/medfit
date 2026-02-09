import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin } from '@/lib/auth-server'
import { getSupabaseAdminClient } from '@/lib/supabase-admin'

interface ParsedProduct {
  name: string
  quantity: number
  custom_price?: number
  matched_product_id?: string
  matched_product_name?: string
  matched_confidence: 'high' | 'medium' | 'low' | 'none'
  // Include prices from matched product
  cost_price?: number
  b2b_price?: number
  retail_price?: number
}

interface ParsedDiscount {
  type: 'percentage' | 'fixed' | 'total_price'
  value: number
}

interface MatchedCustomer {
  id: string
  name: string
  email?: string
  company_name?: string
  phone?: string
  matched_confidence: 'high' | 'medium' | 'low' | 'none'
  // All potential matches for disambiguation
  alternatives?: Array<{
    id: string
    name: string
    email?: string
    company_name?: string
  }>
}

interface ParsedRequest {
  customer_name?: string
  customer_email?: string
  products: ParsedProduct[]
  discount?: ParsedDiscount
  notes?: string
  raw_text?: string
}

// Match customer by full name - require BOTH first and last name to match for common first names
async function matchCustomer(customerName: string | undefined): Promise<MatchedCustomer | null> {
  if (!customerName?.trim()) return null
  
  const supabase = getSupabaseAdminClient()
  if (!supabase) return null

  const nameParts = customerName.trim().split(/\s+/)
  const firstName = nameParts[0]?.toLowerCase()
  const lastName = nameParts.slice(1).join(' ')?.toLowerCase()

  console.log('[Customer Match] Searching for:', { customerName, firstName, lastName })

  // First, get customers matching by first name
  const { data: byFirstName } = await supabase
    .from('customers')
    .select(`
      id,
      company_name,
      phone,
      users:user_id (
        id,
        email,
        first_name,
        last_name
      )
    `)
    .limit(50)

  if (!byFirstName || byFirstName.length === 0) {
    return null
  }

  // Filter and score customers
  const candidates: Array<{
    id: string
    name: string
    firstName: string
    lastName: string
    email?: string
    company_name?: string
    phone?: string
    score: number
  }> = []

  for (const c of byFirstName) {
    const user = Array.isArray(c.users) ? c.users[0] : c.users
    if (!user) continue

    const custFirstName = (user.first_name || '').toLowerCase()
    const custLastName = (user.last_name || '').toLowerCase()
    const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim()
    
    let score = 0

    // Exact full name match = highest score
    if (custFirstName === firstName && custLastName === lastName) {
      score = 100
    }
    // First AND last name both partially match
    else if (custFirstName.includes(firstName) && custLastName.includes(lastName) && lastName) {
      score = 80
    }
    // Last name exact match + first name match
    else if (custLastName === lastName && custFirstName.includes(firstName) && lastName) {
      score = 70
    }
    // First name exact match only (risky for common names like Michael)
    else if (custFirstName === firstName && !lastName) {
      // Only first name provided - lower confidence
      score = 30
    }
    // First name matches but no last name provided
    else if (custFirstName.includes(firstName) && !lastName) {
      score = 20
    }
    // Company name match
    else if (c.company_name?.toLowerCase().includes(customerName.toLowerCase())) {
      score = 60
    }

    if (score > 0) {
      candidates.push({
        id: c.id,
        name: fullName,
        firstName: custFirstName,
        lastName: custLastName,
        email: user.email,
        company_name: c.company_name,
        phone: c.phone,
        score
      })
    }
  }

  // Sort by score descending
  candidates.sort((a, b) => b.score - a.score)

  console.log('[Customer Match] Candidates found:', candidates.slice(0, 5).map(c => ({ 
    name: c.name, 
    score: c.score 
  })))

  if (candidates.length === 0) {
    return null
  }

  const bestMatch = candidates[0]
  
  // Determine confidence
  let confidence: 'high' | 'medium' | 'low' | 'none' = 'none'
  if (bestMatch.score >= 80) {
    confidence = 'high'
  } else if (bestMatch.score >= 50) {
    confidence = 'medium'
  } else if (bestMatch.score >= 20) {
    confidence = 'low'
  }

  // Check if there are other candidates with similar first names (disambiguation needed)
  const sameFirstNameCandidates = candidates.filter(c => 
    c.firstName === bestMatch.firstName && c.id !== bestMatch.id
  )

  // If there are other people with the same first name and we don't have a high-confidence match,
  // include alternatives for disambiguation
  const alternatives = sameFirstNameCandidates.length > 0 && confidence !== 'high'
    ? candidates.slice(0, 5).map(c => ({
        id: c.id,
        name: c.name,
        email: c.email,
        company_name: c.company_name
      }))
    : undefined

  // If we have alternatives and low confidence, warn about ambiguity
  if (alternatives && alternatives.length > 1) {
    console.log('[Customer Match] AMBIGUOUS - Multiple customers with first name:', firstName, 
      'Alternatives:', alternatives.map(a => a.name))
  }

  return {
    id: bestMatch.id,
    name: bestMatch.name,
    email: bestMatch.email,
    company_name: bestMatch.company_name,
    phone: bestMatch.phone,
    matched_confidence: confidence,
    alternatives
  }
}

// Fuzzy match products using database search
async function matchProducts(productNames: Array<{ name: string; quantity: number; custom_price?: number }>): Promise<ParsedProduct[]> {
  const supabase = getSupabaseAdminClient()
  if (!supabase) return productNames.map(p => ({ ...p, matched_confidence: 'none' as const }))

  const results: ParsedProduct[] = []

  for (const item of productNames) {
    const itemNameLower = item.name.toLowerCase()
    
    // Extract dosage pattern if present (e.g., "5mg", "10 mg", "5 mg")
    const dosageMatch = itemNameLower.match(/(\d+)\s*mg/i)
    const dosage = dosageMatch ? dosageMatch[1] : null
    
    // Get search terms, keeping dosage terms even if short
    const searchTerms = itemNameLower
      .split(/[\s-]+/)
      .filter(t => t.length > 2 || /^\d+mg$/i.test(t) || /^\d+$/.test(t))
    
    let bestMatch: { id: string; name: string; score: number; cost_price: number; b2b_price: number; retail_price: number } | null = null

    // Search for the main product name (first substantial term)
    const mainTerm = searchTerms.find(t => t.length > 3 && !/^\d+/.test(t)) || searchTerms[0]
    
    if (mainTerm) {
      const { data: products } = await supabase
        .from('products')
        .select('id, name, base_name, variant, barcode, cost_price, b2b_price, retail_price')
        .or(`name.ilike.%${mainTerm}%,base_name.ilike.%${mainTerm}%,barcode.ilike.%${mainTerm}%`)
        .limit(20)

      if (products && products.length > 0) {
        for (const product of products) {
          const productNameLower = product.name.toLowerCase()
          const productVariant = (product.variant || '').toLowerCase()
          
          // Extract dosage from product name
          const productDosageMatch = productNameLower.match(/(\d+)\s*mg/i) || productVariant.match(/(\d+)\s*mg/i)
          const productDosage = productDosageMatch ? productDosageMatch[1] : null
          
          // Calculate base score from matched terms
          const matchedTerms = searchTerms.filter(t => 
            productNameLower.includes(t) || productVariant.includes(t)
          )
          let score = matchedTerms.length / searchTerms.length
          
          // CRITICAL: If dosages exist, they MUST match exactly
          if (dosage && productDosage) {
            if (dosage === productDosage) {
              // Exact dosage match - boost score significantly
              score += 0.5
            } else {
              // Dosage mismatch - heavily penalize this product
              score = score * 0.1
            }
          }
          
          // Prefer exact name matches
          if (productNameLower === itemNameLower) {
            score = 2.0
          }

          if (!bestMatch || score > bestMatch.score) {
            bestMatch = { 
              id: product.id, 
              name: product.name, 
              score,
              cost_price: product.cost_price || 0,
              b2b_price: product.b2b_price || 0,
              retail_price: product.retail_price || 0
            }
          }
        }
      }
    }

    // Determine confidence based on match score
    let confidence: 'high' | 'medium' | 'low' | 'none' = 'none'
    if (bestMatch) {
      if (bestMatch.score >= 1.0) confidence = 'high'
      else if (bestMatch.score >= 0.5) confidence = 'medium'
      else if (bestMatch.score >= 0.2) confidence = 'low'
    }

    results.push({
      name: item.name,
      quantity: item.quantity,
      custom_price: item.custom_price,
      matched_product_id: bestMatch?.id,
      matched_product_name: bestMatch?.name,
      matched_confidence: confidence,
      cost_price: bestMatch?.cost_price,
      b2b_price: bestMatch?.b2b_price,
      retail_price: bestMatch?.retail_price
    })
  }

  return results
}

export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdmin(request)
    if (!authResult.authenticated) {
      return NextResponse.json({ error: authResult.error }, { status: 401 })
    }

    const body = await request.json()
    const { image, text, productCatalog, customerCatalog } = body

    if (!image && !text) {
      return NextResponse.json({ error: 'Image or text required' }, { status: 400 })
    }

    // Check for Claude API key
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: 'Claude API key not configured' }, { status: 500 })
    }

    console.log('[Parse Request] Parsing order request with Claude...')

    // Build product catalog section for the prompt
    let productCatalogSection = ''
    if (productCatalog && Array.isArray(productCatalog) && productCatalog.length > 0) {
      productCatalogSection = `
AVAILABLE PRODUCTS IN CATALOG:
${productCatalog.slice(0, 100).join('\n')}

IMPORTANT: When you hear a product name that sounds similar to one in the catalog above, USE THE EXACT NAME FROM THE CATALOG.
Common speech recognition errors to watch for:
- "trepid", "tersip", "ter zep" → likely means "Tirzepatide"
- "sema glue", "semi glue" → likely means "Semaglutide"  
- "BPC", "beep c" → likely means "BPC-157"
- "TB", "tee bee" → likely means "TB-500"
- "glue ta thigh" → likely means "Glutathione"
- "meth a lean" → likely means "Methylene Blue"
- "rapa my" → likely means "Rapamycin"

Match the spoken product to the closest item in the catalog above.
`
    }

    // Build customer catalog section for the prompt
    let customerCatalogSection = ''
    if (customerCatalog && Array.isArray(customerCatalog) && customerCatalog.length > 0) {
      customerCatalogSection = `
KNOWN CUSTOMERS (use FULL NAME exactly as shown):
${customerCatalog.slice(0, 100).join('\n')}

CRITICAL CUSTOMER IDENTIFICATION RULES:
- When a customer name is mentioned, you MUST return the FULL NAME (first AND last name) EXACTLY as it appears above
- If only a first name is spoken and multiple customers share that first name, try to match using any additional context (company, location, etc.)
- If you cannot determine which customer is meant, return the full spoken name as-is
- NEVER abbreviate or modify customer names - use them exactly as shown in the list
- For common first names (Michael, John, David, etc.), the last name is ESSENTIAL for accurate identification

Example: If someone says "Michael" and the list has both "Michael Stroud" and "Michael Shahbazian", you need more context to choose. If they say "Michael Stroud" or "Stroud", return "Michael Stroud".
`
    }

    // Build the prompt
    const systemPrompt = `You are an AI assistant that extracts order/invoice information from requests.
${productCatalogSection}${customerCatalogSection}
Extract the following information and return it as JSON:

{
  "customer_name": "Full name of the customer if mentioned",
  "customer_email": "Email address if mentioned",
  "products": [
    {
      "name": "Product name EXACTLY as it appears in the catalog (with correct dosage)",
      "quantity": 1,
      "custom_price": null
    }
  ],
  "discount": null,
  "notes": "Any special requests or notes from the customer"
}

PRODUCT RULES:
- ONLY extract products that are EXPLICITLY and CLEARLY mentioned by name
- DO NOT add products that were not spoken/written - if in doubt, leave it out
- DO NOT guess or infer products - only include what was directly stated
- Default quantity to 1 if not specified
- Look for quantity patterns like "2x ProductName", "ProductName x2", "3 ProductName", or "#2" before/after product name
- The "#" symbol followed by a number indicates quantity (e.g., "#5" means quantity of 5)
- IMPORTANT: Include dosages, sizes, variants EXACTLY as mentioned (e.g., "BPC-157 5mg", "TB-500 10mg", "Semaglutide 5mg")
- Pay careful attention to numbers in product names - "5mg" is different from "2mg", "10mg" is different from "1mg"
- Common peptide dosages: 2mg, 5mg, 10mg, 15mg - transcribe these exactly as spoken
- If a CUSTOM PRICE is specified for a product (e.g., "BPC-157 at $50" or "TB-500 for $75 each" or "semaglutide 5mg for $40"), set custom_price to that number
- custom_price should be null if no specific price is mentioned for that product
- If the products array would be empty, return an empty array [] - do NOT make up products

DISCOUNT/TOTAL RULES:
- If a PERCENTAGE discount is mentioned (e.g., "10% off", "15% discount", "give them 20% off"), set discount to: {"type": "percentage", "value": 10}
- If a FIXED AMOUNT discount is mentioned (e.g., "$50 off", "take off $25", "$100 discount"), set discount to: {"type": "fixed", "value": 50}
- If a SPECIFIC TOTAL is requested (e.g., "total should be $500", "make it $300 total", "invoice for $1000", "$500" at the end, or just "$500"), set discount to: {"type": "total_price", "value": 500}
- A standalone "$" followed by a number (like "$500") typically means the total invoice amount
- discount should be null if no discount or total adjustment is mentioned

NOTES RULES:
- notes should ONLY contain explicit messages the customer wants on the invoice (e.g., "add a note saying thank you" or "include message: ship ASAP")
- DO NOT put product info, pricing tier, discount info, or any parsed data in notes
- notes should be null unless the user explicitly asks to add a note or message

CUSTOMER IDENTIFICATION RULES:
- Extract the FULL customer name (first AND last name) exactly as mentioned or as found in the customer list
- If only a first name is given and it matches a unique customer in the list, use their full name
- If a first name is given but matches MULTIPLE customers, return exactly what was said (do NOT guess)
- Include email only if explicitly mentioned in the request

GENERAL RULES:
- customer_name and customer_email should be null if not found
- Return ONLY valid JSON, no other text or explanation`

    let content: any[]

    if (image) {
      // Handle image input
      let base64Data = image
      let mediaType = 'image/jpeg'
      
      if (image.includes('data:image')) {
        const match = image.match(/data:image\/(\w+);base64,(.+)/)
        if (match) {
          const detectedType = match[1].toLowerCase()
          base64Data = match[2]
          
          if (detectedType === 'png') mediaType = 'image/png'
          else if (detectedType === 'gif') mediaType = 'image/gif'
          else if (detectedType === 'webp') mediaType = 'image/webp'
          else mediaType = 'image/jpeg'
        }
      }

      content = [
        {
          type: 'image',
          source: {
            type: 'base64',
            media_type: mediaType,
            data: base64Data
          }
        },
        {
          type: 'text',
          text: systemPrompt
        }
      ]
    } else {
      // Handle text input (email paste)
      content = [
        {
          type: 'text',
          text: `${systemPrompt}\n\nHere is the customer request to parse:\n\n${text}`
        }
      ]
    }

    // Call Claude API
    const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2048,
        messages: [
          {
            role: 'user',
            content
          }
        ]
      })
    })

    if (!anthropicResponse.ok) {
      const errorText = await anthropicResponse.text()
      console.error('Claude API error:', errorText)
      return NextResponse.json({ error: 'Failed to parse request' }, { status: 500 })
    }

    const data = await anthropicResponse.json()
    console.log('[Parse Request] Claude response received')

    // Extract JSON from Claude's response
    const messageContent = data.content[0].text

    // Parse JSON from response
    let extractedData: ParsedRequest
    try {
      const jsonMatch = messageContent.match(/```json\s*([\s\S]*?)\s*```/) || 
                       messageContent.match(/```\s*([\s\S]*?)\s*```/) ||
                       [null, messageContent]
      const jsonText = jsonMatch[1] || messageContent
      extractedData = JSON.parse(jsonText.trim())
    } catch (parseError) {
      console.error('Failed to parse Claude response:', parseError)
      return NextResponse.json({ error: 'Failed to parse extracted data' }, { status: 500 })
    }

    console.log('[Parse Request] Extracted data:', {
      customer: extractedData.customer_name,
      productCount: extractedData.products?.length || 0
    })

    // Match products to database
    const matchedProducts = await matchProducts(extractedData.products || [])

    // Match customer to database - critical for disambiguation
    const matchedCustomer = await matchCustomer(extractedData.customer_name)
    
    console.log('[Parse Request] Matched customer:', matchedCustomer ? {
      name: matchedCustomer.name,
      confidence: matchedCustomer.matched_confidence,
      hasAlternatives: !!matchedCustomer.alternatives?.length
    } : 'none')

    console.log('[Parse Request] Discount info:', extractedData.discount)

    return NextResponse.json({
      success: true,
      data: {
        // Include both the raw name from AI and the matched customer for disambiguation
        customer_name: matchedCustomer?.name || extractedData.customer_name || null,
        customer_email: matchedCustomer?.email || extractedData.customer_email || null,
        matched_customer: matchedCustomer,
        products: matchedProducts,
        discount: extractedData.discount || null,
        notes: extractedData.notes || null
      }
    })

  } catch (error) {
    console.error('Error parsing order request:', error)
    return NextResponse.json({ error: 'Failed to parse request' }, { status: 500 })
  }
}
