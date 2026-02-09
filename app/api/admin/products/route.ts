import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { verifyAdmin } from '@/lib/auth-server'

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdmin(request)
    if (!authResult.authenticated) {
      return NextResponse.json({ error: authResult.error || 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createServerClient()
    const { searchParams } = new URL(request.url)
    const includeInactive = searchParams.get('includeInactive')
    
    let query = supabase
      .from('products')
      .select(`
        *,
        category:category_id (
          id,
          name,
          color
        )
      `)
      .order('base_name')
      .order('variant')
    
    if (includeInactive !== 'true') {
      query = query.eq('is_active', true)
    }
    
    const { data, error } = await query
    
    if (error) {
      console.error('Error fetching products:', error)
      return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
    }
    
    // Include category data in response
    const products = data?.map(product => ({
      ...product,
      category_name: product.category?.name || null
    })) || []
    
    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdmin(request)
    if (!authResult.authenticated) {
      return NextResponse.json({ error: authResult.error || 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createServerClient()
    const body = await request.json()
    
    const {
      barcode,
      name,
      base_name,
      variant,
      category_id,
      image_url,
      description,
      initial_stock,
      current_stock,
      restock_level,
      cost_price,
      b2b_price,
      retail_price,
      is_active,
      cart_product_detail,
      cart_image
    } = body

    // Validate required fields
    if (!barcode || !name || !base_name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Check if barcode already exists
    const { data: existingProduct, error: checkError } = await supabase
      .from('products')
      .select('id')
      .eq('barcode', barcode)
      .maybeSingle()

    if (checkError) {
      console.error('Error checking barcode:', checkError)
      return NextResponse.json({ error: 'Failed to check barcode' }, { status: 500 })
    }

    if (existingProduct) {
      return NextResponse.json({ error: 'Product with this barcode already exists' }, { status: 400 })
    }

    // Insert new product
    const { data, error } = await supabase
      .from('products')
      .insert({
        barcode,
        name,
        base_name,
        variant: variant || null,
        category_id: category_id || null,
        image_url: image_url || null,
        description: description || null,
        cart_product_detail: cart_product_detail || null,
        cart_image: cart_image || null,
        initial_stock: initial_stock || 0,
        current_stock: current_stock || initial_stock || 0,
        restock_level: restock_level || 100,
        cost_price: cost_price || 0,
        b2b_price: b2b_price || 0,
        retail_price: retail_price || 0,
        is_active: is_active !== false
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating product:', error)
      return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}
