import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdminClient } from '@/lib/supabase-admin'
import { siteConfig } from '@/lib/site-config'

export async function POST(request: NextRequest) {
  try {
    const { userId, email, action } = await request.json()

    if (!userId || !action) {
      return NextResponse.json(
        { error: 'Missing userId or action' },
        { status: 400 }
      )
    }

    const adminClient = getSupabaseAdminClient()
    
    if (!adminClient) {
      return NextResponse.json(
        { error: 'Admin client not configured' },
        { status: 500 }
      )
    }

    // Get site URL with fallbacks
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL 
      || process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`
      || 'http://localhost:3000'
    
    console.log('[Auth Action] Using site URL:', siteUrl)

    switch (action) {
      case 'reset': {
        // Hardcode the full URL to ensure path is included
        const redirectTo = `${siteConfig.appUrl}/set-password`
        console.log('[Auth Action] Password reset redirectTo:', redirectTo)
        
        // Send password reset email
        const { error } = await adminClient.auth.resetPasswordForEmail(email, {
          redirectTo
        })

        if (error) {
          console.error('[Auth Action] Password reset error:', error)
          return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ success: true, message: 'Password reset email sent', redirectTo })
      }

      case 'magic': {
        // Send magic link
        const { error } = await adminClient.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/dashboard`
          }
        })

        if (error) {
          return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ success: true, message: 'Magic link sent' })
      }

      case 'delete': {
        // Delete user from auth
        const { error } = await adminClient.auth.admin.deleteUser(userId)

        if (error) {
          return NextResponse.json({ error: error.message }, { status: 500 })
        }

        // Also try to delete from users table (optional, might cascade)
        try {
          await adminClient.from('users').delete().eq('id', userId)
        } catch (e) {
          // Ignore if user doesn't exist in users table
        }

        return NextResponse.json({ success: true, message: 'User deleted' })
      }

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error: any) {
    console.error('Auth action error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

