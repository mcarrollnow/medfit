import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const customerId = params.id

    const { data: customer, error } = await supabase
      .from('customers')
      .select(`
        *,
        user:users!customers_user_id_fkey(email, phone, first_name, last_name, created_at),
        orders(
          id,
          order_number,
          status,
          total_amount,
          created_at,
          tracking_number,
          order_items(
            quantity,
            unit_price,
            product_name,
            product:products(name, description)
          )
        )
      `)
      .eq('id', customerId)
      .single()

    if (error) {
      console.error('[Customer API] Error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ customer: customer || null })
  } catch (error) {
    console.error('[Customer API] Exception:', error)
    return NextResponse.json({ error: 'Failed to fetch customer' }, { status: 500 })
  }
}
