// Section 1 of the case: the branding slides of One Gallon, and the background builder a visitor can play with (1.4).
// Slides are functions that return the inside of a 1600 x 1200 slide; case.js puts them on the page and then calls
// Brand.wire() to switch the builder on. Needs icons.js, flow.js and caustics.js loaded first.

// The logo, rebuilt from the Figma file: two wave shapes, the name in DM Sans Medium, the © between them.
// k is the scale (1 = 320 px wide). It takes the colour of its parent ("color"), so it follows --ink on moving backgrounds.
const MARK = `<svg viewBox="0 0 43.3333 21.6667"><path fill="currentColor" d="M17.3333 21.6667H0L1.88301 16.0176C3.34632 11.6277 7.45455 8.66667 12.082 8.66667H14.8999C20.1502 8.66667 24.7266 5.09346 26 0H43.3333L41.4503 5.64902C39.987 10.039 35.8788 13 31.2514 13H28.4334C23.1832 13 18.6067 16.5732 17.3333 21.6667Z"/></svg>`;
const logo = (k = 1, extra = "") => `<div class="logo-box" style="width:${320 * k}px;height:${106.667 * k}px;${extra}"><div class="logo" style="transform:scale(${k})">
  <i class="m1">${MARK}</i><i class="m2">${MARK}</i><b class="l1">One</b><b class="l2">Gallon</b><b class="cr">©</b></div></div>`;

// A brand picture as a background. The canvas is small and stretched: the picture is soft, so that is enough.
const flow = (options, cls = "bg", w = 560, h = 420) => `<canvas class="${cls}" width="${w}" height="${h}" data-flow='${JSON.stringify(options)}'></canvas>`;
const caustics = (options, cls = "bg", w = 800, h = 600) => `<canvas class="${cls}" width="${w}" height="${h}" data-caustics='${JSON.stringify(options)}'></canvas>`;
const grain = (opacity = 0.3) => `<i class="grain" style="opacity:${opacity}"></i>`;
// A stock photograph in the brand's treatment (as on the app's home screen): a blue haze from the top, lilac from the bottom.
const photo = (file, position = "50% 50%") => `<img class="ph" src="assets/photos/${file}.jpg" style="object-position:${position}" alt="" /><i class="haze"></i>`;

// ---------- Controls of the builder ----------
const slider = (label, key, min, max, step, value) => `<label class="ctl"><span>${label}</span><output>${value}</output>
  <input type="range" data-k="${key}" min="${min}" max="${max}" step="${step}" value="${value}" /></label>`;
const chips = (key, list, active) => `<div class="chips" data-k="${key}">${list.map(([id, css]) => `<button type="button" data-v="${id}" class="${id === active ? "on" : ""}" style="background:${css}" aria-label="${id}"></button>`).join("")}</div>`;
const setChip = (id) => { const s = Flow.SETS[id]; return [id, `linear-gradient(200deg, ${s.a}, ${s.b} 60%, ${s.c})`]; };
const surfaceChip = (id) => [id, Caustics.SURFACES[id].table];
const kinds = (active) => `<div class="seg" data-switch>${[["flow", "Ribbons"], ["caustics", "Caustics"]].map(([id, name]) => `<button type="button" data-v="${id}" class="${id === active ? "on" : ""}">${name}</button>`).join("")}</div>`;
const save = `<button type="button" class="main" data-act="save">${icon("download", 22)}Save PNG</button>`;


const BRAND_SLIDES = {
  // 1.1 — the logo stays still; the brand picture behind it changes every 0.6 s.
  "1.1": () => `${flow({ cycle: ["sky", "deep", "lilac", "aqua", "mist"], step: 0.6, seed: 2 })}${grain()}
    <div class="center ink">${logo(2.6)}</div>`,

  // 1.2 — colour: six swatches that fill the slide.
  "1.2": () => `<div class="swatches">${[
    ["Azure", "#639FFD", "#000", "a"], ["Sky", "#CAEFF9", "#000", "b"], ["Lilac", "#B1ACFC", "#000", "c"],
    ["Deep", "#0012DC", "#fff", "d"], ["Mist", "#EDF0F5", "#000", "e"], ["Ink", "#000000", "#fff", "f"],
  ].map(([name, value, ink, area]) => `<div style="grid-area:${area};background:${value};color:${ink}"><b>${name}</b><span>${value}</span></div>`).join("")}</div>`,

  // 1.3 — type: Helvetica Now Display for words, DM Mono for amounts. The two families sit on one grid, line for line.
  "1.3": () => `<div class="type">
    <p class="big">Hit one gallon<br /><i>of water daily</i></p>
    <div class="fams">
      <b>Helvetica Now Display</b><b>DM Mono</b>
      <p>ABCDEFGHIJKLMNOPQRSTUVWXYZ<br />abcdefghijklmnopqrstuvwxyz</p><p class="mono">8 12 16 20 32 oz<br />0123456789 / 128 oz</p>
      <p class="w"><span style="font-weight:400">Regular</span><span>Medium</span><span style="font-weight:700">Bold</span></p><p class="w mono"><span>Regular</span></p>
    </div>
  </div>`,

  // 1.4 — the builder: the visitor makes a brand background of either kind, moving, and saves it.
  "1.4": () => `<div class="tool">
    <div class="tab" data-tool="flow">
      <div class="stage">${flow({ set: "sky", seed: 3, period: 24, always: true }, "", 500, 520)}${grain()}<div class="center">${logo(1.5)}</div></div>
      <div class="panel">${kinds("flow")}
        ${chips("set", ["sky", "lilac", "aqua", "deep", "mist"].map(setChip), "sky")}
        ${slider("Ribbons", "count", 1, 5, 1, 3)}${slider("Width", "width", 0.08, 0.4, 0.01, 0.2)}${slider("Bend", "bend", 0, 1.2, 0.01, 0.55)}
        ${slider("Glow", "glow", 0, 1, 0.01, 0.9)}${slider("Grain", "grain", 0, 0.6, 0.01, 0.3)}${slider("Speed", "speed", 0, 3, 0.1, 1)}
        <div class="row"><button type="button" data-act="shuffle">${icon("shuffle", 22)}Shuffle</button><button type="button" data-act="photo">${icon("image-up", 22)}<span>Photo</span></button></div>
        ${save}<input type="file" accept="image/*" hidden />
      </div>
    </div>
    <div class="tab" data-tool="caustics" hidden>
      <div class="stage">${caustics({ surface: "azure", always: true }, "", 1000, 1040)}${grain(0.2)}<div class="center">${logo(1.5)}</div></div>
      <div class="panel">${kinds("caustics")}
        ${chips("surface", ["sky", "azure", "aqua", "lilac", "deep"].map(surfaceChip), "azure")}
        ${slider("Ripples", "ripple", 0, 1, 0.01, 0.5)}${slider("Scale", "scale", 0.5, 2.5, 0.05, 1)}${slider("Warmth", "warmth", 0, 1, 0.01, 0.3)}
        ${slider("Rainbow", "rainbow", 0, 1, 0.01, 0.5)}${slider("Grain", "grain", 0, 0.6, 0.01, 0.2)}${slider("Speed", "speed", 0, 3, 0.1, 1)}
        ${save}
      </div>
    </div>
  </div>`,

  // 1.5 — icons from Lucide, each drawn in turn.
  "1.5": () => `<div class="icons">${["glass-water", "scan-line", "camera", "droplets", "flame", "target", "bell", "chart-column", "trophy", "sun", "zap", "check"]
    .map((name, i) => `<div style="--i:${i}">${icon(name, 104, 1.5).replace(/<(path|circle|rect|line|polyline|ellipse)/g, '<$1 pathLength="1"')}</div>`).join("")}</div>`,

  // 1.6 — tone of voice: what the app says, in the pills it says it in.
  "1.6": () => `${flow({ set: "lilac", seed: 5, count: 4 })}${grain()}
    <div class="voice"><p>Good job!</p><p>10 oz added. 118 to go.</p><p>Five days in a row. Keep pouring.</p><p>Snap it. Sip it. Done.</p></div>`,

};

// The background of each slide (pure black behind mockups; brand colours where the slide is a full picture).
const BRAND_BACK = { "1.1": "#639FFD", "1.6": "#B1ACFC" };

const Brand = {
  // Switches on the builder under root: its two kinds of background, sliders, colour chips and buttons.
  wire(root = document) {
    root.querySelectorAll(".tool").forEach((tool) => {
      // Ribbons | Caustics: show that tab, and mark the same button in both panels.
      tool.querySelectorAll("[data-switch] button").forEach((button) => button.addEventListener("click", () => {
        tool.querySelectorAll(".tab").forEach((tab) => { tab.hidden = tab.dataset.tool !== button.dataset.v; });
        tool.querySelectorAll("[data-switch] button").forEach((b) => b.classList.toggle("on", b.dataset.v === button.dataset.v));
      }));
    });
    root.querySelectorAll("[data-tool]").forEach((tool) => {
      const kind = tool.dataset.tool, engine = kind === "flow" ? Flow : Caustics;
      const canvas = tool.querySelector("canvas"), grainLayer = tool.querySelector(".grain"), file = tool.querySelector("input[type=file]");
      tool.querySelectorAll("input[type=range]").forEach((input) => input.addEventListener("input", () => {
        input.previousElementSibling.textContent = input.value;
        if (input.dataset.k === "grain") grainLayer.style.opacity = input.value;
        else engine.update(canvas, { [input.dataset.k]: Number(input.value) });
      }));
      tool.querySelector(".chips").addEventListener("click", (event) => {
        const button = event.target.closest("button"); if (!button) return;
        tool.querySelectorAll(".chips button").forEach((b) => b.classList.toggle("on", b === button));
        engine.update(canvas, { [button.parentElement.dataset.k]: button.dataset.v });
        // The logo on the picture turns white on the dark set.
        tool.querySelector(".stage").style.color = button.dataset.v === "deep" ? "#fff" : "#000";
      });
      tool.querySelectorAll("[data-act]").forEach((button) => button.addEventListener("click", () => {
        const act = button.dataset.act;
        if (act === "shuffle") engine.update(canvas, { seed: 1 + Math.floor(Math.random() * 900) });
        if (act === "photo") {
          // The Figma recipe starts from a photograph. A visitor can try their own; a second press goes back to ribbons.
          if (engine.optionsOf(canvas).photo) { engine.update(canvas, { photo: null }); button.querySelector("span").textContent = "Photo"; }
          else file.click();
        }
        if (act === "save") {
          const picture = kind === "flow" ? Flow.large(canvas, 2400, 2496, Number(grainLayer.style.opacity) * 0.2) : Caustics.large(canvas, 2000, 2080);
          picture.toBlob((blob) => {
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob); link.download = kind === "flow" ? "one-gallon-ribbons.png" : "one-gallon-caustics.png";
            link.click(); setTimeout(() => URL.revokeObjectURL(link.href), 2000);
          });
        }
      }));
      if (file) file.addEventListener("change", () => {
        if (!file.files[0]) return;
        const image = new Image();
        image.onload = () => { engine.update(canvas, { photo: image }); tool.querySelector("[data-act=photo] span").textContent = "Ribbons"; };
        image.src = URL.createObjectURL(file.files[0]);
        file.value = "";
      });
    });
  },
};
