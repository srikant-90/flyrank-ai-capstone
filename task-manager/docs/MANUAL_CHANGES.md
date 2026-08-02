# Manual Review, Corrections & Refactoring

The AI's first draft (`docs/v1-ai-draft-App.jsx`) worked at a glance in a
quick manual test, but a closer review surfaced real problems. Here's what
was caught and how it was fixed.

## 1. Direct state mutation (functional bug)
**Before:**
```js
function toggleTask(index) {
  let newTasks = tasks
  newTasks[index].done = !newTasks[index].done
  setTasks(newTasks)
}
```
`newTasks = tasks` copies the reference, not the array — `newTasks[index].done = ...`
mutates the original `tasks` array in place, and `setTasks(newTasks)` passes
back the *same* reference. React compares state by reference for the
re-render decision, so this update is unreliable — it can silently fail to
re-render depending on what else triggers a render.

**After (immutable update):**
```js
function toggleTask(id) {
  setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t))
}
```

## 2. Missing/unstable `key` prop
The draft rendered `<li>` with no `key` at all, and even index-based keys
would have been wrong here since deleting an item shifts every index after
it, causing React to misattribute component state to the wrong row. Fixed
by generating a stable `id` (`crypto.randomUUID()`) per task at creation
time and keying on that.

## 3. No guard against empty input
The draft's `addTask` would happily add a blank task if you clicked "Add"
with an empty field. Added a `.trim()` check that bails out early.

## 4. No persistence
Refreshing the page wiped all tasks — there was no localStorage or any
other storage layer. Rather than sprinkling `localStorage.getItem/setItem`
calls through the component, this was pulled out into a reusable
`useLocalStorage` hook so any piece of state can opt into persistence.

## 5. Monolithic component
Everything — form, list, list item markup, all handlers — lived in one
~50-line `App.jsx`. This gets unwieldy fast and makes it hard to test or
reuse pieces. Split into:
- `TaskForm.jsx` — input + submit handling
- `TaskList.jsx` — maps tasks to items
- `TaskItem.jsx` — single row, including edit-in-place
- `FilterBar.jsx` — All/Active/Completed toggle + remaining count
- `hooks/useLocalStorage.js` — persistence logic

## 6. Missing features the assignment implied were needed
The draft only covered add/toggle/delete. Added:
- **Edit-in-place** (double-click a task, `Enter` to save, `Escape` to
  cancel)
- **Filtering** by All / Active / Completed
- **Remaining task count**

## 7. Accessibility gaps
The toggle button had no label (just an empty circle) and no way for a
screen reader to tell whether a task was done. Added `aria-pressed` and
descriptive `aria-label`s on the toggle and delete buttons, and a proper
(visually hidden) `<label>` for the text input.

## Why this matters for the writeup
The AI draft was a reasonable *starting point* — it captured the right
shape of the problem (state + list + handlers) quickly. But it had a real
bug that would show up intermittently in testing, not obviously in a first
skim, plus gaps (no persistence, no edit, no filter, weak accessibility)
that only come out from actually using the app and thinking about edge
cases. That review-and-fix step is the manual work worth highlighting in
the submission — the value wasn't just accepting AI output, it was reading
it critically and testing assumptions like "does this actually re-render
correctly when I click twice quickly."
