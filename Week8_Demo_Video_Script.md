# Week 8 — Demo Video Script (3–5 Minute Live Narration)

**Assignment**: Week 8 · Final Assignment — README + Demo Video  
**Practitioner**: Srikant  
**Track**: General AI Fluency  
**Target Duration**: 3 min 45 sec (fits the 3–5 min requirement)  
**Format**: Screen recording + live voice narration. No slides. No pre-recorded clips.  
**Tools**: OBS Studio (free, no watermark) or Loom Free Tier  
**Upload**: Unlisted YouTube link → submit via FlyRank portal  

**Live URL to open before recording**: https://srikant-90.github.io/flyrank-ai-capstone/  
**GitHub Repo**: https://github.com/srikant-90/flyrank-ai-capstone  

---

## Pre-Recording Checklist

Complete every item before hitting Record.

- [ ] Browser: Chrome at 1920×1080, 100% zoom, no browser extensions visible
- [ ] Close all unrelated tabs — only the portfolio URL should be open
- [ ] Microphone tested — no background noise, clear voice
- [ ] OBS/Loom configured: 1080p, 30fps minimum, microphone input selected
- [ ] Portfolio is live and loading correctly at the URL above
- [ ] `Week8_Production_Polish_and_Hardening.html` page is bookmarked or in a tab
- [ ] Have the rate limiter demo ready (rapid-click plan prepared)
- [ ] Do one dry run of the narration before recording

---

## Section 1 — Opening & Live Agent Run (0:00 – 1:10)

**Screen action**: Browser open to https://srikant-90.github.io/flyrank-ai-capstone/  
Show the full portfolio landing page scrolling slowly.

**Narration (speak naturally — this is a guide, not a script to read word-for-word):**

> "Hi, I'm Srikant. This is the live walkthrough of my FlyRank AI Capstone — an 8-week General AI Fluency internship build. Everything you're seeing is running in production. No slides, no mock-ups — this is the real thing.
>
> The centrepiece of this portfolio is ResearchScout: an autonomous AI research agent I built to solve a real problem I face every day as an AI practitioner. There are dozens of new papers on arXiv every morning, and reading all of them manually is impossible. ResearchScout automates that: it takes a learning goal, queries the live arXiv REST API, synthesizes the findings, and generates structured Anki flashcards — with one critical rule: nothing gets written to your notes vault without your explicit approval.
>
> Let me run it live right now. I'll type a real query — 'Explain Flash Attention and memory efficiency in Transformer models' — and hit Submit."

**[TYPE the query and hit Submit — pause narration for 3 seconds while the API call happens]**

> "Notice those tool-call cards appearing in real time. The agent is calling the arXiv REST endpoint, parsing the XML response, and validating every paper's metadata against a strict JSON schema. And here — this is the Human-in-the-Loop gate. The agent has paused. It will not write anything to disk until I approve. This is a deliberate engineering decision, not an afterthought. I'll come back to why in a moment."

---

## Section 2 — One Key Design Decision Explained on Camera (1:10 – 2:10)

**Screen action**: Click through to the 3D Neural Node Explorer  
(`Week7_3D_Hero_Scene.html`) or the WebGL shader hero page.  
Move your mouse across the canvas to show live 60 FPS response.

**Narration:**

> "Now I want to explain one major design decision I made, because this is where I pushed back against the AI tools I was using.
>
> When I was building these interactive graphics — the WebGL fragment shader here, and the Three.js 3D neural node explorer — every AI tool I used suggested the same thing: use React-Three-Fiber, download GLTF 3D model files, use heavy animation libraries.
>
> I said no. Here's why.
>
> Those frameworks add hundreds of kilobytes to the JavaScript bundle and introduce extra render layers between your code and the GPU. I wanted this portfolio to load fast and run at 60 frames per second on any device — including low-end mobile phones.
>
> So I wrote pure GLSL ES 1.0 fragment shaders and vanilla Three.js geometry — 100% procedural, zero model file downloads. The entire 3D scene you're seeing right now is generated mathematically at runtime. The bundle is under 180 kilobytes gzipped.
>
> You can see it: move the mouse, the liquid distortion responds in under 16 milliseconds per frame. This is what I mean by treating graphics as a performance system, not decoration. The design is the frame — it should never be the painting."

---

## Section 3 — Anti-Abuse Guardrail + One Honest Limitation on Camera (2:10 – 3:10)

**Screen action**: Navigate to `Week8_Production_Polish_and_Hardening.html`  
Click the Submit button rapidly 10+ times to trigger the rate limiter.  
Show the status badge change from "Pass" to "Blocked — 429 Rate Limit".

**Narration:**

> "Let me show you the production hardening layer, and I want to be upfront about one real limitation — because hiding your limitations is the one thing that makes a portfolio untrustworthy.
>
> This is the hardening dashboard. ResearchScout is publicly deployed, which means anyone on the internet can send requests to it. To prevent credit-exhaustion attacks — someone bombarding the API to drain my LLM tokens — I built a multi-layer guardrail: a sliding-window rate limiter set to 10 requests per minute, a prompt character cap at 2,000 characters, and a 30-second execution ceiling.
>
> Watch what happens when I click submit 11 times in a row."

**[Click rapidly — show the 429 badge appear]**

> "The 11th request is blocked with an HTTP 429. That works.
>
> Now, here is the honest limitation I want to name on camera: this rate limiter runs in client-side JavaScript memory. That means if you hard-reload the browser — press F5 — the request counter resets to zero. A determined person could bypass it that way.
>
> I know this. It is documented as a known limitation in the README. The version 2 fix is connecting the limiter to a serverless Redis instance — Upstash — so it tracks IP hashes across sessions and reloads. I didn't have time to build that in this 8-week capstone window, and I would rather name it clearly than pretend it doesn't exist.
>
> Knowing exactly where your system breaks is the most trusted skill in engineering."

---

## Section 4 — Eval Results & Wrap-Up (3:10 – 3:45)

**Screen action**: Return to the portfolio landing page or the README on GitHub.  
Scroll to show the evaluation results table.

**Narration:**

> "Before I close, the numbers. I ran 25 repeated trials across all 6 evaluation cases: daily ingestion, grounding and contradiction handling, schema compliance, prompt injection shielding, out-of-scope guardrail, and unknown topic handling. Every case passed at 100%.
>
> The full setup — how to clone, install, run the tests, and reproduce every result — is in the README linked in the description. A stranger with no prior context of this project should be able to follow those steps and get a working local build in under 10 minutes.
>
> This capstone taught me one thing more clearly than anything else: AI engineering is not about prompting. It's about building reliable systems around unreliable models. Schema contracts, HITL gates, rate limiters, and honest limitation docs — that's the real work.
>
> Thanks for watching."

---

## Timing Summary

| Section | Content | Target Time |
|:---|:---|:---|
| 1 | Opening + live agent run | 0:00 – 1:10 (70 sec) |
| 2 | Design decision: WebGL vs React-Three-Fiber | 1:10 – 2:10 (60 sec) |
| 3 | Anti-abuse guardrail + honest limitation | 2:10 – 3:10 (60 sec) |
| 4 | Eval results + wrap-up | 3:10 – 3:45 (35 sec) |
| **Total** | | **~3 min 45 sec** |

---

## Evaluation Criteria Checklist (Self-Verify Before Uploading)

- [ ] A stranger could reproduce the setup from the README alone — YES (README has exact clone, install, run, test commands)
- [ ] Eval results and limitations included, not hidden — YES (table in README + named on camera in Section 3)
- [ ] Video shows a live end-to-end run, not slides — YES (browser, live API call, live 429 trigger)
- [ ] Video runs 3–5 minutes with clear narration — YES (~3:45)
- [ ] One design decision explained on camera — YES (Vanilla WebGL vs React-Three-Fiber, Section 2)
- [ ] One limitation explained on camera — YES (in-memory rate limiter bypass, Section 3)

---

## OBS Studio Quick Setup (If You Have Not Used It Before)

1. Download OBS Studio (free, no watermark): https://obsproject.com
2. Open OBS → click **+** under Sources → choose **Display Capture**
3. Add **Audio Input Capture** for your microphone
4. Settings → Output → set to 1080p, 30fps, MP4 format
5. Click **Start Recording** → do your walkthrough → **Stop Recording**
6. Upload the file to YouTube as **Unlisted** (not Public, not Private)
7. Copy the unlisted YouTube URL and paste it into the FlyRank submission portal

---

*This demo script is stored at `Week8_Demo_Video_Script.md` in the repo so it is always version-controlled alongside the deliverable.*
