import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Check if a user exists by email
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Check in auth.users
    if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
      const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );

      const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers();

      if (error) {
        console.error('[Check User] Error:', error);
        return NextResponse.json({ error: 'Failed to check user' }, { status: 500 });
      }

      const user = users.find(u => u.email === email);

      if (user) {
        return NextResponse.json({
          exists: true,
          user: {
            id: user.id,
            email: user.email,
            email_confirmed: user.email_confirmed_at ? true : false,
            created_at: user.created_at,
            last_sign_in: user.last_sign_in_at
          }
        });
      }
    }

    // Check in users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (userData) {
      return NextResponse.json({
        exists: true,
        in_users_table: true,
        user: userData
      });
    }

    return NextResponse.json({
      exists: false,
      message: 'User not found in database'
    });

  } catch (error: any) {
    console.error('[Check User] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}