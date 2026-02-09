import { NextRequest, NextResponse } from "next/server"
import { autoLinkShipmentItems } from "@/app/actions/shipments"
import { verifyAdmin } from "@/lib/auth-server"

export const dynamic = "force-dynamic"

// POST /api/admin/shipments/auto-link
// Auto-links shipment items to products by matching product_code to supplier_code
export async function POST(request: NextRequest) {
  const authResult = await verifyAdmin(request)
  if (!authResult.authenticated) {
    return NextResponse.json({ error: authResult.error }, { status: 401 })
  }

  try {
    const result = await autoLinkShipmentItems()
    
    return NextResponse.json({
      success: result.success,
      linked: result.linked,
      errors: result.errors,
      message: result.linked > 0 
        ? `Successfully linked ${result.linked} shipment items to products`
        : 'No new items to link'
    })
  } catch (error) {
    console.error("[Auto-link shipments] Error:", error)
    return NextResponse.json({ error: "Failed to auto-link items" }, { status: 500 })
  }
}
