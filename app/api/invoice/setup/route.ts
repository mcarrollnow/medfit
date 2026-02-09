import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdminClient } from '@/lib/supabase-admin'
import { createClient } from '@supabase/supabase-js'

// Generate a unique random referral code
function generateReferralCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

// POST - Validate setup token and return invoice info
export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json({ error: 'Setup token required' }, { status: 400 })
    }

    const supabase = getSupabaseAdminClient()
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 })
    }

    // Find invoice by setup token
    const { data: invoice, error } = await supabase
      .from('authorize_net_invoices')
      .select('id, invoice_number, customer_email, customer_name, total, account_setup_completed')
      .eq('account_setup_token', token)
      .single()

    if (error || !invoice) {
      return NextResponse.json({ error: 'Invalid or expired setup link' }, { status: 404 })
    }

    if (invoice.account_setup_completed) {
      return NextResponse.json({ 
        error: 'Account already set up',
        invoice_id: invoice.id,
        already_completed: true
      }, { status: 400 })
    }

    // Check if user already exists (maybe they registered elsewhere)
    const { data: existingUser } = await supabase
      .from('users')
      .select('id, email')
      .eq('email', invoice.customer_email.toLowerCase())
      .single()

    return NextResponse.json({
      invoice_id: invoice.id,
      invoice_number: invoice.invoice_number,
      customer_email: invoice.customer_email,
      customer_name: invoice.customer_name,
      total: invoice.total,
      has_existing_account: !!existingUser,
    })

  } catch (error: any) {
    console.error('[Invoice Setup] Validate error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PUT - Complete account setup (create password, verify email code)
export async function PUT(request: NextRequest) {
  try {
    const { token, password, email_code } = await request.json()

    if (!token || !password) {
      return NextResponse.json({ error: 'Token and password are required' }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
    }

    const supabase = getSupabaseAdminClient()
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 })
    }

    // Find invoice by setup token
    const { data: invoice, error: invoiceError } = await supabase
      .from('authorize_net_invoices')
      .select('*')
      .eq('account_setup_token', token)
      .single()

    if (invoiceError || !invoice) {
      return NextResponse.json({ error: 'Invalid or expired setup link' }, { status: 404 })
    }

    if (invoice.account_setup_completed) {
      return NextResponse.json({ 
        error: 'Account already set up',
        invoice_id: invoice.id,
      }, { status: 400 })
    }

    // Determine if this is a supplier invoice
    const isSupplierInvoice = !!invoice.supplier_id
    const customerType = isSupplierInvoice ? 'supplier_customer' : 'retail'

    // Check if user already has an account
    const { data: existingUser } = await supabase
      .from('users')
      .select('id, auth_id')
      .eq('email', invoice.customer_email.toLowerCase())
      .single()

    if (existingUser) {
      // User already exists - just set the password on their auth account
      // and mark setup as complete
      const supabaseAuth = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      )

      await supabaseAuth.auth.admin.updateUserById(existingUser.auth_id, {
        password,
      })

      // Link invoice to customer
      const { data: customer } = await supabase
        .from('customers')
        .select('id')
        .eq('user_id', existingUser.id)
        .single()

      if (customer) {
        // If this is a supplier invoice, update the customer type and link
        if (isSupplierInvoice) {
          await supabase
            .from('customers')
            .update({
              customer_type: customerType,
              supplier_id: invoice.supplier_id,
            })
            .eq('id', customer.id)
          console.log('[Invoice Setup] Updated existing customer to supplier_customer:', customer.id)
        }

        await supabase
          .from('authorize_net_invoices')
          .update({ 
            account_setup_completed: true,
            customer_id: customer.id,
          })
          .eq('id', invoice.id)

        // Update any linked orders with customer info
        if (invoice.order_id) {
          const orderUpdate: any = {
            customer_id: customer.id,
            customer_name: invoice.customer_name,
            customer_email: invoice.customer_email,
            is_guest_order: false,
            guest_name: null,
            guest_email: null,
          }
          if (isSupplierInvoice) {
            orderUpdate.source = 'supplier'
            orderUpdate.supplier_id = invoice.supplier_id
          }
          await supabase
            .from('orders')
            .update(orderUpdate)
            .eq('id', invoice.order_id)
        }
      }

      // Sign the user in
      const signInClient = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      
      const { data: signInData } = await signInClient.auth.signInWithPassword({
        email: invoice.customer_email,
        password,
      })

      return NextResponse.json({
        success: true,
        invoice_id: invoice.id,
        session: signInData?.session || null,
        message: 'Account set up successfully',
      })
    }

    // Create new auth user with confirmed email
    const supabaseAuth = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Parse customer name into first/last
    const nameParts = (invoice.customer_name || '').trim().split(/\s+/)
    const firstName = nameParts[0] || ''
    const lastName = nameParts.slice(1).join(' ') || ''

    // Create auth user with email already confirmed
    const { data: authData, error: authError } = await supabaseAuth.auth.admin.createUser({
      email: invoice.customer_email,
      password,
      email_confirm: true,
      user_metadata: {
        first_name: firstName,
        last_name: lastName,
        role: 'customer',
      }
    })

    if (authError) {
      console.error('[Invoice Setup] Auth user creation error:', authError)
      
      if (authError.message?.includes('already') || authError.message?.includes('exists')) {
        return NextResponse.json({ 
          error: 'An account with this email already exists. Please sign in instead.',
        }, { status: 409 })
      }
      
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    if (!authData.user) {
      return NextResponse.json({ error: 'Failed to create account' }, { status: 500 })
    }

    console.log('[Invoice Setup] Auth user created:', authData.user.id)

    // Create user record
    const { data: newUser, error: userError } = await supabase
      .from('users')
      .insert({
        auth_id: authData.user.id,
        email: invoice.customer_email.toLowerCase(),
        first_name: firstName,
        last_name: lastName,
        role: 'customer',
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (userError) {
      console.error('[Invoice Setup] User record error:', userError)
    }

    // Create customer record
    let customerId: string | null = null
    if (newUser) {
      const referralCode = generateReferralCode()
      const customerInsert: any = {
        user_id: newUser.id,
        first_name: firstName,
        last_name: lastName,
        email: invoice.customer_email.toLowerCase(),
        customer_type: customerType,
        referral_code: referralCode,
        created_at: new Date().toISOString(),
      }
      
      // Link to supplier if this is a supplier invoice
      if (isSupplierInvoice) {
        customerInsert.supplier_id = invoice.supplier_id
      }

      const { data: newCustomer, error: customerError } = await supabase
        .from('customers')
        .insert(customerInsert)
        .select('id')
        .single()

      if (customerError) {
        console.error('[Invoice Setup] Customer record error:', customerError)
      } else {
        customerId = newCustomer?.id || null
        console.log('[Invoice Setup] Customer created:', customerId, 'type:', customerType, 'referral:', referralCode)
      }
    }

    // Mark invoice setup as complete and link to customer
    await supabase
      .from('authorize_net_invoices')
      .update({ 
        account_setup_completed: true,
        customer_id: customerId,
      })
      .eq('id', invoice.id)

    // Also update any orders linked to this invoice from guest to customer
    if (customerId && invoice.order_id) {
      const orderUpdate: any = {
        customer_id: customerId,
        customer_name: invoice.customer_name,
        customer_email: invoice.customer_email,
        is_guest_order: false,
        guest_name: null,
        guest_email: null,
      }
      if (isSupplierInvoice) {
        orderUpdate.source = 'supplier'
        orderUpdate.supplier_id = invoice.supplier_id
      }
      await supabase
        .from('orders')
        .update(orderUpdate)
        .eq('id', invoice.order_id)
      
      console.log('[Invoice Setup] Linked order', invoice.order_id, 'to customer', customerId, 'type:', customerType)
    }

    // Also update any other guest orders with this email
    const { data: otherGuestOrders } = await supabase
      .from('orders')
      .select('id')
      .eq('guest_email', invoice.customer_email)
      .eq('is_guest_order', true)

    if (otherGuestOrders && otherGuestOrders.length > 0) {
      for (const guestOrder of otherGuestOrders) {
        await supabase
          .from('orders')
          .update({
            customer_id: customerId,
            customer_name: invoice.customer_name,
            customer_email: invoice.customer_email,
            is_guest_order: false,
            guest_name: null,
            guest_email: null,
          })
          .eq('id', guestOrder.id)
      }
      console.log('[Invoice Setup] Linked', otherGuestOrders.length, 'additional guest orders to customer')
    }

    // Sign the user in
    const signInClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    
    const { data: signInData } = await signInClient.auth.signInWithPassword({
      email: invoice.customer_email,
      password,
    })

    console.log('[Invoice Setup] Account setup complete for:', invoice.customer_email)

    return NextResponse.json({
      success: true,
      invoice_id: invoice.id,
      session: signInData?.session || null,
      message: 'Account created successfully',
    })

  } catch (error: any) {
    console.error('[Invoice Setup] Complete error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
