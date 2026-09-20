# Adding a portfolio case

Playbook for humans and AI agents. Prefer **data-driven** cases (Yummo / Sales Driver / Genie). Only build a custom page when the layout needs one-off UI (today: Drumkit).

## Checklist

1. [ ] Assets under `portfolio/CaseName/` (slides + `Previews/` + hero `Preview`)
2. [ ] `npm run optimize:images` → WebP (Preview max 2048px)
3. [ ] `npm run generate:lq` → `*.lq.jpg` placeholders
4. [ ] `src/data/caseName.js` with imports, copy, sections, summary
5. [ ] Register in `src/data/casesIndex.js` (`genericCasePages`)
6. [ ] Homepage card in `src/data/site.js`
7. [ ] `npm run build` passes
8. [ ] Spot-check `/cases/your-slug` and homepage card locally

---

## 1. Assets layout

```text
portfolio/CaseName/
  Preview.jpg|png          → becomes Preview.webp (hero + homepage)
  Preview.lq.jpg           → generated
  Slide-1.webp …           → full-bleed or grid images
  Slide-N/p1.webp, p2.webp → side-by-side row
  Previews/
    Preview-Preview.webp
    Slide-1-Preview.webp …
    Slide-N-Preview.webp   → case-nav thumbs (small)
```

### Naming conventions

| Role | Name |
| --- | --- |
| Hero / homepage card | `Preview.webp` |
| Nav thumb for hero | `Previews/Preview-Preview.webp` |
| Nav thumb for slide N | `Previews/Slide-N-Preview.webp` |
| Paired images | `Slide-N/p1.webp`, `Slide-N/p2.webp` |
| Tab screens (Genie-style) | `Slide-N/Tab-Name.webp` (stable filenames, no spaces → use hyphens) |
| Summary 3D / device scene | `Summary.webm` (+ optional poster = `Preview.webp`) |

Prefer **designer-exported** nav thumbs in `Previews/`. If missing, generate small JPEGs (~320px) from slides, then run optimize + LQ.

### Optimize pipeline

```bash
# From repo root, after copying JPG/PNG into portfolio/CaseName/
npm run optimize:images   # → WebP, deletes originals after success
npm run generate:lq       # → *.lq.jpg next to each raster
```

Scripts: `scripts/optimize-portfolio-images.py`, `scripts/generate-lq-images.py`.

---

## 2. Data module

Create `src/data/caseName.js`. Closest templates:

| Template | Use when |
| --- | --- |
| [`genie.js`](../src/data/genie.js) | Sections + optional **tabs** + summary video |
| [`yummo.js`](../src/data/yummo.js) | Standard media rows + looping summary video |
| [`salesDriver.js`](../src/data/salesDriver.js) | Same as Yummo with summary video |
| [`drumkit.js`](../src/data/drumkit.js) + [`DrumkitCasePage.jsx`](../src/pages/cases/DrumkitCasePage.jsx) | Lottie quads, marquee, custom sections |

### Shape (generic)

```js
export const caseNameCase = {
  title: "…",
  subtitle: "…",
  heroAlt: "…",
  heroImage: previewWebp,
  tags: ["SaaS", "App"],
  productionLink: { href, label, favicon }, // optional
  navigationItems: [
    { src: navPreview, href: "#case-hero", label: "Hero" },
    // … one thumb per major media target
  ],
  overview: [
    ["[ GOAL ]", "…"],
    ["[ SOLUTION ]", "1. …\n2. …"], // newlines OK (pre-line)
  ],
  sections: [
    {
      id: "case-section-id",
      title: "Section",
      description: "…",
      kicker: "Optional H3 under the title", // Genie Nodes
      mediaRows: [
        [
          { id: "case-media-a", src: imgA, caption: "…" },
          { id: "case-media-b", src: imgB, caption: "…" },
        ],
        [{ id: "case-media-wide", src: imgWide, caption: "…" }],
      ],
    },
    {
      id: "case-profile",
      title: "Profile",
      description: "…",
      // Instead of mediaRows — renders ProfileTabsBlock
      tabs: [
        { id: "case-tab-1", label: "Public Profile", src: tabImg, caption: "…" },
      ],
    },
  ],
  summary: {
    title: "Summary",
    description: "…",
    stats: [["80%", "Label"], ["40K", "Label"]],
    imageId: "case-summary-id",
    navPreview: summaryNavThumb, // optional; else poster / hero
    video: summaryWebm, // portfolio/CaseName/Summary.webm
    poster: heroPreview, // optional poster while loading
    // Or legacy mckp: mockup: { mockupId, aspectRatio, … }
    // Or static: image: someWebp, caption: "…"
  },
};
```

### DOM ids & nav hrefs

- Hero: `#case-hero`
- Overview: `#case-overview`
- Summary block: `#case-summary`; mockup/image: `#${summary.imageId}`
- Single media: `#${media.id}`
- Multi-image row: `#${section.id}-row-${n}` (1-based) via `getMediaRowId`
- Tabs section: `#${section.id}` (and each tab panel `#${tab.id}`)

If `navigationItems` is omitted, `createCaseNavigationItems(project)` builds thumbs from hero + sections (+ summary).

### Copy source

When a Figma file / brief is provided, **take headings, captions, stats, and overview text from the design**. Do not invent marketing copy.

---

## 3. Register the route

[`src/data/casesIndex.js`](../src/data/casesIndex.js):

```js
import { caseNameCase } from "./caseName.js";

export const genericCasePages = {
  "/cases/your-kebab-slug": caseNameCase,
  // …
};
```

Path must match `site.js` `href`.  
[`CaseRoutes`](../src/pages/cases/index.jsx) serves any `genericCasePages` entry via [`PortfolioCasePage`](../src/pages/cases/PortfolioCasePage.jsx). No new page file needed.

Drumkit is hard-coded in `CaseRoutes` — leave that pattern only for heavily custom cases.

---

## 4. Homepage card

[`src/data/site.js`](../src/data/site.js) `cases` array:

```js
{
  name: "Case title",
  image: casePreview,       // Preview.webp
  lqImage: casePreviewLq,   // Preview.lq.jpg
  tags: ["SaaS", "App"],
  href: "/cases/your-kebab-slug",
}
```

Order in this array = homepage order. Same list feeds “Other projects” (current case filtered out).

---

## 5. Special UI reference

### Profile tabs

Set `section.tabs` (no `mediaRows`). Rendered by [`ProfileTabsBlock`](../src/components/case/ProfileTabsBlock.jsx). Styles: `.profile-tabs-*` in `global.css`.

### mckp embeds

Script already in [`index.html`](../index.html). Map embed snippet → `summary.mockup` props:

| Embed attribute | Data prop |
| --- | --- |
| `mockup-id` | `mockupId` |
| `aspect-ratio` | `aspectRatio` |
| `trigger` | `trigger` (`"load"`, …) |
| `trigger-loop` | `triggerLoop` (`true` / `false`) |
| `cursor-range` | `cursorRange` |
| `click-range` | `clickRange` |
| `camera-zoom` | `cameraZoom` |
| `background-color` | `backgroundColor` |
| `zoom-mode` / `zoom-amount` / … | matching camelCase on `MockupPlayer` |

**Play once:** `trigger: "load"`, `triggerLoop: false`.  
**Loop:** `triggerLoop: true`.

Free mckp plans show a “Made with mckp.live” badge inside a closed shadow root — only removable via mckp Pro (not CSS).

### Lottie in a media row (generic cases)

```js
{
  id: "case-media-lottie",
  type: "lottie",
  loadAnimation: () => import("../../portfolio/CaseName/Slide-N/p2.json"),
  src: posterWebp, // still used for case-nav thumbs
  aspectRatio: "1920 / 1440", // match JSON w/h
  caption: "…",
}
```

[`MediaBlock`](../src/components/media/MediaBlock.jsx) + [`LottiePlayer`](../src/components/media/LottiePlayer.jsx). Always dynamic-`import()` the JSON. See Genie Community `Slide-5/p2.json`.

### Lottie (custom Drumkit page)

---

## 6. Verify

```bash
npm run build
npm run dev   # http://localhost:5173/cases/your-kebab-slug
```

Check: hero, overview columns, media grids, tabs (if any), summary stats + mockup/image, case-nav thumbs, homepage card + “Other projects”.

---

## File map (quick)

| Action | File |
| --- | --- |
| Media | `portfolio/CaseName/**` |
| Case content | `src/data/caseName.js` |
| Route map | `src/data/casesIndex.js` |
| Homepage | `src/data/site.js` |
| Shared page | `src/pages/cases/PortfolioCasePage.jsx` (reuse) |
| Tabs UI | `src/components/case/ProfileTabsBlock.jsx` |
| Section rows | `src/components/case/PortfolioCaseSection.jsx` |
| Mockup wrapper | `src/components/media/MockupPlayer.jsx` |
| Styles | `src/styles/global.css` |
