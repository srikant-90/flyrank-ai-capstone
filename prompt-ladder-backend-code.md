# Prompt Ladder: Getting Usable Backend Code Out of an AI Prompt

**Track:** Backend development (Node.js/Express)

**Method:** One layer added per version. Every version run independently, output compared against the previous version only.

---

## Baseline (weak prompt)

> "Write backend code"

**Output (excerpt):**
```js
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(3000, () => console.log('Server running on port 3000'));
```
> Let me know what kind of backend you need — I can adjust this!

This is the embarrassing baseline: a boilerplate "Hello World" Express server with zero connection to any actual requirement, followed by the AI asking me for the information I should have given it up front.

---

## Version 1 — Layer: Clearer goal

**Prompt:**
> "Write backend code for an API endpoint that lets a user upload a file and get back a unique download link."

**Output (excerpt):**
```js
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('file'), (req, res) => {
  const fileId = uuidv4();
  res.json({ downloadLink: `/download/${fileId}` });
});
```

**Notes:**
- **Prompt change:** Added a specific goal (file upload endpoint returning a download link) instead of "write backend code" with no target.
- **What improved in the output:** Stopped being a disconnected Hello World and became a real endpoint solving an actual problem — it picked multer for uploads and uuid for unique links unprompted, which are reasonable defaults.
- **What still failed:** It guessed my stack and storage approach with no way to know if they matched reality. No database, no info about the rest of the app it needs to slot into.
- **What I'd try next:** Give it the actual project context instead of letting it invent a stack.

---

## Version 2 — Layer: Real context

**Prompt:** (V1 + one line)
> "...This is for a Node.js + Express app that already uses multer for uploads and Prisma + PostgreSQL for the database. Files should be recorded in a `files` table with a UUID primary key."

**Output (excerpt):**
```js
app.post('/upload', upload.single('file'), async (req, res) => {
  const file = await prisma.files.create({
    data: { id: uuidv4(), filename: req.file.originalname, path: req.file.path },
  });
  res.json({ downloadLink: `/download/${file.id}` });
});
```

**Notes:**
- **Prompt change:** Added the actual existing stack (Prisma + Postgres, existing multer setup) instead of leaving it to guess.
- **What improved in the output:** The code now integrates with the real database layer instead of assuming an in-memory store — it correctly used `prisma.files.create` and matched the schema I described. This is the first version I could actually drop into my project without rewriting the data layer myself.
- **What still failed:** No validation at all — any file type, any size, no error handling if the upload fails. It would break in production immediately.
- **What I'd try next:** Add explicit constraints around what's allowed.

---

## Version 3 — Layer: Constraints

**Prompt:** (V2 + one line)
> "...Constraints: max file size 5MB, only allow .pdf, .docx, and .png, must return proper HTTP error codes for invalid uploads, no external cloud storage — store locally only."

**Output (excerpt):**
```js
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/png'];
    cb(null, allowed.includes(file.mimetype));
  },
});

app.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Invalid or missing file' });
  const file = await prisma.files.create({ data: { id: uuidv4(), filename: req.file.originalname, path: req.file.path } });
  res.status(201).json({ downloadLink: `/download/${file.id}` });
});
```
> A short paragraph followed the code explaining that multer's `fileFilter` silently rejects instead of erroring, so the `if (!req.file)` check is what actually returns the 400, and noting where to mount this route relative to existing middleware.

**Notes:**
- **Prompt change:** Added explicit constraints (size limit, allowed types, error codes, local-only storage).
- **What improved in the output:** The code went from "would break in production" to actually handling the real failure modes — oversized files, wrong types, missing files all now return proper error codes instead of crashing or silently succeeding.
- **What still failed:** Still had to trust that the explanatory paragraph after the code (about mounting the route, middleware order) wouldn't get lost if I asked for a cleaner format — turned out to be a fair worry, see V4.
- **What I'd try next:** Ask for a stricter output format to make the code easier to drop in directly.

---

## Version 4 — Layer: Specified output format

**Prompt:** (V3 + one line)
> "...Output only two code blocks: (1) the multer config, (2) the route handler. No prose outside the code — put any necessary explanation as inline comments only."

**Output (excerpt):**
```js
// multer config
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => { /* ... */ },
});
```
```js
// route handler
app.post('/upload', upload.single('file'), async (req, res) => { /* ... */ });
```

**Notes:**
- **Prompt change:** Forced code-only output, no prose, explanations pushed into comments.
- **What improved in the output:** Cleaner to paste directly into a file — no narration to strip out manually.
- **What still failed (honest "this made it worse" moment):** The useful non-code information from V3 disappeared entirely — the note about `fileFilter` silently rejecting rather than erroring, and where to mount the route relative to existing middleware, didn't survive being squeezed into inline comments. Those weren't code, they were operational warnings, and "no prose outside code" threw them out along with the narration I actually wanted gone. Stricter format wasn't a clean win — I lost real information, not just noise.
- **What I'd try next:** Loosen the format back slightly and instead ask directly for the specific kind of non-code info I want kept (gotchas, wiring instructions) rather than banning all prose.

---

## Version 5 — Layer: Verification requirements

**Prompt:** (V3's format, i.e. code + brief necessary notes, + one new line)
> "...After the code, list 3 test cases (valid upload, oversized file, wrong file type) with the expected response for each, and flag any edge case you're not confident is handled."

**Output (excerpt):**
> **Test cases:**
> 1. Valid PDF, 2MB → 201, returns downloadLink
> 2. 8MB file → 400 (rejected by multer's `limits`, but note: multer emits this as a stream error, not a normal req/res flow — make sure there's an error-handling middleware after this route or the request will hang)
> 3. .exe file → 400, rejected by fileFilter
>
> **Edge case I'm not confident about:** two users uploading files with the exact same original filename at the same time — the current code doesn't dedupe by filename, only by generated UUID for the *record*, but the actual file on disk uses multer's default naming, so a collision is possible depending on your multer storage config.

**Notes:**
- **Prompt change:** Asked for explicit test cases and a stated confidence gap instead of just code.
- **What improved in the output:** It surfaced a real bug I hadn't asked about — the oversized-file case needing dedicated error-handling middleware or the request hangs — and flagged a genuine filename-collision edge case with reasoning, not just a generic disclaimer. This is information I would have found the hard way in production otherwise.
- **What still failed:** It didn't actually fix the flagged edge cases, just named them — I still have to go implement the fix myself.
- **What I'd try next:** Fold "propose a fix" into the same instruction next time, not just "flag it."

---

## Summary of what earned its place

| Version | Layer added | Verdict |
|---|---|---|
| V1 | Clearer goal | Helped — gave the code an actual purpose |
| V2 | Real context | Helped a lot — code matched the real stack instead of a guessed one |
| V3 | Constraints | Helped — turned it into production-viable code |
| V4 | Output format (code-only) | **Made it worse** — lost real operational warnings, not just narration |
| V5 | Verification requirements | Helped — surfaced a real bug and a genuine edge case unprompted |

---

## Final reusable prompt

Usable by anyone else on a Node.js/Express backend without needing this conversation for context.

> Write backend code for **[SPECIFIC FEATURE, e.g. "an endpoint that lets a user upload a file and get back a unique download link"]**.
>
> Stack/context: **[e.g. "Node.js + Express, uploads handled by multer, database is Postgres via Prisma with a `[table]` table shaped like [...]"]**.
>
> Constraints: **[e.g. "max file size X, allowed types Y, proper HTTP error codes, no external services"]**.
>
> Output the code itself, plus any short operational notes I actually need to wire it in safely (gotchas, middleware ordering, non-obvious failure modes) — keep narration minimal but don't strip out warnings just to keep the response short.
>
> After the code, list 2–3 concrete test cases with expected responses, and explicitly flag any edge case you're not fully confident is handled.
