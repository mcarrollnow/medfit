import { consumeStream, convertToModelMessages, streamText, type UIMessage } from "ai"

export const maxDuration = 30

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json()

  const prompt = convertToModelMessages(messages)

  const result = streamText({
    model: "openai/gpt-4o",
    prompt,
    abortSignal: req.signal,
    system:
      "You are a helpful AI assistant for an admin workpanel. You help with price/product research and peptide research. Provide detailed, accurate information and analysis.",
  })

  return result.toUIMessageStreamResponse({
    onFinish: async ({ isAborted }) => {
      if (isAborted) {
        console.log("[v0] Chat stream aborted")
      }
    },
    consumeSseStream: consumeStream,
  })
}
