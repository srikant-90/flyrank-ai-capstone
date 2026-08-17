# Week 6 Deliverable: Test-Driven Verification Suite (Vitest + React Testing Library + Playwright + CI)

**Track:** General AI Fluency / Engineering  
**Intern:** Srikant  
**Capstone Project:** FlyRank AI Practitioner Portfolio  
**Course Module:** Week 6 — Test-Driven Verification & CI Automation  
**Deliverable Files:**
- `src/components/ChatMessage.tsx` & `src/components/ChatMessage.test.tsx`
- `src/components/ToolResult.tsx` & `src/components/ToolResult.test.tsx`
- `src/components/SettingsForm.tsx` & `src/components/SettingsForm.test.tsx`
- `e2e/primary-flow.spec.ts`
- `.github/workflows/ci.yml`
**GitHub Repository:** `https://github.com/srikant-90/flyrank-ai-capstone`  

---

## 1. Problem Analysis & Link to Task 1

### How Task 2 Links to Task 1:
* **Task 1 ("Explain It Like You Built It"):** Proved deep human-in-the-loop comprehension of component state, DOM layers, and event propagation (`event.stopPropagation()`).
* **Task 2 ("Test-Driven Verification"):** Establishes the automated safety harness. When developing with agentic coding assistants, automated test suites (Vitest + RTL + Playwright in CI) allow the assistant to self-verify code changes, catch regressions, and ensure that renaming CSS classes or modifying internal logic never breaks user accessibility contracts.

---

## 2. Test Architecture & Component Coverage

### A. Chat Message Renderer (`src/components/ChatMessage.test.tsx`)
Tests the highest-risk conversational AI interface across all states, querying strictly by accessible role and label:
1. **Standard Text Parts:** Renders user/assistant messages with `role="article"`.
2. **Code Block Parts:** Renders syntax-highlighted code inside `role="region"` and tests clipboard copy functionality.
3. **Pending State:** Tests `role="status"` with accessible label `"Thinking..."` when AI is processing.
4. **Streaming State:** Tests live streaming cursor with `role="status"` (`"AI is typing..."`).
5. **Error State & Actionable Retry:** Tests `role="alert"` and triggers `onRetry` handler on button click.

### B. Validated Form (`src/components/SettingsForm.test.tsx`)
Tests schema validation with Zod and React Hook Form:
1. **Valid Submission:** Verifies form submit handler with payload and success notification.
2. **Required Field Validation:** Catches empty field errors without submitting.
3. **Email Format Validation:** Verifies regex/Zod email validation.
4. **Submitting State:** Verifies submit button is disabled during asynchronous submission.

### C. Tool Result Component (`src/components/ToolResult.test.tsx`)
Tests AI agent tool execution outputs (arXiv API queries & JSON flashcard exporter):
1. **Successful Execution:** Verifies parameters, status badge, execution time, and output payload.
2. **Error Alert:** Verifies error messages render inside `role="alert"`.
3. **Collapsible Payload:** Tests expand/collapse toggle buttons.

### D. End-to-End Test (`e2e/primary-flow.spec.ts`)
Playwright E2E walkthrough verifying page load, lead project visibility, and meeting modal interaction.

### E. GitHub Actions Continuous Integration (`.github/workflows/ci.yml`)
Configured to run on every push and pull request:
```yaml
name: CI Test Suite
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npm run test:run
      - run: npm run build
```

---

## 3. Test Suite Execution Results

```
> flyrank-ai-capstone@0.0.0 test:run
> vitest run

 RUN  v2.1.9 D:/FlyRank-Project/flyrank-ai-capstone

 ✓ src/components/settingsTypes.test.ts (1 test) 8ms
 ✓ src/components/ToolResult.test.tsx (3 tests) 245ms
 ✓ src/components/ChatMessage.test.tsx (5 tests) 238ms
 ✓ src/components/SettingsForm.test.tsx (4 tests) 1887ms

 Test Files  4 passed (4)
      Tests  13 passed (13)
   Duration  3.91s
```

---

## 4. Evaluation Criteria Self-Audit (Pass / Revise)

| Criteria | Standard | Status | Verification Detail |
|:---|:---|:---|:---|
| **Meaningful Component Tests** | At least 6 tests querying by role and label (resilient to CSS renames). | **PASS** | 13 component/unit tests querying by `role="article"`, `role="region"`, `role="status"`, `role="alert"`, and `role="button"`. |
| **Chat States Tested** | Pending, streaming, error, code block, and standard text. | **PASS** | All 5 chat states tested in `ChatMessage.test.tsx`. |
| **Playwright E2E Test** | Covers primary flow end-to-end. | **PASS** | `e2e/primary-flow.spec.ts` covers navigation, hero verification, and modal interaction. |
| **CI Integration** | CI runs on push and pull request. | **PASS** | `.github/workflows/ci.yml` runs test suite and build verification. |
