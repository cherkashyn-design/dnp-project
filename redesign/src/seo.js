export const SITE_URL = "https://www.donotpress.studio";
export const SITE_NAME = "Do Not Press";
export const DEFAULT_TITLE = "Do Not Press | Product Design Studio & Agency";
export const DEFAULT_DESCRIPTION =
  "Do Not Press is a product design studio and agency for startups. Hire Do Not Press design for SaaS UI, brand identity, and websites that ship.";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-logo.png`;
const INDEX = "index, follow, max-image-preview:large";
const AUTHOR = { "@type": "Person", name: "Maksym Cherkashyn" };
const PUBLISHER = { "@id": `${SITE_URL}/#organization` };

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
  if (/^https?:\/\//.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

function breadcrumbs(items) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map(([name, path], index) => ({
      "@type": "ListItem",
      position: index + 1,
      name,
      item: absoluteUrl(path),
    })),
  };
}

// assetUrl turns an imported picture into its public path; the prerender passes one that knows the built file names.
export function resolvePageSeo(pathname, { project, post, assetUrl = (src) => src } = {}) {
  if (project) {
    const path = `/cases/${project.slug}`;
    const image = project.image ? absoluteUrl(assetUrl(project.image)) : DEFAULT_OG_IMAGE;
    const concept = project.tags.includes("Concept");
    return {
      title: `${project.name} | Case Study | Do Not Press`,
      description: `${project.summary} ${concept ? "Concept case" : "Case study"} by Do Not Press, a product design studio and agency.`,
      path,
      type: "article",
      image,
      jsonLd: [
        {
          "@type": "CreativeWork",
          "@id": `${absoluteUrl(path)}#work`,
          name: project.title,
          headline: project.name,
          description: project.summary,
          url: absoluteUrl(path),
          image,
          creator: PUBLISHER,
          keywords: project.tags.join(", "),
        },
        breadcrumbs([["Home", "/"], ["Cases", "/cases"], [project.title, path]]),
      ],
    };
  }

  if (pathname === "/cases") {
    return {
      title: "Cases | Do Not Press Design Studio",
      description:
        "Selected product, brand, and landing work from Do Not Press studio, for startups that need to ship.",
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
        "Methods for founders and product teams: AI tools, B2B SaaS UX, brand systems, app launches and landing pages, from Do Not Press design studio.",
      path: "/blog",
    };
  }

  if (post) {
    const path = `/blog/${post.slug}`;
    const image = post.cover ? absoluteUrl(assetUrl(post.cover)) : DEFAULT_OG_IMAGE;
    // An older article has no text here, only a link to Medium: keep it out of the index.
    if (!post.content) {
      return {
        title: `${post.title} | Do Not Press`,
        description: post.excerpt || DEFAULT_DESCRIPTION,
        path,
        type: "article",
        image,
        robots: "noindex, follow",
      };
    }
    return {
      title: post.seoTitle || `${post.title} | Do Not Press`,
      description: post.excerpt || DEFAULT_DESCRIPTION,
      path,
      type: "article",
      image,
      imageAlt: post.coverAlt,
      jsonLd: [
        {
          "@type": "BlogPosting",
          "@id": `${absoluteUrl(path)}#article`,
          headline: post.title,
          description: post.excerpt,
          url: absoluteUrl(path),
          mainEntityOfPage: absoluteUrl(path),
          image,
          datePublished: post.publishedAt,
          dateModified: post.updatedAt || post.publishedAt,
          author: AUTHOR,
          publisher: PUBLISHER,
          keywords: post.tags.join(", "),
          ...(post.case ? { about: { "@id": `${absoluteUrl(`/cases/${post.case}`)}#work` } } : {}),
        },
        breadcrumbs([["Home", "/"], ["Blog", "/blog"], [post.title, path]]),
      ],
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

function imageType(image) {
  if (image.endsWith(".gif")) return "image/gif";
  if (image.endsWith(".webp")) return "image/webp";
  if (/\.jpe?g$/.test(image)) return "image/jpeg";
  return "image/png";
}

export function pageJsonLd(jsonLd) {
  return jsonLd?.length ? JSON.stringify({ "@context": "https://schema.org", "@graph": jsonLd }) : "";
}

export function applyPageSeo({
  title,
  description,
  path,
  type = "website",
  image = DEFAULT_OG_IMAGE,
  imageAlt,
  robots = INDEX,
  jsonLd,
}) {
  const url = absoluteUrl(path);
  const nextTitle = title || DEFAULT_TITLE;
  const nextDescription = description || DEFAULT_DESCRIPTION;

  document.title = nextTitle;

  upsertMeta('meta[name="description"]', { name: "description", content: nextDescription });
  upsertMeta('meta[name="robots"]', { name: "robots", content: robots });
  upsertMeta('meta[property="og:type"]', { property: "og:type", content: type });
  upsertMeta('meta[property="og:site_name"]', { property: "og:site_name", content: SITE_NAME });
  upsertMeta('meta[property="og:title"]', { property: "og:title", content: nextTitle });
  upsertMeta('meta[property="og:description"]', { property: "og:description", content: nextDescription });
  upsertMeta('meta[property="og:url"]', { property: "og:url", content: url });
  upsertMeta('meta[property="og:image"]', { property: "og:image", content: image });
  upsertMeta('meta[property="og:image:type"]', { property: "og:image:type", content: imageType(image) });
  upsertMeta('meta[property="og:image:alt"]', {
    property: "og:image:alt",
    content: imageAlt || (image === DEFAULT_OG_IMAGE ? "Do Not Press logo" : nextTitle),
  });
  // The size in index.html belongs to the default picture only.
  if (image !== DEFAULT_OG_IMAGE) {
    document.head
      .querySelectorAll('meta[property="og:image:width"], meta[property="og:image:height"]')
      .forEach((node) => node.remove());
  }
  upsertMeta('meta[name="twitter:card"]', { name: "twitter:card", content: "summary_large_image" });
  upsertMeta('meta[name="twitter:title"]', { name: "twitter:title", content: nextTitle });
  upsertMeta('meta[name="twitter:description"]', { name: "twitter:description", content: nextDescription });
  upsertMeta('meta[name="twitter:image"]', { name: "twitter:image", content: image });
  upsertLink("canonical", url);

  // Structured data for this page, next to the site-wide Organization block in index.html.
  let script = document.head.querySelector("script#page-ld");
  const ld = pageJsonLd(jsonLd);
  if (!ld) {
    script?.remove();
  } else {
    if (!script) {
      script = document.createElement("script");
      script.type = "application/ld+json";
      script.id = "page-ld";
      document.head.appendChild(script);
    }
    script.textContent = ld;
  }
}
