import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    console.log('[Test Login] Attempting login for:', email);

    // Try to sign in
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.log('[Test Login] Error details:', {
        message: error.message,
        status: error.status,
        code: error.code,
        name: error.name
      });

      // Common error messages and solutions
      let solution = '';
      if (error.message?.includes('Invalid login credentials')) {
        solution = 'Wrong email or password. Try resetting your password.';
      } else if (error.message?.includes('Email not confirmed')) {
        solution = 'Please check your email and confirm your account.';
      } else if (error.message?.includes('User not found')) {
        solution = 'No account with this email. Please register first.';
      }

      return NextResponse.json({
        success: false,
        error: error.message,
        solution,
        details: error
      }, { status: 400 });
    }

    // Check if user exists in users table
    let userRecord = null;
    if (data?.user) {
      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('auth_id', data.user.id)
        .single();

      userRecord = userData;
    }

    return NextResponse.json({
      success: true,
      user: {
        id: data?.user?.id,
        email: data?.user?.email,
        emailConfirmed: data?.user?.email_confirmed_at ? true : false,
        hasUserRecord: !!userRecord,
        metadata: data?.user?.user_metadata
      },
      session: !!data?.session
    });

  } catch (error: any) {
    console.error('[Test Login] Unexpected error:', error);
    return NextResponse.json({
      success: false,
      error: 'Server error',
      details: error.message
    }, { status: 500 });
  }
}