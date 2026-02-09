import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdminClient } from '@/lib/supabase-admin'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
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

    const { data: products, error } = await supabase
      .from('products')
      .select(`
        id,
        name,
        sku,
        current_stock,
        cost_price,
        b2b_price,
        retail_price,
        is_active,
        created_at
      `)
      .eq('is_active', true)
      .order('name', { ascending: true })

    if (error) {
      console.error('[Mobile Products List] Error:', error)
      return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders })
    }

    // Calculate inventory stats
    const totalItems = products?.length || 0
    const lowStock = products?.filter((p: any) => p.current_stock > 0 && p.current_stock <= 10).length || 0
    const outOfStock = products?.filter((p: any) => p.current_stock === 0).length || 0

    // Format products
    const formattedProducts = products?.map((p: any) => ({
      id: p.id,
      name: p.name,
      sku: p.sku,
      stock: p.current_stock || 0,
      cost: p.cost_price || 0,
      b2b_price: p.b2b_price || 0,
      retail_price: p.retail_price || 0,
    })) || []

    return NextResponse.json({ 
      products: formattedProducts,
      stats: {
        total: totalItems,
        lowStock,
        outOfStock,
      }
    }, { headers: corsHeaders })

  } catch (error: any) {
    console.error('[Mobile Products List] Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders })
  }
}
