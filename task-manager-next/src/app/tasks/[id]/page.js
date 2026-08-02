import Link from "next/link";

// Server Component — params are available directly, no client state needed.
export default async function TaskDetailPage({ params }) {
  const { id } = await params;

  return (
    <div className="space-y-4">
      <Link href="/tasks" className="text-sm text-accent hover:underline">
        &larr; Back to tasks
      </Link>
      <h1 className="text-2xl font-semibold">Task {id}</h1>
      <p className="text-muted">
        Placeholder detail view — full task fields, edit, and delete will
        go here.
      </p>
    </div>
  );
}
