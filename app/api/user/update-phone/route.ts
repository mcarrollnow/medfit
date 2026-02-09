import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const { userId, phone, phoneVerified } = await request.json();

    if (!userId || !phone) {
      return NextResponse.json(
        { error: { message: 'User ID and phone are required' } },
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

    // Update the users table
    const { error: updateError } = await supabaseAdmin
      .from('users')
      .update({
        phone,
        phone_verified: phoneVerified || false,
        phone_verified_at: phoneVerified ? new Date().toISOString() : null,
        preferred_auth_method: phoneVerified ? 'phone' : 'email',
        prompted_for_phone: true,
      })
      .eq('id', userId);

    if (updateError) {
      console.error('[Update Phone API] Error:', updateError);
      return NextResponse.json(
        { error: { message: 'Failed to update phone' } },
        { status: 500 }
      );
    }

    // Also update the customers table if exists
    await supabaseAdmin
      .from('customers')
      .update({ phone })
      .eq('user_id', userId);

    console.log('[Update Phone API] Updated phone for user:', userId);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[Update Phone API] Unexpected error:', error);
    return NextResponse.json(
      { error: { message: 'An unexpected error occurred' } },
      { status: 500 }
    );
  }
}
