import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdminClient } from '@/lib/supabase-admin'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
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

// GET product details - returns the product AND all variants with same base_name
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!verifyMobileApiKey(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: corsHeaders })
    }

    const { id } = await params
    const supabase = getSupabaseAdminClient()
    
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500, headers: corsHeaders })
    }

    // First get the clicked product
    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('[Mobile Products] Error fetching product:', error)
      return NextResponse.json({ error: 'Product not found' }, { status: 404, headers: corsHeaders })
    }

    // Then get all variants with the same base_name
    let variants: any[] = [product]
    
    if (product.base_name) {
      const { data: allVariants } = await supabase
        .from('products')
        .select('*')
        .eq('base_name', product.base_name)
        .eq('is_active', true)
        .order('variant')

      if (allVariants && allVariants.length > 0) {
        variants = allVariants
      }
    }

    return NextResponse.json({ 
      base_name: product.base_name || product.name,
      variants 
    }, { headers: corsHeaders })

  } catch (error: any) {
    console.error('[Mobile Products] Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders })
  }
}

// PUT update product
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!verifyMobileApiKey(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: corsHeaders })
    }

    const { id } = await params
    const body = await request.json()
    const supabase = getSupabaseAdminClient()
    
    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500, headers: corsHeaders })
    }

    // Build update object - only include fields that were sent
    const updateData: any = {}
    
    if (body.current_stock !== undefined) {
      updateData.current_stock = body.current_stock
    }
    if (body.cost_price !== undefined) {
      updateData.cost_price = body.cost_price
    }
    if (body.b2b_price !== undefined) {
      updateData.b2b_price = body.b2b_price
    }
    if (body.retail_price !== undefined) {
      updateData.retail_price = body.retail_price
    }
    if (body.name !== undefined) {
      updateData.name = body.name
    }
    if (body.is_active !== undefined) {
      updateData.is_active = body.is_active
    }

    const { data: product, error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('[Mobile Products] Error updating product:', error)
      return NextResponse.json({ error: 'Failed to update product' }, { status: 500, headers: corsHeaders })
    }

    console.log('[Mobile Products] Product updated:', id, updateData)

    return NextResponse.json({ success: true, product }, { headers: corsHeaders })

  } catch (error: any) {
    console.error('[Mobile Products] Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders })
  }
}
