import { NextResponse } from "next/server"

const API_BASE = "https://api.aftership.com/v4"

export async function GET() {
  const apiKey = process.env.AFTERSHIP_API_KEY

  if (!apiKey) {
    return NextResponse.json({ 
      success: false, 
      error: "AFTERSHIP_API_KEY not configured in environment variables" 
    })
  }

  try {
    // Test with a simple courier list call
    const response = await fetch(`${API_BASE}/couriers`, {
      headers: {
        "aftership-api-key": apiKey,
        "Content-Type": "application/json",
      },
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json({ 
        success: false, 
        error: data.meta?.message || "API request failed",
        status: response.status,
        details: data
      })
    }

    // Test detect with a known UPS tracking
    const detectResponse = await fetch(`${API_BASE}/couriers/detect`, {
      method: 'POST',
      headers: {
        "aftership-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tracking: {
          tracking_number: "1Z999AA10123456784"
        }
      })
    })

    const detectData = await detectResponse.json()

    return NextResponse.json({ 
      success: true, 
      message: "AfterShip API is working!",
      api_version: "v4",
      couriers_test: {
        status: response.status,
        total: data.data?.total || 0,
      },
      detect_test: {
        status: detectResponse.status,
        detected: detectData.data?.couriers?.map((c: {slug: string; name: string}) => c.name) || [],
        meta: detectData.meta
      }
    })
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error",
      type: "network_error"
    })
  }
}
