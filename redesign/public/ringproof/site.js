// Ringproof landing page. Brand building blocks are copied from brand.js / brand-show.js (which cannot be
// loaded here because brand.js rewrites the body). The page markup lives in site.html; this file fills in the
// generated pieces: the mark, dot-matrix type, lens-bar icons and picture backgrounds.
//
// Markup hooks:
//   <span data-lock></span>                wordmark (mark + "Ringproof"), sized by font-size
//   <i data-mark></i>                      the mark alone, sized by CSS
//   <span data-dm="8.4" class="dm-l">      dot-matrix text (digits, A-Z and a few signs), sized by the class
//   <i data-icon="Call"></i>               lens-bar icon
//   <div data-art="marble"></div>          picture background that fills its parent (add data-big for a sharp canvas)
//   <div data-lenses="9"></div>            row of lens bars
// Query: site.html?section=<id> jumps straight to that section; site.html?frame=390 shows the page 390 px wide;
// site.html?still shows every block at once, without the appearing-on-scroll animation (all used by site-shots.mjs).
// site.html?tour scrolls the page by itself, for the case slides; ?tour&at=3 stands still at stop 3.

const n2 = (value) => +value.toFixed(2);
let uid = 0;

// The mark: a ring of lens-shaped bars, thick in the middle and thin at the edges.
function mark(cls = "") {
  const count = 11, gap = 1.5, outer = 21, inner = 9.5;
  const raw = Array.from({ length: count }, (_, i) => 1.1 + 3.6 * Math.sin((Math.PI * i) / (count - 1)));
  const scale = (outer * 2 - gap * (count - 1)) / raw.reduce((sum, w) => sum + w, 0);
  let x = 24 - outer, out = "";
  raw.forEach((rawWidth, i) => {
    const w = rawWidth * scale, cx = x + w / 2, dx = cx - 24;
    x += w + gap;
    const h = Math.sqrt(Math.max(outer * outer - dx * dx, 0));
    const hole = Math.abs(dx) < inner ? Math.sqrt(inner * inner - dx * dx) : 0;
    const lens = (y, height) => `<ellipse style="--i:${i}" cx="${n2(cx)}" cy="${n2(y + height / 2)}" rx="${n2(w / 2)}" ry="${n2(height / 2)}"/>`;
    out += hole ? lens(24 - h, h - hole) + lens(24 + hole, h - hole) : lens(24 - h, h * 2);
  });
  return `<svg class="mark ${cls}" viewBox="0 0 48 48" fill="currentColor" aria-hidden="true">${out}</svg>`;
}
const lock = () => `${mark()}<span>Ringproof</span>`;

// Dot-matrix glyphs on a 5 x 7 grid: the product's numerals plus capitals for short display words.
const GLYPHS = {
  "0": "01110 10001 10011 10101 11001 10001 01110", "1": "00100 01100 00100 00100 00100 00100 01110",
  "2": "01110 10001 00001 00010 00100 01000 11111", "3": "11110 00001 00001 01110 00001 00001 11110",
  "4": "00010 00110 01010 10010 11111 00010 00010", "5": "11111 10000 11110 00001 00001 10001 01110",
  "6": "00110 01000 10000 11110 10001 10001 01110", "7": "11111 00001 00010 00100 01000 01000 01000",
  "8": "01110 10001 10001 01110 10001 10001 01110", "9": "01110 10001 10001 01111 00001 00010 01100",
  ":": "0 0 1 0 1 0 0", ".": "0 0 0 0 0 0 1", ",": "00 00 00 00 00 01 10", " ": "000 000 000 000 000 000 000",
  "%": "11001 11010 00010 00100 01000 01011 10011", "$": "00100 01111 10100 01110 00101 11110 00100",
  "/": "00001 00001 00010 00100 01000 10000 10000", "+": "00000 00100 00100 11111 00100 00100 00000",
  "-": "00000 00000 00000 11111 00000 00000 00000",
  A: "01110 10001 10001 11111 10001 10001 10001", B: "11110 10001 10001 11110 10001 10001 11110",
  C: "01110 10001 10000 10000 10000 10001 01110", D: "11110 10001 10001 10001 10001 10001 11110",
  E: "11111 10000 10000 11110 10000 10000 11111", F: "11111 10000 10000 11110 10000 10000 10000",
  G: "01110 10001 10000 10111 10001 10001 01111", H: "10001 10001 10001 11111 10001 10001 10001",
  I: "111 010 010 010 010 010 111", J: "00111 00010 00010 00010 00010 10010 01100",
  K: "10001 10010 10100 11000 10100 10010 10001", L: "10000 10000 10000 10000 10000 10000 11111",
  M: "10001 11011 10101 10101 10001 10001 10001", N: "10001 11001 10101 10011 10001 10001 10001",
  O: "01110 10001 10001 10001 10001 10001 01110", P: "11110 10001 10001 11110 10000 10000 10000",
  Q: "01110 10001 10001 10001 10101 10010 01101", R: "11110 10001 10001 11110 10100 10010 10001",
  S: "01111 10000 10000 01110 00001 00001 11110", T: "11111 00100 00100 00100 00100 00100 00100",
  U: "10001 10001 10001 10001 10001 10001 01110", V: "10001 10001 10001 10001 10001 01010 00100",
  W: "10001 10001 10001 10101 10101 11011 10001", X: "10001 10001 01010 00100 01010 10001 10001",
  Y: "10001 10001 01010 00100 00100 00100 00100", Z: "11111 00001 00010 00100 01000 10000 11111",
};
function dm(text) {
  return [...text].map((ch) => {
    const rows = (GLYPHS[ch] ?? GLYPHS[" "]).split(" ");
    return `<span class="gl" style="grid-template-columns:repeat(${rows[0].length},var(--d))">${rows.join("").split("").map((bit) => `<i${bit === "1" ? ' class="on"' : ""}></i>`).join("")}</span>`;
  }).join("");
}

// A row of lenses whose width swells towards the middle (widths in % of the row).
function lenses(count) {
  const widths = Array.from({ length: count }, (_, i) => 0.12 + 0.88 * Math.sin((Math.PI * i) / (count - 1)));
  const unit = 62 / widths.reduce((sum, w) => sum + w, 0); // bars take 62% of the row, gaps the rest
  return widths.map((w) => `<i style="width:${n2(w * unit)}%"></i>`).join("");
}

// Icons: the lens bars of the mark seen through the icon's silhouette. White in the mask shows, black hides.
function icon(maskBody) {
  const id = `m${++uid}`, gap = 1.6, widths = Array.from({ length: 9 }, (_, i) => 1.6 + 2.6 * Math.sin((Math.PI * i) / 8));
  const scale = (46 - 8 * gap) / widths.reduce((sum, w) => sum + w, 0);
  let x = 1, bars = "";
  for (const raw of widths) { const w = raw * scale; bars += `<ellipse class="ib" cx="${n2(x + w / 2)}" cy="24" rx="${n2(w / 2)}" ry="27"/>`; x += w + gap; }
  return `<svg class="ic" viewBox="0 0 48 48" aria-hidden="true"><mask id="${id}"><g fill="#fff" stroke-linecap="round" stroke-linejoin="round">${maskBody}</g></mask><g mask="url(#${id})" fill="currentColor">${bars}</g></svg>`;
}
const cut = 'fill="none" stroke="#000" stroke-width="4.5"';
const ICONS = {
  Call: '<path d="M13 3h22a4 4 0 0 1 4 4v34a4 4 0 0 1-4 4H13a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4Z"/><rect x="18" y="36" width="12" height="3.5" rx="1.7" fill="#000"/>',
  Chat: '<rect x="3" y="6" width="42" height="29" rx="9"/><path d="M12 33v11l12-11Z"/>',
  Passed: `<circle cx="24" cy="24" r="22"/><path ${cut} d="m13 25 8 8 15-17"/>`,
  Secure: '<path d="M24 2 43 8v14c0 11.5-8 19.5-19 24C13 41.5 5 33.5 5 22V8Z"/>',
  Card: '<rect x="2" y="8" width="44" height="32" rx="6"/><rect x="2" y="16" width="44" height="6" fill="#000"/>',
  Duration: `<circle cx="24" cy="24" r="22"/><path ${cut} d="M24 11v14l9 6"/>`,
  Locked: '<rect x="6" y="20" width="36" height="26" rx="6"/><path fill="none" stroke="#fff" stroke-width="6" d="M14 22v-7a10 10 0 0 1 20 0v7"/><circle cx="24" cy="33" r="4" fill="#000"/>',
  Metrics: '<rect x="3" y="26" width="12" height="20" rx="3"/><rect x="18" y="14" width="12" height="32" rx="3"/><rect x="33" y="2" width="12" height="44" rx="3"/>',
  Run: '<path stroke="#fff" stroke-width="6" d="M11 7 41 24 11 41Z"/>',
  Caller: '<circle cx="24" cy="14" r="11"/><path d="M3 47c0-12 9-19 21-19s21 7 21 19Z"/>',
  Alert: '<path d="M24 3c-9 0-14 7-14 15v9l-6 9h40l-6-9v-9c0-8-5-15-14-15Z"/><circle cx="24" cy="42" r="5"/>',
  Scenario: '<circle cx="24" cy="24" r="22"/><circle cx="24" cy="24" r="15" fill="#000"/><circle cx="24" cy="24" r="8"/>',
};

// Picture backgrounds.
const GRAIN = '<i class="grain"></i>';
function art(kind, big = false) {
  const size = big ? 'width="1600" height="1200"' : 'width="800" height="600"';
  return {
    blue: '<div class="bg blue"></div>',
    mist: '<div class="bg mistbg"></div>',
    wheat: '<img class="streak down" src="nature/wheat.jpg" alt="">',
    lavender: '<img class="streak down" src="nature/lavender.jpg" alt="">',
    forest: '<img class="streak across" src="nature/forest.jpg" alt="">',
    ripples: `<canvas class="bg" data-wave="ripples" ${size}></canvas>`,
    marble: `<canvas class="bg" data-wave="marble" ${size}></canvas>`,
  }[kind] + GRAIN;
}
const SHOW_FILTERS = `<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <filter id="streak-down" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation="3 120"/></filter>
  <filter id="streak-across" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation="120 3"/></filter>
</svg>`;

// Sound drawn as waves: rings from three sources crossing each other, or one wave folded like liquid.
function drawWaves() {
  const mix = (a, b, t) => a + (b - a) * t;
  const ramp = (stops, t) => {
    const pos = Math.min(Math.max(t, 0), 0.9999) * (stops.length - 1), i = Math.floor(pos), f = pos - i;
    return [0, 1, 2].map((c) => mix(stops[i][c], stops[i + 1][c], f));
  };
  const palettes = {
    ripples: [[6, 9, 20], [24, 31, 54], [58, 70, 104], [104, 120, 164]],
    marble: [[7, 10, 20], [20, 27, 48], [52, 63, 96], [112, 127, 172]],
  };
  document.querySelectorAll("canvas[data-wave]").forEach((canvas) => {
    const kind = canvas.dataset.wave, w = canvas.width, h = canvas.height;
    const ctx = canvas.getContext("2d"), image = ctx.createImageData(w, h);
    const k = w / 800; // the wave lengths below were tuned on an 800 px wide canvas
    for (let py = 0; py < h; py++) for (let px = 0; px < w; px++) {
      const x = px / k, y = py / k;
      let v;
      if (kind === "ripples") {
        const d1 = Math.hypot(x - 592, y - 120), d2 = Math.hypot(x - 128, y - 528), d3 = Math.hypot(x - 816, y - 570);
        v = (Math.sin(d1 / 7) + Math.sin(d2 / 9.5) + 0.6 * Math.sin(d3 / 13)) / 2.6;
      } else {
        const wx = x + 62 * Math.sin(y / 84 + 1.3 * Math.sin(x / 118)), wy = y + 62 * Math.cos(x / 96 + 1.7 * Math.sin(y / 104));
        v = Math.sin((wx + wy) / 46 + 2.2 * Math.sin(wx / 132 - wy / 158));
      }
      let t = v * 0.5 + 0.5;
      t = t * t * (3 - 2 * t);
      const [r, g, b] = ramp(palettes[kind], t), at = (py * w + px) * 4;
      image.data[at] = r; image.data[at + 1] = g; image.data[at + 2] = b; image.data[at + 3] = 255;
    }
    ctx.putImageData(image, 0, 0);
  });
}

// ---------- Fill the page ----------
const query = new URLSearchParams(location.search);
const each = (selector, fn) => document.querySelectorAll(selector).forEach(fn);

function fill() {
  each("[data-lock]", (el) => { el.classList.add("lock"); el.innerHTML = lock(); });
  each("[data-mark]", (el) => { el.innerHTML = mark(); });
  each("[data-dm]", (el) => { el.classList.add("dm"); el.setAttribute("aria-label", el.dataset.dm); el.innerHTML = dm(el.dataset.dm); });
  each("[data-icon]", (el) => { el.innerHTML = icon(ICONS[el.dataset.icon]); });
  each("[data-lenses]", (el) => { el.classList.add("lenses"); el.innerHTML = lenses(Number(el.dataset.lenses)); });
  each("[data-art]", (el) => { el.classList.add("art"); el.innerHTML = art(el.dataset.art, "big" in el.dataset); });
  document.body.insertAdjacentHTML("beforeend", SHOW_FILTERS);
  drawWaves();
}

// ?section=<id>: start the page at that section. The page is pulled up with a negative margin instead of
// scrolled, because headless Edge saves a black picture when the window has been scrolled by script.
function jump() {
  const target = document.getElementById(query.get("section") ?? "");
  if (!target) return;
  document.documentElement.classList.add("solo");
  document.body.style.marginTop = "0px";
  document.body.style.marginTop = `${-Math.round(target.getBoundingClientRect().top + window.scrollY)}px`;
}
// The full page height is written on <html data-h> so site-shots.mjs can size its window to it.
function settle() {
  jump();
  document.documentElement.dataset.h = Math.ceil(document.documentElement.scrollHeight);
  // Where every section starts, as "hero:109,logos:1511,...". The case page uses it to show one section at a time.
  document.documentElement.dataset.cuts = [...document.querySelectorAll("section[id], footer[id]")].map((el) => `${el.id}:${Math.round(el.getBoundingClientRect().top + window.scrollY)}`).join(",");
}

// ?frame=<width>: show the page inside an iframe of that width, pinned to the left edge and as tall as the
// page. Headless Edge cannot make a window narrower than about 500 px, so this is how the 390 px shot is taken.
function frame(width) {
  const inside = query.get("section") ? `site.html?section=${encodeURIComponent(query.get("section"))}` : "site.html?still";
  document.body.innerHTML = `<iframe src="${inside}" title="Ringproof at ${width} px" style="display:block;border:0;width:${width}px;height:1000px"></iframe>`;
  document.body.style.overflowX = "auto";
  const inner = document.querySelector("iframe");
  const copy = () => {
    const height = inner.contentDocument?.documentElement.dataset.h;
    if (!height) return;
    inner.style.height = `${height}px`;
    document.documentElement.dataset.h = height;
    document.documentElement.dataset.cuts = inner.contentDocument.documentElement.dataset.cuts;
  };
  inner.addEventListener("load", () => { copy(); setInterval(copy, 200); });
}

// Blocks fade in and rise as they scroll into view. Members of a row (logos, steps, plans...) follow one another.
const ROWS = ".logo-row, .notes, .nums, .steps, .quotes, .plans, .tiles, .duo";
function reveal() {
  const blocks = [];
  each("main .wrap > *, .footer .wrap > *", (el) => {
    if (el.closest(".hero")) el.style.setProperty("--n", blocks.push(el) - 1); // the hero's blocks come one after another
    else if (el.matches(ROWS)) [...el.children].forEach((child, n) => { child.style.setProperty("--n", n); blocks.push(child); });
    else blocks.push(el);
  });
  const watcher = new IntersectionObserver((seen) => seen.forEach((entry) => entry.isIntersecting && entry.target.classList.add("in")), { rootMargin: "0px 0px -8% 0px" });
  blocks.forEach((el) => { el.classList.add("rv"); watcher.observe(el); });
  return blocks;
}

// ?tour: the page scrolls itself from one stop to the next, waits, and after the footer starts again from the top.
// A stop is the start of a section; a section taller than the window gets more stops, the last one at its end.
function tour(blocks) {
  const root = document.documentElement, still = query.get("at");
  root.classList.add("tour");
  const stops = () => {
    const bar = document.getElementById("nav").offsetHeight, room = innerHeight - bar, last = root.scrollHeight - innerHeight, list = [];
    each("main section[id], footer[id]", (el) => {
      const top = el.id === "hero" ? 0 : el.getBoundingClientRect().top + scrollY - bar - 24; // a little air under the bar
      const end = el.getBoundingClientRect().bottom + scrollY - innerHeight, parts = end - top < 80 ? 0 : Math.ceil((end - top) / (room * 0.8));
      for (let n = 0; n <= parts; n++) {
        const y = Math.round(Math.min(Math.max(parts ? top + ((end - top) * n) / parts : top, 0), last));
        if (!list.length || y - list[list.length - 1] > 120) list.push(y);
      }
    });
    return list;
  };
  if (still !== null) { // one stop, standing still
    const stay = () => { const list = stops(); scrollTo(0, list[Number(still) % list.length]); };
    stay(); addEventListener("load", stay); document.fonts?.ready.then(stay);
    return;
  }
  const HOLD = 1500, ease = (p) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
  let at = 0, from = 0, to = 0, start = 0, length = 0, state = "wait", until = performance.now() + HOLD + 900;
  const frame = (now) => {
    requestAnimationFrame(frame);
    if (window.frameElement?.closest(".off")) return; // the slide is off screen on the case page
    if (state === "move") {
      const p = Math.min((now - start) / length, 1);
      scrollTo(0, from + (to - from) * ease(p));
      if (p === 1) { state = "wait"; until = now + HOLD; }
    } else if (state === "blink" && now >= until) { // dark now: back to the top, and every block may appear again
      scrollTo(0, 0);
      blocks.forEach((el) => el.getBoundingClientRect().top > innerHeight && el.classList.remove("in"));
      root.classList.remove("blink");
      at = 0; state = "wait"; until = now + HOLD + 600;
    } else if (state === "wait" && now >= until) {
      const list = stops();
      if (++at >= list.length) { root.classList.add("blink"); state = "blink"; until = now + 450; return; }
      from = scrollY; to = list[at]; start = now; length = Math.min(Math.max(Math.abs(to - from) * 1.3, 900), 1500); state = "move";
    }
  };
  requestAnimationFrame(frame);
}

if (Number(query.get("frame"))) frame(Number(query.get("frame")));
else {
  fill();
  const moving = !query.has("still") && !query.has("section") && !query.has("at");
  const blocks = moving ? reveal() : [];
  if (query.has("tour")) tour(blocks);
  settle();
  addEventListener("load", settle);
  document.fonts?.ready.then(settle);
}
