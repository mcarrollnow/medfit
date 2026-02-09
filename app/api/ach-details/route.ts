import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { pin, customerEmail } = await request.json()

    if (!pin || !customerEmail) {
      return NextResponse.json(
        { error: 'PIN and email are required' },
        { status: 400 }
      )
    }

    // Verify customer PIN
    const { data: customer, error: fetchError } = await supabase
      .from('customer_payment_pins')
      .select('*')
      .eq('customer_email', customerEmail)
      .eq('is_active', true)
      .single()

    if (fetchError || !customer) {
      return NextResponse.json(
        { error: 'No payment access configured for this email' },
        { status: 401 }
      )
    }

    if (!customer.pin) {
      return NextResponse.json(
        { error: 'PIN not set up yet. Please complete setup first.' },
        { status: 401 }
      )
    }

    if (customer.pin !== pin) {
      return NextResponse.json(
        { error: 'Invalid PIN' },
        { status: 401 }
      )
    }

    // Return banking details if PIN is correct
    const paymentDetails = {
      // ACH/Wire details
      achDetails: {
        recipientName: process.env.ACH_RECIPIENT_NAME,
        recipientAddress: process.env.ACH_RECIPIENT_ADDRESS,
        accountNumber: process.env.ACH_ACCOUNT_NUMBER,
        achRoutingNumber: process.env.ACH_ROUTING_NUMBER,
        wireRoutingNumber: process.env.ACH_WIRE_ROUTING_NUMBER,
        swiftBic: process.env.ACH_SWIFT_BIC,
        intermediaryBic: process.env.ACH_INTERMEDIARY_BIC,
      },
      // Zelle details
      zelleDetails: {
        zelleEmail: process.env.ZELLE_EMAIL,
        zellePhone: process.env.ZELLE_PHONE,
        recipientName: process.env.ZELLE_RECIPIENT_NAME || process.env.ACH_RECIPIENT_NAME,
      }
    }

    return NextResponse.json(paymentDetails, { status: 200 })
  } catch (error) {
    console.error('Error in payment details route:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
