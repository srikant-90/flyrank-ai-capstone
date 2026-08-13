import "./globals.css";
import Link from "next/link";
import { Bot, CheckSquare, Settings, HeartPulse } from "lucide-react";

export const metadata = {
  title: "Task Manager AI | Checkpoint 1",
  description: "FlyRank AI Foundations Capstone Checkpoint 1 primary AI flow",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full bg-slate-100">
      <body className="h-full font-sans antialiased text-slate-900 flex flex-col">
        <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 font-bold text-base text-white hover:text-indigo-400 transition-colors">
              <span className="p-1.5 bg-indigo-600 rounded-lg text-white">
                <Bot className="w-4 h-4" />
              </span>
              <span>Task Manager AI</span>
            </Link>

            <nav className="flex items-center gap-1 sm:gap-2 text-xs font-semibold">
              <Link
                href="/"
                className="px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-all flex items-center gap-1.5"
              >
                <Bot className="w-3.5 h-3.5 text-indigo-400" />
                <span>AI Chat</span>
              </Link>
              <Link
                href="/tasks"
                className="px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-all flex items-center gap-1.5"
              >
                <CheckSquare className="w-3.5 h-3.5" />
                <span>Tasks</span>
              </Link>
              <Link
                href="/health"
                className="px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-all flex items-center gap-1.5"
              >
                <HeartPulse className="w-3.5 h-3.5" />
                <span>Health</span>
              </Link>
              <Link
                href="/settings"
                className="px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-all flex items-center gap-1.5"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Settings</span>
              </Link>
            </nav>
          </div>
        </header>

        <main className="flex-1 max-w-6xl w-full mx-auto p-3 sm:p-6">
          {children}
        </main>
      </body>
    </html>
  );
}
