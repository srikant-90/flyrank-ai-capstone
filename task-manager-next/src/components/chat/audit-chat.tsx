/**
 * components/chat/audit-chat.tsx
 * -----------------------------------------------------------------------
 * FE-08 Checkpoint 1 Core AI Flow & Failure Handling
 *
 * Implements:
 *  - Primary Chat Flow powered by Groq (LLaMA 3.3)
 *  - 4 Tool Lifecycle Part States (Input Streaming, Available, Output Card, State 4 Error)
 *  - Designed Onboarding Empty State with interactive click-to-fill prompts
 *  - Layout-Matched Skeletons for pending states (0 Cumulative Layout Shift)
 *  - Mid-stream failure recovery & Smart Retry button
 *  - Sabotage testing mode controls
 *  - Mobile Safari dynamic viewport & overscroll optimization
 * -----------------------------------------------------------------------
 */

"use client";

import { useChat } from "@ai-sdk/react";
import { useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Code2,
  Loader2,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Zap,
  WifiOff,
} from "lucide-react";
import { SabotagePanel, type SabotageMode } from "./sabotage-panel";

// --- Types ---
interface TaskAuditResult {
  auditId: string;
  timestamp: string;
  taskTitle: string;
  category: string;
  complexity: "low" | "medium" | "high" | "critical";
  estimatedHours: number;
  daysUntilDeadline: number;
  riskScore: number;
  riskLevel: "Low" | "Medium" | "High" | "Critical";
  healthScore: number;
  blockers: string[];
  recommendations: string[];
  error?: string;
  isError?: boolean;
}

interface UserConfirmationResult {
  status: string;
  action: string;
  details: string;
  requiresConfirmation: boolean;
}

// --- Exact Layout-Matched Skeleton (Guarantees 0 CLS) ---
function AuditCardSkeleton() {
  return (
    <div className="w-full my-3 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm p-4 sm:p-5 animate-pulse">
      {/* Header bar skeleton */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-slate-200" />
          <div className="w-36 h-4 bg-slate-200 rounded" />
        </div>
        <div className="w-20 h-5 bg-slate-200 rounded-full" />
      </div>

      {/* Main body flex layout */}
      <div className="flex flex-col sm:flex-row items-center gap-5">
        {/* Radial gauge placeholder */}
        <div className="w-24 h-24 rounded-full border-4 border-slate-200 flex items-center justify-center shrink-0">
          <div className="w-10 h-6 bg-slate-200 rounded" />
        </div>

        {/* Details skeleton */}
        <div className="flex-1 w-full space-y-3">
          <div className="space-y-1.5">
            <div className="w-3/4 h-5 bg-slate-200 rounded" />
            <div className="flex gap-2">
              <div className="w-24 h-4 bg-slate-150 bg-slate-100 rounded" />
              <div className="w-24 h-4 bg-slate-150 bg-slate-100 rounded" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="h-12 bg-slate-100 rounded-lg" />
            <div className="h-12 bg-slate-100 rounded-lg" />
            <div className="h-12 bg-slate-100 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Radial Health Gauge SVG Component ---
function HealthGauge({ percentage, level }: { percentage: number; level: string }) {
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  let color = "#22c55e"; // Green
  if (level === "Medium") color = "#eab308";
  if (level === "High") color = "#f97316";
  if (level === "Critical") color = "#ef4444";

  return (
    <div className="relative flex flex-col items-center justify-center">
      <svg className="w-24 h-24 transform -rotate-90">
        <circle
          cx="48"
          cy="48"
          r={radius}
          stroke="#e2e8f0"
          strokeWidth="8"
          fill="transparent"
        />
        <circle
          cx="48"
          cy="48"
          r={radius}
          stroke={color}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          style={{ transition: "stroke-dashoffset 0.8s ease-in-out" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="text-xl font-bold text-slate-800">{percentage}%</span>
        <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
          Health
        </span>
      </div>
    </div>
  );
}

// --- Generative UI Result Component (State 3 - Success) ---
function AuditScoreCard({ result }: { result: TaskAuditResult }) {
  const [showDetails, setShowDetails] = useState(false);

  const levelColorMap = {
    Low: "bg-emerald-100 text-emerald-800 border-emerald-300",
    Medium: "bg-yellow-100 text-yellow-800 border-yellow-300",
    High: "bg-amber-100 text-amber-800 border-amber-300",
    Critical: "bg-rose-100 text-rose-800 border-rose-300",
  };

  return (
    <div className="w-full my-3 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md transition-all duration-300 hover:shadow-lg">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-4 py-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-indigo-600" />
          <span className="font-semibold text-sm text-slate-800">
            Task Risk Audit Card
          </span>
        </div>
        <span
          className={`px-3 py-1 text-xs font-bold rounded-full border ${
            levelColorMap[result.riskLevel] || levelColorMap.Low
          }`}
        >
          {result.riskLevel} Risk
        </span>
      </div>

      {/* Main Body */}
      <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-5">
        <div className="shrink-0">
          <HealthGauge percentage={result.healthScore} level={result.riskLevel} />
        </div>

        <div className="flex-1 w-full space-y-3">
          <div>
            <h4 className="font-bold text-base text-slate-900 leading-snug">
              {result.taskTitle}
            </h4>
            <div className="flex flex-wrap gap-2 mt-1">
              <span className="inline-flex items-center gap-1 text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                Category: <strong>{result.category}</strong>
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                Complexity: <strong className="capitalize">{result.complexity}</strong>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 text-center">
              <span className="block text-[10px] text-slate-400 font-medium">
                Risk Score
              </span>
              <span className="text-sm font-bold text-slate-800">
                {result.riskScore}/100
              </span>
            </div>
            <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 text-center">
              <span className="block text-[10px] text-slate-400 font-medium">
                Est. Hours
              </span>
              <span className="text-sm font-bold text-slate-800">
                {result.estimatedHours}h
              </span>
            </div>
            <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 text-center">
              <span className="block text-[10px] text-slate-400 font-medium">
                Deadline Buffer
              </span>
              <span className="text-sm font-bold text-slate-800">
                {result.daysUntilDeadline}d left
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Blockers */}
      {result.blockers && result.blockers.length > 0 && (
        <div className="px-4 py-3 bg-amber-50/50 border-t border-amber-100/80">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 mb-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            Identified Risk Factors & Blockers ({result.blockers.length}):
          </div>
          <ul className="space-y-1 pl-4 list-disc text-xs text-amber-900/90">
            {result.blockers.map((b, idx) => (
              <li key={idx}>{b}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommendations */}
      {result.recommendations && result.recommendations.length > 0 && (
        <div className="px-4 py-3 bg-indigo-50/40 border-t border-indigo-100/60">
          <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900 mb-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
            Recommended Action Plan:
          </div>
          <ul className="space-y-1 text-xs text-slate-700">
            {result.recommendations.map((r, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-indigo-500 font-bold">•</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="border-t border-slate-100 px-4 py-2 bg-slate-50 flex items-center justify-between text-[11px] text-slate-400">
        <span>Audit ID: {result.auditId}</span>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center gap-1 hover:text-slate-600 font-medium transition-colors"
        >
          {showDetails ? "Hide Raw Payload" : "View Raw Payload"}
          {showDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      {showDetails && (
        <pre className="p-3 bg-slate-900 text-slate-200 text-[11px] overflow-x-auto border-t border-slate-800 font-mono">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}

// --- Designed Error State Card (State 4 & Mid-Stream Interruption) ---
function AuditErrorCard({
  errorText,
  taskTitle,
  failedPrompt,
  onRetry,
}: {
  errorText: string;
  taskTitle?: string;
  failedPrompt?: string;
  onRetry?: () => void;
}) {
  const [retrying, setRetrying] = useState(false);

  function handleRetryClick() {
    if (retrying || !onRetry) return;
    setRetrying(true);
    onRetry();
    setTimeout(() => setRetrying(false), 1500);
  }

  const isRateLimit = errorText.includes("429") || errorText.toLowerCase().includes("rate limit");
  const isNetwork = errorText.toLowerCase().includes("network") || errorText.toLowerCase().includes("refused");

  return (
    <div className="w-full my-3 overflow-hidden rounded-2xl border border-rose-300 bg-rose-50/90 shadow-sm p-4 sm:p-5 transition-all">
      <div className="flex items-start gap-3">
        <div className="p-2.5 bg-rose-100 rounded-xl text-rose-600 shrink-0 mt-0.5">
          {isNetwork ? (
            <WifiOff className="w-5 h-5" />
          ) : isRateLimit ? (
            <ShieldAlert className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
        </div>

        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-sm text-rose-950">
              {isRateLimit
                ? "Rate Limit Exceeded (HTTP 429)"
                : isNetwork
                ? "Network Connection Failure"
                : "Execution Failure & Interrupted Stream"}
            </h4>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-rose-200 text-rose-800 uppercase tracking-wider">
              Handled Error
            </span>
          </div>

          <p className="text-xs text-rose-800/90 leading-relaxed font-medium">
            {errorText}
          </p>

          {taskTitle && (
            <div className="text-[11px] text-rose-700 bg-rose-100/60 p-2 rounded-lg border border-rose-200/60 font-mono">
              Target Task: "{taskTitle}"
            </div>
          )}

          <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-t border-rose-200/60">
            <span className="text-[11px] text-rose-700/80 italic">
              {failedPrompt
                ? `Will retry prompt: "${failedPrompt.length > 32 ? failedPrompt.slice(0, 32) + "..." : failedPrompt}"`
                : "Application UI remains interactive and ready for recovery."}
            </span>

            {onRetry && (
              <button
                onClick={handleRetryClick}
                disabled={retrying}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white transition-colors shadow-sm shrink-0"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${retrying ? "animate-spin" : ""}`} />
                {retrying ? "Retrying..." : "Retry Failed Action"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Main Tool Part Lifecycle State Dispatcher ---
function ToolPartDispatcher({
  toolCallId,
  toolName,
  args,
  result,
  isError,
  errorText,
  onRetry,
}: {
  toolCallId: string;
  toolName: string;
  args: any;
  result?: any;
  isError?: boolean;
  errorText?: string;
  onRetry?: () => void;
}) {
  const [showArgsDrawer, setShowArgsDrawer] = useState(false);

  // State 4: Error State
  if (isError || result?.isError || result?.error || errorText) {
    const errorMsg =
      errorText ||
      result?.error ||
      "Tool execution failed due to server connection error.";
    return (
      <AuditErrorCard
        errorText={errorMsg}
        taskTitle={args?.taskTitle}
        onRetry={onRetry}
      />
    );
  }

  // State 3: Output Available
  if (result) {
    if (toolName === "auditTaskRisk") {
      return <AuditScoreCard result={result as TaskAuditResult} />;
    }
  }

  // State 1 & State 2: Input Streaming / Input Available
  return (
    <div className="w-full my-3 overflow-hidden rounded-2xl border border-indigo-200/80 bg-gradient-to-r from-indigo-50/60 to-purple-50/60 shadow-sm p-4 transition-all animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />
          <span className="text-xs font-bold text-indigo-900">
            State 1: Tool Stream Executing [{toolName}]...
          </span>
        </div>
        <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-indigo-100 text-indigo-700">
          Input Streaming
        </span>
      </div>

      <p className="mt-2 text-xs text-slate-600">
        Analyzing task parameters for:{" "}
        <strong className="text-indigo-950">{args?.taskTitle || "Target Task"}</strong>
      </p>

      {/* State 2 Badges */}
      {args && (
        <div className="mt-3 pt-2 border-t border-indigo-100/80">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 mb-1.5">
            <span>State 2: Input Parameters Available</span>
            <button
              onClick={() => setShowArgsDrawer(!showArgsDrawer)}
              className="flex items-center gap-1 text-indigo-600 hover:underline"
            >
              <Code2 className="w-3 h-3" />
              {showArgsDrawer ? "Hide JSON" : "Inspect JSON"}
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {args.category && (
              <span className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[11px] text-slate-700 font-medium">
                Category: <strong>{args.category}</strong>
              </span>
            )}
            {args.complexity && (
              <span className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[11px] text-slate-700 font-medium">
                Complexity: <strong className="capitalize">{args.complexity}</strong>
              </span>
            )}
            {args.estimatedHours && (
              <span className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[11px] text-slate-700 font-medium">
                Est: <strong>{args.estimatedHours}h</strong>
              </span>
            )}
          </div>

          {showArgsDrawer && (
            <pre className="mt-2 p-2.5 bg-slate-900 text-slate-200 text-[10px] rounded-lg font-mono overflow-x-auto">
              {JSON.stringify(args, null, 2)}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}

// --- Main AuditChat Component ---
import { DefaultChatTransport } from "ai";

export function AuditChat() {
  const [sabotageMode, setSabotageMode] = useState<SabotageMode>("none");

  const { messages, setMessages, sendMessage, status, stop, error } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      headers: () => (sabotageMode !== "none" ? { "x-sabotage": sabotageMode } : {}),
    }),
  });

  const [input, setInput] = useState("");
  const [lastUserPrompt, setLastUserPrompt] = useState<string>("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status, error]);

  const isStreaming = status === "streaming" || status === "submitted";

  function handleSendPrompt(promptText: string) {
    if (!promptText.trim() || isStreaming) return;
    setLastUserPrompt(promptText);
    sendMessage({ text: promptText });
    setInput("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    handleSendPrompt(input);
  }

  function handleRetry() {
    const textToRetry = lastUserPrompt || "Audit backend API risk";
    sendMessage({ text: textToRetry });
  }

  function handleResetChat() {
    setMessages([]);
    setLastUserPrompt("");
    setSabotageMode("none");
  }

  return (
    <div className="flex flex-col h-[calc(100dvh-5rem)] min-h-[550px] w-full max-w-4xl mx-auto border border-slate-200 rounded-2xl overflow-hidden bg-slate-50 font-sans shadow-xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 px-5 py-3.5 flex items-center justify-between text-white shadow-sm shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
          <span className="font-bold text-base">
            Task Manager AI Assistant
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-white/20 px-2.5 py-1 rounded-full font-medium backdrop-blur-sm">
            Groq LLaMA 3.3
          </span>
        </div>
      </div>

      {/* Sabotage Chaos Testing Toolbar */}
      <div className="p-3 bg-slate-100 border-b border-slate-200 shrink-0">
        <SabotagePanel
          currentMode={sabotageMode}
          onSelectMode={setSabotageMode}
          onReset={handleResetChat}
        />
      </div>

      {/* Messages Scroll Region */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50 overscroll-contain"
      >
        {/* DESIGNED EMPTY STATE */}
        {messages.length === 0 && (
          <div className="my-6 sm:my-10 space-y-6">
            <div className="text-center space-y-2 max-w-lg mx-auto">
              <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto text-2xl font-bold shadow-sm">
                🤖
              </div>
              <h3 className="font-bold text-slate-800 text-lg sm:text-xl">
                Task Manager AI Risk Audit Agent
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Welcome! Get started by auditing a task or choosing an interactive demo below to test generative UI states and failure recovery.
              </p>
            </div>

            {/* Click-to-Fill Example Prompt Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
              <button
                onClick={() =>
                  handleSendPrompt(
                    "Audit my backend API refactor task with high complexity, 24h estimated effort, and 2 days remaining."
                  )
                }
                className="p-4 bg-white border border-slate-200 hover:border-indigo-300 rounded-xl text-left shadow-sm hover:shadow-md transition-all group"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-indigo-700 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-indigo-600" />
                    ⚡ Audit High-Risk Task
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                </div>
                <p className="text-xs text-slate-600 font-medium">
                  Trigger Generative UI Task Risk Score Card with radial gauge & blocker analysis.
                </p>
              </button>

              <button
                onClick={() =>
                  handleSendPrompt(
                    "Audit my database migration task with critical complexity and 1 day remaining."
                  )
                }
                className="p-4 bg-white border border-slate-200 hover:border-indigo-300 rounded-xl text-left shadow-sm hover:shadow-md transition-all group"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-amber-700 flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                    🔍 Analyze Sprint Blockers
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-600 transition-colors" />
                </div>
                <p className="text-xs text-slate-600 font-medium">
                  Inspect task health metrics, risk score breakdowns, and recommendations.
                </p>
              </button>

              <button
                onClick={() => {
                  setSabotageMode("mid-stream");
                  handleSendPrompt("Audit backend API refactor task mid-stream sabotage test.");
                }}
                className="p-4 bg-white border border-slate-200 hover:border-amber-300 rounded-xl text-left shadow-sm hover:shadow-md transition-all group"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    💥 Test Mid-Stream Recovery
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-600 transition-colors" />
                </div>
                <p className="text-xs text-slate-600 font-medium">
                  Simulate dropped mid-stream connection and test smart retry action.
                </p>
              </button>

              <button
                onClick={() => {
                  setSabotageMode("429");
                  handleSendPrompt("Audit backend API refactor task rate limit test.");
                }}
                className="p-4 bg-white border border-slate-200 hover:border-purple-300 rounded-xl text-left shadow-sm hover:shadow-md transition-all group"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-purple-800 flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-purple-600" />
                    ⏳ Test 429 Rate Limit Card
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-600 transition-colors" />
                </div>
                <p className="text-xs text-slate-600 font-medium">
                  Simulate HTTP 429 Rate Limit error response and verify UI recovery.
                </p>
              </button>
            </div>
          </div>
        )}

        {/* MESSAGES LIST */}
        {messages.map((m) => {
          const isUser = m.role === "user";

          return (
            <div
              key={m.id}
              className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
            >
              <div
                className={`flex gap-2.5 max-w-[92%] sm:max-w-[85%] ${
                  isUser ? "flex-row-reverse" : "flex-row"
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 self-end ${
                    isUser
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-sm"
                  }`}
                >
                  {isUser ? "U" : "🤖"}
                </div>

                {/* Message Body */}
                <div className="space-y-2 w-full">
                  {m.parts && m.parts.length > 0 ? (
                    m.parts.map((part, pIdx) => {
                      // Text Part
                      if (part.type === "text") {
                        if (!part.text) return null;
                        return (
                          <div
                            key={pIdx}
                            className={`p-3.5 rounded-2xl text-sm leading-relaxed ${
                              isUser
                                ? "bg-indigo-600 text-white rounded-br-none shadow-sm"
                                : "bg-white text-slate-800 rounded-bl-none border border-slate-200 shadow-sm"
                            }`}
                            style={{ whiteSpace: "pre-wrap" }}
                          >
                            {part.text}
                          </div>
                        );
                      }

                      // Tool Part (Typed & Dynamic Tool Parts)
                      if (
                        part.type === "dynamic-tool" ||
                        part.type === "tool-invocation" ||
                        part.type === "tool-call" ||
                        part.type === "tool-result" ||
                        (part as any).type?.startsWith?.("tool-")
                      ) {
                        const toolCallId =
                          (part as any).toolCallId ||
                          (part as any).toolInvocation?.toolCallId ||
                          `tool-${pIdx}`;
                        const toolName =
                          (part as any).toolName ||
                          (part as any).toolInvocation?.toolName ||
                          "auditTaskRisk";
                        const args =
                          (part as any).input ||
                          (part as any).args ||
                          (part as any).toolInvocation?.args;
                        const result =
                          (part as any).output ||
                          (part as any).result ||
                          (part as any).toolInvocation?.result;
                        const isErr =
                          (part as any).state === "output-error" ||
                          (part as any).isError ||
                          (part as any).toolInvocation?.isError;
                        const errText = (part as any).errorText;

                        return (
                          <ToolPartDispatcher
                            key={toolCallId}
                            toolCallId={toolCallId}
                            toolName={toolName}
                            args={args}
                            result={result}
                            isError={isErr}
                            errorText={errText}
                            onRetry={handleRetry}
                          />
                        );
                      }

                      return null;
                    })
                  ) : (
                    // Fallback for text content
                    <div
                      className={`p-3.5 rounded-2xl text-sm leading-relaxed ${
                        isUser
                          ? "bg-indigo-600 text-white rounded-br-none shadow-sm"
                          : "bg-white text-slate-800 rounded-bl-none border border-slate-200 shadow-sm"
                      }`}
                      style={{ whiteSpace: "pre-wrap" }}
                    >
                      {(m as any).content}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Pending Skeleton State (Guarantees 0 CLS) */}
        {status === "submitted" && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-slate-400 text-xs pl-10 mb-1">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600" />
              <span>AI Agent processing request and dispatching server tools...</span>
            </div>
            <AuditCardSkeleton />
          </div>
        )}

        {/* Global / Stream Error Card */}
        {error && (
          <AuditErrorCard
            errorText={error.message || "Connection dropped during model streaming."}
            failedPrompt={lastUserPrompt}
            onRetry={handleRetry}
          />
        )}

        <div ref={bottomRef} />
      </div>

      {/* Pinned Sticky Input Form (Mobile Viewport Safe) */}
      <form
        onSubmit={handleSubmit}
        className="p-3 sm:p-4 bg-white border-t border-slate-200 flex items-end gap-2 shrink-0 sticky bottom-0 z-10"
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e as unknown as React.FormEvent);
            }
          }}
          placeholder="Ask to audit a task (e.g. 'Audit my backend task')..."
          rows={1}
          className="flex-1 resize-none rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-600 focus:bg-white transition-all max-h-32"
        />

        {isStreaming ? (
          <button
            type="button"
            onClick={stop}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs transition-colors shrink-0 shadow-sm"
          >
            ⏹ Stop
          </button>
        ) : (
          <button
            type="submit"
            disabled={!input.trim()}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-semibold text-xs transition-all shrink-0 shadow-sm"
          >
            Send ➤
          </button>
        )}
      </form>
    </div>
  );
}
