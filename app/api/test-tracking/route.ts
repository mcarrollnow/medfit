import { NextRequest, NextResponse } from "next/server"

const API_BASE = "https://api.aftership.com/tracking/2025-07"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const trackingNumber = searchParams.get('tracking') || 'AT572469389CN'
  const slug = searchParams.get('slug') || ''
  
  const apiKey = process.env.AFTERSHIP_API_KEY

  if (!apiKey) {
    return NextResponse.json({ 
      error: "AFTERSHIP_API_KEY not configured" 
    })
  }

  const headers = {
    "as-api-key": apiKey,
    "Content-Type": "application/json",
  }

  const results: Record<string, unknown> = {
    tracking_number: trackingNumber,
    requested_slug: slug,
    steps: []
  }

  try {
    // Step 1: Detect carrier
    console.log('[Test] Step 1: Detecting carrier for', trackingNumber)
    const detectResponse = await fetch(`${API_BASE}/couriers/detect`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        tracking: { tracking_number: trackingNumber }
      }),
    })
    const detectData = await detectResponse.json()
    results.step1_detect = {
      status: detectResponse.status,
      couriers: detectData.data?.couriers?.map((c: { slug: string; name: string }) => ({
        slug: c.slug,
        name: c.name
      })) || [],
      raw: detectData
    }
    ;(results.steps as string[]).push('detect: ' + (detectResponse.ok ? 'OK' : 'FAILED'))

    const detectedSlug = slug || detectData.data?.couriers?.[0]?.slug
    console.log('[Test] Detected slug:', detectedSlug)

    // Step 2: Try to create tracking
    console.log('[Test] Step 2: Creating tracking')
    const createResponse = await fetch(`${API_BASE}/trackings`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        tracking: {
          tracking_number: trackingNumber,
          slug: detectedSlug || undefined,
        }
      }),
    })
    const createData = await createResponse.json()
    results.step2_create = {
      status: createResponse.status,
      meta: createData.meta,
      tracking_id: createData.data?.tracking?.id,
      tracking_tag: createData.data?.tracking?.tag,
      checkpoints_count: createData.data?.tracking?.checkpoints?.length || 0,
    }
    ;(results.steps as string[]).push('create: ' + (createResponse.ok ? 'OK' : `${createData.meta?.code}`))

    // Step 3: Get tracking (if we have a slug)
    if (detectedSlug) {
      console.log('[Test] Step 3: Getting tracking by slug:', detectedSlug)
      const getResponse = await fetch(`${API_BASE}/trackings/${detectedSlug}/${trackingNumber}`, {
        headers,
      })
      const getData = await getResponse.json()
      results.step3_get = {
        status: getResponse.status,
        meta: getData.meta,
        tracking: getData.data?.tracking ? {
          id: getData.data.tracking.id,
          slug: getData.data.tracking.slug,
          tag: getData.data.tracking.tag,
          subtag: getData.data.tracking.subtag,
          subtag_message: getData.data.tracking.subtag_message,
          title: getData.data.tracking.title,
          checkpoints_count: getData.data.tracking.checkpoints?.length || 0,
          first_checkpoint: getData.data.tracking.checkpoints?.[0],
          last_checkpoint: getData.data.tracking.checkpoints?.slice(-1)[0],
        } : null
      }
      ;(results.steps as string[]).push('get: ' + (getResponse.ok ? 'OK' : 'FAILED'))
    }

    // Step 4: List all trackings to see what we have
    console.log('[Test] Step 4: Listing trackings')
    const listResponse = await fetch(`${API_BASE}/trackings?keyword=${trackingNumber}`, {
      headers,
    })
    const listData = await listResponse.json()
    results.step4_list = {
      status: listResponse.status,
      count: listData.data?.trackings?.length || 0,
      trackings: listData.data?.trackings?.map((t: { id: string; slug: string; tracking_number: string; tag: string }) => ({
        id: t.id,
        slug: t.slug,
        tracking_number: t.tracking_number,
        tag: t.tag
      })) || []
    }
    ;(results.steps as string[]).push('list: ' + (listResponse.ok ? 'OK' : 'FAILED'))

    return NextResponse.json(results)

  } catch (error) {
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : "Unknown error",
      results
    })
  }
}

