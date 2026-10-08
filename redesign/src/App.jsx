import { Suspense, lazy, useEffect, useState } from "react";

import { appHref, stripBase } from "./base.js";
import { SiteFooter } from "./components/SiteFooter.jsx";
import { SiteHeader } from "./components/SiteHeader.jsx";
import { getBlogPost } from "./data/blog.js";
import { getCase } from "./data/cases.js";
import { INK_EVENT } from "./inkSurface.js";
import { HomePage } from "./pages/HomePage.jsx";
import { applyPageSeo, resolvePageSeo } from "./seo.js";

const CasePage = lazy(() => import("./pages/CasePage.jsx").then((m) => ({ default: m.CasePage })));
const CasesPage = lazy(() => import("./pages/CasesPage.jsx").then((m) => ({ default: m.CasesPage })));
const ContactPage = lazy(() => import("./pages/ContactPage.jsx").then((m) => ({ default: m.ContactPage })));
const BlogPage = lazy(() => import("./pages/BlogPage.jsx").then((m) => ({ default: m.BlogPage })));
const ArticlePage = lazy(() => import("./pages/ArticlePage.jsx").then((m) => ({ default: m.ArticlePage })));
const PrivacyPage = lazy(() => import("./pages/PrivacyPage.jsx").then((m) => ({ default: m.PrivacyPage })));
const TermsPage = lazy(() => import("./pages/TermsPage.jsx").then((m) => ({ default: m.TermsPage })));

function readPath() {
  return `${stripBase(window.location.pathname)}${window.location.hash}`;
}

function parseRgba(value) {
  const match = String(value).match(/rgba?\(([^)]+)\)/i);
  if (!match) return null;
  const parts = match[1].split(",").map((part) => Number(part.trim()));
  if (parts.length < 3 || parts.some((part) => Number.isNaN(part))) return null;
  return { r: parts[0], g: parts[1], b: parts[2], a: parts[3] ?? 1 };
}

function isDarkFill(color) {
  const rgba = parseRgba(color);
  if (!rgba || rgba.a < 0.4) return false;
  const channels = [rgba.r, rgba.g, rgba.b].map((channel) => {
    const value = channel / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2] < 0.48;
}

function isInkSurface(node, header) {
  if (!(node instanceof Element) || header.contains(node)) return false;
  // Only explicitly marked dark surfaces (sections or media sampled as dark).
  if (node.closest("[data-ink]")) return true;
  return isDarkFill(getComputedStyle(node).backgroundColor);
}

export default function App() {
  const [path, setPath] = useState(readPath);

  useEffect(() => {
    const onPop = () => setPath(readPath());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const watched = new WeakSet();
    let io = null;

    const watch = (node) => {
      if (!(node instanceof Element) || !node.hasAttribute("data-reveal") || watched.has(node)) {
        return;
      }
      watched.add(node);
      if (reduced) {
        node.classList.add("is-in");
        return;
      }
      if (!io) {
        io = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) return;
              entry.target.classList.add("is-in");
              io?.unobserve(entry.target);
            });
          },
          { rootMargin: "0px", threshold: 0 },
        );
      }
      io.observe(node);
    };

    const scan = () => {
      document.querySelectorAll("[data-reveal]").forEach(watch);
    };

    // Lazy routes mount after this effect; rescan when Suspense inserts content.
    scan();
    const root = document.querySelector("main") || document.body;
    const mo = new MutationObserver(scan);
    mo.observe(root, { childList: true, subtree: true });

    return () => {
      mo.disconnect();
      io?.disconnect();
    };
  }, [path]);

  useEffect(() => {
    const page = document.querySelector(".page");
    const header = document.querySelector(".site-header");
    if (!page || !header) return undefined;

    const syncInk = () => {
      if (page.classList.contains("is-ink")) {
        page.classList.remove("is-over-ink");
        return;
      }
      const band = header.getBoundingClientRect();
      const nav = header.querySelector(".nav-pills") || header.querySelector(".menu-toggle") || header;
      const navBox = nav.getBoundingClientRect();
      const sampleY = Math.min(Math.max(band.top + band.height * 0.5, 8), window.innerHeight - 8);
      const sampleXs = [
        navBox.left + 20,
        navBox.left + navBox.width * 0.35,
        navBox.left + navBox.width * 0.65,
      ].map((x) => Math.min(Math.max(x, 8), window.innerWidth - 8));

      header.style.pointerEvents = "none";
      const over = sampleXs.some((sampleX) =>
        document.elementsFromPoint(sampleX, sampleY).some((node) => isInkSurface(node, header)),
      );
      header.style.pointerEvents = "";
      page.classList.toggle("is-over-ink", over);
    };

    syncInk();
    window.addEventListener("scroll", syncInk, { passive: true });
    window.addEventListener("resize", syncInk);
    window.addEventListener(INK_EVENT, syncInk);
    return () => {
      window.removeEventListener("scroll", syncInk);
      window.removeEventListener("resize", syncInk);
      window.removeEventListener(INK_EVENT, syncInk);
      page.classList.remove("is-over-ink");
    };
  }, [path]);

  const navigate = (href) => {
    const url = new URL(href, window.location.origin);
    const next = `${url.pathname}${url.hash}`;
    if (next === readPath()) {
      if (url.hash) {
        document.querySelector(url.hash)?.scrollIntoView();
      }
      return;
    }
    window.history.pushState({}, "", appHref(next));
    setPath(next);
    if (url.hash) {
      requestAnimationFrame(() => document.querySelector(url.hash)?.scrollIntoView());
    } else {
      window.scrollTo(0, 0);
    }
  };

  const pathname = path.split("#")[0];
  const caseSlug = pathname.startsWith("/cases/") ? pathname.slice("/cases/".length) : "";
  const blogSlug = pathname.startsWith("/blog/") ? pathname.slice("/blog/".length) : "";
  const project = caseSlug ? getCase(caseSlug) : null;
  const post = blogSlug ? getBlogPost(blogSlug) : null;

  useEffect(() => {
    applyPageSeo(resolvePageSeo(pathname, { project, post }));
  }, [pathname, project, post]);

  let page = <HomePage onNavigate={navigate} />;
  if (project) {
    page = <CasePage project={project} onNavigate={navigate} />;
  } else if (pathname === "/cases") {
    page = <CasesPage onNavigate={navigate} />;
  } else if (pathname === "/contact") {
    page = <ContactPage />;
  } else if (pathname === "/blog") {
    page = <BlogPage onNavigate={navigate} />;
  } else if (pathname.startsWith("/blog/")) {
    page = <ArticlePage onNavigate={navigate} slug={blogSlug} />;
  } else if (pathname === "/terms") {
    page = <TermsPage />;
  } else if (pathname === "/privacy") {
    page = <PrivacyPage />;
  }

  return (
    <div className={pathname === "/contact" ? "page is-ink" : "page"}>
      <SiteHeader path={pathname} onNavigate={navigate} />
      <main key={pathname}>
        <Suspense fallback={null}>{page}</Suspense>
      </main>
      <SiteFooter onNavigate={navigate} />
    </div>
  );
}
