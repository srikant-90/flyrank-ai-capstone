"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function ChatError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Chat Route Error Boundary caught:", error);
  }, [error]);

  return (
    <div className="p-6 flex flex-col items-center justify-center text-center">
      <div className="max-w-lg w-full bg-rose-50/80 border border-rose-200 rounded-2xl p-6 space-y-3">
        <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center mx-auto">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <h3 className="text-base font-bold text-rose-950">
          Chat Flow Route Exception
        </h3>
        <p className="text-xs text-rose-800 font-medium">
          {error.message || "An exception occurred while loading the AI chat interface."}
        </p>
        <button
          onClick={() => reset()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Reload Chat Boundary
        </button>
      </div>
    </div>
  );
}
