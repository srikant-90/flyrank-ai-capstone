// === VERSION 1: Raw AI-generated first draft ===
// Prompt used: "Create a React todo app where I can add tasks, mark them
// complete, and delete them. Keep it simple, one component is fine."
// This is what came back — kept here unmodified as a submission artifact
// to show the starting point before manual review.

import { useState } from 'react'
import './App.css'

function App() {
  const [tasks, setTasks] = useState([])
  const [input, setInput] = useState('')

  function addTask() {
    setTasks([...tasks, { text: input, done: false }])
    setInput('')
  }

  function toggleTask(index) {
    let newTasks = tasks
    newTasks[index].done = !newTasks[index].done
    setTasks(newTasks)
  }

  function deleteTask(index) {
    tasks.splice(index, 1)
    setTasks(tasks)
  }

  return (
    <div className="App">
      <h1>My Tasks</h1>
      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={addTask}>Add</button>
      <ul>
        {tasks.map((task, index) => (
          <li>
            <span style={{ textDecoration: task.done ? 'line-through' : 'none' }}>
              {task.text}
            </span>
            <button onClick={() => toggleTask(index)}>Toggle</button>
            <button onClick={() => deleteTask(index)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
