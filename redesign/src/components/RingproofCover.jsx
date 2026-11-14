import { useEffect, useRef } from "react";

import { setInkSurface } from "../inkSurface.js";

// The Ringproof mark: a ring of lens-shaped bars, thick in the middle and thin at the edges, on a 48 x 48 grid.
function markBars() {
  const count = 11, gap = 1.5, outer = 21, inner = 9.5;
  const raw = Array.from({ length: count }, (_, i) => 1.1 + 3.6 * Math.sin((Math.PI * i) / (count - 1)));
  const scale = (outer * 2 - gap * (count - 1)) / raw.reduce((sum, width) => sum + width, 0);
  const bars = [];
  let x = 24 - outer;
  raw.forEach((rawWidth, i) => {
    const width = rawWidth * scale, cx = x + width / 2, dx = cx - 24;
    x += width + gap;
    const half = Math.sqrt(Math.max(outer * outer - dx * dx, 0));
    const hole = Math.abs(dx) < inner ? Math.sqrt(inner * inner - dx * dx) : 0;
    const bar = (top, height) => ({ i, cx, cy: top + height / 2, rx: width / 2, ry: height / 2 });
    if (hole) bars.push(bar(24 - half, half - hole), bar(24 + hole, half - hole));
    else bars.push(bar(24 - half, half * 2));
  });
  return bars;
}
const BARS = markBars();

// The brand's "marble" picture (one wave folded like liquid, in the night colours), moving.
// The two folds turn through a full circle in LOOP seconds, so the picture comes back to where it began with no seam.
const W = 560, H = 420, LOOP = 48;
const NIGHT = [[6, 9, 20], [24, 31, 54], [58, 70, 104], [104, 120, 164]]; // dark to light
function marble(canvas) {
  const ctx = canvas.getContext("2d"), image = ctx.createImageData(W, H), out = new Uint32Array(image.data.buffer);
  const k = W / 800; // the wave lengths were tuned on an 800 px wide picture
  // The parts that never change: one number per column and per row, and a table of colours.
  const colA = new Float32Array(W), colB = new Float32Array(W), rowA = new Float32Array(H), rowB = new Float32Array(H);
  for (let px = 0; px < W; px++) { const x = px / k; colA[px] = 1.3 * Math.sin(x / 118); colB[px] = x / 96; }
  for (let py = 0; py < H; py++) { const y = py / k; rowA[py] = y / 84; rowB[py] = 1.7 * Math.sin(y / 104); }
  const tones = new Uint32Array(1024);
  for (let i = 0; i < 1024; i++) {
    let t = i / 1023;
    t = Math.min(t * t * (3 - 2 * t), 0.9999) * (NIGHT.length - 1);
    const at = Math.floor(t), f = t - at, [r, g, b] = [0, 1, 2].map((c) => NIGHT[at][c] + (NIGHT[at + 1][c] - NIGHT[at][c]) * f);
    tones[i] = (255 << 24) | (b << 16) | (g << 8) | r;
  }
  return (seconds) => {
    const turn = (seconds / LOOP) * Math.PI * 2;
    for (let py = 0, i = 0; py < H; py++) {
      const y = py / k;
      for (let px = 0; px < W; px++, i++) {
        const x = px / k;
        const wx = x + 62 * Math.sin(rowA[py] + colA[px] + turn), wy = y + 62 * Math.cos(colB[px] + rowB[py] - turn);
        const v = Math.sin((wx + wy) / 46 + 2.2 * Math.sin(wx / 132 - wy / 158));
        out[i] = tones[((v * 0.5 + 0.5) * 1023) | 0];
      }
    }
    ctx.putImageData(image, 0, 0);
  };
}

/** Animated cover of the Ringproof case: the logo on the brand's marble wave, which flows slowly, while a low wave runs through the bars of the mark. Loops for ever. */
export function RingproofCover() {
  const shellRef = useRef(null);
  const canvasRef = useRef(null);

  // The cover is dark enough for the white navigation, like a dark picture would be.
  useEffect(() => {
    const shell = shellRef.current;
    setInkSurface(shell, true);
    return () => setInkSurface(shell, false);
  }, []);

  // Draw the wave about 30 times a second, and only while the cover is on screen.
  useEffect(() => {
    const canvas = canvasRef.current, draw = marble(canvas);
    draw(0);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    let frame = 0, last = 0, seen = false;
    const tick = (now) => {
      frame = requestAnimationFrame(tick);
      if (now - last < 32) return;
      last = now;
      draw(now / 1000);
    };
    const watcher = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting === seen) return;
      seen = entry.isIntersecting;
      if (seen) frame = requestAnimationFrame(tick);
      else cancelAnimationFrame(frame);
    });
    watcher.observe(canvas);
    return () => {
      watcher.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <span ref={shellRef} className="media-shell is-ready">
      <div className="rp-cover" role="img" aria-label="Ringproof logo">
        <canvas ref={canvasRef} className="rp-wave" width={W} height={H} />
        <span className="rp-lock" aria-hidden="true">
          <svg viewBox="0 0 48 48">
            {BARS.map((bar, n) => (
              <ellipse key={n} style={{ "--i": bar.i }} cx={bar.cx.toFixed(2)} cy={bar.cy.toFixed(2)} rx={bar.rx.toFixed(2)} ry={bar.ry.toFixed(2)} />
            ))}
          </svg>
          <span>Ringproof</span>
        </span>
      </div>
    </span>
  );
}
