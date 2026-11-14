// Brand imagery and slide 1.1. Loaded before brand.js, which supplies lock() and mark() by the time these run.

// ---------- Imagery: every picture background in the section comes from art() ----------
const GRAIN = '<i class="grain"></i>';
const PAPER = '<i class="ptex"></i>'; // the tooth of card stock, laid over a whole card
// big = "tall" draws them for the tall 1.1 frame, so the waves keep their shape and size there.
// big = true draws waves at full slide resolution; small tiles do not need it.
const streak = (name, axis) => `<canvas class="streak ${axis}" data-streak="nature/${name}.jpg" width="800" height="600"></canvas>`;
// A photograph in the brand's look: black and white under a Signal tint, with grain. at = which part of it to keep in view.
// The photos are CC0 pictures from Wikimedia Commons (Unsplash donations).
const photo = (name, at = "50% 50%", deep = false) => `<div class="art"><img class="pphoto" src="photo/${name}.jpg" alt="" style="object-position:${at}"><i class="tint ${deep ? "deep" : ""}"></i>${GRAIN}</div>`;
function art(kind, big = false) {
  const size = big === "tall" ? 'width="1600" height="2416"' : big ? 'width="1600" height="1200"' : 'width="800" height="600"';
  const body = {
    blue: '<div class="bg blue"></div>',
    mist: '<div class="bg mistbg"></div>',
    wheat: streak("wheat", "down"),
    lavender: streak("lavender", "down"),
    forest: streak("forest", "across"),
    ripples: `<canvas class="bg" data-wave="ripples" ${size}></canvas>`,
    marble: `<canvas class="bg" data-wave="marble" ${size}></canvas>`,
  }[kind];
  return `<div class="art">${body}${GRAIN}</div>`;
}

// Nature pictures: each photo is blurred along one axis, once, into a small canvas, so it becomes streaks of its
// colours. Baking it (instead of a live CSS filter) keeps the page from redrawing a heavy blur.
// reach = how far the blur spreads, in px of the w x h picture.
function streakPixels(photo, w, h, down, reach = 43) {
  const ctx = Object.assign(document.createElement("canvas"), { width: w, height: h }).getContext("2d", { willReadFrequently: true });
  const zoom = Math.max(w / photo.naturalWidth, h / photo.naturalHeight), pw = photo.naturalWidth * zoom, ph = photo.naturalHeight * zoom;
  ctx.drawImage(photo, (w - pw) / 2, (h - ph) / 2, pw, ph);
  const image = ctx.getImageData(0, 0, w, h), px = image.data;
  // Three box blurs in a row are close to a Gaussian blur.
  const length = down ? h : w, lines = down ? w : h, step = down ? w * 4 : 4, line = new Float32Array(length);
  for (let pass = 0; pass < 3; pass++) for (let l = 0; l < lines; l++) for (let c = 0; c < 3; c++) {
    const start = (down ? l * 4 : l * w * 4) + c;
    for (let i = 0; i < length; i++) line[i] = px[start + i * step];
    let sum = 0;
    for (let i = -reach; i <= reach; i++) sum += line[Math.min(Math.max(i, 0), length - 1)];
    for (let i = 0; i < length; i++) {
      px[start + i * step] = sum / (reach * 2 + 1);
      sum += line[Math.min(i + reach + 1, length - 1)] - line[Math.max(i - reach, 0)];
    }
  }
  for (let i = 0; i < px.length; i += 4) { // a little more colour
    const grey = 0.2126 * px[i] + 0.7152 * px[i + 1] + 0.0722 * px[i + 2];
    for (let c = 0; c < 3; c++) px[i + c] = grey + (px[i + c] - grey) * 1.35;
  }
  return image;
}
function drawStreaks() {
  const done = {};
  document.querySelectorAll("canvas[data-streak]").forEach((canvas) => {
    const down = canvas.classList.contains("down"), key = canvas.dataset.streak + down;
    done[key] ??= new Promise((resolve) => {
      const photo = new Image();
      photo.onload = () => resolve(streakPixels(photo, 800, 600, down));
      photo.src = canvas.dataset.streak;
    });
    done[key].then((image) => canvas.getContext("2d").putImageData(image, 0, 0));
  });
}

// Sound drawn as waves: rings from three sources crossing each other ("ripples"), or one wave folded like liquid ("marble").
// size stretches the waves, seed moves them somewhere else, tone picks the colours: a name from WAVE_TONES or four
// [r, g, b] colours of your own, dark to light. The defaults are the brand pictures.
const WAVE_TONES = {
  night: [[6, 9, 20], [24, 31, 54], [58, 70, 104], [104, 120, 164]],
  signal: [[38, 47, 76], [70, 84, 122], [91, 107, 147], [160, 175, 214]],
  mist: [[143, 160, 204], [176, 190, 226], [205, 214, 236], [240, 243, 250]],
};
function wavePixels(kind, w, h, { size = 1, seed = 0, tone = "night" } = {}) {
  const stops = WAVE_TONES[tone] ?? tone, image = new ImageData(w, h);
  const k = (w / 800) * size; // the wave lengths below were tuned on an 800 px wide canvas
  const spot = (n) => { const x = Math.sin(seed * 91.7 + n * 37.3) * 43758.5453; return x - Math.floor(x); }; // a fixed "random" number per seed
  const sources = seed ? [0, 1, 2].map((n) => [spot(n) * 900 - 50, spot(n + 5) * 700 - 50]) : [[592, 120], [128, 528], [816, 570]];
  for (let py = 0; py < h; py++) for (let px = 0; px < w; px++) {
    const x = px / k, y = py / k;
    let v;
    if (kind === "ripples") {
      const [d1, d2, d3] = sources.map(([sx, sy]) => Math.hypot(x - sx / size, y - sy / size));
      v = (Math.sin(d1 / 7) + Math.sin(d2 / 9.5) + 0.6 * Math.sin(d3 / 13)) / 2.6;
    } else {
      const wx = x + 62 * Math.sin(y / 84 + 1.3 * Math.sin(x / 118) + seed * 1.9), wy = y + 62 * Math.cos(x / 96 + 1.7 * Math.sin(y / 104) + seed * 2.3);
      v = Math.sin((wx + wy) / 46 + 2.2 * Math.sin(wx / 132 - wy / 158));
    }
    let t = v * 0.5 + 0.5;
    t = Math.min(t * t * (3 - 2 * t), 0.9999) * (stops.length - 1);
    const i = Math.floor(t), f = t - i, at = (py * w + px) * 4;
    for (let c = 0; c < 3; c++) image.data[at + c] = stops[i][c] + (stops[i + 1][c] - stops[i][c]) * f;
    image.data[at + 3] = 255;
  }
  return image;
}
function drawWaves() {
  document.querySelectorAll("canvas[data-wave]").forEach((canvas) => {
    canvas.getContext("2d").putImageData(wavePixels(canvas.dataset.wave, canvas.width, canvas.height), 0, 0);
    if ("live" in canvas.dataset) flowWaves(canvas);
  });
}
// The brand ripples, moving: each ring travels outwards from its source. The first frame is the still picture.
// To redraw the whole canvas 30 times a second, everything slow is worked out once: how far each pixel is from
// each source, a table of sine values, and a table of colours.
function flowWaves(canvas) {
  const w = canvas.width, h = canvas.height, k = w / 800, ctx = canvas.getContext("2d");
  const image = ctx.createImageData(w, h), out = new Uint32Array(image.data.buffer);
  const N = 2048, turn = Math.PI * 2, sine = Float32Array.from({ length: N }, (_, i) => Math.sin((i / N) * turn));
  // [x, y, wave length, speed in radians a second]; the same three sources as in wavePixels
  const sources = [[592, 120, 7, 1.5], [128, 528, 9.5, 1.2], [816, 570, 13, 0.9]];
  const far = sources.map(([sx, sy, length]) => {
    const steps = new Float32Array(w * h);
    for (let py = 0; py < h; py++) for (let px = 0; px < w; px++) steps[py * w + px] = (Math.hypot(px / k - sx, py / k - sy) / length / turn) * N;
    return steps;
  });
  const stops = WAVE_TONES.night, tones = new Uint32Array(1024);
  for (let i = 0; i < 1024; i++) {
    let t = i / 1023;
    t = Math.min(t * t * (3 - 2 * t), 0.9999) * (stops.length - 1);
    const at = Math.floor(t), f = t - at, [r, g, b] = [0, 1, 2].map((c) => stops[at][c] + (stops[at + 1][c] - stops[at][c]) * f);
    tones[i] = (255 << 24) | (b << 16) | (g << 8) | r;
  }
  let last = 0;
  const frame = (now) => {
    requestAnimationFrame(frame);
    if (now - last < 33 || canvas.closest(".off")) return; // 30 pictures a second; nothing while the slide is off screen
    last = now;
    const [o0, o1, o2] = sources.map((source) => (((now / 1000) * source[3]) / turn * N) % N), [f0, f1, f2] = far;
    for (let i = 0; i < out.length; i++) {
      const v = (sine[(f0[i] - o0) & 2047] + sine[(f1[i] - o1) & 2047] + 0.6 * sine[(f2[i] - o2) & 2047]) / 2.6;
      out[i] = tones[((v * 0.5 + 0.5) * 1023) | 0];
    }
    ctx.putImageData(image, 0, 0);
  };
  requestAnimationFrame(frame);
}

// ---------- Slide 1.1: the logo never moves or resizes; background and logo colour change every half second ----------
const logoLayer = () => `<div class="center">${lock(150)}</div>`;

// One scattered business card. x and y are the card centre on the 1600 x 1200 slide.
function looseCard(x, y, turn, kind) {
  const inner = {
    paper: `<div class="lc-text"><span class="dmname">${dm("ANNA", 11, 5)}${dm("LINDQVIST", 11, 5)}</span><span>Head of Customer Experience</span><span class="low">anna@ringproof.example<br>+44 20 7946 0155</span></div>`,
    dark: `<div class="center">${mark("", 300)}</div>`,
    wheat: art("wheat"),
    mist: `<div class="lc-text">${lock(64)}</div>`,
  }[kind];
  return `<div class="lcard ${kind}" style="left:${x - 560}px;top:${y - 320}px;transform:rotate(${turn}deg)">${inner}${PAPER}</div>`;
}
// Loose cards around one centred card. The tall slide (1600 x about 2415) needs more of them.
const LOOSE = [[-60, 170, -27, "paper"], [1560, 40, 23, "wheat"], [1700, 800, -15, "dark"], [60, 1090, 16, "mist"], [980, 1290, -7, "paper"], [760, -150, 9, "dark"]];
const LOOSE_TALL = [[-60, 190, -27, "paper"], [1560, 60, 23, "wheat"], [760, -150, 9, "dark"], [420, 640, 13, "mist"], [1640, 760, -16, "dark"], [-120, 1210, 8, "wheat"], [1720, 1420, 19, "paper"],
  [300, 1830, -14, "dark"], [1500, 2060, -8, "mist"], [140, 2330, 17, "paper"], [1100, 2500, 6, "wheat"]];
const scatter = (centre, tall) => `<div class="bg" style="background:#000"></div>
  ${(tall ? LOOSE_TALL : LOOSE).map((card) => looseCard(...card)).join("")}
  <div class="lcard ${centre} mid">${GRAIN}${PAPER}</div>`;

const FRAMES = [
  ["#fff", () => art("blue")],
  ["#fff", () => art("wheat")],
  ["#fff", (tall) => art("ripples", tall ? "tall" : true)],
  ["#fff", (tall) => scatter("signal", tall)],
  ["#09090b", () => art("mist")],
  ["#fff", () => art("forest")],
  ["#fff", (tall) => art("marble", tall ? "tall" : true)],
  ["#09090b", (tall) => scatter("paper", tall)],
];

// frame = 1..8 draws that frame live (the hero, and what case-shots.mjs saves as case/1.1-frame-N.webp).
// No frame plays the loop: it shows those saved pictures, so run case-shots.mjs after changing a frame.
// tall = true is the tall version that stands next to slides 1.2 and 1.3.
function logoShow(frame, tall) {
  if (!frame) return `<div class="s show"><canvas class="loop" data-frames="case/1.1-${tall ? "tall-" : ""}frame-" width="${tall ? 1280 : 1600}" height="${tall ? 1932 : 1200}"></canvas></div>`;
  const [colour, body] = FRAMES[frame - 1];
  return `<div class="s show"><div class="fr" style="color:${colour}">${body(tall)}${logoLayer()}</div></div>`;
}

// Plays every logo loop on the page. All eight pictures are decoded once, at the size they are shown, and kept in
// memory; a cut is then one fast copy onto the canvas, so nothing is drawn or loaded at the moment of the cut.
function runShow() {
  document.querySelectorAll("canvas.loop").forEach(async (canvas) => {
    const load = (n) => new Promise((resolve) => { const picture = new Image(); picture.onload = () => resolve(picture); picture.src = `${canvas.dataset.frames}${n}.webp`; });
    const pictures = await Promise.all(FRAMES.map((_, i) => load(i + 1)));
    const frames = await Promise.all(pictures.map((picture) => createImageBitmap(picture, { resizeWidth: canvas.width, resizeHeight: canvas.height, resizeQuality: "high" })));
    const ctx = canvas.getContext("2d");
    let at = 0;
    ctx.drawImage(frames[0], 0, 0);
    setInterval(() => { if (canvas.closest(".off")) return; at = (at + 1) % frames.length; ctx.drawImage(frames[at], 0, 0); }, 500);
  });
}
