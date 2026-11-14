// The Wardgrid sales deck: ten 1600 x 900 slides. window.DECK[n - 1]() returns slide n as HTML.
//   deck.html            all ten, one under another
//   deck.html?only=4     one slide alone (for a picture of it)
// The case page (case.js) draws the same slides, scaled, on its slides 2.1–2.6.
(() => {
  const { mark, logo, ic } = WG;
  const d = (cls, inner) => `<div class="d ${cls}">${inner}</div>`;
  const foot = (n) => `<div class="d-foot"><span>${logo(22)}</span><em>${String(n).padStart(2, "0")} / 10</em></div>`;
  const lbl = (text) => `<p class="d-lbl">${text}</p>`;
  const cells = "eelnx elnxe lnoee nxeel xeeln".split(" ").map((row) => [...row].map((k) => `<i class="${k}">${{ e: "Early", l: "Late", n: "Night", o: "Open", x: "" }[k]}</i>`).join("")).join("");
  const phone = (name) => `<div class="d-phone" style="background-image:url(app/${name}.webp)"></div>`;
  const steps = [["moon", "A shift opens", "Someone is off sick. The cell turns open."], ["users", "The right people are asked", "Rested, inside their hours, right skills."], ["smartphone", "One of them says yes", "One tap on the phone, no calls."], ["check-check", "The rota closes the gap", "Rules checked again, everyone told."]];
  const rules = [["bed", "Rest between shifts", "11 h"], ["moon", "Nights in a row", "2"], ["clock", "Hours in a week", "48 h"], ["stethoscope", "Cardiac monitoring on every shift", "2 nurses"]];
  const plans = [["Ward", "£190", "per ward / month", "One to nine wards"], ["Hospital", "£150", "per ward / month", "Ten wards or more"], ["Trust", "Let's talk", "", "A group of hospitals"]];

  window.DECK = [
    () => d("d1 grain", `<div class="d-top">${logo(34)}<span>Sales deck · November 2026</span></div><h1>Every shift<br />covered.</h1><p class="d-sub">Rota and shift cover for hospital wards</p>`),
    () => d("d2", `${lbl("The problem")}<h2>A ward runs on a grid. One empty cell, and the day starts on the phone.</h2><div class="d-cells">${cells}</div>${foot(2)}`),
    () => d("d3", `${lbl("What it costs")}<div class="d-nums"><div><b>47 min</b><span>a ward manager spends covering one open shift by phone</span></div><div><b>1 in 8</b><span>shifts changes after the rota is published</span></div><div><b>£38</b><span>more per hour when the gap goes to an agency</span></div></div><div class="d-strip">${Array.from({ length: 24 }, (_, i) => `<i class="${[5, 13, 20].includes(i) ? "o" : ""}"></i>`).join("")}</div>${foot(3)}`),
    () => d("d4", `${lbl("The product")}<h2>One rota that checks itself.</h2><div class="d-win"><div class="d-bar"><i></i><i></i><i></i><span>app.wardgrid.example/ward-4b</span></div><img src="app/open.webp" alt="" /></div>${foot(4)}`),
    () => d("d5", `${lbl("How it works")}<h2>From an empty cell to a covered shift in four steps.</h2><div class="d-steps">${steps.map(([icon, what, why], i) => `<div><span>00${i + 1}</span><i>${ic(icon, 30)}</i><b>${what}</b><em>${why}</em></div>`).join("")}</div>${foot(5)}`),
    () => d("d6", `${lbl("Rules")}<h2>Your rules, checked on every change.</h2><div class="d-rules">${rules.map(([icon, what, value]) => `<div>${ic(icon, 26)}<b>${what}</b><span>${value}</span></div>`).join("")}<div class="bad">${ic("triangle-alert", 26)}<b>Leila, Friday night</b><span>3rd in a row</span></div></div><p class="d-note">A change that breaks a rule is never blocked. It is marked, and needs a reason before the rota is published.</p>${foot(6)}`),
    () => d("d7", `${lbl("For staff")}<h2>A push,<br />not a phone call.</h2><p class="d-note">People see what a shift means for their week before they answer: rest, hours, nights in a row.</p><div class="d-phones">${phone("m-week")}${phone("m-offer")}${phone("m-taken")}</div>${foot(7)}`),
    () => d("d8", `${lbl("Proof · Northmere General, 12 wards, first 90 days")}<div class="d-proof"><div><b>4 min</b><span>median time to cover an open shift</span></div><div><b>96%</b><span>of open shifts filled by the ward's own team</span></div><div><b>−71%</b><span>agency hours</span></div><div><b>0</b><span>calls to people at home</span></div></div><blockquote>“Now I open the rota and it is already whole.”<span>Claire Donovan, Ward manager</span></blockquote>${foot(8)}`),
    () => d("d9", `${lbl("Pricing")}<h2>Priced per ward. Everyone on the ward is included.</h2><div class="d-plans">${plans.map(([name, price, unit, who], i) => `<div class="${i === 1 ? "main" : ""}"><span>${name}</span><b>${price}</b><em>${unit}</em><p>${who}</p></div>`).join("")}</div>${foot(9)}`),
    () => d("d10 grain", `<div class="d-top">${logo(34)}<span>hello@wardgrid.example</span></div><h1>Start with<br />one ward.</h1><p class="d-sub">Four weeks, your own rota, no contract. We set it up with your ward manager in an afternoon.</p>`),
  ];

  // deck.html draws the slides itself; on the case page case.js does.
  const stage = document.getElementById("deck");
  if (!stage) return;
  const only = Number(new URLSearchParams(location.search).get("only"));
  if (only) document.body.classList.add("only");
  stage.innerHTML = (only ? [window.DECK[only - 1]] : window.DECK).map((slide) => slide()).join("");
  WG.icons();
  WG.pictures();
})();
