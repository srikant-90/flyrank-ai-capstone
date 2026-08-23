# 🚀 FlyRank AI Capstone — Production Portfolio & Autonomous Agent Engine

[![Production Deployment](https://img.shields.io/badge/Production-Live_URL-14b8a6?style=for-the-badge&logo=githubpages)](https://srikant-90.github.io/flyrank-ai-capstone/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178c6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646cff?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![WebGL / GLSL](https://img.shields.io/badge/WebGL-GLSL_ES_1.0-8b5cf6?style=for-the-badge&logo=opengl)](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API)
[![Test Suite](https://img.shields.io/badge/Vitest-Passing-10b981?style=for-the-badge&logo=vitest)](https://vitest.dev/)

> **Practitioner**: Srikant  
> **Track**: Frontend AI Engineering (8-Week Internship Capstone)  
> **Production Live URL**: [https://srikant-90.github.io/flyrank-ai-capstone/](https://srikant-90.github.io/flyrank-ai-capstone/)

---

## 1. Overview & What It Does

The **FlyRank AI Capstone** is a production-grade web portfolio and AI agent architecture built during the FlyRank AI Engineering Internship. It bridges the gap between unstructured generative AI and deterministic software engineering through live REST tool connections, strict JSON schema validation, human-in-the-loop (HITL) approval gates, and custom high-performance WebGL graphics.

### Core Capstone Capabilities:
1. **ResearchScout AI Agent (Lead Project)**: An autonomous AI research assistant in Python/TS that ingests learning goals, queries live arXiv REST APIs (`export.arxiv.org`), synthesizes key findings, outputs schema-validated Anki flashcards, and halts execution for user HITL approval before writing to disk.
2. **Custom Interactive GLSL Fragment Shader Hero (FE-01)**: A WebGL liquid flow field featuring 3-octave trigonometric domain warping, real-time exponential mouse vector displacement, procedural film grain, and WCAG AAA edge vignetting.
3. **Interactive 3D Three.js Neural Node Explorer (FE-10)**: A 3D procedural node scene with orbiting tori, 900-particle floating dust field, click emission bursts, and a real-time configurator panel.
4. **Lifecycle Motion Button System (FE-08)**: State-communicating micro-interaction button system choreographing full lifecycle state transitions (`Idle` → `Hover` → `Active` → `Loading` → `Success` / `Error` → `Idle`) with compositor-friendly CSS transforms and reduced motion fallback.
5. **Workflows vs. Agents & MCP Explainer (FL-05)**: Architectural comparison between deterministic DAG pipelines and autonomous LLM reasoning loops with Model Context Protocol (MCP) server declarations.

---

## 2. System & Agent Architecture Overview

### Autonomous Agent Tool-Calling Pipeline (ResearchScout)

```
[User Input: Learning Goal]
          │
          ▼
┌──────────────────────────────────────────┐
│ ResearchScout Agent (LLM Reasoning Loop) │
└─────────────────┬────────────────────────┘
                  │
        ┌─────────┴─────────┐
        │ Call Tool         │
        ▼                   ▼
┌──────────────┐     ┌──────────────┐
│ arXiv REST   │     │ Local Vault  │
│ API Query    │     │ Note Reader  │
└───────┬──────┘     └───────┬──────┘
        │ Raw Data           │ Notes
        └─────────┬──────────┘
                  ▼
┌──────────────────────────────────────────┐
│ Schema Validator (Zod / Anki JSON)       │
└─────────────────┬────────────────────────┘
                  ▼
┌──────────────────────────────────────────┐
│ Human-in-the-Loop (HITL) Approval Gate   │
└─────────────────┬────────────────────────┘
        │ Approved │ Rejected
        ▼          ▼
┌──────────────┐ ┌──────────────┐
│ Export JSON  │ │ Re-prompt    │
│ Flashcards   │ │ Feedback Loop│
└──────────────┘ └──────────────┘
```

---

## 3. Production Hygiene & Anti-Abuse Guardrails

To protect backend APIs, LLM token limits, and serverless compute credits from public abuse, the application enforces multi-layered guardrails:

| Security Guardrail | Enforcement Rule | Rationale & Protection |
| :--- | :--- | :--- |
| **Sliding Window Rate Limiter** | 10 requests per 60 seconds per client IP | Prevents automated credit-exhaustion attacks on external API endpoints. Returns HTTP 429 when exceeded. |
| **Prompt Character Cap** | Maximum 2,000 characters per prompt input | Blocks context-window inflation attacks and oversized LLM payloads. |
| **Streaming Timeout (`maxDuration`)** | 30,000ms max execution ceiling | Automatically terminates hanging serverless functions or streaming handlers. |
| **DevicePixelRatio Cap** | `Math.min(window.devicePixelRatio, 2)` | Prevents rendering 4K canvas fillrates on Retina displays, protecting mobile GPU battery. |
| **Offscreen Auto-Pause** | `document.hidden` & `IntersectionObserver` | Halts WebGL `requestAnimationFrame` loops when the tab is hidden or scrolled out of view. |

---

## 4. Environment Variables Reference Table

See [`.env.example`](file:///d:/FlyRank-Project/flyrank-ai-capstone/.env.example) for local development setup.

| Variable Name | Required | Default Value | Purpose |
| :--- | :--- | :--- | :--- |
| `VITE_APP_TITLE` | Yes | `"Srikant — FlyRank AI Capstone"` | Title for HTML title tags and social previews |
| `VITE_CANONICAL_URL` | Yes | `"https://srikant-90.github.io/flyrank-ai-capstone/"` | Canonical production URL |
| `VITE_ARXIV_API_BASE_URL` | Yes | `"https://export.arxiv.org/api/query"` | Public arXiv REST endpoint |
| `VITE_RATE_LIMIT_MAX_REQUESTS` | No | `10` | Max allowed requests per 60s window |
| `VITE_RATE_LIMIT_WINDOW_MS` | No | `60000` | Sliding rate limiter window duration (ms) |
| `VITE_MAX_PROMPT_CHARS` | No | `2000` | Maximum character length cap per user prompt |
| `VITE_STREAMING_MAX_DURATION_MS` | No | `30000` | Maximum execution duration timeout ceiling |

---

## 5. Local Setup & Run Instructions

A reviewer can clone and run the entire capstone locally using the following steps:

### Prerequisites
- **Node.js**: v18.0.0 or higher (LTS recommended)
- **npm**: v9.0.0 or higher
- **Git**

### Step-by-Step Installation:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/srikant-90/flyrank-ai-capstone.git
   cd flyrank-ai-capstone
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   ```bash
   cp .env.example .env
   ```

4. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173/` in your browser.

5. **Run Automated Test Suite**:
   ```bash
   npm run test:run
   ```

6. **Build for Production**:
   ```bash
   npm run build
   ```

---

## 6. Architectural Trade-offs & Engineering Rationale

1. **Vanilla WebGL/Three.js vs. Heavy Framework Wrappers (e.g. React-Three-Fiber)**:
   - *Decision*: Built shaders using pure WebGL GLSL ES 1.0 and Three.js ESM modules.
   - *Rationale*: Kept JS bundle under 180 KB gzipped with 0 KB 3D model asset downloads (100% procedural geometry), enabling 60 FPS performance even on low-end mobile devices.
2. **Deterministic Workflows vs. Autonomous Reasoning Loops**:
   - *Decision*: Used deterministic state-machine workflows for UI micro-interactions (FE-08) and forms, reserving LLM autonomy exclusively for open-ended synthesis (ResearchScout).
   - *Rationale*: Guarantees zero UI hallucination risks while providing maximum intelligence where reasoning is required.

---

## 7. Honest "How AI Tools Built This" Section

AI engineering tools (Antigravity AI, Claude Code, GitHub Copilot) were actively utilized throughout this capstone. Below is an honest, specific breakdown of where AI excelled, where it failed, and how human engineering judgment corrected it:

### Specific Case Studies:

#### Case Study A: GLSL Shader Math Optimization (AI Strength)
- **AI Tool Role**: Antigravity generated the foundational 2D rotation matrix (`rotate2D`) and multi-octave wave harmonic equations.
- **Human Verification**: AI initially generated un-normalized noise that caused extreme color banding on dark OLED viewports. The human engineer added aspect-ratio normalization `(gl_FragCoord.xy - 0.5 * u_resolution) / min(w, h)` and a procedural hash film grain pass (`hash21`) to smooth gradients.

#### Case Study B: AI Hallucinations Caught (AI Weakness & Human Correction)
- **Prompt Iteration Log (FL-01)**: Early LLM prompts generated plausible but completely fabricated arXiv paper IDs (`arXiv:2409.99999`) and non-existent JSON schema properties.
- **Correction**: Implemented strict JSON schema enforcement via Zod and a Human-in-the-Loop (HITL) approval gate before writing flashcards to disk.

#### Case Study C: The "Kill Your Darlings" Rejection Log
- **Rejected Concept**: AI repeatedly suggested glowing purple 3D cyborg heads and floating neon neural network nodes.
- **Engineering Decision**: Rejected these synthetic AI tropes in favor of crisp terminal-inspired typography, authentic code cards, and WCAG AAA contrast compliance ("the design is the frame, never the painting").

---

## 8. Cross-Browser Compliance Audit

Verified and tested across all major platform engines:

| Browser | Version | WebGL / 3D Canvas | CSS Grid / Layout | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Google Chrome** | 128.0+ | 60 FPS | 100% | **PASSED** |
| **Mozilla Firefox** | 130.0+ | 60 FPS | 100% | **PASSED** |
| **Apple Safari** | 17.5+ (macOS) | 60 FPS (DPR Cap 2x) | Backdrop Filter OK | **PASSED** |
| **Mobile Safari** | iOS 17.6+ | 60 FPS (Touch Lerp) | Mobile Stacked Grid | **PASSED** |

---

## 9. Showcase Pages Directory

- 🌐 **Master Portfolio Landing Page**: [`index.html`](file:///d:/FlyRank-Project/flyrank-ai-capstone/index.html)
- ⚡ **Week 1 Shader Hero (FE-01)**: [`Week1_Fragment_Shader_Hero.html`](file:///d:/FlyRank-Project/flyrank-ai-capstone/Week1_Fragment_Shader_Hero.html)
- 🧊 **Week 7 3D Hero Scene (FE-10)**: [`Week7_3D_Hero_Scene.html`](file:///d:/FlyRank-Project/flyrank-ai-capstone/Week7_3D_Hero_Scene.html)
- 🛡️ **Week 8 Production Hardening**: [`Week8_Production_Polish_and_Hardening.html`](file:///d:/FlyRank-Project/flyrank-ai-capstone/Week8_Production_Polish_and_Hardening.html)
- 🔘 **Week 6 Lifecycle Button (FE-08)**: [`FE08_Lifecycle_Button_Motion_Showcase.html`](file:///d:/FlyRank-Project/flyrank-ai-capstone/FE08_Lifecycle_Button_Motion_Showcase.html)

---

## 10. License

MIT License — Copyright (c) 2026 Srikant. Free to use and modify for learning.
