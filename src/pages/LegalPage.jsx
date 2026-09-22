import backIcon from "../assets/icons/back-icon.svg";
import dnpLogo from "../assets/brand/dnp-logo.png";
import { SiteFooter } from "../components/home/HomeChrome.jsx";
import { useHeaderScrolled } from "../hooks/useHeaderScrolled.js";

function handleBack() {
  if (window.history.length > 1) {
    window.history.back();
    return;
  }
  window.location.assign("/");
}

export function LegalPage({ title, updated, children }) {
  const hasScrolled = useHeaderScrolled();

  return (
    <main className="legal-page">
      <div className="legal-shell">
        <header className={["legal-header", hasScrolled ? "is-scrolled" : ""].filter(Boolean).join(" ")}>
          <div className="legal-header-fade" aria-hidden="true" />
          <button type="button" className="contact-back vt-back" aria-label="Go back" onClick={handleBack}>
            <img src={backIcon} alt="" aria-hidden="true" />
          </button>
          <a className="logo vt-logo" href="/" aria-label="DoNotPress home">
            <img src={dnpLogo} alt="DoNotPress" />
          </a>
          <a className="start-project-pill vt-contact" href="/contact">
            Contact Us
          </a>
        </header>

        <article className="legal-content">
          <header className="legal-heading">
            <h1>{title}</h1>
            {updated ? <p className="legal-updated">Last updated: {updated}</p> : null}
          </header>
          <div className="legal-body">{children}</div>
        </article>
      </div>

      <SiteFooter />
    </main>
  );
}
