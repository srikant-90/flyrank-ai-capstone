
# FlyRank AI Capstone

This repository contains my onboarding assignment for the FlyRank AI Internship.

## Objective

Learn AI-assisted development using Claude Code, Git, and GitHub.

## Tech Stack

- Node.js
- Git
- GitHub

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- [Git](https://git-scm.com/)
- A [GitHub](https://github.com/) account

### Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/srikant-90/flyrank-ai-capstone.git
   cd flyrank-ai-capstone
   ```

2. Install dependencies once a `package.json` is added:

   ```bash
   npm install
   ```

Additional run and development instructions will be documented here as the project grows.

---

## Week 7 — Interactive 3D Browser Experience

### 🔗 Live URL
[https://srikant-90.github.io/flyrank-ai-capstone/Week7_3D_Hero_Scene.html](https://srikant-90.github.io/flyrank-ai-capstone/Week7_3D_Hero_Scene.html)

### 🧠 What I Built

**FlyRank AI Neural Node Explorer** — a fully interactive 3D hero scene rendered in the browser using raw **Three.js** (loaded via `esm.sh` CDN — no bundler needed). The scene features:

- A **procedurally generated AI "neural node"** — an icosahedron core with three tilted torus orbit rings, 9 orbiting node spheres, and dynamic connection lines. Zero model files; all geometry is pure Three.js primitives.
- **900-particle ambient field** drifting through the scene with additive blending.
- **2500-star background** slowly rotating.
- **Mouse-reactive point light** that follows the cursor in 3D world space.
- **Scroll-driven camera drift** — scrolling lifts the camera through the scene.
- **Click burst** — clicking the canvas triggers a scale + emission pulse with smooth easing.
- **Real-time configurator panel** (custom UI, no Leva): color picker with 5 presets, metalness, roughness, glow intensity, auto-rotate speed, wireframe toggle, particle toggle, ring toggle, and 5 scene themes.
- **Static SVG fallback** auto-shown for `prefers-reduced-motion: reduce` or no-WebGL environments.
- **FPS + triangle counter** badge (bottom-right).
- Mobile touch support via OrbitControls.

### ⚡ Perf Note (FE-10 Lens)

| Metric | Value | Strategy |
|--------|-------|----------|
| JS payload | ~180 KB gzipped (Three.js + OrbitControls) | ESM CDN imports; no React, no postprocessing |
| Model size | **0 KB** | 100% procedural geometry — no `.glb` download |
| Geometry | ~3.2k triangles total | Low-poly icosahedron (detail=1), thin tori |
| Frame rate | 60 fps on desktop, 30–60 on mobile | `setPixelRatio` capped at 2; single-pass render |
| Shadow map | 1024×1024 PCF soft | Only key light casts shadows |
| Canvas lazy | ✅ | Canvas appended after capability checks pass |
| Fallback | ✅ | SVG + CSS, shown before any JS Three.js load |

### 🚀 What I'd Add With More Time

- **DRACO-compressed `.glb` model** — a real stylised chip or brain mesh swapped in at runtime
- **Post-processing** — bloom pass on the emissive elements via `EffectComposer`
- **Physics** — node spheres with spring simulation (Rapier or custom Verlet)
- **Audio reactivity** — microphone FFT data driving emissive intensity in real time
- **Leva dat.GUI replacement** with `folder` grouping for cleaner UX
- **GSAP ScrollTrigger** for cinematic camera path keyed to scroll position
