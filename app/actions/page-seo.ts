'use server'

import { getSupabaseAdminClient } from '@/lib/supabase-admin'
import { revalidatePath } from 'next/cache'

export interface PageSeo {
  id: string
  path: string
  title: string | null
  description: string | null
  og_title: string | null
  og_description: string | null
  og_image_url: string | null
  keywords: string | null
  no_index: boolean
  no_follow: boolean
  canonical_url: string | null
  ai_generated: boolean
  last_ai_update: string | null
  created_at: string
  updated_at: string
}

export async function getAllPageSeo(): Promise<PageSeo[]> {
  const supabase = getSupabaseAdminClient()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('page_seo')
    .select('*')
    .order('path')

  if (error) {
    console.error('[PageSeo] Error fetching pages:', error)
    return []
  }

  return data || []
}

export async function getPageSeo(path: string): Promise<PageSeo | null> {
  const supabase = getSupabaseAdminClient()
  if (!supabase) return null

  const { data, error } = await supabase
    .from('page_seo')
    .select('*')
    .eq('path', path)
    .single()

  if (error) {
    if (error.code !== 'PGRST116') {
      console.error('[PageSeo] Error fetching page:', error)
    }
    return null
  }

  return data
}

export async function updatePageSeo(
  id: string,
  updates: Partial<Omit<PageSeo, 'id' | 'created_at' | 'updated_at'>>
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseAdminClient()
  if (!supabase) return { success: false, error: 'Database not available' }

  const { error } = await supabase
    .from('page_seo')
    .update(updates)
    .eq('id', id)

  if (error) {
    console.error('[PageSeo] Error updating page:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/website/pages')
  return { success: true }
}

export async function createPageSeo(
  path: string,
  data: Partial<Omit<PageSeo, 'id' | 'created_at' | 'updated_at'>>
): Promise<{ success: boolean; error?: string; data?: PageSeo }> {
  const supabase = getSupabaseAdminClient()
  if (!supabase) return { success: false, error: 'Database not available' }

  const { data: newPage, error } = await supabase
    .from('page_seo')
    .insert([{ path, ...data }])
    .select()
    .single()

  if (error) {
    console.error('[PageSeo] Error creating page:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/website/pages')
  return { success: true, data: newPage }
}

export async function deletePageSeo(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseAdminClient()
  if (!supabase) return { success: false, error: 'Database not available' }

  const { error } = await supabase
    .from('page_seo')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('[PageSeo] Error deleting page:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/website/pages')
  return { success: true }
}

export async function generateAISeo(
  path: string,
  context?: string
): Promise<{ success: boolean; title?: string; description?: string; keywords?: string; error?: string }> {
  try {
    // Get OpenAI API key from environment
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return { success: false, error: 'OpenAI API key not configured' }
    }

    const prompt = `Generate SEO metadata for a web page.

Page path: ${path}
${context ? `Additional context: ${context}` : ''}

This is for an e-commerce/health products store. Generate:
1. A compelling, SEO-optimized title (50-60 characters)
2. A meta description that encourages clicks (150-160 characters)
3. Relevant keywords (comma-separated, 5-8 keywords)

Respond in JSON format only:
{
  "title": "...",
  "description": "...",
  "keywords": "..."
}`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an SEO expert. Generate optimized metadata for web pages. Always respond with valid JSON only, no markdown.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 300,
      }),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('[PageSeo] OpenAI API error:', errorData)
      return { success: false, error: 'AI generation failed' }
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content

    if (!content) {
      return { success: false, error: 'No response from AI' }
    }

    // Parse the JSON response
    const parsed = JSON.parse(content)

    return {
      success: true,
      title: parsed.title,
      description: parsed.description,
      keywords: parsed.keywords,
    }
  } catch (error: any) {
    console.error('[PageSeo] AI generation error:', error)
    return { success: false, error: error.message || 'AI generation failed' }
  }
}

export async function bulkGenerateAISeo(
  pageIds: string[]
): Promise<{ success: boolean; updated: number; errors: string[] }> {
  const supabase = getSupabaseAdminClient()
  if (!supabase) return { success: false, updated: 0, errors: ['Database not available'] }

  const errors: string[] = []
  let updated = 0

  // Get pages to update
  const { data: pages } = await supabase
    .from('page_seo')
    .select('*')
    .in('id', pageIds)

  if (!pages) {
    return { success: false, updated: 0, errors: ['No pages found'] }
  }

  for (const page of pages) {
    const result = await generateAISeo(page.path)
    
    if (result.success && result.title && result.description) {
      const { error } = await supabase
        .from('page_seo')
        .update({
          title: result.title,
          description: result.description,
          keywords: result.keywords,
          ai_generated: true,
          last_ai_update: new Date().toISOString(),
        })
        .eq('id', page.id)

      if (error) {
        errors.push(`Failed to update ${page.path}: ${error.message}`)
      } else {
        updated++
      }
    } else {
      errors.push(`Failed to generate for ${page.path}: ${result.error}`)
    }

    // Rate limiting - wait 500ms between requests
    await new Promise(resolve => setTimeout(resolve, 500))
  }

  revalidatePath('/admin/website/pages')
  return { success: errors.length === 0, updated, errors }
}

export async function scanForNewPages(): Promise<{ success: boolean; added: number; error?: string }> {
  const supabase = getSupabaseAdminClient()
  if (!supabase) return { success: false, added: 0, error: 'Database not available' }

  // Common Next.js app router pages to scan for
  const commonPaths = [
    '/',
    '/products',
    '/cart',
    '/checkout',
    '/login',
    '/register',
    '/support',
    '/profile',
    '/orders',
    '/admin',
    '/admin/orders',
    '/admin/customers',
    '/admin/products',
    '/admin/inventory',
    '/admin/settings',
    '/admin/website',
    '/admin/rewards',
    '/admin/referrals',
    '/admin/discounts',
    '/admin/reps',
    '/admin/wallets',
    '/admin/analytics',
    '/rep',
    '/rep/dashboard',
    '/rep/customers',
    '/rep/orders',
    '/rep/pricing',
  ]

  let added = 0

  for (const path of commonPaths) {
    const { error } = await supabase
      .from('page_seo')
      .insert([{ path }])
      .select()
      .single()

    if (!error) {
      added++
    }
    // Ignore duplicate errors
  }

  revalidatePath('/admin/website/pages')
  return { success: true, added }
}

