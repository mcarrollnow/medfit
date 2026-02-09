// Cloudflare API Integration for PCI Scan IP Whitelisting

export interface CloudflareConfig {
  apiToken: string
  zoneId: string
}

export interface CloudflareIPAccessRule {
  id: string
  mode: 'whitelist' | 'block' | 'challenge' | 'js_challenge'
  configuration: {
    target: 'ip' | 'ip_range' | 'country' | 'asn'
    value: string
  }
  notes: string
  created_on: string
  modified_on: string
}

export interface CloudflareAPIResponse<T> {
  success: boolean
  errors: { code: number; message: string }[]
  messages: string[]
  result: T
}

// Get Cloudflare config from environment or database
export function getCloudflareConfig(): CloudflareConfig | null {
  const apiToken = process.env.CLOUDFLARE_API_TOKEN
  const zoneId = process.env.CLOUDFLARE_ZONE_ID

  if (!apiToken || !zoneId) {
    return null
  }

  return { apiToken, zoneId }
}

// List existing IP Access Rules
export async function listIPAccessRules(
  config: CloudflareConfig,
  notes?: string
): Promise<{ success: boolean; rules: CloudflareIPAccessRule[]; error: string | null }> {
  try {
    const url = new URL(`https://api.cloudflare.com/client/v4/zones/${config.zoneId}/firewall/access_rules/rules`)
    url.searchParams.set('mode', 'whitelist')
    url.searchParams.set('per_page', '100')
    if (notes) {
      url.searchParams.set('notes', notes)
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${config.apiToken}`,
        'Content-Type': 'application/json',
      },
    })

    const data: CloudflareAPIResponse<CloudflareIPAccessRule[]> = await response.json()

    if (!data.success) {
      return { 
        success: false, 
        rules: [], 
        error: data.errors.map(e => e.message).join(', ') 
      }
    }

    return { success: true, rules: data.result, error: null }
  } catch (error: any) {
    return { success: false, rules: [], error: error.message }
  }
}

// Create an IP Access Rule (whitelist)
export async function createIPAccessRule(
  config: CloudflareConfig,
  ipOrRange: string,
  notes: string
): Promise<{ success: boolean; rule: CloudflareIPAccessRule | null; error: string | null }> {
  try {
    // Determine if it's a single IP or a range
    const isRange = ipOrRange.includes('/')
    
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/zones/${config.zoneId}/firewall/access_rules/rules`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.apiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mode: 'whitelist',
          configuration: {
            target: isRange ? 'ip_range' : 'ip',
            value: ipOrRange,
          },
          notes: notes,
        }),
      }
    )

    const data: CloudflareAPIResponse<CloudflareIPAccessRule> = await response.json()

    if (!data.success) {
      // Check if it's a duplicate error (already exists)
      const isDuplicate = data.errors.some(e => 
        e.message.toLowerCase().includes('already exists') ||
        e.message.toLowerCase().includes('duplicate')
      )
      
      if (isDuplicate) {
        return { success: true, rule: null, error: 'Rule already exists' }
      }
      
      return { 
        success: false, 
        rule: null, 
        error: data.errors.map(e => e.message).join(', ') 
      }
    }

    return { success: true, rule: data.result, error: null }
  } catch (error: any) {
    return { success: false, rule: null, error: error.message }
  }
}

// Delete an IP Access Rule
export async function deleteIPAccessRule(
  config: CloudflareConfig,
  ruleId: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/zones/${config.zoneId}/firewall/access_rules/rules/${ruleId}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${config.apiToken}`,
          'Content-Type': 'application/json',
        },
      }
    )

    const data: CloudflareAPIResponse<{ id: string }> = await response.json()

    if (!data.success) {
      return { 
        success: false, 
        error: data.errors.map(e => e.message).join(', ') 
      }
    }

    return { success: true, error: null }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// Whitelist multiple IPs for PCI scan
export async function whitelistPCIScannerIPs(
  config: CloudflareConfig,
  ips: string[],
  scanId: string
): Promise<{ success: boolean; added: number; errors: string[] }> {
  const errors: string[] = []
  let added = 0
  const notes = `PCI Scan Whitelist - Scan ID: ${scanId}`

  for (const ip of ips) {
    const result = await createIPAccessRule(config, ip, notes)
    if (result.success) {
      added++
    } else if (result.error && !result.error.includes('already exists')) {
      errors.push(`${ip}: ${result.error}`)
    }
  }

  return { 
    success: errors.length === 0, 
    added, 
    errors 
  }
}

// Remove PCI scanner whitelist rules
export async function removePCIScannerWhitelist(
  config: CloudflareConfig,
  scanId: string
): Promise<{ success: boolean; removed: number; errors: string[] }> {
  const errors: string[] = []
  let removed = 0
  const searchNotes = `PCI Scan Whitelist - Scan ID: ${scanId}`

  // First, list all rules with our notes
  const listResult = await listIPAccessRules(config)
  
  if (!listResult.success) {
    return { success: false, removed: 0, errors: [listResult.error || 'Failed to list rules'] }
  }

  // Filter rules that match our scan ID
  const rulesToDelete = listResult.rules.filter(rule => 
    rule.notes.includes(searchNotes)
  )

  for (const rule of rulesToDelete) {
    const result = await deleteIPAccessRule(config, rule.id)
    if (result.success) {
      removed++
    } else {
      errors.push(`${rule.configuration.value}: ${result.error}`)
    }
  }

  return { 
    success: errors.length === 0, 
    removed, 
    errors 
  }
}

// Check if Cloudflare is configured
export function isCloudflareConfigured(): boolean {
  return !!getCloudflareConfig()
}
