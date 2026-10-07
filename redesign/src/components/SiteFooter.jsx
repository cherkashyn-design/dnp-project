import { useEffect, useLayoutEffect, useRef, useState } from "react";

import dot from "../assets/icons/dot.svg";
import { appHref } from "../base.js";

function tbilisiTime(date) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Asia/Tbilisi",
  }).format(date);
}

const ROW_GAP = 64;
const FOOTER_PAD = 32;

function rowWidth(element) {
  const children = [...element.children];
  const gap = Number.parseFloat(getComputedStyle(element).columnGap) || 0;
  return children.reduce((sum, child) => sum + child.offsetWidth, 0) + gap * Math.max(0, children.length - 1);
}

export function SiteFooter({ onNavigate }) {
  const footerRef = useRef(null);
  const localeRef = useRef(null);
  const linksRef = useRef(null);
  const [compact, setCompact] = useState(false);
  const [time, setTime] = useState(() => tbilisiTime(new Date()));

  useEffect(() => {
    const id = window.setInterval(() => setTime(tbilisiTime(new Date())), 30000);
    return () => window.clearInterval(id);
  }, []);

  useLayoutEffect(() => {
    const footer = footerRef.current;
    const measure = () => {
      const locale = localeRef.current;
      const links = linksRef.current;
      if (!footer || !locale || !links) return;
      const needed = locale.offsetWidth + rowWidth(links) + ROW_GAP + FOOTER_PAD;
      setCompact(footer.clientWidth < needed - 0.5);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(footer);
    document.fonts?.ready.then(measure);
    return () => observer.disconnect();
  }, [time]);

  const go = (event, href) => {
    event.preventDefault();
    onNavigate(href);
  };

  return (
    <footer className={compact ? "site-footer is-compact" : "site-footer"} ref={footerRef}>
      <p className="locale" ref={localeRef}>
        <span className="locale-time">{time}</span>
        <img src={dot} alt="" />
        Tbilisi, Georgia
      </p>
      <div className="footer-links" ref={linksRef}>
        <span className="pill is-outline">© 2026 · Do Not Press Studio</span>
        <a className="pill" href={appHref("/terms")} onClick={(event) => go(event, "/terms")}>
          Terms
        </a>
        <a className="pill" href={appHref("/privacy")} onClick={(event) => go(event, "/privacy")}>
          Privacy
        </a>
      </div>
    </footer>
  );
}
