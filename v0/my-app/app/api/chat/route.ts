import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"

export const runtime = "edge"

export async function POST(req: Request) {
  const { messages, model, systemPrompt, temperature, maxTokens } = await req.json()
  const result = streamText({
    model: openai(model || "gpt-4-turbo"),
    messages: [{ role: "system", content: systemPrompt }, ...messages],
    temperature,
    max_tokens: maxTokens,
  })
  return result.toDataStreamResponse()
}

