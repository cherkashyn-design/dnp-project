// Sun caustics: the bright net of light that moving water throws on the surface under it.
// A second brand background beside the ribbons of flow.js, for posts, posters and the website.
//
//   <canvas data-caustics='{"surface":"azure"}' width="800" height="600"></canvas>   then   Caustics.mount(root, frozenAt)
//
// How it works (the method of real-time water demos): the water is a fine grid of triangles. Every corner is a ray of
// sunlight; it is moved to where the water bends it. Where triangles shrink, light gathers: the brightness of a triangle is
// its old area divided by its new area, and overlapping triangles add up. Drawn three times with slightly different bending
// for red, green and blue, the bright lines get a thin rainbow fringe, as real ones have.
const Caustics = (() => {
  const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
  const mixc = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);

  // The surface the light falls on: its colour, the colour of the dimmer water between the lines, how strong the light is.
  const SURFACES = {
    sky:   { table: "#BFD9FF", shadow: "#4F7FEA", gain: 0.26 },
    azure: { table: "#639FFD", shadow: "#2F5FE0", gain: 0.31 },
    aqua:  { table: "#3DB4EE", shadow: "#0A84C4", gain: 0.3 },
    lilac: { table: "#B1ACFC", shadow: "#6E6BE0", gain: 0.27 },
    deep:  { table: "#0A22E0", shadow: "#04107A", gain: 0.38 },
  };
  const DEFAULTS = { surface: "azure", ripple: 0.5, scale: 1, warmth: 0.3, rainbow: 0.5, speed: 1, period: 14 };

  // The grid of light. a = (u, v), u from -1 to 1 and v from 0 to 1; it covers a little more than the frame.
  // The water surface is a sum of eight waves. Time is an angle (uPh) and each wave turns a whole number of times per
  // loop, so the loop has no seam.
  const MESH_VERT = `#version 300 es
precision highp float;
in vec2 a;
uniform vec2 uRes; uniform float uPh, uAmp, uBend, uScale;
out vec2 vSrc;
vec2 slope(vec2 p){
  vec2 g = vec2(0.);
  for (int i = 0; i < 8; i++) {
    float fi = float(i);
    float ang = fi * 2.399 + .7, f = 1.6 + fi * .83;
    vec2 k = vec2(cos(ang), sin(ang)) * f;
    float turns = mod(fi, 3.) + 1.; if (mod(fi, 2.) > .5) turns = -turns;
    g += k * cos(dot(k, p) + turns * uPh + fi * 1.7) / (f * f) * 1.6;
  }
  return g;
}
void main(){
  vec2 p = (a * vec2(.5, 1.) + vec2(.5, 0.)) * 1.2 - .1;
  vSrc = p * uRes;
  vec2 w = p * vec2(uRes.x / uRes.y, 1.) * 4.2 * uScale;
  // A ray lands where it started, pushed by the slope of the water above it.
  vec2 dst = vSrc + slope(w) * uAmp * uRes.y * .06 * uBend / uScale;
  gl_Position = vec4(dst / uRes * 2. - 1., 0., 1.);
}`;
  const MESH_FRAG = `#version 300 es
precision highp float;
in vec2 vSrc; uniform vec3 uLight; out vec4 o;
void main(){
  // Old area of this pixel's patch of light divided by its new area (one pixel).
  vec2 dx = dFdx(vSrc), dy = dFdy(vSrc);
  o = vec4(uLight * min(abs(dx.x * dy.y - dx.y * dy.x), 9.), 1.);
}`;
  const QUAD_VERT = `#version 300 es
in vec2 a; void main(){ gl_Position = vec4(a, 0., 1.); }`;
  // The surface itself, a little dimmer where no light gathers and towards the corners.
  const BACK_FRAG = `#version 300 es
precision highp float;
uniform vec2 uRes; uniform vec3 uTable, uShadow; out vec4 o;
void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  o = vec4(uTable * mix(vec3(1.), uShadow, .3 + .12 * length(uv - .5)), 1.);
}`;

  let gl, glCanvas, mesh, back, meshCount, quadBuffer, meshBuffer;
  const program = (vs, fs) => {
    const p = gl.createProgram();
    for (const [type, src] of [[gl.VERTEX_SHADER, vs], [gl.FRAGMENT_SHADER, fs]]) {
      const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(s));
      gl.attachShader(p, s);
    }
    gl.bindAttribLocation(p, 0, "a"); gl.linkProgram(p);
    const u = {};
    for (let i = 0; i < gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS); i++) { const n = gl.getActiveUniform(p, i).name; u[n] = gl.getUniformLocation(p, n); }
    return { p, u };
  };
  const start = () => {
    if (gl !== undefined) return gl;
    glCanvas = document.createElement("canvas");
    gl = glCanvas.getContext("webgl2", { antialias: true, preserveDrawingBuffer: true }) || null;
    if (!gl) return null;
    mesh = program(MESH_VERT, MESH_FRAG); back = program(QUAD_VERT, BACK_FRAG);
    quadBuffer = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    // The grid: 220 x 220 squares, two triangles each.
    const n = 220, v = new Float32Array(n * n * 12);
    let i = 0;
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
      const x0 = (x / n) * 2 - 1, x1 = ((x + 1) / n) * 2 - 1, y0 = y / n, y1 = (y + 1) / n;
      v.set([x0, y0, x1, y0, x0, y1, x1, y0, x1, y1, x0, y1], i); i += 12;
    }
    meshCount = n * n * 6;
    meshBuffer = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, meshBuffer); gl.bufferData(gl.ARRAY_BUFFER, v, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    return gl;
  };

  // Draws one picture into the hidden WebGL canvas at w x h. phase is in turns of the loop (0..1).
  const draw = (o, phase, w, h) => {
    if (!start()) return null;
    if (glCanvas.width !== w || glCanvas.height !== h) { glCanvas.width = w; glCanvas.height = h; }
    gl.viewport(0, 0, w, h);
    const s = SURFACES[o.surface] || SURFACES.azure;
    const table = mixc(hex(s.table), [1, 0.96, 0.88], o.warmth * 0.12), light = mixc([1, 1, 1], [1, 0.86, 0.6], o.warmth);

    gl.disable(gl.BLEND); gl.colorMask(true, true, true, true);
    gl.useProgram(back.p); gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.uniform2f(back.u.uRes, w, h); gl.uniform3fv(back.u.uTable, table); gl.uniform3fv(back.u.uShadow, hex(s.shadow));
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE);
    gl.useProgram(mesh.p); gl.bindBuffer(gl.ARRAY_BUFFER, meshBuffer); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.uniform2f(mesh.u.uRes, w, h); gl.uniform1f(mesh.u.uPh, phase * Math.PI * 2);
    gl.uniform1f(mesh.u.uAmp, 0.25 + o.ripple * 1.5); gl.uniform1f(mesh.u.uScale, o.scale);
    // Red, green, blue: each bent a little differently.
    [[1, 0, 0], [0, 1, 0], [0, 0, 1]].forEach((mask, channel) => {
      gl.colorMask(mask[0] === 1, mask[1] === 1, mask[2] === 1, false);
      gl.uniform1f(mesh.u.uBend, 1 + (channel - 1) * 0.05 * o.rainbow);
      gl.uniform3f(mesh.u.uLight, light[0] * s.gain, light[1] * s.gain, light[2] * s.gain);
      gl.drawArrays(gl.TRIANGLES, 0, meshCount);
    });
    gl.colorMask(true, true, true, true);
    return glCanvas;
  };

  const live = new Set();
  let frozen = null, ticking = false, frame = 0;
  const optionsOf = (canvas) => canvas._caustics || (canvas._caustics = { ...DEFAULTS, ...JSON.parse(canvas.dataset.caustics || "{}") });
  const paint = (canvas, seconds) => {
    const o = optionsOf(canvas), source = draw(o, (seconds * o.speed) / o.period + (o.shift || 0), canvas.width, canvas.height);
    if (source) canvas.getContext("2d").drawImage(source, 0, 0);
  };
  const tick = (now) => {
    ticking = live.size > 0 && frozen === null;
    if (!ticking) return;
    requestAnimationFrame(tick);
    if (++frame % 2) return; // 30 pictures a second
    for (const canvas of live) {
      if (!canvas.isConnected) { live.delete(canvas); continue; }
      // Not redrawn while off screen (.frame.off) or hidden (the other tab of the builder).
      if (canvas.closest(".frame.off") || canvas.offsetParent === null) continue;
      paint(canvas, now / 1000);
    }
  };
  // Finds every <canvas data-caustics> under root and starts it. frozenAt (seconds) draws one still instead.
  const mount = (root = document, frozenAt = null) => {
    // With "reduce motion" set on the visitor's computer a background is one still picture; the builder ("always") still moves.
    const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
    frozen = frozenAt;
    root.querySelectorAll("canvas[data-caustics]").forEach((canvas) => {
      if (!calm || optionsOf(canvas).always) live.add(canvas);
      paint(canvas, frozen ?? (calm ? 0 : performance.now() / 1000));
    });
    if (!ticking && frozen === null) { ticking = true; requestAnimationFrame(tick); }
  };
  const update = (canvas, changes) => { Object.assign(optionsOf(canvas), changes); paint(canvas, frozen ?? performance.now() / 1000); };
  // A large picture of a canvas's current state, for saving. Returns a 2D canvas.
  const large = (canvas, width, height) => {
    const o = optionsOf(canvas), out = document.createElement("canvas");
    out.width = width; out.height = height;
    const source = draw(o, ((frozen ?? performance.now() / 1000) * o.speed) / o.period, width, height);
    if (source) out.getContext("2d").drawImage(source, 0, 0);
    return out;
  };
  return { SURFACES, DEFAULTS, mount, update, large, optionsOf };
})();
