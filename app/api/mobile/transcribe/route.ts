import { NextRequest, NextResponse } from 'next/server'

// CORS headers for mobile app
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, x-mobile-api-key, Authorization',
}

// Handle preflight
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders })
}

// Verify mobile API key
function verifyMobileApiKey(request: NextRequest): boolean {
  const apiKey = request.headers.get('x-mobile-api-key') || 
                 request.headers.get('authorization')?.replace('Bearer ', '')
  const validKey = process.env.MOBILE_API_KEY
  
  if (!validKey) {
    console.warn('[Mobile API] MOBILE_API_KEY not configured')
    return false
  }
  
  return apiKey === validKey
}

export async function POST(request: NextRequest) {
  try {
    // Verify mobile API key
    if (!verifyMobileApiKey(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: corsHeaders })
    }

    // Check for OpenAI API key
    if (!process.env.OPENAI_API_KEY) {
      console.error('[Mobile Transcribe] OPENAI_API_KEY not configured')
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500, headers: corsHeaders })
    }

    const formData = await request.formData()
    const audioFile = formData.get('audio') as File | Blob

    if (!audioFile) {
      console.error('[Mobile Transcribe] No audio file in request')
      return NextResponse.json({ error: 'Audio file required' }, { status: 400, headers: corsHeaders })
    }

    // Get the audio data as a buffer
    const audioBuffer = await audioFile.arrayBuffer()
    const audioBytes = new Uint8Array(audioBuffer)
    
    console.log('[Mobile Transcribe] Received audio:', audioBytes.length, 'bytes')

    if (audioBytes.length < 100) {
      console.error('[Mobile Transcribe] Audio file too small:', audioBytes.length)
      return NextResponse.json({ error: 'Audio file too small or empty' }, { status: 400, headers: corsHeaders })
    }

    // Build prompt with common product names for better accuracy
    const prompt = `This is a voice command for a business management app. Common terms include:
Tirzepatide, Semaglutide, BPC-157, TB-500, NAD+, Glutathione, Methylene Blue, Rapamycin.
Pricing terms: B2B, wholesale, retail, cost price.
Actions: create invoice, show orders, ready to ship, pull up orders.
Listen carefully for customer names, product names, quantities, and dollar amounts.`

    // Create a proper File object for OpenAI
    const audioBlob = new Blob([audioBuffer], { type: 'audio/m4a' })
    const fileName = (audioFile as any).name || 'recording.m4a'

    // Create form data for Whisper API
    const whisperFormData = new FormData()
    whisperFormData.append('file', audioBlob, fileName)
    whisperFormData.append('model', 'whisper-1')
    whisperFormData.append('language', 'en')
    whisperFormData.append('prompt', prompt)

    console.log('[Mobile Transcribe] Sending to Whisper API...', fileName)

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: whisperFormData,
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[Mobile Transcribe] Whisper API error:', response.status, errorText)
      return NextResponse.json({ 
        error: 'Transcription failed', 
        details: `Whisper API: ${response.status}`,
        whisperError: errorText 
      }, { status: 500, headers: corsHeaders })
    }

    const result = await response.json()
    console.log('[Mobile Transcribe] Result:', result.text)

    return NextResponse.json({
      success: true,
      transcript: result.text,
    }, { headers: corsHeaders })

  } catch (error: any) {
    console.error('[Mobile Transcribe] Error:', error)
    return NextResponse.json({ 
      error: 'Transcription failed', 
      details: error?.message || 'Unknown error' 
    }, { status: 500, headers: corsHeaders })
  }
}
