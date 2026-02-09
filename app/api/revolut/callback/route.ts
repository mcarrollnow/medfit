import { NextRequest, NextResponse } from 'next/server'
import * as jose from 'jose'
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { siteConfig } from '@/lib/site-config'

// This handles the OAuth callback from Revolut
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get('code')
    const error = searchParams.get('error')
    const errorDescription = searchParams.get('error_description')

    // Handle errors from Revolut
    if (error) {
      console.error('[Revolut Callback] Error:', error, errorDescription)
      return NextResponse.redirect(
        new URL(`/admin/revolut?error=${encodeURIComponent(errorDescription || error)}`, request.url)
      )
    }

    if (!code) {
      return NextResponse.redirect(
        new URL('/admin/revolut?error=No authorization code received', request.url)
      )
    }

    // Get environment variables
    const clientId = process.env.REVOLUT_CLIENT_ID
    const privateKeyPem = process.env.REVOLUT_PRIVATE_KEY
    const isProduction = process.env.REVOLUT_ENVIRONMENT === 'production'
    
    if (!clientId) {
      return NextResponse.redirect(
        new URL('/admin/revolut?error=REVOLUT_CLIENT_ID not configured', request.url)
      )
    }

    if (!privateKeyPem) {
      return NextResponse.redirect(
        new URL('/admin/revolut?error=REVOLUT_PRIVATE_KEY not configured', request.url)
      )
    }

    // Build the token endpoint URL and redirect URI
    const baseUrl = isProduction
      ? 'https://b2b.revolut.com'
      : 'https://sandbox-b2b.revolut.com'
    const tokenUrl = `${baseUrl}/api/1.0/auth/token`
    const redirectUri = `${siteConfig.appUrl}/api/revolut/callback`

    // Create JWT client assertion
    // Revolut expects:
    // - iss = domain of redirect URI (without https://)
    // - sub = client_id
    // - aud = "https://revolut.com"
    const issuer = siteConfig.domain
    const privateKey = await jose.importPKCS8(privateKeyPem, 'RS256')
    
    const clientAssertion = await new jose.SignJWT({})
      .setProtectedHeader({ alg: 'RS256', typ: 'JWT' })
      .setIssuedAt()
      .setIssuer(issuer)
      .setSubject(clientId)
      .setAudience('https://revolut.com')
      .setExpirationTime('2m')
      .sign(privateKey)

    console.log('[Revolut Callback] Exchanging code for token...')
    console.log('[Revolut Callback] Token URL:', tokenUrl)
    console.log('[Revolut Callback] Client ID:', clientId)
    console.log('[Revolut Callback] Issuer:', issuer)

    // Exchange code for access token
    const tokenResponse = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        client_id: clientId,
        redirect_uri: redirectUri,
        client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
        client_assertion: clientAssertion,
      }),
    })

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text()
      console.error('[Revolut Callback] Token exchange failed:', errorText)
      return NextResponse.redirect(
        new URL(`/admin/revolut?error=${encodeURIComponent('Token exchange failed: ' + errorText)}`, request.url)
      )
    }

    const tokenData = await tokenResponse.json()
    
    // Store the tokens securely
    // Option 1: Store in database (recommended for production)
    // Option 2: For now, we'll display it so user can add to Vercel env vars
    
    console.log('[Revolut Callback] Successfully obtained tokens')
    
    // For now, redirect with success and show instructions
    // In production, you'd store this in a secure database
    const successUrl = new URL('/admin/revolut', request.url)
    successUrl.searchParams.set('success', 'true')
    successUrl.searchParams.set('token_type', tokenData.token_type || 'Bearer')
    successUrl.searchParams.set('expires_in', tokenData.expires_in?.toString() || '')
    
    // SECURITY: Only log tokens in development mode
    // In production, tokens should be stored securely in the database
    if (process.env.NODE_ENV === 'development') {
      console.log('\n========================================')
      console.log('REVOLUT ACCESS TOKEN (add to Vercel env vars):')
      console.log('REVOLUT_API_KEY=' + tokenData.access_token)
      console.log('========================================\n')
    }
    
    if (tokenData.refresh_token && process.env.NODE_ENV === 'development') {
      console.log('REVOLUT_REFRESH_TOKEN=' + tokenData.refresh_token)
    }

    return NextResponse.redirect(successUrl)
  } catch (error: any) {
    console.error('[Revolut Callback] Error:', error)
    return NextResponse.redirect(
      new URL(`/admin/revolut?error=${encodeURIComponent(error.message || 'Unknown error')}`, request.url)
    )
  }
}

