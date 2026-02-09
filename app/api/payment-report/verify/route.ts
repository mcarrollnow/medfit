import { NextRequest, NextResponse } from 'next/server'
import { getPaymentReport } from '@/app/actions/rep-wallet'

export async function POST(request: NextRequest) {
  try {
    const { token, pin } = await request.json()

    if (!token || !pin) {
      return NextResponse.json({ 
        success: false, 
        error: 'Token and PIN are required' 
      }, { status: 400 })
    }

    const result = await getPaymentReport(token, pin)

    if (result.success) {
      return NextResponse.json({
        success: true,
        payment: result.payment
      })
    } else {
      return NextResponse.json({
        success: false,
        error: result.error
      }, { status: 401 })
    }
  } catch (error) {
    console.error('[PaymentReport] Error verifying:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to verify access' 
    }, { status: 500 })
  }
}

