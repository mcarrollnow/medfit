import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase-server"
import { verifySupplyStoreAccess } from "@/lib/auth-utils"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const businessType = searchParams.get('business_type')
    const category = searchParams.get('category')
    const brand = searchParams.get('brand')
    const search = searchParams.get('search')
    const limit = searchParams.get('limit')
    
    // Build query
    let query = supabase
      .from('supply_store_products')
      .select('*')
      .eq('in_stock', true)
      .order('product_name')
    
    // Filter by business type
    if (businessType) {
      query = query.contains('business_types', [businessType])
    }
    
    // Filter by category
    if (category) {
      query = query.eq('category', category)
    }
    
    // Filter by brand
    if (brand) {
      query = query.eq('brand', brand)
    }
    
    // Search
    if (search) {
      query = query.or(`product_name.ilike.%${search}%,brand.ilike.%${search}%,description.ilike.%${search}%`)
    }
    
    // Limit
    if (limit) {
      query = query.limit(parseInt(limit))
    }
    
    const { data: products, error } = await query
    
    if (error) {
      console.error('[supply-store/products] Error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ products: products || [] })
  } catch (error: any) {
    console.error('[supply-store/products] Exception:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

