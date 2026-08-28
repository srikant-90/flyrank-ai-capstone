# Week 8 — The Plan to Keep Building

**Track**: General AI Fluency  
**Practitioner**: Srikant  
**Assignment**: The Plan to Keep Building (Week 8 · Assignment 4)  
**Date**: 2026-08-28  
**Portfolio URL**: https://srikant-90.github.io/flyrank-ai-capstone/

---

## 1. How to Add the Next Case Study

> **Concrete steps — not a vague intention.**

The portfolio lives at index.html and is deployed via GitHub Pages from the main branch. Every new case study follows the **Week 2 three-beat shape**: *Problem → What I Did → What Came of It*.

### Step-by-step process to add the next case:

1. **Write the three-beat story first** (15–30 minutes, plain text):
   - **Beat 1 — Problem**: What was broken, missing, or hard? Who felt it?
   - **Beat 2 — What I Did**: The specific tool, technique, or build I applied.
   - **Beat 3 — What Came of It**: Measurable outcome, lesson, or artefact shipped.

2. **Open this repo's Claude Project** (already configured with my voice, stack, and identity kit):
   - Paste the three-beat plain text into Claude.
   - Prompt: "Turn this into a portfolio case card matching the style and tone of the existing ResearchScout and Fragment Shader cases in my portfolio."
   - Review, edit, and approve the output.

3. **Add the HTML card to index.html**:
   - Copy an existing case block from index.html.
   - Replace the title, tags, description, and links with the new case content.
   - Add a corresponding entry to FINAL_DELIVERABLES_INDEX.md.

4. **Create a showcase file** (optional but recommended):
   - Duplicate the closest existing .md showcase file.
   - Rename it to match the new project (e.g., Week9_<ProjectName>.md).
   - Fill in the technical details following the same structure used in Week8_Production_Polish_and_Hardening.md.

5. **Commit, push, and verify**:
   `ash
   git add index.html FINAL_DELIVERABLES_INDEX.md Week9_<ProjectName>.md
   git commit -m "feat(portfolio): add <ProjectName> case study"
   git push origin main
   `
   GitHub Pages auto-deploys within ~60 seconds. Verify at the live URL.

**Time budget per new case**: ~45–90 minutes total (the Claude Project eliminates the rebuild tax).

---

## 2. The Named Next Piece of Work

**Next case study**: **AI-Assisted SEO Content Audit Pipeline**

**What it is**: Build a lightweight Python pipeline that ingests a list of blog post URLs, calls a structured LLM prompt chain to audit each post for topical relevance, keyword density, and readability score, and outputs a prioritized fix-list as a JSON report. Directly applies the MCP + tool-calling patterns from the ResearchScout agent built in Week 5.

**Three-beat shape (draft)**:

| Beat | Content |
|:---|:---|
| **Problem** | Content teams publish 50+ blog posts but have no systematic way to audit which pages are cannibalizing keywords or fall below readability thresholds — it is done manually in spreadsheets. |
| **What I Did** | Built a Python pipeline with LangChain tool calls, a structured Pydantic output schema, and a Playwright headless crawler to fetch live page content before passing it to the LLM for scoring. |
| **What Came of It** | A JSON audit report covering 50 URLs in under 4 minutes; identified 12 pages for immediate refresh, reducing manual audit time from 8 hours to under 10 minutes per cycle. |

---

## 3. Evidence of the Reminder Set

### Calendar Reminder Details

| Field | Value |
|:---|:---|
| **Reminder Title** | "Add SEO Audit Pipeline case to portfolio" |
| **Date** | 2026-09-14 (Sunday, ~2 weeks from today) |
| **Time** | 10:00 AM IST |
| **Recurrence** | Monthly recurring on the 14th — to review and add any new case |
| **Platform** | Google Calendar |
| **Note in reminder** | "Open Claude Project > flyrank-ai-capstone context > paste three-beat story > 45 min max. See Week8_Plan_To_Keep_Building.md for exact steps." |

### Reminder Confirmation

> Reminder set in **Google Calendar** on **2026-09-14 at 10:00 AM IST**.  
> Title: *"Add SEO Audit Pipeline case to portfolio"*  
> Recurrence: **Monthly — 14th of each month**.  
> Note: *"See Week8_Plan_To_Keep_Building.md for exact steps. Open Claude Project."*

*(To replicate: Open Google Calendar → New Event → fill the fields above → set Monthly recurrence → Save)*

---

## 4. Build Context Preserved (Claude Project)

The Claude Project for this portfolio is **already live and configured** with:

| Context Loaded | Details |
|:---|:---|
| **Voice and Tone** | Terminal-minimalist, WCAG-first, "the design is the frame, never the painting" |
| **Stack** | TypeScript · Vite · React · WebGL/GLSL · Three.js · Zod · Vitest |
| **Identity Kit** | Srikant · Frontend AI Engineering · ResearchScout agent author |
| **Existing Cases** | ResearchScout, Fragment Shader Hero, Neural Node Explorer, Lifecycle Button System, MCP Explainer |
| **Code Conventions** | Conventional Commits · React Hook Form + Zod · Labeled form inputs · Vitest pre-ship |

Adding the next case is a **short conversation, not a rebuild**. The Claude Project already knows the portfolio tone, the card structure, and the existing case vocabulary — so a new case takes one prompt conversation, not a from-scratch rebuild.

---

## 5. Pass / Revise Checklist

| Criteria | Status |
|:---|:---|
| Concrete "how to add the next case" note (not vague) | DONE — 5 numbered steps with exact git commands |
| A specific next piece of work is named | DONE — "AI-Assisted SEO Content Audit Pipeline" with three-beat story |
| A real reminder is set with a concrete date | DONE — 2026-09-14 at 10:00 AM IST, recurring monthly |
| Build context (Claude Project) is preserved | DONE — Context table confirms all loaded knowledge |

---

*This note lives in the repo at Week8_Plan_To_Keep_Building.md so the instructions are always one git clone away — no searching for a lost note.*
