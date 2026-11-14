// Slides 4.5 and 4.6: single elements of the product, enlarged and moving in a loop.
// Uses dm() and GLYPHS from brand.js. case.html?only=4.5&at=6 freezes the loop at second 6 (used for exports).

GLYPHS._ = "00000 00000 00000 00000 00000 00000 00000"; // an unlit character
const liveAt = new URLSearchParams(location.search).get("at");
const liveClock = () => (liveAt === null ? performance.now() / 1000 : Number(liveAt));
const mmss = (seconds) => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
// Change an element's content only when it really changed.
const put = (el, html) => { if (el.now !== html) { el.now = html; el.innerHTML = html; } };
const part = (root, name) => root.querySelector(`[data-part="${name}"]`);

// ---------- 4.5: the result tiles count up, then the outcome lights up letter by letter ----------
const tilesSlide = () => `<div class="s live" data-live="tiles" style="background:#000">
  <div class="tile accent" style="left:110px;top:150px;width:860px;height:440px">
    <svg class="deco" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48"/><path data-part="hand" d="M50 50V8"/><path d="M50 50 76 62"/></svg>
    <small>Task outcome</small><div class="val" data-part="outcome"></div><p data-part="note"></p></div>
  <div class="tile" style="left:990px;top:150px;width:500px;height:440px">
    <small><span>Experience score</span><span>/ 10</span></small>
    <div class="val row"><svg class="meter" viewBox="0 0 100 100"><circle class="track" cx="50" cy="50" r="45.5"/><circle class="fill" data-part="ring" cx="50" cy="50" r="45.5" pathLength="100"/></svg>
      <span data-part="score"></span></div><p>5 of 6 checks passed</p></div>
  <div class="tile" style="left:110px;top:610px;width:447px;height:440px"><small>Call duration</small><div class="val" data-part="time"></div><p>Target under 6:00</p></div>
  <div class="tile" style="left:577px;top:610px;width:446px;height:440px"><small><span>Reply speed</span><span>ms</span></small><div class="val" data-part="reply"></div><p>Typical 240 ms</p></div>
  <div class="tile" style="left:1043px;top:610px;width:447px;height:440px"><small>Caller's checklist</small><div class="checks" data-part="checks">${"<i></i>".repeat(6)}</div><p data-part="count"></p></div>
</div>`;

function tickTiles(root, now) {
  const t = now % 9, p = Math.min(t / 3.2, 1), grow = p * p * (3 - 2 * p);
  const letters = Math.floor(Math.min(Math.max((t - 2.4) / 1.1, 0), 1) * 7);
  put(part(root, "outcome"), dm("BLOCKED".slice(0, letters).padEnd(7, "_"), 13, 6));
  put(part(root, "note"), letters === 7 ? "Card frozen at 03:48" : "Call in progress");
  put(part(root, "score"), dm((8.4 * grow).toFixed(1), 13, 6));
  put(part(root, "time"), dm(mmss(332 * grow), 13, 6));
  put(part(root, "reply"), dm(String(Math.round(62 * grow) * 10).padStart(3, "0"), 13, 6));
  part(root, "ring").style.strokeDasharray = `${84 * grow} 100`;
  part(root, "hand").style.transform = `rotate(${300 * grow}deg)`;
  const passed = Math.floor(grow * 5.999);
  [...part(root, "checks").children].forEach((dot, i) => { dot.className = i < passed ? "yes" : i === 5 && p === 1 ? "no" : ""; });
  put(part(root, "count"), `${passed} of 6 passed`);
}

// ---------- 4.6: the call plays; flags, checklist and transcript follow the playhead ----------
const CALL = 332; // seconds
const SPEAKS = {
  caller: [[0.02, 0.06], [0.11, 0.19], [0.235, 0.32], [0.45, 0.5], [0.63, 0.67], [0.82, 0.86], [0.95, 0.985]],
  agent: [[0.065, 0.105], [0.195, 0.23], [0.244, 0.3], [0.33, 0.445], [0.51, 0.625], [0.68, 0.815], [0.87, 0.945]],
};
const STEPS = [["Reach an agent", 4], ["Explain the problem", 31], ["Pass identity check", 130], ["Block the card", 228], ["Order a replacement", 280], ["Get a confirmation by SMS", null]];
const LINES = [
  [0, "caller", "Hi, I've lost my card and I need to block it."],
  [14, "agent", "I can help with that. Can I take your full name?"],
  [78, "caller", "It was the card ending 4417, I think I left it at…"],
  [81, "agent", "Sorry to cut in. I need your date of birth first."],
  [130, "agent", "Thank you, you're verified."],
  [228, "agent", "Done. Your card ending 4417 is now blocked."],
  [280, "agent", "A replacement will arrive in 3 to 5 working days."],
  [306, "caller", "Will I get a text to confirm?"],
  [318, "agent", "We don't send one, but the card is blocked."],
];
// 170 bars per speaker: tall while they talk, a dot while they are silent. The heights are fixed, not random.
function bars(who, seed) {
  const height = (i) => { const x = Math.sin(i * 12.9898 + seed) * 43758.5453; return 22 + 78 * (x - Math.floor(x)); };
  return Array.from({ length: 170 }, (_, i) => `<i style="height:${SPEAKS[who].some(([from, to]) => i / 169 >= from && i / 169 <= to) ? height(i).toFixed(0) : 4}%"></i>`).join("");
}
const lane = (who, seed) => `<div class="lane ${who}"><b>${who}</b><div class="bars">${bars(who, seed)}</div><div class="bars lit">${bars(who, seed)}</div></div>`;

const callSlide = () => `<div class="s live" data-live="call" style="background:#000">
  <div class="card rec" style="left:110px;top:60px;width:1380px;height:550px">
    <div class="head"><h5>Call recording</h5><span class="legend"><span><i style="background:#7b8cc0"></i>Simulated caller</span><span><i style="background:#e4e4e7"></i>Bank agent</span></span></div>
    <div class="lanes"><i class="zone" style="left:24.4%;width:5.6%"></i>${lane("caller", 1)}${lane("agent", 7)}
      <span class="flag bad" data-part="bad" style="left:24.4%">Interrupted · 01:21</span>
      <i class="goodline" data-part="line" style="left:68.7%"></i><span class="flag good" data-part="good" style="left:68.7%">Card blocked · 03:48</span>
      <i class="playhead"></i></div>
    <div class="transport"><span class="pause"></span><span data-part="clock"></span><span class="progress"><i></i></span><span>1.0×</span></div>
  </div>
  <div class="card" style="left:110px;top:630px;width:680px;height:500px">
    <div class="head"><h5>Caller's checklist</h5><span class="mono" data-part="done"></span></div>
    <div class="rows" data-part="rows">${STEPS.map(([name, at]) => `<div><i></i><span>${name}</span><em>${at === null ? "—" : "0" + mmss(at)}</em></div>`).join("")}</div>
  </div>
  <div class="card" style="left:810px;top:630px;width:680px;height:500px">
    <div class="head"><h5>Transcript</h5><span class="mono">Live</span></div>
    <div class="say" data-part="say"></div>
  </div>
</div>`;

function tickCall(root, now) {
  const p = Math.min((now % 13) / 10.5, 1), s = CALL * p;
  root.style.setProperty("--p", `${(p * 100).toFixed(2)}%`);
  part(root, "bad").classList.toggle("on", p >= 0.244);
  part(root, "good").classList.toggle("on", p >= 0.687);
  part(root, "line").classList.toggle("on", p >= 0.687);
  put(part(root, "clock"), `0${mmss(s)} / 05:32`);
  let done = 0;
  [...part(root, "rows").children].forEach((row, i) => {
    const at = STEPS[i][1], yes = at !== null && s >= at;
    done += yes;
    row.className = yes ? "yes" : at === null && p === 1 ? "no" : "";
  });
  put(part(root, "done"), `${done} / 6`);
  put(part(root, "say"), LINES.filter(([at]) => at <= s).slice(-3).map(([, who, text]) => `<div class="${who}">${text}</div>`).join(""));
}

const LIVE_SLIDES = { "4.5": tilesSlide, "4.6": callSlide };
// Call once after the slides are on the page.
function runLive() {
  const tiles = [...document.querySelectorAll('[data-live="tiles"]')], calls = [...document.querySelectorAll('[data-live="call"]')];
  if (!tiles.length && !calls.length) return;
  const frame = () => {
    const now = liveClock();
    const seen = (root) => !root.closest(".off"); // off-screen slides are skipped
    tiles.filter(seen).forEach((root) => tickTiles(root, now));
    calls.filter(seen).forEach((root) => tickCall(root, now));
    if (liveAt === null) requestAnimationFrame(frame);
  };
  frame();
}
