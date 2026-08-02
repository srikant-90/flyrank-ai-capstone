// Server Component. Marked dynamic so this always fetches fresh data on
// each request rather than being frozen at build time.
export const dynamic = "force-dynamic";

async function getHealthData() {
  try {
    const res = await fetch("https://api.github.com/zen", {
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Upstream returned ${res.status}`);
    const message = await res.text();
    return { ok: true, message, checkedAt: new Date().toISOString() };
  } catch (err) {
    return { ok: false, message: err.message, checkedAt: new Date().toISOString() };
  }
}

export default async function HealthPage() {
  const health = await getHealthData();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Health Check</h1>
      <div
        className={`rounded-[var(--radius-base)] border p-4 ${
          health.ok
            ? "border-border bg-surface"
            : "border-danger bg-danger/10"
        }`}
      >
        <p className="text-sm text-muted">Status</p>
        <p className="text-lg font-semibold">
          {health.ok ? "OK — upstream reachable" : "Error"}
        </p>
        <p className="mt-3 text-sm text-muted">Fetched message</p>
        <p className="font-mono text-sm">{health.message}</p>
        <p className="mt-3 text-xs text-muted">
          Checked at {health.checkedAt}
        </p>
      </div>
    </div>
  );
}
