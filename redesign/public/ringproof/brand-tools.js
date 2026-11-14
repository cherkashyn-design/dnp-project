// Slide 1.12: the two editors behind the brand, working right on the slide, side by side.
// On a narrow screen the slide becomes a 400 px wide column that shows one editor at a time, with two tabs to switch.
// The wide one is the background editor: it draws with the same code the slides use (streakPixels, wavePixels).
// The narrow one is the logo editor: bar size, speed and how much the bars swell.
// Loaded after brand-show.js and before brand.js; lock() from brand.js exists by the time the slide is built.

// ---------- Small pieces of the control panels ----------
const chips = (key, options, now) => `<div class="chips">${options.map(([value, label]) => `<button class="${String(now) === value ? "on" : ""}" data-set="${key}:${value}">${label}</button>`).join("")}</div>`;
const group = (title, body) => `<div class="tgroup"><small>${title}</small>${body}</div>`;
const slider = (key, label, min, max, step, value, unit) => `<label class="tgroup"><small>${label}<em data-out="${key}">${value}${unit}</em></small><input type="range" data-key="${key}" data-unit="${unit}" min="${min}" max="${max}" step="${step}" value="${value}"></label>`;
const saveFile = (blob, name) => { const link = Object.assign(document.createElement("a"), { href: URL.createObjectURL(blob), download: name }); link.click(); URL.revokeObjectURL(link.href); };

const TOOL_SLIDES = {
  "1.12": () => `<div class="s tool">
    <div class="ttabs"><button class="on" data-tab="bg">Background</button><button data-tab="logo">Logo</button></div>
    <div class="twin bg cur" data-tool="bg">
      <div class="tbar">${mark("", 28)}<b>Background editor</b><em>Try it: every control works</em></div>
      <div class="tpanel"></div>
      <div class="tstage"><div class="tview"><canvas width="800" height="600"></canvas><i class="grain"></i><div class="center">${lock(84)}</div></div>
        </div>
    </div>
    <div class="twin logo" data-tool="logo">
      <div class="tbar">${mark("", 28)}<b>Logo editor</b></div>
      <div class="lview"><svg data-live viewBox="0 0 48 48"></svg><span class="lock" style="font-size:34px"><svg class="mark" data-live viewBox="0 0 48 48"></svg><span>Ringproof</span></span></div>
      <div class="lpanel"></div>
    </div>
  </div>`,
};

// ---------- Background editor ----------
// Four colours, dark to light. A glow uses the second as its base and the others as lights in the corners;
// waves run through all four; a photo is recoloured through them unless it keeps its own colours.
const PALETTES = {
  night: ["#060914", "#181f36", "#3a4668", "#6878a4"],
  signal: ["#262f4c", "#46547a", "#5b6b93", "#a0afd6"],
  mist: ["#8fa0cc", "#b0bee2", "#cdd6ec", "#f0f3fa"],
};
const BG_PRESETS = {
  blue: { type: "glow", colors: ["#3b4768", "#5b6b93", "#8fa0cc", "#a9b7dc"], seed: 0 },
  mist: { type: "glow", colors: ["#8fa0cc", "#c3cde6", "#eef1fa", "#c3cde6"], seed: 1 },
  wheat: { type: "streaks", axis: "down", blur: 43 },
  lavender: { type: "streaks", axis: "down", blur: 43 },
  forest: { type: "streaks", axis: "across", blur: 43 },
  ripples: { type: "ripples", pal: "night", size: 1, seed: 0 },
  marble: { type: "liquid", pal: "night", size: 1, seed: 0 },
};
const PHOTOS = {};
const photoOf = (name) => (PHOTOS[name] ??= Object.assign(new Image(), { src: `nature/${name}.jpg` }));
const rgbOf = (hex) => [1, 3, 5].map((at) => parseInt(hex.slice(at, at + 2), 16));

function bgTool(root) {
  // pal: "own" = the preset's own colours (for a photo: the colours of the photo), a PALETTES name, or "custom".
  const s = { grain: 55, logo: "off", upload: null };
  const choose = (name) => Object.assign(s, { preset: name, pal: "own", seed: 0, size: 1, upload: null }, BG_PRESETS[name], { colors: [...(BG_PRESETS[name].colors ?? PALETTES[BG_PRESETS[name].pal ?? "signal"])] });
  choose("ripples");
  const panel = root.querySelector(".tpanel"), view = root.querySelector(".tview"), canvas = root.querySelector("canvas");
  const tall = () => Math.round((800 * view.clientHeight) / view.clientWidth); // the picture takes the shape of the space it is given
  const waves = () => s.type === "ripples" || s.type === "liquid";

  const controls = () => {
    const own = s.type === "streaks" ? [["own", "Photo"]] : s.type === "glow" ? [["own", "Preset"]] : [];
    panel.innerHTML = group("Preset", chips("preset", Object.keys(BG_PRESETS).map((name) => [name, name[0].toUpperCase() + name.slice(1)]), s.preset))
      + `<div class="tcolors">${group("Colours", chips("pal", [...own, ["night", "Night"], ["signal", "Signal"], ["mist", "Mist"], ...(s.pal === "custom" ? [["custom", "Custom"]] : [])], s.pal))}
        <div class="hexes">${s.colors.map((hex, i) => `<label class="hex"><input type="color" data-c="${i}" value="${hex}"><input type="text" data-c="${i}" value="${hex}" maxlength="7" spellcheck="false"></label>`).join("")}</div></div>`
      + (s.type === "streaks" ? group("Image", `<label class="upload"><input type="file" accept="image/*" hidden>${s.upload ? "Replace your image" : "Upload your image"}</label>${s.upload ? '<button class="wide" data-act="unload">Back to the preset photo</button>' : ""}`)
        + group("Blur direction", chips("axis", [["down", "Down"], ["across", "Across"]], s.axis)) + slider("blur", "Blur", 0, 90, 1, s.blur, " px") : "")
      + (waves() ? slider("size", "Wave length", 0.5, 2.5, 0.05, s.size, "×") : "")
      + slider("grain", "Grain", 0, 100, 1, s.grain, "%")
      + group("Logo on top", chips("logo", [["off", "Hidden"], ["white", "White"], ["ink", "Ink"]], s.logo))
      + `<div class="tacts">${s.type === "streaks" ? "" : '<button data-act="shuffle">Shuffle</button>'}<button class="main" data-act="save">Export PNG</button></div>`;
  };

  // Draws the background into any canvas; every measure is scaled from the 800 px wide preview.
  const render = (ctx, w, h) => {
    const k = w / 800;
    if (s.type === "glow") {
      const corners = [[0, 0], [1, 0], [1, 1], [0, 1]];
      ctx.fillStyle = s.colors[1];
      ctx.fillRect(0, 0, w, h);
      [[2, 0, 0.9, 1.05], [0, 2, 0.9, 1.05], [3, 1, 0.6, 0.7]].forEach(([colour, corner, rx, ry]) => { // seed turns the lights round the corners
        const at = corners[(corner + s.seed) % 4], glow = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
        glow.addColorStop(0, s.colors[colour]);
        glow.addColorStop(0.7, s.colors[colour] + "00");
        ctx.save();
        ctx.translate(at[0] * w, at[1] * h);
        ctx.scale(w * rx, h * ry);
        ctx.fillStyle = glow;
        ctx.fillRect(-1, -1, 2, 2);
        ctx.restore();
      });
    } else if (s.type === "streaks") {
      const image = streakPixels(s.upload ?? photoOf(s.preset), w, h, s.axis === "down", Math.round(s.blur * k));
      if (s.pal !== "own") { // recolour: the brightness of each pixel picks a place on the four colours
        const stops = s.colors.map(rgbOf), px = image.data;
        for (let i = 0; i < px.length; i += 4) {
          const t = Math.min((0.2126 * px[i] + 0.7152 * px[i + 1] + 0.0722 * px[i + 2]) / 255, 0.9999) * 3, n = Math.floor(t), f = t - n;
          for (let c = 0; c < 3; c++) px[i + c] = stops[n][c] + (stops[n + 1][c] - stops[n][c]) * f;
        }
      }
      ctx.putImageData(image, 0, 0);
    } else ctx.putImageData(wavePixels(s.type === "liquid" ? "marble" : "ripples", w, h, { size: s.size, seed: s.seed, tone: s.colors.map(rgbOf) }), 0, 0);
  };

  const draw = () => {
    const photo = s.type === "streaks" && (s.upload ?? photoOf(s.preset));
    if (photo && !photo.naturalWidth) return photo.addEventListener("load", draw, { once: true });
    if (!view.clientWidth) return; // hidden behind the other tab
    if (canvas.height !== tall()) canvas.height = tall();
    render(canvas.getContext("2d", { willReadFrequently: true }), canvas.width, canvas.height);
    root.querySelector(".grain").style.opacity = s.grain / 100;
    const logo = root.querySelector(".tview .center");
    logo.style.display = s.logo === "off" ? "none" : "";
    logo.style.color = s.logo === "ink" ? "#09090b" : "#fff";
  };

  // The saved picture is drawn again at twice the preview size, with the grain baked in.
  const save = () => {
    const w = 1600, h = canvas.height * 2, big = Object.assign(document.createElement("canvas"), { width: w, height: h }), ctx = big.getContext("2d", { willReadFrequently: true });
    render(ctx, w, h);
    if (s.grain) {
      const noise = Object.assign(document.createElement("canvas"), { width: w, height: h }), dots = new ImageData(w, h);
      for (let i = 0; i < dots.data.length; i += 4) { dots.data[i] = dots.data[i + 1] = dots.data[i + 2] = 96 + Math.random() * 64; dots.data[i + 3] = 255; }
      noise.getContext("2d").putImageData(dots, 0, 0);
      ctx.globalCompositeOperation = "overlay";
      ctx.globalAlpha = s.grain / 100;
      ctx.drawImage(noise, 0, 0);
    }
    big.toBlob((blob) => saveFile(blob, `ringproof-${s.preset}.png`));
  };

  root.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;
    if (button.dataset.act === "save") return save();
    if (button.dataset.act === "shuffle") s.seed += 1;
    else if (button.dataset.act === "unload") s.upload = null;
    else {
      const [key, value] = button.dataset.set.split(":");
      if (key === "preset") choose(value);
      else if (key === "pal") { s.pal = value; if (value !== "custom") s.colors = [...(value === "own" ? BG_PRESETS[s.preset].colors ?? s.colors : PALETTES[value])]; }
      else s[key] = value;
    }
    controls();
    draw();
  });
  root.addEventListener("input", (event) => {
    const field = event.target;
    if (field.dataset.c) { // a colour: the picker and the hex field next to it stay in step
      const hex = field.value.trim().toLowerCase().replace(/^([0-9a-f]{6})$/, "#$1");
      if (!/^#[0-9a-f]{6}$/.test(hex)) return; // wait until the hex is whole
      s.colors[field.dataset.c] = hex;
      field.closest(".hex").querySelectorAll("input").forEach((other) => { if (other !== field) other.value = hex; });
      if (s.pal !== "custom") { s.pal = "custom"; panel.querySelectorAll(".tcolors .chips button").forEach((button) => button.classList.remove("on")); }
    } else if (field.dataset.key) {
      s[field.dataset.key] = Number(field.value);
      root.querySelector(`[data-out="${field.dataset.key}"]`).textContent = field.value + field.dataset.unit;
    } else return;
    draw();
  });
  root.addEventListener("change", (event) => {
    const file = event.target.type === "file" && event.target.files[0];
    if (!file) return;
    const picture = new Image();
    picture.onload = () => { s.upload = picture; controls(); draw(); }; // the picture never leaves the browser
    picture.src = URL.createObjectURL(file);
  });
  addEventListener("resize", () => { if (view.clientWidth && canvas.height !== tall()) draw(); });
  controls();
  draw();
}

// ---------- Logo editor ----------
// The same bars as mark() in brand.js: [centre x, width, [[centre y, half height], ...]].
function markBars() {
  const count = 11, gap = 1.5, outer = 21, inner = 9.5;
  const raw = Array.from({ length: count }, (_, i) => 1.1 + 3.6 * Math.sin((Math.PI * i) / (count - 1)));
  const scale = (outer * 2 - gap * (count - 1)) / raw.reduce((sum, w) => sum + w, 0);
  let x = 24 - outer;
  return raw.map((rawWidth) => {
    const w = rawWidth * scale, cx = x + w / 2, dx = cx - 24;
    x += w + gap;
    const h = Math.sqrt(Math.max(outer * outer - dx * dx, 0)), hole = Math.abs(dx) < inner ? Math.sqrt(inner * inner - dx * dx) : 0;
    return [cx, w, hole ? [[24 - (h + hole) / 2, (h - hole) / 2], [24 + (h + hole) / 2, (h - hole) / 2]] : [[24, h]]];
  });
}
const LOGO_LOOKS = { white: ["#000", "#fff"], ink: ["#f4f4f2", "#09090b"], signal: ["#5b6b93", "#fff"] };
const LOGO_START = { size: 100, speed: 0.6, swing: 35, look: "white" };

function logoTool(root) {
  const s = { ...LOGO_START }, bars = markBars(), view = root.querySelector(".lview"), panel = root.querySelector(".lpanel"), marks = root.querySelectorAll("svg[data-live]");
  let phase = 0, last = performance.now();
  // A wave runs along the bars: each bar swells and thins in turn. size = bar width, swing = how far it swells.
  const body = () => bars.map(([cx, w, parts], i) => {
    const rx = Math.max(0.12, (w / 2) * (s.size / 100) * (1 + (s.swing / 100) * Math.sin(phase - i * 0.62)));
    return parts.map(([cy, ry]) => `<ellipse cx="${cx.toFixed(2)}" cy="${cy.toFixed(2)}" rx="${rx.toFixed(3)}" ry="${ry.toFixed(2)}"/>`).join("");
  }).join("");
  const paint = () => marks.forEach((svg) => { svg.innerHTML = body(); });

  const controls = () => {
    panel.innerHTML = slider("size", "Line size", 30, 150, 1, s.size, "%")
      + slider("speed", "Animation speed", 0, 3, 0.1, s.speed, "×")
      + slider("swing", "Size change", 0, 100, 1, s.swing, "%")
      + group("Colours", chips("look", [["white", "White"], ["ink", "Ink"], ["signal", "Signal"]], s.look))
      + `<div class="tacts"><button data-act="reset">Reset</button><button class="main" data-act="save">Export SVG</button></div>`;
    [view.style.background, view.style.color] = LOGO_LOOKS[s.look];
  };
  const frame = (now) => {
    requestAnimationFrame(frame);
    const passed = Math.min((now - last) / 1000, 0.1);
    last = now;
    if (root.closest(".off")) return;
    phase += passed * s.speed * Math.PI * 2;
    paint();
  };

  root.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;
    if (button.dataset.act === "save") return saveFile(new Blob([`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="${LOGO_LOOKS[s.look][1]}">${body()}</svg>`], { type: "image/svg+xml" }), "ringproof-mark.svg");
    if (button.dataset.act === "reset") Object.assign(s, LOGO_START);
    else { const [key, value] = button.dataset.set.split(":"); s[key] = value; }
    controls();
    paint();
  });
  root.addEventListener("input", (event) => {
    const { key, unit } = event.target.dataset;
    s[key] = Number(event.target.value);
    root.querySelector(`[data-out="${key}"]`).textContent = event.target.value + unit;
    paint();
  });
  controls();
  paint();
  requestAnimationFrame(frame);
}

// Call once after the slides are on the page.
function runTools() {
  // Narrow screens get the column with tabs. The frame around the slide changes shape with it, and whoever scales
  // slides to their frames (fit in case.js and brand.js) hears the "resize" and does it again.
  const slides = document.querySelectorAll(".s.tool");
  const shape = () => slides.forEach((slide) => {
    const narrow = innerWidth < 760;
    if (slide.classList.contains("mob") === narrow) return;
    slide.classList.toggle("mob", narrow);
    slide.parentElement.classList.toggle("mobtool", narrow);
    dispatchEvent(new Event("resize"));
  });
  slides.forEach((slide) => slide.parentElement.classList.add("toolbox")); // the frame takes the low, wide shape of this slide
  dispatchEvent(new Event("resize"));
  shape();
  addEventListener("resize", shape);
  slides.forEach((slide) => slide.querySelector(".ttabs").addEventListener("click", (event) => {
    const tab = event.target.closest("button");
    if (!tab) return;
    slide.querySelectorAll(".ttabs button").forEach((button) => button.classList.toggle("on", button === tab));
    slide.querySelectorAll(".twin").forEach((editor) => editor.classList.toggle("cur", editor.dataset.tool === tab.dataset.tab));
    dispatchEvent(new Event("resize")); // the editor that has just appeared measures itself
  }));
  document.querySelectorAll('[data-tool="bg"]').forEach(bgTool);
  document.querySelectorAll('[data-tool="logo"]').forEach(logoTool);
}
