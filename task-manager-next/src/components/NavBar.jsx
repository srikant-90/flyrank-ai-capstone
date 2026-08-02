'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const LINKS = [
  { href: '/', label: 'Home' },
  { href: '/tasks', label: 'Tasks' },
  { href: '/settings', label: 'Settings' },
  { href: '/health', label: 'Health' },
]

export function NavBar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-semibold">
          Task Manager
        </Link>

        {/* Mobile toggle */}
        <button
          className="rounded-md border border-border p-2 sm:hidden"
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          ☰
        </button>

        {/* Desktop nav */}
        <nav className="hidden gap-1 sm:flex">
          {LINKS.map((link) => {
            const active = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  active
                    ? 'bg-accent text-accent-foreground'
                    : 'text-foreground/70 hover:bg-border/60'
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Mobile nav */}
      {open && (
        <nav className="flex flex-col gap-1 border-t border-border px-4 py-3 sm:hidden">
          {LINKS.map((link) => {
            const active = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`rounded-md px-3 py-2 text-sm font-medium ${
                  active
                    ? 'bg-accent text-accent-foreground'
                    : 'text-foreground/70 hover:bg-border/60'
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>
      )}
    </header>
  )
}
