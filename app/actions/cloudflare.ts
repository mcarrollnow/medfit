'use server'

import {
  getCloudflareConfig,
  isCloudflareConfigured,
  whitelistPCIScannerIPs,
  removePCIScannerWhitelist,
  listIPAccessRules,
} from '@/lib/cloudflare'
import { getScannerIPs, updateScanStatus } from './pci-scan'

// Check if Cloudflare is configured
export async function checkCloudflareConfig(): Promise<{
  configured: boolean
  error: string | null
}> {
  const configured = isCloudflareConfigured()
  return {
    configured,
    error: configured ? null : 'Cloudflare API Token and Zone ID not configured in environment variables'
  }
}

// Enable whitelist for a scan
export async function enableScanWhitelist(scanId: string): Promise<{
  success: boolean
  added: number
  errors: string[]
}> {
  const config = getCloudflareConfig()
  
  if (!config) {
    return {
      success: false,
      added: 0,
      errors: ['Cloudflare not configured. Add CLOUDFLARE_API_TOKEN and CLOUDFLARE_ZONE_ID to environment variables.']
    }
  }

  // Get active scanner IPs
  const ipsResult = await getScannerIPs()
  
  if (!ipsResult.data) {
    return {
      success: false,
      added: 0,
      errors: ['Failed to fetch scanner IPs']
    }
  }

  const activeIPs = ipsResult.data
    .filter(ip => ip.is_active)
    .map(ip => ip.ip_range)

  if (activeIPs.length === 0) {
    return {
      success: false,
      added: 0,
      errors: ['No active scanner IPs to whitelist']
    }
  }

  // Whitelist the IPs
  const result = await whitelistPCIScannerIPs(config, activeIPs, scanId)

  // If successful, update scan status to active
  if (result.success || result.added > 0) {
    await updateScanStatus(scanId, 'active')
  }

  return result
}

// Disable whitelist for a scan
export async function disableScanWhitelist(scanId: string): Promise<{
  success: boolean
  removed: number
  errors: string[]
}> {
  const config = getCloudflareConfig()
  
  if (!config) {
    return {
      success: false,
      removed: 0,
      errors: ['Cloudflare not configured. Add CLOUDFLARE_API_TOKEN and CLOUDFLARE_ZONE_ID to environment variables.']
    }
  }

  const result = await removePCIScannerWhitelist(config, scanId)

  // Update scan status to completed
  if (result.success || result.removed > 0) {
    await updateScanStatus(scanId, 'completed')
  }

  return result
}

// List current Cloudflare whitelist rules
export async function listCloudflareWhitelistRules(): Promise<{
  success: boolean
  rules: { ip: string; notes: string; id: string }[]
  error: string | null
}> {
  const config = getCloudflareConfig()
  
  if (!config) {
    return {
      success: false,
      rules: [],
      error: 'Cloudflare not configured'
    }
  }

  const result = await listIPAccessRules(config)

  if (!result.success) {
    return {
      success: false,
      rules: [],
      error: result.error
    }
  }

  // Filter to only PCI scan related rules
  const pciRules = result.rules
    .filter(rule => rule.notes.includes('PCI Scan'))
    .map(rule => ({
      ip: rule.configuration.value,
      notes: rule.notes,
      id: rule.id
    }))

  return {
    success: true,
    rules: pciRules,
    error: null
  }
}

// Test Cloudflare connection
export async function testCloudflareConnection(): Promise<{
  success: boolean
  message: string
}> {
  const config = getCloudflareConfig()
  
  if (!config) {
    return {
      success: false,
      message: 'Cloudflare not configured. Add CLOUDFLARE_API_TOKEN and CLOUDFLARE_ZONE_ID to environment variables.'
    }
  }

  try {
    // Try to list rules to verify connection
    const result = await listIPAccessRules(config)
    
    if (result.success) {
      return {
        success: true,
        message: `Connected successfully. Found ${result.rules.length} existing whitelist rules.`
      }
    } else {
      return {
        success: false,
        message: result.error || 'Failed to connect to Cloudflare'
      }
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message
    }
  }
}
