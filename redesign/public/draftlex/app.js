// The product. app.html?screen=<name> shows one screen; &play loops a moment on "structure" and "editor".
// Screens: settings, details, structure, editor, preview, download, files, empty, pricing, login, signup, profile, support.
// The same document is used on every screen: a lease for a flat in London, drafted on 14 November 2026.
//
// Layout, after the designer's references: one large round panel on a grey ground. Inside it a plain list of
// places on the left, the work in the middle (the document on a white sheet), tools and facts on the right.
// Controls come from a ready component library, Shoelace (shoelace.style, MIT licence), loaded in app.html;
// its tokens are set to the brand in app.css. Icons are Lucide (icons.js).

const params = new URLSearchParams(location.search);
const screen = params.get("screen") || "files";
const play = params.has("play");
// Inside a slide, or with &bare: no scrollbar, and only the product's own panel, without the grey ground round it.
if (self !== top || params.has("bare")) document.documentElement.classList.add("framed", "bare");

const DOC = { title: "Lease Agreement for a UK flat", country: "England and Wales", language: "English", pages: 7 };
const SECTIONS = ["Parties", "Term", "Rent and deposit", "Repairs and maintenance", "Use of the property", "Termination", "Governing law"];
const FILES = [
  ["Lease Agreement for a UK flat", "Agreement", 7, "14 Nov 2026", "England and Wales"],
  ["Employment Agreement, senior counsel", "Agreement", 9, "12 Nov 2026", "England and Wales"],
  ["Master Services Agreement", "Agreement", 14, "9 Nov 2026", "Ireland"],
  ["Confidentiality clause, mutual", "Clause", 1, "6 Nov 2026", "England and Wales"],
  ["Shareholders' Agreement", "Agreement", 18, "30 Oct 2026", "Scotland"],
  ["Termination section, services", "Section", 2, "27 Oct 2026", "Ireland"],
];

const logo = `<a class="lg" href="?screen=files">Draftlex<b></b></a>`;
// Library controls, with the sizes and shapes the product always uses.
const button = (text, variant = "primary", iconName = "arrow-right", extra = "") => `<sl-button variant="${variant}" size="large" ${extra}>${text}${iconName ? `<span slot="suffix">${icon(iconName)}</span>` : ""}</sl-button>`;
const round = (iconName, extra = "") => `<a class="round ${extra}">${icon(iconName)}</a>`;
const input = (label, value, extra = "") => `<sl-input label="${label}" value="${value}" size="large" ${extra}></sl-input>`;
const area = (label, value) => `<sl-textarea label="${label}" value="${value}" size="large" rows="3" resize="none"></sl-textarea>`;
const select = (label, value) => `<sl-select label="${label}" value="v" size="large"><sl-option value="v">${value}</sl-option></sl-select>`;
const choice = (label, options, chosen) => `<sl-radio-group label="${label}" value="${chosen}" size="large">${options.map((option) => `<sl-radio-button value="${option}">${option}</sl-radio-button>`).join("")}</sl-radio-group>`;
const tile = (iconName, label) => `<a class="tile"><i>${icon(iconName)}</i>${label}</a>`;

// ---------- The panel every signed-in screen sits in ----------
const PLACES = ["My files", "Create file", "Shared with me"], MORE = ["Pricing", "Support", "Profile"];
const STEPS = ["Settings", "Details", "Structure", "Edit"];
const shell = ({ place, crumbs, step = 0, main, side = "" }) => `<div class="shell ${side ? "" : "two"}">
  <aside class="nav">${logo}<nav>${PLACES.map((name) => `<a class="${name === place ? "on" : ""}">${name}</a>`).join("")}<hr>${MORE.map((name) => `<a class="${name === place ? "on" : ""}">${name}</a>`).join("")}</nav>
    <div class="quota"><div><span>7 pages used</span><span>93 left</span></div><sl-progress-bar value="7"></sl-progress-bar></div></aside>
  <header class="hd"><p class="crumbs">${crumbs.map((name, i) => (i === crumbs.length - 1 ? `<b>${name}</b>` : `<a>${name}</a><i>/</i>`)).join("")}</p>
    ${step ? `<nav class="pills">${STEPS.map((name, i) => `<a class="${i + 1 === step ? "on" : i + 1 < step ? "done" : ""}"><code>0${i + 1}</code><span>${name}</span></a>`).join("")}</nav>` : ""}
    <div class="me">${step === 4 ? round("undo-2") + round("redo-2") : ""}${round("bell")}<sl-avatar initials="EH"></sl-avatar></div></header>
  <main class="main">${main}</main>${side ? `<aside class="side">${side}</aside>` : ""}</div>`;

// What the right-hand column says about the document while it is being set up.
const brief = (step) => `<h4>Your draft</h4><div class="card brief"><h3>${DOC.title}</h3><dl><dt>Law</dt><dd>${DOC.country}</dd><dt>Language</dt><dd>${DOC.language}, plain</dd>${step > 1 ? "<dt>Drafted for</dt><dd>The landlord</dd><dt>Term</dt><dd>12 months</dd>" : ""}${step > 2 ? `<dt>Sections</dt><dd>${SECTIONS.length}</dd>` : ""}</dl></div>
  <hr class="dots"><h4>What happens next</h4><ol class="next">${STEPS.map((name, i) => `<li class="${i + 1 === step ? "on" : i + 1 < step ? "done" : ""}"><i>${i + 1 < step ? icon("check") : i + 1}</i>${["Name the document", "Answer five questions", "Approve the structure", "Edit and download"][i]}</li>`).join("")}</ol>`;

const sectionRows = (names) => names.map((name) => `<li><span class="grip">${icon("grip-vertical")}</span><code></code><b>${name}</b><span class="x">${icon("x")}</span></li>`).join("");

// The text of the contract, section 3, as the editor and the preview show it.
const CLAUSES = [
  ["3.1", "The Tenant shall pay the Rent of £1,850 per calendar month, in advance, on the first day of each month."],
  ["3.2", "The Rent shall be paid by standing order to the account the Landlord names in writing."],
  ["3.3", "On or before the Start Date the Tenant shall pay a Deposit of £2,134, which the Landlord shall protect in an authorised tenancy deposit scheme within 30 days."],
  ["3.4", "The Landlord may deduct from the Deposit any unpaid Rent and the reasonable cost of making good damage beyond fair wear and tear."],
];
// The little window of actions that opens under the clause the lawyer has selected.
const actions = `<div class="pop"><h6>Actions</h6><a class="hot">${icon("languages")}Translate it</a><a>${icon("copy")}Copy the clause</a><a>${icon("search")}Find this term in the draft</a>
  <h6>Rewrite <em>AI</em></h6><a>${icon("spell-check")}Fix grammar</a><a>${icon("book-open")}Put it in plain language</a><a>${icon("zap")}Make it shorter</a></div>`;
const sheet = () => `<article class="card sheet"><code class="num">3</code><h2>Rent and deposit</h2>${CLAUSES.map(([n, text], i) => `<p class="${i === 2 ? "sel" : ""}"><code>${n}</code>${text}</p>${i === 2 ? actions : ""}`).join("")}<p class="new" hidden><code>3.5</code><span></span></p><a class="add">${icon("plus")}Add clause</a></article>`;
const tools = (mode) => `<sl-radio-group value="${mode}" size="medium" class="seg"><sl-radio-button value="edit"><span slot="prefix">${icon("pencil")}</span>Edit</sl-radio-button><sl-radio-button value="preview"><span slot="prefix">${icon("eye")}</span>Preview</sl-radio-button></sl-radio-group>
  <hr class="dots"><h4>Draft check</h4><div class="card score"><div><i class="orb"></i><span>Overall score</span><strong>8.4</strong></div><dl><div><dt>12</dt><dd>Defined terms</dd></div><div><dt>96%</dt><dd>Plain language</dd></div><div><dt>2</dt><dd>Open points</dd></div></dl></div>
  <hr class="dots"><h4>Text</h4><div class="tiles">${tile("bold", "Bold")}${tile("italic", "Italic")}${tile("underline", "Underline")}${tile("list", "List")}${tile("link", "Link")}</div>
  <hr class="dots"><h4>Structure</h4><ol class="outline">${SECTIONS.map((name, i) => `<li class="${i === 2 ? "on" : ""}"><code>${i + 1}</code>${name}</li>`).join("")}</ol>
  <div class="dl">${button(".DOC", "default", "download")}${button(".PDF", "primary", "download")}</div>`;

const social = `<div class="social"><sl-button size="large">Continue with Google</sl-button><sl-button size="large">Continue with LinkedIn</sl-button></div><sl-divider></sl-divider>`;
const auth = (title, fields, cta, foot) => `<main class="auth"><div class="card authbox">${logo}<h1>${title}</h1>${social}${fields}${button(cta)}<p class="foot">${foot}</p></div><aside class="card authside"><img src="photo/columns.jpg" alt=""><i></i><blockquote>Every clause accounted for<b></b></blockquote><small>© 2026 Draftlex Ltd</small></aside></main>`;
const flow = (step, name, main) => shell({ place: "Create file", crumbs: ["My files", DOC.title, name], step, main, side: brief(step) });

const SCREENS = {
  settings: () => flow(1, "Settings", `<section class="card form"><h1>Basic settings</h1>
      ${input("Document title", DOC.title)}
      <div class="two">${select("Language", DOC.language)}${select("Country", DOC.country)}</div>
      ${area("Add any useful context or attachments", "Two-bedroom flat at 12 Chancery Row, London. Furnished. The landlord is a company. Break clause after six months.")}
      <div class="attach"><sl-button size="medium"><span slot="prefix">${icon("upload")}</span>Upload file</sl-button><sl-tag size="large" removable>${icon("file-text")}Heads-of-terms.pdf</sl-tag></div>
      <sl-checkbox checked size="large">Use simple plain language</sl-checkbox>
      <div class="actions">${button("Continue")}</div></section>`),

  details: () => flow(2, "Details", `<section class="card form"><h1>Add more details</h1>
      <div class="progress"><code>2 / 5</code><sl-progress-bar value="40"></sl-progress-bar><a>Skip</a></div>
      ${choice("Who are you drafting for?", ["The landlord", "The tenant"], "The landlord")}
      ${choice("How long is the term?", ["6 months", "12 months", "24 months"], "12 months")}
      ${input("Monthly rent", "£1,850")}
      <div class="actions"><sl-button size="large" class="square">${icon("arrow-left")}</sl-button>${button("Continue")}</div></section>`),

  structure: () => flow(3, "Structure", `<section class="card form"><h1>Review structure</h1>
      <a class="newrow">${icon("plus")}New section</a><ol class="rows" id="rows">${sectionRows(SECTIONS)}</ol><a class="newrow">${icon("plus")}New section</a>
      <div class="actions"><sl-button size="large" class="square">${icon("arrow-left")}</sl-button>${button("Draft the contract")}</div></section>`),

  editor: () => shell({ place: "Create file", crumbs: ["My files", DOC.title], step: 4, side: tools("edit"),
    main: `<div class="ask"><i>${icon("sparkles")}</i><span id="ask">Change something in this section</span><sl-button variant="primary" size="medium" class="square">${icon("arrow-right")}</sl-button></div>${sheet()}` }),

  preview: () => shell({ place: "Create file", crumbs: ["My files", DOC.title], step: 4, side: tools("preview"),
    main: `<div class="card paper"><h4>LEASE AGREEMENT</h4><small>12 Chancery Row, London WC2A 1PL</small>
      <p>This Agreement is made on 14 November 2026 between <b>Hartwell Estates Ltd</b> (the “Landlord”) and <b>Daniel Osei</b> (the “Tenant”).</p>
      <h5>3. Rent and deposit</h5>${CLAUSES.map(([n, text]) => `<p><code>${n}</code>${text}</p>`).join("")}<h5>4. Repairs and maintenance</h5><p><code>4.1</code>The Landlord shall keep in repair the structure and exterior of the Property and the installations for the supply of water, gas and electricity.</p><footer><span>Lease Agreement · Draft 3</span><span>Page 3 of 7</span></footer><i class="sealdot">D<b></b></i></div>` }),

  download: () => `${SCREENS.preview()}<div class="veil"><div class="card modal"><a class="round close">${icon("x")}</a><h2>Sign up to download</h2><p>Your draft is ready. Create an account to save it and download the .DOC or .PDF file.</p>${social}${input("Name", "Eleanor Hartwell")}${input("Email", "eleanor@hartwell-lane.example")}${input("Password", "0123456789", 'type="password"')}${button("Create account")}<p class="foot">Already a user? <a>Log in</a></p></div></div>`,

  files: () => shell({ place: "My files", crumbs: ["My files"], main: `<div class="head"><h1>My files</h1><sl-input size="large" placeholder="Search by keywords" class="search"><span slot="prefix">${icon("search")}</span></sl-input>${button("Create new", "primary", "plus")}</div>
      <div class="filters"><a class="on">All · 6</a><a>Agreements · 4</a><a>Sections · 1</a><a>Clauses · 1</a></div>
      <ul class="files">${FILES.map(([name, type, pages, date, law]) => `<li class="card"><div><sl-tag size="small" pill variant="${type === "Agreement" ? "primary" : "neutral"}">${type}</sl-tag><span>${date}</span></div><h3>${name}</h3><p>${law} · ${pages} ${pages === 1 ? "page" : "pages"}</p><footer>${round("eye")}${round("download")}<span>.DOC · .PDF</span></footer></li>`).join("")}</ul>` }),

  empty: () => shell({ place: "My files", crumbs: ["My files"], main: `<div class="card blank"><div class="ring-slot">${ringSvg(220)}</div><h1>Let’s draft your first document</h1><ul><li>${icon("sparkles")}Contract templates, drafted with AI</li><li>${icon("list-ordered")}You review the structure before a word is written</li><li>${icon("pen-line")}Every clause stays yours to edit</li></ul>${button("Create new", "primary", "plus")}</div>` }),

  pricing: () => shell({ place: "Pricing", crumbs: ["Pricing"], main: `<h1>One subscription. Every contract.</h1><div class="plans">
      <div class="card plan blue"><div class="tags"><sl-tag size="small" pill>Yearly</sl-tag><sl-tag size="small" pill>$1 per day</sl-tag><sl-tag size="small" pill class="save">Save 50%</sl-tag></div><strong>$360<small>/ year</small></strong><ul><li>${icon("check")}About 1,500 contracts a year</li><li>${icon("check")}15,000 standard pages</li><li>${icon("check")}.DOC and .PDF downloads</li></ul>${button("Buy now", "default")}</div>
      <div class="card plan"><div class="tags"><sl-tag size="small" pill>Monthly</sl-tag><sl-tag size="small" pill>$2 per day</sl-tag></div><strong>$60<small>/ month</small></strong><ul><li>${icon("check")}About 100 contracts a month</li><li>${icon("check")}1,000 standard pages</li><li>${icon("check")}.DOC and .PDF downloads</li></ul>${button("Buy now")}</div></div>
      <div class="card team"><div><h3>Team subscription</h3><p>Custom price for twelve lawyers or more</p></div><span>Email us directly</span>${button("hello@draftlex.example", "default", "copy")}</div>` }),

  login: () => auth("Log in", `${input("Email", "eleanor@hartwell-lane.example")}${input("Password", "0123456789", 'type="password"')}<a class="forgot">Forgot password</a>`, "Log in", "No account yet? <a>Create one</a>"),
  signup: () => auth("Sign up", `${input("Name", "Eleanor Hartwell")}${input("Email", "eleanor@hartwell-lane.example")}${input("Password", "0123456789", 'type="password"')}`, "Create account", "By creating an account you agree to our <a>Privacy Policy</a> and <a>Terms of Use</a>"),

  profile: () => shell({ place: "Profile", crumbs: ["Profile"], main: `<h1>Profile</h1><section class="card stack"><h3>Personal data</h3><div class="line">${input("Name", "Eleanor Hartwell")}${button("Change", "default", "pencil")}</div><div class="line">${input("Email", "eleanor@hartwell-lane.example")}${button("Change", "default", "pencil")}</div><p class="note">Pending email change to “e.hartwell@hartwell-lane.example”</p></section>
      <section class="card acts"><a>${icon("log-out")}Log out</a><a>${icon("trash-2")}Delete account</a></section>` }),

  support: () => shell({ place: "Support", crumbs: ["Support"], main: `<h1>Support</h1><section class="card stack"><p>If you need to change something in your account, use this form or email us directly at hello@draftlex.example. We answer within 24 hours.</p>${area("Your message", "Please move our team plan to twelve seats from 1 December 2026.")}${button("Send request")}</section>` }),
};

// The seal ring of the brand, for the empty state (the same drawing as ringMark in brand.js: the discs run into each other).
function ringSvg(size) {
  const ring = [["D", -162], ["R", -126], ["A", -90], ["F", -54], ["T", -18], [null, 18], ["X", 54], ["E", 90], ["L", 126], [null, 162]];
  const at = (angle) => { const a = (angle * Math.PI) / 180; return [(100 + 68 * Math.cos(a)).toFixed(2), (100 + 68 * Math.sin(a)).toFixed(2)]; };
  return `<svg width="${size}" height="${size}" viewBox="0 0 200 200"><defs><filter id="goo" x="-20%" y="-20%" width="140%" height="140%" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="3.2"/><feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -6"/></filter></defs>
    <g filter="url(#goo)" fill="#0b0b0c">${ring.map(([, angle]) => { const [x, y] = at(angle); return `<circle cx="${x}" cy="${y}" r="23"/>`; }).join("")}</g>${ring.map(([glyph, angle]) => { const [x, y] = at(angle); return glyph ? "" : `<circle cx="${x}" cy="${y}" r="10" fill="#2440ff"/>`; }).join("")}
    ${ring.map(([glyph, angle]) => { const [x, y] = at(angle); return glyph ? `<text x="${x}" y="${(Number(y) + 9.6).toFixed(2)}" text-anchor="middle" font-family="Newsreader, serif" font-weight="500" font-size="29" fill="#fff" transform="rotate(${angle < 0 ? angle + 90 : angle - 90} ${x} ${y})">${glyph}</text>` : ""; }).join("")}</svg>`;
}

document.getElementById("app").innerHTML = (SCREENS[screen] || SCREENS.files)();
document.body.dataset.screen = screen;
if (play) document.body.classList.add("play"); // while a moment loops, the window of actions stays shut

// ---------- Moments that loop (&play) ----------
const wait = (ms) => new Promise((done) => setTimeout(done, ms));
const type = async (node, text, speed = 28) => { node.textContent = ""; for (const letter of text) { node.textContent += letter; await wait(speed); } };

// Structure: a new section is put in between two others, named, and taken away again; the numbers follow.
async function playStructure() {
  const rows = document.getElementById("rows");
  for (;;) {
    await wait(1600);
    const mark = document.createElement("li"); mark.className = "insert"; mark.innerHTML = `<i>${icon("plus")}</i>`;
    rows.insertBefore(mark, rows.children[3]);
    await wait(1300);
    const row = document.createElement("li"); row.className = "fresh"; row.innerHTML = `<span class="grip">${icon("grip-vertical")}</span><code></code><b></b><span class="x">${icon("x")}</span>`;
    rows.replaceChild(row, mark);
    await wait(60); row.classList.add("open");
    await wait(500); await type(row.querySelector("b"), "Break clause", 60);
    await wait(700); row.classList.remove("fresh");
    await wait(3200);
    row.classList.add("fresh"); row.classList.remove("open");
    await wait(700); row.remove();
  }
}
// Editor: the lawyer asks for a clause, and Draftlex writes it under the one that is selected.
async function playEditor() {
  const ask = document.getElementById("ask"), bar = ask.parentElement, added = document.querySelector(".sheet .new"), out = added.querySelector("span");
  const rest = ask.textContent;
  for (;;) {
    await wait(1500);
    bar.classList.add("typing"); await type(ask, "Add interest on late rent at 3% above base rate", 34);
    await wait(600); bar.classList.add("busy");
    added.hidden = false; added.classList.add("writing");
    await type(out, "If the Rent is more than 14 days late, the Tenant shall pay interest on it at 3% above the Bank of England base rate, from the date it fell due until it is paid.", 16);
    bar.classList.remove("busy", "typing"); ask.textContent = rest;
    await wait(900); added.classList.remove("writing");
    await wait(3600);
    added.classList.add("leaving"); await wait(600);
    added.hidden = true; added.classList.remove("leaving"); out.textContent = "";
  }
}
if (play && screen === "structure") playStructure();
if (play && screen === "editor") playEditor();
