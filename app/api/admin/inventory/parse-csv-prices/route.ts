import { NextRequest, NextResponse } from "next/server"
import { getSupabaseAdminClient } from "@/lib/supabase-admin"
import { verifyAdmin } from "@/lib/auth-server"

interface ParsedPriceRow {
  original_name: string
  matched_product_id: string | null
  matched_product_name: string | null
  matched_variant: string | null
  price: number
  confidence: "high" | "medium" | "low" | "no_match"
  alternatives?: Array<{ id: string; name: string; variant: string }>
}

interface ParseResponse {
  success: boolean
  parsed_rows: ParsedPriceRow[]
  error?: string
}

export async function POST(request: NextRequest): Promise<NextResponse<ParseResponse>> {
  try {
    // Verify admin authentication
    const authResult = await verifyAdmin(request)
    if (!authResult.authenticated) {
      return NextResponse.json({ success: false, parsed_rows: [], error: authResult.error }, { status: 401 })
    }

    const body = await request.json()
    const { csv_content, price_type } = body

    if (!csv_content) {
      return NextResponse.json({ success: false, parsed_rows: [], error: "CSV content required" }, { status: 400 })
    }

    if (!price_type || !["cost_price", "b2b_price", "retail_price", "supplier_price"].includes(price_type)) {
      return NextResponse.json({ success: false, parsed_rows: [], error: "Valid price type required" }, { status: 400 })
    }

    // Check for Claude API key
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ success: false, parsed_rows: [], error: "Claude API key not configured" }, { status: 500 })
    }

    // Get all products from database for matching
    const supabase = getSupabaseAdminClient()
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("id, name, base_name, variant, barcode")
      .order("base_name", { ascending: true })

    if (productsError) {
      console.error("[Parse CSV] Error fetching products:", productsError)
      return NextResponse.json({ success: false, parsed_rows: [], error: "Failed to fetch products" }, { status: 500 })
    }

    // Build product catalog for AI context
    const productCatalog = products?.map(p => `${p.name} (variant: ${p.variant})`) || []

    console.log("[Parse Prices] Parsing file with Claude using Tool Use...")

    // Check if content is base64 (PDF or image)
    const isBase64 = csv_content.startsWith("data:")
    
    // Build the message content based on file type
    let messageContent: any[]
    
    if (isBase64) {
      // Extract media type and base64 data
      const matches = csv_content.match(/^data:([^;]+);base64,(.+)$/)
      if (!matches) {
        return NextResponse.json({ success: false, parsed_rows: [], error: "Invalid file format" }, { status: 400 })
      }
      
      const mediaType = matches[1]
      const base64Data = matches[2]
      
      // Check if it's a PDF - use document type
      if (mediaType === "application/pdf") {
        messageContent = [
          {
            type: "document",
            source: {
              type: "base64",
              media_type: "application/pdf",
              data: base64Data,
            },
          },
          {
            type: "text",
            text: "Extract all product names and prices from this document and call the submit_prices tool.",
          },
        ]
      } else if (mediaType.startsWith("image/")) {
        // For images, use image type (only jpeg, png, gif, webp supported)
        const supportedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]
        const finalMediaType = supportedTypes.includes(mediaType) ? mediaType : "image/jpeg"
        
        messageContent = [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: finalMediaType,
              data: base64Data,
            },
          },
          {
            type: "text",
            text: "Extract all product names and prices from this image and call the submit_prices tool.",
          },
        ]
      } else {
        // Unknown binary format - try to decode as text
        try {
          const text = Buffer.from(base64Data, "base64").toString("utf-8")
          messageContent = [
            {
              type: "text",
              text: `Extract product names and prices from this data and call the submit_prices tool:\n\n${text}`,
            },
          ]
        } catch {
          return NextResponse.json({ success: false, parsed_rows: [], error: "Unsupported file format" }, { status: 400 })
        }
      }
    } else {
      // Text-based file
      messageContent = [
        {
          type: "text",
          text: `Extract product names and prices from this data and call the submit_prices tool:\n\n${csv_content}`,
        },
      ]
    }

    // Define the tool for structured output (Tool Use guarantees valid JSON)
    const tools = [
      {
        name: "submit_prices",
        description: "Submit the extracted product prices. Call this tool with all the product names and prices you found.",
        input_schema: {
          type: "object",
          properties: {
            rows: {
              type: "array",
              description: "Array of extracted product prices",
              items: {
                type: "object",
                properties: {
                  original_name: {
                    type: "string",
                    description: "The exact product name as it appears in the input"
                  },
                  price: {
                    type: "number",
                    description: "The price as a number (no $ sign or commas)"
                  },
                  matched_product_name: {
                    type: "string",
                    description: "The matching product name from the catalog, or null if no match"
                  },
                  matched_variant: {
                    type: "string",
                    description: "The variant (e.g., '5mg', '10mg'), or null"
                  },
                  confidence: {
                    type: "string",
                    enum: ["high", "medium", "low", "no_match"],
                    description: "How confident you are in the product match"
                  }
                },
                required: ["original_name", "price", "confidence"]
              }
            }
          },
          required: ["rows"]
        }
      }
    ]

    // Call Claude with Tool Use for guaranteed structured output
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "anthropic-beta": "pdfs-2024-09-25",
      },
      body: JSON.stringify({
        model: "claude-3-5-haiku-20241022",
        max_tokens: 4096,
        tools,
        tool_choice: { type: "tool", name: "submit_prices" }, // Force tool use
        system: `You extract product names and prices from documents and match them to a product catalog.

PRODUCT CATALOG:
${productCatalog.slice(0, 200).join("\n")}

MATCHING RULES:
- Match product names to the catalog above (ignore case, minor spelling differences)
- Include dosage/variant info (5mg, 10mg, etc.) in matching
- Extract numeric price values (remove $ signs and commas)
- Set confidence to "high" for exact matches, "medium" for likely matches, "low" for uncertain, "no_match" if not in catalog

You MUST call the submit_prices tool with all extracted data.`,
        messages: [
          {
            role: "user",
            content: messageContent,
          },
        ],
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[Parse CSV] Claude API error:", errorText)
      return NextResponse.json({ success: false, parsed_rows: [], error: `AI parsing failed: ${errorText.substring(0, 200)}` }, { status: 500 })
    }

    const data = await response.json()
    console.log("[Parse CSV] Claude response type:", data.stop_reason)

    // Extract tool use result
    const toolUse = data.content?.find((block: any) => block.type === "tool_use")
    
    if (!toolUse || toolUse.name !== "submit_prices") {
      console.error("[Parse CSV] No tool use found in response:", JSON.stringify(data.content).substring(0, 500))
      return NextResponse.json({ success: false, parsed_rows: [], error: "AI did not return structured data" }, { status: 500 })
    }

    const parsedData = toolUse.input as { rows: Array<{
      original_name: string
      price: number
      matched_product_name: string | null
      matched_variant: string | null
      confidence: "high" | "medium" | "low" | "no_match"
    }> }

    console.log("[Parse CSV] Parsed", parsedData.rows?.length || 0, "rows via tool use")

    // Match parsed names to actual product IDs
    const parsedRows: ParsedPriceRow[] = (parsedData.rows || []).map(row => {
      let matchedProduct = null
      
      if (row.matched_product_name) {
        // Find the product by name and variant
        matchedProduct = products?.find(p => {
          const nameMatch = p.name.toLowerCase() === row.matched_product_name?.toLowerCase() ||
                           p.base_name.toLowerCase() === row.matched_product_name?.toLowerCase()
          const variantMatch = !row.matched_variant || 
                              p.variant.toLowerCase() === row.matched_variant?.toLowerCase()
          return nameMatch && variantMatch
        })

        // If no exact match, try fuzzy matching
        if (!matchedProduct) {
          matchedProduct = products?.find(p => 
            p.name.toLowerCase().includes(row.matched_product_name?.toLowerCase() || "") &&
            (!row.matched_variant || p.variant.toLowerCase().includes(row.matched_variant?.toLowerCase() || ""))
          )
        }
      }

      return {
        original_name: row.original_name,
        matched_product_id: matchedProduct?.id || null,
        matched_product_name: matchedProduct?.name || row.matched_product_name,
        matched_variant: matchedProduct?.variant || row.matched_variant,
        price: row.price,
        confidence: matchedProduct ? row.confidence : "no_match",
      }
    })

    return NextResponse.json({
      success: true,
      parsed_rows: parsedRows,
    })

  } catch (error) {
    console.error("[Parse CSV] Error:", error)
    return NextResponse.json({ 
      success: false, 
      parsed_rows: [], 
      error: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 })
  }
}
