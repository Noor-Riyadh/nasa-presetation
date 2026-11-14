# EmberNova — "From Disaster to Discovery"
Cinematic, keyboard-driven web presentation for NASA Space Apps 2026 (React + TypeScript + Vite, GSAP-free CSS motion, Three.js for the ember→nova reveal, WebAudio sound design).

## Run
```bash
npm install
npm run dev          # development
npm run present      # production build + local server at http://127.0.0.1:4173 (recommended on stage)
npm run build        # static build in dist/ (serve with any static server; do not open via file://)
```
Everything (fonts, photos, video, demo captures, sound) is local. Only the optional "Open real EmberNova" buttons need internet.

## Presenting
Open the stage in Chrome/Edge, press **F** for fullscreen. Press **N** to open the **Presenter window** (Arabic script, cues, timer, speaker split) on the laptop screen and drag the stage window to the projector. The two windows stay in sync (BroadcastChannel) and either can advance. Notes are never rendered on the stage. Printable script: `#script`.

| Key | Action | Key | Action |
|---|---|---|---|
| → Space Enter | next step | ← Backspace | previous |
| 1–9 | jump to scene | Home / End | first / last |
| F / Esc | fullscreen | D | show/hide on-stage control dock |
| P | pause motion | R | replay scene |
| M | sound on/off (off by default) | N | presenter window |
| T | reset timer | O / C | (demo) open real app / copy question |

Click-to-advance is on (toggle in the dock). Position lives in the URL hash (`#5.3`), so a refresh or returning from the real app resumes in place.

## Demo scene
The real app forbids iframe embedding (`frame-ancestors 'self'`), so: **O** opens the live app in a new tab (return with Alt+Tab), and the 9 feature steps show **real captures** of the production app (recorded session 2026-11-13 + live pages), labelled as such. The recorded session's question was a related lunar-habitat question, not the exact demo prompt. If the live run differs, show the live result.

## Asset credits
NASA images: NASA Image and Video Library (public domain / NASA media guidelines): S67-21294 (Apollo 204 CM), AS13-59-8562 (Apollo 13 SM), art002e004450 (Earth), art002e009567 (Orion + Moon), iss028e007274 (Earth limb). Flame video: NASA/PSI-10 ACME raw video via EmberNova's media API (credit NASA/PSI). Titanic: F.G.O. Stuart, 1912, Wikimedia Commons, public domain. Iceberg and orange glow are original illustrations, labelled on screen.
