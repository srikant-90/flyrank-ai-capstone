import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Task Manager",
  description: "FlyRank AI Foundations Assignment",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <nav className="bg-blue-600 text-white p-4">
          <div className="max-w-5xl mx-auto flex gap-6">
            <Link href="/">Home</Link>
            <Link href="/tasks">Tasks</Link>
            <Link href="/settings">Settings</Link>
            <Link href="/health">Health</Link>
          </div>
        </nav>

        <main className="max-w-5xl mx-auto p-6">
          {children}
        </main>
      </body>
    </html>
  );
}