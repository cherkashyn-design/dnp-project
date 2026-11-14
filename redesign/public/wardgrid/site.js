// The Wardgrid website: logos, icons, pictures, sections that appear on scroll, and the self-scrolling tour.
//   ?still            every section visible at once (for pictures)
//   ?still&go=pricing jump to the section with that id
//   ?tour             scroll through the page by itself, pausing at each section, then return to the top
//   ?tour&at=9        the tour frozen at second 9;  &lead=7 starts the tour 7 seconds in (for a second frame of it)
(() => {
  const query = new URLSearchParams(location.search);
  document.querySelectorAll("[data-logo]").forEach((box) => { box.innerHTML = WG.logo(Number(box.dataset.logo)); });
  WG.icons();
  WG.pictures();

  const still = query.has("still"), tour = query.has("tour");
  const HEAD = innerWidth > 760 ? 82 : 68; // room for the fixed header above a section
  const reveal = [...document.querySelectorAll(".rv")];
  if (still) { document.documentElement.classList.add("still"); reveal.forEach((item) => item.classList.add("in")); }
  else {
    const watcher = new IntersectionObserver((seen) => seen.forEach((entry) => entry.isIntersecting && entry.target.classList.add("in")), { rootMargin: "0px 0px -8% 0px" });
    reveal.forEach((item) => watcher.observe(item));
  }
  if (query.get("go")) { const target = document.getElementById(query.get("go")); if (target) scrollTo(0, Math.max(0, target.offsetTop - HEAD)); }
  if (!tour) return;

  // The tour: hold at each section, glide to the next, and after the footer glide back to the top.
  document.documentElement.classList.add("touring");
  const HOLD = 2.6, MOVE = 1.5, BACK = 2.4;
  const stops = () => [...document.querySelectorAll("main > section, footer")].map((part, i, all) => (i === all.length - 1 ? document.documentElement.scrollHeight - innerHeight : Math.min(i ? part.offsetTop - HEAD : 0, document.documentElement.scrollHeight - innerHeight)));
  const ease = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
  const place = (seconds) => {
    const at = stops(), total = at.length * HOLD + (at.length - 1) * MOVE + BACK;
    let t = ((seconds % total) + total) % total;
    for (let i = 0; i < at.length; i++) {
      if (t < HOLD) return at[i];
      t -= HOLD;
      const next = i === at.length - 1 ? [at[0], BACK] : [at[i + 1], MOVE];
      if (t < next[1]) return at[i] + (next[0] - at[i]) * ease(t / next[1]);
      t -= next[1];
    }
    return 0;
  };
  const lead = Number(query.get("lead") || 0), frozen = query.get("at");
  const go = (seconds) => scrollTo(0, place(seconds + lead));
  if (frozen !== null) { reveal.forEach((item) => item.classList.add("in")); addEventListener("load", () => go(Number(frozen))); go(Number(frozen)); return; }
  let clock = 0, before = performance.now(); // the tour's own clock: it stops while the page is told to stand still
  const frame = (now) => { if (!WG.paused) { clock += Math.min(100, now - before); go(clock / 1000); } before = now; requestAnimationFrame(frame); };
  requestAnimationFrame(frame);
})();
