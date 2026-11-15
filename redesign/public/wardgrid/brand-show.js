// Wardgrid brand kit, shared by every page of the case (case, deck, site, app).
//   WG.mark(size)            the logo mark as an inline SVG, drawn in currentColor
//   WG.logo(size)            mark + wordmark on one line (the name never breaks)
//   WG.ic(name)              a Lucide icon placeholder; WG.icons() turns placeholders into SVGs
//   <canvas class="pic" data-set="blue" data-field="blobs" data-cell="24" data-live></canvas>
//                            a brand picture made of roster cells; WG.pictures() starts every one on the page
//   data-clear=".selector"    elements (inside the canvas's parent) that the cells must keep clear of, so that
//                            text laid over a picture stays readable; data-hole="x,y,w,h" does the same by numbers
// Pictures loop without a seam (every phase turns whole circles in LOOP seconds) and stand still when
// their slide is off screen, when the page is frozen (?at=) or when the visitor asked for less motion.
(() => {
  // ---------- The mark: a cross of five roster cells that melt into each other, the middle one still open ----------
  // One arm is written by hand on a 96 x 96 grid; the other three are the same points turned by 90 degrees.
  const turn = ([x, y], times) => { for (let i = 0; i < times; i++) [x, y] = [96 - y, x]; return [x, y]; };
  const ARM = [["C", [40, 28], [36, 27.5], [36, 21]], ["L", [36, 13.5]], ["A", [43.5, 6]], ["L", [52.5, 6]], ["A", [60, 13.5]], ["L", [60, 21]], ["C", [60, 27.5], [56, 28], [56, 33]], ["C", [56, 37], [59, 40], [63, 40]]];
  const fmt = (point) => point.map((n) => +n.toFixed(2)).join(" ");
  let outline = `M${fmt([40, 33])}`;
  for (let k = 0; k < 4; k++) for (const [cmd, ...points] of ARM) outline += cmd === "A" ? `A7.5 7.5 0 0 1 ${fmt(turn(points[0], k))}` : `${cmd}${points.map((p) => fmt(turn(p, k))).join(" ")}`;
  const HOLE = "M46.5 42h3a4.5 4.5 0 0 1 4.5 4.5v3a4.5 4.5 0 0 1-4.5 4.5h-3a4.5 4.5 0 0 1-4.5-4.5v-3a4.5 4.5 0 0 1 4.5-4.5z";
  const MARK_D = `${outline}Z${HOLE}`;

  const mark = (size = 96, extra = "") => `<svg class="wg-mark" width="${size}" height="${size}" viewBox="0 0 96 96" fill="currentColor" aria-hidden="true" ${extra}><path fill-rule="evenodd" d="${MARK_D}"/></svg>`;
  const logo = (size = 32) => `<span class="wg-logo" style="font-size:${size}px">${mark(size * 1.12)}<b>Wardgrid</b></span>`;
  const ic = (name, size = 20) => `<i data-lucide="${name}" style="width:${size}px;height:${size}px"></i>`;
  const icons = () => window.lucide && window.lucide.createIcons({ attrs: { "stroke-width": 1.75 } });

  // ---------- Pictures made of cells ----------
  const SETS = {
    blue: { bg: "#1d3be3", fg: "#f1f2f6", soft: "rgba(241,242,246,0.55)" },
    paper: { bg: "#f1f2f6", fg: "#1d3be3", soft: "rgba(29,59,227,0.5)" },
    lilac: { bg: "#cbc6ff", fg: "#1d3be3", soft: "rgba(29,59,227,0.55)" },
    ink: { bg: "#05060f", fg: "#3d5bff", soft: "rgba(93,120,255,0.6)" },
    night: { bg: "#0a1463", fg: "#cbc6ff", soft: "rgba(203,198,255,0.5)" },
    clear: { bg: null, fg: "#f1f2f6", soft: "rgba(241,242,246,0.5)" },
  };
  const LOOP = 48; // seconds for a picture to come round
  const hash = (x, y, seed) => { const n = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453; return n - Math.floor(n); };
  const markShape = new Path2D(MARK_D);
  const probe = document.createElement("canvas").getContext("2d");

  // How "covered" a place is, 0..1. u runs across (0..aspect), v down (0..1), p is the loop phase (0..2π).
  const FIELDS = {
    blobs: (u, v, p) => 0.5 + 0.5 * Math.sin(3.3 * u + 1.6 * Math.sin(2.4 * v + p) + p) * Math.cos(2.9 * v + 1.3 * Math.sin(2.1 * u - p)),
    wave: (u, v, p) => 0.5 + 0.5 * Math.sin(5.2 * v + 1.9 * Math.sin(1.7 * u + p) - 2.2 * u * 0.4 + p * 2),
    rise: (u, v, p) => Math.min(1, Math.max(0, v * 1.25 - 0.18 + 0.2 * Math.sin(3.1 * u + p) + 0.1 * Math.sin(7.3 * u - 2 * p))),
    // The logo itself, its edge breathing a little.
    mark: (u, v, p, aspect) => {
      const size = 0.74, x = (u - aspect / 2) / size * 96 + 48, y = (v - 0.5) / size * 96 + 48;
      const inside = probe.isPointInPath(markShape, x, y, "evenodd");
      const grain = 0.5 + 0.5 * Math.sin(5.1 * u + 1.4 * Math.sin(3.3 * v + p)) * Math.cos(4.3 * v - 1.2 * Math.sin(2.7 * u - p));
      return inside ? 0.6 + 0.4 * grain : 0.2 + 0.34 * grain;
    },
  };

  function drawPicture(canvas, seconds) {
    const set = SETS[canvas.dataset.set || "blue"], field = FIELDS[canvas.dataset.field || "blobs"];
    const cell = Number(canvas.dataset.cell || 24), seed = Number(canvas.dataset.seed || 1), level = Number(canvas.dataset.level || 0.5);
    const w = canvas.clientWidth, h = canvas.clientHeight, ratio = Number(canvas.dataset.ratio || 1.5);
    if (!w || !h) return;
    if (canvas.width !== Math.round(w * ratio)) { canvas.width = Math.round(w * ratio); canvas.height = Math.round(h * ratio); }
    const ctx = canvas.getContext("2d");
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    if (set.bg) { ctx.fillStyle = set.bg; ctx.fillRect(0, 0, w, h); } else ctx.clearRect(0, 0, w, h);
    const cols = Math.ceil(w / cell), rows = Math.ceil(h / cell), phase = (seconds / LOOP) * Math.PI * 2, aspect = w / h;
    const gap = Math.max(1, cell * 0.09), side = cell - gap * 2, round = side * 0.3;
    ctx.lineWidth = Math.max(1, cell * 0.085);
    // data-hole="x,y,w,h" (px): a zone left empty, so a logo placed there stays readable.
    const holes = canvas.dataset.hole ? [canvas.dataset.hole.split(",").map(Number)] : [];
    if (canvas.dataset.clear) {
      // Where those elements are, in the canvas's own pixels (a slide may be scaled, so measure and divide).
      const box = canvas.getBoundingClientRect(), k = box.width / w || 1, pad = Number(canvas.dataset.clearPad || 22);
      canvas.parentElement.querySelectorAll(canvas.dataset.clear).forEach((item) => { const r = item.getBoundingClientRect(); if (r.width) holes.push([(r.left - box.left) / k - pad, (r.top - box.top) / k - pad, r.width / k + pad * 2, r.height / k + pad * 2]); });
    }
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const value = field(((c + 0.5) * cell) / h, ((r + 0.5) * cell) / h, phase, aspect) + (hash(c, r, seed) - 0.5) * 0.2;
      const x = c * cell + gap, y = r * cell + gap;
      if (holes.some((hole) => x + side > hole[0] && x < hole[0] + hole[2] && y + side > hole[1] && y < hole[1] + hole[3])) continue;
      if (value > level + 0.1) { ctx.fillStyle = set.fg; ctx.beginPath(); ctx.roundRect(x, y, side, side, round); ctx.fill(); }          // covered
      else if (value > level) { ctx.strokeStyle = set.fg; ctx.beginPath(); ctx.roundRect(x + ctx.lineWidth / 2, y + ctx.lineWidth / 2, side - ctx.lineWidth, side - ctx.lineWidth, round); ctx.stroke(); } // open
      else if (value > level - 0.07) { ctx.strokeStyle = set.soft; ctx.beginPath(); const m = side * 0.3; ctx.moveTo(x + m, y + m); ctx.lineTo(x + side - m, y + side - m); ctx.moveTo(x + side - m, y + m); ctx.lineTo(x + m, y + side - m); ctx.stroke(); } // conflict
      else if (canvas.dataset.dots !== "off") { ctx.fillStyle = set.soft; ctx.globalAlpha = 0.45; ctx.beginPath(); ctx.arc(x + side / 2, y + side / 2, Math.max(0.8, cell * 0.05), 0, 7); ctx.fill(); ctx.globalAlpha = 1; }
    }
  }

  // ---------- The mesh gradient: the brand's soft picture ----------
  // Eight points of colour, each a soft light; every pixel is their blend, weighted by distance. Drawn small
  // (200 x 150) and stretched, which is what keeps it smooth. With data-live the points drift in slow circles.
  //   <canvas class="mesh" data-live></canvas>
  const MESH = [ // [x, y, colour, strength, reach, circle it drifts in, turns per loop]
    [0.12, 0.1, [112, 136, 255], 1.1, 0.28, 0.07, 1],
    [0.9, 0.12, [6, 10, 70], 1.4, 0.3, 0.06, -1],
    [0.02, 1.0, [241, 242, 246], 1.3, 0.26, 0.05, 1],
    [0.5, 0.55, [29, 59, 227], 1.2, 0.34, 0.08, -1],
    [1.0, 0.95, [203, 198, 255], 1.3, 0.28, 0.06, 2],
    [0.42, 0.0, [29, 59, 227], 0.9, 0.26, 0.05, -2],
    [0.74, 0.62, [10, 20, 120], 1.0, 0.22, 0.07, 1],
    [0.3, 0.72, [72, 98, 250], 0.9, 0.22, 0.06, -1],
  ];
  function drawMesh(canvas, seconds) {
    const W = 200, H = 150;
    if (canvas.width !== W) { canvas.width = W; canvas.height = H; }
    const ctx = canvas.getContext("2d"), image = ctx.createImageData(W, H), data = image.data, turn = (seconds / LOOP) * Math.PI * 2, aspect = W / H;
    const points = MESH.map(([x, y, colour, strength, reach, circle, turns], i) => [(x + circle * Math.cos(turn * turns + i)) * aspect, y + circle * Math.sin(turn * turns + i), colour, strength, 1 / (2 * reach * reach)]);
    for (let py = 0, at = 0; py < H; py++) for (let px = 0; px < W; px++, at += 4) {
      const u = (px / W) * aspect, v = py / H;
      let r = 0, g = 0, b = 0, sum = 0;
      for (const [x, y, colour, strength, fall] of points) { const w = strength * Math.exp(-((u - x) ** 2 + (v - y) ** 2) * fall); r += colour[0] * w; g += colour[1] * w; b += colour[2] * w; sum += w; }
      data[at] = r / sum; data[at + 1] = g / sum; data[at + 2] = b / sum; data[at + 3] = 255;
    }
    ctx.putImageData(image, 0, 0);
  }

  const query = new URLSearchParams(location.search);
  const frozenAt = query.get("at") === null ? null : Number(query.get("at"));
  const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const live = new Set();
  let running = false, last = 0;
  const tick = (now) => {
    if (now - last > 110 && !window.WG.paused && !document.hidden) { // about 9 pictures a second is plenty for cells that flip slowly
      last = now;
      for (const canvas of live) if (canvas.isConnected && !canvas.closest(".off")) (canvas.classList.contains("mesh") ? drawMesh : drawPicture)(canvas, now / 1000 + Number(canvas.dataset.shift || 0));
    }
    requestAnimationFrame(tick);
  };
  function pictures(root = document) {
    root.querySelectorAll("canvas.pic, canvas.mesh").forEach((canvas) => {
      (canvas.classList.contains("mesh") ? drawMesh : drawPicture)(canvas, (frozenAt ?? 0) + Number(canvas.dataset.shift || 0));
      if (canvas.hasAttribute("data-live") && frozenAt === null && !calm) live.add(canvas);
    });
    if (live.size && !running) { running = true; requestAnimationFrame(tick); }
  }

  window.WG = { mark, logo, ic, icons, pictures, drawPicture, SETS, MARK_D, paused: false };
  // A page shown in a frame of the case is told to stand still while its slide is off screen (see case.js).
  addEventListener("message", (event) => { if (event.data && event.data.wg) window.WG.paused = event.data.wg === "pause"; });
})();
