import { forwardRef, useEffect, useRef, useState } from "react";

import { BlogCard } from "../components/blog/BlogCard.jsx";
import {
  CopiedToast,
  EmailButton,
  HomeMobileCta,
  HomeMobileHeader,
  SiteFooter,
} from "../components/home/HomeChrome.jsx";
import dnpLogo from "../assets/brand/dnp-logo.png";
import { blogPosts } from "../data/blog.js";
import { useRevealAnimations } from "../hooks/useRevealAnimations.js";

const COPIED_VISIBLE_MS = 2000;

const BlogList = forwardRef(function BlogList(_props, ref) {
  return (
    <section className="cases-column blog-column" ref={ref} aria-label="Articles">
      <div className="vt-page-content cases-page-content">
        <div className="blog-grid">
          {blogPosts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
        <SiteFooter />
      </div>
    </section>
  );
});

function BlogInfoPanel({ onCopied }) {
  return (
    <aside className="info-panel" aria-labelledby="blog-title">
      <header className="info-header vt-chrome-header">
        <a className="logo vt-logo" href="/" aria-label="DoNotPress home">
          <img src={dnpLogo} alt="DoNotPress" />
        </a>
        <a className="start-project-pill vt-contact" href="/contact">
          Contact Us
        </a>
      </header>

      <div className="vt-page-content info-panel-content">
        <section className="intro">
          <h1 id="blog-title">Blog</h1>
          <div className="intro-copy">
            <p>
              Notes on design systems, conversion, and complex product UX —
              written from shipping work with startups and larger teams.
            </p>
            <ul className="services" aria-label="Topics">
              <li>Design Systems</li>
              <li>Conversion</li>
              <li>UX Audits</li>
              <li className="service-divider" aria-hidden="true" />
              <li>Enterprise UI</li>
              <li>Process</li>
            </ul>
          </div>
        </section>
      </div>

      <section className="cta cta-desktop vt-chrome-footer" aria-label="Contact">
        <EmailButton onCopied={onCopied} />
      </section>
    </aside>
  );
}

export default function BlogPage() {
  const listRef = useRef(null);
  const copiedTimerRef = useRef(null);
  const [copiedOpen, setCopiedOpen] = useState(false);
  const [scrollState, setScrollState] = useState({
    hasScrolled: false,
    hasScrolledCases: false,
    isAtEnd: false,
    isCasesActive: false,
  });

  useRevealAnimations();

  useEffect(() => {
    return () => {
      if (copiedTimerRef.current !== null) {
        window.clearTimeout(copiedTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const updateFadeState = () => {
      const listElement = listRef.current;
      if (!listElement) {
        return;
      }

      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const viewportHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const listTop = listElement.offsetTop;
      const listBottom = listTop + listElement.offsetHeight;
      const isDesktop = window.matchMedia("(min-width: 800px)").matches;

      setScrollState({
        hasScrolled: scrollTop > 2,
        hasScrolledCases: isDesktop ? scrollTop > 2 : scrollTop > listTop - 2,
        isAtEnd: scrollTop + viewportHeight >= documentHeight - 4,
        isCasesActive: isDesktop || (scrollTop + viewportHeight > listTop && scrollTop < listBottom),
      });
    };

    updateFadeState();
    window.addEventListener("scroll", updateFadeState, { passive: true });
    window.addEventListener("resize", updateFadeState);

    return () => {
      window.removeEventListener("scroll", updateFadeState);
      window.removeEventListener("resize", updateFadeState);
    };
  }, []);

  const showCopiedToast = () => {
    if (copiedTimerRef.current !== null) {
      window.clearTimeout(copiedTimerRef.current);
    }

    setCopiedOpen(true);
    copiedTimerRef.current = window.setTimeout(() => {
      setCopiedOpen(false);
      copiedTimerRef.current = null;
    }, COPIED_VISIBLE_MS);
  };

  return (
    <main
      className={[
        "home-page",
        "blog-page",
        scrollState.hasScrolledCases ? "has-scrolled-cases" : "",
        scrollState.isAtEnd ? "is-at-end" : "",
        scrollState.isCasesActive ? "is-cases-active" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <CopiedToast open={copiedOpen} />
      <HomeMobileHeader isScrolled={scrollState.hasScrolled} />
      <div className="home-page-body">
        <BlogList ref={listRef} />
        <BlogInfoPanel onCopied={showCopiedToast} />
      </div>
      <HomeMobileCta onCopied={showCopiedToast} />
      <div className="cases-fade cases-fade-top" aria-hidden="true" />
      <div className="cases-fade cases-fade-bottom" aria-hidden="true" />
    </main>
  );
}
