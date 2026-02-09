import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { verifyAuth } from '@/lib/auth-server'

function getServiceSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing Supabase credentials')
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}

// GET - List photos for an order (role-based access)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  try {
    const { orderNumber } = await params
    const authResult = await verifyAuth(request)

    if (!authResult.authenticated || !authResult.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const supabase = getServiceSupabase()
    const role = authResult.user.role

    // Look up the order by order_number
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('id, order_number, customer_id')
      .eq('order_number', orderNumber)
      .single()

    if (orderError || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // For customers, verify they own this order
    if (role === 'customer') {
      // Get the customer record for this user
      const { data: customer } = await supabase
        .from('customers')
        .select('id')
        .eq('user_id', authResult.user.authId)
        .single()

      if (!customer || customer.id !== order.customer_id) {
        return NextResponse.json({ error: 'Access denied' }, { status: 403 })
      }
    }

    // Fetch photos
    const { data: photos, error: photosError } = await supabase
      .from('order_photos')
      .select('*')
      .eq('order_id', order.id)
      .order('created_at', { ascending: false })

    if (photosError) {
      console.error('Error fetching order photos:', photosError)
      return NextResponse.json({ error: photosError.message }, { status: 500 })
    }

    return NextResponse.json({
      photos: photos || [],
      orderId: order.id,
      orderNumber: order.order_number,
    })
  } catch (error) {
    console.error('Error in GET /api/order-photos/[orderNumber]/photos:', error)
    return NextResponse.json({ error: 'Failed to fetch photos' }, { status: 500 })
  }
}

// POST - Upload a photo (admin/rep only)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  try {
    const { orderNumber } = await params
    const authResult = await verifyAuth(request)

    if (!authResult.authenticated || !authResult.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const role = authResult.user.role
    if (role !== 'admin' && role !== 'superadmin' && role !== 'rep') {
      return NextResponse.json({ error: 'Upload not permitted' }, { status: 403 })
    }

    const supabase = getServiceSupabase()

    // Look up order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('id')
      .eq('order_number', orderNumber)
      .single()

    if (orderError || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    const { fileName, fileType, fileData } = await request.json()

    if (!fileName || !fileType || !fileData) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Convert base64 to buffer
    const base64Data = fileData.split(',')[1]
    const buffer = Buffer.from(base64Data, 'base64')

    // Generate unique filename
    const timestamp = Date.now()
    const safeName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_')
    const storagePath = `${order.id}/${timestamp}_${safeName}`

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('order-photos')
      .upload(storagePath, buffer, {
        contentType: fileType,
        cacheControl: '3600',
        upsert: false,
      })

    if (uploadError) {
      console.error('Storage upload error:', uploadError)
      return NextResponse.json({ error: uploadError.message }, { status: 500 })
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('order-photos')
      .getPublicUrl(storagePath)

    // Save photo metadata
    const { data: photoRecord, error: dbError } = await supabase
      .from('order_photos')
      .insert({
        order_id: order.id,
        url: publicUrl,
        filename: fileName,
        size: buffer.length,
        content_type: fileType,
        storage_path: storagePath,
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database insert error:', dbError)
      await supabase.storage.from('order-photos').remove([storagePath])
      return NextResponse.json({ error: dbError.message }, { status: 500 })
    }

    return NextResponse.json({ photo: photoRecord })
  } catch (error) {
    console.error('Error in POST /api/order-photos/[orderNumber]/photos:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}

// DELETE - Remove a photo (admin/rep only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  try {
    await params
    const authResult = await verifyAuth(request)

    if (!authResult.authenticated || !authResult.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const role = authResult.user.role
    if (role !== 'admin' && role !== 'superadmin' && role !== 'rep') {
      return NextResponse.json({ error: 'Delete not permitted' }, { status: 403 })
    }

    const supabase = getServiceSupabase()
    const { photoId, storagePath } = await request.json()

    if (!photoId) {
      return NextResponse.json({ error: 'Missing photo ID' }, { status: 400 })
    }

    // Delete from storage if path provided
    if (storagePath) {
      const { error: storageError } = await supabase.storage
        .from('order-photos')
        .remove([storagePath])

      if (storageError) {
        console.error('Storage delete error:', storageError)
      }
    }

    // Delete from database
    const { error: dbError } = await supabase
      .from('order_photos')
      .delete()
      .eq('id', photoId)

    if (dbError) {
      console.error('Database delete error:', dbError)
      return NextResponse.json({ error: dbError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in DELETE /api/order-photos/[orderNumber]/photos:', error)
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
}
