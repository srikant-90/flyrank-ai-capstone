import { useMemo, useState } from 'react'
import { useLocalStorage } from './hooks/useLocalStorage'
import { TaskForm } from './components/TaskForm'
import { TaskList } from './components/TaskList'
import { FilterBar } from './components/FilterBar'
import './App.css'

function App() {
  const [tasks, setTasks] = useLocalStorage('tasks', [])
  const [filter, setFilter] = useState('all')

  function addTask(text) {
    const newTask = { id: crypto.randomUUID(), text, done: false }
    setTasks((prev) => [...prev, newTask]) // immutable — no direct mutation
  }

  function toggleTask(id) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    )
  }

  function deleteTask(id) {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }

  function editTask(id, text) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, text } : t)))
  }

  const visibleTasks = useMemo(() => {
    if (filter === 'active') return tasks.filter((t) => !t.done)
    if (filter === 'completed') return tasks.filter((t) => t.done)
    return tasks
  }, [tasks, filter])

  const remaining = tasks.filter((t) => !t.done).length

  return (
    <div className="App">
      <h1>Task Manager</h1>
      <TaskForm onAdd={addTask} />
      <TaskList
        tasks={visibleTasks}
        onToggle={toggleTask}
        onDelete={deleteTask}
        onEdit={editTask}
      />
      {tasks.length > 0 && (
        <FilterBar filter={filter} onChange={setFilter} remaining={remaining} />
      )}
    </div>
  )
}

export default App
