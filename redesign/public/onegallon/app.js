// Section 3 of the case, the app itself, and slide 1.7, its App Store screenshots.
// The app's screens are the designer's own, exported from the Figma file as pictures (assets/screens): the six flat
// screens at 402 x 874 and four ready 1600 x 1200 presentation shots. Nothing here redraws them.
// Needs icons.js and brand.js (logo, MARK, grain) loaded first.

// A flat screen in a plain phone body. k is the scale (1 = the screen at 402 x 874).
const phone = (screen, k = 1, extra = "") => `<div class="phone" style="width:${422 * k}px;height:${894 * k}px;${extra}"><div style="transform:scale(${k})"><img src="assets/screens/${screen}.webp" alt="" /></div></div>`;

// One App Store screenshot: a caption over the screen, on a brand gradient. Drawn at 430 x 932, shown at width w.
const SHOTS = [
  ["Snap your drink", "scan", "a"], ["Logged in a second", "added", "b"], ["Hit one gallon", "home", "c"],
  ["Any glass, any size", "amount", "d"], ["Start in a tap", "onboarding", "e"],
];
const storeShot = ([caption, screen, tone], w) => `<div class="shot-box" style="width:${w}px;height:${(w * 932) / 430}px"><div class="shot ${tone}" style="transform:scale(${w / 430})">
  <i class="grain" style="opacity:.3"></i><p>${caption}</p>${phone(screen, 0.86)}</div></div>`;

const APP_SLIDES = {
  // 3.1 — the first screen, in hand (the designer's own shot).
  "3.1": () => `<img class="full" src="assets/screens/shot-2.webp" alt="" />`,
  // 3.2, 3.3 — the day's screen, far and near.
  "3.2": () => `<img class="full" src="assets/screens/shot-3.webp" alt="" />`,
  "3.3": () => `<img class="full" src="assets/screens/shot-1.webp" alt="" />`,
  // 3.4 — every screen, flat and at full size, drifting past in the order a drink is logged. The row holds the screens
  // twice and moves by half its length, so the loop has no seam.
  "3.4": () => { const row = ["onboarding", "home", "scan", "analyzing", "amount", "added"].map((s) => phone(s, 1)).join("");
    return `<div class="lane" style="top:153px;--t:70s">${row}${row}</div>`; },

  // 1.7 — the five App Store screenshots  // 1.7 — the five App Store screenshots  // 3.3 — the five screenshots with their captions, at full height, drifting past.
  "1.7": () => { const row = SHOTS.map((shot) => storeShot(shot, 464)).join(""); return `<div class="lane" style="top:97px;--t:80s">${row}${row}</div>`; },
};
