import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin } from '@/lib/auth-server'
import { sendEmail } from '@/lib/notifications'

export async function POST(request: NextRequest) {
  try {
    const authResult = await verifyAdmin(request)
    if (!authResult.authenticated) {
      return NextResponse.json({ error: authResult.error || 'Unauthorized' }, { status: 401 })
    }

    const { to, subject, html } = await request.json()

    if (!to || !subject || !html) {
      return NextResponse.json({ error: 'Missing required fields: to, subject, html' }, { status: 400 })
    }

    const result = await sendEmail({ to, subject, html })

    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Failed to send email' }, { status: 500 })
    }

    return NextResponse.json({ success: true, messageId: result.messageId })
  } catch (error: any) {
    console.error('[Email Templates] Send test error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
