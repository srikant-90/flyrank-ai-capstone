/**
 * app/chat/page.tsx
 * -----------------------------------------------------------------------
 * The AI Chat page for Week 4 Task 2.
 * Renders the AuditChat client component which handles:
 *   - Sending messages to POST /api/chat
 *   - Token-by-token streaming from Google Gemini
 *   - Stop mid-stream without breaking state
 *   - Multi-turn conversation history
 * -----------------------------------------------------------------------
 */

import { AuditChat } from "@/compnent/chat/audit-chat";

export const metadata = {
  title: "AI Chat | Task Manager",
  description: "Ask your AI assistant about tasks and get instant answers.",
};

export default function ChatPage() {
  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <div className="w-full max-w-2xl">
        <h1 className="mb-1 text-2xl font-bold">AI Assistant</h1>
        <p className="mb-4 text-sm text-gray-500">
          Powered by Groq (LLaMA 3.3). Ask anything about your tasks.
        </p>
        <AuditChat />
      </div>
    </div>
  );
}
