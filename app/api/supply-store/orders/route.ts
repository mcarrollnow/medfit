import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase-server"
import { verifySupplyStoreAccess } from "@/lib/auth-utils"

export async function GET(request: NextRequest) {
  try {
    // Verify user has supply store access
    const authResult = await verifySupplyStoreAccess(request)
    if (!authResult.authenticated) {
      return NextResponse.json({ error: authResult.error }, { status: 401 })
    }
    
    const supabase = await createServerClient()
    
    // Get user's orders
    const { data: orders, error } = await supabase
      .from('supply_store_orders')
      .select('*')
      .eq('user_id', authResult.user?.authId)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('[supply-store/orders] Error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ orders: orders || [] })
  } catch (error: any) {
    console.error('[supply-store/orders] Exception:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

