# DoNotPress portfolio site

Vite + React portfolio for [donotpress.studio](https://www.donotpress.studio).  
Production deploys from `main` via Vercel (`cherkashyn-design/dnp-project`).

## Quick start

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # output → dist/
npm run generate:lq  # regenerate *.lq.jpg placeholders (Python)
```

## Project layout

```text
src/
  pages/           Home + case routes
  components/      home / case / media UI
  hooks/           scroll zoom, reveal, case nav
  data/            case content + asset wiring
  lib/             LQ map, Lottie cache
  assets/          brand + icons
  styles/global.css
portfolio/         case media (images, Lottie JSON) — kept at repo root
```

Case pages are code-split: the homepage stays light; `/cases/*` loads asynchronously.

---

## Page speed

### 1. Route-level code splitting

[`src/App.jsx`](src/App.jsx) lazy-loads case routes so the homepage JS bundle does **not** include multi‑MB Lottie JSON or case-only UI.

```js
const CaseRoutes = lazy(() => import("./pages/cases/index.jsx"));
```

### 2. Dynamic Lottie imports

Lottie JSON is loaded with `import()` per animation (see [`src/data/drumkit.js`](src/data/drumkit.js)), not statically bundled into the main chunk. Results are cached in [`src/lib/lottieCache.js`](src/lib/lottieCache.js) so revisiting a section does not re-fetch/parse.

### 3. Progressive images

[`ProgressiveImage`](src/components/media/ProgressiveImage.jsx):

- Shows a tiny `*.lq.jpg` blur placeholder (map built by [`src/lib/portfolioLq.js`](src/lib/portfolioLq.js) via `import.meta.glob`).
- Defers the full-resolution `src` until near the viewport (`IntersectionObserver`, default `rootMargin: 800px`).
- Uses a solid placeholder + absolute image layers so layout height is reserved (**no text bounce** while loading).
- Toggle with `ENABLE_PROGRESSIVE_LOADING` in that file.

Regenerate LQ files:

```bash
npm run generate:lq
```

### 4. Homepage image strategy

Project cards use full previews, but LQ placeholders and deferred full loads keep first paint fast. Priority cards (`priority`) load eagerly.

### 5. Scroll-zoom cost control

[`useScrollZoomMedia`](src/hooks/useScrollZoomMedia.js) only updates **on-screen** media transforms each frame. Off-screen elements are skipped to avoid jank next to heavy Lottie sections.

---

## Animations (Lottie)

Primary implementation: [`LottiePlayer`](src/components/media/LottiePlayer.jsx), [`LottieQuadBlock`](src/components/media/LottieQuadBlock.jsx).

### Problems we hit

- Mounting **all** heavy Lotties at once crashed Safari on iPhone (memory).
- Wrong reserved aspect ratio (`9 / 16` vs real `664×476`) caused **layout bounce** in feature sections.
- Lotties **playing during scroll** competed with scroll handlers → laggy scroll on Management dashboard / Simplify SOPs / Summary.

### Solutions

| Concern | Approach |
| --- | --- |
| Memory on phones | ≤500px: only **one** quad-card Lottie active at a time (best intersection ratio). >500px: all four mount (hover play when fine pointer available). |
| Layout stability | Pass explicit `aspectRatio` (`664 / 476` features, `336 / 538` phone cards). CSS also locks `.case-media-lottie`. |
| Scroll jank | Pause Lotties while scrolling (imperative `pause()` via refs — **no React setState on scroll**). Resume after ~140ms idle if still in view. |
| Remount cost | Keep JSON in `lottieCache`; load when within `400px` of viewport; unmount player when far / disabled. |
| Play modes | `visible` = autoplay when in view; `hover` = play once on hover (desktop). |

Feature Lotties live under `portfolio/Drumkit-UI/lottie/` and are wired through `loadDrumkitSlide6/7/8` dynamic imports.

---

## Embed content (mckp 3D mockups)

Script: `https://embed.mckp.live/embed.js` (see [`index.html`](index.html)).  
Wrapper: [`MockupPlayer`](src/components/media/MockupPlayer.jsx).

### Behavior

- Skeleton shimmer until the embed reports ready (postMessage / resource quiet period / 10s fallback).
- Attributes map from React props (`trigger`, `trigger-loop`, `cursor-range`, `camera-zoom`, …).
- **Drumkit Website mockup** plays once: `trigger: "load"`, `triggerLoop: false`.
- Yummo / Sales Driver summary mockups still loop (`triggerLoop: true`).

### Retina sharpness experiment

On viewports **≤500px**, the player mounts at **4×** CSS size and scales back with `transform` (`--mockup-render-scale`) so the WebGL/canvas buffer is denser on phones. Desktop stays `1×`.

Known trade-off: higher memory on small phones; if Safari becomes unstable, lower the scale or gate to `2×` in `MockupPlayer`.

### Softness note

mckp canvases size to **CSS pixels**, not device pixels. Format switches in the embed UI do not fix softness; the DPR upscale wrapper is the client-side mitigation.

---

## Analytics

[`@vercel/analytics`](https://vercel.com/docs/analytics) is mounted in [`App.jsx`](src/App.jsx) via `@vercel/analytics/react` (Vite, not Next).

---

## Deploy

- **GitHub**: push to `main` on `cherkashyn-design/dnp-project`.
- **Vercel**: linked project builds with `npm run build`, output `dist/`, SPA rewrite in [`vercel.json`](vercel.json).

```bash
git push origin main
```

Preview/production URLs are issued by Vercel after the GitHub webhook build.
