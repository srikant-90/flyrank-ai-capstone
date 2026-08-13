/**
 * app/api/chat/route.ts
 * -----------------------------------------------------------------------
 * FE-07 Generative UI & Server Tools Route Handler.
 * Server tools defined with Zod schemas:
 *  - auditTaskRisk: Scores task complexity, deadlines, & risk factors.
 *  - requestUserConfirmation: User confirmation before critical actions.
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
    .describe("Simulate an audit failure for testing State 4 rendering"),
});

const userConfirmationSchema = z.object({
  action: z.string().describe("The action requiring user confirmation"),
  details: z.string().describe("Explanation of why confirmation is required"),
});

// 2. Server Tools Definition (AI SDK v7 using inputSchema)
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

      // Simulate server calculation processing time
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

function createFallbackStream(userPrompt: string, errorNotice?: string) {
  const stream = createUIMessageStream({
    execute: async ({ writer }) => {
      const lower = userPrompt.toLowerCase();

      // Check if user is testing the failure state (State 4)
      const isSimulateError =
        lower.includes("fail") || lower.includes("error") || lower.includes("broken");

      const isAuditRequest =
        lower.includes("audit") ||
        lower.includes("risk") ||
        lower.includes("score") ||
        lower.includes("check") ||
        lower.includes("task") ||
        isSimulateError;

      if (isAuditRequest) {
        const callId = "call-" + Date.now();
        const args = {
          taskTitle: isSimulateError
            ? "Database Migration Cleanup (Error Test)"
            : "Refactor Next.js App Router API Routes",
          category: "Backend",
          complexity: isSimulateError ? "critical" : "high",
          estimatedHours: 24,
          daysUntilDeadline: 2,
          simulateError: isSimulateError,
        };

        // State 1 & 2: Stream tool-call-start
        writer.write({
          type: "tool-call-start",
          toolCallId: callId,
          toolName: "auditTaskRisk",
        } as any);

        // Simulate server execution delay
        await new Promise((res) => setTimeout(res, 800));

        if (isSimulateError) {
          // State 4: Stream tool-result error
          writer.write({
            type: "tool-result",
            toolCallId: callId,
            result: {
              error: `Failed to audit task "${args.taskTitle}": Telemetry connection timed out while fetching historical metrics from audit server.`,
              isError: true,
            },
          } as any);

          const msgId = "text-" + Date.now();
          writer.write({
            type: "text-delta",
            id: msgId,
            delta:
              "\n\n⚠️ **Audit Failure State Rendered:** The tool execution encountered a simulated telemetry error. Check the designed error card above for details and retry action.",
          });
        } else {
          // State 3: Stream tool-result success
          writer.write({
            type: "tool-result",
            toolCallId: callId,
            result: {
              auditId: "audit-" + Math.random().toString(36).substring(2, 9),
              timestamp: new Date().toISOString(),
              taskTitle: args.taskTitle,
              category: args.category,
              complexity: args.complexity,
              estimatedHours: args.estimatedHours,
              daysUntilDeadline: args.daysUntilDeadline,
              riskScore: 65,
              riskLevel: "High",
              healthScore: 35,
              blockers: [
                "Insufficient time buffer before target deadline (2 days left for 24h task)",
                "Requires architectural peer code review",
              ],
              recommendations: [
                "Decompose task into smaller sub-tasks under 8 hours each",
                "Prioritize immediate peer code review to prevent slippage",
                "Ensure test coverage for critical execution paths",
              ],
            },
          } as any);

          const msgId = "text-" + Date.now();
          const reply =
            "\n\nI have completed the task risk audit. The health score is **35% (High Risk)** due to tight deadlines. Please review the detailed risk score card above.";
          writer.write({
            type: "text-delta",
            id: msgId,
            delta: reply,
          });
        }
      } else {
        // Standard conversational response
        let reply = "";
        if (lower.includes("hi") || lower.includes("hello")) {
          reply =
            "Hello! I am your Task Manager AI Assistant. You can ask me to **audit a task** (e.g. *'Audit my backend task'* or *'Test an audit error'*).";
        } else {
          reply = `I received your message: "${userPrompt}".\n\nTry asking: **"Audit my backend API refactor task"** to trigger the server-side audit tool and see all 4 Generative UI states!`;
        }

        if (errorNotice) {
          reply = `⚠️ *Notice: ${errorNotice}*\n\n${reply}`;
        }

        const words = reply.split(" ");
        const msgId = "msg-" + Date.now();
        for (let i = 0; i < words.length; i++) {
          writer.write({
            type: "text-delta",
            id: msgId,
            delta: words[i] + (i < words.length - 1 ? " " : ""),
          });
          await new Promise((res) => setTimeout(res, 30));
        }
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

    if (!apiKey || apiKey.trim() === "" || apiKey.includes("your-groq-api-key")) {
      return createFallbackStream(userPrompt);
    }

    try {
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
    } catch (apiError: unknown) {
      const err = apiError as Error;
      console.error("Groq API Error, falling back to smart tool stream:", err);
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
