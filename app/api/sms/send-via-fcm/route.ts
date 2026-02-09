import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { verifyAuth } from '@/lib/auth-server'
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
    })
  }
  return firebaseApp
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication (admin only)
    const authResult = await verifyAuth(request)
    if (!authResult.authenticated) {
      return NextResponse.json({ error: authResult.error }, { status: 401 })
    }

    if (authResult.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const body = await request.json()
    const { phoneNumber, message, rcsFeatures } = body

    // Validate input
    if (!phoneNumber || !message) {
      return NextResponse.json({ error: 'phoneNumber and message are required' }, { status: 400 })
    }

    console.log('Sending SMS via FCM:', { phoneNumber, messageLength: message.length })

    const supabase = await createServerClient()

    // Get active SMS device from database
    const { data: device, error: dbError } = await supabase
      .from('sms_devices')
      .select('fcm_token, device_name')
      .eq('active', true)
      .order('updated_at', { ascending: false })
      .limit(1)
      .single()

    if (dbError || !device) {
      console.error('No active SMS device found:', dbError)
      return NextResponse.json({ 
        error: 'No active SMS device found',
        details: 'Please register an SMS gateway device first'
      }, { status: 500 })
    }

    console.log('Using device:', device.device_name)

    // Initialize Firebase Admin
    const firebaseAdmin = getFirebaseAdmin()

    // Prepare FCM message with optional RCS features
    const fcmData: Record<string, string> = {
      phoneNumber: phoneNumber,
      message: message
    }
    
    // Add RCS features if provided
    if (rcsFeatures) {
      if (rcsFeatures.imageUrl) {
        fcmData.rcs_imageUrl = rcsFeatures.imageUrl
      }
      if (rcsFeatures.quickReplies && Array.isArray(rcsFeatures.quickReplies)) {
        fcmData.rcs_quickReplies = JSON.stringify(rcsFeatures.quickReplies)
      }
      if (rcsFeatures.brandColor) {
        fcmData.rcs_brandColor = rcsFeatures.brandColor
      }
      if (rcsFeatures.title) {
        fcmData.rcs_title = rcsFeatures.title
      }
      if (rcsFeatures.description) {
        fcmData.rcs_description = rcsFeatures.description
      }
      console.log('RCS features included:', Object.keys(rcsFeatures))
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
    console.log('FCM message sent successfully:', response)

    // Log the SMS send request
    await supabase
      .from('sms_conversations')
      .insert({
        phone_number: phoneNumber,
        message_text: message,
        direction: 'outgoing',
        status: 'pending',
        sent_at: new Date().toISOString()
      })

    return NextResponse.json({ 
      success: true, 
      messageId: response,
      device: device.device_name
    })

  } catch (error: any) {
    console.error('Error sending SMS via FCM:', error)
    
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
