// Writes one static HTML file per route into dist/ after `vite build`.
// Each file carries that route's title, description, canonical and OG tags,
// plus a text summary inside #root for crawlers that do not run JavaScript.
// React replaces the summary as soon as it mounts.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");

const HIDDEN =
  "position:absolute;width:1px;height:1px;margin:-1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap";

function esc(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function replaceOnce(html, pattern, replacement, label) {
  if (!pattern.test(html)) throw new Error(`prerender: ${label} not found in dist/index.html`);
  return html.replace(pattern, () => replacement);
}

function metaPattern(attr, key) {
  return new RegExp(`<meta\\s+${attr}="${key}"\\s+content="[^"]*"\\s*/>`);
}

function renderPage(template, seo, siteUrl, body) {
  const url = seo.path === "/" ? `${siteUrl}/` : `${siteUrl}${seo.path}`;
  const title = esc(seo.title);
  const description = esc(seo.description);
  let html = template;

  html = replaceOnce(html, /<title>[^<]*<\/title>/, `<title>${title}</title>`, "title");
  html = replaceOnce(
    html,
    metaPattern("name", "description"),
    `<meta name="description" content="${description}" />`,
    "description",
  );
  html = replaceOnce(
    html,
    /<link rel="canonical" href="[^"]*"\s*\/>/,
    `<link rel="canonical" href="${url}" />`,
    "canonical",
  );
  html = replaceOnce(
    html,
    metaPattern("property", "og:type"),
    `<meta property="og:type" content="${seo.type ?? "website"}" />`,
    "og:type",
  );
  html = replaceOnce(html, metaPattern("property", "og:url"), `<meta property="og:url" content="${url}" />`, "og:url");
  html = replaceOnce(
    html,
    metaPattern("property", "og:title"),
    `<meta property="og:title" content="${title}" />`,
    "og:title",
  );
  html = replaceOnce(
    html,
    metaPattern("property", "og:description"),
    `<meta property="og:description" content="${description}" />`,
    "og:description",
  );
  html = replaceOnce(
    html,
    metaPattern("name", "twitter:title"),
    `<meta name="twitter:title" content="${title}" />`,
    "twitter:title",
  );
  html = replaceOnce(
    html,
    metaPattern("name", "twitter:description"),
    `<meta name="twitter:description" content="${description}" />`,
    "twitter:description",
  );
  html = replaceOnce(
    html,
    /<div id="root"><\/div>/,
    `<div id="root"><div style="${HIDDEN}">${body}</div></div>`,
    "#root",
  );
  return html;
}

const nav =
  '<nav><a href="/">Home</a> <a href="/cases">Cases</a> <a href="/blog">Blog</a> <a href="/contact">Contact</a></nav>';

function list(items) {
  return `<ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul>`;
}

// Full case copy lives in the shared /src/data files, keyed here by case slug.
// Drumkit's copy is inline in CasePage.jsx, so it only gets the short summary.
const caseContentFiles = {
  "yummo-food-guide-for-moms": ["yummo.js", "yummoCase"],
  nodity: ["genie.js", "genieCase"],
  "sales-driver-ads-tool": ["salesDriver.js", "salesDriverCase"],
};

const TEXT_KEYS = new Set(["subtitle", "description", "kicker", "caption", "summary", "text"]);

function caseCopy(node, depth = 0) {
  if (Array.isArray(node)) return node.map((item) => caseCopy(item, depth)).join("");
  if (!node || typeof node !== "object") return "";
  let html = "";
  for (const [key, value] of Object.entries(node)) {
    if (key === "navigationItems") continue;
    if (key === "overview" && Array.isArray(value)) {
      for (const [label, text] of value) {
        html += `<h2>${esc(String(label).replace(/[[]]/g, "").trim())}</h2><p>${esc(text)}</p>`;
      }
    } else if (key === "title" && typeof value === "string") {
      if (depth > 0) html += `<h2>${esc(value)}</h2>`;
    } else if (TEXT_KEYS.has(key) && typeof value === "string") {
      html += `<p>${esc(value)}</p>`;
    } else if (typeof value === "object") {
      html += caseCopy(value, depth + 1);
    }
  }
  return html;
}

const server = await createServer({
  root,
  logLevel: "error",
  appType: "custom",
  server: { middlewareMode: true, hmr: false, ws: false },
});

try {
  const { resolvePageSeo, SITE_URL } = await server.ssrLoadModule("/src/seo.js");
  const { cases } = await server.ssrLoadModule("/src/data/cases.js");
  const { blogPosts } = await server.ssrLoadModule("/src/data/blog.js");
  const { services, testimonials, faqs } = await server.ssrLoadModule("/src/data/content.js");

  const template = readFileSync(path.join(dist, "index.html"), "utf8");

  const caseLinks = list(
    cases.map((item) => `<a href="/cases/${esc(item.slug)}">${esc(item.name)}</a>: ${esc(item.summary)}`),
  );
  const postLinks = list(
    blogPosts.map((post) => `<a href="/blog/${esc(post.slug)}">${esc(post.title)}</a>: ${esc(post.excerpt)}`),
  );

  const routes = [];

  for (const project of cases) {
    const seo = resolvePageSeo(`/cases/${project.slug}`, { project });
    let copy = "";
    const source = caseContentFiles[project.slug];
    if (source) {
      const file = path.resolve(root, "..", "src", "data", source[0]).replaceAll("\\", "/");
      const mod = await server.ssrLoadModule(`/@fs/${file}`);
      copy = caseCopy(mod[source[1]]);
    }
    routes.push({
      seo,
      body: `${nav}<h1>${esc(project.name)}</h1><p>${esc(project.summary)}</p><p>${esc(
        project.tags.join(", "),
      )}</p>${copy}<h2>More cases</h2>${caseLinks}`,
    });
  }

  for (const post of blogPosts) {
    const seo = resolvePageSeo(`/blog/${post.slug}`, { post });
    routes.push({
      seo,
      body: `${nav}<h1>${esc(post.title)}</h1><p>${esc(post.excerpt)}</p><p>${esc(
        post.publishedLabel,
      )}</p><h2>More articles</h2>${postLinks}`,
    });
  }

  routes.push({ seo: resolvePageSeo("/cases"), body: `${nav}<h1>Cases</h1>${caseLinks}` });
  routes.push({ seo: resolvePageSeo("/blog"), body: `${nav}<h1>Blog</h1>${postLinks}` });

  for (const pathname of ["/contact", "/terms", "/privacy"]) {
    const seo = resolvePageSeo(pathname);
    routes.push({ seo, body: `${nav}<h1>${esc(seo.title)}</h1><p>${esc(seo.description)}</p>` });
  }

  for (const { seo, body } of routes) {
    const dir = path.join(dist, ...seo.path.split("/").filter(Boolean));
    mkdirSync(dir, { recursive: true });
    writeFileSync(path.join(dir, "index.html"), renderPage(template, seo, SITE_URL, body));
  }

  // Home is written last: dist/index.html is also the template for the routes above.
  const homeSeo = resolvePageSeo("/");
  const homeBody = [
    nav,
    "<h1>Pull prototype into shippable product design</h1>",
    `<p>${esc(homeSeo.description)}</p>`,
    "<h2>Projects</h2>",
    caseLinks,
    "<h2>Services</h2>",
    list(services.map((item) => `${esc(item.title)}: ${esc(item.description)}`)),
    "<h2>Proof, from founders we’ve shipped with</h2>",
    list(testimonials.map((item) => `${esc(item.quote)} ${esc(item.name)}, ${esc(item.role)}`)),
    "<h2>Common questions</h2>",
    list(faqs.map((item) => `${esc(item.question)} ${esc(item.answer)}`)),
  ].join("");
  writeFileSync(path.join(dist, "index.html"), renderPage(template, homeSeo, SITE_URL, homeBody));

  console.log(`Prerendered ${routes.length + 1} routes`);
} finally {
  await server.close();
}
