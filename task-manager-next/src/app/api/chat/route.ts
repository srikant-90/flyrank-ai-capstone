/**
 * app/api/chat/route.ts
 * -----------------------------------------------------------------------
 * Server-only route handler. Uses Groq (free tier) with fallback streaming.
 * If GROQ_API_KEY is configured on Vercel, streams live from Groq LLaMA 3.3.
 * If GROQ_API_KEY is missing or connection fails, streams a smart assistant fallback.
 * -----------------------------------------------------------------------
 */

import {
  streamText,
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  type UIMessage,
} from "ai";
import { groq } from "@ai-sdk/groq";
import { AI_CONFIG, SYSTEM_PROMPT } from "@/lib/ai/config";

export const maxDuration = 30;

function createFallbackStream(userPrompt: string, errorNotice?: string) {
  const stream = createUIMessageStream({
    execute: async (writer) => {
      let reply = "";
      const lower = userPrompt.toLowerCase();

      if (lower.includes("hi") || lower.includes("hello") || lower.includes("hey")) {
        reply =
          "Hello! I am your AI Assistant for Task Manager. How can I help you analyze, plan, or summarize your tasks today?";
      } else if (lower.includes("task") || lower.includes("todo") || lower.includes("work")) {
        reply =
          "Here is a quick summary of task management best practices:\n\n1. **Prioritize**: Group tasks into High, Medium, and Low priority.\n2. **Break Down**: Divide large tasks into sub-tasks.\n3. **Track Progress**: Use status filters to keep track of completed items.\n\nWould you like me to help you organize a specific task list?";
      } else {
        reply = `I received your message: "${userPrompt}".\n\nI am your AI Assistant embedded in Task Manager. You can ask me to help structure tasks, review project deadlines, or provide technical summaries!`;
      }

      if (errorNotice) {
        reply = `⚠️ *Notice: ${errorNotice}*\n\n${reply}`;
      }

      // Stream token by token for realistic response animation
      const words = reply.split(" ");
      for (let i = 0; i < words.length; i++) {
        writer.writeText(words[i] + (i < words.length - 1 ? " " : ""));
        await new Promise((res) => setTimeout(res, 35));
      }
    },
  });

  return createUIMessageStreamResponse({ stream });
}

export async function POST(req: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json();

    const lastMessage = messages[messages.length - 1];
    const userPrompt =
      lastMessage?.parts
        ?.filter((p) => p.type === "text")
        .map((p) => p.text)
        .join(" ") || "Hello";

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey || apiKey.includes("your-groq-api-key")) {
      return createFallbackStream(
        userPrompt,
        "GROQ_API_KEY is not configured in Vercel Environment Variables."
      );
    }

    try {
      const modelMessages = await convertToModelMessages(messages);

      const result = streamText({
        model: groq(AI_CONFIG.model),
        system: SYSTEM_PROMPT,
        messages: modelMessages,
        temperature: AI_CONFIG.temperature,
        maxOutputTokens: AI_CONFIG.maxOutputTokens,
      });

      return result.toUIMessageStreamResponse();
    } catch (apiError: unknown) {
      const err = apiError as Error;
      console.error("Groq API Error, falling back to smart stream:", err);
      return createFallbackStream(
        userPrompt,
        `Groq API connection issue (${err?.message || "Connection failed"})`
      );
    }
  } catch (err: unknown) {
    console.error("Request error:", err);
    return createFallbackStream("Hello", "Request processing fallback mode.");
  }
}
