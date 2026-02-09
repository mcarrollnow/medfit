import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { fcmToken, deviceName, phoneNumber } = body

    if (!fcmToken || !deviceName) {
      return NextResponse.json({ error: 'fcmToken and deviceName are required' }, { status: 400 })
    }

    console.log('[SMS Register] Registering device:', deviceName)

    const supabase = await createServerClient()

    // Deactivate any existing active devices
    await supabase
      .from('sms_devices')
      .update({ active: false })
      .eq('active', true)

    // Insert or update the device
    const { data, error } = await supabase
      .from('sms_devices')
      .upsert({
        fcm_token: fcmToken,
        device_name: deviceName,
        phone_number: phoneNumber,
        active: true,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'fcm_token'
      })

    if (error) {
      console.error('[SMS Register] Error registering device:', error)
      return NextResponse.json({ error: 'Failed to register device' }, { status: 500 })
    }

    console.log('[SMS Register] Device registered successfully:', deviceName)
    
    return NextResponse.json({ 
      success: true, 
      message: 'SMS gateway device registered successfully',
      device: deviceName
    })

  } catch (error) {
    console.error('[SMS Register] Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
