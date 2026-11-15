// The whole case on one page.
//   case.html              every section and slide, with slide numbers, for review
//   case.html?only=1.2     one slide alone at 1600 x 1200 (shots.mjs saves pictures from this)
//   ...&at=2               a moving slide frozen at second 2 (for a still picture of it)
//   ...&embed              the slide scaled to the window, so a website can show it live in a frame
//   ...&embed&cover        the same, but the slide fills a frame of any shape: scaled up, centred, its edges cropped

const query = new URLSearchParams(location.search);
const only = query.get("only"), at = query.get("at");

// ---------- Slides ----------
// A slide is a function that returns a 1600 x 1200 <div class="s">. Its number is "section.place": 1.2 is the
// second slide of section 1. Numbers are how slides are named in feedback, so keep them in step with SECTIONS.
const slide = (background, inner) => `<div class="s" style="background:${background}">${inner}</div>`;

// The slides of each section are built in their own file (brand.js for section 1, product.js for 2 and 3).
// 0.1 is the cover of the case on the studio's site: the seal ring turning once in two minutes on the brand's blue.
// It is in no section; the site frames it (case.html?only=0.1&embed&cover) on the card of the case and at the top of its page.
const COVER = { "0.1": () => brandSlide(BLUE, `${GRAIN}<div class="wheel" style="left:400px;top:200px;width:800px;height:800px;animation-duration:120s">${ringMark(800, INK, PAPER, PAPER)}</div>`) };
const SLIDES = { ...COVER, ...BRAND, ...PRODUCT };

// ---------- Page ----------
// [title, one line about the section, rows]. A row is one slide, or two slides side by side.
const SECTIONS = [
  ["1 · Branding", "A serif name that ends in a blue full stop. Round it: a seal ring of drops that spells the name, and paper with cut corners.", [["1.1"], ["1.2", "1.3"], ["1.4", "1.5"], ["1.6"], ["1.7"], ["1.8", "1.9"]]],
  ["2 · Website", "One page in the soft style of the product: round white cards on a grey ground, serif headlines, pieces of the product instead of whole screens.", [["2.1"], ["2.2", "2.3"], ["2.4"], ["2.5"]]],
  ["3 · Platform", "Four steps from a title to a signed page, built on a ready component library: one round panel, the contract set in a serif on a white sheet, one blue for what is selected or new.", [["3.1"], ["3.2", "3.3"], ["3.4"], ["3.5", "3.6"], ["3.7"], ["3.8"]]],
];

const frameOf = (id) => `<div class="frame"><span class="num">${id}</span>${SLIDES[id]()}</div>`;

if (only && SLIDES[only]) {
  const embed = query.has("embed");
  document.body.className = embed ? "only embed" : "only";
  document.body.innerHTML = embed ? `<div class="frame">${SLIDES[only]()}</div>` : SLIDES[only]();
  if (at !== null) {
    // Freeze every animation at that second: delays that subtract var(--at) move the loop there, then it is paused.
    document.body.style.setProperty("--at", `${Number(at)}s`);
    document.body.classList.add("frozen");
  }
} else {
  document.body.innerHTML = `<div class="page">${SECTIONS.map(([title, text, rows]) => `<section>
    <div class="heading"><h2>${title}</h2><p>${text}</p></div>
    ${rows.map((row) => `<div class="row ${row.length === 2 ? "two" : ""}">${row.map(frameOf).join("")}</div>`).join("")}
  </section>`).join("")}</div>`;
}

// A framed page with data-at=".how" is moved so that this part of it sits at the top of its window.
document.querySelectorAll("iframe[data-at]").forEach((frame) => frame.addEventListener("load", () => {
  const part = frame.contentDocument.querySelector(frame.dataset.at);
  if (part) frame.style.transform = `scale(${frame.dataset.scale}) translate(${-(frame.dataset.x || 0)}px, ${-part.offsetTop - Number(frame.dataset.y || 0)}px)`;
}));

// Scale every 1600 px wide slide to the width of its frame (or, as a cover, until it fills the frame both ways).
const asCover = query.has("cover");
const fit = () => document.querySelectorAll(".frame > .s").forEach((box) => {
  const w = box.parentElement.clientWidth, h = box.parentElement.clientHeight, k = asCover ? Math.max(w / 1600, h / 1200) : w / 1600;
  box.style.transform = asCover ? `translate(${(w - 1600 * k) / 2}px, ${(h - 1200 * k) / 2}px) scale(${k})` : `scale(${k})`;
});
fit();
addEventListener("resize", fit);

// Slides that are off screen stand still (see .frame.off in case.css), so the page only animates what can be seen.
const watcher = new IntersectionObserver((seen) => seen.forEach((entry) => entry.target.classList.toggle("off", !entry.isIntersecting)), { rootMargin: "300px" });
document.querySelectorAll(".frame").forEach((box) => watcher.observe(box));
