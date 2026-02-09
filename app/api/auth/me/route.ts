import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth-server'

export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request)
    
    if (!authResult.authenticated) {
      return NextResponse.json({ 
        authenticated: false, 
        error: authResult.error 
      }, { status: 401 })
    }
    
    return NextResponse.json({
      authenticated: true,
      user: authResult.user
    })
  } catch (error: any) {
    console.error('[Auth Me] Error:', error)
    return NextResponse.json({ 
      authenticated: false, 
      error: error.message 
    }, { status: 500 })
  }
}
