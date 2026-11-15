// The website's behaviour: the seal ring, sections that appear as they scroll into view, and two modes for the case.
//   ?still  everything visible at once and nothing fixed, for one long picture of the page
//   ?tour   the page scrolls itself from section to section, pauses at each, and starts again from the top

const mode = new URLSearchParams(location.search);
const still = mode.has("still"), tour = mode.has("tour");
if (self !== top) document.documentElement.classList.add("framed");
if (still) document.body.classList.add("still");
if (tour) document.body.classList.add("tour");

// The seal ring (the same drawing as ringMark in brand.js): ten discs, the name letter by letter and two full stops.
const RING = [["D", -162], ["R", -126], ["A", -90], ["F", -54], ["T", -18], [null, 18], ["X", 54], ["E", 90], ["L", 126], [null, 162]];
// The discs run into each other like drops (a blur cut back to a hard edge); the letters lie on top.
let ringCount = 0;
const ring = (disc, letter, dot) => {
  const id = `goo${++ringCount}`;
  const spots = RING.map(([glyph, angle]) => { const a = (angle * Math.PI) / 180; return [glyph, angle, (100 + 68 * Math.cos(a)).toFixed(2), (100 + 68 * Math.sin(a)).toFixed(2)]; });
  return `<defs><filter id="${id}" x="-20%" y="-20%" width="140%" height="140%" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="3.2"/><feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -6"/></filter></defs><g filter="url(#${id})" fill="${disc}">${spots.map(([, , x, y]) => `<circle cx="${x}" cy="${y}" r="23"/>`).join("")}</g>${spots.map(([glyph, , x, y]) => (glyph ? "" : `<circle cx="${x}" cy="${y}" r="10" fill="${dot}"/>`)).join("")}` +
    spots.map(([glyph, angle, x, y]) => (glyph ? `<text x="${x}" y="${(Number(y) + 9.6).toFixed(2)}" text-anchor="middle" font-family="Newsreader, serif" font-weight="500" font-size="29" fill="${letter}" transform="rotate(${angle < 0 ? angle + 90 : angle - 90} ${x} ${y})">${glyph}</text>` : "")).join("");
};
document.getElementById("ring").innerHTML = ring("#0b0b0c", "#fff", "#2440ff");
document.getElementById("ring2").innerHTML = ring("#fff", "#0b0b0c", "#2440ff");

// Sections appear as they come into view.
const blocks = document.querySelectorAll(".reveal");
if (still) blocks.forEach((block) => block.classList.add("in"));
else {
  const seen = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add("in"); }), // On the tour a section starts to appear before the page reaches it, so no moment of the tour shows an empty screen.
    tour ? { rootMargin: "0px 0px 500px 0px", threshold: 0 } : { threshold: 0.12 });
  blocks.forEach((block) => seen.observe(block));
}

// The tour: glide to each stop, rest there, and after the last one glide back to the top.
if (tour) {
  const stops = [".hero", ".how", ".band", ".templates", ".pricing", ".faq", ".end"].map((name) => document.querySelector(name));
  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const glide = (to, ms) => new Promise((done) => {
    const from = scrollY, start = performance.now();
    const step = (now) => { const t = Math.min(1, (now - start) / ms); scrollTo(0, from + (to - from) * ease(t)); t < 1 ? requestAnimationFrame(step) : done(); };
    requestAnimationFrame(step);
  });
  const rest = (ms) => new Promise((done) => setTimeout(done, ms));
  (async () => {
    for (;;) for (const stop of stops) {
      const top = Math.min(stop.offsetTop - (stop === stops[0] ? 0 : 60), document.documentElement.scrollHeight - innerHeight);
      await glide(top, stop === stops[0] ? 2600 : 1700);
      await rest(2400);
    }
  })();
}
