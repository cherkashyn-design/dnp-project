import { useEffect, useState } from "react";
import backIcon from "../../assets/icons/back-icon.svg";
import dnpLogo from "../../assets/brand/dnp-logo.png";
import { email } from "../../data/site.js";
import { CaseNavigationSlider } from "./CaseNavigation.jsx";

export function CaseHeader({ navigationItems }) {
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const updateScrollState = () => {
      setHasScrolled((window.scrollY || document.documentElement.scrollTop) > 2);
    };

    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    return () => {
      window.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, []);

  return (
    <>
      <header className={["case-header", hasScrolled ? "is-scrolled" : ""].filter(Boolean).join(" ")}>
        <div className="case-header-fade" aria-hidden="true" />
        <div className="case-header-left">
          <a className="back-link" href="/">
            <img className="back-icon" src={backIcon} alt="" aria-hidden="true" />
            <span className="back-link-label">Back</span>
          </a>
          <div className="case-nav-desktop">
            <CaseNavigationSlider navigationItems={navigationItems} />
          </div>
        </div>
        <div className="case-header-right">
          <a className="logo" href="/" aria-label="DoNotPress home">
            <img src={dnpLogo} alt="DoNotPress" />
          </a>
          <a className="start-project-pill" href={`mailto:${email}?subject=Start%20a%20Project`}>
            Start a Project
          </a>
        </div>
      </header>
      <div className="case-nav-mobile-footer">
        <CaseNavigationSlider navigationItems={navigationItems} />
      </div>
    </>
  );
}
