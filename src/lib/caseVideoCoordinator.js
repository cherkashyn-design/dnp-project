/**
 * Coordinates case-page <video> instances so mobile Safari stays within
 * memory budget: at most one active decoder on narrow viewports, and all
 * page videos pause/unload while a lightbox is open.
 */

const MOBILE_MEDIA = "(max-width: 500px)";
const REDUCED_MOTION_MEDIA = "(prefers-reduced-motion: reduce)";

/** @type {Map<symbol, { ratio: number, onChange: () => void }>} */
const entries = new Map();

let mobile = false;
let reducedMotion = false;
let lightboxDepth = 0;
let activeId = null;
let mediaBound = false;

function ensureMedia() {
  if (mediaBound || typeof window === "undefined") {
    return;
  }
  mediaBound = true;

  const mobileQuery = window.matchMedia(MOBILE_MEDIA);
  const motionQuery = window.matchMedia(REDUCED_MOTION_MEDIA);

  const sync = () => {
    mobile = mobileQuery.matches;
    reducedMotion = motionQuery.matches;
    reconcile();
  };

  sync();
  mobileQuery.addEventListener("change", sync);
  motionQuery.addEventListener("change", sync);
}

function pickActiveId() {
  if (!mobile || entries.size === 0) {
    return null;
  }

  let bestId = null;
  let bestRatio = -1;
  for (const [id, entry] of entries) {
    if (entry.ratio > bestRatio) {
      bestRatio = entry.ratio;
      bestId = id;
    }
  }
  return bestRatio > 0 ? bestId : null;
}

function reconcile() {
  ensureMedia();
  const nextActive = pickActiveId();
  activeId = nextActive;

  for (const [, entry] of entries) {
    entry.onChange();
  }
}

export function getCaseVideoPolicy(id) {
  ensureMedia();
  const lightboxOpen = lightboxDepth > 0;
  const isActive = !mobile || activeId === id;

  return {
    mobile,
    reducedMotion,
    lightboxOpen,
    isActive,
    /** Attach src + allow decode only when this is true. */
    allowLoad: !reducedMotion && !lightboxOpen && isActive,
    /** Autoplay only when loaded and preferred. */
    allowPlay: !reducedMotion && !lightboxOpen && isActive,
  };
}

export function registerCaseVideo(id, onChange) {
  ensureMedia();
  entries.set(id, { ratio: 0, onChange });
  reconcile();
  return () => {
    entries.delete(id);
    reconcile();
  };
}

export function reportCaseVideoRatio(id, ratio) {
  const entry = entries.get(id);
  if (!entry) {
    return;
  }
  if (entry.ratio === ratio) {
    return;
  }
  entry.ratio = ratio;
  reconcile();
}

export function beginCaseVideoLightbox() {
  lightboxDepth += 1;
  reconcile();
}

export function endCaseVideoLightbox() {
  lightboxDepth = Math.max(0, lightboxDepth - 1);
  reconcile();
}
