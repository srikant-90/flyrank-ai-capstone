# Week 6 FE-08 Deliverable: Lifecycle Motion Button System (Motion With Intent)

**Track:** General AI Fluency  
**Intern:** Srikant  
**Capstone Project:** FlyRank AI Practitioner Portfolio  
**Course Module:** FE-08 — Motion With Intent (Micro-Interactions & State Choreography)  
**Deliverable File / URL:** [`FE08_Lifecycle_Button_Motion_Showcase.html`](file:///d:/FlyRank-Project/flyrank-ai-capstone/FE08_Lifecycle_Button_Motion_Showcase.html) / [`index.html`](file:///d:/FlyRank-Project/flyrank-ai-capstone/index.html)  
**GitHub Repository:** `https://github.com/srikant-90/flyrank-ai-capstone`  

---

## 1. Overview & Subject Choice

This deliverable builds a state-communicating **"Deploy AI Agent / Execute Pipeline"** button system that choreographs the complete lifecycle across 7 distinct states:

```
[ Idle ] ──► [ Hover / Focus ] ──► [ Active (Pressed) ] ──► [ Loading (In-Flight) ]
                                                                     │
                                 ┌───────────────────────────────────┴───────────────────────────────────┐
                                 ▼                                                                       ▼
                   [ Success (Overshoot + Check Draw) ]                                    [ Error (Actionable Shake) ]
                                 │                                                                       │
                                 └─────────────────────► [ Back to Idle ] ◄──────────────────────────────┘
```

The component is built to be reusable across our **ResearchScout AI Agent** capstone workflow. A secondary button (**"Export JSON Schema"**) is included to demonstrate system-wide reusability.

---

## 2. Duration & Easing Rationale (The Thinking)

Every state change uses deliberate timing curves designed around human perception rather than decorative fluff:

| Lifecycle State | Duration | Easing Function | Design & Perception Rationale |
|:---|:---|:---|:---|
| **Hover Lift & Focus Glow** | `150ms` | `cubic-bezier(0.16, 1, 0.3, 1)` (Snappy) | Instant response to cursor entry without feeling jittery. Micro-lift of `-2px`. |
| **Active (Pressed)** | `100ms` | `ease-out` | Tactile compression (`scale(0.97)`) confirming physical click intent immediately. |
| **Loading (In-Flight)** | `300ms` | `cubic-bezier(0.4, 0, 0.2, 1)` (Standard) | Smooth vertical slot transition sliding out the label (`-14px`) and introducing the spinner (`0px`) with zero layout thrash. |
| **Success Resolution** | `400ms` | `cubic-bezier(0.34, 1.56, 0.64, 1)` (Overshoot) | Celebratory spring pulse (`1.04x`) paired with an SVG stroke-dash draw animation, signaling successful API execution. |
| **Error (Actionable Shake)** | `380ms` | `ease-in-out` (4 micro-cycles `[-6px, 6px, -4px, 4px, 0]`) | Physical cue indicating an obstruction, quickly settling on an actionable "Retry Pipeline" prompt. |
| **Return to Idle** | `250ms` | `ease-out` (after 2.4s buffer) | Gives the user sufficient time to register the completed state before returning to idle. |
| **Reduced Motion Override** | `0.01ms` | Linear / Instant | Removes all physical displacement and shake transforms while preserving clear color and text feedback. |

---

## 3. Engineering Highlights (Zero Layout Thrash & Interruptibility)

1. **Compositor-Friendly Only:** All animations use `transform` (`translateY`, `scale`, `translateX`) and `opacity`. Width and height remain constrained to prevent browser reflow / layout thrashing.
2. **Interruptibility:** Spam-clicking or switching tabs mid-transition does not desynchronize the state machine; pending timers are cleared via `clearTimeout()`.
3. **Dedicated Reviewer Triggers:** Includes dedicated control buttons on the demo page:
   - **Live Simulation:** Random 20% failure chance with 1.6s network latency.
   - **Force Success Trigger:** Tests positive resolution and checkmark draw on demand.
   - **Force Error Trigger:** Tests error shake and retry state on demand.
   - **Toggle Disabled:** Tests 45% opacity and pointer-events suppression.
   - **Toggle Reduced Motion:** Simulates `prefers-reduced-motion: reduce` dynamically in the browser.

---

## 4. Evaluation Criteria Self-Audit (Pass / Revise)

| Criteria | Requirement | Status | Verification Detail |
|:---|:---|:---|:---|
| **At least 5 distinct states** | Idle, Hover/Focus, Loading, Success, Error, plus Disabled. | **PASS** | 7 fully choreographed states. |
| **Intentional Transitions** | Pick durations and easings on purpose with documented rationale. | **PASS** | Snappy `150ms` hover, `300ms` standard morph, `400ms` overshoot spring. |
| **No Layout Thrash** | Animate compositor-friendly properties only (`transform`, `opacity`). | **PASS** | Fixed dimensions with absolute slot morphing. |
| **Interruptibility** | Spam-clicking does not break transitions. | **PASS** | State machine clears pending execution timers. |
| **Force Triggers Included** | Reviewers can trigger success and error on demand. | **PASS** | Dedicated buttons for Force Success, Force Error, Disabled, and Reduced Motion. |
| **Accessibility & Reduced Motion** | Keyboard focus ring + `prefers-reduced-motion` compliance. | **PASS** | High-contrast `:focus-visible` offset ring + `@media (prefers-reduced-motion)` override. |

---

### Submission Links:
* **Deliverable Link:** `https://srikant.flyrank.ai/FE08_Lifecycle_Button_Motion_Showcase.html` (or `index.html`)
* **Repository Link:** `https://github.com/srikant-90/flyrank-ai-capstone`
