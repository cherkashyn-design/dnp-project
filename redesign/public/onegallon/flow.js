// The brand picture of One Gallon: soft ribbons of light, coloured by the brand gradient.
// It rebuilds the recipe of the Figma file (a blurred soft form, coloured through a gradient, with grain on top)
// in one WebGL shader, so the same picture can be a slide background, a poster, a post or the website hero.
//
//   <canvas data-flow='{"set":"sky","seed":3}' width="400" height="300"></canvas>   then   Flow.mount(root, frozenAt)
//
// One hidden WebGL canvas draws every picture and copies it into the visible 2D canvases, so a page with twenty
// pictures still uses one WebGL context. Pictures inside a ".frame.off" (off screen) are not redrawn.
const Flow = (() => {
  const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);

  // Colour sets. a → b → c is the gradient from the top of the picture to the bottom (as in Figma: 199deg),
  // lo is the colour of the quiet areas, hi the colour of the brightest light, ink the colour of a logo on top.
  const SETS = {
    sky:   { a: "#CAEFF9", b: "#639FFD", c: "#B1ACFC", lo: "#4F8BF5", hi: "#FFFFFF", shade: 0.45, ink: "#000" },
    lilac: { a: "#E6E0FF", b: "#A0A8FF", c: "#86BAFC", lo: "#8587EE", hi: "#FFFFFF", shade: 0.4, ink: "#000" },
    aqua:  { a: "#C8F4F4", b: "#29ABED", c: "#77ABFF", lo: "#0AA3CF", hi: "#FFFFFF", shade: 0.4, ink: "#000" },
    deep:  { a: "#0B3DFF", b: "#0012DC", c: "#0700B4", lo: "#04086A", hi: "#39AEFF", shade: 0.85, ink: "#fff" },
    mist:  { a: "#F7F9FC", b: "#DCE6F8", c: "#E4E0FB", lo: "#BFD2F5", hi: "#FFFFFF", shade: 0.5, ink: "#000" },
  };
  // Defaults that already look right; a canvas may override any of them in data-flow.
  const DEFAULTS = { set: "sky", seed: 1, count: 3, width: 0.2, bend: 0.55, angle: 0.35, glow: 0.9, speed: 1, period: 32 };

  const VERT = `#version 300 es
in vec2 p; void main(){ gl_Position = vec4(p, 0., 1.); }`;
  const FRAG = `#version 300 es
precision highp float;
uniform vec2 uRes; uniform float uPh, uCount, uWidth, uBend, uAngle, uGlow, uSeed, uShade, uView, uTexOn, uTexAsp;
uniform vec3 cA, cB, cC, cLo, cHi; uniform sampler2D uTex;
out vec4 o;
float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*f*(f*(f*6. - 15.) + 10.);
  return mix(mix(hash(i), hash(i + vec2(1,0)), f.x), mix(hash(i + vec2(0,1)), hash(i + 1.), f.x), f.y); }
float fbm(vec2 p){ float a = .5, s = 0.; for(int i = 0; i < 3; i++){ s += a * vn(p); p = p * 1.9 + 17.; a *= .42; } return s / .8; }
void main(){
  vec2 uv = gl_FragCoord.xy / uRes; float asp = uRes.x / uRes.y;
  vec2 p = (uv - .5) * vec2(asp, 1.);
  // Time only ever enters as a point going round a circle, so the picture comes back to its start: no seam.
  vec2 loop = vec2(cos(uPh), sin(uPh));
  vec2 w = vec2(fbm(p * .85 + uSeed + loop * .3), fbm(p * .85 + uSeed + 31.7 - loop.yx * .3)) - .5;
  float L = 0.;
  if (uTexOn > .5) {
    // A photograph as the soft form: blurred hard (a far mip level), gently moved by the same warp.
    vec2 t = uv - .5; if (uTexAsp > asp) t.x *= asp / uTexAsp; else t.y *= uTexAsp / asp;
    vec3 c = textureLod(uTex, vec2(t.x, -t.y) + .5 + w * uBend * .25, 3.5 + uWidth * 8.).rgb;
    L = smoothstep(.15, .95, dot(c, vec3(.3, .59, .11))) * 1.15;
  } else {
    vec2 q = p + w * uBend;
    float ca = cos(uAngle), sa = sin(uAngle); q = mat2(ca, -sa, sa, ca) * q;
    for (int i = 0; i < 5; i++) {
      float fi = float(i); if (fi >= uCount) break;
      float h1 = hash(vec2(fi + uSeed, 1.3)), h2 = hash(vec2(fi + uSeed, 7.1)), h3 = hash(vec2(fi + uSeed, 3.7));
      float dir = mod(fi, 2.) < 1. ? 1. : -1.;
      float curve = (h1 - .5) * asp * .95 + .22 * sin(q.y * (1.4 + h2 * 1.6) + h3 * 6.283 + uPh * dir) + .07 * sin(q.y * 4.1 + uPh * 2. * dir + h1 * 6.283);
      float wd = uWidth * (.55 + .9 * h2) * (1. + .45 * sin(q.y * 2.1 + h3 * 6.283 - uPh * dir));
      float d = (q.x - curve) / wd;
      L += exp(-d * d) * (.5 + .5 * h3);
    }
    L += (vn(q * 1.6 + uSeed * 2. + loop * .25) - .5) * .3;
  }
  L = clamp(L, 0., 1.5);
  float g = clamp(dot(uv - .5, vec2(-.33, -.94)) + .5, 0., 1.);
  vec3 base = g < .6 ? mix(cA, cB, g / .6) : mix(cB, cC, (g - .6) / .4);
  vec3 col = mix(mix(base, cLo, uShade), base, smoothstep(0., .6, L));
  col = mix(col, cHi, smoothstep(.35, 1.45, L) * uGlow);
  // uView shows one layer alone (for the slide that explains how the picture is built).
  if (uView > 1.5) col = base; else if (uView > .5) col = vec3(smoothstep(0., 1.2, L));
  o = vec4(col, 1.);
}`;

  let gl, prog, loc = {}, tex, texImage = null, glCanvas;
  const start = () => {
    if (gl !== undefined) return gl;
    glCanvas = document.createElement("canvas");
    gl = glCanvas.getContext("webgl2", { antialias: false, preserveDrawingBuffer: true }) || null;
    if (!gl) return null;
    const shader = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(s)); return s; };
    prog = gl.createProgram();
    gl.attachShader(prog, shader(gl.VERTEX_SHADER, VERT)); gl.attachShader(prog, shader(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog); gl.useProgram(prog);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    for (const n of ["uRes", "uPh", "uCount", "uWidth", "uBend", "uAngle", "uGlow", "uSeed", "uShade", "uView", "uTexOn", "uTexAsp", "cA", "cB", "cC", "cLo", "cHi", "uTex"]) loc[n] = gl.getUniformLocation(prog, n);
    tex = gl.createTexture();
    return gl;
  };

  // Draws one picture into the hidden WebGL canvas at w x h. phase is in turns of the loop (0..1).
  const draw = (o, phase, w, h) => {
    if (!start()) return null;
    if (glCanvas.width !== w || glCanvas.height !== h) { glCanvas.width = w; glCanvas.height = h; }
    gl.viewport(0, 0, w, h);
    const set = SETS[o.set] || SETS.sky;
    gl.uniform2f(loc.uRes, w, h); gl.uniform1f(loc.uPh, phase * Math.PI * 2);
    gl.uniform1f(loc.uCount, o.count); gl.uniform1f(loc.uWidth, o.width); gl.uniform1f(loc.uBend, o.bend);
    gl.uniform1f(loc.uAngle, o.angle); gl.uniform1f(loc.uGlow, o.glow); gl.uniform1f(loc.uSeed, o.seed * 7.31);
    gl.uniform1f(loc.uShade, set.shade); gl.uniform1f(loc.uView, o.view || 0);
    for (const [u, k] of [["cA", "a"], ["cB", "b"], ["cC", "c"], ["cLo", "lo"], ["cHi", "hi"]]) gl.uniform3fv(loc[u], hex(set[k]));
    if (o.photo) {
      gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, tex);
      if (texImage !== o.photo) {
        texImage = o.photo;
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, o.photo);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
      }
      gl.uniform1i(loc.uTex, 0); gl.uniform1f(loc.uTexAsp, o.photo.width / o.photo.height);
    }
    gl.uniform1f(loc.uTexOn, o.photo ? 1 : 0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    return glCanvas;
  };

  const live = new Set();
  let frozen = null, ticking = false, frame = 0;
  const optionsOf = (canvas) => canvas._flow || (canvas._flow = { ...DEFAULTS, ...JSON.parse(canvas.dataset.flow || "{}") });

  const paint = (canvas, seconds) => {
    const o = optionsOf(canvas);
    let options = o;
    if (o.cycle) {
      // A hard cut between colour sets (the logo slide): the set and the seed change every o.step seconds.
      const index = Math.floor(seconds / o.step) % o.cycle.length;
      options = { ...o, set: o.cycle[index], seed: o.seed + index * 3 };
      const slide = canvas.closest(".s");
      if (slide) slide.style.setProperty("--ink", SETS[options.set].ink);
    }
    const source = draw(options, (seconds * o.speed) / o.period + (o.shift || 0), canvas.width, canvas.height);
    if (source) canvas.getContext("2d").drawImage(source, 0, 0);
  };

  const tick = (now) => {
    ticking = live.size > 0 && frozen === null;
    if (!ticking) return;
    requestAnimationFrame(tick);
    if (++frame % 2) return; // 30 pictures a second are enough for something this slow
    for (const canvas of live) {
      if (!canvas.isConnected) { live.delete(canvas); continue; }
      // Not redrawn while off screen (.frame.off) or hidden (the other tab of the builder).
      if (canvas.closest(".frame.off") || canvas.offsetParent === null) continue;
      paint(canvas, now / 1000);
    }
  };

  // Finds every <canvas data-flow> under root and starts it. frozenAt (seconds) draws one still instead.
  const mount = (root = document, frozenAt = null) => {
    // With "reduce motion" set on the visitor's computer a background is one still picture; the builder ("always") still
    // moves, because there the visitor asked for it and has a Speed control.
    const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
    frozen = frozenAt;
    root.querySelectorAll("canvas[data-flow]").forEach((canvas) => {
      if (!calm || optionsOf(canvas).always) live.add(canvas);
      paint(canvas, frozen ?? (calm ? 0 : performance.now() / 1000));
    });
    if (!ticking && frozen === null) { ticking = true; requestAnimationFrame(tick); }
  };

  // Changes the options of one mounted canvas (the builder calls this) and redraws it at once.
  const update = (canvas, changes) => {
    Object.assign(optionsOf(canvas), changes);
    paint(canvas, frozen ?? performance.now() / 1000);
  };

  // A large PNG of a canvas's current picture, with grain drawn in. Returns a 2D canvas.
  const large = (canvas, width, height, grain = 0.06) => {
    const o = optionsOf(canvas), out = document.createElement("canvas");
    out.width = width; out.height = height;
    const source = draw(o, ((frozen ?? performance.now() / 1000) * o.speed) / o.period, width, height);
    const ctx = out.getContext("2d");
    if (source) ctx.drawImage(source, 0, 0);
    if (grain > 0) {
      const image = ctx.getImageData(0, 0, width, height), d = image.data, k = grain * 255;
      for (let i = 0; i < d.length; i += 4) { const n = (Math.random() - 0.5) * k; d[i] += n; d[i + 1] += n; d[i + 2] += n; }
      ctx.putImageData(image, 0, 0);
    }
    return out;
  };

  return { SETS, DEFAULTS, mount, update, large, optionsOf };
})();
