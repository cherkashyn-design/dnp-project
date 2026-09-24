import { useLayoutEffect } from "react";

function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
  // Treat near-viewport items as visible so SPA navigations don't flash hidden content.
  return rect.top < viewportHeight + 24 && rect.bottom > -24;
}

export function useRevealAnimations() {
  useLayoutEffect(() => {
    const root = document.getElementById("root");
    if (!root) {
      return undefined;
    }

    const isInOtherProjects = (element) => element.closest(".other-projects-section");
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const textElements = Array.from(
      root.querySelectorAll(
        [
          ".intro h1",
          ".intro-copy p",
          ".services li:not(.service-divider)",
          ".project-info h2",
          ".blog-card-title-row h2",
          ".blog-card-excerpt",
          ".case-hero-info h1",
          ".info-block p",
          ".case-meta dt",
          ".case-section h2",
          ".overview-grid blockquote p",
          ".overview-grid cite",
          ".case-media-block figcaption",
          ".case-stats strong",
          ".case-stats span",
          ".section-heading-row p",
          ".feature-section h3",
          ".case-summary > p",
          ".stats-eyebrow",
        ].join(", "),
      ),
    ).filter(
      (element) =>
        element.textContent.trim().length > 0 &&
        !element.closest(".case-nav-slider") &&
        !isInOtherProjects(element),
    );

    const motionElements = Array.from(
      root.querySelectorAll(
        [
          ".project-card",
          ".blog-card",
          ".case-hero-image-frame",
          ".case-hero-info",
          ".case-media-block",
          ".overview-grid blockquote",
          ".feature-section",
          ".case-stats",
          ".case-meta div",
          ".case-nav-slider",
          ".back-link",
          ".start-project-pill",
          ".site-footer",
        ].join(", "),
      ),
    ).filter((element) => !isInOtherProjects(element));

    const animatedElements = [...new Set([...textElements, ...motionElements])];

    const revealAll = () => {
      animatedElements.forEach((element) => {
        element.classList.add("is-visible");
      });
    };

    textElements.forEach((element) => {
      element.classList.add("text-reveal");
      if (prefersReducedMotion || isInViewport(element)) {
        element.classList.add("is-visible");
      }
    });

    motionElements.forEach((element) => {
      element.classList.add("reveal-motion");
      if (prefersReducedMotion || isInViewport(element)) {
        element.classList.add("is-visible");
      }
    });

    if (prefersReducedMotion) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: "0px",
        threshold: 0,
      },
    );

    animatedElements.forEach((element) => {
      if (!element.classList.contains("is-visible")) {
        observer.observe(element);
      }
    });

    const revealWhenAtBottom = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const documentHeight = document.documentElement.scrollHeight;

      if (scrollTop + viewportHeight >= documentHeight - 8) {
        revealAll();
      }
    };

    revealWhenAtBottom();
    window.addEventListener("scroll", revealWhenAtBottom, { passive: true });
    window.addEventListener("resize", revealWhenAtBottom);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", revealWhenAtBottom);
      window.removeEventListener("resize", revealWhenAtBottom);
    };
  }, []);
}
