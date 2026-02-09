import { NextRequest, NextResponse } from 'next/server'
import { verifySupplier } from '@/lib/auth-server'
import { siteConfig } from '@/lib/site-config'

// POST - Create invoice on behalf of supplier
// Wraps the existing invoice creation endpoint with supplier_id auto-set
export async function POST(request: NextRequest) {
  try {
    const authResult = await verifySupplier(request)
    if (!authResult.authenticated) {
      return NextResponse.json({ error: authResult.error || 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    // Add supplier_id to the invoice creation request
    const invoiceBody = {
      ...body,
      supplier_id: authResult.user?.id,
    }

    // Forward to the main invoice creation endpoint internally
    const origin = request.headers.get('origin') || siteConfig.appUrl
    
    const response = await fetch(`${origin}/api/authorize-net/invoices`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': request.headers.get('cookie') || '',
      },
      body: JSON.stringify(invoiceBody),
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error: any) {
    console.error('[Supplier Invoices] Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// GET - List invoices created by this supplier
export async function GET(request: NextRequest) {
  try {
    const authResult = await verifySupplier(request)
    if (!authResult.authenticated) {
      return NextResponse.json({ error: authResult.error || 'Unauthorized' }, { status: 401 })
    }

    const { getSupabaseAdminClient } = await import('@/lib/supabase-admin')
    const supabase = getSupabaseAdminClient()
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 })
    }

    const { data: invoices, error } = await supabase
      .from('authorize_net_invoices')
      .select('*')
      .eq('supplier_id', authResult.user?.id)
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ invoices: invoices || [] })
  } catch (error: any) {
    console.error('[Supplier Invoices] Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
