import { forwardRef, useEffect, useRef, useState } from "react";

import checkIcon from "./assets/Icons/check-icon.svg";
import copyIcon from "./assets/Icons/copy-icon.svg";
import dnpLogo from "./assets/Global/dnp-logo.png";
import { ProjectCard, cases, email, useRevealAnimations } from "./shared.jsx";

const COPIED_VISIBLE_MS = 2000;
const COPIED_ANIMATION_MS = 320;

async function copyEmailToClipboard() {
  if (!navigator.clipboard) {
    window.location.href = `mailto:${email}`;
    return false;
  }

  await navigator.clipboard.writeText(email);
  return true;
}

function EmailButton({ onCopied }) {
  const handleClick = async () => {
    const copied = await copyEmailToClipboard();
    if (copied) {
      onCopied?.();
    }
  };

  return (
    <button className="button button-email" type="button" onClick={handleClick}>
      <span>{email}</span>
      <span className="copy-icon" aria-hidden="true">
        <img src={copyIcon} alt="" />
      </span>
    </button>
  );
}

function CopiedToast({ open }) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      const showFrame = window.requestAnimationFrame(() => {
        setVisible(true);
      });
      return () => window.cancelAnimationFrame(showFrame);
    }

    setVisible(false);
    const hideTimer = window.setTimeout(() => setMounted(false), COPIED_ANIMATION_MS);
    return () => window.clearTimeout(hideTimer);
  }, [open]);

  if (!mounted) {
    return null;
  }

  return (
    <div className="copied-toast" aria-live="polite" aria-atomic="true">
      <div className={["copied-toast-pill", visible ? "is-visible" : ""].filter(Boolean).join(" ")}>
        <img className="copied-toast-icon" src={checkIcon} alt="" aria-hidden="true" />
        <span>Copied</span>
      </div>
    </div>
  );
}

function InfoPanel({ onCopied }) {
  return (
    <aside className="info-panel" aria-labelledby="homepage-title">
      <header className="info-header">
        <a className="logo" href="/" aria-label="DoNotPress home">
          <img src={dnpLogo} alt="DoNotPress" />
        </a>
      </header>

      <section className="intro">
        <h1 id="homepage-title">Product Design Agency</h1>
        <div className="intro-copy">
          <p>
            We design products that actually ship. Our process combines rigorous
            design systems, hypothesis validation, and hands-on development
            support to ensure everything works as intended
          </p>
          <ul className="services" aria-label="Services">
            <li>UI/UX Design</li>
            <li>Design Systems</li>
            <li>Conversion Rate Optimization</li>
            <li className="service-divider" aria-hidden="true" />
            <li>Branding</li>
            <li>Pitch Decks</li>
          </ul>
        </div>
      </section>

      <section className="cta cta-desktop" aria-label="Contact">
        <EmailButton onCopied={onCopied} />
      </section>
    </aside>
  );
}

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

function SiteFooter() {
  return (
    <footer className="site-footer">
      {/* Legal links — restore when Terms / Privacy pages are ready
      <nav aria-label="Legal links">
        <a href="/terms">Terms of Use</a>
        <a href="/privacy">Privacy Policy</a>
      </nav>
      */}
      <p>
        <span>© 2026</span>
        <span className="footer-dot" aria-hidden="true" />
        <span>DoNotPress</span>
      </p>
    </footer>
  );
}

function HomeMobileHeader({ isScrolled }) {
  return (
    <header className={["home-mobile-header", isScrolled ? "is-scrolled" : ""].filter(Boolean).join(" ")}>
      <div className="home-mobile-header-fade" aria-hidden="true" />
      <a className="logo" href="/" aria-label="DoNotPress home">
        <img src={dnpLogo} alt="DoNotPress" />
      </a>
    </header>
  );
}

function HomeMobileCta({ onCopied }) {
  return (
    <div className="home-mobile-cta">
      <EmailButton onCopied={onCopied} />
    </div>
  );
}

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
