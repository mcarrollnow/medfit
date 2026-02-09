import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin } from '@/lib/auth-server'

export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdmin(request)
    if (!authResult.authenticated) {
      return NextResponse.json({ error: authResult.error }, { status: 401 })
    }

    // Check for OpenAI API key
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 })
    }

    const formData = await request.formData()
    const audioFile = formData.get('audio') as File
    const productHints = formData.get('productHints') as string

    if (!audioFile) {
      return NextResponse.json({ error: 'Audio file required' }, { status: 400 })
    }

    console.log('[Transcribe] Received audio file:', audioFile.name, audioFile.size, 'bytes')

    // Build prompt with product name hints for better accuracy
    let prompt = 'This is a voice memo for creating an invoice. Product names mentioned may include: '
    
    if (productHints) {
      try {
        const hints = JSON.parse(productHints)
        if (Array.isArray(hints) && hints.length > 0) {
          // Add product names as hints - Whisper uses these to improve accuracy
          prompt += hints.slice(0, 50).join(', ')
        }
      } catch (e) {
        // Fallback to common peptide/pharmaceutical names
        prompt += 'Tirzepatide, Semaglutide, BPC-157, TB-500, NAD+, Glutathione, Methylene Blue, Rapamycin'
      }
    } else {
      prompt += 'Tirzepatide, Semaglutide, BPC-157, TB-500, NAD+, Glutathione, Methylene Blue, Rapamycin'
    }
    
    prompt += '. Dosages are typically in mg (milligrams). Listen carefully for exact dosage numbers like 2mg, 5mg, 10mg, 15mg.'

    // Create form data for Whisper API
    const whisperFormData = new FormData()
    whisperFormData.append('file', audioFile)
    whisperFormData.append('model', 'whisper-1')
    whisperFormData.append('language', 'en')
    whisperFormData.append('prompt', prompt)

    console.log('[Transcribe] Sending to Whisper API with prompt hints...')

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: whisperFormData,
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[Transcribe] Whisper API error:', errorText)
      return NextResponse.json({ error: 'Transcription failed' }, { status: 500 })
    }

    const result = await response.json()
    console.log('[Transcribe] Whisper result:', result.text)

    return NextResponse.json({
      success: true,
      transcript: result.text,
    })

  } catch (error) {
    console.error('[Transcribe] Error:', error)
    return NextResponse.json({ error: 'Transcription failed' }, { status: 500 })
  }
}
