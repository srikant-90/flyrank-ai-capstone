import Link from "next/link";

// Server Component — static placeholder list for now.
export default function TasksPage() {
  const placeholderTasks = [
    { id: "1", title: "Set up project scaffold" },
    { id: "2", title: "Connect to Vercel" },
    { id: "3", title: "Add health-check page" },
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Tasks</h1>
      <ul className="divide-y divide-border rounded-[var(--radius-base)] border border-border bg-surface">
        {placeholderTasks.map((task) => (
          <li key={task.id} className="p-4">
            <Link
              href={`/tasks/${task.id}`}
              className="font-medium hover:text-accent"
            >
              {task.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
