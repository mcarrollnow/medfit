import { type NextRequest, NextResponse } from "next/server"
import { convertToModelMessages, streamText, type UIMessage } from "ai"

export const maxDuration = 30

export async function POST(req: NextRequest) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json()

    const apiKey = process.env.ANTHROPIC_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        {
          error: "ANTHROPIC_API_KEY environment variable is not set. Please add it in the Vars section of the sidebar.",
        },
        { status: 500 },
      )
    }

    const prompt = convertToModelMessages(messages)

    const result = streamText({
      model: "anthropic/claude-3-5-sonnet-20241022",
      messages: prompt,
      maxOutputTokens: 2048,
      abortSignal: req.signal,
    })

    return result.toUIMessageStreamResponse()
  } catch (error) {
    console.error("[v0] Error in chat API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
