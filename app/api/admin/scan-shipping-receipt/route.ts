import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin } from '@/lib/auth-server'

export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = await verifyAdmin(request)
    if (!authResult.authenticated) {
      return NextResponse.json({ error: authResult.error }, { status: 401 })
    }

    const body = await request.json()
    const { image } = body

    if (!image) {
      return NextResponse.json({ error: 'Image required' }, { status: 400 })
    }

    // Check for Claude API key
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: 'Claude API key not configured' }, { status: 500 })
    }

    console.log('[Scan Receipt] Scanning shipping receipt with Claude Vision...')

    // Extract base64 data and detect proper media type
    let base64Data = image
    let mediaType = 'image/jpeg' // Default to JPEG
    
    // Remove data URL prefix if present and detect type
    if (image.includes('data:image')) {
      const match = image.match(/data:image\/(\w+);base64,(.+)/)
      if (match) {
        const detectedType = match[1].toLowerCase()
        base64Data = match[2]
        
        // Map to Claude-supported formats
        if (detectedType === 'png') {
          mediaType = 'image/png'
        } else if (detectedType === 'gif') {
          mediaType = 'image/gif'
        } else if (detectedType === 'webp') {
          mediaType = 'image/webp'
        } else {
          // Default to jpeg for jpg, jpeg, heic, heif, and others
          mediaType = 'image/jpeg'
        }
      }
    } else {
      // No data URL prefix, detect from base64 signature
      const firstChars = base64Data.substring(0, 10)
      if (firstChars.startsWith('iVBOR')) {
        mediaType = 'image/png'
      } else if (firstChars.startsWith('R0lGO')) {
        mediaType = 'image/gif'
      } else if (firstChars.startsWith('UklGR')) {
        mediaType = 'image/webp'
      } else {
        mediaType = 'image/jpeg' // Default
      }
    }

    console.log('[Scan Receipt] Detected media type:', mediaType)

    // Call Claude Vision API to extract shipping info
    const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: mediaType,
                  data: base64Data
                }
              },
              {
                type: 'text',
                text: `Analyze this shipping receipt and extract the following information in JSON format:

{
  "carrier": "UPS" | "USPS" | "FedEx" | "Other",
  "tracking_number": "the tracking number",
  "ship_date": "YYYY-MM-DD format if available",
  "estimated_delivery": "YYYY-MM-DD format if available",
  "service_type": "the shipping service/speed if mentioned",
  "confidence": "high" | "medium" | "low"
}

Rules:
- carrier must be one of: UPS, USPS, FedEx, or Other
- tracking_number is the most important field
- Use null for fields you cannot find
- confidence: "high" if clearly readable, "medium" if partially readable, "low" if guessing
- Return ONLY valid JSON, no other text`
              }
            ]
          }
        ]
      })
    })

    if (!anthropicResponse.ok) {
      const errorText = await anthropicResponse.text()
      console.error('Claude API error:', errorText)
      return NextResponse.json({ error: 'Failed to scan receipt' }, { status: 500 })
    }

    const data = await anthropicResponse.json()
    // Don't log full response - may contain PII from receipts
    console.log('[Scan Receipt] Claude response received, processing...')

    // Extract JSON from Claude's response
    const messageContent = data.content[0].text

    // Parse JSON from response (handle markdown code blocks)
    let extractedData: any
    try {
      // Remove markdown code blocks if present
      const jsonMatch = messageContent.match(/```json\s*([\s\S]*?)\s*```/) || 
                       messageContent.match(/```\s*([\s\S]*?)\s*```/) ||
                       [null, messageContent]
      const jsonText = jsonMatch[1] || messageContent
      extractedData = JSON.parse(jsonText.trim())
    } catch (parseError) {
      console.error('Failed to parse Claude response:', parseError)
      return NextResponse.json({ error: 'Failed to parse extracted data' }, { status: 500 })
    }

    console.log('[Scan Receipt] Extracted shipping data:', extractedData)

    // Validate required fields
    if (!extractedData.tracking_number) {
      return NextResponse.json({ 
        error: 'Could not extract tracking number from image',
        extracted: extractedData 
      }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      data: {
        carrier: extractedData.carrier || 'Other',
        tracking_number: extractedData.tracking_number,
        ship_date: extractedData.ship_date || null,
        estimated_delivery: extractedData.estimated_delivery || null,
        service_type: extractedData.service_type || null,
        confidence: extractedData.confidence || 'medium'
      }
    })

  } catch (error) {
    console.error('Error scanning shipping receipt:', error)
    return NextResponse.json({ error: 'Failed to scan receipt' }, { status: 500 })
  }
}
