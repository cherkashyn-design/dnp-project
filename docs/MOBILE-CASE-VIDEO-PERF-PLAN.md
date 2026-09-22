# Mobile case-page Safari crash — diagnosis & fix plan

**Status:** Plan only (no code/asset changes in this doc PR)  
**Reported URLs:** `/cases/comfyui-pro-ai-tool`, `/cases/genie-node-based-ai-editor`  
**Symptom:** iOS Safari black screen — *“A problem repeatedly occurred on …”*  
**Verdict:** Not a routing bug. Pages are **over the iPhone memory budget** (Jetsam / OOM). Same failure class as the Drumkit Lottie crashes already documented in `README.md`, but **case `<video>` has none of those guards**.

---

## Root cause (ranked)

### 1. Oversized autoplaying WebMs (primary)

| Case | Videos in DOM | Total WebM | Worst clip |
| --- | ---: | ---: | --- |
| **ComfyUI** | 4 | ~50 MB | `Slide-3.webm` — **34 MB, 2880×2160 VP9 @ ~40 Mbps** |
| **Genie** | 4 | ~15 MB | `Slide-6.webm` — ~6 MB, 1920×1440 |
| Hermes (same risk) | 4 | ~28 MB | `Summary.webm` — **17 MB** |
| Yummo / Sales Driver | 1 | ~1 MB | Summary only — usually fine |

Decoded GPU buffers dwarf file size. One 2880×2160 frame alone is tens of MB in RGBA/YUV; four looping decoders push iPhone Safari into Jetsam.

### 2. All case videos mount and autoplay at once

[`CaseVideo.jsx`](../src/components/media/CaseVideo.jsx) always renders:

```jsx
autoPlay muted loop playsInline preload="metadata"
```

There is **no** IntersectionObserver pause/unmount. Contrast with [`LottiePlayer.jsx`](../src/components/media/LottiePlayer.jsx) (load near viewport, pause off-screen) and [`LottieQuadBlock.jsx`](../src/components/media/LottieQuadBlock.jsx) (≤500px: only one active Lottie).

`preload="metadata"` is overridden in practice by `autoPlay` — browsers fetch and decode enough to play.

### 3. Secondary pressure (amplifies #1–#2)

- Full **2048-class WebPs** served to phones (no `srcset` / mobile variants).
- Scroll-zoom applies `will-change: transform` on on-screen media ([`useScrollZoomMedia.js`](../src/hooks/useScrollZoomMedia.js)).
- Homepage stays **mounted but hidden** while viewing a case (`App.jsx` park pattern).
- Case nav thumbs always visible (desktop + mobile footer); dual marquee tracks duplicate DOM.
- Opening lightbox while page videos still play = **double decode**.

---

## Why ComfyUI + Genie, not every case

| Case | Mobile risk |
| --- | --- |
| ComfyUI | Highest — 4K-class Slide-3 + 4 concurrent videos |
| Genie | High — 4 concurrent videos, ~15 MB compressed |
| Hermes | High — same pattern; Summary alone 17 MB |
| Drumkit | Previously crashed on Lottie; already mitigated |
| Yummo / Sales Driver | Low — single small summary video |

---

## Fix plan (ordered by impact)

### Phase A — Runtime guards (code, ship first)

Mirror the Lottie memory model for video. Highest crash reduction per engineering effort.

1. **`CaseVideo` visibility gate**
   - Mount/play only when near viewport (`IntersectionObserver`, ~400px rootMargin).
   - Pause (and preferably clear `src` / unload) when far off-screen.
   - Keep poster visible while unloaded.

2. **Mobile concurrent cap (≤500px)**
   - At most **1** playing case video at a time (best intersection ratio), same idea as `LottieQuadBlock`.
   - Desktop can keep multiple playing if memory allows.

3. **Lightbox isolation**
   - Pause all page videos while lightbox is open; resume only the visible one on close.

4. **`prefers-reduced-motion`**
   - Show poster only (no autoplay) when reduced motion is requested.

5. **Optional:** unpark / remount home less aggressively on case routes if residual DOM still shows up in Instruments.

**Files:** `CaseVideo.jsx`, possibly a small `useVisibleMedia` / `useActiveCaseVideo` hook, `MediaLightbox.jsx`, light CSS for poster-only state.

**Success:** ComfyUI and Genie open on a mid-range iPhone without the black Safari crash screen (even before re-encodes).

---

### Phase B — Re-encode assets (largest memory win)

Runtime gating stops *concurrent* decode; bad source codecs still hurt when that one video is on screen.

1. **Add `scripts/optimize-portfolio-videos.py` (or shell + ffmpeg)**
   - Targets (proposed):
     - **Mobile:** max 1280×720 (or 1080 on long edge), H.264 + AAC in `.mp4`, ~2–4 Mbps, CRF-style quality.
     - **Desktop:** max 1920×1080 VP9/WebM or H.264, ~4–8 Mbps.
   - Never ship 2880×2160 / 40 Mbps to clients.

2. **Priority encode queue**
   1. `portfolio/ComfyUI/Slide-3.webm` (critical)
   2. ComfyUI `Slide-1/p1`, `Slide-6/p1`, `Summary`
   3. Hermes `Summary.webm`
   4. All Genie `.webm`s
   5. Remaining Hermes section videos

3. **Wire dual sources in data modules**
   - `<video><source media="(max-width: 500px)" …/><source …/></video>`  
     or pass `srcMobile` / `srcDesktop` into `CaseVideo`.
   - Keep existing WebP posters (already small).

4. **Budget check after encode**
   - Per-case mobile video total **&lt; ~8 MB** compressed.
   - No single clip &gt; 1080p for mobile.

**Success:** Slide-3 (and peers) decode within iPhone budgets even when playing.

---

### Phase C — Image & route hygiene (polish)

1. Mobile-width variants or `srcset`/`sizes` for 2048 WebPs (extend `optimize-portfolio-images.py`).
2. Split [`casesIndex.js`](../src/data/casesIndex.js) so opening one generic case does not statically pull every case module’s asset graph.
3. Case nav: single track on mobile; avoid dual-DOM thumb decode.
4. Tighten ProgressiveImage `rootMargin` on case pages (today ~800px).

---

### Phase D — Verify on device

1. iPhone Safari (physical): ComfyUI, Genie, Hermes cold open + scroll full page.
2. Safari Web Inspector → Memory / Media: confirm ≤1 decoder active on phone while scrolling.
3. Regression: Yummo / Sales Driver / Drumkit still behave; desktop autoplay quality unchanged.
4. Lighthouse mobile is optional; **real iOS Safari** is the gate (Jetsam does not show in desktop Chrome).

---

## Suggested implementation order

```
Week-shaped work is wrong for agents — use this sequence instead:

1. Phase A in one PR (CaseVideo visibility + mobile single-active)
2. Phase B for ComfyUI Slide-3 + ComfyUI remaining + Genie (asset PR)
3. Phase B Hermes + Phase C as follow-ups
4. Phase D on each PR before merge
```

Do **not** rely on Phase C alone; without A+B the crash will return.

---

## Out of scope / non-causes

- Not a Telegram / deep-link bug (referrer only).
- Not missing HTTPS or a bad URL path — the page starts, then the process is killed.
- mckp / Lottie are **not** on ComfyUI or Genie; those paths already have separate mitigations.

---

## Reference: existing pattern to copy

| Concern | Lottie (done) | Case video (todo) |
| --- | --- | --- |
| Memory on phones | One active ≤500px | One playing ≤500px |
| Load cost | Load within 400px | Attach `src` within ~400px |
| Off-screen | Pause when far | Pause + unload when far |
| Layout | Poster / aspect lock | Keep WebP poster |

See also `README.md` → “Animations (Lottie)” for the prior Safari OOM write-up.
