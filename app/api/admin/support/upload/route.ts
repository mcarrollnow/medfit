import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const { fileName, fileType, fileData } = await request.json()
    
    if (!fileName || !fileType || !fileData) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    
    // Create Supabase admin client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }
    
    const supabase = createClient(supabaseUrl, serviceRoleKey)
    
    // Convert base64 to buffer
    const base64Data = fileData.split(',')[1] // Remove data:image/xxx;base64, prefix
    const buffer = Buffer.from(base64Data, 'base64')
    
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('support-attachments')
      .upload(fileName, buffer, {
        contentType: fileType,
        cacheControl: '3600',
        upsert: false
      })
    
    if (error) {
      console.error('Storage upload error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('support-attachments')
      .getPublicUrl(fileName)
    
    return NextResponse.json({ url: publicUrl })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}

