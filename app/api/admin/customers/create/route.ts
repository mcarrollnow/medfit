import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdminClient } from '@/lib/supabase-admin'
import { verifyAdmin } from '@/lib/auth-server'
import crypto from 'crypto'

// Generate a secure random temporary password
function generateTempPassword(): string {
  return crypto.randomBytes(32).toString('base64')
}

export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdmin(request)
    if (!authResult.authenticated) {
      return NextResponse.json({ error: authResult.error || 'Unauthorized' }, { status: 401 })
    }

    const supabase = getSupabaseAdminClient()
    if (!supabase) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    // Parse request body
    const body = await request.json()
    const {
      first_name,
      last_name,
      email,
      phone,
      company_name,
      customer_type = 'retail',
      shipping_address_line1,
      shipping_city,
      shipping_state,
      shipping_zip,
      shipping_country,
      send_invite = true // Default to sending invite email
    } = body

    // Validate - need at least a name or company
    if (!first_name?.trim() && !company_name?.trim()) {
      return NextResponse.json({ error: 'First name or company name is required' }, { status: 400 })
    }

    console.log('[Create Customer] Creating customer:', { first_name, last_name, email, company_name })

    let userId = null
    let authUserId = null
    let inviteLink = null

    // If email is provided, create an auth user first
    if (email?.trim()) {
      const normalizedEmail = email.trim().toLowerCase()
      
      // Check if auth user already exists
      const { data: existingAuthUsers } = await supabase.auth.admin.listUsers()
      const existingAuthUser = existingAuthUsers?.users?.find(
        u => u.email?.toLowerCase() === normalizedEmail
      )

      if (existingAuthUser) {
        // Check if user record exists in users table
        const { data: existingUser } = await supabase
          .from('users')
          .select('id')
          .eq('email', normalizedEmail)
          .maybeSingle()

        if (existingUser) {
          // Check if this user already has a customer record
          const { data: existingCustomer } = await supabase
            .from('customers')
            .select('id')
            .eq('user_id', existingUser.id)
            .maybeSingle()

          if (existingCustomer) {
            return NextResponse.json({ error: 'A customer with this email already exists' }, { status: 400 })
          }

          userId = existingUser.id
          authUserId = existingAuthUser.id
        } else {
          return NextResponse.json({ error: 'An auth account with this email already exists' }, { status: 400 })
        }
      } else {
        // Create new auth user with auto-verification
        const tempPassword = generateTempPassword()
        
        const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
          email: normalizedEmail,
          password: tempPassword,
          email_confirm: true, // Auto-verify the email
          user_metadata: {
            first_name: first_name?.trim() || null,
            last_name: last_name?.trim() || null,
            phone: phone?.trim() || null,
            role: 'customer'
          }
        })

        if (authError) {
          console.error('[Create Customer] Error creating auth user:', authError)
          
          // Handle the case where auth user exists but wasn't found in listUsers (pagination issue)
          if (authError.code === 'email_exists') {
            // Try to find the existing user by looking them up via email in the users table
            const { data: existingUser } = await supabase
              .from('users')
              .select('id, auth_id')
              .eq('email', normalizedEmail)
              .maybeSingle()

            if (existingUser) {
              // Check if this user already has a customer record
              const { data: existingCustomer } = await supabase
                .from('customers')
                .select('id')
                .eq('user_id', existingUser.id)
                .maybeSingle()

              if (existingCustomer) {
                return NextResponse.json({ 
                  error: 'A customer with this email already exists',
                  existing_customer_id: existingCustomer.id 
                }, { status: 400 })
              }

              // User exists but no customer - we can create a customer for them
              userId = existingUser.id
              authUserId = existingUser.auth_id
              console.log('[Create Customer] Found existing user without customer record, linking:', existingUser.id)
            } else {
              // Auth user exists but no users table record
              // Return a helpful error message
              return NextResponse.json({ 
                error: 'A user with this email address has already been registered. Please use a different email or contact support.',
                code: 'email_exists'
              }, { status: 400 })
            }
          } else {
            return NextResponse.json({ error: 'Failed to create auth user', details: authError.message }, { status: 500 })
          }
        } else {

        authUserId = authUser.user.id
        console.log('[Create Customer] Created auth user:', authUserId)

        // Generate password reset link so customer can set their password
        if (send_invite) {
          const appUrl = process.env.NEXT_PUBLIC_MAIN_APP_URL || 'http://localhost:3000'
          const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
            type: 'recovery',
            email: normalizedEmail,
            options: {
              redirectTo: `${appUrl}/set-password`
            }
          })

          if (linkError) {
            console.error('[Create Customer] Error generating invite link:', linkError)
            // Don't fail the whole operation, just log the error
          } else {
            inviteLink = linkData.properties?.action_link
            console.log('[Create Customer] Generated password reset link')
          }
        }

        // Check if a user record was auto-created by a database trigger
        const { data: autoCreatedUser } = await supabase
          .from('users')
          .select('id')
          .eq('auth_id', authUserId)
          .maybeSingle()

        if (autoCreatedUser) {
          // User record was auto-created by trigger, update it with additional info
          console.log('[Create Customer] User record auto-created by trigger, updating:', autoCreatedUser.id)
          
          const { error: updateError } = await supabase
            .from('users')
            .update({
              email: normalizedEmail,
              first_name: first_name?.trim() || null,
              last_name: last_name?.trim() || null,
              phone: phone?.trim() || null,
              role: 'customer'
            })
            .eq('id', autoCreatedUser.id)

          if (updateError) {
            console.error('[Create Customer] Error updating auto-created user:', updateError)
          }

          userId = autoCreatedUser.id
        } else {
          // Create user record in users table
          const { data: newUser, error: userError } = await supabase
            .from('users')
            .insert({
              auth_id: authUserId,
              email: normalizedEmail,
              first_name: first_name?.trim() || null,
              last_name: last_name?.trim() || null,
              phone: phone?.trim() || null,
              role: 'customer'
            })
            .select()
            .single()

          if (userError) {
            console.error('[Create Customer] Error creating user record:', userError)
            // Try to clean up the auth user we just created
            await supabase.auth.admin.deleteUser(authUserId)
            return NextResponse.json({ error: 'Failed to create user record', details: userError.message }, { status: 500 })
          }

          userId = newUser.id
        }
        }
      }
    }

    // Check if a customer record was auto-created by a database trigger
    let customer: any = null
    
    if (userId) {
      const { data: autoCreatedCustomer } = await supabase
        .from('customers')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle()

      if (autoCreatedCustomer) {
        // Customer was auto-created by trigger, update it with the provided info
        console.log('[Create Customer] Customer record auto-created by trigger, updating:', autoCreatedCustomer.id)
        
        const { data: updatedCustomer, error: updateError } = await supabase
          .from('customers')
          .update({
            company_name: company_name?.trim() || autoCreatedCustomer.company_name,
            customer_type: customer_type || autoCreatedCustomer.customer_type || 'retail',
            phone: phone?.trim() || autoCreatedCustomer.phone,
            shipping_address_line1: shipping_address_line1?.trim() || autoCreatedCustomer.shipping_address_line1,
            shipping_city: shipping_city?.trim() || autoCreatedCustomer.shipping_city,
            shipping_state: shipping_state?.trim() || autoCreatedCustomer.shipping_state,
            shipping_zip: shipping_zip?.trim() || autoCreatedCustomer.shipping_zip,
            shipping_country: shipping_country?.trim() || autoCreatedCustomer.shipping_country || 'USA'
          })
          .eq('id', autoCreatedCustomer.id)
          .select()
          .single()

        if (updateError) {
          console.error('[Create Customer] Error updating auto-created customer:', updateError)
          return NextResponse.json({ error: 'Failed to update customer', details: updateError.message }, { status: 500 })
        }

        customer = updatedCustomer
      }
    }

    // If no auto-created customer, create one
    if (!customer) {
      const { data: newCustomer, error: customerError } = await supabase
        .from('customers')
        .insert({
          user_id: userId,
          company_name: company_name?.trim() || null,
          customer_type: customer_type || 'retail',
          phone: phone?.trim() || null,
          shipping_address_line1: shipping_address_line1?.trim() || null,
          shipping_city: shipping_city?.trim() || null,
          shipping_state: shipping_state?.trim() || null,
          shipping_zip: shipping_zip?.trim() || null,
          shipping_country: shipping_country?.trim() || 'USA'
        })
        .select()
        .single()

      if (customerError) {
        console.error('[Create Customer] Error creating customer:', customerError)
        return NextResponse.json({ error: 'Failed to create customer', details: customerError.message }, { status: 500 })
      }

      customer = newCustomer
      console.log('[Create Customer] Created customer:', customer.id)
    }

    // Return customer with user info
    const response: Record<string, any> = {
      id: customer.id,
      user_id: customer.user_id,
      auth_user_id: authUserId,
      first_name: first_name?.trim() || null,
      last_name: last_name?.trim() || null,
      email: email?.trim()?.toLowerCase() || null,
      phone: phone?.trim() || customer.phone,
      company_name: customer.company_name,
      customer_type: customer.customer_type,
      shipping_address_line1: customer.shipping_address_line1,
      shipping_city: customer.shipping_city,
      shipping_state: customer.shipping_state,
      shipping_zip: customer.shipping_zip,
      shipping_country: customer.shipping_country,
      total_orders: 0,
      total_spent: 0,
      invite_sent: !!inviteLink,
      message: inviteLink 
        ? 'Customer created! A password setup link has been generated.' 
        : (email ? 'Customer created! No invite email was sent.' : 'Customer created without email/login access.')
    }

    // Only include invite link in response if it was generated (admin can manually share if needed)
    if (inviteLink) {
      response.invite_link = inviteLink
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('[Create Customer] Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

