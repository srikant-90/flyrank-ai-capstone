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
  try {
    if (!process.env.GROQ_API_KEY) {
      return new Response("GROQ_API_KEY is missing on server environment variables.", {
        status: 500,
      });
    }

    const { messages }: { messages: UIMessage[] } = await req.json();

    const modelMessages = await convertToModelMessages(messages);

    const result = streamText({
      model: groq(AI_CONFIG.model),
      system: SYSTEM_PROMPT,
      messages: modelMessages,
      temperature: AI_CONFIG.temperature,
      maxOutputTokens: AI_CONFIG.maxOutputTokens,
    });

    return result.toUIMessageStreamResponse();
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? `${err.name}: ${err.message}` : String(err);
    console.error("Chat API error:", err);
    return new Response(errorMsg, {
      status: 500,
    });
  }
}
