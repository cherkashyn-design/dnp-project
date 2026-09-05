import { forwardRef, useEffect, useRef, useState } from "react";

import copyIcon from "./assets/Icons/copy-icon.svg";
import dnpLogo from "./assets/Global/dnp-logo.png";
import { ProjectCard, cases, email, useRevealAnimations } from "./shared.jsx";

async function copyEmail() {
  if (!navigator.clipboard) {
    window.location.href = `mailto:${email}`;
    return;
  }

  await navigator.clipboard.writeText(email);
}

function InfoPanel() {
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

      <section className="cta" aria-label="Contact">
        <button className="button button-email" type="button" onClick={copyEmail}>
          <span>{email}</span>
          <span className="copy-icon" aria-hidden="true">
            <img src={copyIcon} alt="" />
          </span>
        </button>
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

export default function HomePage() {
  const casesRef = useRef(null);
  const [scrollState, setScrollState] = useState({
    hasScrolledCases: false,
    isAtEnd: false,
    isCasesActive: false,
  });

  useRevealAnimations();

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
      <CaseList ref={casesRef} />
      <InfoPanel />
      <div className="cases-fade cases-fade-top" aria-hidden="true" />
      <div className="cases-fade cases-fade-bottom" aria-hidden="true" />
    </main>
  );
}
