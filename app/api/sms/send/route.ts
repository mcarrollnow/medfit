import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdminClient } from '@/lib/supabase-admin'
import { verifyAdmin } from '@/lib/auth-server'
import admin from 'firebase-admin'

// Initialize Firebase Admin (singleton pattern)
let firebaseApp: admin.app.App | null = null

function getFirebaseAdmin() {
  if (firebaseApp) return firebaseApp
  
  // Check if already initialized
  if (admin.apps.length > 0) {
    firebaseApp = admin.apps[0]!
    return firebaseApp
  }
  
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
  
  if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !privateKey) {
    throw new Error('Firebase configuration missing')
  }

  firebaseApp = admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey,
    })
  })
  
  return firebaseApp
}

export async function POST(request: NextRequest) {
  console.log('[SMS Send] === POST request received ===')
  
  try {
    // Verify admin authentication
    console.log('[SMS Send] Verifying admin auth...')
    const authResult = await verifyAdmin(request)
    if (!authResult.authenticated) {
      console.log('[SMS Send] Auth failed:', authResult.error)
      return NextResponse.json({ error: authResult.error || 'Unauthorized' }, { status: 401 })
    }
    console.log('[SMS Send] Auth successful, user:', authResult.user?.email)

    const body = await request.json()
    console.log('[SMS Send] Request body:', { to: body.to, phoneNumber: body.phoneNumber, messageLength: body.message?.length })
    
    const { to, message, phoneNumber } = body

    // Support both 'to' and 'phoneNumber' param names
    const phone = to || phoneNumber

    if (!phone || !message) {
      console.log('[SMS Send] Missing required fields')
      return NextResponse.json({ error: 'Phone number and message are required' }, { status: 400 })
    }

    console.log('[SMS Send] Sending SMS to:', phone, 'length:', message.length)

    const supabase = getSupabaseAdminClient()
    if (!supabase) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    // Get active SMS device from database
    const { data: device, error: dbError } = await supabase
      .from('sms_devices')
      .select('fcm_token, device_name')
      .eq('active', true)
      .order('updated_at', { ascending: false })
      .limit(1)
      .single()

    if (dbError || !device) {
      console.error('[SMS Send] No active SMS device found:', dbError)
      return NextResponse.json({ 
        error: 'No active SMS device found',
        details: 'Please register an SMS gateway device first'
      }, { status: 500 })
    }

    console.log('[SMS Send] Using device:', device.device_name)

    // Initialize Firebase Admin
    const firebaseAdmin = getFirebaseAdmin()

    // Prepare FCM message
    const fcmMessage = {
      data: {
        phoneNumber: phone,
        message: message
      },
      token: device.fcm_token,
      android: {
        priority: 'high' as const
      }
    }

    // Send FCM message to Android device
    const response = await firebaseAdmin.messaging().send(fcmMessage)
    console.log('[SMS Send] FCM message sent successfully:', response)

    // Log the SMS send request
    await supabase
      .from('sms_conversations')
      .insert({
        phone_number: phone,
        message_text: message,
        direction: 'outgoing',
        status: 'pending',
        sent_at: new Date().toISOString()
      })

    return NextResponse.json({
      success: true,
      messageId: response,
      device: device.device_name,
    })

  } catch (error: any) {
    console.error('[SMS Send] Error:', error)
    
    // Check for specific Firebase errors
    if (error.code === 'messaging/registration-token-not-registered') {
      return NextResponse.json({ 
        error: 'Device token expired',
        details: 'Please re-register the SMS gateway device'
      }, { status: 410 })
    }
    
    return NextResponse.json({ 
      error: 'Failed to send SMS',
      details: error.message
    }, { status: 500 })
  }
}
