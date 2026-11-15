// Wardgrid, the product: a rota and shift-cover tool for one hospital ward. Invented data, no patients anywhere.
//   app.html?screen=rota        one screen, so it can be photographed (the list is in SCREENS below)
//   app.html?screen=open&play   the loop for the case: an open night shift is asked for, accepted and covered
//   ...&at=8.5                  the loop frozen at that second
//   app.html?panel=open&play    only the right-hand panel, as a loop: an open shift is asked for and covered
//   app.html?panel=conflict&play  only the panel: a rule conflict is fixed by a swap
// Screens whose name starts with "m-" are the phone app (390 px wide) of a nurse.
(() => {
  const { logo, mark, ic } = WG;
  const query = new URLSearchParams(location.search);
  const screen = query.get("screen") || "rota";

  // ---------- Data: Ward 4B, week 16–22 November 2026. "Now" is Thursday 19 November, 14:12. ----------
  const DAYS = [["Mon", 16], ["Tue", 17], ["Wed", 18], ["Thu", 19], ["Fri", 20], ["Sat", 21], ["Sun", 22]];
  const KIND = { E: ["Early", "07:00–15:00", "07–15"], L: ["Late", "13:00–21:00", "13–21"], N: ["Night", "21:00–07:30", "21–07"] };
  // Week letters: E early, L late, N night, - off, ! a night that breaks a rule, s a late with a swap waiting, k sick.
  const GROUPS = [
    ["Nurses", 14, [
      ["Amara Okafor", "EEL--L-", 32], ["Daniel Reyes", "LLE--E-", 32], ["Priya Nair", "EEE--s-", 32],
      ["Hannah Whitfield", "NN-k-EL", 36.5], ["Leila Haddad", "E-NN!--", 39.5], ["Tomasz Zielinski", "--LL--E", 24], ["Sofia Marin", "LE-E-LL", 40],
    ]],
    ["Doctors", 6, [["Dr Ellen Park", "EEE-N--", 34.5], ["Dr Samir Rahman", "-NN-EEE", 45], ["Dr Jonas Weber", "L--EE-s", 32]]],
    ["Healthcare assistants", 5, [["Ruth Castillo", "EE-LL--", 32], ["Ben Ashworth", "-LLE-NN", 45]]],
  ];
  const OPEN = { 1: "L", 3: "N", 4: "E", 5: "N", 6: "N" }; // day index → kind of the open shift
  const initials = (name) => name.replace("Dr ", "").split(" ").map((word) => word[0]).join("");
  const avatar = (name, size = 28) => `<span class="av" style="width:${size}px;height:${size}px;font-size:${size * 0.38}px">${initials(name)}</span>`;

  // ---------- Pieces ----------
  const NAV = [["rota", "calendar-days", "Rota"], ["open", "moon", "Open shifts", 5], ["swaps", "repeat", "Swaps", 3], ["staff", "users", "Staff"], ["rules", "shield-check", "Rules"], ["reports", "chart-no-axes-column", "Reports"]];
  const WARDS = [["4B · Cardiology", 99, 104], ["2A · Surgical", 118, 118], ["6C · Elderly care", 87, 92], ["Emergency dept", 140, 146]];
  const side = (active, openCount = 5) => `<aside class="side">
    <div class="brand">${logo(21)}</div>
    <nav>${NAV.map(([key, icon, name, count]) => `<a class="${key === active ? "on" : ""}">${ic(icon, 18)}<span>${name}</span>${count ? `<em class="${key === "open" ? "hot" : ""}">${key === "open" ? openCount : count}</em>` : ""}</a>`).join("")}</nav>
    <div class="lbl">Wards</div>
    <div class="wards">${WARDS.map(([name, done, all], i) => `<a class="${i ? "" : "on"}"><span>${name}</span><em>${i ? done : 104 - openCount}/${all}</em><i style="--p:${((i ? done : 104 - openCount) / all) * 100}%"></i></a>`).join("")}</div>
    <div class="me">${avatar("Claire Donovan", 34)}<div><b>Claire Donovan</b><span>Ward manager</span></div>${ic("chevrons-up-down", 16)}</div>
  </aside>`;

  const split = (text, more = "") => `<button class="split ${more}"><span>${text}</span><i>${ic("arrow-right", 16)}</i></button>`;
  const top = (title, sub, right = "") => `<header class="top"><div><h1>${title}</h1><p>${sub}</p></div><div class="acts">${right}</div></header>`;
  const tiles = (covered, open, conflicts = 2, swaps = 3) => `<div class="tiles">
    <div class="tile wide"><span class="lbl">Shifts covered</span><b>${covered}<small> / 104</small></b><div class="strip">${Array.from({ length: 104 }, (_, i) => `<i class="${i >= covered ? "o" : ""}"></i>`).join("")}</div></div>
    <div class="tile"><span class="lbl">Open shifts</span><b class="${open ? "hot" : ""}">${open}</b><span class="hint">${open ? "next starts in 6 h 48 min" : "nothing to cover"}</span></div>
    <div class="tile"><span class="lbl">Rule conflicts</span><b>${conflicts}</b><span class="hint">third night in a row</span></div>
    <div class="tile"><span class="lbl">Swaps waiting</span><b>${swaps}</b><span class="hint">oldest 2 h ago</span></div>
  </div>`;

  // The week grid. opts: selected "open:3" or "Leila Haddad:4", coveredBy (name), pending (offline marks), blank (no rota yet).
  function grid(opts = {}) {
    const cell = (kind, more = "", label) => `<div class="c ${kind} ${more}"><b>${label || KIND[kind][0]}</b><span>${KIND[kind] ? KIND[kind][2] : ""}</span></div>`;
    let html = `<div class="g-head"><span>Showing 12 of 25 staff</span></div>${DAYS.map(([name, date], d) => `<div class="g-day ${d === 3 && !opts.blank ? "today" : ""}"><b>${name}</b> ${opts.blank ? date + 7 : date}</div>`).join("")}`;
    html += `<div class="g-who open">${ic("moon", 16)}Needs cover</div>${DAYS.map((_, d) => {
      const kind = OPEN[d];
      if (opts.blank) return `<div class="c o blank"><b>4 open</b></div>`;
      if (!kind || (opts.coveredBy && d === 3)) return `<div class="c off"></div>`;
      return `<div class="c o ${opts.selected === `open:${d}` ? "sel" : ""}"><b>${KIND[kind][0]}</b><span>open</span></div>`;
    }).join("")}`;
    for (const [title, count, rows] of GROUPS) {
      html += `<div class="g-group">${title} · ${count}</div>`;
      for (const [name, week, hours] of rows) {
        const took = opts.coveredBy === name;
        html += `<div class="g-who">${avatar(name)}<span>${name}</span><em>${took ? hours + 10.5 : hours} h</em></div>`;
        html += [...week].map((kind, d) => {
          const sel = opts.selected === `${name}:${d}` ? "sel" : "";
          if (opts.blank) return `<div class="c off blank"></div>`;
          if (took && d === 3) return `<div class="c N just"><b>Night</b><span>21–07</span></div>`;
          if (kind === "-") return `<div class="c off"></div>`;
          if (kind === "k") return `<div class="c sick"><b>Sick</b></div>`;
          if (kind === "!") return `<div class="c N bad ${sel}">${ic("triangle-alert", 14)}<b>Night</b><span>3rd</span></div>`;
          if (kind === "s") return `<div class="c L swap">${ic("repeat", 14)}<b>Late</b><span>swap</span></div>`;
          return cell(kind, `${sel} ${opts.pending && opts.pending.includes(`${name}:${d}`) ? "pend" : ""}`);
        }).join("");
      }
    }
    return `<div class="grid">${html}</div>`;
  }

  // ---------- The panel on the right ----------
  const CANDIDATES = [
    ["Amara Okafor", "32 h this week · 24 h rest before"],
    ["Daniel Reyes", "32 h this week · 30 h rest before"],
    ["Priya Nair", "32 h this week · 30 h rest before"],
  ];
  const shiftHead = (tag, hot) => `<div class="p-tag ${hot ? "hot" : ""}">${tag}</div><h2>Night · Thu 19 Nov</h2><p class="p-meta">21:00–07:30 · Registered nurse · Cardiac monitoring</p>`;
  const reason = `<div class="p-note">${ic("thermometer", 16)}<span>Hannah Whitfield called in sick at 14:10.<br /><b>Starts in 6 h 48 min.</b></span></div>`;
  const cand = ([name, facts], state) => `<div class="cand ${state ? state[0] : ""}">${avatar(name, 36)}<div><b>${name}</b><span>${facts}</span></div>${state ? `<em>${state[1]}</em>` : `<button>Ask</button>`}</div>`;
  const blocked = `<div class="cand no">${avatar("Sofia Marin", 36)}<div><b>Sofia Marin</b><span>Only 6 h rest after today's Early</span></div><em>${ic("ban", 14)}</em></div>`;
  const PANELS = {
    open: () => `${shiftHead("Open shift", true)}${reason}<div class="lbl">3 of 23 can cover</div>${CANDIDATES.map((person) => cand(person)).join("")}${blocked}
      <div class="p-foot">${split("Ask all three", "full")}<button class="ghost">Request bank staff</button></div>`,
    asked: (states = [["wait", "Sent"], ["wait", "Seen"], ["wait", "Sent"]], foot = "Asked 3 people · 1 min ago") => `${shiftHead("Open shift", true)}${reason}<div class="lbl">${foot}</div>${CANDIDATES.map((person, i) => cand(person, states[i])).join("")}${blocked}
      <div class="p-foot"><button class="ghost">Remind in 10 min</button><button class="ghost">Request bank staff</button></div>`,
    covered: () => `<div class="p-tag ok">Covered</div><h2>Night · Thu 19 Nov</h2><p class="p-meta">21:00–07:30 · Registered nurse · Cardiac monitoring</p>
      <div class="done"><div class="done-pic"><canvas class="pic" data-set="blue" data-field="mark" data-cell="9" data-dots="off" data-seed="5"></canvas></div><b>Daniel Reyes took it.</b><span>Accepted 14:18, four minutes after you asked.</span></div>
      <div class="lbl">Checked against ward rules</div>
      ${[["30 h rest before the shift", "min 11 h"], ["42.5 h this week", "max 48 h"], ["1st night in a row", "max 2"], ["Cardiac monitoring", "skill match"]].map(([what, rule]) => `<div class="check">${ic("check", 16)}<span>${what}</span><em>${rule}</em></div>`).join("")}
      <div class="p-foot">${split("Done", "full")}<button class="ghost">Undo</button></div>`,
    nobody: () => `${shiftHead("Open shift", true)}<div class="p-note bad">${ic("circle-off", 16)}<span><b>Nobody could take it.</b><br />Three asked, three declined. Starts in 5 h 20 min.</span></div><div class="lbl">What you can do</div>
      ${[["building-2", "Ask Ward 2A", "Two nurses there are free tonight"], ["users", "Request bank staff", "Usually answered within 40 min"], ["scissors", "Split the shift", "21:00–02:00 and 02:00–07:30"], ["phone", "Call the duty manager", "Extension 4120"]].map(([icon, what, why], i) => `<div class="opt ${i ? "" : "first"}">${ic(icon, 18)}<div><b>${what}</b><span>${why}</span></div>${ic("arrow-right", 16)}</div>`).join("")}
      <div class="p-foot"><button class="ghost">See who declined and why</button></div>`,
    conflict: () => `<div class="p-tag hot">Rule conflict</div><h2>Night · Fri 20 Nov</h2><p class="p-meta">Leila Haddad · 21:00–07:30</p>
      <div class="p-note bad">${ic("triangle-alert", 16)}<span><b>Third night in a row.</b><br />Ward 4B allows two. She has worked Wed and Thu.</span></div>
      <div class="lbl">Ways to fix it</div>
      ${[["repeat", "Swap with Tomasz Zielinski", "His Early on Sun for this Night · all rules pass"], ["moon", "Move it to open shifts", "5 people can cover Friday night"], ["pen-line", "Allow once", "Needs a reason, shown in the report"]].map(([icon, what, why], i) => `<div class="opt ${i ? "" : "first"}">${ic(icon, 18)}<div><b>${what}</b><span>${why}</span></div>${ic("arrow-right", 16)}</div>`).join("")}
      <div class="lbl">Leila this week</div><div class="mini">${[..."E-NN!--"].map((kind, d) => `<i class="${kind === "-" ? "" : kind === "!" ? "bad" : kind}"><b>${DAYS[d][0][0]}</b></i>`).join("")}</div>
      <div class="p-foot">${split("Swap with Tomasz", "full")}</div>`,
  };
  const panel = (inner) => `<aside class="panel">${inner}</aside>`;
  const weekActs = `<div class="week"><i>${ic("chevron-left", 16)}</i><b>16–22 Nov</b><i>${ic("chevron-right", 16)}</i></div><div class="seg"><b>All</b><span>Nurses</span><span>Doctors</span><span>HCAs</span></div>${split("Publish rota")}`;
  const rotaView = (covered, open, gridOpts, panelHtml, banner = "") => `${side(panelHtml ? "open" : "rota", open)}<main class="main ${panelHtml ? "narrow" : ""}">${banner}${top("Ward 4B · Cardiology", "Thu 19 Nov, 14:12 · rota published Mon 9 Nov", weekActs)}${tiles(covered, open)}${grid(gridOpts)}</main>${panelHtml ? panel(panelHtml) : ""}`;

  // ---------- Other screens ----------
  const page = (active, title, sub, acts, inner) => `${side(active)}<main class="main">${top(title, sub, acts)}${inner}</main>`;
  const chip = (text, kind = "") => `<span class="chip ${kind}">${text}</span>`;
  const SWAPS = [
    ["Priya Nair", "Tomasz Zielinski", "Sat 21 · Late", "Sun 22 · Early", "All rules pass", "2 h ago", ""],
    ["Dr Jonas Weber", "Dr Ellen Park", "Sun 22 · Late", "Fri 20 · Night", "All rules pass", "1 h ago", ""],
    ["Ben Ashworth", "Ruth Castillo", "Sat 21 · Night", "Fri 20 · Late", "Ruth has leave booked on Sat 21 Nov", "35 min ago", "bad"],
    ["Sofia Marin", "Amara Okafor", "Tue 17 · Early", "Thu 19 · Late", "Approved by you · Mon 16 Nov", "", "past"],
    ["Daniel Reyes", "Hannah Whitfield", "Wed 18 · Early", "Tue 17 · Night", "Declined · skill mix on Tuesday night", "", "past"],
  ];
  const STAFF = [["Amara Okafor", "Staff nurse", 37.5, 32, 2, ["Cardiac monitoring", "IV"], "On shift"], ["Daniel Reyes", "Staff nurse", 37.5, 32, 4, ["Cardiac monitoring"], "Off today"], ["Priya Nair", "Staff nurse", 37.5, 32, 1, ["Cardiac monitoring", "IV", "Mentor"], "Off today"], ["Hannah Whitfield", "Staff nurse", 37.5, 36.5, 5, ["Cardiac monitoring"], "Sick"], ["Leila Haddad", "Staff nurse", 37.5, 39.5, 6, ["IV"], "On tonight"], ["Tomasz Zielinski", "Staff nurse", 30, 24, 0, ["Cardiac monitoring", "IV"], "On shift"], ["Sofia Marin", "Staff nurse", 37.5, 40, 2, ["IV", "Mentor"], "On shift"], ["Dr Ellen Park", "Registrar", 40, 34.5, 3, ["Cardiology"], "Off today"], ["Dr Samir Rahman", "Senior house officer", 40, 45, 5, ["Cardiology"], "On shift"], ["Ruth Castillo", "Healthcare assistant", 37.5, 32, 0, ["Phlebotomy"], "On shift"]];
  const RULES = [["bed", "Rest between shifts", "At least", "11 h", true], ["moon", "Nights in a row", "No more than", "2", true], ["clock", "Hours in a week", "No more than", "48 h", true], ["stethoscope", "Skill mix on every shift", "At least", "2 nurses with cardiac monitoring", true], ["list-ordered", "Who is asked first", "Order", "Fewest hours this week", true], ["users", "Escalate to bank staff", "If nobody answers in", "30 min", false]];

  const SCREENS = {
    rota: () => rotaView(99, 5, {}),
    open: () => rotaView(99, 5, { selected: "open:3" }, PANELS.open()),
    asked: () => rotaView(99, 5, { selected: "open:3" }, PANELS.asked([["no", "Declined"], ["wait", "Seen"], ["wait", "Sent"]], "Asked 3 people · 3 min ago")),
    covered: () => rotaView(100, 4, { coveredBy: "Daniel Reyes" }, PANELS.covered()),
    nobody: () => rotaView(99, 5, { selected: "open:3" }, PANELS.nobody()),
    conflict: () => rotaView(99, 5, { selected: "Leila Haddad:4" }, PANELS.conflict()),
    offline: () => rotaView(99, 5, { pending: ["Tomasz Zielinski:2", "Sofia Marin:5"] }, "", `<div class="banner">${ic("wifi-off", 18)}<span><b>You are offline.</b> Two changes are saved on this computer and will be sent when the connection is back.</span><button>Try now</button></div>`),
    empty: () => `${side("rota")}<main class="main">${top("Ward 4B · Cardiology", "Week 23–29 Nov · no rota yet", `<div class="week"><i>${ic("chevron-left", 16)}</i><b>23–29 Nov</b><i>${ic("chevron-right", 16)}</i></div>`)}
      <div class="blankwrap">${grid({ blank: true })}<div class="blankcard">${mark(44)}<h2>No rota for 23–29 Nov yet</h2><p>104 shifts to fill. Start from last week and Wardgrid will flag every clash with leave, rest and skills.</p><div>${split("Copy last week")}<button class="ghost">Start from a pattern</button></div><span>Leave approved for this week: Priya Nair (Mon–Wed), Dr Ellen Park (Fri)</span></div></div></main>`,
    swaps: () => page("swaps", "Swaps", "3 waiting for you · 14 approved this month", `<div class="seg"><b>Waiting</b><span>All</span></div>`, `<div class="list">${SWAPS.map(([a, b, give, take, check, when, kind]) => `<div class="swaprow ${kind}">
      <div class="pair"><div>${avatar(a, 36)}<div><b>${a}</b><span>gives ${give}</span></div></div>${ic("repeat", 18)}<div>${avatar(b, 36)}<div><b>${b}</b><span>gives ${take}</span></div></div></div>
      <div class="verdict">${ic(kind === "bad" ? "triangle-alert" : kind === "past" ? "check-check" : "shield-check", 16)}<span>${check}</span></div>
      <div class="when">${when}</div>${kind === "past" ? "" : `<div class="btns"><button class="ghost">Decline</button>${kind === "bad" ? `<button class="ghost">Suggest another</button>` : split("Approve")}</div>`}</div>`).join("")}</div>
      <div class="lbl" style="margin-top:10px">November on Ward 4B</div><div class="stats">${[["14", "swaps approved", 82], ["2", "declined", 12], ["38 min", "median time to an answer", 40], ["0", "swaps that broke a rule", 0]].map(([n, what, p]) => `<div class="card"><b class="num">${n}</b><span class="hint">${what}</span><div class="meter"><i style="--p:${p}%"></i></div></div>`).join("")}</div>
      <div class="card"><span class="lbl">Shifts people ask to swap most</span><div class="mini wide">${DAYS.map(([name], d) => `<i class="${"LEENNLE"[d]}"><b>${name}</b><span>${["1 swap", "3 swaps", "2 swaps", "none", "4 swaps", "3 swaps", "1 swap"][d]}</span></i>`).join("")}</div></div>`),
    staff: () => page("staff", "Staff", "25 people on Ward 4B · 3 on leave next week", `<div class="search">${ic("search", 16)}<span>Search by name or skill</span></div>${split("Add person")}`, `<div class="table"><div class="tr th"><span>Name</span><span>Contract</span><span>This week</span><span>Nights this month</span><span>Skills</span><span>Today</span></div>${STAFF.map(([name, role, contract, hours, nights, skills, status]) => `<div class="tr"><span class="nm">${avatar(name, 32)}<span><b>${name}</b><em>${role}</em></span></span><span>${contract} h</span><span class="bar"><i style="--p:${Math.min(100, (hours / 48) * 100)}%" class="${hours > contract ? "over" : ""}"></i><b>${hours} h</b></span><span>${nights} of 6</span><span>${skills.map((skill) => chip(skill)).join("")}</span><span>${chip(status, status === "Sick" ? "hot" : status.startsWith("On") ? "on" : "")}</span></div>`).join("")}</div>`),
    profile: () => page("staff", "Daniel Reyes", "Staff nurse · Ward 4B since March 2023", `<button class="ghost">${ic("message-circle", 16)}Message</button>${split("Edit")}`, `<div class="prof">
      <div class="card big">${avatar("Daniel Reyes", 72)}<div><span class="lbl">This week</span><div class="mini wide">${[..."LLE--E-"].map((kind, d) => `<i class="${kind === "-" ? "" : kind}"><b>${DAYS[d][0]} ${DAYS[d][1]}</b><span>${kind === "-" ? "off" : KIND[kind][0]}</span></i>`).join("")}</div></div></div>
      <div class="card"><span class="lbl">Hours this week</span><b class="num">32<small> / 37.5 h</small></b><div class="meter"><i style="--p:67%"></i></div><span class="hint">Room for one more shift before overtime</span></div>
      <div class="card"><span class="lbl">Nights this month</span><b class="num">4<small> of 6</small></b><div class="meter"><i style="--p:66%"></i></div><span class="hint">Last night shift Sat 14 Nov</span></div>
      <div class="card"><span class="lbl">Open shifts covered</span><b class="num">3<small> this month</small></b><div class="meter"><i style="--p:38%"></i></div><span class="hint">Answers in 6 min on average</span></div>
      <div class="card tall"><span class="lbl">Preferences</span>${[["sun", "No Sundays", "Agreed until January"], ["moon", "Happy to take nights", "Up to 2 in a row"], ["bell", "Ask by push, then text", "Not before 07:00"], ["graduation-cap", "Cardiac monitoring", "Renewed June 2026"]].map(([icon, what, why]) => `<div class="opt">${ic(icon, 18)}<div><b>${what}</b><span>${why}</span></div></div>`).join("")}</div>
      <div class="card tall"><span class="lbl">Last four weeks</span><div class="weeks">${[["19–25 Oct", "NN--EEL"], ["26 Oct–1 Nov", "EE-LL--"], ["2–8 Nov", "-LLNN--"], ["9–15 Nov", "EEL--N-"]].map(([week, days]) => `<span>${week}</span><div class="mini">${[...days].map((kind) => `<i class="${kind === "-" ? "" : kind}"></i>`).join("")}</div>`).join("")}</div><span class="hint">150 h worked · 5 nights · 2 open shifts covered</span></div>
      <div class="card tall"><span class="lbl">Coming up</span>${[["Sat 21 Nov", "Early", "07:00–15:00", "Ward 4B"], ["Mon 23 Nov", "Late", "13:00–21:00", "Ward 4B"], ["Tue 24 Nov", "Late", "13:00–21:00", "Ward 4B"], ["Thu 26 Nov", "Night", "21:00–07:30", "Ward 2A · cover"]].map(([day, kind, time, where]) => `<div class="up"><b>${day}</b><i class="c ${kind[0]}"><b>${kind}</b></i><span>${time}</span><em>${where}</em></div>`).join("")}</div></div>`),
    rules: () => page("rules", "Rules", "Checked on every change to the rota of Ward 4B", split("Add rule"), `<div class="rules">${RULES.map(([icon, what, how, value, on]) => `<div class="rule"><i class="ri">${ic(icon, 20)}</i><div><b>${what}</b><span>${how}</span></div><div class="val">${value}</div><i class="tog ${on ? "on" : ""}"></i></div>`).join("")}
      <div class="rulenote">${ic("info", 16)}<span>Rules never block you. A change that breaks one is marked on the rota and needs a reason before it is published.</span></div></div>`),
  };

  // ---------- The phone app of a nurse (Daniel Reyes) ----------
  const status = `<div class="m-status"><b>14:16</b><span>${ic("signal", 16)}${ic("wifi", 16)}${ic("battery-full", 20)}</span></div>`;
  const phoneTop = (title, back) => `${status}<header class="m-top">${back ? ic("chevron-left", 22) : `<span style="color:var(--blue)">${mark(26)}</span>`}<b>${title}</b>${back ? `<i></i>` : avatar("Daniel Reyes", 32)}</header>`;
  const tabs = (on) => `<nav class="m-tabs">${[["calendar-days", "My week"], ["moon", "Open"], ["repeat", "Swaps"], ["user", "Me"]].map(([icon, name], i) => `<a class="${i === on ? "on" : ""}">${ic(icon, 22)}<span>${name}</span></a>`).join("")}</nav>`;
  const myWeek = [["Mon 16", "L"], ["Tue 17", "L"], ["Wed 18", "E"], ["Thu 19", "-"], ["Fri 20", "-"], ["Sat 21", "E"], ["Sun 22", "-"]];
  const offerFacts = [["bed", "30 h rest before it", "You finished Wed 15:00"], ["clock", "42.5 h this week", "5 h paid as overtime"], ["moon", "Your 1st night in a row", "Ward allows 2"]];
  const PHONE = {
    "m-week": () => `${phoneTop("My week")}<div class="m-body"><div class="m-offer"><span class="p-tag hot">Open shift · Ward 4B</span><b>Tonight, 21:00–07:30</b><span>Hannah is off sick. Can you take it?</span><div><button class="m-btn">See shift</button><button class="m-btn ghost">Not this time</button></div></div>
      <div class="lbl">16–22 November · 32 h</div>${myWeek.map(([day, kind], i) => `<div class="m-day ${i === 3 ? "today" : ""}"><b>${day}</b>${kind === "-" ? `<span class="off">Off</span>` : `<i class="c ${kind}"><b>${KIND[kind][0]}</b></i><span>${KIND[kind][1]}</span>`}</div>`).join("")}</div>${tabs(0)}`,
    "m-offer": () => `${phoneTop("Open shift", true)}<div class="m-body"><div class="m-hero"><canvas class="pic" data-set="night" data-field="rise" data-cell="15" data-seed="8" data-level="0.6" data-dots="off" data-clear="div" data-clear-pad="14"></canvas><div><span>Night · Ward 4B Cardiology</span><b>Thu 19 Nov<br />21:00–07:30</b></div></div>
      <div class="lbl">If you take it</div>${offerFacts.map(([icon, what, why]) => `<div class="opt">${ic(icon, 20)}<div><b>${what}</b><span>${why}</span></div>${ic("check", 18)}</div>`).join("")}
      <div class="m-ask"><span>Asked by Claire Donovan at 14:14</span><button class="m-btn big">Take this shift</button><button class="m-btn ghost big">I can't</button></div></div>`,
    "m-taken": () => `${status}<div class="m-full"><canvas class="pic" data-set="blue" data-field="rise" data-cell="15" data-seed="3" data-level="0.6" data-dots="off" data-clear=".m-done, .m-ask" data-clear-pad="16"></canvas><div class="m-done">${mark(64)}<b>It's yours.</b><span>Thursday night, Ward 4B.<br />Claire has been told.</span></div><div class="m-ask"><button class="m-btn light big">Add to my calendar</button><button class="m-btn clear big">Back to my week</button></div></div>`,
    "m-swap": () => `${phoneTop("Swap a shift", true)}<div class="m-body"><div class="lbl">You give</div><div class="m-day today"><b>Sat 21</b><i class="c E"><b>Early</b></i><span>07:00–15:00</span></div>
      <div class="lbl">Who can take it · rules checked</div>${[["Tomasz Zielinski", "gives Sun 22 · Early", true], ["Sofia Marin", "gives Sun 22 · Late", false], ["Amara Okafor", "gives Mon 23 · Early", false]].map(([name, gives, on]) => `<div class="cand ${on ? "pick" : ""}">${avatar(name, 40)}<div><b>${name}</b><span>${gives}</span></div><i class="radio"></i></div>`).join("")}
      <div class="cand no">${avatar("Leila Haddad", 40)}<div><b>Leila Haddad</b><span>Finishes a night that morning</span></div>${ic("ban", 16)}</div>
      <div class="m-ask"><span>Claire approves swaps, usually within the hour</span><button class="m-btn big">Send request</button></div></div>`,
  };

  // ---------- Draw ----------
  const root = document.getElementById("app");
  const draw = (html) => { root.innerHTML = html; WG.icons(); WG.pictures(root); };
  if (PHONE[screen]) { document.body.classList.add("phone"); draw(PHONE[screen]()); return; }

// Two more states of the panel, used only by the conflict loop.
  const leilaWeek = (letters) => `<div class="mini">${[...letters].map((kind, d) => `<i class="${kind === "-" ? "" : kind === "!" ? "bad" : kind}"><b>${DAYS[d][0][0]}</b></i>`).join("")}</div>`;
  PANELS.offered = () => `<div class="p-tag hot">Rule conflict</div><h2>Night · Fri 20 Nov</h2><p class="p-meta">Leila Haddad · 21:00–07:30</p>
    <div class="p-note">${ic("repeat", 16)}<span><b>Swap offered to Tomasz.</b><br />His Early on Sunday for this Night. Sent 14:20.</span></div>
    <div class="lbl">Waiting for his answer</div>${cand(["Tomasz Zielinski", "24 h this week · 24 h rest before"], ["wait", "Seen"])}
    <div class="lbl">Leila, if he says yes</div>${leilaWeek("E-NN--E")}<div class="lbl">Tomasz, if he says yes</div>${leilaWeek("--LLN--")}
    <div class="p-foot"><button class="ghost">Cancel the offer</button></div>`;
  PANELS.fixed = () => `<div class="p-tag ok">Rules pass</div><h2>Night · Fri 20 Nov</h2><p class="p-meta">Tomasz Zielinski · 21:00–07:30</p>
    <div class="done"><b>Tomasz took Friday night.</b><span>Leila works Sunday Early instead. Both were told at 14:26.</span></div>
    <div class="lbl">Checked against ward rules</div>
    ${[["Leila: 2 nights in a row", "max 2"], ["Tomasz: 24 h rest before", "min 11 h"], ["Tomasz: 34.5 h this week", "max 48 h"], ["Cardiac monitoring on both shifts", "2 nurses"]].map(([what, rule]) => `<div class="check">${ic("check", 16)}<span>${what}</span><em>${rule}</em></div>`).join("")}
    <div class="lbl">Leila this week</div>${leilaWeek("E-NN--E")}
    <div class="p-foot">${split("Done", "full")}<button class="ghost">Undo</button></div>`;

  // A loop is a list of [second it begins, what to draw]; it is redrawn only when the stage changes.
  const frozen = query.get("at");
  const play = (stages, length) => {
    let shown = -1;
    const step = () => {
      if (WG.paused) return;
      const t = frozen === null ? (performance.now() / 1000) % length : Number(frozen) % length, now = stages.reduce((found, stage, i) => (t >= stage[0] ? i : found), 0);
      if (now !== shown) { shown = now; document.body.classList.toggle("playing", frozen === null); draw(stages[now][1]()); }
    };
    step();
    if (frozen === null) setInterval(step, 100);
  };
  const asking = [
    [0, () => PANELS.open()],
    [2.2, () => PANELS.asked([["wait", "Sent"], ["wait", "Sent"], ["wait", "Sent"]], "Asked 3 people · just now")],
    [3.8, () => PANELS.asked([["wait", "Seen"], ["wait", "Sent"], ["wait", "Seen"]], "Asked 3 people · 1 min ago")],
    [5.2, () => PANELS.asked([["no", "Declined"], ["wait", "Seen"], ["wait", "Seen"]], "Asked 3 people · 2 min ago")],
    [6.8, () => PANELS.asked([["no", "Declined"], ["yes", "Accepted"], ["wait", "Seen"]], "Asked 3 people · 4 min ago")],
    [7.8, () => PANELS.covered()],
  ];

  // Only the panel (slides 4.2 and 4.3 of the case).
  const solo = query.get("panel");
  if (solo) {
    document.body.classList.add("solo");
    const only = (inner, more = "") => `<aside class="panel ${more}">${inner}</aside>`;
    if (solo === "conflict") play([[0, () => only(PANELS.conflict())], [2.6, () => only(PANELS.conflict(), "pressing")], [3.3, () => only(PANELS.offered())], [6.6, () => only(PANELS.fixed())]], 12);
    else play(asking.map(([second, inner], i) => [second, () => only(inner(), i === 0 ? "" : "")]), 14);
    return;
  }

  if (!query.has("play")) { draw((SCREENS[screen] || SCREENS.rota)()); return; }

  // The whole screen: 14 seconds from "open" to "covered" and round again.
  const grids = [[99, 5, { selected: "open:3" }], [99, 5, { selected: "open:3" }], [99, 5, { selected: "open:3" }], [99, 5, { selected: "open:3" }], [99, 5, { selected: "open:3" }], [100, 4, { coveredBy: "Daniel Reyes" }]];
  play(asking.map(([second, inner], i) => [second, () => rotaView(...grids[i], inner())]), 14);
})();
