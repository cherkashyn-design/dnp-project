export const SITE_URL = "https://www.donotpress.studio";
export const SITE_NAME = "Do Not Press";
export const DEFAULT_TITLE = "Do Not Press | Product Design Studio & Agency";
export const DEFAULT_DESCRIPTION =
  "Do Not Press is a product design studio and agency for startups. Hire Do Not Press design for SaaS UI, brand identity, and websites that ship.";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

function upsertMeta(selector, attrs) {
  let node = document.head.querySelector(selector);
  if (!node) {
    node = document.createElement("meta");
    document.head.appendChild(node);
  }
  Object.entries(attrs).forEach(([key, value]) => {
    node.setAttribute(key, value);
  });
}

function upsertLink(rel, href) {
  let node = document.head.querySelector(`link[rel="${rel}"]`);
  if (!node) {
    node = document.createElement("link");
    node.setAttribute("rel", rel);
    document.head.appendChild(node);
  }
  node.setAttribute("href", href);
}

function absoluteUrl(path = "/") {
  if (!path || path === "/") return `${SITE_URL}/`;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function resolvePageSeo(pathname, { project, post } = {}) {
  if (project) {
    return {
      title: `${project.name} | Case Study | Do Not Press`,
      description: `${project.summary} Case study by Do Not Press, a product design studio and agency.`,
      path: `/cases/${project.slug}`,
      type: "article",
    };
  }

  if (pathname === "/cases") {
    return {
      title: "Cases | Do Not Press Design Studio",
      description:
        "Selected product, brand, and landing work from Do Not Press studio — design for startups that need to ship.",
      path: "/cases",
    };
  }

  if (pathname === "/contact") {
    return {
      title: "Contact Do Not Press | Design Agency",
      description:
        "Contact Do Not Press studio to talk about product design, brand, or a website. Reply in one business day.",
      path: "/contact",
    };
  }

  if (pathname === "/blog") {
    return {
      title: "Blog | Do Not Press Design",
      description:
        "Design systems, conversion, and UX writing from Do Not Press — a product design studio and agency.",
      path: "/blog",
    };
  }

  if (post) {
    return {
      title: `${post.title} | Do Not Press`,
      description: post.excerpt || DEFAULT_DESCRIPTION,
      path: `/blog/${post.slug}`,
      type: "article",
    };
  }

  if (pathname === "/terms") {
    return {
      title: "Terms | Do Not Press",
      description: "Terms for using the Do Not Press website and contact forms.",
      path: "/terms",
    };
  }

  if (pathname === "/privacy") {
    return {
      title: "Privacy Policy | Do Not Press",
      description: "Privacy policy for Do Not Press studio and agency.",
      path: "/privacy",
    };
  }

  return {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    path: "/",
  };
}

export function applyPageSeo({ title, description, path, type = "website", image = DEFAULT_OG_IMAGE }) {
  const url = absoluteUrl(path);
  const nextTitle = title || DEFAULT_TITLE;
  const nextDescription = description || DEFAULT_DESCRIPTION;

  document.title = nextTitle;

  upsertMeta('meta[name="description"]', { name: "description", content: nextDescription });
  upsertMeta('meta[name="robots"]', { name: "robots", content: "index, follow, max-image-preview:large" });
  upsertMeta('meta[property="og:type"]', { property: "og:type", content: type });
  upsertMeta('meta[property="og:site_name"]', { property: "og:site_name", content: SITE_NAME });
  upsertMeta('meta[property="og:title"]', { property: "og:title", content: nextTitle });
  upsertMeta('meta[property="og:description"]', { property: "og:description", content: nextDescription });
  upsertMeta('meta[property="og:url"]', { property: "og:url", content: url });
  upsertMeta('meta[property="og:image"]', { property: "og:image", content: image });
  upsertMeta('meta[name="twitter:card"]', { name: "twitter:card", content: "summary_large_image" });
  upsertMeta('meta[name="twitter:title"]', { name: "twitter:title", content: nextTitle });
  upsertMeta('meta[name="twitter:description"]', { name: "twitter:description", content: nextDescription });
  upsertMeta('meta[name="twitter:image"]', { name: "twitter:image", content: image });
  upsertLink("canonical", url);
}
