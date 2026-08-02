// Server Component (default) — no interactivity needed here.
export default function HomePage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="text-muted">
        Overview placeholder — task counts, recent activity, and quick
        actions will live here.
      </p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {["Open tasks", "Completed", "Overdue"].map((label) => (
          <div
            key={label}
            className="rounded-[var(--radius-base)] border border-border bg-surface p-4"
          >
            <p className="text-sm text-muted">{label}</p>
            <p className="mt-1 text-2xl font-semibold">—</p>
          </div>
        ))}
      </div>
    </div>
  );
}
