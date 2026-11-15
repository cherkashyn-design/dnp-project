// Section 1 of the case: the branding slides of Draftlex. Loaded by case.html before case.js, which shows them.
// Every slide is a function that returns a 1600 x 1200 <div class="s">; styles are in brand.css, icons in icons.js.
//
// The parts of the brand, each taken from one of the designer's references:
//   logo()      the name in a serif with a blue full stop after it
//   ringMark()  the name set letter by letter in discs that form a ring: a seal (after the Órbita Local poster)
//   dMark()     the short logo: the D of the wordmark with its full stop
// RULE: one carrier never shows the short logo and the full logo together. A card, a poster, a post or a sheet
// carries either "D." or "Draftlex.", not both. (The seal has a D. in it, so it counts as the short logo.)
//   .cut        paper with four cut corners and tiny technical text along its edges (after the M&G stationery)
//   photo()     a black-and-white photograph, usually under a blue tint, with grain
// Surfaces are never flat: PTEX is the tooth of paper, GRAIN is film grain over colour and photographs.
// Text set under the logo or under the D lines up with the left edge of the D's stem.

const INK = "#0b0b0c", PAPER = "#ffffff", BLUE = "#2440ff", MIST = "#ededea", SKY = "#c7cfff";
const GRAIN = '<i class="grain"></i>', PTEX = '<i class="ptex"></i>';

const logo = (size, colour = INK, dot = BLUE) => `<span class="lg" style="font-size:${size}px;color:${colour};--dot:${dot}">Draftlex<b></b></span>`;
const brandSlide = (background, inner, extra = "") => `<div class="s ${extra}" style="background:${background}">${inner}</div>`;

// A photograph from ./photo (sources in photo-sources.md). look: "blue" = dark blue duotone for white text,
// "bw" = plain black and white. at = the part of it to keep in view.
const photo = (name, look = "blue", at = "50% 50%") => `<div class="ph ${look}"><img src="photo/${name}.jpg" alt="" style="object-position:${at}"><i class="tint"></i>${GRAIN}</div>`;

// The ring. Ten discs: D R A F T across the top, a full stop, then L E X along the bottom and a second full stop.
// Letters on the top half stand with their heads outward, letters on the bottom half with their heads inward,
// so both halves read from left to right.
const RING = [["D", -162], ["R", -126], ["A", -90], ["F", -54], ["T", -18], [null, 18], ["X", 54], ["E", 90], ["L", 126], [null, 162]];
// The discs run into each other like drops: they are blurred together and the blur is cut back to a hard edge
// (the "goo" filter the studio used for its orbit logo). The letters lie on top, untouched, and each of the two
// full stops is a smaller dot of the accent colour sitting on its drop.
let ringCount = 0;
const ringMark = (size, disc = INK, letter = PAPER, dot = BLUE, extra = "") => {
  const id = `goo${++ringCount}`;
  const spots = RING.map(([glyph, angle]) => { const a = (angle * Math.PI) / 180; return [glyph, angle, (100 + 68 * Math.cos(a)).toFixed(2), (100 + 68 * Math.sin(a)).toFixed(2)]; });
  return `<svg class="ring" width="${size}" height="${size}" viewBox="0 0 200 200" ${extra}><defs><filter id="${id}" x="-20%" y="-20%" width="140%" height="140%" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="3.2"/><feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -6"/></filter></defs>
    <g filter="url(#${id})" fill="${disc}">${spots.map(([, , x, y]) => `<circle cx="${x}" cy="${y}" r="23"/>`).join("")}</g>${spots.map(([glyph, , x, y]) => (glyph ? "" : `<circle cx="${x}" cy="${y}" r="10" fill="${dot}"/>`)).join("")}
    ${spots.map(([glyph, angle, x, y]) => (glyph ? `<text x="${x}" y="${(Number(y) + 9.6).toFixed(2)}" text-anchor="middle" font-family="Newsreader, serif" font-weight="500" font-size="29" fill="${letter}" transform="rotate(${angle < 0 ? angle + 90 : angle - 90} ${x} ${y})">${glyph}</text>` : "")).join("")}</svg>`;
};

// The short logo. size is roughly the height of the letter in px.
const dMark = (size, colour = INK, dot = BLUE) => `<span class="lg dm" style="font-size:${Math.round(size * 1.45)}px;color:${colour};--dot:${dot}">D<b></b></span>`;

// The twelve icons of slide 1.6, in the order they are drawn.
const BRAND_ICONS = ["file-text", "scale", "pen-line", "signature", "stamp", "list-ordered", "sparkles", "shield-check", "languages", "globe", "download", "search"];
// pathLength="1" lets one dash rule draw every shape, whatever its real length.
const drawn = (name) => icon(name).replace(/<(path|rect|circle|line|ellipse|polyline)/g, '<$1 pathLength="1"');

const PEOPLE = [
  ["Amara Okafor", "Head of Legal Product", "amara@draftlex.example", "+44 20 7946 0142"],
  ["Jonas Reiter", "Founder", "jonas@draftlex.example", "+44 20 7946 0117"],
  ["Mei Tanaka", "Counsel, Templates", "mei@draftlex.example", "+44 20 7946 0185"],
];
const edge = (text) => `<small class="edge">${text}</small>`;
const cardFront = (background, inner, texture = PTEX) => `<div class="bc cut" style="background:${background}"><div class="mid">${inner}</div>${edge("DLX · CONTRACT TEMPLATES · LONDON · 2026")}${texture}</div>`;
const cardBack = ([name, role, mail, phone], n) => `<div class="bc cut back">${dMark(42)}<strong>${name}</strong><em>${role}</em><span>${mail}<br>${phone}</span><small class="no">N° 0${n} / 12</small>${edge("DRAFTLEX LTD · 8 FETTER YARD · LONDON EC4A 1BR")}${PTEX}</div>`;
const cardPhoto = (name, at) => `<div class="bc cut light">${photo(name, "blue", at)}<div class="corner">${logo(44, PAPER, PAPER)}</div>${edge("EVERY CLAUSE ACCOUNTED FOR")}</div>`;

// The seal: the full stop, large, with the words that go round it.
let sealCount = 0;
const seal = (size) => {
  const id = `sealgoo${++sealCount}`, round = `sealround${sealCount}`;
  const drops = Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * Math.PI * 2; return `<circle cx="${(150 + 106 * Math.cos(a)).toFixed(2)}" cy="${(150 + 106 * Math.sin(a)).toFixed(2)}" r="40"/>`; }).join("");
  return `<svg class="seal" width="${size}" height="${size}" viewBox="0 0 300 300"><defs><filter id="${id}" x="-20%" y="-20%" width="140%" height="140%" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="5"/><feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -6"/></filter></defs>
  <g filter="url(#${id})" fill="${BLUE}">${drops}<circle cx="150" cy="150" r="106"/></g>
  <g class="turn"><path id="${round}" d="M150 150m-104 0a104 104 0 1 1 208 0a104 104 0 1 1-208 0" fill="none"/>
  <text font-family="Inter Tight, sans-serif" font-weight="500" font-size="14" fill="#fff"><textPath href="#${round}" textLength="646" lengthAdjust="spacing">DRAFTED WITH DRAFTLEX · REVIEWED BY COUNSEL · SIGNED BY BOTH PARTIES ·</textPath></text></g>
  <circle cx="150" cy="150" r="82" fill="none" stroke="#fff" stroke-width="1.2"/>
  <text x="141" y="187" text-anchor="middle" font-family="Newsreader, serif" font-weight="500" font-size="110" fill="#fff">D</text><circle cx="188" cy="177" r="9" fill="#fff"/>
</svg>`;
};

// The rows of the product's "Review structure" step, used on a poster.
const structureRows = (names, insertAfter) => `<div class="rows">${names.map((name, i) => `<div><code>${i + 1}</code>${name}${icon("grip-vertical")}</div>${i === insertAfter ? "<u></u>" : ""}`).join("")}</div>`;

const BRAND = {
  // The logo on eight grounds, a new one every half second. The logo itself never moves.
  "1.1": () => brandSlide("#fff", [
    [PAPER, INK, BLUE, PTEX], [INK, PAPER, "#3d57ff", GRAIN], [BLUE, PAPER, PAPER, GRAIN], ["#000", PAPER, PAPER, photo("columns", "blue", "50% 40%")],
    [MIST, INK, BLUE, PTEX], [SKY, INK, BLUE, GRAIN], ["#000", PAPER, PAPER, photo("counsel", "bw", "50% 30%")], ["#000", PAPER, "#3d57ff", GRAIN],
  ].map(([background, colour, dot, ground], i) => `<div class="flip" style="--i:${i};background:${background}">${ground}${logo(300, colour, dot)}</div>`).join("")),

  "1.2": () => brandSlide(BLUE, `${GRAIN}<div class="sw big" style="color:#fff"><strong>Full Stop Blue</strong><span>#2440FF<br>RGB 36 64 255</span></div>
    <div class="sw" style="top:0;background:${INK};color:#fff"><strong>Ink</strong><span>#0B0B0C</span>${GRAIN}</div>
    <div class="sw" style="top:300px;background:${PAPER}"><strong>Paper</strong><span>#FFFFFF</span>${PTEX}</div>
    <div class="sw" style="top:600px;background:${MIST}"><strong>Mist</strong><span>#EDEDEA</span>${PTEX}</div>
    <div class="sw" style="top:900px;background:${SKY}"><strong>Sky</strong><span>#C7CFFF</span>${GRAIN}</div>`),

  "1.3": () => brandSlide(PAPER, `<div class="ty serif">${PTEX}<div class="aa">Aa<b></b></div><strong>Newsreader</strong><span>Regular &nbsp; Medium &nbsp; <i>Italic</i></span><p>The Tenant shall pay the Rent on the first day of each month.</p></div>
    <div class="ty sans">${PTEX}<div class="aa">Aa</div><strong>Inter Tight</strong><span>Regular &nbsp; Medium &nbsp; <b>Semibold</b></span><p>Review structure · 6 sections · 7 pages</p><code>1.1 &nbsp; 2.4 &nbsp; 14.2 &nbsp; Geist Mono</code></div>`),

  // Twelve icons from Lucide, drawn one after another, held, then taken away again.
  "1.4": () => brandSlide("#000", `<div class="icons">${BRAND_ICONS.map((name, i) => `<div style="--i:${i}">${drawn(name)}</div>`).join("")}</div>`),

  // A letter, its envelope and the cover of a client folder.
  "1.5": () => brandSlide("#000", `<div class="sheet cut">${logo(44)}
      <div class="to">Hartwell &amp; Lane LLP<br>12 Chancery Row<br>London WC2A 1PL</div>
      <div class="date">14 November 2026</div>
      <h4>Your team plan</h4>
      <p>Dear Ms Hartwell,</p>
      <p>Thank you for moving your practice to Draftlex. Your team plan covers twelve lawyers and is active from 1 December 2026.</p>
      <p>Every template your team drafts is stored in My files, where it can be reviewed, edited section by section and downloaded as a .DOC or .PDF file.</p>
      <p>Yours sincerely,<br>Amara Okafor<br>Head of Legal Product</p>
      <footer><span>Draftlex Ltd · 8 Fetter Yard, London EC4A 1BR</span><span>hello@draftlex.example</span></footer>${edge("DLX · LETTER · REF 2026 / 1114 · PAGE 1 OF 1")}${PTEX}</div>
    <div class="folder cut light">${photo("stairs", "blue", "50% 60%")}<header><span>PREPARED FOR HARTWELL &amp; LANE LLP</span><span>N° 0142</span></header><h4>Lease templates<br>2026</h4><div class="corner">${logo(44, PAPER, PAPER)}<small>Hartwell &amp; Lane LLP</small></div>${edge("TWELVE TEMPLATES · REVIEWED 14 NOVEMBER 2026")}</div>
    <div class="envelope cut">${logo(34)}<div class="addr">Hartwell &amp; Lane LLP<br>12 Chancery Row<br>London WC2A 1PL</div>${ringMark(110)}${PTEX}</div>`),

  // Stationery, after the M&G reference: paper with cut corners on black. A tall strip with the name spelt down
  // it, a small card with the ring, a large card with the D of arcs, and a photograph.
  "1.6": () => brandSlide("#000", `<div class="paper cut strip"><header><span>DLX</span><span>2026</span></header><div class="turned">${logo(150)}</div><footer><span>LONDON</span><span>EC4A 1BR</span></footer>${edge("CONTRACT TEMPLATES · DRAFTED WITH AI · REVIEWED BY COUNSEL")}${PTEX}</div>
    <div class="paper cut small">${ringMark(250)}<span class="tl">D</span><span class="tr">L</span><span class="bl">X</span><span class="br"></span>${edge("TEMPLATES 2026 · LONDON · DRAFTLEX.EXAMPLE · DLX INSTITUTIONAL")}${PTEX}</div>
    <div class="paper cut large"><header><span>DLX</span><span>2026</span></header>${dMark(190)}${edge("Nod to the seal, the oldest full stop a contract has")}
      <footer><div><span>LEGAL</span><span>DRAFTING</span></div><p>Draftlex drafts contract templates for lawyers. Name the agreement, the country and the language; review the structure section by section; edit every clause; download a .DOC or .PDF file ready for signature.</p></footer>${PTEX}</div>
    <div class="paper cut shot light">${photo("blazer", "bw", "50% 30%")}<header><span>COUNSEL</span><span>N° 07</span></header><div class="corner">${logo(40, PAPER, PAPER)}<small>Institutional. Precise.<br>Contemporary.</small></div>${edge("INSTITUTIONAL · PRECISE · CONTEMPORARY")}</div>`),

  // Business cards in two rows that slide past each other. Each row holds its cards twice, so the loop has no seam.
  "1.7": () => {
    const rowA = [cardFront(PAPER, logo(84)), cardBack(PEOPLE[0], 1), cardFront(BLUE, ringMark(250, INK, PAPER, PAPER), GRAIN), cardBack(PEOPLE[1], 2)].join("");
    const rowB = [cardPhoto("sign", "40% 50%"), cardFront(SKY, dMark(170), GRAIN), cardBack(PEOPLE[2], 3), cardFront(MIST, ringMark(250))].join("");
    return brandSlide("#000", `<div class="cards" style="top:236px">${rowA}${rowA}</div><div class="cards back-row" style="top:624px">${rowB}${rowB}</div>`);
  },

  // The last page of a contract, with the seal on it. The words round the seal turn once a minute.
  "1.8": () => brandSlide("#000", `<div class="signed"><code>14</code><h4>Signatures</h4>
      <p><code>14.1</code>This Agreement is signed by the Parties on the Effective Date and may be executed in any number of counterparts.</p>
      <p><code>14.2</code>Each Party confirms that it has read this Agreement and agrees to be bound by its terms.</p>
      <div class="sigs"><div><svg viewBox="0 0 300 90"><path d="M8 62c22-40 38-52 46-40s-22 50-10 52 34-58 48-50-10 44 2 44 26-30 38-30 4 22 16 22 30-18 62-22"/></svg><strong>Eleanor Hartwell</strong><span>Landlord · 14 November 2026</span></div>
      <div><svg viewBox="0 0 300 90"><path d="M10 54c14-26 30-38 40-26s-18 44-4 40 20-48 36-44 0 40 12 40 18-34 34-30-6 28 8 26 34-16 70-22"/></svg><strong>Daniel Osei</strong><span>Tenant · 14 November 2026</span></div></div>
      <footer><span>Lease Agreement · 12 Chancery Row</span><span>Page 7 of 7</span></footer>${edge("DRAFTED WITH DRAFTLEX · TEMPLATE DLX-0142 · VERSION 3")}${PTEX}</div>
    <div class="paper cut pen light" style="background:${BLUE}">${GRAIN}<header><span>SIGNED</span><span>14.11.26</span></header><div class="penicon">${icon("signature")}</div>${edge("WET INK · TWO COUNTERPARTS · ONE SEAL")}</div>
    ${seal(400)}`),

  // Six social posts.
  "1.9": () => brandSlide("#000", `<div class="posts">
    <div class="post light" style="background:${BLUE}">${GRAIN}<header><span>DLX</span><span>01 / 06</span></header><h5>Contracts<br>end here<b style="background:#fff"></b></h5>${logo(34, PAPER, PAPER)}</div>
    <div class="post" style="background:${SKY}">${GRAIN}<div class="inring" style="left:148px;top:66px;width:184px;height:184px">${photo("counsel", "blue", "50% 26%")}</div><div class="wheel" style="left:75px;top:-7px;width:330px;height:330px">${ringMark(330, INK, PAPER, PAPER)}</div><small class="cap">A lease for a UK flat,<br>drafted in four minutes</small>${logo(34)}</div>
    <div class="post" style="background:${MIST}">${PTEX}<header><span>PLAN</span><span>YEARLY</span></header><h5><em>1,500</em><br>contracts a year<b></b></h5>${logo(34)}</div>
    <div class="post light">${photo("columns", "blue", "30% 50%")}<header><span>VOICE</span><span>04 / 06</span></header><h5 class="mid">Plain words where the law <span class="nb">allows<b style="background:#fff"></b></span></h5>${logo(34, PAPER, PAPER)}</div>
    <div class="post light" style="background:${INK}">${GRAIN}<header><span>NEW</span><span>STEP 3 OF 4</span></header><div class="pmark">${dMark(150, PAPER, "#3d57ff")}</div><small class="cap low">Review the structure<br>before a word is written</small></div>
    <div class="post" style="background:${PAPER}">${PTEX}<header><span>CLAUSE</span><span>14.2</span></header><p class="clause">Each Party confirms that it has read this Agreement and agrees to be bound by its terms.</p><div class="add">${icon("plus")}Add clause</div>${logo(34)}</div>
  </div>`),

};
