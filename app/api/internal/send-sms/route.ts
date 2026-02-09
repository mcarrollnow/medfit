import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import admin from 'firebase-admin'

// Initialize Firebase Admin
let firebaseApp: admin.app.App | null = null

function getFirebaseAdmin() {
  if (!firebaseApp) {
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
    }, 'internal-sms')
  }
  return firebaseApp
}

export async function POST(request: NextRequest) {
  try {
    // Validate internal service key
    const serviceKey = request.headers.get('x-service-key')
    const expectedKey = process.env.INTERNAL_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!serviceKey || !expectedKey || serviceKey !== expectedKey) {
      console.error('[Internal SMS] Invalid service key')
      return NextResponse.json({ error: 'Invalid service key' }, { status: 401 })
    }

    const body = await request.json()
    const { to, body: messageBody, metadata = {} } = body

    // Validate input
    if (!to || !messageBody) {
      return NextResponse.json({ error: 'to and body are required' }, { status: 400 })
    }

    console.log('[Internal SMS] Sending SMS to:', to)
    console.log('[Internal SMS] Message length:', messageBody.length)
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase environment variables')
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Get active SMS device from database
    const { data: device, error: dbError } = await supabase
      .from('sms_devices')
      .select('fcm_token, device_name')
      .eq('active', true)
      .order('updated_at', { ascending: false })
      .limit(1)
      .single()

    if (dbError || !device) {
      console.error('[Internal SMS] No active SMS device found:', dbError)
      return NextResponse.json({ 
        error: 'No active SMS device found',
        details: 'Please register an SMS gateway device first'
      }, { status: 500 })
    }

    console.log('[Internal SMS] Using device:', device.device_name)

    // Initialize Firebase Admin
    const firebaseAdmin = getFirebaseAdmin()

    // Prepare FCM message
    const fcmData: Record<string, string> = {
      phoneNumber: to,
      message: messageBody
    }
    
    // Add metadata if provided
    if (metadata.type) {
      fcmData.metadata_type = metadata.type
    }
    if (metadata.order_id) {
      fcmData.metadata_order_id = metadata.order_id
    }
    if (metadata.order_number) {
      fcmData.metadata_order_number = metadata.order_number
    }
    
    const fcmMessage = {
      data: fcmData,
      token: device.fcm_token,
      android: {
        priority: 'high' as const
      }
    }

    // Send FCM message
    const response = await firebaseAdmin.messaging().send(fcmMessage)
    console.log('[Internal SMS] FCM message sent successfully:', response)

    // Log the SMS send request
    await supabase
      .from('sms_conversations')
      .insert({
        phone_number: to,
        message_text: messageBody,
        direction: 'outgoing',
        status: 'pending',
        sent_at: new Date().toISOString(),
        metadata: metadata
      })

    return NextResponse.json({ 
      success: true, 
      sms_id: response,
      device: device.device_name
    })

  } catch (error: any) {
    console.error('[Internal SMS] Error sending SMS:', error)
    
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
