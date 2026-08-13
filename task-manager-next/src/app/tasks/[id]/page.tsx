import Link from "next/link";
import { INITIAL_TASKS } from "@/lib/tasks-data";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  ShieldAlert,
  ShieldCheck,
  User,
  Zap,
} from "lucide-react";

export default async function TaskDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const task = INITIAL_TASKS.find((t) => t.id === id) || INITIAL_TASKS[0];

  const riskLevel =
    task.riskScore >= 75 ? "Critical" : task.riskScore >= 50 ? "High" : "Low";

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-4 font-sans">
      {/* Back Link */}
      <Link
        href="/tasks"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to All Tasks
      </Link>

      {/* Main Task Detail Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-slate-100 text-slate-700 uppercase">
                {task.category}
              </span>
              <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-indigo-50 text-indigo-700 capitalize">
                {task.complexity} Complexity
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {task.title}
            </h1>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <span
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold border ${
                riskLevel === "Critical"
                  ? "bg-rose-100 text-rose-800 border-rose-300"
                  : riskLevel === "High"
                  ? "bg-amber-100 text-amber-800 border-amber-300"
                  : "bg-emerald-100 text-emerald-800 border-emerald-300"
              }`}
            >
              {riskLevel} Risk ({task.riskScore}/100)
            </span>
          </div>
        </div>

        {/* Description & Metadata */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-slate-400">
            Task Scope & Description
          </h3>
          <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200/80">
            {task.description}
          </p>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
            <span className="block text-[11px] font-medium text-slate-400">Assignee</span>
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1 mt-0.5">
              <User className="w-3.5 h-3.5 text-indigo-600" /> {task.assignee}
            </span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
            <span className="block text-[11px] font-medium text-slate-400">Estimated Effort</span>
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1 mt-0.5">
              <Clock className="w-3.5 h-3.5 text-indigo-600" /> {task.estimatedHours} Hours
            </span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
            <span className="block text-[11px] font-medium text-slate-400">Deadline Buffer</span>
            <span className="text-xs font-bold text-slate-800 mt-0.5 block">
              {task.daysUntilDeadline} Days Remaining
            </span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
            <span className="block text-[11px] font-medium text-slate-400">Health Score</span>
            <span className="text-xs font-bold text-emerald-600 mt-0.5 block">
              {100 - task.riskScore}% Healthy
            </span>
          </div>
        </div>

        {/* Risk Factors / Blockers */}
        <div className="space-y-3 pt-2">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            Identified Risk Factors & Sprint Blockers
          </h3>
          <ul className="space-y-2">
            {task.blockers.map((b, idx) => (
              <li
                key={idx}
                className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs text-amber-900 font-medium flex items-center gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500 italic">
            Audit case ID: {task.id}
          </span>
          <Link
            href={`/chat?prompt=Audit+my+task+${encodeURIComponent(task.title)}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-all"
          >
            <Zap className="w-4 h-4" /> Audit Task in AI Assistant
          </Link>
        </div>
      </div>
    </div>
  );
}
