import { generateText } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'

export const maxDuration = 120

export async function POST(req: Request) {
  try {
    const { 
      templateType,
      templateName,
      availableVariables,
      prompt,
      existingHtml,
      brandName = 'Modern Health Pro',
      brandColor = '#ffffff',
      style = 'dark-modern',
    } = await req.json()

    if (!prompt && !templateType) {
      return Response.json({ error: 'Either a prompt or template type is required' }, { status: 400 })
    }

    const variablesList = availableVariables?.length > 0
      ? `\n\nAvailable template variables (use these exactly as shown, they will be replaced with real data):\n${availableVariables.join('\n')}`
      : ''

    const existingSection = existingHtml
      ? `\n\nExisting HTML template to improve upon or use as reference:\n${existingHtml}`
      : ''

    const styleGuide = style === 'dark-modern' 
      ? `
Style Guide:
- Dark theme: background-color #121212 or #0a0a0a
- Card backgrounds: rgba(255, 255, 255, 0.03) with border: 1px solid rgba(255, 255, 255, 0.08)
- Text colors: #f5f5f5 for headings, #a3a3a3 for body text, #737373 for secondary text
- Border radius: 16px-24px for cards, 12px-16px for buttons
- Font: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif for body
- Monospace: 'SF Mono', 'Monaco', 'Courier New', monospace for labels/eyebrows
- CTA buttons: white background (#ffffff) with black text (#000000), rounded, uppercase monospace text
- Subtle gradients and glass-morphism feel
- Spacing: generous padding (40-56px cards, 24-32px inner elements)
- Mobile responsive with @media queries for max-width: 600px`
      : style === 'light-clean'
      ? `
Style Guide:
- Light theme: background-color #f8f9fa or #ffffff
- Card backgrounds: #ffffff with subtle shadows and light borders
- Text colors: #1a1a1a for headings, #4a4a4a for body, #888888 for secondary
- Clean, minimal design with plenty of whitespace
- CTA buttons: brand color background with white text`
      : `
Style Guide:
- Use a professional, modern design
- Make it visually appealing and on-brand`

    const systemPrompt = `You are an expert email template designer who creates beautiful, responsive HTML email templates. 
You specialize in creating professional transactional emails that work across all email clients (Gmail, Outlook, Apple Mail, etc.).

CRITICAL RULES:
1. Output ONLY the complete HTML email code, nothing else. No markdown, no explanations, no code fences.
2. Use table-based layouts for maximum email client compatibility
3. All CSS must be inline (no external stylesheets)
4. Use role="presentation" on layout tables
5. Include proper DOCTYPE and meta tags
6. Make it mobile-responsive with @media queries in a <style> tag in the <head>
7. Use the template variables provided (e.g. {{customer_name}}) - these will be replaced with real data at send time
8. Keep the design professional and on-brand for "${brandName}"
9. Include a footer with company name and contact info
10. Ensure all text is readable and well-spaced`

    const userPrompt = `Create a professional HTML email template for: ${templateName || templateType || 'a transactional email'}

${prompt ? `Specific instructions: ${prompt}` : ''}
${variablesList}
${existingSection}
${styleGuide}

Brand: ${brandName}

Generate the complete HTML email template. Output ONLY the raw HTML code.`

    const result = await generateText({
      model: anthropic('claude-sonnet-4-20250514'),
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: userPrompt
        }
      ],
      temperature: 0.7,
      maxTokens: 8000,
    })

    // Clean the response - strip any markdown code fences if present
    let html = result.text.trim()
    if (html.startsWith('```html')) {
      html = html.slice(7)
    } else if (html.startsWith('```')) {
      html = html.slice(3)
    }
    if (html.endsWith('```')) {
      html = html.slice(0, -3)
    }
    html = html.trim()

    return Response.json({ 
      success: true, 
      html 
    })

  } catch (error: any) {
    console.error('[AI Generate Email] Error:', error)
    return Response.json({ 
      success: false, 
      error: error.message || 'Failed to generate email template' 
    }, { status: 500 })
  }
}
