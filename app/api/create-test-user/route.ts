import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Create admin client if service role key is available
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    console.log('[Create Test User] Creating user:', email);

    // First, try to sign up normally
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: email || 'test@example.com',
      password: password || 'TestPassword123!',
      options: {
        data: {
          first_name: 'Test',
          last_name: 'User',
          role: 'customer'
        },
        emailRedirectTo: 'http://localhost:3000/login'
      }
    });

    if (signUpError) {
      console.error('[Create Test User] Signup error:', signUpError);

      // If user already exists, that's okay
      if (!signUpError.message?.includes('already registered')) {
        return NextResponse.json({
          success: false,
          error: signUpError.message
        }, { status: 400 });
      }
    }

    let userId = signUpData?.user?.id;

    // If we have service role key, we can confirm the email immediately
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );

      if (userId) {
        // Confirm the user's email immediately (skip email verification)
        const { error: confirmError } = await supabaseAdmin.auth.admin.updateUserById(
          userId,
          { email_confirm: true }
        );

        if (confirmError) {
          console.error('[Create Test User] Error confirming email:', confirmError);
        } else {
          console.log('[Create Test User] Email confirmed for user:', userId);
        }

        // Create user record in users table
        const { error: userError } = await supabaseAdmin
          .from('users')
          .upsert({
            auth_id: userId,
            email: email || 'test@example.com',
            first_name: 'Test',
            last_name: 'User',
            role: 'customer',
            created_at: new Date().toISOString()
          });

        if (userError) {
          console.error('[Create Test User] Error creating user record:', userError);
        }

        // Create customer record
        const { data: userData } = await supabaseAdmin
          .from('users')
          .select('id')
          .eq('auth_id', userId)
          .single();

        if (userData) {
          const { error: customerError } = await supabaseAdmin
            .from('customers')
            .upsert({
              user_id: userData.id,
              customer_type: 'retail',
              created_at: new Date().toISOString()
            });

          if (customerError) {
            console.error('[Create Test User] Error creating customer record:', customerError);
          }
        }
      }
    }

    // Now try to sign in
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: email || 'test@example.com',
      password: password || 'TestPassword123!'
    });

    if (signInError) {
      return NextResponse.json({
        success: false,
        message: 'User created but login failed. Email may need confirmation.',
        error: signInError.message,
        needsEmailConfirmation: true
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Test user created and logged in successfully!',
      user: {
        id: signInData?.user?.id,
        email: signInData?.user?.email,
        confirmed: true
      }
    });

  } catch (error: any) {
    console.error('[Create Test User] Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}