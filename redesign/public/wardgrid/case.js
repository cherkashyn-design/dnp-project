// The whole Wardgrid case on one page.
//   case.html              every section and slide, with slide numbers, for review
//   case.html?only=1.2     one slide alone at 1600 x 1200 (shots.mjs saves pictures from this)
//   ...&at=2               a moving slide frozen at second 2 (for a still picture of it)
//   ...&embed              the slide scaled to the window, so a website can show it live in a frame
//   ...&embed&cover        the same, but the slide fills a frame of any shape: scaled up, centred, its edges cropped
// Slides 1.x come from brand.js. Below: 2.x the deck (drawn from deck.js), 3.x the website and 4.x the product
// (the real pages in frames; 4.10 uses the pictures that "node shots.mjs app" saves into ./app).
const query = new URLSearchParams(location.search);
const only = query.get("only"), at = query.get("at");
const SLIDES = (window.SLIDES = window.SLIDES || {});
const black = (cls, inner) => `<div class="s ${cls}" style="background:#000">${inner}</div>`;
const frozen = at === null ? "" : `&at=${Number(at)}`;

// ---------- 0.1 · The cover of the case: an open shift is taken ----------
// A ten-second loop in CSS (see .cov in case.css): the button is pressed, Thursday's open cell fills, the card says "Covered".
const covWeek = [["Mon", "L"], ["Tue", "L"], ["Wed", "E"], ["Thu", "o"], ["Fri", ""], ["Sat", "E"], ["Sun", ""]];
SLIDES["0.1"] = () => `<div class="s cov" style="background:#1d3be3"><canvas class="pic" data-set="blue" data-field="blobs" data-cell="40" data-level="0.6" data-dots="off" data-live data-hole="440,210,720,780"></canvas>
  <div class="cov-card"><div class="cov-tags"><span class="t1">Open shift</span><span class="t2">Covered</span></div>
    <b>Night · Thu 19 Nov</b><em>21:00–07:30 · Ward 4B Cardiology</em>
    <div class="cov-week">${covWeek.map(([day, kind]) => `<div><i class="${kind}">${kind === "o" ? `<u></u>` : ""}</i><span>${day}</span></div>`).join("")}</div>
    <div class="cov-facts"><span>30 h rest before it</span><span>Your 1st night in a row</span></div>
    <div class="cov-btn"><i class="tap"></i><span class="b1">Take this shift</span><span class="b2">${WG.ic("check", 34)}It's yours</span></div></div></div>`;

// ---------- 2 · Pitch deck ----------
const deckOn = (n) => () => black("s2", `<div class="dk">${window.DECK[n - 1]()}</div>`);
[1, 3, 4, 5, 7].forEach((n, i) => { SLIDES[`2.${i + 1}`] = deckOn(n); });
// All ten slides drifting in three rows. Each row holds its slides twice and moves by half its length, so it loops.
const deckRow = (numbers, top, back) => `<div class="drift ${back ? "back" : ""}" style="top:${top}px;--half:-2820px">${[...numbers, ...numbers].map((n) => `<div class="thumb">${window.DECK[n - 1]()}</div>`).join("")}</div>`;
SLIDES["2.6"] = () => black("s26", deckRow([1, 2, 3, 4, 5], 110, false) + deckRow([6, 7, 8, 9, 10], 447, true) + deckRow([9, 3, 7, 5, 10], 784, false));

// ---------- 3 · Website and 4 · Product: the real pages, framed ----------
// A plain browser window: thin border, three grey dots, an address. The page inside is laid out at 1440 x 900.
const win = (address, src) => `<div class="win"><div class="bar"><i></i><i></i><i></i><span>${address}</span></div><iframe src="${src}" title="${address}" tabindex="-1" loading="lazy"></iframe></div>`;
// A phone outline with the page laid out at 390 x 844 inside.
const phone = (src, left, top, scale) => `<div class="ph" style="left:${left}px;top:${top}px;transform:scale(${scale})"><iframe src="${src}" title="Wardgrid on a phone" tabindex="-1" loading="lazy"></iframe></div>`;

SLIDES["3.1"] = () => black("s3", win("wardgrid.example", "site.html?still"));
SLIDES["3.2"] = () => black("s3", win("wardgrid.example/#how", "site.html?still&go=how"));
SLIDES["3.3"] = () => black("s3", win("wardgrid.example/#pricing", "site.html?still&go=pricing"));
SLIDES["3.4"] = () => black("s3", win("wardgrid.example", `site.html?tour${frozen}`));
SLIDES["3.5"] = () => black("s3", phone(`site.html?tour${frozen}`, 300, 102, 1.18) + phone(`site.html?tour&lead=13${frozen}`, 840, 102, 1.18));

const appWin = (screen) => () => black("s4", win("app.wardgrid.example/ward-4b", `app.html?screen=${screen}`));
SLIDES["4.1"] = appWin("rota");
SLIDES["4.2"] = appWin("open");
SLIDES["4.3"] = appWin("conflict");
SLIDES["4.4"] = () => black("s4", win("app.wardgrid.example/ward-4b", `app.html?screen=open&play${frozen}`));
SLIDES["4.5"] = appWin("swaps");
SLIDES["4.6"] = appWin("profile");
SLIDES["4.7"] = () => black("s4", ["m-week", "m-offer", "m-taken"].map((screen, i) => phone(`app.html?screen=${screen}`, 110 + i * 475, 136, 1.1)).join(""));
SLIDES["4.8"] = appWin("empty");
SLIDES["4.9"] = appWin("nobody");
const appRow = (names, top, back) => `<div class="drift ${back ? "back" : ""}" style="top:${top}px;--half:-3024px">${[...names, ...names].map((name) => `<img class="thumb app" src="app/${name}.webp" alt="" />`).join("")}</div>`;
SLIDES["4.10"] = () => black("s410", appRow(["rota", "open", "asked", "covered", "nobody", "conflict"], 126, false) + appRow(["swaps", "staff", "profile", "rules", "empty", "offline"], 450, true) + appRow(["covered", "rules", "rota", "swaps", "conflict", "staff"], 774, false));

// ---------- Page ----------
// [title, one line about the section, rows]. A row is one slide, or two slides side by side.
const SECTIONS = [
  ["1 · Branding", "Every cell covered: a mark, pictures and a voice built from the cells of a rota.", [["1.1"], ["1.2", "1.3"], ["1.4", "1.5"], ["1.6"], ["1.7", "1.8"], ["1.12"], ["1.9", "1.10"], ["1.11"]]],
  ["2 · Pitch deck", "Ten slides for the sales team: the empty cell, what it costs, and how Wardgrid closes it.", [["2.1"], ["2.2", "2.3"], ["2.4", "2.5"], ["2.6"]]],
  ["3 · Website", "One page that sells a demo: the promise, how it works, numbers, pricing.", [["3.1"], ["3.2", "3.3"], ["3.4"], ["3.5"]]],
  ["4 · Platform", "The week of one ward on one screen, and the hard moments: an open shift, a broken rule, nobody free.", [["4.1"], ["4.2", "4.3"], ["4.4"], ["4.5", "4.6"], ["4.7"], ["4.8", "4.9"], ["4.10"]]],
];

const frameOf = (id) => `<div class="frame"><span class="num">${id}</span>${SLIDES[id]()}</div>`;

if (only && SLIDES[only]) {
  const embed = query.has("embed");
  document.body.className = embed ? "only embed" : "only";
  document.body.insertAdjacentHTML("afterbegin", embed ? `<div class="frame">${SLIDES[only]()}</div>` : SLIDES[only]());
  if (at !== null) {
    // Freeze every animation at that second: delays that subtract var(--at) move the loop there, then it is paused.
    document.body.style.setProperty("--at", `${Number(at)}s`);
    document.body.classList.add("frozen");
  }
} else {
  document.body.insertAdjacentHTML("afterbegin", `<div class="page">
    <header class="intro">
      <div class="frame">${SLIDES["0.1"]()}</div>
      <div class="about"><h1>Wardgrid</h1><p class="sub">A rota and shift-cover platform for hospital wards.</p>
        <div class="tags">${["Concept", "Branding", "Pitch deck", "Website", "Product"].map((tag) => `<span>${tag}</span>`).join("")}</div>
        <div><b>Goal</b><p>Design, from nothing, a product a ward manager would trust on a bad day: someone is off sick, a night shift is open, and the rules about rest still have to hold.</p></div>
        <div><b>Idea</b><p>Every cell covered. A rota is a grid of cells, so the mark, the pictures and the interface are all built from one cell in three states: covered, open, in conflict.</p></div></div>
    </header>
    ${SECTIONS.map(([title, text, rows]) => `<section>
    <div class="heading"><h2>${title}</h2><p>${text}</p></div>
    ${rows.map((row) => `<div class="row ${row.length === 2 ? "two" : ""}">${row.map(frameOf).join("")}</div>`).join("")}
  </section>`).join("")}</div>`);
}

// Scale every 1600 px wide slide to the width of its frame (or, as a cover, until it fills the frame both ways).
const asCover = query.has("cover");
const fit = () => document.querySelectorAll(".frame > .s").forEach((box) => {
  const w = box.parentElement.clientWidth, h = box.parentElement.clientHeight, k = asCover ? Math.max(w / 1600, h / 1200) : w / 1600;
  box.style.transform = asCover ? `translate(${(w - 1600 * k) / 2}px, ${(h - 1200 * k) / 2}px) scale(${k})` : `scale(${k})`;
});
fit();
addEventListener("resize", fit);
window.brandReady();

// Slides that are off screen stand still (see .frame.off in case.css), so the page only animates what can be seen.
// The pages framed inside a slide (website, product) are told too, so their tours, loops and pictures stop as well.
const tell = (box) => box && box.querySelectorAll("iframe").forEach((page) => page.contentWindow && page.contentWindow.postMessage({ wg: box.classList.contains("off") ? "pause" : "play" }, "*"));
const watcher = new IntersectionObserver((seen) => seen.forEach((entry) => { entry.target.classList.toggle("off", !entry.isIntersecting); tell(entry.target); }), { rootMargin: "300px" });
document.addEventListener("load", (event) => { if (event.target.tagName === "IFRAME") tell(event.target.closest(".frame")); }, true);
document.querySelectorAll(".frame").forEach((box) => watcher.observe(box));
