// Draws the article covers: covers.html?i=<name>, 2000 x 1400, saved as WebP into src/assets/blog/<folder>/cover.webp.
// Usage, from this folder: node covers.mjs [draftlex onegallon wardgrid ringproof salesdriver nodity]
// Needs Edge (or set BROWSER to Chrome's path) and the sharp package.
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import sharp from "sharp";

const here = path.dirname(fileURLToPath(import.meta.url));
const assets = process.env.ASSETS || path.resolve(here, "../../../src/assets/blog");
const browser = process.env.BROWSER || "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const folders = { draftlex: "draftlex", onegallon: "onegallon", wardgrid: "wardgrid", ringproof: "ringproof", salesdriver: "sales-driver", nodity: "nodity" };
const names = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(folders);
const temp = mkdtempSync(path.join(tmpdir(), "blog-cover-"));
for (const name of names) {
  const png = path.join(temp, `${name}.png`);
  execFileSync(browser, [
    "--headless=new", "--disable-gpu", "--hide-scrollbars", `--user-data-dir=${path.join(temp, "profile")}`,
    "--force-device-scale-factor=1", "--window-size=2000,1400", "--virtual-time-budget=8000",
    `--screenshot=${png}`, `${pathToFileURL(path.join(here, "covers.html")).href}?i=${name}`,
  ], { stdio: "ignore" });
  const out = path.join(assets, folders[name], "cover.webp");
  mkdirSync(path.dirname(out), { recursive: true });
  await sharp(png).webp({ quality: 86 }).toFile(out);
  if (process.env.PREVIEW) await sharp(png).resize(1000).jpeg({ quality: 72 }).toFile(path.join(process.env.PREVIEW, `${name}.jpg`));
  console.log(out);
}
rmSync(temp, { recursive: true, force: true });
