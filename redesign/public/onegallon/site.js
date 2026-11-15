// Behaviour of the One Gallon website (site.html): the illustrations on the right, icons, sections that appear as they
// scroll into view, the ending, and the ?tour and ?still modes. Needs icons.js, flow.js and caustics.js.
const mode = new URLSearchParams(location.search);
const still = mode.has("still"), tour = mode.has("tour");
if (still) document.documentElement.classList.add("still");

// ---------- Logo and icons ----------
const MARK = `<svg viewBox="0 0 43.3333 21.6667"><path fill="currentColor" d="M17.3333 21.6667H0L1.88301 16.0176C3.34632 11.6277 7.45455 8.66667 12.082 8.66667H14.8999C20.1502 8.66667 24.7266 5.09346 26 0H43.3333L41.4503 5.64902C39.987 10.039 35.8788 13 31.2514 13H28.4334C23.1832 13 18.6067 16.5732 17.3333 21.6667Z"/></svg>`;
const LOGO = `<span class="logo"><i class="m1">${MARK}</i><i class="m2">${MARK}</i><b class="l1">One</b><b class="l2">Gallon</b><b class="cr">©</b></span>`;
document.querySelector(".brand").innerHTML = LOGO;
document.querySelectorAll("[data-icon]").forEach((el) => el.insertAdjacentHTML("afterbegin", icon(el.dataset.icon, 24)));

// ---------- Illustrations ----------
// One illustration for each section. Its ground is one of the brand's two moving pictures, drawn in code (flow.js,
// caustics.js) — or, once, a photograph. On it stand pieces of the app's interface that show what the section says:
// screens exported from the design, and cards drawn here in the same style where the design has no screen for it.
// The pieces are laid out in a 600 x 760 box (.art) that is scaled to fit the illustration, whatever its size.
const drawn = (kind, options) => `<canvas width="${kind === "flow" ? 360 : 640}" height="${kind === "flow" ? 440 : 780}" data-${kind}='${JSON.stringify(options)}'></canvas><i class="grain"></i>`;
const screen = (name, extra = "") => `<img class="screen" src="assets/screens/${name}.webp" ${extra} alt="" />`;
const art = (inner) => `<div class="art">${inner}</div>`;
const week = [["M", 96], ["T", 128], ["W", 128], ["T", 128], ["F", 128], ["S", 128], ["S", 64]]; // ounces a day; today is the last
const ILLUSTRATIONS = {
  // The day's screen.
  hero: drawn("flow", { set: "sky", seed: 3, count: 3 }) + art(screen("home")),
  // What the features give: a quiet reminder, the streak, and a drink added — the card fills with water that moves like
  // water (see "Water in the card" below); the sun caustics are drawn inside it. The ground behind is calm.
  features: drawn("flow", { set: "sky", seed: 7, count: 2, width: 0.3, glow: 0.5, speed: 0.6 }) + art(`
    <div class="ui note" style="left:30px;top:62px;width:540px"><i class="app">${MARK}${MARK}</i><p><b>One Gallon</b><span>now</span></p><p>24 oz behind. A glass now?</p></div>
    <div class="ui added" style="left:50px;top:214px;width:500px;height:390px">${icon("check", 28)}<b>10 oz added to your daily</b><span>118 oz left</span>
      <canvas class="src" width="500" height="390" data-caustics='{"surface":"azure","ripple":0.5,"scale":1.5}'></canvas><canvas class="water" width="500" height="390"></canvas></div>
    <div class="ui pill" style="left:186px;top:644px">${icon("flame", 24)}5 day streak</div>`),
  // The three steps of a scan, one after another on one phone.
  how: drawn("flow", { set: "deep", seed: 6, count: 2, width: 0.26 }) + art(`<div class="steps-loop">${["scan", "analyzing", "amount", "added"].map((name, i) => screen(name, `style="--i:${i}"`)).join("")}</div>`),
  // The week in numbers (a screen the design does not have, drawn in its style).
  numbers: drawn("caustics", { surface: "sky", ripple: 0.55, warmth: 0.7 }) + art(`
    <div class="ui chart" style="left:40px;top:120px;width:520px"><p><b>This week</b><span>800 oz</span></p>
      <div class="bars">${week.map(([day, oz], i) => `<div class="${i === 6 ? "today" : oz >= 128 ? "ok" : ""}"><span>${oz}</span><i style="height:${(oz / 128) * 100}%"></i><b>${day}</b></div>`).join("")}</div></div>
    <div class="ui pill dark" style="left:150px;top:604px">${icon("target", 24)}Today 64 / 128 oz</div>`),
  // The one photograph.
  pricing: `<img class="photo" src="assets/photos/smile-shaker.jpg" style="object-position:50% 22%" loading="lazy" alt="" /><i class="haze"></i><i class="grain"></i>` + art(`
    <div class="ui pill ok" style="left:136px;top:640px">${icon("check", 24)}Good job! 128 / 128 oz</div>`),
  // The settings the answers talk about (also drawn in the app's style).
  faq: drawn("flow", { set: "lilac", seed: 9, count: 4 }) + art(`
    <div class="ui settings" style="left:50px;top:104px;width:500px">
      <p><b>Daily goal</b><span class="stepper">${icon("minus", 22)}<em>128 oz</em>${icon("plus", 22)}</span></p>
      <p><b>Units</b><span class="seg"><em class="on">oz</em><em>ml</em></span></p>
      <p><b>Water</b><i class="switch on"></i></p><p><b>Coffee and tea</b><i class="switch on"></i></p><p><b>Juice</b><i class="switch"></i></p>
      <p><b>Photos kept</b><span class="mono">0</span></p>
    </div>`),
};

// Wide screens: the illustrations lie on top of each other on the right; only the one of the section in view is shown.
// Phones: every section carries its own illustration above its words.
const stage = document.querySelector(".stage");
const sections = [...document.querySelectorAll("section[data-pic]")];
stage.innerHTML = sections.map((s) => `<div class="ill frame off" data-for="${s.id}">${ILLUSTRATIONS[s.dataset.pic]}</div>`).join("");
sections.forEach((s) => s.insertAdjacentHTML("afterbegin", `<div class="ill pic frame off">${ILLUSTRATIONS[s.dataset.pic]}</div>`));
const finale = document.querySelector(".finale");
// with the water's sun caustics lying half-transparent over it.
finale.innerHTML = `<canvas width="360" height="440" data-flow='{"set":"sky","seed":3,"period":24}'></canvas><canvas class="veil" width="800" height="500" data-caustics='{"surface":"azure","ripple":0.5}'></canvas><i class="grain"></i>`;

// The 600 x 760 box of interface pieces is scaled to fit its illustration.
const fitArt = () => document.querySelectorAll(".ill").forEach((ill) => {
  const box = ill.querySelector(".art"); if (!box || !ill.clientWidth) return;
  box.style.transform = `translate(-50%, -50%) scale(${Math.min(ill.clientWidth / 600, ill.clientHeight / 760)})`;
});

// ".frame.off" is the class flow.js and caustics.js look for before redrawing: only what is on screen is drawn.
const picWatcher = new IntersectionObserver((seen) => seen.forEach(({ target, isIntersecting }) => target.classList.toggle("off", !isIntersecting)), { rootMargin: "120px" });
document.querySelectorAll(".ill.pic").forEach((pic) => picWatcher.observe(pic));
Flow.mount(document, still ? 3 : null);
Caustics.mount(document, still ? 3 : null);

// ---------- Water in the card ----------
// The surface is a row of points on springs: each is pulled back to rest and pulls its neighbours, so a push travels
// along as a wave and dies down. A drop falls every few seconds, and the pointer stirs the water where it moves.
// Under the surface the card shows the caustics picture (the hidden canvas beside it), cut to the shape of the water.
const waters = [...document.querySelectorAll(".water")].map((canvas) => {
  const N = 64, water = { canvas, ctx: canvas.getContext("2d"), y: new Float32Array(N), v: new Float32Array(N), next: 0, source: canvas.parentElement.querySelector(".src") };
  water.push = (at, force) => { for (let i = 0; i < N; i++) { const d = (i / (N - 1) - at) * 10; water.v[i] += force * Math.exp(-d * d); } };
  canvas.parentElement.addEventListener("pointermove", (event) => { const box = canvas.getBoundingClientRect(); water.push((event.clientX - box.left) / box.width, 0.9); });
  return water;
});
const drawWater = (water) => {
  const { ctx, y, canvas, source } = water, W = canvas.width, H = canvas.height, N = y.length, rest = H * 0.5;
  const surface = (shift, lift) => {
    ctx.beginPath(); ctx.moveTo(0, H); ctx.lineTo(0, rest + lift + y[shift % N]);
    for (let i = 1; i < N; i++) ctx.lineTo((i / (N - 1)) * W, rest + lift + y[(i + shift) % N]);
    ctx.lineTo(W, H); ctx.closePath();
  };
  ctx.clearRect(0, 0, W, H);
  surface(9, -12); ctx.fillStyle = "rgba(99, 159, 253, 0.38)"; ctx.fill(); // a second, paler wave behind
  ctx.save(); surface(0, 0); ctx.clip();
  ctx.fillStyle = "#639FFD"; ctx.fillRect(0, 0, W, H);
  if (source) ctx.drawImage(source, 0, 0, W, H);
  ctx.restore();
};
const stepWater = (now) => {
  requestAnimationFrame(stepWater);
  for (const water of waters) {
    if (water.canvas.closest(".frame.off") || water.canvas.offsetParent === null) continue;
    const { y, v } = water, N = y.length;
    if (now > water.next) { water.push(0.15 + Math.random() * 0.7, 7 + Math.random() * 4); water.next = now + 2400 + Math.random() * 1600; }
    for (let i = 0; i < N; i++) { v[i] += -0.02 * y[i] - 0.03 * v[i]; }
    for (let pass = 0; pass < 3; pass++) for (let i = 0; i < N; i++) {
      if (i > 0) v[i - 1] += 0.09 * (y[i] - y[i - 1]);
      if (i < N - 1) v[i + 1] += 0.09 * (y[i] - y[i + 1]);
    }
    for (let i = 0; i < N; i++) y[i] = Math.max(-70, Math.min(70, y[i] + v[i]));
    drawWater(water);
  }
};
if (still) waters.forEach((water) => { water.y.forEach((_, i) => { water.y[i] = Math.sin(i / 6) * 9; }); drawWater(water); });
else requestAnimationFrame(stepWater);

// ---------- What depends on where the page is ----------
const last = document.querySelector("#get");
let hold = false, current = null; // hold: the tour keeps the ending on screen while it jumps back to the top
const place = () => {
  // The illustration of the section that holds the middle of the screen is the one shown.
  const middle = scrollY + innerHeight / 2;
  const active = sections.filter((s) => s.offsetTop <= middle).pop() ?? sections[0];
  if (active.id !== current) {
    current = active.id;
    stage.querySelectorAll(".ill").forEach((ill) => { const on = ill.dataset.for === current; ill.classList.toggle("on", on); ill.classList.toggle("off", !on); });
  }
  // The ending fades in while the last section rises into view: nothing at a third of the way, full when it fills the screen.
  const into = (scrollY + innerHeight - last.offsetTop) / innerHeight;
  const shown = hold ? 1 : Math.min(1, Math.max(0, (into - 0.35) / 0.5));
  finale.style.opacity = shown;
  finale.classList.toggle("off", shown === 0);
  document.documentElement.classList.toggle("at-end", shown > 0.5);
};
addEventListener("scroll", place, { passive: true });
addEventListener("resize", () => { fitArt(); place(); });
fitArt();
place();

// ---------- Sections appear as they come into view ----------
const reveal = new IntersectionObserver((seen) => seen.forEach((entry) => {
  if (entry.isIntersecting) { entry.target.classList.add("in"); reveal.unobserve(entry.target); }
}), { rootMargin: "0px 0px -8% 0px" });
document.querySelectorAll(".rv").forEach((el, i) => { el.style.setProperty("--d", `${(i % 6) * 60}ms`); reveal.observe(el); });

// ---------- ?tour: the page scrolls itself, pausing at each section ----------
// It never scrolls back: at the end the whole screen is the brand's picture, the page jumps to the top behind it, and the
// picture fades away to show the first section again. So the loop has no rewind and no jump that can be seen.
if (tour) {
  document.documentElement.classList.add("tour");
  const stops = [...document.querySelectorAll("main section")];
  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const glide = (to, ms) => new Promise((done) => {
    const from = scrollY, begun = performance.now();
    const step = (now) => {
      const t = Math.min(1, Math.max(0, (now - begun) / ms));
      scrollTo(0, from + (to - from) * ease(t));
      t < 1 ? requestAnimationFrame(step) : done();
    };
    requestAnimationFrame(step);
  });
  const wait = (ms) => new Promise((done) => setTimeout(done, ms));
  (async () => {
    await wait(1300);
    for (;;) {
      for (const stop of stops.slice(1)) { await glide(Math.min(stop.offsetTop, document.documentElement.scrollHeight - innerHeight), 1000); await wait(1300); }
      await wait(700);
      hold = true; scrollTo(0, 0); place();
      await wait(250);
      finale.style.transition = "opacity 0.9s ease";
      hold = false; place();
      await wait(1000);
      finale.style.transition = "";
      await wait(1300);
    }
  })();
}
