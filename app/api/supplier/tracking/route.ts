import { NextRequest, NextResponse } from "next/server"
import { getTrackingInfo } from "@/lib/aftership"
import { verifySupplier } from "@/lib/auth-utils"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  // Verify supplier or superadmin access
  const authResult = await verifySupplier(request)
  if (!authResult.authenticated) {
    return NextResponse.json({ error: authResult.error }, { status: 401 })
  }

  const trackingNumber = request.nextUrl.searchParams.get("tracking")

  if (!trackingNumber) {
    return NextResponse.json({ error: "Tracking number required" }, { status: 400 })
  }

  try {
    const trackingInfo = await getTrackingInfo(trackingNumber)

    if (!trackingInfo) {
      return NextResponse.json({ 
        error: "Unable to fetch tracking info",
        tracking_number: trackingNumber 
      }, { status: 404 })
    }

    return NextResponse.json(trackingInfo)
  } catch (error) {
    console.error("[Supplier Tracking API] Error:", error)
    return NextResponse.json({ error: "Failed to fetch tracking" }, { status: 500 })
  }
}
