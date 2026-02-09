import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export type LabelStyle = 'classic' | 'glass'

export interface PrintJobData {
  job_type: 'shipping_label' | 'product_label' | 'packing_slip' | 'receipt'
  order_id?: string
  order_number?: string
  label_data: {
    // Shipping label fields
    recipient?: {
      name: string
      company?: string
      address_line1: string
      address_line2?: string
      city: string
      state: string
      zip: string
      country: string
      phone?: string
    }
    sender?: {
      name: string
      company?: string
      address_line1: string
      city: string
      state: string
      zip: string
      country: string
    }
    // Order details
    order_number?: string
    order_date?: string
    items?: Array<{
      name: string
      quantity: number
      sku?: string
      barcode?: string
    }>
    // Tracking
    tracking_number?: string
    carrier?: string
    // Shipping details
    weight?: string
    service?: string
    // Product label fields
    product_name?: string
    product_barcode?: string
    product_sku?: string
    product_price?: number
    // Custom content
    custom_text?: string
    // Label style
    label_style?: LabelStyle
  }
  printer_id?: string
  priority?: number
  created_by?: string
}

// GET - Fetch print jobs (for print agent polling)
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const status = searchParams.get('status') || 'pending'
  const limit = parseInt(searchParams.get('limit') || '10')
  const printer_id = searchParams.get('printer_id')

  try {
    let query = supabase
      .from('print_jobs')
      .select('*')
      .eq('status', status)
      .order('priority', { ascending: true })
      .order('created_at', { ascending: true })
      .limit(limit)

    if (printer_id) {
      query = query.or(`printer_id.eq.${printer_id},printer_id.is.null`)
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json({ jobs: data })
  } catch (error) {
    console.error('Error fetching print jobs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch print jobs' },
      { status: 500 }
    )
  }
}

// POST - Create a new print job
export async function POST(request: NextRequest) {
  try {
    const body: PrintJobData = await request.json()

    // Validate required fields
    if (!body.job_type || !body.label_data) {
      return NextResponse.json(
        { error: 'job_type and label_data are required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('print_jobs')
      .insert({
        job_type: body.job_type,
        order_id: body.order_id,
        order_number: body.order_number,
        label_data: body.label_data,
        printer_id: body.printer_id,
        priority: body.priority || 5,
        created_by: body.created_by || 'api',
        status: 'pending'
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ job: data })
  } catch (error) {
    console.error('Error creating print job:', error)
    return NextResponse.json(
      { error: 'Failed to create print job' },
      { status: 500 }
    )
  }
}
