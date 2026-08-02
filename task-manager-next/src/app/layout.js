import "./globals.css";
import { NavBar } from "@/components/NavBar";

export const metadata = {
  title: "Task Manager",
  description: "A simple task manager built with Next.js and Tailwind.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <NavBar />
        <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
          {children}
        </main>
        <footer className="border-t border-border px-4 py-4 text-center text-xs text-muted">
          Task Manager — built with Next.js
        </footer>
      </body>
    </html>
  );
}
