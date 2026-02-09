import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdminClient } from '@/lib/supabase/admin'
import { 
  getCloudflareConfig, 
  whitelistPCIScannerIPs, 
  removePCIScannerWhitelist 
} from '@/lib/cloudflare'

// This endpoint should be called by a cron job every 5 minutes
// It checks for scans that need to start or end and manages Cloudflare whitelist

export async function GET(request: NextRequest) {
  // Verify cron secret (optional security)
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const config = getCloudflareConfig()
  
  if (!config) {
    return NextResponse.json({ 
      error: 'Cloudflare not configured',
      message: 'Add CLOUDFLARE_API_TOKEN and CLOUDFLARE_ZONE_ID to environment variables'
    }, { status: 500 })
  }

  const supabase = getSupabaseAdminClient()
  
  if (!supabase) {
    return NextResponse.json({ error: 'Database not available' }, { status: 500 })
  }

  const now = new Date().toISOString()
  const results = {
    scansStarted: [] as string[],
    scansEnded: [] as string[],
    errors: [] as string[]
  }

  try {
    // Find scheduled scans that should start (current time is past start time but before end time)
    const { data: scansToStart, error: startError } = await supabase
      .from('pci_scan_schedules')
      .select('*')
      .eq('status', 'scheduled')
      .lte('scheduled_start', now)
      .gte('scheduled_end', now)

    if (startError) {
      results.errors.push(`Error fetching scans to start: ${startError.message}`)
    }

    // Start scans that should be active
    if (scansToStart && scansToStart.length > 0) {
      // Get active scanner IPs
      const { data: scannerIPs } = await supabase
        .from('pci_scanner_ips')
        .select('ip_range')
        .eq('is_active', true)

      const ips = scannerIPs?.map(ip => ip.ip_range) || []

      for (const scan of scansToStart) {
        const whitelistResult = await whitelistPCIScannerIPs(config, ips, scan.id)
        
        if (whitelistResult.success || whitelistResult.added > 0) {
          // Update scan status to active
          await supabase
            .from('pci_scan_schedules')
            .update({ status: 'active' })
            .eq('id', scan.id)
          
          results.scansStarted.push(scan.scan_name)
        } else {
          results.errors.push(`Failed to start ${scan.scan_name}: ${whitelistResult.errors.join(', ')}`)
        }
      }
    }

    // Find active scans that should end (current time is past end time)
    const { data: scansToEnd, error: endError } = await supabase
      .from('pci_scan_schedules')
      .select('*')
      .eq('status', 'active')
      .lt('scheduled_end', now)

    if (endError) {
      results.errors.push(`Error fetching scans to end: ${endError.message}`)
    }

    // End scans that have passed their window
    if (scansToEnd && scansToEnd.length > 0) {
      for (const scan of scansToEnd) {
        const removeResult = await removePCIScannerWhitelist(config, scan.id)
        
        // Update scan status to completed regardless
        await supabase
          .from('pci_scan_schedules')
          .update({ status: 'completed' })
          .eq('id', scan.id)
        
        results.scansEnded.push(scan.scan_name)
        
        if (!removeResult.success && removeResult.errors.length > 0) {
          results.errors.push(`Warnings ending ${scan.scan_name}: ${removeResult.errors.join(', ')}`)
        }
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: now,
      ...results
    })

  } catch (error: any) {
    return NextResponse.json({ 
      success: false,
      error: error.message,
      ...results
    }, { status: 500 })
  }
}
