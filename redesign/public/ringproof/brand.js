// Ringproof brand slides. brand.html shows them in the DNP case layout; brand.html?only=1.4 shows one slide at 1600 x 1200;
// brand.html?only=1.1&f=3 shows one frame of the logo slideshow.

// ---------- Building blocks ----------
let uid = 0;
const n2 = (value) => +value.toFixed(2);

// The mark: a ring of lens-shaped bars, thick in the middle and thin at the edges.
function mark(cls = "", size = 0) {
  const count = 11, gap = 1.5, outer = 21, inner = 9.5;
  const raw = Array.from({ length: count }, (_, i) => 1.1 + 3.6 * Math.sin((Math.PI * i) / (count - 1)));
  const scale = (outer * 2 - gap * (count - 1)) / raw.reduce((sum, w) => sum + w, 0);
  let x = 24 - outer, out = "";
  raw.forEach((rawWidth, i) => {
    const w = rawWidth * scale, cx = x + w / 2, dx = cx - 24;
    x += w + gap;
    const h = Math.sqrt(Math.max(outer * outer - dx * dx, 0));
    const hole = Math.abs(dx) < inner ? Math.sqrt(inner * inner - dx * dx) : 0;
    const lens = (y, height) => `<ellipse style="--i:${i}" cx="${n2(cx)}" cy="${n2(y + height / 2)}" rx="${n2(w / 2)}" ry="${n2(height / 2)}"/>`;
    out += hole ? lens(24 - h, h - hole) + lens(24 + hole, h - hole) : lens(24 - h, h * 2);
  });
  return `<svg class="mark ${cls}" viewBox="0 0 48 48" fill="currentColor"${size ? ` style="width:${size}px;height:${size}px"` : ""}>${out}</svg>`;
}
const lock = (size, live = false) => `<span class="lock" style="font-size:${size}px">${mark(live ? "live" : "")}<span class="${live ? "rise" : ""}">Ringproof</span></span>`;

// Dot-matrix numerals, the same 5x7 glyphs the product uses.
const GLYPHS = {
  "0": "01110 10001 10011 10101 11001 10001 01110", "1": "00100 01100 00100 00100 00100 00100 01110",
  "2": "01110 10001 00001 00010 00100 01000 11111", "3": "11110 00001 00001 01110 00001 00001 11110",
  "4": "00010 00110 01010 10010 11111 00010 00010", "5": "11111 10000 11110 00001 00001 10001 01110",
  "6": "00110 01000 10000 11110 10001 10001 01110", "7": "11111 00001 00010 00100 01000 01000 01000",
  "8": "01110 10001 10001 01110 10001 10001 01110", "9": "01110 10001 10001 01111 00001 00010 01100",
  ":": "0 0 1 0 1 0 0", ".": "0 0 0 0 0 0 1", "%": "11001 11010 00010 00100 01000 01011 10011",
  A: "01110 10001 10001 11111 10001 10001 10001", B: "11110 10001 10001 11110 10001 10001 11110",
  C: "01110 10001 10000 10000 10000 10001 01110", D: "11110 10001 10001 10001 10001 10001 11110",
  E: "11111 10000 10000 11110 10000 10000 11111", F: "11111 10000 10000 11110 10000 10000 10000",
  G: "01110 10001 10000 10111 10001 10001 01111", H: "10001 10001 10001 11111 10001 10001 10001",
  I: "01110 00100 00100 00100 00100 00100 01110", J: "00111 00010 00010 00010 00010 10010 01100",
  K: "10001 10010 10100 11000 10100 10010 10001", L: "10000 10000 10000 10000 10000 10000 11111",
  M: "10001 11011 10101 10101 10001 10001 10001", N: "10001 11001 10101 10011 10001 10001 10001",
  O: "01110 10001 10001 10001 10001 10001 01110", P: "11110 10001 10001 11110 10000 10000 10000",
  Q: "01110 10001 10001 10001 10101 10010 01101", R: "11110 10001 10001 11110 10100 10010 10001",
  S: "01111 10000 10000 01110 00001 00001 11110", T: "11111 00100 00100 00100 00100 00100 00100",
  U: "10001 10001 10001 10001 10001 10001 01110", V: "10001 10001 10001 10001 10001 01010 00100",
  W: "10001 10001 10001 10101 10101 11011 10001", X: "10001 10001 01010 00100 01010 10001 10001",
  Y: "10001 10001 01010 00100 00100 00100 00100", Z: "11111 00001 00010 00100 01000 10000 11111",
  " ": "000 000 000 000 000 000 000", "/": "00001 00001 00010 00100 01000 10000 10000",
};
function dm(text, dot, gap) {
  const glyphs = [...text].map((ch) => {
    const rows = GLYPHS[ch].split(" ");
    return `<span class="gl" style="grid-template-columns:repeat(${rows[0].length},var(--d))">${rows.join("").split("").map((bit) => `<i class="${bit === "1" ? "on" : ""}"></i>`).join("")}</span>`;
  });
  return `<span class="dm" style="--d:${dot}px;--g:${gap}px">${glyphs.join("")}</span>`;
}

// A row of lenses whose width swells towards the middle.
function lenses(count, maxWidth, style) {
  const items = Array.from({ length: count }, (_, i) => `<i style="width:${n2(maxWidth * (0.12 + 0.88 * Math.sin((Math.PI * i) / (count - 1))))}px;height:100%"></i>`);
  return `<div class="lenses" style="${style}">${items.join("")}</div>`;
}
// Icons start as the lens bars of the mark, seen through the icon's silhouette, then the bars swell
// until they merge into a plain solid icon. White in the mask shows, black hides.
// The mask has a fixed size, larger than the icon: sized from the moving bars, its edge would cross the icon as stray lines.
function icon(maskBody, order) {
  const id = `m${++uid}`, gap = 1.6, widths = Array.from({ length: 9 }, (_, i) => 1.6 + 2.6 * Math.sin((Math.PI * i) / 8));
  const scale = (46 - 8 * gap) / widths.reduce((sum, w) => sum + w, 0);
  let x = 1, bars = "";
  for (const raw of widths) { const w = raw * scale; bars += `<ellipse class="ib" style="--r:${n2(w / 2)}px" cx="${n2(x + w / 2)}" cy="24" rx="${n2(w / 2)}" ry="27"/>`; x += w + gap; }
  return `<svg class="ic" style="--i:${order}" viewBox="0 0 48 48"><mask id="${id}" maskUnits="userSpaceOnUse" x="-8" y="-8" width="64" height="64"><g fill="#fff" stroke-linecap="round" stroke-linejoin="round">${maskBody}</g></mask><g mask="url(#${id})" fill="currentColor">${bars}</g></svg>`;
}
const cut = 'fill="none" stroke="#000" stroke-width="4.5"';
const ICONS = [
  ["Call", '<path d="M13 3h22a4 4 0 0 1 4 4v34a4 4 0 0 1-4 4H13a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4Z"/><rect x="18" y="36" width="12" height="3.500" rx="1.700" fill="#000"/>'],
  ["Chat", '<rect x="3" y="6" width="42" height="29" rx="9"/><path d="M12 33v11l12-11Z"/>'],
  ["Passed", `<circle cx="24" cy="24" r="22"/><path ${cut} d="m13 25 8 8 15-17"/>`],
  ["Secure", '<path d="M24 2 43 8v14c0 11.500-8 19.500-19 24C13 41.500 5 33.500 5 22V8Z"/>'],
  ["Card", '<rect x="2" y="8" width="44" height="32" rx="6"/><rect x="2" y="16" width="44" height="6" fill="#000"/>'],
  ["Duration", `<circle cx="24" cy="24" r="22"/><path ${cut} d="M24 11v14l9 6"/>`],
  ["Locked", '<rect x="6" y="20" width="36" height="26" rx="6"/><path fill="none" stroke="#fff" stroke-width="6" d="M14 22v-7a10 10 0 0 1 20 0v7"/><circle cx="24" cy="33" r="4" fill="#000"/>'],
  ["Metrics", '<rect x="3" y="26" width="12" height="20" rx="3"/><rect x="18" y="14" width="12" height="32" rx="3"/><rect x="33" y="2" width="12" height="44" rx="3"/>'],
  ["Run", '<path stroke="#fff" stroke-width="6" d="M11 7 41 24 11 41Z"/>'],
  ["Caller", '<circle cx="24" cy="14" r="11"/><path d="M3 47c0-12 9-19 21-19s21 7 21 19Z"/>'],
  ["Alert", '<path d="M24 3c-9 0-14 7-14 15v9l-6 9h40l-6-9v-9c0-8-5-15-14-15Z"/><circle cx="24" cy="42" r="5"/>'],
  ["Scenario", '<circle cx="24" cy="24" r="22"/><circle cx="24" cy="24" r="15" fill="#000"/><circle cx="24" cy="24" r="8"/>'],
];

// Tick and cross from Lucide (lucide.dev, ISC licence), copied unchanged.
const LUCIDE_CHECK = '<svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg>', LUCIDE_X = '<svg viewBox="0 0 24 24"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>';

// ---------- Slides ----------
const tag = (pos, text) => `<span class="tag ${pos}">${text}</span>`;
const SLIDES = {
  "1.1": (frame, tall) => logoShow(frame, tall),

  "1.2": () => {
    const sw = (name, hex, flex, dark) => `<div style="background:${hex};flex:${flex};color:${dark ? "var(--ink)" : "#fafafa"}"><b>${name}</b><span>${hex.toUpperCase()}</span></div>`;
    return `<div class="s"><div class="swatches">
      ${sw("Ink", "#09090b", 1)}${sw("Graphite", "#18181b", 1)}${sw("Signal", "#5b6b93", 2.4)}${sw("Mist", "#c3cde6", 1, true)}${sw("Stone", "#b4b2a8", 1, true)}${sw("Paper", "#f4f4f2", 1, true)}
    </div><div class="grad">
      <div style="flex:3.4;background:linear-gradient(90deg,#09090b,#5b6b93 58%,#c3cde6)"><span>Signal gradient</span><span>#09090B → #5B6B93 → #C3CDE6</span></div>
      <div style="flex:1;background:var(--pass)"><span>Pass · #46A758</span></div>
      <div style="flex:1;background:var(--fail)"><span>Fail · #E5484D</span></div>
    </div></div>`;
  },

  "1.3": () => `<div class="s"><div class="type">
      <div>${tag("tl", "Geist")}<div class="aa">Aa</div></div>
      <div>${tag("tl", "Weights")}<div class="weights" style="margin-top:110px"><span style="font-weight:400">Regular</span><span style="font-weight:500">Medium</span><span style="font-weight:600">Semibold</span></div>
        <div class="monoline">GEIST MONO<br>RUN 9 · 12 NOV 2026, 14:36 UTC<br>REPLY 620 MS · OVERLAP 0.6 S</div></div>
    </div><div class="numerals">${dm("0123456789", 13, 6)}<p>Dot-matrix numerals for every number that matters.</p></div></div>`,

  "1.4": () => `<div class="s" style="background:#000">
    <div class="icons">${ICONS.map(([name, body], i) => `<div>${icon(body, i)}<span>${name}</span></div>`).join("")}</div></div>`,

  // The waves on this slide move outwards from their sources (data-live, see flowWaves in brand-show.js).
  "1.5": () => `<div class="s"><div class="art"><canvas class="bg" data-wave="ripples" data-live width="800" height="600"></canvas>${GRAIN}</div>${tag("tl", "Ringproof")}
    <div class="mood">Call your own support before your customers do.</div>${tag("bl", "ringproof.example")}</div>`,

  // Rows of cards slide along their own line, every other row the opposite way, and loop.
  // One lamp hangs over the slide. Every card knows where it lies (--cx along its row, --ly for the row, --ox for how far
  // the row has slid), so the light on it changes as it passes under the lamp (see .bcard::after in brand.css).
  "1.6": () => {
    const front = (kind, colour) => `<div class="bcard front" style="--cx:%CX%px;color:${colour}">${art(kind)}${lock(58)}${PAPER}</div>`;
    // A person's card: Signal-coloured paper, the name pressed in as dot-matrix capitals, and a large blind-embossed
    // drawing of what they do. The drawings are Lucide icons (lucide.dev, ISC licence), copied here unchanged.
    const LUCIDE = {
      headset: '<path d="M3 11h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5Zm0 0a9 9 0 1 1 18 0m0 0v5a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3Z"/><path d="M21 16v2a4 4 0 0 1-4 4h-5"/>',
      "audio-lines": '<path d="M2 10v3"/><path d="M6 6v11"/><path d="M10 3v18"/><path d="M14 8v7"/><path d="M18 5v13"/><path d="M22 10v3"/>',
      target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
      "shield-check": '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
      "message-square-text": '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M13 8H7"/><path d="M17 12H7"/>',
    };
    const person = (first, last, role, mail, drawing) => `<div class="bcard who" style="--cx:%CX%px"><svg class="role" viewBox="0 0 24 24" fill="none" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round">${LUCIDE[drawing]}</svg>
      <div><span class="dmname">${dm(first, 4, 2)}${dm(last, 4, 2)}</span><span>${role}</span></div><span>${mail}@ringproof.example<br>+44 20 7946 0155</span>${PAPER}</div>`;
    const anna = person("ANNA", "LINDQVIST", "Head of Customer Experience", "anna", "headset");
    const jonas = person("JONAS", "FERREIRA", "Voice Engineer", "jonas", "audio-lines");
    const mira = person("MIRA", "KOVACS", "Scenario Designer", "mira", "target");
    const david = person("DAVID", "OSEI", "Head of Security", "david", "shield-check");
    const leila = person("LEILA", "HARTMANN", "Customer Success", "leila", "message-square-text");
    const dark = `<div class="bcard front dark" style="--cx:%CX%px;background:#0c0c0e">${lock(58)}${PAPER}</div>`;
    const sets = [
      [front("blue", "#fff"), anna, dark, jonas],
      [mira, front("wheat", "#fff"), david, front("mist", "#09090b")],
      [dark, leila, front("forest", "#fff"), anna],
    ];
    // 604 = card width + gap, 364 = row height + gap; the lamp is 237 px below the top of the first row.
    const row = (i) => `<div class="crow ${i % 2 ? "rev" : ""}" style="animation-delay:${-i * 7}s;--ly:${237 - i * 364}px">${Array.from({ length: 12 }, (_, n) => sets[i % 3][n % 4].replace("%CX%", n * 604)).join("")}</div>`;
    return `<div class="s" style="background:#000"><div class="cards">${[0, 1, 2, 3, 4].map(row).join("")}</div></div>`;
  },

  "1.7": () => `<div class="s" style="background:#000">
    <div class="badge" style="left:660px;top:235px;transform:rotate(9deg);animation-delay:-3.5s;align-items:center;justify-content:center;color:#fff;overflow:hidden">${art("marble")}${mark("", 260)}</div>
    <div class="badge" style="left:500px;top:205px;transform:rotate(-3deg);background:var(--paper);color:var(--ink)">
      <div class="slot"></div>${lock(40)}
      <h3 style="margin-top:130px">Anna<br>Lindqvist</h3><p>Head of Customer Experience</p>
      <div class="foot">${dm("0142", 9, 4)}<p style="margin:0">Speaker</p></div>
    </div></div>`,

  "1.8": () => `<div class="s" style="background:#000">
    <div class="sheet">${lock(36)}
      <div class="date">12 November 2026</div><h4>Your first support audit is ready</h4>
      <p>Dear Ms Okafor,</p>
      <p>Over the past week we placed 96 test calls to your card support line across twelve scenarios. Ten of them reached the goal every time. Two need attention, and the report explains why.</p>
      <p>The attached summary lists each scenario with its pass rate, the experience score and the exact moment in the call where things went wrong.</p>
      <p>Kind regards,<br>Anna Lindqvist</p>
      <div class="foot"><span>Ringproof Ltd · 14 Example Street, London</span><span>ringproof.example</span></div>${PAPER}</div>
    <div class="envelope">${art("blue")}${lock(70)}<div class="addr">Ringproof Ltd<br>14 Example Street, London</div>${PAPER}</div></div>`,

  "1.9": () => `<div class="s" style="background:#000"><div class="posts">
    <div class="post" style="align-items:center;justify-content:center;color:#fff">${art("forest")}${mark("", 236)}</div>
    <div class="post">${photo("dial", "28% 50%")}<small>Ringproof</small><h3>Test the call before the customer makes it.</h3></div>
    <div class="post">${art("blue")}<small>Experience score</small>${dm("8.4", 20, 8)}<small>Out of 10 · Block a lost card</small></div>
    <div class="post">${photo("window", "62% 45%")}<small>New</small><h3>Now testing chat, too.</h3></div>
    <div class="post" style="background:var(--stone);color:var(--ink)"><h3>6 checks.<br>1 score.<br>0 guessing.</h3><small>How a run is judged</small></div>
    <div class="post">${photo("street", "58% 55%", true)}<small>Reply speed</small>${dm("240", 17, 7)}<small>Milliseconds, typical</small></div>
  </div></div>`,

  "1.10": () => `<div class="s" style="background:#000">
    <div class="cover">${art("forest")}${lock(40)}<h3>Hear what your customers hear.</h3></div>
    <div class="stories">
      <div class="story" style="align-items:center;justify-content:center;color:#fff">${art("ripples")}${mark("", 190)}</div>
      <div class="story">${photo("call-c", "24% 50%")}<small>Ringproof</small><h3>Did the card actually get blocked?</h3></div>
      <div class="story">${art("blue")}<small>Pass rate · 7 days</small>${dm("78%", 11, 5)}<small>Up 4 points</small></div>
      <div class="story">${photo("call-b", "42% 30%")}<small>How it works</small><h3>Ring.<br>Listen.<br>Score.</h3></div>
    </div></div>`,

  "1.11": () => `<div class="s" style="background:#000"><div class="posters">
    <div class="poster" style="color:#fff"><img class="pphoto" src="photo/call-a.jpg" alt=""><i class="tint"></i>${GRAIN}${lock(36)}<h4>Hear what your customers hear.</h4>${PAPER}</div>
    <div class="poster" style="background:var(--paper);color:var(--ink)"><h4 style="font-size:90px">Proof that the call worked.</h4><div>${lenses(9, 54, "height:250px;margin-bottom:30px")}${lock(36)}</div>${PAPER}</div>
    <div class="poster" style="color:#fff">${art("blue")}${lock(36)}
      <div class="uis">
        <div class="ui-pill"><i></i>Card blocked · 03:48</div>
        <div class="ui-list"><small>Caller's checklist</small>
          ${[["Reach an agent", "00:04"], ["Block the card", "03:48"], ["Confirmation by SMS", "Not sent"]].map(([name, time], i) => `<div class="${i === 2 ? "no" : ""}">${i === 2 ? LUCIDE_X : LUCIDE_CHECK}<span>${name}</span><em>${time}</em></div>`).join("")}</div>
        <div class="ui-score"><small>Experience score</small>${dm("8.4", 8, 4)}<small>Block a lost card</small></div>
      </div>
      <h4>Every call,<br>checked.</h4>${PAPER}</div>
  </div></div>`,

  ...TOOL_SLIDES,
};

// ---------- Page ----------
const ROWS = [["1.1"], ["1.2", "1.3"], ["1.4", "1.5"], ["1.6"], ["1.7", "1.8"], ["1.12"], ["1.9", "1.10"], ["1.11"]];
const brandQuery = new URLSearchParams(location.search), only = brandQuery.get("only"), frame = Number(brandQuery.get("f")) || 0;
if (window.BRAND_EMBED) {
  // case.html draws the slides itself and only needs the definitions above.
} else if (only && SLIDES[only]) {
  document.body.className = "only";
  document.body.innerHTML = SLIDES[only](frame);
} else {
  document.body.innerHTML = `<div class="page"><h1>1 · Branding</h1><p>The idea behind the mark and how it lives on brand carriers.</p>
    ${ROWS.map((row) => `<div class="row ${row.length === 2 ? "two" : ""}">${row.map((id) => `<div class="frame"><span class="num">${id}</span>${SLIDES[id]()}</div>`).join("")}</div>`).join("")}</div>`;
  const fit = () => document.querySelectorAll(".frame").forEach((frame) => { const slide = frame.querySelector(".s"); slide.style.transform = `scale(${frame.clientWidth / slide.offsetWidth})`; });
  fit();
  addEventListener("resize", fit);
}
if (!window.BRAND_EMBED) {
  drawWaves();
  drawStreaks();
  runShow();
  runTools();
}
