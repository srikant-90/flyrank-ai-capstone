"use client";

import { useState } from "react";
import Link from "next/link";
import { INITIAL_TASKS, TaskItem } from "@/lib/tasks-data";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Filter,
  Plus,
  ShieldAlert,
  ShieldCheck,
  Zap,
} from "lucide-react";

export default function TasksPage() {
  const [tasks] = useState<TaskItem[]>(INITIAL_TASKS);
  const [filterCategory, setFilterCategory] = useState<string>("All");

  const filteredTasks =
    filterCategory === "All"
      ? tasks
      : tasks.filter((t) => t.category === filterCategory);

  const getRiskBadge = (score: number) => {
    if (score >= 75)
      return (
        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1">
          <ShieldAlert className="w-3 h-3 text-rose-600" /> Critical Risk ({score}%)
        </span>
      );
    if (score >= 50)
      return (
        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1">
          <AlertTriangle className="w-3 h-3 text-amber-600" /> High Risk ({score}%)
        </span>
      );
    return (
      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
        <ShieldCheck className="w-3 h-3 text-emerald-600" /> Healthy ({100 - score}%)
      </span>
    );
  };

  return (
    <div className="space-y-6 py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-indigo-600" />
            Project Tasks & Risk Audit Manager
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real task cases tracked with complexity scoring, deadline buffers, and AI risk audits.
          </p>
        </div>

        <Link
          href="/chat"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-all shrink-0"
        >
          <Zap className="w-4 h-4" />
          Run AI Audit in Chat
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1">
        <div className="flex items-center gap-1.5 bg-slate-200/80 p-1 rounded-xl">
          {["All", "Backend", "Frontend", "Database"].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterCategory === cat
                  ? "bg-white text-slate-900 shadow-sm font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <span className="text-xs text-slate-500 font-medium">
          Showing <strong>{filteredTasks.length}</strong> tasks
        </span>
      </div>

      {/* Task Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 uppercase">
                  {task.category}
                </span>
                {getRiskBadge(task.riskScore)}
              </div>

              <h3 className="text-base font-bold text-slate-900 leading-snug">
                {task.title}
              </h3>

              <p className="text-xs text-slate-600 leading-relaxed">
                {task.description}
              </p>
            </div>

            {/* Metrics Footer */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 font-semibold text-slate-700">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {task.estimatedHours}h
                </span>
                <span>Buffer: {task.daysUntilDeadline}d left</span>
              </div>

              <Link
                href={`/tasks/${task.id}`}
                className="inline-flex items-center gap-1 font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                Inspect Case Details <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
