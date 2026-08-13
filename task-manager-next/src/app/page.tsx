import { AuditChat } from "@/components/chat/audit-chat";

export const metadata = {
  title: "Task Manager AI | Checkpoint 1 Core Build",
  description: "FlyRank AI Foundations Capstone Checkpoint 1 primary AI flow with error recovery, mid-stream failure handling, and sabotage testing.",
};

export default function Home() {
  return (
    <div className="w-full space-y-6 py-4">
      <div className="text-center max-w-2xl mx-auto space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Task Manager AI Assistant
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium">
          Checkpoint 1 Core AI Flow: Generative UI Tool Execution, Error Recovery & Sabotage Testing Suite
        </p>
      </div>

      <AuditChat />
    </div>
  );
}
