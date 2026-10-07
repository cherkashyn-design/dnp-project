import { cpSync, existsSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const redesign = join(root, "redesign");
const dist = join(root, "dist");
const publicDir = join(root, "public");

if (!existsSync(join(redesign, "package.json"))) {
  console.error("Missing redesign/ app. Expected vendored DNP-V2 source.");
  process.exit(1);
}

const install = spawnSync("npm", ["install", "--no-fund", "--no-audit"], {
  cwd: redesign,
  stdio: "inherit",
});
if (install.status !== 0) process.exit(install.status ?? 1);

const build = spawnSync("npm", ["run", "build"], {
  cwd: redesign,
  stdio: "inherit",
});
if (build.status !== 0) process.exit(build.status ?? 1);

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });
cpSync(join(redesign, "dist"), dist, { recursive: true });

if (existsSync(publicDir)) {
  for (const name of readdirSync(publicDir)) {
    if (name === "v2") continue;
    cpSync(join(publicDir, name), join(dist, name), { recursive: true });
  }
}

console.log("Built redesign into dist/");
