/**
 * components/chat/audit-chat.tsx
 * -----------------------------------------------------------------------
 * FE-07 Generative UI: Server-Side Tools & Typed Tool Parts Rendering
 *
 * Implements the 4 Tool Lifecycle Part States:
 *  - State 1: Input Streaming / Pending (Pulsing loading morph state)
 *  - State 2: Input Available (Typed parameter pill tags & JSON drawer)
 *  - State 3: Output Available (Generative UI Task Risk Score Card & Health Gauge)
 *  - State 4: Output Error / Failed Execution (Designed error state card with retry)
 * Plus: User Confirmation Tool Component (requestUserConfirmation)
 * -----------------------------------------------------------------------
 */

"use client";

import { useChat } from "@ai-sdk/react";
import { useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Code2,
  Loader2,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  Zap,
} from "lucide-react";

// --- Types ---
interface TaskAuditResult {
  auditId: string;
  timestamp: string;
  taskTitle: string;
  category: string;
  complexity: "low" | "medium" | "high" | "critical";
  estimatedHours: number;
  daysUntilDeadline: number;
  riskScore: number; // 0 - 100
  riskLevel: "Low" | "Medium" | "High" | "Critical";
  healthScore: number; // 0 - 100
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

// --- Radial Health Gauge SVG Component ---
function HealthGauge({ percentage, level }: { percentage: number; level: string }) {
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  let color = "#22c55e"; // Green for Low risk
  if (level === "Medium") color = "#eab308"; // Yellow
  if (level === "High") color = "#f97316"; // Orange
  if (level === "Critical") color = "#ef4444"; // Red

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

// --- Generative UI: Component Result Render (State 3 - Success) ---
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
        {/* Radial Health Gauge */}
        <div className="shrink-0">
          <HealthGauge percentage={result.healthScore} level={result.riskLevel} />
        </div>

        {/* Task Details & Metrics Grid */}
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

          {/* Stat Cards */}
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

      {/* Risk Factors / Blockers */}
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

      {/* Recommendations List */}
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

      {/* Expandable Meta Footer */}
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

// --- Generative UI: Designed Error State (State 4) ---
function AuditErrorCard({
  errorText,
  taskTitle,
  onRetry,
}: {
  errorText: string;
  taskTitle?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="w-full my-3 overflow-hidden rounded-2xl border border-rose-300 bg-rose-50/90 shadow-sm p-4 sm:p-5 transition-all">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-rose-100 rounded-xl text-rose-600 shrink-0 mt-0.5">
          <ShieldAlert className="w-5 h-5" />
        </div>

        <div className="flex-1 space-y-1.5">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-sm text-rose-900">
              Tool Execution Failure
            </h4>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-rose-200 text-rose-800 uppercase tracking-wider">
              State 4: Error
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

          <div className="pt-2 flex items-center justify-between">
            <span className="text-[11px] text-rose-600/80 italic">
              Designed error state — application UI remains responsive.
            </span>
            {onRetry && (
              <button
                onClick={onRetry}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white transition-colors shadow-sm"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Retry Audit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Generative UI: User Confirmation Action Component ---
function UserConfirmationCard({
  result,
  onConfirm,
}: {
  result: UserConfirmationResult;
  onConfirm: (confirmed: boolean) => void;
}) {
  const [decided, setDecided] = useState<"approved" | "rejected" | null>(null);

  return (
    <div className="w-full my-3 overflow-hidden rounded-2xl border border-indigo-200 bg-indigo-50/50 shadow-sm p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-indigo-100 rounded-xl text-indigo-600 shrink-0">
          <Zap className="w-5 h-5" />
        </div>

        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-sm text-indigo-950">
              User Action Confirmation Required
            </h4>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-indigo-200 text-indigo-800 uppercase">
              Interaction Tool
            </span>
          </div>

          <p className="text-xs text-indigo-900 leading-relaxed font-semibold">
            Action: {result.action}
          </p>

          <p className="text-xs text-slate-600 leading-relaxed">{result.details}</p>

          {decided === null ? (
            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={() => {
                  setDecided("approved");
                  onConfirm(true);
                }}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-colors"
              >
                Approve Action ✅
              </button>
              <button
                onClick={() => {
                  setDecided("rejected");
                  onConfirm(false);
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold transition-colors"
              >
                Cancel ❌
              </button>
            </div>
          ) : (
            <div className="pt-1 text-xs font-semibold">
              {decided === "approved" ? (
                <span className="text-emerald-600">✅ Action Approved by User</span>
              ) : (
                <span className="text-rose-600">❌ Action Cancelled by User</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- Main Tool Part Lifecycle State Dispatcher Component ---
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
      "Tool execution failed due to a server connection error.";
    return (
      <AuditErrorCard
        errorText={errorMsg}
        taskTitle={args?.taskTitle}
        onRetry={onRetry}
      />
    );
  }

  // State 3: Output Available (Success Component Render)
  if (result) {
    if (toolName === "auditTaskRisk") {
      return <AuditScoreCard result={result as TaskAuditResult} />;
    }
    if (toolName === "requestUserConfirmation") {
      return (
        <UserConfirmationCard
          result={result as UserConfirmationResult}
          onConfirm={(confirmed) => {
            console.log("User action confirmation:", confirmed);
          }}
        />
      );
    }
  }

  // State 1 & State 2: Pending / Input Available
  return (
    <div className="w-full my-3 overflow-hidden rounded-2xl border border-indigo-200/80 bg-gradient-to-r from-indigo-50/60 to-purple-50/60 shadow-sm p-4 transition-all animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />
          <span className="text-xs font-bold text-indigo-900">
            State 1: Executing Tool [{toolName}]...
          </span>
        </div>
        <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-indigo-100 text-indigo-700">
          Input Streaming
        </span>
      </div>

      <p className="mt-2 text-xs text-slate-600">
        Analyzing task health parameters for:{" "}
        <strong className="text-indigo-950">{args?.taskTitle || "Target Task"}</strong>
      </p>

      {/* State 2: Input Available Parameter Badges */}
      {args && (
        <div className="mt-3 pt-2 border-t border-indigo-100/80">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 mb-1.5">
            <span>State 2: Input Available (Typed Parameters)</span>
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
            {args.daysUntilDeadline && (
              <span className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[11px] text-slate-700 font-medium">
                Deadline: <strong>{args.daysUntilDeadline}d</strong>
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

import { DefaultChatTransport } from "ai";

// --- Main AuditChat Client Component ---
export function AuditChat() {
  const { messages, sendMessage, status, stop, error } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status]);

  const isStreaming = status === "streaming" || status === "submitted";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || isStreaming) return;
    sendMessage({ text });
    setInput("");
  }

  function triggerSampleAudit(taskName: string, forceErr = false) {
    if (isStreaming) return;
    const promptText = forceErr
      ? `Audit my backend task "${taskName}" and simulate an error.`
      : `Audit my task "${taskName}" with high complexity, 24 hours estimated effort, and 2 days remaining until deadline.`;
    sendMessage({ text: promptText });
  }

  return (
    <div className="flex flex-col h-[650px] w-full max-w-3xl mx-auto border border-slate-200 rounded-2xl overflow-hidden bg-slate-50 font-sans shadow-xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 px-5 py-4 flex items-center justify-between text-white shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
          <span className="font-bold text-base">
            Task Manager Generative UI Agent
          </span>
        </div>
        <span className="text-xs bg-white/20 px-2.5 py-1 rounded-full font-medium backdrop-blur-sm">
          FE-07 Server Tools
        </span>
      </div>

      {/* Quick Interactive Tool Trigger Bar */}
      <div className="bg-white border-b border-slate-200 px-4 py-2 flex flex-wrap items-center gap-2 text-xs">
        <span className="font-semibold text-slate-500">Quick Demos:</span>
        <button
          onClick={() => triggerSampleAudit("Refactor App Router API Routes")}
          className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg font-medium border border-indigo-200 transition-colors"
        >
          ⚡ Audit High-Risk Task
        </button>
        <button
          onClick={() => triggerSampleAudit("Database Cleanup", true)}
          className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg font-medium border border-rose-200 transition-colors"
        >
          ⚠️ Test Error State (State 4)
        </button>
      </div>

      {/* Messages Scroll Region */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50"
      >
        {messages.length === 0 && (
          <div className="text-center my-12 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto text-xl font-bold">
              🤖
            </div>
            <h3 className="font-bold text-slate-800 text-base">
              Generative UI Tool Showcase
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              Ask to audit any task or click one of the quick demo buttons above to test all 4 tool lifecycle states (Input Streaming, Input Available, Output Component, & Designed Error State).
            </p>
          </div>
        )}

        {messages.map((m) => {
          const isUser = m.role === "user";

          return (
            <div
              key={m.id}
              className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
            >
              <div
                className={`flex gap-2.5 max-w-[90%] ${
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
                  {/* Process Message Parts (Text & Tool Parts) */}
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

                      // Tool Part (Typed Tool Parts)
                      if (
                        part.type === "tool-invocation" ||
                        part.type === "tool-call" ||
                        part.type === "tool-result"
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
                          (part as any).args ||
                          (part as any).toolInvocation?.args;
                        const result =
                          (part as any).result ||
                          (part as any).toolInvocation?.result;
                        const isErr =
                          (part as any).isError ||
                          (part as any).toolInvocation?.isError;

                        return (
                          <ToolPartDispatcher
                            key={toolCallId}
                            toolCallId={toolCallId}
                            toolName={toolName}
                            args={args}
                            result={result}
                            isError={isErr}
                            onRetry={() =>
                              triggerSampleAudit(args?.taskTitle || "Task")
                            }
                          />
                        );
                      }

                      return null;
                    })
                  ) : (
                    // Fallback for simple message text
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

        {/* Global Connection / SDK Error */}
        {error && (
          <AuditErrorCard
            errorText={error.message || "Connection error occurred."}
            onRetry={() => triggerSampleAudit("Refactor App Router API Routes")}
          />
        )}

        {/* Loading Indicator */}
        {status === "submitted" && (
          <div className="flex items-center gap-2 text-slate-400 text-xs pl-10">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600" />
            <span>AI agent thinking and dispatching tools...</span>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleSubmit}
        className="p-3 sm:p-4 bg-white border-t border-slate-200 flex items-end gap-2"
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
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs transition-colors shrink-0"
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
