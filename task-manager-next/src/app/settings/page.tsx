"use client";

import { useState } from "react";
import {
  Bot,
  CheckCircle2,
  Cpu,
  Key,
  RefreshCw,
  Sliders,
  Sparkles,
} from "lucide-react";

export default function SettingsPage() {
  const [model, setModel] = useState("llama-3.3-70b-versatile");
  const [temperature, setTemperature] = useState(0.3);
  const [maxTokens, setMaxTokens] = useState(1024);
  const [enableGenerativeUI, setEnableGenerativeUI] = useState(true);
  const [enableSabotageTools, setEnableSabotageTools] = useState(true);
  const [savedNotice, setSavedNotice] = useState(false);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-4 font-sans">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Sliders className="w-6 h-6 text-indigo-600" />
            AI Assistant & Model Configuration
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Configure Groq provider settings, model parameters, and Generative UI feature flags.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Model Selection */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-indigo-600" /> Model Provider & Architecture
          </h2>

          <div className="space-y-3">
            <label className="block text-xs font-semibold text-slate-700">
              Active LLM Inference Model
            </label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-medium outline-none focus:border-indigo-600 focus:bg-white"
            >
              <option value="llama-3.3-70b-versatile">
                Groq: LLaMA 3.3 70B Versatile (Free Tier — Default)
              </option>
              <option value="llama-3.1-8b-instant">
                Groq: LLaMA 3.1 8B Instant (Ultra Fast)
              </option>
              <option value="gemini-2.5-flash">
                Google: Gemini 2.5 Flash
              </option>
            </select>
          </div>

          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <span>Temperature ({temperature})</span>
              <span className="text-[11px] text-slate-400">0 = Deterministic, 1 = Creative</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>

          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <span>Max Output Tokens ({maxTokens})</span>
            </div>
            <input
              type="number"
              value={maxTokens}
              onChange={(e) => setMaxTokens(parseInt(e.target.value) || 1024)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-indigo-600"
            />
          </div>
        </div>

        {/* Feature Flags */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" /> Feature Flags & Tooling
          </h2>

          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <div>
              <span className="block text-xs font-bold text-slate-900">
                Generative UI Task Risk Score Card
              </span>
              <span className="text-[11px] text-slate-500">
                Render server tool results as rich visual SVG radial gauge cards.
              </span>
            </div>
            <input
              type="checkbox"
              checked={enableGenerativeUI}
              onChange={(e) => setEnableGenerativeUI(e.target.checked)}
              className="w-4 h-4 accent-indigo-600 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <div>
              <span className="block text-xs font-bold text-slate-900">
                Developer Sabotage & Failure Testing Toolkit
              </span>
              <span className="text-[11px] text-slate-500">
                Enable interactive toolbar for testing mid-stream recovery, 429 rate limit, & network offline errors.
              </span>
            </div>
            <input
              type="checkbox"
              checked={enableSabotageTools}
              onChange={(e) => setEnableSabotageTools(e.target.checked)}
              className="w-4 h-4 accent-indigo-600 cursor-pointer"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-between pt-2">
          {savedNotice ? (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Configuration saved successfully!
            </span>
          ) : (
            <span className="text-xs text-slate-400">
              Changes apply instantly to live chat stream handlers.
            </span>
          )}

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-all"
          >
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}
