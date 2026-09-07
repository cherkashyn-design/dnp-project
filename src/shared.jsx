import { useEffect, useRef, useState } from "react";

import arrowRightIcon from "./assets/Icons/arrow-right-icon.svg";
import drumkitPreview from "../portfolio/Drumkit-UI/lottie/Preview.jpg";
import drumkitPreviewLq from "../portfolio/Drumkit-UI/lottie/Preview.lq.jpg";
import salesDriverPreview from "../portfolio/SalesDriver/Preview.jpg";
import salesDriverPreviewLq from "../portfolio/SalesDriver/Preview.lq.jpg";
import yummoPreview from "../portfolio/Yummo/Preview.jpg";
import yummoPreviewLq from "../portfolio/Yummo/Preview.lq.jpg";

const lqByFullUrl = new Map();

export function registerLqMap(entries) {
  for (const [fullUrl, lqUrl] of entries) {
    lqByFullUrl.set(fullUrl, lqUrl);
  }
}

export function getLqSrc(src) {
  return lqByFullUrl.get(src);
}

export const email = "contact@donotpress.com";

export const cases = [
  {
    name: "Yummo - Food guide for moms",
    image: yummoPreview,
    lqImage: yummoPreviewLq,
    tags: ["Branding", "Landing", "App"],
    href: "/cases/yummo-food-guide-for-moms",
  },
  {
    name: "Sales Driver - Ads Tool",
    image: salesDriverPreview,
    lqImage: salesDriverPreviewLq,
    tags: ["Branding", "Landing", "Deck"],
    href: "/cases/sales-driver-ads-tool",
  },
  {
    name: "Drumkit - Logistic SaaS",
    image: drumkitPreview,
    lqImage: drumkitPreviewLq,
    tags: ["Web UI / SaaS", "Landing"],
    href: "/cases/drumkit-logistic-saas",
  },
];

/* Progressive LQ + deferred full-image load. Flip to false to disable. */
const ENABLE_PROGRESSIVE_LOADING = true;

export function ProgressiveImage({
  src,
  lqSrc: lqSrcProp,
  alt = "",
  className = "",
  style,
  decoding = "async",
  loading,
  fetchPriority,
  rootMargin = "800px 0px",
  /** When true, fill a sized parent instead of reserving aspect-ratio locally. */
  fill = false,
  /** Used when fill is false to reserve layout space before the image loads. */
  aspectRatio = "4 / 3",
  ...props
}) {
  const lqSrc = ENABLE_PROGRESSIVE_LOADING ? (lqSrcProp ?? getLqSrc(src)) : undefined;
  const rootRef = useRef(null);
  const fullRef = useRef(null);
  const loadEager =
    !ENABLE_PROGRESSIVE_LOADING || loading === "eager" || fetchPriority === "high";
  const [activeSrc, setActiveSrc] = useState(loadEager ? src : undefined);
  const [loaded, setLoaded] = useState(Boolean(loadEager && !lqSrc));

  useEffect(() => {
    setActiveSrc(loadEager ? src : undefined);
    setLoaded(Boolean(loadEager && !lqSrc));
  }, [src, lqSrc, loadEager]);

  useEffect(() => {
    if (loadEager || activeSrc === src) {
      return undefined;
    }

    const node = rootRef.current;
    if (!node) {
      return undefined;
    }

    if (typeof IntersectionObserver === "undefined") {
      setActiveSrc(src);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setActiveSrc(src);
          observer.disconnect();
        }
      },
      { rootMargin, threshold: 0.01 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [src, loadEager, activeSrc, rootMargin]);

  useEffect(() => {
    if (!activeSrc) {
      return undefined;
    }

    const image = fullRef.current;
    if (image?.complete && image.naturalWidth > 0) {
      setLoaded(true);
    }

    return undefined;
  }, [activeSrc, lqSrc]);

  return (
    <span
      ref={rootRef}
      className={[
        "progressive-image",
        fill ? "is-fill" : "",
        loaded ? "is-loaded" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        ...style,
        ...(!fill && aspectRatio ? { aspectRatio } : null),
      }}
    >
      <span className="progressive-image-placeholder" aria-hidden="true" />
      {lqSrc ? (
        <img className="progressive-image-lq" src={lqSrc} alt="" aria-hidden="true" decoding="async" />
      ) : null}
      {activeSrc ? (
        <img
          ref={fullRef}
          className="progressive-image-full"
          src={activeSrc}
          alt={alt}
          decoding={decoding}
          loading={loadEager ? "eager" : "lazy"}
          fetchPriority={fetchPriority}
          onLoad={() => setLoaded(true)}
          {...props}
        />
      ) : null}
    </span>
  );
}

export function ProjectCard({ project, priority = false }) {
  const content = (
    <>
      <div className="project-image-wrap">
        <ProgressiveImage
          className="project-image"
          src={project.image}
          lqSrc={project.lqImage}
          alt={`${project.name} preview`}
          fill
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
        />
      </div>
      <div className="project-info">
        <div className="project-title-row">
          <img className="project-hover-arrow" src={arrowRightIcon} alt="" aria-hidden="true" />
          <h2>{project.name}</h2>
        </div>
        <ul aria-label={`${project.name} tags`}>
          {project.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
      </div>
    </>
  );

  return (
    <article className="project-card">
      {project.href ? (
        <a className="project-card-link" href={project.href}>
          {content}
        </a>
      ) : (
        content
      )}
    </article>
  );
}

export function useScrollZoomMedia() {
  useEffect(() => {
    let animationFrame = null;

    const updateMediaScale = () => {
      animationFrame = null;
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const mediaElements = document.querySelectorAll(
        ".case-hero-image-frame .progressive-image, .case-media > .progressive-image, .case-media > video",
      );

      mediaElements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        // Skip off-screen media — writing transforms on every image during Lottie-heavy
        // sections was contributing to scroll jank.
        if (rect.bottom < -160 || rect.top > viewportHeight + 160) {
          return;
        }

        const scrollDistance = viewportHeight + rect.height;
        const progress = Math.min(Math.max((viewportHeight - rect.top) / scrollDistance, 0), 1);
        const easedProgress = 1 - (1 - progress) ** 2;
        const scale = 1.2 - easedProgress * 0.2;

        element.style.transform = `scale(${scale})`;
      });
    };

    const requestUpdate = () => {
      if (animationFrame === null) {
        animationFrame = window.requestAnimationFrame(updateMediaScale);
      }
    };

    updateMediaScale();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (animationFrame !== null) {
        window.cancelAnimationFrame(animationFrame);
      }
    };
  }, []);
}

export function useRevealAnimations() {
  useEffect(() => {
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
      if (prefersReducedMotion) {
        element.classList.add("is-visible");
      }
    });

    motionElements.forEach((element) => {
      element.classList.add("reveal-motion");
      if (prefersReducedMotion) {
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

    animatedElements.forEach((element) => observer.observe(element));

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
