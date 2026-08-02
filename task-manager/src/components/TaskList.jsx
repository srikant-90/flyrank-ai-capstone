import { TaskItem } from './TaskItem'

export function TaskList({ tasks, onToggle, onDelete, onEdit }) {
  if (tasks.length === 0) {
    return <p className="empty-state">Nothing here yet.</p>
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        // Manual fix: stable unique id as key, not array index — the AI
        // draft used no key at all, which breaks reconciliation on delete.
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </ul>
  )
}
