import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdminClient } from '@/lib/supabase-admin'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, x-mobile-api-key, Authorization',
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders })
}

function verifyMobileApiKey(request: NextRequest): boolean {
  const apiKey = request.headers.get('x-mobile-api-key') || 
                 request.headers.get('authorization')?.replace('Bearer ', '')
  const validKey = process.env.MOBILE_API_KEY
  
  if (!validKey) return false
  return apiKey === validKey
}

export async function GET(request: NextRequest) {
  try {
    if (!verifyMobileApiKey(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: corsHeaders })
    }

    const supabase = getSupabaseAdminClient()
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500, headers: corsHeaders })
    }

    // Get discount codes
    const { data: codes, error } = await supabase
      .from('discount_codes')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('[Mobile Promo Codes] Error:', error)
      return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders })
    }

    // Format promo codes
    const now = new Date()
    const promoCodes = codes?.map((c: any) => {
      let status: 'active' | 'expired' | 'disabled' = 'active'
      
      if (!c.is_active) {
        status = 'disabled'
      } else if (c.expires_at && new Date(c.expires_at) < now) {
        status = 'expired'
      } else if (c.max_uses && c.usage_count >= c.max_uses) {
        status = 'expired'
      }

      return {
        id: c.id,
        code: c.code,
        type: c.discount_type === 'percentage' ? 'percentage' : 'fixed',
        value: c.discount_value || 0,
        usageCount: c.usage_count || 0,
        maxUses: c.max_uses,
        status,
      }
    }) || []

    // Calculate stats
    const activeCodes = promoCodes.filter(c => c.status === 'active').length
    const totalUses = promoCodes.reduce((sum, c) => sum + c.usageCount, 0)

    return NextResponse.json({
      promoCodes,
      stats: {
        active: activeCodes,
        totalUses,
        totalRevenue: 0, // Would need to join with orders to calculate
      }
    }, { headers: corsHeaders })

  } catch (error: any) {
    console.error('[Mobile Promo Codes] Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders })
  }
}

// POST - Create new promo code
export async function POST(request: NextRequest) {
  try {
    if (!verifyMobileApiKey(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: corsHeaders })
    }

    const supabase = getSupabaseAdminClient()
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500, headers: corsHeaders })
    }

    const body = await request.json()
    const { code, type, value, maxUses, expiresAt } = body

    const { data, error } = await supabase
      .from('discount_codes')
      .insert({
        code: code.toUpperCase(),
        discount_type: type === 'percentage' ? 'percentage' : 'fixed_amount',
        discount_value: value,
        max_uses: maxUses || null,
        expires_at: expiresAt || null,
        is_active: true,
        usage_count: 0,
      })
      .select()
      .single()

    if (error) {
      console.error('[Mobile Promo Codes] Create error:', error)
      return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders })
    }

    return NextResponse.json({ promoCode: data }, { headers: corsHeaders })

  } catch (error: any) {
    console.error('[Mobile Promo Codes] Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders })
  }
}
