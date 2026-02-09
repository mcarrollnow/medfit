import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing Supabase credentials')
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}

// GET - List photos for an order
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: orderId } = await params
    const supabase = getSupabase()

    const { data, error } = await supabase
      .from('order_photos')
      .select('*')
      .eq('order_id', orderId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching order photos:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ photos: data || [] })
  } catch (error) {
    console.error('Error in GET /api/admin/orders/[id]/photos:', error)
    return NextResponse.json({ error: 'Failed to fetch photos' }, { status: 500 })
  }
}

// POST - Upload a photo for an order
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: orderId } = await params
    const supabase = getSupabase()

    const { fileName, fileType, fileData } = await request.json()

    if (!fileName || !fileType || !fileData) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Convert base64 to buffer
    const base64Data = fileData.split(',')[1]
    const buffer = Buffer.from(base64Data, 'base64')

    // Generate unique filename with order prefix
    const timestamp = Date.now()
    const safeName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_')
    const storagePath = `${orderId}/${timestamp}_${safeName}`

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
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

    // Save photo metadata to database
    const { data: photoRecord, error: dbError } = await supabase
      .from('order_photos')
      .insert({
        order_id: orderId,
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
      // Clean up uploaded file if db insert fails
      await supabase.storage.from('order-photos').remove([storagePath])
      return NextResponse.json({ error: dbError.message }, { status: 500 })
    }

    return NextResponse.json({ photo: photoRecord })
  } catch (error) {
    console.error('Error in POST /api/admin/orders/[id]/photos:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}

// DELETE - Remove a photo
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await params
    const supabase = getSupabase()

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
    console.error('Error in DELETE /api/admin/orders/[id]/photos:', error)
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
}
