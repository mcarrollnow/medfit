import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// FOR DEVELOPMENT ONLY - Auto-confirm user email
// In production, remove this endpoint and use proper email confirmation

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    console.log('[Confirm Email] Auto-confirming email for:', email);

    // If we have service role key, we can update the user directly
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      // Get the user by email
      const { data: { users }, error: getUserError } = await supabaseAdmin.auth.admin.listUsers();

      if (getUserError) {
        console.error('[Confirm Email] Error getting users:', getUserError);
        return NextResponse.json({ error: 'Failed to find user' }, { status: 500 });
      }

      const user = users.find(u => u.email === email);

      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      // Update user to confirmed
      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
        user.id,
        { email_confirm: true }
      );

      if (updateError) {
        console.error('[Confirm Email] Error confirming email:', updateError);
        return NextResponse.json({ error: 'Failed to confirm email' }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        message: 'Email confirmed successfully (dev mode)'
      });
    } else {
      // Without service role, we can't auto-confirm
      // But we can provide instructions
      return NextResponse.json({
        success: false,
        message: 'Cannot auto-confirm without service role key. Please check your email or disable email confirmation in Supabase dashboard.',
        instructions: [
          '1. Go to your Supabase dashboard',
          '2. Navigate to Authentication > Providers > Email',
          '3. Disable "Confirm email" for development',
          '4. Or add SUPABASE_SERVICE_ROLE_KEY to .env.local'
        ]
      });
    }
  } catch (error: any) {
    console.error('[Confirm Email] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}