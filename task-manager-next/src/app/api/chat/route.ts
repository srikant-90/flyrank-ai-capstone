/**
 * app/api/chat/route.ts
 * -----------------------------------------------------------------------
 * Server-only route handler. Uses Groq (free tier).
 * The API key (GROQ_API_KEY) lives in .env.local only —
 * never sent to the browser.
 * -----------------------------------------------------------------------
 */

import { streamText, convertToModelMessages, type UIMessage } from "ai";
import { groq } from "@ai-sdk/groq";
import { AI_CONFIG, SYSTEM_PROMPT } from "@/lib/ai/config";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: groq(AI_CONFIG.model),
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
    temperature: AI_CONFIG.temperature,
    maxOutputTokens: AI_CONFIG.maxOutputTokens,
    abortSignal: req.signal,
  });

  return result.toUIMessageStreamResponse();
}
