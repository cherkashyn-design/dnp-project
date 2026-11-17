// Builds the site for Cloudflare Pages into dist/.  Run from the repository root:
//   node scripts/build-cloudflare.mjs
//   npx wrangler pages deploy dist --project-name dnp-project --branch main
// It builds the site the way scripts/build-redesign.mjs does and then changes three things Cloudflare does differently:
//   1. Redirects: the "redirects" of vercel.json are written to dist/_redirects, so the list lives in one place.
//   2. Addresses without a slash: cases/nodity/index.html becomes cases/nodity.html. Cloudflare would otherwise
//      send /cases/nodity to /cases/nodity/, which is not the address in the sitemap and the canonical links.
//   3. The Vercel visit counter is left out (VITE_HOST=cloudflare, read in redesign/src/main.jsx).
// The contact form's handler is functions/api/contact.js; Wrangler picks the functions/ folder up by itself.
import { cpSync, existsSync, mkdirSync, rmSync, readdirSync, readFileSync, renameSync, rmdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const dist = join(root, "dist");

// The same steps as scripts/build-redesign.mjs, written so that they also run on Windows (npm needs a shell there).
const redesign = join(root, "redesign");
const run = (args) => {
  const result = spawnSync("npm", args, {
    cwd: redesign,
    stdio: "inherit",
    shell: true,
    env: { ...process.env, VITE_HOST: "cloudflare" },
  });
  if (result.status !== 0) process.exit(result.status ?? 1);
};
if (!existsSync(join(redesign, "node_modules"))) run(["install", "--no-fund", "--no-audit"]);
run(["run", "build"]);

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });
cpSync(join(redesign, "dist"), dist, { recursive: true });
const publicDir = join(root, "public");
for (const name of existsSync(publicDir) ? readdirSync(publicDir) : []) {
  if (name === "v2") continue;
  cpSync(join(publicDir, name), join(dist, name), { recursive: true });
}

// 1. Redirects
const { redirects = [] } = JSON.parse(readFileSync(join(root, "vercel.json"), "utf8"));
const lines = redirects.map(({ source, destination, permanent }) => {
  const from = source.replace(/:path\*/g, "*");
  const to = destination.replace(/:path\*/g, ":splat");
  return `${from} ${to} ${permanent ? 301 : 302}`;
});
writeFileSync(join(dist, "_redirects"), lines.join("\n") + "\n");

// 2. Pages that were prerendered as <route>/index.html become <route>.html
let moved = 0;
function flatten(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) flatten(path);
  }
  // cases/index.html also becomes cases.html (the folder stays for the pages inside it), so /cases has no slash either.
  if (existsSync(join(dir, "index.html")) && !existsSync(`${dir}.html`)) {
    renameSync(join(dir, "index.html"), `${dir}.html`);
    if (readdirSync(dir).length === 0) rmdirSync(dir);
    moved += 1;
  }
}
for (const top of ["cases", "blog", "contact", "privacy", "terms"]) {
  if (existsSync(join(dist, top))) flatten(join(dist, top));
}

console.log(`Cloudflare build ready: ${lines.length} redirects, ${moved} pages renamed to .html`);
