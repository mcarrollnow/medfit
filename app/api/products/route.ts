import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const inStock = searchParams.get('inStock')
    const priceType = searchParams.get('priceType') || 'retail'
    
    const supabase = await createServerClient()
    
    // Build query
    let query = supabase
      .from('products')
      .select('id, barcode, name, base_name, variant, image_url, description, cart_product_detail, cart_image, current_stock, cost_price, b2b_price, retail_price, is_active, color')
      .eq('is_active', true)
    
    if (inStock === 'true') {
      query = query.gt('current_stock', 0)
    }
    
    query = query.order('base_name').order('variant')
    
    const { data, error } = await query
    
    if (error) {
      console.error('Error fetching products:', error)
      return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
    }
    
    // Add display_price based on priceType
    const productsWithDisplayPrice = data?.map(product => ({
      ...product,
      display_price: priceType === 'b2b' ? product.b2b_price : product.retail_price
    })) || []
    
    return NextResponse.json(productsWithDisplayPrice)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}