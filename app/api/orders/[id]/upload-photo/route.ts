import { NextRequest, NextResponse } from "next/server"
import { getSupabaseAdminClient } from "@/lib/supabase-admin"
import { createClient } from "@supabase/supabase-js"

export const dynamic = "force-dynamic"

// POST: Upload a photo via fulfillment token (no auth required)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: orderId } = await params

  try {
    const formData = await request.formData()
    const token = formData.get("token") as string
    const file = formData.get("file") as File

    if (!token) {
      return NextResponse.json({ error: "Token required" }, { status: 400 })
    }

    if (!file) {
      return NextResponse.json({ error: "File required" }, { status: 400 })
    }

    // Validate token
    const supabase = getSupabaseAdminClient()
    if (!supabase) {
      return NextResponse.json({ error: "Server error" }, { status: 500 })
    }

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("id, order_number, fulfillment_token")
      .eq("id", orderId)
      .single()

    if (orderError || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    if (order.fulfillment_token !== token) {
      return NextResponse.json({ error: "Invalid token" }, { status: 403 })
    }

    // Upload to storage
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json({ error: "Storage not configured" }, { status: 500 })
    }

    const storageClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })

    const fileName = `${orderId}/${Date.now()}-${file.name}`
    const buffer = Buffer.from(await file.arrayBuffer())

    // Try primary bucket first, fall back to shared bucket
    let publicUrl: string
    let storagePath: string

    const { data: uploadData, error: uploadError } = await storageClient.storage
      .from("order-fulfillment-photos")
      .upload(fileName, buffer, { contentType: file.type })

    if (uploadError) {
      // Fall back to shared bucket
      const { data: fallbackData, error: fallbackError } = await storageClient.storage
        .from("supplier-shipment-photos")
        .upload(`fulfillment/${fileName}`, buffer, { contentType: file.type })

      if (fallbackError) {
        console.error("[Photo Upload] Storage error:", fallbackError)
        return NextResponse.json({ error: "Failed to upload photo" }, { status: 500 })
      }

      const { data: { publicUrl: url } } = storageClient.storage
        .from("supplier-shipment-photos")
        .getPublicUrl(`fulfillment/${fallbackData.path}`)

      publicUrl = url
      storagePath = `fulfillment/${fallbackData.path}`
    } else {
      const { data: { publicUrl: url } } = storageClient.storage
        .from("order-fulfillment-photos")
        .getPublicUrl(uploadData.path)

      publicUrl = url
      storagePath = uploadData.path
    }

    // Save to order_photos
    const { error: dbError } = await supabase
      .from("order_photos")
      .insert({
        order_id: orderId,
        url: publicUrl,
        filename: file.name,
        storage_path: storagePath,
        content_type: file.type,
        size: file.size,
        uploaded_by: "qr_scan",
      })

    if (dbError) {
      console.error("[Photo Upload] DB error:", dbError)
      return NextResponse.json({ error: "Failed to save photo record" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      url: publicUrl,
      orderNumber: order.order_number,
    })
  } catch (error) {
    console.error("[Photo Upload] Error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
