// The whole Ringproof case in the layout of a DNP case page.
// Branding slides (1.x) come from brand.js (SLIDES), 4.5 and 4.6 from case-live.js; the rest is built here from exported images.
// case.html?only=4.2 shows one slide alone at 1600 x 1200 (used by case-shots.mjs); add &tall for the tall 1.1,
// or &embed to scale the slide to the window.

// ---------- Slide builders ----------
const caseStep = new URLSearchParams(location.search).get("step");
const black = (inner) => `<div class="s" style="background:#000">${inner}</div>`;
// A product screenshot in a plain window. crop = visible height in px of the 1380 px wide picture.
const windowShot = (file, crop, top) => black(`<div class="win" style="top:${top}px;height:${crop}px"><img src="shots/${file}.webp" alt=""></div>`);
const deckSlide = (n) => black(`<img class="dk" src="deck/${n}.webp" alt="">`);
// The real website in a frame, laid out `width` px wide and scaled to fill a box of boxW x boxH slide px.
// It scrolls itself (site.html?tour); &step=N in the address makes it stand still at stop N (used for exports).
const siteTour = (width, boxW, boxH) => `<iframe class="tour" title="Ringproof website" tabindex="-1" src="site.html?tour${caseStep === null ? "" : `&at=${caseStep}`}" style="width:${width}px;height:${Math.ceil((boxH * width) / boxW)}px;transform:scale(${boxW / width})"></iframe>`;
// A very plain browser window; the website slides all sit inside one.
const browser = (inner) => black(`<div class="browser"><div class="bar"><i></i><i></i><i></i><span>ringproof.example</span></div><div class="view">${inner}</div></div>`);
const siteShot = (name) => browser(`<img class="fill" src="site/${name}.webp" alt="">`);
// Three rows of pictures that slide sideways for ever, every other row the opposite way.
// Each row starts at a different picture and holds its pictures twice, so the loop has no seam.
const turned = (list, by) => list.slice(by).concat(list.slice(0, by));
const belt = (kind, pictures, starts) => black(`<div class="belt ${kind}">${starts.map((by, i) => `<div class="lane ${i % 2 ? "rev" : ""}">${turned(pictures, by).join("").repeat(2)}</div>`).join("")}</div>`);

const SCREENS = ["dashboard", "campaigns", "campaign", "campaign-metrics", "campaign-runs", "scenarios", "scenario", "scenario-phrasings", "run", "run-metrics", "run-debug", "chat", "chat-metrics", "test-data", "channels", "scenario-edit"];

const CASE_SLIDES = {
  // Pitch deck
  "2.1": () => deckSlide(1),
  "2.2": () => deckSlide(2),
  "2.3": () => deckSlide(4),
  "2.4": () => deckSlide(5),
  "2.5": () => deckSlide(6),
  "2.6": () => belt("decks", [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => `<img src="deck/${n}.webp" alt="">`), [0, 3, 6]),

  // Website. 3.4 and 3.5 are the page itself, scrolling from section to section (see siteTour).
  "3.1": () => siteShot("hero"),
  "3.2": () => browser(`<div class="steps" data-page="desktop" data-only="how"></div>`),     // one whole section, standing still
  "3.3": () => browser(`<div class="steps" data-page="desktop" data-only="pricing"></div>`),
  "3.4": () => browser(siteTour(1440, 1378, 966)),
  "3.5": () => black(`<div class="phone"><div class="view">${siteTour(390, 434, 994)}</div></div>`),

  // Platform
  "4.1": () => windowShot("dashboard", 1054, 73),
  "4.2": () => windowShot("run", 1060, 70),
  "4.3": () => windowShot("run-metrics", 958, 121),
  "4.4": () => windowShot("campaign", 1006, 97),
  ...LIVE_SLIDES,
  "4.7": () => belt("screens", SCREENS.map((name) => `<img src="thumbs/${name}.webp" alt="">`), [0, 5, 10]),
};
const ALL = { ...SLIDES, ...CASE_SLIDES };

// ---------- Page ----------
// A row is one slide, two slides side by side, or { stack, tall }: two slides stacked on the left and a tall one on the right.
const SECTIONS = [
  ["1 · Branding", "A mark built from bars of sound, and the pictures, type and carriers around it.", [{ stack: ["1.2", "1.3"], tall: "1.1" }, ["1.4", "1.5"], ["1.6"], ["1.7", "1.8"], ["1.9", "1.10"], ["1.11"], ["1.12"]]],
  ["2 · Pitch deck", "The deck Ringproof shows to a bank's head of customer experience.", [["2.1"], ["2.2", "2.3"], ["2.4", "2.5"], ["2.6"]]],
  ["3 · Website", "A marketing site that explains the product in one scroll.", [["3.1"], ["3.2", "3.3"], ["3.4", "3.5"]]],
  ["4 · Platform", "The product itself: 22 screens for campaigns, scenarios and single test calls.", [["4.1"], ["4.2", "4.3"], ["4.4"], ["4.5", "4.6"], ["4.7"]]],
];
const REEL = ["case/1.1-frame-1", "shots/dashboard", "case/1.6", "deck/1", "case/1.11", "site/hero", "case/1.9", "shots/run", "case/1.7", "deck/6", "case/1.5", "site/how", "case/1.10", "shots/campaign", "case/1.1-frame-3", "case/1.1-frame-8"];

const caseQuery = new URLSearchParams(location.search), one = caseQuery.get("only"), frameNo = Number(caseQuery.get("f")) || 0;
const frameOf = (id, tall = false) => `<div class="frame ${tall ? "tall" : ""}" id="s${id.replace(".", "-")}"><span class="num">${id}</span>${ALL[id](0, tall)}</div>`;
const rowOf = (row) => row.tall
  ? `<div class="row two"><div class="stack">${row.stack.map((id) => frameOf(id)).join("")}</div>${frameOf(row.tall, true)}</div>`
  : `<div class="row ${row.length === 2 ? "two" : ""}">${row.map((id) => frameOf(id)).join("")}</div>`;
const reel = (ratio) => `<div class="frame reel ${ratio}">${REEL.map((file) => `<img src="${file}.webp" alt="">`).join("")}</div>`;

if (one === "reel") {
  document.body.className = "only";
  document.body.innerHTML = reel(caseQuery.get("ratio") === "4x3" ? "" : "wide");
} else if (one && ALL[one]) {
  // &embed: the slide fills the window whatever its size, so another page can show it in a frame (the DNP site does).
  const embed = caseQuery.has("embed"), slide = ALL[one](frameNo, caseQuery.has("tall"));
  document.body.className = embed ? "only embed" : "only";
  document.body.innerHTML = embed ? `<div class="frame">${slide}</div>` : slide;
} else {
  document.body.innerHTML = `<div class="page">
    <div class="hero">
      <div class="media"><div class="frame">${SLIDES["1.1"](1)}</div></div>
      <div class="info"><h1>Ringproof</h1><p class="sub">Brand, website and product design for a tool that tests bank support lines with simulated calls.</p>
        <div class="tags"><span>Branding</span><span>Landing</span><span>SaaS</span></div></div>
    </div>
    <section><div class="overview">
      <div><b>[ GOAL ]</b><p>Give a new support-testing product one voice across everything a bank sees: the logo, the sales deck, the website and the platform where the results live.</p></div>
      <div><b>[ IDEA ]</b><p>Sound, made visible. The mark is a ring built from bars of a waveform, numbers are set in dots like a call display, and every picture is a wave or a blur of motion.</p></div>
    </div></section>
    <section>${reel("wide")}</section>
    ${SECTIONS.map(([title, text, rows]) => `<section>
      <div class="heading"><h2>${title}</h2><p class="sub">${text}</p></div>
      ${rows.map(rowOf).join("")}
    </section>`).join("")}
    <section><div class="heading"><h2>Other projects</h2></div>
      <div class="others">${[1, 2, 3].map(() => `<div class="frame" style="background:#dcdcd7"></div>`).join("")}</div></section>
  </div>`;
}

// Scale every 1600 px wide slide to its frame; the slide in a tall frame also grows to the frame's height.
const fit = () => document.querySelectorAll(".frame > .s").forEach((slide) => {
  const box = slide.parentElement, k = box.clientWidth / slide.offsetWidth; // 1600, or 400 for the editors on a narrow screen
  slide.style.transform = `scale(${k})`;
  if (box.classList.contains("tall")) slide.style.height = `${box.clientHeight / k}px`;
});
fit();
addEventListener("resize", fit);
drawWaves();
drawStreaks();
runShow();
runTools();
runLive();
runSteps();
// Slides that are off screen stand still (see .frame.off in case.css), so the page only animates what can be seen.
const watcher = new IntersectionObserver((seen) => seen.forEach((entry) => entry.target.classList.toggle("off", !entry.isIntersecting)), { rootMargin: "300px" });
document.querySelectorAll(".frame").forEach((box) => watcher.observe(box));

// Slides 3.2 and 3.3: one whole section of the website, cut from the long page picture and shrunk to fit the window.
// site/cuts.js (written by site-shots.mjs) says where each section starts in that picture.
function runSteps() {
  const { starts, height: whole } = SITE_CUTS.desktop;
  document.querySelectorAll(".steps").forEach((box) => {
    const i = starts.findIndex(([id]) => id === box.dataset.only), top = starts[i][1], height = (starts[i + 1]?.[1] ?? whole) - top;
    const k = Math.min(box.clientWidth / 1440, box.clientHeight / height);
    box.innerHTML = `<i style="width:${1440 * k}px;height:${height * k}px;background:url(site/full.webp) 0 ${-top * k}px / ${1440 * k}px auto no-repeat"></i>`;
  });
}

// The showreel: one picture at a time, a hard cut every 0.6 s. It starts once every picture is decoded and in memory.
document.querySelectorAll(".reel").forEach(async (box) => {
  const pictures = [...box.querySelectorAll("img")];
  let at = 0;
  pictures[0].classList.add("on");
  await Promise.all(pictures.map((picture) => picture.decode().catch(() => {})));
  setInterval(() => { if (box.classList.contains("off")) return; pictures[at].classList.remove("on"); at = (at + 1) % pictures.length; pictures[at].classList.add("on"); }, 600);
});
