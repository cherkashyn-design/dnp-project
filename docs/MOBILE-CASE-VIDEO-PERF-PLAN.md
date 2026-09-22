# Mobile case-page Safari crash — diagnosis & fix plan

**Status:** Phase A + Phase B implemented  
**Reported URLs:** `/cases/comfyui-pro-ai-tool`, `/cases/genie-node-based-ai-editor`  
**Symptom:** iOS Safari black screen — *“A problem repeatedly occurred on …”*  
**Verdict:** Jetsam / OOM from oversized autoplaying WebMs without visibility guards.

---

## What shipped

### Phase A — Runtime guards (`CaseVideo` + coordinator)

| Guard | Behavior |
| --- | --- |
| Near-viewport load | Attach `src` only within ~400px of viewport (`preload="none"`) |
| Unload when far / inactive | Clear `src` + `load()`; show WebP poster |
| Mobile single-active (≤500px) | At most **one** case video decodes (`caseVideoCoordinator.js`) |
| Lightbox isolation | Page videos unload while lightbox is open |
| `prefers-reduced-motion` | Poster only, no autoplay |

Key files: [`CaseVideo.jsx`](../src/components/media/CaseVideo.jsx), [`caseVideoCoordinator.js`](../src/lib/caseVideoCoordinator.js).

### Phase B — Re-encoded assets

`npm run optimize:videos` → [`scripts/optimize-portfolio-videos.py`](../scripts/optimize-portfolio-videos.py)

- Desktop sources capped at **1280px** wide (VP9 CRF 34)
- Sibling `*.mobile.webm` at **720px** (CRF 36), wired via `srcMobile` / `videoMobile`

| Clip | Before → after (desktop) |
| --- | --- |
| ComfyUI `Slide-3.webm` | **35.3 MB / 2880×2160 → 1.2 MB / ≤1280** |
| ComfyUI total videos | ~52 MB → ~2.9 MB (+ ~1.1 MB mobile variants) |
| Genie videos | ~15 MB → ~3.7 MB |
| Hermes `Summary.webm` | 17.3 MB → 1.6 MB |
| Drumkit `Summary.webm` | 17.9 MB → 1.2 MB |

---

## Remaining (Phase C — optional polish)

1. Mobile `srcset` / width variants for 2048 WebPs
2. Split [`casesIndex.js`](../src/data/casesIndex.js) so one case does not pull every case module
3. Case nav: single track on mobile
4. Tighten ProgressiveImage `rootMargin` on case pages

## Verify on device

1. iPhone Safari: cold open ComfyUI + Genie + Hermes; scroll full page
2. Confirm ≤1 decoder active while scrolling (Web Inspector → Media)
3. Regression: Yummo / Sales Driver / Drumkit; desktop quality acceptable

---

## Reference: pattern copied from Lottie

| Concern | Lottie (existing) | Case video (now) |
| --- | --- | --- |
| Memory on phones | One active ≤500px | One playing ≤500px |
| Load cost | Load within 400px | Attach `src` within ~400px |
| Off-screen | Pause when far | Pause + unload when far |
| Layout | Poster / aspect lock | Keep WebP poster |
