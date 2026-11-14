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

/** Animated cover of the Ringproof case: the bars of the mark swell in a wave and the blue gradient drifts. Loops for ever. */
export function RingproofCover() {
  const shellRef = useRef(null);

  // The cover is dark enough for the white navigation, like a dark picture would be.
  useEffect(() => {
    const shell = shellRef.current;
    setInkSurface(shell, true);
    return () => setInkSurface(shell, false);
  }, []);

  return (
    <span ref={shellRef} className="media-shell is-ready">
      <div className="rp-cover" role="img" aria-label="Ringproof logo">
        <i className="rp-glow rp-glow-a" />
        <i className="rp-glow rp-glow-b" />
        <i className="rp-glow rp-glow-c" />
        <i className="rp-grain" />
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
