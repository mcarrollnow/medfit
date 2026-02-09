import { generateText } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'

export const maxDuration = 60

export async function POST(req: Request) {
  try {
    const { 
      productName, 
      category, 
      variants,
      wordCount,
      charCount,
      keyHighlights,
      existingDescription 
    } = await req.json()

    if (!productName) {
      return Response.json({ error: 'Product name is required' }, { status: 400 })
    }

    // Build the prompt with optional constraints
    let constraints = []
    if (wordCount) {
      constraints.push(`approximately ${wordCount} words`)
    }
    if (charCount) {
      constraints.push(`approximately ${charCount} characters`)
    }
    const lengthConstraint = constraints.length > 0 
      ? `Keep the description to ${constraints.join(' and ')}.` 
      : 'Keep the description concise (under 80 words / 600 characters).'

    const highlightsSection = keyHighlights 
      ? `\n\nKey points to highlight:\n${keyHighlights}` 
      : ''

    const existingSection = existingDescription
      ? `\n\nExisting description for reference (improve upon this):\n${existingDescription}`
      : ''

    const variantsInfo = variants?.length > 0
      ? `\nAvailable variants: ${variants.map((v: any) => v.variant || v).join(', ')}`
      : ''

    const prompt = `Generate a professional product description for an e-commerce health/peptide product store.

Product Name: ${productName}
${category ? `Category: ${category}` : ''}${variantsInfo}${highlightsSection}${existingSection}

Requirements:
- Write a compelling, professional product description
- Focus on benefits, quality, and research applications
- Use clear, accessible language suitable for both researchers and consumers
- Avoid making medical claims or promises
- Include relevant technical details where appropriate
- ${lengthConstraint}

Generate ONLY the product description text, no headings or labels.`

    const result = await generateText({
      model: anthropic('claude-opus-4-20250514'),
      messages: [
        {
          role: 'system',
          content: 'You are an expert product copywriter specializing in health, wellness, and research products. Write compelling, professional descriptions that highlight benefits while maintaining scientific accuracy. Never make unsupported medical claims.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      maxTokens: 1000,
    })

    return Response.json({ 
      success: true, 
      description: result.text 
    })

  } catch (error: any) {
    console.error('[AI Generate Description] Error:', error)
    return Response.json({ 
      success: false, 
      error: error.message || 'Failed to generate description' 
    }, { status: 500 })
  }
}

