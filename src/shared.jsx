import { useEffect, useRef, useState } from "react";

import arrowRightIcon from "./assets/Icons/arrow-right-icon.svg";
import drumkitPreview from "../portfolio/Drumkit-UI/lottie/Preview.card.jpg";
import drumkitPreviewLq from "../portfolio/Drumkit-UI/lottie/Preview.card.lq.jpg";
import salesDriverPreview from "../portfolio/SalesDriver/Preview.card.jpg";
import salesDriverPreviewLq from "../portfolio/SalesDriver/Preview.card.lq.jpg";
import yummoPreview from "../portfolio/Yummo/Preview.card.jpg";
import yummoPreviewLq from "../portfolio/Yummo/Preview.card.lq.jpg";

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

export function ProgressiveImage({
  src,
  lqSrc: lqSrcProp,
  alt = "",
  className = "",
  style,
  decoding = "async",
  loading,
  fetchPriority,
  ...props
}) {
  const lqSrc = lqSrcProp ?? getLqSrc(src);
  const fullRef = useRef(null);
  const [loaded, setLoaded] = useState(!lqSrc);

  useEffect(() => {
    setLoaded(!lqSrc);

    if (!lqSrc) {
      return undefined;
    }

    const image = fullRef.current;
    if (image?.complete && image.naturalWidth > 0) {
      setLoaded(true);
    }

    return undefined;
  }, [src, lqSrc]);

  return (
    <span
      className={["progressive-image", loaded ? "is-loaded" : "", className].filter(Boolean).join(" ")}
      style={style}
    >
      {lqSrc ? (
        <img className="progressive-image-lq" src={lqSrc} alt="" aria-hidden="true" decoding="async" />
      ) : null}
      <img
        ref={fullRef}
        className="progressive-image-full"
        src={src}
        alt={alt}
        decoding={decoding}
        loading={loading}
        fetchPriority={fetchPriority}
        onLoad={() => setLoaded(true)}
        {...props}
      />
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
