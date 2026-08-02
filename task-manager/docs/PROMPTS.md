# Prompts Used During Development

This log records the prompts used to build the Task Manager app with AI
assistance (Claude), in the order they were used.

### 1. Scaffolding
> "Scaffold a new React app with Vite for a task manager project."

### 2. Initial feature draft
> "Create a React todo app where I can add tasks, mark them complete, and
> delete them. Keep it simple, one component is fine."

This produced a working but flawed single-file draft (kept at
`docs/v1-ai-draft-App.jsx` for reference) — see MANUAL_CHANGES.md for the
issues found in review.

### 3. Requesting a review pass
> "Review this component for bugs, especially around how state is updated
> and how the list is rendered. Point out anything that would cause React
> to behave unpredictably."

This surfaced the direct-mutation bug in `toggleTask`/`deleteTask` and the
missing `key` prop on list items.

### 4. Refactor into components
> "Split this into separate components — a form, a list, and a list item —
> and give each task a stable unique id instead of relying on array index."

### 5. Add persistence
> "Add localStorage persistence so tasks survive a page refresh, using a
> reusable custom hook rather than duplicating the logic."

### 6. Add missing features
> "Add an edit-in-place feature (double-click a task to edit it) and a
> filter for All / Active / Completed tasks, plus a remaining-count
> footer."

### 7. Accessibility pass
> "Check the components for basic accessibility issues — labels, aria
> attributes on toggle buttons, that kind of thing — and fix what's
> missing."

### 8. Styling
> "Write a clean, modern CSS stylesheet for this — card layout, soft
> shadows, a single accent color, rounded corners."

### 9. Verification
> "Build the project and confirm there are no errors."
