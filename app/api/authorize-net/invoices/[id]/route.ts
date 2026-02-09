import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdminClient } from '@/lib/supabase-admin'
import { siteConfig } from '@/lib/site-config'

// GET - Get a single invoice
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = getSupabaseAdminClient()
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 })
    }

    const { data: invoice, error } = await supabase
      .from('authorize_net_invoices')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('[Authorize.net Invoices] Error fetching invoice:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
    }

    return NextResponse.json({ invoice })
  } catch (error: any) {
    console.error('[Authorize.net Invoices] Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PATCH - Update an invoice (status, void, cancel, archive, etc.)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = getSupabaseAdminClient()
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 })
    }

    const body = await request.json()
    const { status, action } = body

    // Build update object - only use columns that exist in the table
    const updateData: Record<string, any> = {
      updated_at: new Date().toISOString(),
    }

    // Handle specific actions - just update status
    if (action === 'void') {
      updateData.status = 'void'
    } else if (action === 'cancel') {
      updateData.status = 'cancelled'
    } else if (action === 'archive') {
      updateData.status = 'archived'
    } else if (status) {
      updateData.status = status
      
      // Add timestamps for specific status changes (these columns exist)
      if (status === 'sent' && !body.skip_timestamp) {
        updateData.sent_at = new Date().toISOString()
      } else if (status === 'paid') {
        updateData.paid_at = new Date().toISOString()
      }
    }

    const { data: invoice, error } = await supabase
      .from('authorize_net_invoices')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('[Authorize.net Invoices] Error updating invoice:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log('[Authorize.net Invoices] Invoice updated:', {
      id,
      action: action || 'status_update',
      newStatus: updateData.status,
    })

    return NextResponse.json({ invoice })
  } catch (error: any) {
    console.error('[Authorize.net Invoices] Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PUT - Full update of an invoice (edit items, customer, etc.)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = getSupabaseAdminClient()
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 })
    }

    const body = await request.json()
    const {
      customer_name,
      customer_email,
      items,
      notes,
      due_date,
      subtotal,
      tax,
      total,
      manual_adjustment,
      send_email,
      is_hidden,
    } = body

    // Validate required fields
    if (!customer_email || !customer_name) {
      return NextResponse.json({ error: 'Customer name and email are required' }, { status: 400 })
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'At least one item is required' }, { status: 400 })
    }

    // Build update object
    const updateData: Record<string, any> = {
      customer_name,
      customer_email,
      items: JSON.stringify(items),
      notes: notes || null,
      due_date: due_date || null,
      subtotal: subtotal || 0,
      tax_amount: tax || 0,
      total: total || subtotal || 0,
      manual_adjustment: manual_adjustment || 0,
      updated_at: new Date().toISOString(),
    }
    
    // Preserve is_hidden if provided
    if (is_hidden !== undefined) {
      updateData.is_hidden = is_hidden
    }

    const { data: invoice, error } = await supabase
      .from('authorize_net_invoices')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('[Authorize.net Invoices] Error updating invoice:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log('[Authorize.net Invoices] Invoice fully updated:', {
      id,
      invoice_number: invoice?.invoice_number,
      items_count: items.length,
    })

    // TODO: If total changed significantly, may want to regenerate payment link
    // For now, just return the updated invoice

    return NextResponse.json({ 
      invoice,
      invoice_url: invoice?.payment_url ? `${siteConfig.appUrl}/invoice/${id}` : null,
    })
  } catch (error: any) {
    console.error('[Authorize.net Invoices] Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE - Delete an invoice
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = getSupabaseAdminClient()
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 })
    }

    // First check if the invoice exists and its status
    const { data: existingInvoice, error: fetchError } = await supabase
      .from('authorize_net_invoices')
      .select('status, invoice_number')
      .eq('id', id)
      .single()

    if (fetchError || !existingInvoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
    }

    // Prevent deletion of paid invoices (they should be archived instead)
    if (existingInvoice.status === 'paid') {
      return NextResponse.json({ 
        error: 'Cannot delete a paid invoice. Please archive it instead.' 
      }, { status: 400 })
    }

    const { error } = await supabase
      .from('authorize_net_invoices')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('[Authorize.net Invoices] Error deleting invoice:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log('[Authorize.net Invoices] Invoice deleted:', {
      id,
      invoice_number: existingInvoice.invoice_number,
    })

    return NextResponse.json({ success: true, message: 'Invoice deleted successfully' })
  } catch (error: any) {
    console.error('[Authorize.net Invoices] Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
