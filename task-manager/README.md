# Task Manager (React + Vite)

A small task manager built with React, developed with AI assistance and
then manually reviewed and refactored.

## Features
- Add / complete / delete tasks
- Edit a task in place (double-click)
- Filter by All / Active / Completed
- Persists to localStorage (survives refresh)
- Basic accessibility (labels, `aria-pressed`)

## Running it
```bash
npm install
npm run dev
```
Then open the printed local URL (usually http://localhost:5173).

To build for production:
```bash
npm run build
```

## Submission contents
- `src/` — the completed application
- `docs/PROMPTS.md` — the prompts used during development, in order
- `docs/MANUAL_CHANGES.md` — manual corrections and refactoring done after
  reviewing the AI-generated first draft, with before/after code
- `docs/v1-ai-draft-App.jsx` — the original unmodified AI draft, kept for
  comparison against the final version in `src/App.jsx`

## How AI assisted (summary)
AI (Claude) was used to scaffold the project, generate a first working
draft of the core add/complete/delete flow, and then — in a second pass —
to help extend it: splitting the monolithic component into smaller pieces,
adding localStorage persistence via a custom hook, adding edit-in-place
and filtering, and doing an accessibility pass. Each AI-generated piece was
run and manually tested rather than accepted as-is; see
`docs/MANUAL_CHANGES.md` for the specific bugs found (a state-mutation bug
in the first draft, a missing/unstable `key` prop, no empty-input guard)
and the fixes applied.
