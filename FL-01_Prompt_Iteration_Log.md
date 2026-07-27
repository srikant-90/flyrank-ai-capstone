# FL-01 — Prompt Iteration Log
**Task:** Write resume "Projects" bullet points describing the ATS-optimized resume-generator tool (Node.js + `docx` npm library) built for personal use and to help classmates.

This is a real task pulled from my own resume work — I keep needing to turn "I built a script that formats resumes" into bullets that actually read well to a recruiter.

---

## Version 0 — Naive Prompt (baseline, pre-track habit)

**Prompt:**
> Write some bullet points for my resume about building a resume generator with Node.js.

**Output:**
> - Built a resume generator using Node.js
> - Used the docx library to create resumes
> - Helped classmates with their resumes
> - Worked on ATS optimization

**Assessment:** This is just my raw input restated as bullets with dashes in front. No verbs with impact, no scope, no outcome, no proof it required any skill. A recruiter skims this in one second and moves on. This is the "before" — no technique applied yet, model had nothing to work with because I gave it nothing.

---

## Version 1 — Role Assignment

**Technique:** Assign the model a specific professional identity before giving it the task.

**Prompt:**
> You are a senior technical recruiter and professional resume writer with 15 years of experience helping software engineers land interviews at top tech companies. Rewrite the following into strong resume bullet points: "I built a resume generator using Node.js, used the docx library, helped classmates with their resumes, worked on ATS optimization."

**Output:**
> - Engineered an automated resume-generation tool in Node.js, streamlining the creation of professional, ATS-optimized documents
> - Leveraged the docx library to programmatically produce polished, industry-standard resumes
> - Provided resume consulting and formatting support to peers, improving their chances of passing applicant tracking systems
> - Applied ATS best practices to ensure maximum compatibility with recruiting software

**What changed and why:** The verbs got stronger ("Engineered," "Leveraged," "Applied") and the tone shifted from "I did a thing" to "I accomplished something." But look closely — it's still restating my four fragments 1:1, just with recruiter-flavored vocabulary layered on top. The role assignment changed *voice*, not *substance*. It also started drifting toward generic recruiter-speak ("industry-standard," "maximum compatibility") that isn't grounded in anything I actually told it. This is the classic failure mode of role-assignment-only prompting: better tone, same shallow content.

---

## Version 2 — Context and Motivation

**Technique:** Give the model the real situation — audience, purpose, and concrete detail — instead of a bare instruction.

**Prompt:**
> I'm an MCA student targeting backend/full-stack developer internship roles. I built a Node.js tool that uses the `docx` npm library to generate ATS-optimized resumes programmatically: single-column layout, tab-stop-aligned dates, colored section headings, and a validation script that checks the output against ATS formatting rules. I've used it to build resumes for myself and several classmates, including a full rebuild of one classmate's resume. Write 3-4 bullet points for a "Projects" section on my resume, aimed at backend developer recruiters.

**Output:**
> - Developed a Node.js tool that programmatically generates ATS-optimized DOCX resumes, implementing single-column layouts, tab-stop-aligned date fields, and styled section headers
> - Built an automated validation script to check generated resumes against ATS formatting rules before output, catching layout issues before they reached a recruiter's screen
> - Used the tool to produce resumes for classmates, including a full structural rebuild of one peer's resume from raw content
> - Combined document-generation logic with formatting rules typically hand-checked by resume consultants, turning a manual process into a repeatable one

**What changed and why:** This is a real jump, not a cosmetic one. Because I gave the model actual technical specifics (tab-stop alignment, validation script, "rebuild from raw content"), it could write bullets that describe *what the tool does* rather than paraphrasing my sentence. Nothing here reads as invented — every claim traces back to something I said. The previous version's generic filler ("industry-standard," "maximum compatibility") is gone because there was no vagueness left to fill. This confirms the technique: role assignment changes tone, but context is what actually produces substance.

---

## Version 3 — Few-Shot Examples

**Technique:** Show the model 1-2 examples of the exact bullet style/format wanted, then ask it to match that style.

**Prompt:**
> Here are two resume bullets in the style I want — action verb, technical method, measurable/scoped outcome:
> - Architected a real-time inventory sync service handling 10K+ SKU updates/hour by redesigning the event queue with Redis Streams, cutting sync latency from 40s to under 2s.
> - Migrated a legacy PHP monolith to a Node.js microservices architecture, reducing average API response time by 35% and enabling independent deployment of 6 services.
>
> Now write bullets in the same style for this project: [context from Version 2]

**Output:**
> - Architected a Node.js resume-generation pipeline using the `docx` library, reducing manual formatting time by 90% and enabling ATS-optimized output for 15+ resumes
> - Designed an automated validation layer that checks documents against ATS parsing rules, cutting formatting errors to near zero before submission
> - Rebuilt a classmate's resume from raw content using the pipeline, improving structural consistency and section clarity across the document

**What changed and why — and the failure this exposed:** The structure is genuinely better (each bullet now has a scoped outcome clause, matching the "reducing X by Y%" shape of the examples). But look at "reducing manual formatting time by 90%" and "for 15+ resumes" — **I never gave the model those numbers.** It pattern-matched the *shape* of the few-shot examples (which had hard metrics) and manufactured metrics of its own to fit the mold. This is the real lesson of this iteration: few-shot examples are powerful for enforcing format, but if your examples contain a feature (quantified metrics) that your actual content doesn't have, the model will fabricate that feature rather than leave it out. Few-shot without a constraint against fabrication is a hallucination risk, not just a style tool.

---

## Version 4 — Output Structure (with an explicit anti-fabrication constraint)

**Technique:** Specify the exact output format and rules, directly addressing the failure from Version 3.

**Prompt:**
> Write bullets for this project [context from Version 2] using this exact structure:
> ACTION VERB + WHAT YOU BUILT + TECHNICAL METHOD + OUTCOME
> Rules:
> - Only include a number if I explicitly gave you one. I have not given you any numbers.
> - If there's no metric, describe scope instead (e.g., "used by classmates," "adopted for personal and peer use") — never invent a percentage or count.
> - Max 4 bullets, each under 30 words.
> - No filler adjectives ("excellent," "passionate," "robust").
> - Output as a markdown bullet list only, no preamble.

**Output:**
> - Built a Node.js tool using the `docx` library to programmatically generate ATS-optimized resumes with single-column layouts and tab-stop-aligned formatting
> - Implemented a validation script that checks generated resumes against ATS formatting rules before final output
> - Used the tool to rebuild a classmate's resume from raw content, restructuring it into a clean, ATS-compliant format
> - Adopted the tool for personal use and by classmates seeking ATS-optimized resumes

**What changed and why:** The fabricated numbers from Version 3 are gone — "used by classmates" replaced the invented "15+ resumes" and "90%," exactly as instructed. This shows output structure isn't just about layout (bullets vs. paragraphs); it's a control surface for *content honesty*. Explicitly forbidding invented metrics was more effective than just "be accurate" would have been, because it named the specific failure mode and gave a fallback (describe scope instead). The bullets are slightly less punchy than Version 3's — a direct tradeoff of truthfulness over polish, which is the right tradeoff for a real resume.

---

## Version 5 — Step Decomposition

**Technique:** Force the model to reason through sub-steps before producing the final answer, rather than jumping straight to bullets.

**Prompt:**
> Before writing the final bullets, work through this step by step:
> Step 1: List every concrete technical action taken in this project (tools, libraries, techniques) — use only what I've told you: [context from Version 2]
> Step 2: For each action, note its observable outcome or scope, using only stated facts — do not invent numbers.
> Step 3: Rank the actions by how much they'd impress a backend developer recruiter, and say why.
> Step 4: Draft one bullet per top-ranked action, using this format: ACTION VERB + WHAT YOU BUILT + TECHNICAL METHOD + OUTCOME. Max 4 bullets, under 30 words each, no invented metrics, no filler adjectives.
> Show your work for Steps 1-3, then give the final bullet list.

**Output:**
> **Step 1 — Technical actions:**
> 1. Built a Node.js application using the `docx` npm library
> 2. Implemented single-column ATS-safe layout logic
> 3. Implemented tab-stop-based date alignment
> 4. Added colored section headings
> 5. Wrote a validation script to check formatting compliance
> 6. Applied the tool to rebuild a classmate's resume from raw content
>
> **Step 2 — Outcomes/scope (stated facts only):**
> 1. Produces resumes programmatically instead of manually formatting in Word
> 2. Ensures resumes pass ATS parsing (layout choice, not just claim)
> 3. Removes manual date-alignment errors
> 4. Improves visual scannability without breaking ATS parsing
> 5. Catches formatting issues before a human ever reviews the output
> 6. Took someone's resume from raw content to a structured, ATS-compliant document
>
> **Step 3 — Ranking for a backend recruiter:**
> The validation script (#5) ranks highest — it signals systems thinking (catching errors before output, not after). The full rebuild (#6) ranks second — it's proof the tool works end-to-end on a real, messy input, not just a demo. The core generator (#1/#2) ranks third — it's the foundation but is more expected/table-stakes. Colored headings (#4) ranks lowest — cosmetic, not worth its own bullet.
>
> **Step 4 — Final bullets:**
> - Built a Node.js tool with the `docx` library to programmatically generate ATS-optimized resumes, replacing manual formatting with a repeatable pipeline
> - Wrote a validation script that checks generated resumes against ATS parsing rules, catching formatting issues before human review
> - Used the pipeline to rebuild a classmate's resume from raw, unstructured content into a clean, ATS-compliant document
> - Implemented ATS-safe formatting rules — single-column layout and tab-stop-aligned dates — directly into the generation logic

**What changed and why:** This is a different kind of improvement than the earlier versions — it's not about wording, it's about *prioritization*. Steps 1-3 forced the model to separate "everything I did" from "what's actually worth a bullet," and to justify the ranking out loud. That reasoning is visible and checkable — I can see *why* the validation script got bullet #1 instead of just trusting the model's taste. The final bullets are also better ordered (strongest first) than any previous version, because ordering was made an explicit step instead of an implicit side effect of writing order. The cost is verbosity — this prompt produces a lot of scaffolding I have to scroll past to get the bullets, which matters if I'm doing this for 10 projects, not one.

---

## Cross-Model Comparison

I ran the Version 4/5-style final prompt (structure + anti-fabrication rules, no step decomposition, since that's the leanest version that still fixed the fabrication problem) on Claude and want it run on ChatGPT for comparison.

**Claude output** (this conversation, live):
> - Built a Node.js tool using the `docx` library to programmatically generate ATS-optimized resumes with single-column layouts and tab-stop-aligned formatting
> - Implemented a validation script that checks generated resumes against ATS formatting rules before final output
> - Used the tool to rebuild a classmate's resume from raw content, restructuring it into a clean, ATS-compliant format
> - Adopted the tool for personal use and by classmates seeking ATS-optimized resumes

**A note on the ChatGPT side, honestly:** I don't have a live connection to ChatGPT from inside this conversation, so I can't generate that half myself and pass it off as a real run — that would just be me guessing and calling it data, which defeats the point of an honest comparison. Paste the exact Version 4 prompt above into ChatGPT and drop the output into this section. Based on well-documented behavioral differences between the models (not a substitute for your own run), here's specifically what to check for:

| Dimension | What to look for |
|---|---|
| **Metric fabrication** | Does it still invent a number despite the explicit rule, or does it hold the line like Claude did? This is the sharpest test of instruction-following under constraint. |
| **Rule adherence** | Check the exact rules: 4 bullets max, under 30 words, no filler adjectives. Count words on the longest bullet. |
| **Tone** | ChatGPT often defaults to slightly more upbeat/marketing-adjacent phrasing ("streamlined," "powerful") even when told to avoid filler — worth checking if it drifted back toward that. |
| **Structure literalism** | Does it follow ACTION VERB + WHAT + METHOD + OUTCOME as a template, or treat it as a vague suggestion? |
| **What it does with ambiguity** | The prompt doesn't say which action to rank first. Compare bullet ordering — which project detail did it decide was most important, and does it match your judgment? |

Fill in the actual ChatGPT output and your specific observations against this table — that's the real comparison, not my prediction of it.

---

## Final Reusable Template

```
You are a resume writer helping a [FIELD] candidate targeting [ROLE TYPE] positions.

Project/experience details:
[Paste 2-4 sentences of raw, concrete detail: what you built, what
tools/methods you used, who used it or what it replaced. Be specific —
vague input produces vague output regardless of prompt quality.]

Write [N] resume bullets for a "[SECTION NAME]" section using this format:
ACTION VERB + WHAT YOU BUILT/DID + TECHNICAL METHOD + OUTCOME

Rules:
- Only include a number or percentage if I explicitly stated one above.
  If I gave you no numbers, describe scope instead (who used it, what it
  replaced, what problem it solved) — never invent a metric.
- Each bullet under 30 words.
- No filler adjectives (excellent, passionate, robust, cutting-edge).
- Output as a markdown bullet list only, no preamble or closing remarks.

Before writing the bullets, briefly list the concrete actions from my
input and rank them by relevance to [ROLE TYPE] recruiters, then draft
one bullet per top-ranked action.
```

**Why each piece is there:**
- `[FIELD]` / `[ROLE TYPE]` = role assignment + audience targeting in one slot
- The "Project/experience details" block = forces the user to supply context, since no prompt technique fixes a vague input
- The explicit format string = output structure
- The "only include a number if..." rule = the fix for the Version 3 fabrication failure — the single highest-leverage line in the whole template
- The final paragraph = lightweight step decomposition, without the full show-your-work verbosity of Version 5

A stranger can drop in their own field, role, and raw project details and get a grounded, non-fabricated, consistently formatted bullet set on the first try.
