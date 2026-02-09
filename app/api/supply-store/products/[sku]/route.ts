import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase-server"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sku: string }> }
) {
  try {
    const { sku } = await params
    const supabase = await createServerClient()
    
    // Get product by SKU
    const { data: product, error } = await supabase
      .from('supply_store_products')
      .select('*')
      .eq('sku', sku)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 })
      }
      console.error('[supply-store/products/sku] Error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }
    
    // Get related products from same category
    const { data: relatedProducts } = await supabase
      .from('supply_store_products')
      .select('*')
      .eq('category', product.category)
      .neq('sku', sku)
      .eq('in_stock', true)
      .limit(4)
    
    return NextResponse.json({ 
      product,
      relatedProducts: relatedProducts || []
    })
  } catch (error: any) {
    console.error('[supply-store/products/sku] Exception:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

