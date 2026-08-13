"use client";

import { AlertOctagon, Flame, ShieldAlert, WifiOff, Zap, RefreshCw } from "lucide-react";

export type SabotageMode = "none" | "network" | "mid-stream" | "429" | "tool";

interface SabotagePanelProps {
  currentMode: SabotageMode;
  onSelectMode: (mode: SabotageMode) => void;
  onReset: () => void;
}

export function SabotagePanel({
  currentMode,
  onSelectMode,
  onReset,
}: SabotagePanelProps) {
  return (
    <div className="bg-slate-900 text-slate-100 p-3 sm:p-4 rounded-xl border border-slate-800 shadow-lg mb-4 font-sans">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
            🧪 Checkpoint 1 Sabotage & Failure Testing Toolkit
          </span>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-white bg-slate-800 px-2.5 py-1 rounded-lg transition-colors border border-slate-700"
        >
          <RefreshCw className="w-3 h-3" />
          Clear Chat (Empty State)
        </button>
      </div>

      <p className="text-[11px] text-slate-400 mb-3 leading-normal">
        Select a sabotage preset to test edge case recovery. Reviewers use these exact conditions to evaluate error handling:
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        <button
          onClick={() => onSelectMode("none")}
          className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
            currentMode === "none"
              ? "bg-emerald-600 text-white shadow-md ring-2 ring-emerald-400/50"
              : "bg-slate-800 text-slate-300 hover:bg-slate-700"
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          Happy Path
        </button>

        <button
          onClick={() => onSelectMode("network")}
          className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
            currentMode === "network"
              ? "bg-rose-600 text-white shadow-md ring-2 ring-rose-400/50"
              : "bg-slate-800 text-slate-300 hover:bg-slate-700"
          }`}
        >
          <WifiOff className="w-3.5 h-3.5" />
          Kill Network
        </button>

        <button
          onClick={() => onSelectMode("mid-stream")}
          className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
            currentMode === "mid-stream"
              ? "bg-amber-600 text-white shadow-md ring-2 ring-amber-400/50"
              : "bg-slate-800 text-slate-300 hover:bg-slate-700"
          }`}
        >
          <AlertOctagon className="w-3.5 h-3.5" />
          Kill Mid-Stream
        </button>

        <button
          onClick={() => onSelectMode("429")}
          className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
            currentMode === "429"
              ? "bg-purple-600 text-white shadow-md ring-2 ring-purple-400/50"
              : "bg-slate-800 text-slate-300 hover:bg-slate-700"
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          429 Rate Limit
        </button>

        <button
          onClick={() => onSelectMode("tool")}
          className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all col-span-2 sm:col-span-1 ${
            currentMode === "tool"
              ? "bg-rose-700 text-white shadow-md ring-2 ring-rose-500/50"
              : "bg-slate-800 text-slate-300 hover:bg-slate-700"
          }`}
        >
          ⚠️ Tool Failure
        </button>
      </div>

      {currentMode !== "none" && (
        <div className="mt-2.5 px-3 py-1.5 bg-amber-950/60 border border-amber-800/80 rounded-lg text-[11px] text-amber-200 font-medium flex items-center justify-between">
          <span>
            Active Sabotage Preset: <strong>{currentMode.toUpperCase()}</strong>. Next prompt sent will trigger this failure state.
          </span>
          <button
            onClick={() => onSelectMode("none")}
            className="text-[10px] text-amber-400 hover:underline font-bold"
          >
            Clear Sabotage
          </button>
        </div>
      )}
    </div>
  );
}
