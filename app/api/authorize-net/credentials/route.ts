import { NextResponse } from 'next/server'

// Return public credentials for Accept.js
// These are safe to expose to the client
export async function GET() {
  const apiLoginId = process.env.AUTHORIZE_NET_API_LOGIN_ID
  const clientKey = process.env.AUTHORIZE_NET_CLIENT_KEY
  
  if (!apiLoginId || !clientKey) {
    console.error('[Authorize.net] Missing API_LOGIN_ID or CLIENT_KEY')
    return NextResponse.json(
      { error: 'Payment service not configured' },
      { status: 500 }
    )
  }
  
  return NextResponse.json({
    apiLoginId,
    clientKey,
  })
}
