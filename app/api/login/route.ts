import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: { message: 'Email and password are required' } },
        { status: 400 }
      )
    }

    // Create Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Sign in with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      console.error('[Login API] Auth error:', error.message)
      return NextResponse.json(
        { error: { message: 'Invalid credentials' } },
        { status: 401 }
      )
    }

    if (!data.user || !data.session) {
      return NextResponse.json(
        { error: { message: 'Invalid credentials' } },
        { status: 401 }
      )
    }

    // Create admin client to fetch user profile
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Get user profile from database
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('auth_id', data.user.id)
      .single()

    if (profileError || !profile) {
      console.error('[Login API] Profile error:', profileError)
      return NextResponse.json(
        { error: { message: 'User profile not found' } },
        { status: 404 }
      )
    }

    return NextResponse.json({
      session: data.session,
      user: {
        id: profile.id,
        email: profile.email,
        first_name: profile.first_name,
        last_name: profile.last_name,
        role: profile.role
      }
    })
  } catch (error: any) {
    console.error('[Login API] Unexpected error:', error)
    return NextResponse.json(
      { error: { message: 'Login failed' } },
      { status: 500 }
    )
  }
}
