// The whole case of One Gallon on one page.
//   case.html              every section and slide, with slide numbers, for review
//   case.html?only=1.2     one slide alone at 1600 x 1200 (shots.mjs saves pictures from this)
//   ...&at=2               a moving slide frozen at second 2 (for a still picture of it)
//   ...&embed              the slide scaled to the window, so a website can show it live in a frame
//   ...&embed&cover        the same, but the slide fills a frame of any shape: scaled up, centred, its edges cropped

const query = new URLSearchParams(location.search);
const only = query.get("only"), at = query.get("at");

// ---------- Slides ----------
// A slide is a function that returns the inside of a 1600 x 1200 <div class="s">. Its number is "section.place":
// 1.2 is the second slide of section 1. Numbers are how slides are named in feedback, so keep them in step with SECTIONS.
// Section 1 lives in brand.js, with 1.7 in app.js and 1.8, 1.9 in social.js; section 2 (the website on slides) is here; section 3 is in app.js.
const frozenAt = at !== null ? Number(at) : null;
// The real website (site.html) framed live: it scrolls itself in ?tour mode; for a still picture it stands still at the top.
const site = (width, height) => `<iframe src="site.html?${frozenAt === null ? "tour" : "still"}" width="${width}" height="${height}" loading="lazy" tabindex="-1"></iframe>`;
const SITE_SLIDES = {
  // 2.1 — the website on a desktop, in a plain browser window.
  "2.1": () => `<div class="window"><div class="bar"><i></i><i></i><i></i><span>onegallon.example</span></div>${site(1440, 996)}</div>`,
  // 2.2 — the website on a phone.
  "2.2": () => `${flow({ set: "sky", seed: 3 })}${grain()}<div class="center"><div class="handset"><div class="glass">${site(390, 844)}</div></div></div>`,
};
// 0.1 — the cover of the case on the studio's site: the logo on the brand's ribbons of light, moving slowly. It is not in
// any section; the site frames it (case.html?only=0.1&embed&cover) on the card of the case and at the top of its page.
const COVER_SLIDES = { "0.1": () => `${flow({ set: "sky", seed: 3, period: 28 })}${grain()}<div class="center">${logo(2.2)}</div>` };
const SLIDES = { ...COVER_SLIDES, ...BRAND_SLIDES, ...APP_SLIDES, ...SOCIAL_SLIDES, ...SITE_SLIDES };
const BACK = { ...BRAND_BACK, "0.1": "#639FFD" }; // a slide's background; pure black unless it is listed
const slideOf = (id) => `<div class="s" style="background:${BACK[id] ?? "#000"}">${SLIDES[id]()}</div>`;

// ---------- Page ----------
// [title, one line about the section, rows]. A row is one slide, or two slides side by side.
// The builder (1.4) stands between rows of pictures, not at the end.
const SECTIONS = [
  ["1 · Branding", "A brand grown out of the app: its logo, colours and type, a picture of light in water that is made in code, and what it looks like in the App Store and in a feed.",
    [["1.1"], ["1.2", "1.3"], ["1.4"], ["1.5", "1.6"], ["1.7"], ["1.8"], ["1.9"]]],
  ["2 · Website", "One screen in two halves: the words on the left, short films of water and the brand's own moving pictures on the right.",
    [["2.1"], ["2.2"]]],
  ["3 · App", "The app as it was designed: photograph a drink, check the amount, watch the day fill.",
    [["3.1"], ["3.2", "3.3"], ["3.4"]]],
];

const frameOf = (id) => `<div class="frame"><span class="num">${id}</span>${slideOf(id)}</div>`;

if (only && SLIDES[only]) {
  const embed = query.has("embed");
  document.body.className = embed ? "only embed" : "only";
  document.body.innerHTML = embed ? `<div class="frame">${slideOf(only)}</div>` : slideOf(only);
  if (at !== null) {
    // Freeze every animation at that second: delays that subtract var(--at) move the loop there, then it is paused.
    document.body.style.setProperty("--at", `${Number(at)}s`);
    document.body.classList.add("frozen");
  }
} else {
  // Above the sections: the logo slide as a cover, the name, one sentence, tags, and two short paragraphs.
  const intro = `<header class="intro">
    <div class="frame">${slideOf("1.1")}</div>
    <h1>One Gallon</h1>
    <p class="one">A water tracker that counts for you: photograph a drink and it is logged.</p>
    <ul class="tags">${["Concept", "Branding", "Website", "Mobile app"].map((tag) => `<li>${tag}</li>`).join("")}</ul>
    <div class="two">
      <div><h3>Goal</h3><p>Take a finished app design — a tracker that logs water from a photo of your glass — and give it everything a launch needs: a brand, an App Store page, social posts and a website.</p></div>
      <div><h3>Idea</h3><p>Light through water. The app’s soft blue pictures became two backgrounds made in code, ribbons of light and sun caustics, that move slowly behind the logo, the posts and the site — and that a visitor can rebuild with a few sliders.</p></div>
    </div>
  </header>`;
  document.body.innerHTML = `<div class="page">${intro}${SECTIONS.map(([title, text, rows]) => `<section>
    <div class="heading"><h2>${title}</h2><p>${text}</p></div>
    ${rows.map((row) => `<div class="row ${row.length === 2 ? "two" : ""}">${row.map(frameOf).join("")}</div>`).join("")}
  </section>`).join("")}</div>`;
}

// Scale every 1600 px wide slide to the width of its frame (or, as a cover, until it fills the frame both ways).
const asCover = query.has("cover");
const fit = () => document.querySelectorAll(".frame > .s").forEach((box) => {
  const w = box.parentElement.clientWidth, h = box.parentElement.clientHeight, k = asCover ? Math.max(w / 1600, h / 1200) : w / 1600;
  box.style.transform = asCover ? `translate(${(w - 1600 * k) / 2}px, ${(h - 1200 * k) / 2}px) scale(${k})` : `scale(${k})`;
});
fit();
addEventListener("resize", fit);

// Slides that are off screen stand still (see .frame.off in case.css), so the page only animates what can be seen.
// The canvas pictures (flow.js, caustics.js) look at the same class before they redraw.
const watcher = new IntersectionObserver((seen) => seen.forEach((entry) => entry.target.classList.toggle("off", !entry.isIntersecting)), { rootMargin: "300px" });
document.querySelectorAll(".frame").forEach((box) => watcher.observe(box));

// Start the pictures made in code (frozen at ?at= if given) and switch on the builder.
Flow.mount(document, frozenAt);
Caustics.mount(document, frozenAt);
Brand.wire(document);
