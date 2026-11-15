// Writes one static HTML file per route into dist/ after `vite build`.
// Each file carries that route's title, description, canonical and OG tags,
// plus a text summary inside #root for crawlers that do not run JavaScript.
// React replaces the summary as soon as it mounts.
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
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

function imageType(image) {
  if (image.endsWith(".webp")) return "image/webp";
  if (image.endsWith(".gif")) return "image/gif";
  if (image.endsWith(".png")) return "image/png";
  return "image/jpeg";
}

function renderPage(template, seo, siteUrl, body, jsonLd = "") {
  const url = seo.path === "/" ? `${siteUrl}/` : `${siteUrl}${seo.path}`;
  const title = esc(seo.title);
  const description = esc(seo.description);
  let html = template;

  if (seo.robots) {
    html = replaceOnce(html, metaPattern("name", "robots"), `<meta name="robots" content="${esc(seo.robots)}" />`, "robots");
  }
  // A page with its own picture: point the link preview at it, and drop the default picture's size.
  if (seo.image && /^https?:\/\//.test(seo.image) && !html.includes(`content="${seo.image}"`)) {
    const image = esc(seo.image);
    html = replaceOnce(html, metaPattern("property", "og:image"), `<meta property="og:image" content="${image}" />`, "og:image");
    html = replaceOnce(
      html,
      metaPattern("property", "og:image:type"),
      `<meta property="og:image:type" content="${imageType(seo.image)}" />`,
      "og:image:type",
    );
    html = replaceOnce(
      html,
      metaPattern("property", "og:image:alt"),
      `<meta property="og:image:alt" content="${esc(seo.imageAlt || seo.title)}" />`,
      "og:image:alt",
    );
    html = replaceOnce(html, metaPattern("name", "twitter:image"), `<meta name="twitter:image" content="${image}" />`, "twitter:image");
    html = html.replace(/\s*<meta\s+property="og:image:(width|height)"\s+content="[^"]*"\s*\/>/g, "");
  }
  if (jsonLd) {
    html = replaceOnce(
      html,
      /<\/head>/,
      `<script type="application/ld+json" id="page-ld">${jsonLd.replaceAll("<", "\\u003c")}</script></head>`,
      "</head>",
    );
  }

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
  draftlex: ["draftlex.js", "draftlexCase"],
  "one-gallon": ["onegallon.js", "oneGallonCase"],
  wardgrid: ["wardgrid.js", "wardgridCase"],
  ringproof: ["ringproof.js", "ringproofCase"],
};

// The text of an article as plain HTML for crawlers: the same blocks as ArticleBody in ArticlePage.jsx.
function inline(text) {
  return esc(text)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
}

function articleHtml(content, assetUrl) {
  return content
    .map((block) => {
      if (block.type === "h2") return `<h2>${esc(block.text)}</h2>`;
      if (block.type === "h3") return `<h3>${esc(block.text)}</h3>`;
      if (block.type === "ul" || block.type === "ol") {
        return `<${block.type}>${block.items.map((item) => `<li>${inline(item)}</li>`).join("")}</${block.type}>`;
      }
      if (block.type === "quote") return `<blockquote>${inline(block.text)}</blockquote>`;
      if (block.type === "image") {
        const caption = block.caption ? `<figcaption>${esc(block.caption)}</figcaption>` : "";
        return `<figure><img src="${esc(assetUrl(block.src))}" alt="${esc(block.alt || block.caption || "")}" />${caption}</figure>`;
      }
      if (block.parts) {
        const parts = block.parts.map((part) =>
          typeof part === "string" ? inline(part) : `<a href="${esc(part.href)}">${esc(part.label)}</a>`,
        );
        return `<p>${parts.join("")}</p>`;
      }
      return `<p>${inline(block.text)}</p>`;
    })
    .join("");
}

// Imported pictures come back from the dev server as source paths: find the built file with the same bytes.
function makeAssetUrl() {
  const dir = path.join(dist, "assets");
  const bySize = new Map();
  for (const name of readdirSync(dir)) {
    const file = path.join(dir, name);
    const size = statSync(file).size;
    if (!bySize.has(size)) bySize.set(size, []);
    bySize.get(size).push(file);
  }
  const cache = new Map();
  return (src) => {
    if (!src || /^(https?:|data:)/.test(src)) return src;
    if (cache.has(src)) return cache.get(src);
    const clean = decodeURI(src.split("?")[0]);
    const file = clean.startsWith("/@fs/") ? clean.slice("/@fs/".length) : path.join(root, clean);
    let found = src;
    if (existsSync(file)) {
      const bytes = readFileSync(file);
      const match = (bySize.get(bytes.length) || []).find((other) => readFileSync(other).equals(bytes));
      if (match) found = `/assets/${path.basename(match)}`;
    }
    if (found === src) console.warn(`prerender: no built file for ${src}`);
    cache.set(src, found);
    return found;
  };
}

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
  const { resolvePageSeo, pageJsonLd, SITE_URL } = await server.ssrLoadModule("/src/seo.js");
  const { cases } = await server.ssrLoadModule("/src/data/cases.js");
  const { blogPosts } = await server.ssrLoadModule("/src/data/blog.js");
  const { services, testimonials, faqs } = await server.ssrLoadModule("/src/data/content.js");

  const template = readFileSync(path.join(dist, "index.html"), "utf8");
  const assetUrl = makeAssetUrl();

  const caseLinks = list(
    cases.map((item) => `<a href="/cases/${esc(item.slug)}">${esc(item.name)}</a>: ${esc(item.summary)}`),
  );
  // Older articles without text on the site link straight to Medium, as the blog page does.
  const postHref = (post) => (post.content ? `/blog/${post.slug}` : post.href);
  const postLinks = list(
    blogPosts.map((post) => `<a href="${esc(postHref(post))}">${esc(post.title)}</a>: ${esc(post.excerpt)}`),
  );

  const routes = [];

  for (const project of cases) {
    const seo = resolvePageSeo(`/cases/${project.slug}`, { project, assetUrl });
    let copy = "";
    const source = caseContentFiles[project.slug];
    if (source) {
      const file = path.resolve(root, "..", "src", "data", source[0]).replaceAll("\\", "/");
      const mod = await server.ssrLoadModule(`/@fs/${file}`);
      copy = caseCopy(mod[source[1]]);
    }
    const article = blogPosts.find((post) => post.case === project.slug && post.content);
    const articleLink = article
      ? `<h2>From the blog</h2><p><a href="/blog/${esc(article.slug)}">${esc(article.title)}</a>: ${esc(article.excerpt)}</p>`
      : "";
    routes.push({
      seo,
      body: `${nav}<h1>${esc(project.name)}</h1><p>${esc(project.summary)}</p><p>${esc(
        project.tags.join(", "),
      )}</p>${copy}${articleLink}<h2>More cases</h2>${caseLinks}`,
    });
  }

  for (const post of blogPosts) {
    const seo = resolvePageSeo(`/blog/${post.slug}`, { post, assetUrl });
    const project = post.case ? cases.find((item) => item.slug === post.case) : null;
    const text = post.content
      ? articleHtml(post.content, assetUrl)
      : `<p>${esc(post.excerpt)}</p><p><a href="${esc(post.href)}">Read on Medium</a></p>`;
    const caseLink = project
      ? `<h2>The worked example</h2><p><a href="/cases/${esc(project.slug)}">${esc(project.name)}</a>: ${esc(project.summary)}</p>`
      : "";
    routes.push({
      seo,
      body: `${nav}<article><h1>${esc(post.title)}</h1><p><time datetime="${esc(post.publishedAt)}">${esc(
        post.publishedLabel,
      )}</time> · By Maksym Cherkashyn</p>${text}${caseLink}</article><h2>More articles</h2>${postLinks}`,
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
    writeFileSync(path.join(dir, "index.html"), renderPage(template, seo, SITE_URL, body, pageJsonLd(seo.jsonLd)));
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
