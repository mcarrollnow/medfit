import { generateText } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'

export const maxDuration = 120

interface Rating {
  label: string
  value: number
}

interface ProfileGenerationRequest {
  productName: string
  variants?: { variant: string }[] | string[]
  categories: { id: string; name: string }[]
  currentDescription?: string
  currentCartDescription?: string
  currentRatings?: Rating[]
  currentCategoryId?: string | null
  fieldsToGenerate?: ('category' | 'ratings' | 'description' | 'cartDescription')[]
  generateMode: 'selective' | 'missing' | 'full'
}

interface ProfileGenerationResponse {
  success: boolean
  profile?: {
    categoryId: string | null
    categoryName: string | null
    ratings: Rating[]
    description: string
    cartDescription: string
  }
  error?: string
}

export async function POST(req: Request): Promise<Response> {
  try {
    const body: ProfileGenerationRequest = await req.json()
    
    const {
      productName,
      variants,
      categories,
      currentDescription,
      currentCartDescription,
      currentRatings,
      currentCategoryId,
      fieldsToGenerate,
      generateMode
    } = body

    if (!productName) {
      return Response.json({ success: false, error: 'Product name is required' }, { status: 400 })
    }

    // Determine what needs to be generated based on mode
    let shouldGenerate = {
      category: false,
      ratings: false,
      description: false,
      cartDescription: false
    }

    if (generateMode === 'full') {
      // Generate everything fresh
      shouldGenerate = { category: true, ratings: true, description: true, cartDescription: true }
    } else if (generateMode === 'missing') {
      // Only generate what's missing
      shouldGenerate.category = !currentCategoryId
      shouldGenerate.ratings = !currentRatings || currentRatings.length === 0 || 
        (currentRatings.length === 1 && currentRatings[0].label === 'Quality' && currentRatings[0].value === 8.5)
      shouldGenerate.description = !currentDescription || currentDescription.trim() === ''
      shouldGenerate.cartDescription = !currentCartDescription || currentCartDescription.trim() === ''
    } else if (generateMode === 'selective' && fieldsToGenerate) {
      // Generate only selected fields
      shouldGenerate.category = fieldsToGenerate.includes('category')
      shouldGenerate.ratings = fieldsToGenerate.includes('ratings')
      shouldGenerate.description = fieldsToGenerate.includes('description')
      shouldGenerate.cartDescription = fieldsToGenerate.includes('cartDescription')
    }

    // Build category list for AI context
    const categoryList = categories.map(c => `- ${c.name} (ID: ${c.id})`).join('\n')
    
    const variantsInfo = variants?.length 
      ? `Available variants: ${variants.map((v: any) => v.variant || v).join(', ')}`
      : ''

    // Build the prompt based on what we need to generate
    const fieldsNeeded = []
    if (shouldGenerate.category) fieldsNeeded.push('categoryId, categoryName')
    if (shouldGenerate.ratings) fieldsNeeded.push('ratings (array of 3 objects with label and value)')
    if (shouldGenerate.description) fieldsNeeded.push('description')
    if (shouldGenerate.cartDescription) fieldsNeeded.push('cartDescription')

    if (fieldsNeeded.length === 0) {
      // Nothing to generate
      return Response.json({
        success: true,
        profile: {
          categoryId: currentCategoryId || null,
          categoryName: currentCategoryId ? categories.find(c => c.id === currentCategoryId)?.name || null : null,
          ratings: currentRatings || [],
          description: currentDescription || '',
          cartDescription: currentCartDescription || ''
        }
      })
    }

    const prompt = `You are generating a product profile for a peptide/research compound e-commerce store.

Product Name: ${productName}
${variantsInfo}

Available Categories:
${categoryList}

${currentDescription ? `Current Description (for context): ${currentDescription}` : ''}

Generate the following fields: ${fieldsNeeded.join(', ')}

IMPORTANT RULES:
1. For CATEGORY: Choose the MOST appropriate category from the list above. Return the exact category ID and name. If no category fits well, use null for categoryId.

2. For RATINGS: Generate exactly 3 ratings that highlight this SPECIFIC compound's notable strengths. Each rating should:
   - Have a SHORT, SIMPLE label (2-3 words max) that a normal person can understand
   - Use everyday language, NOT scientific jargon - write for someone without a biology degree
   - Good examples: "Fat Burning", "Muscle Growth", "Better Sleep", "Energy Boost", "Skin Health", "Joint Support", "Weight Loss", "Anti-Aging", "Mood Boost", "Appetite Control", "Faster Recovery", "Mental Clarity", "Immune Support", "Gut Health", "Hair Growth", "Bone Strength", "Stress Relief", "Inflammation"
   - BAD examples (too technical): "Neuroprotection", "Insulin Sensitivity", "Collagen Synthesis", "Cellular Repair", "Tissue Regeneration", "Metabolic Rate", "Growth Hormone Release"
   - NEVER use generic/lazy labels like "Research Grade", "Purity", "Quality", "Research Support", "Lab Tested", "Potency", or any label about the product quality rather than its effects
   - ALL 3 ratings must describe different benefits specific to what this peptide/compound actually does
   - Have a value between 7.0 and 9.5 (be generous but realistic - these are quality products)
   - Research the actual known effects of this specific compound to pick accurate labels

3. For DESCRIPTION: Write a compelling, professional product description (under 80 words / 600 characters):
   - Focus on benefits, quality, and research applications
   - Use clear, accessible language
   - Avoid making medical claims or promises
   - Mention key properties of the compound

4. For CART DESCRIPTION: Write a SHORT (15-25 words) description for the shopping cart:
   - Concise, benefit-focused
   - Highlight the main use case or benefit

Return ONLY valid JSON in this exact format:
{
  "categoryId": "uuid-string-or-null",
  "categoryName": "Category Name or null",
  "ratings": [
    { "label": "Rating Label 1", "value": 8.5 },
    { "label": "Rating Label 2", "value": 8.0 },
    { "label": "Rating Label 3", "value": 7.8 }
  ],
  "description": "Full product description text...",
  "cartDescription": "Short cart preview text..."
}

For any fields you are NOT generating, use these values:
- categoryId: ${currentCategoryId ? `"${currentCategoryId}"` : 'null'}
- categoryName: ${currentCategoryId ? `"${categories.find(c => c.id === currentCategoryId)?.name || ''}"` : 'null'}
- ratings: ${currentRatings && currentRatings.length > 0 ? JSON.stringify(currentRatings) : '[]'}
- description: ${currentDescription ? `"${currentDescription.replace(/"/g, '\\"').replace(/\n/g, '\\n')}"` : '""'}
- cartDescription: ${currentCartDescription ? `"${currentCartDescription.replace(/"/g, '\\"').replace(/\n/g, '\\n')}"` : '""'}

Return ONLY the JSON object, no markdown code blocks or other text.`

    const result = await generateText({
      model: anthropic('claude-opus-4-20250514'),
      messages: [
        {
          role: 'system',
          content: 'You are an expert product copywriter specializing in health, wellness, and research peptides. Generate compelling, professional content that highlights benefits while maintaining scientific accuracy. Never make unsupported medical claims. Always return valid JSON only.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      maxTokens: 2000,
    })

    // Parse the JSON response
    let profile
    try {
      // Clean up potential markdown code blocks
      let cleanedText = result.text.trim()
      if (cleanedText.startsWith('```json')) {
        cleanedText = cleanedText.slice(7)
      } else if (cleanedText.startsWith('```')) {
        cleanedText = cleanedText.slice(3)
      }
      if (cleanedText.endsWith('```')) {
        cleanedText = cleanedText.slice(0, -3)
      }
      cleanedText = cleanedText.trim()
      
      profile = JSON.parse(cleanedText)
    } catch (parseError) {
      console.error('[AI Generate Profile] Parse error:', parseError)
      console.error('[AI Generate Profile] Raw response:', result.text)
      return Response.json({
        success: false,
        error: 'Failed to parse AI response'
      }, { status: 500 })
    }

    // Validate and clean up the profile
    const validatedProfile = {
      categoryId: shouldGenerate.category ? (profile.categoryId || null) : (currentCategoryId || null),
      categoryName: shouldGenerate.category ? (profile.categoryName || null) : (currentCategoryId ? categories.find(c => c.id === currentCategoryId)?.name || null : null),
      ratings: shouldGenerate.ratings ? (profile.ratings || []).slice(0, 3).map((r: any) => ({
        label: String(r.label || 'Rating'),
        value: Math.min(10, Math.max(0, Number(r.value) || 8.0))
      })) : (currentRatings || []),
      description: shouldGenerate.description ? String(profile.description || '') : (currentDescription || ''),
      cartDescription: shouldGenerate.cartDescription ? String(profile.cartDescription || '') : (currentCartDescription || '')
    }

    return Response.json({
      success: true,
      profile: validatedProfile
    })

  } catch (error: any) {
    console.error('[AI Generate Profile] Error:', error)
    return Response.json({
      success: false,
      error: error.message || 'Failed to generate profile'
    }, { status: 500 })
  }
}
