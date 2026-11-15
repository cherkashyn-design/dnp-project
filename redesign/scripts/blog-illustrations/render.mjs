// Draws the blog's diagrams: index.html?i=<name> is one 1600 x 1000 picture, saved as WebP into src/assets/blog.
// Usage, from this folder: node render.mjs [draftlex onegallon wardgrid ringproof salesdriver nodity]
// Needs Edge (or set BROWSER to Chrome's path) and the sharp package (npm i sharp, outside the app is fine).
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import sharp from "sharp";

const here = path.dirname(fileURLToPath(import.meta.url));
const assets = path.resolve(here, "../../../src/assets/blog");
const browser = process.env.BROWSER || "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const files = {
  draftlex: "draftlex/review-first-flow",
  onegallon: "onegallon/launch-kit",
  wardgrid: "wardgrid/one-cell-three-states",
  ringproof: "ringproof/one-idea-every-surface",
  salesdriver: "sales-driver/aida-landing-map",
  nodity: "nodity/three-levels-of-control",
};
const names = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(files);
const temp = mkdtempSync(path.join(tmpdir(), "blog-illo-"));
for (const name of names) {
  const png = path.join(temp, `${name}.png`);
  execFileSync(browser, [
    "--headless=new", "--disable-gpu", "--hide-scrollbars", `--user-data-dir=${path.join(temp, "profile")}`,
    "--force-device-scale-factor=2", "--window-size=1600,1000", "--virtual-time-budget=8000",
    `--screenshot=${png}`, `${pathToFileURL(path.join(here, "index.html")).href}?i=${name}`,
  ], { stdio: "ignore" });
  const out = path.join(assets, `${files[name]}.webp`);
  mkdirSync(path.dirname(out), { recursive: true });
  await sharp(png).resize(2000).webp({ quality: 86 }).toFile(out);
  console.log(out);
}
rmSync(temp, { recursive: true, force: true });
