import { streamText } from "ai"

export async function POST(req: Request) {
  const { sequence } = await req.json()

  const result = streamText({
    model: "anthropic/claude-sonnet-4",
    messages: [
      {
        role: "system",
        content: `You are an expert peptide researcher and biochemist. Analyze peptide sequences for:
1. Therapeutic potential and known benefits
2. Structural properties and stability
3. Known research and clinical applications
4. Safety considerations and contraindications
5. Comparison to similar known peptides
6. Potential mechanisms of action

Provide detailed, research-based analysis with specific references to known peptides when applicable.`,
      },
      {
        role: "user",
        content: `Analyze this peptide sequence: ${sequence}

Provide a comprehensive analysis including:
- Sequence characteristics
- Potential therapeutic benefits
- Known research or similar peptides
- Safety profile
- Recommendations for further research`,
      },
    ],
  })

  return result.toUIMessageStreamResponse()
}
