import { useState } from 'react'

export function TaskItem({ task, onToggle, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(task.text)

  function commitEdit() {
    const trimmed = draft.trim()
    if (trimmed && trimmed !== task.text) {
      onEdit(task.id, trimmed)
    } else {
      setDraft(task.text) // revert if emptied out
    }
    setIsEditing(false)
  }

  return (
    <li className={`task-item ${task.done ? 'done' : ''}`}>
      <button
        className="toggle"
        aria-pressed={task.done}
        aria-label={task.done ? 'Mark as not done' : 'Mark as done'}
        onClick={() => onToggle(task.id)}
      >
        {task.done ? '✓' : ''}
      </button>

      {isEditing ? (
        <input
          className="edit-input"
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commitEdit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') commitEdit()
            if (e.key === 'Escape') {
              setDraft(task.text)
              setIsEditing(false)
            }
          }}
        />
      ) : (
        <span className="task-text" onDoubleClick={() => setIsEditing(true)}>
          {task.text}
        </span>
      )}

      <button className="delete" aria-label={`Delete "${task.text}"`} onClick={() => onDelete(task.id)}>
        ✕
      </button>
    </li>
  )
}
