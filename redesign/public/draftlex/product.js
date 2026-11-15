// Sections 2 and 3 of the case: the website (site.html) and the product (app.html) on slides.
// Loaded by case.html after brand.js and before case.js. Styles are in product.css.
// The real pages are framed live: an <iframe> laid out at its true width (1440 or 390 px) and scaled to the slide.
//   win()    a plain browser window on black, 90 px from every edge of the slide
//   crop()   one part of a page, enlarged to fill the whole slide (no window round it)
//   phone()  a plain phone outline
// An iframe with data-at=".how" is moved by case.js so that this part of the page sits at the top of its frame.
// Each section mixes the kinds of slide: a window, two enlarged parts, a live slide, phones, a reel of screens.

const win = (src, { at = "", address = "draftlex.example" } = {}) => {
  const width = 1420, scale = width / 1440, height = 980 / scale;
  return `<div class="win" style="left:90px;top:90px;width:${width}px"><div class="chrome"><i></i><i></i><i></i><span>${address}</span></div>
    <div class="view" style="height:980px"><iframe src="${src}" ${at ? `data-at="${at}"` : ""} data-scale="${scale}" style="width:1440px;height:${at ? 8000 : height}px;transform:scale(${scale})" tabindex="-1"></iframe></div></div>`;
};
// x, y: the corner of the page (in its own px) that goes to the corner of the slide; zoom: how much it is enlarged.
const crop = (src, { zoom, x = 0, y = 0, at = "", tall = 1100 }) => `<div class="crop"><iframe src="${src}" ${at ? `data-at="${at}"` : ""} data-scale="${zoom}" data-x="${x}" data-y="${y}" style="width:1440px;height:${at ? 8000 : tall}px;transform:scale(${zoom}) translate(${-x}px, ${-y}px)" tabindex="-1"></iframe></div>`;
const phone = (src, left, { at = "", top = 168 } = {}) => `<div class="phone" style="left:${left}px;top:${top}px"><div class="view"><iframe src="${src}" ${at ? `data-at="${at}"` : ""} data-scale="1" style="width:390px;height:${at ? 9000 : 844}px" tabindex="-1"></iframe></div></div>`;
const app = (screen) => `app.html?screen=${screen}`;

// The brand grounds that every slide of the website and the product stands on.
const GROUNDS = {
  blue: () => `<div class="ground" style="background:${BLUE}">${GRAIN}</div>`,
  sky: () => `<div class="ground" style="background:${SKY}">${GRAIN}</div>`,
  mist: () => `<div class="ground" style="background:${MIST}">${PTEX}</div>`,
  columns: () => `<div class="ground">${photo("columns", "blue", "50% 40%")}</div>`,
  stairs: () => `<div class="ground">${photo("stairs", "blue", "50% 60%")}</div>`,
};
const on = (ground, inner) => brandSlide("#000", GROUNDS[ground]() + inner);
// The product's own panel, with no browser window round it: the same 90 px margin as a window.
const panel = (src) => { const scale = 1420 / 1440; return `<div class="appwin"><iframe src="${src}" data-scale="${scale}" style="width:1440px;height:${Math.round(1020 / scale)}px;transform:scale(${scale})" tabindex="-1"></iframe></div>`; };

// Every screen of the product, for the slide where they all drift past (pictures made by app-shots.mjs).
const ALL_SCREENS = ["files", "settings", "details", "structure", "editor", "preview", "download", "pricing", "login", "signup", "profile", "support", "empty"];
const reel = (names, extra = "") => `<div class="reel ${extra}">${[...names, ...names].map((name) => `<img src="screens/${name}.webp" alt="">`).join("")}</div>`;

const PRODUCT = {
  // ---------- 2 · Website ----------
  "2.1": () => on("blue", win("site.html?still")),
  // Two parts of the page, enlarged: the four steps with pieces of the product, and the prices.
  "2.2": () => on("sky", crop("site.html?still", { at: ".how", zoom: 1, x: 10, y: 90 })),
  "2.3": () => on("mist", crop("site.html?still", { at: ".pricing", zoom: 1, x: 10, y: 50 })),
  // The page itself, scrolling from section to section.
  "2.4": () => on("columns", win("site.html?tour")),
  // On a phone: the page scrolling by itself, and two places on it.
  "2.5": () => on("sky", phone("site.html?tour", 125) + phone("site.html?still", 595, { at: ".band" }) + phone("site.html?still", 1065, { at: ".pricing" })),

  // ---------- 3 · Platform ----------
  "3.1": () => on("blue", panel(app("editor"))),
  // A new section is put into the structure, named, and taken away again; the numbers follow.
  "3.2": () => on("sky", crop(app("structure") + "&play", { zoom: 1.7, x: 248, y: 84 })),
  // The lawyer asks for a clause in a sentence, and it is written under the selected one.
  "3.3": () => on("columns", crop(app("editor") + "&play", { zoom: 1.7, x: 248, y: 84 })),
  "3.4": () => on("mist", panel(app("files"))),
  // Two more parts, enlarged: the finished page with its seal, and the prices.
  "3.5": () => on("blue", crop(app("preview"), { zoom: 1.2, x: 250, y: 84 })),
  "3.6": () => on("sky", crop(app("pricing"), { zoom: 1.2, x: 248, y: 84 })),
  "3.7": () => on("blue", phone(app("structure"), 125) + phone(app("editor") + "&play", 595) + phone(app("files"), 1065)),
  // Every screen, in three rows that slide past each other. Each row holds its pictures twice, so the loop has no seam.
  "3.8": () => on("stairs", `<div class="drift">${reel(ALL_SCREENS.slice(0, 5))}${reel(ALL_SCREENS.slice(5, 9), "rev")}${reel(ALL_SCREENS.slice(9).concat("structure"))}</div>`),
};
