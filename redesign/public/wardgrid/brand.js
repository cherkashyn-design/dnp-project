// The branding slides of the Wardgrid case, 1.1–1.12. Each is a function that returns a 1600 x 1200 <div class="s">.
// case.js collects them from window.SLIDES; brand-show.js supplies the mark, the icons and the cell pictures.
(() => {
  const { mark, logo, ic } = WG;
  const slide = (cls, background, inner) => `<div class="s ${cls}" style="background:${background}">${inner}</div>`;
  const pic = (set, field, cell, more = "") => `<canvas class="pic" data-set="${set}" data-field="${field}" data-cell="${cell}" ${more}></canvas>`;
  const S = (window.SLIDES = window.SLIDES || {});

  // 1.1 The logo on six backgrounds, one every half second. Every layer holds the same logo in the same place.
  S["1.1"] = () => {
    const layers = [
      ["background:#1d3be3;color:#f1f2f6", ""],
      ["background:#000;color:#f1f2f6", ""],
      ["background:#f1f2f6;color:#1d3be3", ""],
      ["color:#f1f2f6", pic("blue", "blobs", 40, `data-level="0.62" data-dots="off" data-hole="300,440,1000,320"`)],
      ["background:#cbc6ff;color:#0a0c1c", ""],
      ["color:#f1f2f6", `<div class="grain" style="position:absolute;inset:0"></div>`],
    ];
    return slide("s11", "#1d3be3", layers.map(([style, back], i) => `<div class="l" style="--i:${i};${style}">${back}${logo(150)}</div>`).join(""));
  };

  // 1.2 Colour: five colours, each with its name and value.
  S["1.2"] = () => slide("s12", "#000", `
    <div class="sw big mat" style="left:80px;top:80px;width:700px;height:1040px;background:#1d3be3">${mark(120)}<b>Ward Blue</b><span>#1D3BE3 · RGB 29 59 227</span></div>
    ${[["Paper", "#F1F2F6", "#f1f2f6", "#0a0c1c", ""], ["Lilac", "#CBC6FF", "#cbc6ff", "#0a0c1c", ""], ["Night Ink", "#0A0C1C", "#0a0c1c", "#f1f2f6", "box-shadow:inset 0 0 0 1.5px #262a44;"], ["Signal", "#FF5A1F · open shifts only", "#ff5a1f", "#0a0c1c", ""]]
      .map(([name, value, colour, text, more], i) => `<div class="sw mat" style="left:800px;top:${80 + i * 265}px;width:720px;height:245px;background:${colour};color:${text};${more}"><b>${name}</b><span>${value}</span></div>`).join("")}`);

  // 1.3 Type: one grotesque for everything, one monospace for hours and shift codes.
  S["1.3"] = () => slide("s13", "#f1f2f6", `
    <div class="abs aa">Aa</div>
    <div class="abs name">Instrument Sans<span>Regular · Medium · SemiBold</span></div>
    <div class="abs line">Every shift<br />covered.</div>
    <div class="abs rule"></div>
    <div class="abs monoline">JetBrains Mono<br /><span>NIGHT 21:00–07:30 · WARD 4B</span><br /><span>3 OF 23 CAN COVER · 99/104</span></div>
    <div class="abs glyphs">ABCDEFGHIJKLMNOPQRSTUVWXYZ<br />abcdefghijklmnopqrstuvwxyz<br />0123456789 · → + ( ) / : %</div>`);

  // 1.4 Icons from Lucide (lucide.dev), drawn one after another.
  S["1.4"] = () => slide("s14", "#1d3be3", `<div class="icons">${["calendar-days", "clock", "users", "repeat", "bell", "shield-check", "moon", "sun", "stethoscope", "smartphone", "check-check", "triangle-alert"]
    .map((name, i) => `<i data-lucide="${name}" style="--i:${i}"></i>`).join("")}</div>`);

  // 1.5 Tone of voice: short, plain, says who and when.
  const say = (icon, text, blue) => `<div class="say ${blue ? "blue" : ""}"><i class="dot">${ic(icon, 44)}</i><svg class="neck" viewBox="0 0 110 108"><path d="M0 22C40 22 40 40 55 40C70 40 70 22 110 22V86C70 86 70 68 55 68C40 68 40 86 0 86Z"/></svg><p>${text}</p></div>`;
  S["1.5"] = () => slide("s15", "#05060f", `${pic("ink", "blobs", 32, `data-live data-level="0.56"`)}
    <div class="says">
      ${say("moon", "Thursday night is open. Three people can take it.")}
      ${say("check", "Daniel said yes. Thursday night is covered.", true)}
      ${say("triangle-alert", "That would be his third night in a row.")}
      ${say("send", "Next week is ready. Publish the rota?")}
    </div>`);

  // 1.6 Business cards: four designs in two rows that drift opposite ways. The light stands still at --lx,
  // so each card's edge highlight and the emboss of its mark shift as the card passes under it.
  const CARDS = {
    a: () => `<div class="bcard ka mat" style="--cx:%CX%">${mark(190)}</div>`,
    b: () => `<div class="bcard kb mat" style="--cx:%CX%">${logo(30)}<div><b class="n">Claire Donovan</b><span>Ward Manager · 4B Cardiology<br />claire.donovan@northmere.example<br />+44 20 7946 0142</span></div></div>`,
    c: () => `<div class="bcard kc mat" style="--cx:%CX%">${pic("lilac", "blobs", 22, `data-seed="4" data-level="0.52"`)}${logo(28)}</div>`,
    d: () => `<div class="bcard kd mat" style="--cx:%CX%">${mark(430)}<span>wardgrid.example</span></div>`,
  };
  const cardRow = (order, top, back) => `<div class="rowc ${back ? "back" : ""}" style="top:${top}px">${[...order, ...order].map((key, i) => CARDS[key]().replace("%CX%", i * 568 + 260)).join("")}</div>`;
  S["1.6"] = () => slide("s16", "#000", cardRow("abcd", 240, false) + cardRow("cdab", 630, true));

  // 1.7 A staff badge.
  S["1.7"] = () => slide("s17", "#000", `<div class="badge mat"><span class="slot"></span>
    <div class="top">${pic("blue", "mark", 20, `data-seed="2"`)}</div>
    <div class="who"><b>Claire Donovan</b><span class="mono">WARD MANAGER · 4B CARDIOLOGY</span></div>
    <div class="foot">${logo(30)}<span>Northmere General</span></div></div>`);

  // 1.8 Letterhead and envelope.
  S["1.8"] = () => slide("s18", "#000", `
    <div class="sheet mat"><div class="head">${logo(28)}<span>Wardgrid Ltd<br />14 Harbour Road<br />Northmere NM4 2WG<br />hello@wardgrid.example</span></div>
      <div class="to">Ms Claire Donovan<br />Ward 4B, Northmere General Hospital<br />16 November 2026</div>
      <h4>Your first week on Wardgrid</h4>
      <p>Dear Claire,</p>
      <p>Ward 4B published its first rota on Monday. Of 104 shifts, 99 were covered before the week began, and the five that opened later were each taken within the hour.</p>
      <p>Nobody on your team worked a third night in a row, and nobody was phoned at home. That is the whole idea.</p>
      <p>Next week we will add the surgical wards. Your notes on the rules screen are with our team.</p>
      <div class="sign">With thanks,<b>Imogen Hale</b>Customer lead</div>
      <div class="cells">${pic("paper", "mark", 11, `data-seed="3" data-dots="off"`)}</div></div>
    <div class="env mat"><i class="flap"></i>${logo(34)}<div class="addr">Ms Claire Donovan<br />Ward 4B, Northmere General Hospital<br />2 Kestrel Way<br />Northmere NM1 7AH</div></div>`);

  // 1.9 Three social posts.
  S["1.9"] = () => slide("s19", "#000", `
    <div class="post mat" style="left:80px;background:#1d3be3"><h4>Thursday night, covered in four minutes.</h4>${logo(30)}</div>
    <div class="post mat" style="left:570px;background:#f1f2f6"><div class="pp">${pic("paper", "mark", 20, `data-seed="6"`)}</div><span class="tag">${logo(26)}</span></div>
    <div class="post mat" style="left:1060px;background:#cbc6ff;color:#0a0c1c"><div><div class="big" style="color:#1d3be3">99/104</div><p>shifts covered before the week began on Ward 4B.</p></div><span style="color:#1d3be3">${logo(30)}</span></div>`);

  // 1.10 The profile page of the brand on a social network.
  S["1.10"] = () => slide("s110", "#000", `<div class="card">
    <div class="cover grain">${logo(120)}</div><div class="av">${mark(124)}</div><div class="follow">Follow</div>
    <div class="info"><b>Wardgrid</b><span class="at">@wardgrid</span>
      <p>Rota and shift cover for hospital wards. Every shift covered, nobody phoned at home.</p>
      <div class="meta"><span>wardgrid.example</span><span>Northmere, UK</span><span><b>1,204</b> following</span><span><b>18.6k</b> followers</span></div></div></div>`);

  // 1.11 Two posters: the blue picture with the promise, and one built from pieces of the rota.
  const posterCells = "eelnx elnxe lnoee nxeel xeeln eelnx".split(" ").map((row) => [...row].map((k) => `<i class="${k}">${{ e: "Early", l: "Late", n: "Night", o: "Open", x: "" }[k]}</i>`).join("")).join("");
  S["1.11"] = () => slide("s111", "#000", `
    <div class="poster p1 grain"><div class="small"><span>Rota and shift cover<br />for hospital wards</span><span>wardgrid.example</span></div><h4>Every<br />shift<br />covered.</h4>${logo(84)}</div>
    <div class="poster p2 mat"><div class="cells">${posterCells}</div><h4>This one is<br />still open.</h4>${logo(52)}<span class="url">wardgrid.example</span></div>`);

  // 1.12 A small tool: the visitor makes a brand picture and saves it.
  const EDIT_SETS = ["blue", "paper", "lilac", "ink", "night"], EDIT_FIELDS = [["blobs", "Cells"], ["wave", "Waves"], ["rise", "Tide"], ["mark", "Mark"]];
  S["1.12"] = () => slide("s112", "#000", `
    <div class="stage">${pic("blue", "blobs", 28, `id="edit" data-live data-ratio="2"`)}</div>
    <div class="panel">${logo(40)}
      <label>Colour<div class="chips">${EDIT_SETS.map((set, i) => `<button class="${i ? "" : "on"}" data-edit-set="${set}" style="background:${WG.SETS[set].bg}" aria-label="${set}"></button>`).join("")}</div></label>
      <label>Pattern<div class="seg">${EDIT_FIELDS.map(([key, name], i) => `<button class="${i ? "" : "on"}" data-edit-field="${key}">${name}</button>`).join("")}</div></label>
      <label>Cell size<input type="range" min="12" max="64" value="28" data-edit="cell" /></label>
      <label>Cover<input type="range" min="30" max="70" value="50" data-edit="level" /></label>
      <div class="acts"><button data-edit-shuffle>Shuffle</button><button class="save" data-edit-save>${ic("download", 22)}Save PNG</button></div>
    </div>`);

  // The editor's controls. One listener for the page; it does nothing until slide 1.12 is on it.
  const editing = () => document.getElementById("edit");
  const redraw = (canvas) => WG.drawPicture(canvas, performance.now() / 1000);
  document.addEventListener("click", (event) => {
    const canvas = editing(), button = event.target.closest("button");
    if (!canvas || !button || !button.closest(".s112")) return;
    const choose = (key, value) => { canvas.dataset[key] = value; button.parentElement.querySelectorAll("button").forEach((other) => other.classList.toggle("on", other === button)); };
    if (button.dataset.editSet) choose("set", button.dataset.editSet);
    if (button.dataset.editField) choose("field", button.dataset.editField);
    if ("editShuffle" in button.dataset) canvas.dataset.seed = Math.ceil(Math.random() * 999);
    redraw(canvas);
    if ("editSave" in button.dataset) { const link = document.createElement("a"); link.download = "wardgrid-picture.png"; link.href = canvas.toDataURL("image/png"); link.click(); }
  });
  document.addEventListener("input", (event) => {
    const canvas = editing(), key = event.target.dataset.edit;
    if (!canvas || !key) return;
    canvas.dataset[key] = key === "level" ? (100 - event.target.value) / 100 : event.target.value;
    redraw(canvas);
  });

  // After slides are on the page: icons become SVGs, and the ones on 1.4 get a path length of 1 so they can be drawn.
  window.brandReady = () => {
    WG.icons();
    document.querySelectorAll(".s14 svg").forEach((svg) => [...svg.children].forEach((part) => { part.setAttribute("pathLength", "1"); part.style.setProperty("--i", svg.style.getPropertyValue("--i")); }));
    WG.pictures();
  };
})();
