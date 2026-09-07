import { forwardRef, useEffect, useRef, useState } from "react";

import { ProjectCard } from "../components/ProjectCard.jsx";
import {
  CopiedToast,
  HomeMobileCta,
  HomeMobileHeader,
  InfoPanel,
  SiteFooter,
} from "../components/home/HomeChrome.jsx";
import { cases } from "../data/site.js";
import { useRevealAnimations } from "../hooks/useRevealAnimations.js";

const COPIED_VISIBLE_MS = 2000;

const CaseList = forwardRef(function CaseList(_props, ref) {
  return (
    <section className="cases-column" ref={ref} aria-label="Selected cases">
      <div className="cases-grid">
        {cases.map((project, index) => (
          <ProjectCard key={project.name} project={project} priority={index === 0} />
        ))}
      </div>
      <SiteFooter />
    </section>
  );
});

export default function HomePage() {
  const casesRef = useRef(null);
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
      const casesElement = casesRef.current;
      if (!casesElement) {
        return;
      }

      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const viewportHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const casesTop = casesElement.offsetTop;
      const casesBottom = casesTop + casesElement.offsetHeight;
      const isDesktop = window.matchMedia("(min-width: 800px)").matches;

      setScrollState({
        hasScrolled: scrollTop > 2,
        hasScrolledCases: isDesktop ? scrollTop > 2 : scrollTop > casesTop - 2,
        isAtEnd: scrollTop + viewportHeight >= documentHeight - 4,
        isCasesActive: isDesktop || (scrollTop + viewportHeight > casesTop && scrollTop < casesBottom),
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
        scrollState.hasScrolledCases ? "has-scrolled-cases" : "",
        scrollState.isAtEnd ? "is-at-end" : "",
        scrollState.isCasesActive ? "is-cases-active" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <CopiedToast open={copiedOpen} />
      <HomeMobileHeader isScrolled={scrollState.hasScrolled} />
      <CaseList ref={casesRef} />
      <InfoPanel onCopied={showCopiedToast} />
      <HomeMobileCta onCopied={showCopiedToast} />
      <div className="cases-fade cases-fade-top" aria-hidden="true" />
      <div className="cases-fade cases-fade-bottom" aria-hidden="true" />
    </main>
  );
}
