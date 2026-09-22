import { useEffect, useState } from "react";

import checkIcon from "../../assets/icons/check-icon.svg";
import copyIcon from "../../assets/icons/copy-icon-dark.svg";
import dnpLogo from "../../assets/brand/dnp-logo.png";
import { email } from "../../data/site.js";

const COPIED_ANIMATION_MS = 320;

export async function copyEmailToClipboard() {
  if (!navigator.clipboard) {
    window.location.href = `mailto:${email}`;
    return false;
  }

  await navigator.clipboard.writeText(email);
  return true;
}

export function EmailButton({ onCopied }) {
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

export function CopiedToast({ open }) {
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

export function InfoPanel({ onCopied }) {
  return (
    <aside className="info-panel" aria-labelledby="homepage-title">
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
      </div>

      <section className="cta cta-desktop vt-chrome-footer" aria-label="Contact">
        <EmailButton onCopied={onCopied} />
      </section>
    </aside>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <nav aria-label="Legal links">
        <a href="/terms">Terms of Use</a>
        <a href="/privacy">Privacy Policy</a>
      </nav>
      <p>
        <span>© 2026</span>
        <span className="footer-dot" aria-hidden="true" />
        <span>DoNotPress</span>
      </p>
    </footer>
  );
}

export function HomeMobileHeader({ isScrolled }) {
  return (
    <header className={["home-mobile-header", "vt-chrome-header", isScrolled ? "is-scrolled" : ""].filter(Boolean).join(" ")}>
      <div className="home-mobile-header-fade" aria-hidden="true" />
      <a className="logo vt-logo" href="/" aria-label="DoNotPress home">
        <img src={dnpLogo} alt="DoNotPress" />
      </a>
      <a className="start-project-pill vt-contact" href="/contact">
        Contact Us
      </a>
    </header>
  );
}

export function HomeMobileCta({ onCopied }) {
  return (
    <div className="home-mobile-cta vt-chrome-footer">
      <EmailButton onCopied={onCopied} />
    </div>
  );
}
