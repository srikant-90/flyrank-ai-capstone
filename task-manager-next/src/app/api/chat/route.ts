/**
 * app/api/chat/route.ts
 * -----------------------------------------------------------------------
 * FE-08 Core AI Route Handler with Sabotage Testing Support.
 * Handles:
 *  - Groq LLaMA 3.3 streaming text & tool calls
 *  - Sabotage modes via header ('x-sabotage') or request body ('sabotage'):
 *    - 'network': Returns HTTP 500 Connection Refused
 *    - '429': Returns HTTP 429 Rate Limit Exceeded
 *    - 'mid-stream': Streams 2 tokens then aborts/throws mid-stream
 *    - 'tool': Throws error during server tool execution
 * -----------------------------------------------------------------------
 */

import {
  streamText,
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  tool,
  type UIMessage,
} from "ai";
import { groq } from "@ai-sdk/groq";
import { z } from "zod";
import { AI_CONFIG, SYSTEM_PROMPT } from "@/lib/ai/config";

export const maxDuration = 30;

// 1. Zod Schemas for Tool Contracts
const auditTaskRiskSchema = z.object({
  taskTitle: z.string().describe("The title or description of the task being audited"),
  category: z
    .enum(["Frontend", "Backend", "DevOps", "Design", "Database", "General"])
    .describe("Category of the task"),
  complexity: z
    .enum(["low", "medium", "high", "critical"])
    .describe("Estimated complexity level of the task"),
  estimatedHours: z.number().describe("Estimated hours needed to complete the task"),
  daysUntilDeadline: z.number().describe("Days remaining until the target deadline"),
  simulateError: z
    .boolean()
    .optional()
    .describe("Simulate an audit failure for testing State 4 error card"),
});

const userConfirmationSchema = z.object({
  action: z.string().describe("The action requiring user confirmation"),
  details: z.string().describe("Explanation of why confirmation is required"),
});

// 2. Server Tools Definition
export const serverTools = {
  auditTaskRisk: tool({
    description:
      "Analyze a task's complexity, deadlines, and risk factors to generate a structured health audit score card and recommendations.",
    inputSchema: auditTaskRiskSchema,
    execute: async (args: z.infer<typeof auditTaskRiskSchema>) => {
      const {
        taskTitle,
        category,
        complexity,
        estimatedHours,
        daysUntilDeadline,
        simulateError,
      } = args;

      // Simulate server processing time
      await new Promise((resolve) => setTimeout(resolve, 600));

      if (
        simulateError ||
        taskTitle.toLowerCase().includes("fail") ||
        taskTitle.toLowerCase().includes("error")
      ) {
        throw new Error(
          `Failed to audit task "${taskTitle}": Telemetry connection timed out while fetching historical metrics from audit server.`
        );
      }

      // Calculate risk score logic
      let riskScore = 20;
      if (complexity === "high") riskScore += 30;
      if (complexity === "critical") riskScore += 55;
      if (estimatedHours > 40) riskScore += 20;
      if (daysUntilDeadline < 3) riskScore += 25;
      if (daysUntilDeadline < 1) riskScore += 35;
      riskScore = Math.min(100, Math.max(5, riskScore));

      let riskLevel: "Low" | "Medium" | "High" | "Critical" = "Low";
      if (riskScore >= 75) riskLevel = "Critical";
      else if (riskScore >= 50) riskLevel = "High";
      else if (riskScore >= 30) riskLevel = "Medium";

      const blockers: string[] = [];
      if (daysUntilDeadline <= 2 && estimatedHours > 16) {
        blockers.push("Insufficient time buffer before target deadline");
      }
      if (complexity === "critical") {
        blockers.push("Requires senior architectural review & peer testing");
      }
      if (estimatedHours > 50) {
        blockers.push("Task scope exceeds single sprint capacity (>50 hrs)");
      }
      if (blockers.length === 0) {
        blockers.push("No critical blocking risks identified");
      }

      const recommendations: string[] = [];
      if (riskScore >= 50) {
        recommendations.push("Decompose task into smaller sub-tasks under 8 hours each");
      }
      if (daysUntilDeadline < 5) {
        recommendations.push("Prioritize immediate peer code review to prevent slippage");
      }
      recommendations.push("Ensure test coverage for critical execution paths");

      return {
        auditId: "audit-" + Math.random().toString(36).substring(2, 9),
        timestamp: new Date().toISOString(),
        taskTitle,
        category,
        complexity,
        estimatedHours,
        daysUntilDeadline,
        riskScore,
        riskLevel,
        healthScore: 100 - riskScore,
        blockers,
        recommendations,
      };
    },
  }),

  requestUserConfirmation: tool({
    description:
      "Ask the user to confirm a critical or destructive action (e.g. deleting a task or pushing to production).",
    inputSchema: userConfirmationSchema,
    execute: async (args: z.infer<typeof userConfirmationSchema>) => {
      return {
        status: "pending_user_approval",
        action: args.action,
        details: args.details,
        requiresConfirmation: true,
      };
    },
  }),
};

// Helper: Mid-stream sabotage response
function createMidStreamSabotageStream() {
  const stream = createUIMessageStream({
    execute: async ({ writer }) => {
      const msgId = "text-" + Date.now();
      writer.write({
        type: "text-start",
        id: msgId,
      });
      writer.write({
        type: "text-delta",
        id: msgId,
        delta: "I am starting to analyze your task specifications...",
      });

      await new Promise((res) => setTimeout(res, 500));

      writer.write({
        type: "text-delta",
        id: msgId,
        delta: " [STREAM INTERRUPTED: Connection reset by server mid-stream!]",
      });

      // Throw error mid-stream to simulate dropped connection mid-flight
      throw new Error(
        "Mid-stream connection dropped: Model worker node terminated unexpectedly during token generation."
      );
    },
  });

  return createUIMessageStreamResponse({ stream });
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { messages, sabotage: bodySabotage }: { messages: UIMessage[]; sabotage?: string } = body;

    const headerSabotage = req.headers.get("x-sabotage");
    const sabotageMode = headerSabotage || bodySabotage;

    // --- SABOTAGE TEST SCENARIOS ---
    if (sabotageMode === "network") {
      return new Response(
        JSON.stringify({
          error: "Network connection refused: Unable to reach upstream model gateway.",
          code: "NETWORK_ERROR",
        }),
        { status: 503, headers: { "Content-Type": "application/json" } }
      );
    }

    if (sabotageMode === "429") {
      return new Response(
        JSON.stringify({
          error: "Rate limit exceeded (429): You have exceeded your request quota per minute. Please try again in 15 seconds.",
          code: "RATE_LIMIT_EXCEEDED",
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": "15",
          },
        }
      );
    }

    if (sabotageMode === "mid-stream") {
      return createMidStreamSabotageStream();
    }

    const lastMessage = messages?.[messages.length - 1];
    const userPrompt =
      lastMessage?.parts
        ?.filter((p) => p.type === "text")
        .map((p: any) => p.text)
        .join(" ") || "Hello";

    // Check if prompt specifically requests sabotage mid-stream
    if (userPrompt.toLowerCase().includes("sabotage mid-stream") || userPrompt.toLowerCase().includes("kill mid-stream")) {
      return createMidStreamSabotageStream();
    }

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey || apiKey.trim() === "" || apiKey.includes("your-groq-api-key")) {
      // Fallback stream if API key is missing
      const stream = createUIMessageStream({
        execute: async ({ writer }) => {
          const msgId = "text-" + Date.now();
          writer.write({
            type: "text-delta",
            id: msgId,
            delta: "⚠️ Groq API key is missing in .env.local. Please configure GROQ_API_KEY to test live model streaming.",
          });
        },
      });
      return createUIMessageStreamResponse({ stream });
    }

    const modelMessages = await convertToModelMessages(messages);

    const result = streamText({
      model: groq(AI_CONFIG.model),
      system: SYSTEM_PROMPT,
      messages: modelMessages,
      tools: serverTools,
      temperature: AI_CONFIG.temperature,
      maxOutputTokens: AI_CONFIG.maxOutputTokens,
    });

    return result.toUIMessageStreamResponse();
  } catch (err: any) {
    console.error("POST /api/chat error:", err);
    return new Response(
      JSON.stringify({
        error: err?.message || "An error occurred while processing your chat request.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
