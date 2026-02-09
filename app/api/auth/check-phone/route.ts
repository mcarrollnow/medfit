import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Check if a phone number exists and is verified in our system
// Used before allowing phone OTP login to prevent duplicate accounts
export async function POST(request: Request) {
  try {
    const { phone } = await request.json();

    if (!phone) {
      return NextResponse.json(
        { error: { message: 'Phone number is required' } },
        { status: 400 }
      );
    }

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { error: { message: 'Server configuration error' } },
        { status: 500 }
      );
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Format phone to E.164
    let formattedPhone = phone.replace(/\D/g, '');
    if (formattedPhone.length === 10) {
      formattedPhone = `+1${formattedPhone}`;
    } else if (!formattedPhone.startsWith('+')) {
      formattedPhone = `+${formattedPhone}`;
    }

    console.log('[Check Phone API] Looking up:', formattedPhone.slice(0, 5) + '***');

    // Check if this phone exists in our users table
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('id, email, phone_verified, first_name')
      .eq('phone', formattedPhone)
      .single();

    if (error || !user) {
      // Phone not found in our system
      console.log('[Check Phone API] Phone not found in users table');
      return NextResponse.json({
        exists: false,
        verified: false,
        message: 'This phone number is not registered. Please sign up or add it to your existing account.',
      });
    }

    if (!user.phone_verified) {
      // Phone exists but not verified
      console.log('[Check Phone API] Phone found but not verified');
      return NextResponse.json({
        exists: true,
        verified: false,
        email: user.email ? `${user.email.slice(0, 3)}***` : null,
        message: 'This phone number needs to be verified. Please log in with your email and verify your phone in Profile Settings.',
      });
    }

    // Phone exists and is verified - safe to proceed with OTP login
    console.log('[Check Phone API] Phone found and verified for user:', user.first_name);
    return NextResponse.json({
      exists: true,
      verified: true,
      firstName: user.first_name,
    });

  } catch (error: any) {
    console.error('[Check Phone API] Error:', error);
    return NextResponse.json(
      { error: { message: 'Failed to check phone number' } },
      { status: 500 }
    );
  }
}
