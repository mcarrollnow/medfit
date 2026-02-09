import { NextRequest, NextResponse } from 'next/server'
import { siteConfig } from '@/lib/site-config'

export async function GET(request: NextRequest) {
  const clientId = process.env.REVOLUT_CLIENT_ID
  const isProduction = process.env.REVOLUT_ENVIRONMENT === 'production'
  
  if (!clientId) {
    return NextResponse.json(
      { error: 'REVOLUT_CLIENT_ID not configured' },
      { status: 500 }
    )
  }

  // Build the redirect URI (must match what's configured in Revolut)
  const redirectUri = `${siteConfig.appUrl}/api/revolut/callback`
  
  // Build the authorization URL
  const baseUrl = isProduction
    ? 'https://business.revolut.com'
    : 'https://sandbox-business.revolut.com'
  
  const authUrl = new URL(`${baseUrl}/app-consent`)
  authUrl.searchParams.set('client_id', clientId)
  authUrl.searchParams.set('redirect_uri', redirectUri)
  authUrl.searchParams.set('response_type', 'code')
  // Request all necessary scopes
  authUrl.searchParams.set('scope', 'READ,WRITE')

  console.log('[Revolut Authorize] Redirecting to:', authUrl.toString())
  
  return NextResponse.redirect(authUrl.toString())
}

