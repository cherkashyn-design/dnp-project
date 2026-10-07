import { useEffect, useState } from "react";

import { appHref, stripBase } from "./base.js";
import { SiteFooter } from "./components/SiteFooter.jsx";
import { SiteHeader } from "./components/SiteHeader.jsx";
import { getBlogPost } from "./data/blog.js";
import { getCase } from "./data/cases.js";
import { ArticlePage } from "./pages/ArticlePage.jsx";
import { BlogPage } from "./pages/BlogPage.jsx";
import { CasePage } from "./pages/CasePage.jsx";
import { CasesPage } from "./pages/CasesPage.jsx";
import { ContactPage } from "./pages/ContactPage.jsx";
import { HomePage } from "./pages/HomePage.jsx";
import { SimplePage } from "./pages/SimplePage.jsx";
import { applyPageSeo, resolvePageSeo } from "./seo.js";

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
  if (node.closest("[data-ink]")) return true;
  if (node.closest("img, video, canvas")) return true;
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
    const nodes = document.querySelectorAll("[data-reveal]");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      nodes.forEach((node) => node.classList.add("is-in"));
      return undefined;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.2 },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
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
    return () => {
      window.removeEventListener("scroll", syncInk);
      window.removeEventListener("resize", syncInk);
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
    page = (
      <SimplePage title="Terms">
        <p>Terms of use for Do Not Press.</p>
      </SimplePage>
    );
  } else if (pathname === "/privacy") {
    page = (
      <SimplePage title="Privacy">
        <p>How Do Not Press handles the details you send through the contact form.</p>
      </SimplePage>
    );
  }

  return (
    <div className={pathname === "/contact" ? "page is-ink" : "page"}>
      <SiteHeader path={pathname} onNavigate={navigate} />
      <main key={pathname}>{page}</main>
      <SiteFooter onNavigate={navigate} />
    </div>
  );
}
