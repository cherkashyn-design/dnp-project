import { useEffect, useLayoutEffect, useRef, useState } from "react";
import logo from "../assets/brand/logo.png";
import menuClose from "../assets/icons/menu-close.svg";
import { appHref } from "../base.js";

const COLUMN_GAP = 64;
const HEADER_PAD = 32;

export function SiteHeader({ path, onNavigate }) {
  const headerRef = useRef(null);
  const navRef = useRef(null);
  const contactRef = useRef(null);
  const logoRef = useRef(null);
  const widths = useRef({ nav: 0, contact: 0, logo: 106 });
  const menuBusy = useRef(false);
  const [compact, setCompact] = useState(false);
  const [open, setOpen] = useState(false);
  const [present, setPresent] = useState(false);
  const [settled, setSettled] = useState(false);
  const onCase = path.startsWith("/cases");
  const onBlog = path.startsWith("/blog");
  const onBlogListing = path === "/blog";
  menuBusy.current = open || present;

  const go = (event, href) => {
    event.preventDefault();
    setOpen(false);
    onNavigate(href);
  };

  useLayoutEffect(() => {
    const header = headerRef.current;

    const measure = () => {
      const nav = navRef.current;
      const contact = contactRef.current;
      const mark = logoRef.current;
      if (!header || !nav || !mark) return;

      const navHidden = getComputedStyle(nav).display === "none";
      const navPrevious = {
        display: nav.style.display,
        flexWrap: nav.style.flexWrap,
        position: nav.style.position,
        visibility: nav.style.visibility,
      };
      if (navHidden) {
        nav.style.display = "flex";
        nav.style.position = "absolute";
        nav.style.visibility = "hidden";
      }
      nav.style.flexWrap = "nowrap";

      widths.current.nav = nav.scrollWidth;
      widths.current.logo = mark.offsetWidth;

      // Menu-open CSS collapses Contact Us — sample natural width off-layout
      // without writing opacity/padding that can flash through computed styles.
      if (!contact) {
        widths.current.contact = 0;
      } else if (!menuBusy.current || widths.current.contact < 1) {
        const contactPrevious = {
          maxWidth: contact.style.maxWidth,
          position: contact.style.position,
          visibility: contact.style.visibility,
        };
        contact.style.maxWidth = "none";
        contact.style.position = "absolute";
        contact.style.visibility = "hidden";
        widths.current.contact = contact.offsetWidth;
        contact.style.maxWidth = contactPrevious.maxWidth;
        contact.style.position = contactPrevious.position;
        contact.style.visibility = contactPrevious.visibility;
      }

      nav.style.flexWrap = navPrevious.flexWrap;
      if (navHidden) {
        nav.style.display = navPrevious.display;
        nav.style.position = navPrevious.position;
        nav.style.visibility = navPrevious.visibility;
      }

      const side = Math.max(widths.current.nav, widths.current.contact);
      const needed = side * 2 + widths.current.logo + COLUMN_GAP * 2 + HEADER_PAD;
      const next = header.clientWidth < needed - 0.5;
      // Lock compact while the menu is open/closing so ResizeObserver cannot
      // collapse chrome or abort the close animation mid-flight.
      if (menuBusy.current) {
        setCompact(true);
        return;
      }
      setCompact(next);
      if (!next) setOpen(false);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(header);
    document.fonts?.ready.then(measure);
    return () => observer.disconnect();
  }, [onBlogListing]);

  useEffect(() => {
    if (!compact) {
      setSettled(false);
      setPresent(false);
      return undefined;
    }
    if (open) {
      setPresent(true);
      const timer = window.setTimeout(() => setSettled(true), 20);
      return () => window.clearTimeout(timer);
    }
    setSettled(false);
    const timer = window.setTimeout(() => setPresent(false), 220);
    return () => window.clearTimeout(timer);
  }, [open, compact]);

  useEffect(() => {
    if (!present) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    const scrollY = window.scrollY;
    const { body, documentElement } = document;
    const previous = {
      overflow: body.style.overflow,
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
      paddingRight: body.style.paddingRight,
    };
    const scrollbar = window.innerWidth - documentElement.clientWidth;

    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;

    document.addEventListener("keydown", onKey);
    return () => {
      body.style.overflow = previous.overflow;
      body.style.position = previous.position;
      body.style.top = previous.top;
      body.style.width = previous.width;
      body.style.paddingRight = previous.paddingRight;
      document.removeEventListener("keydown", onKey);
      window.scrollTo(0, scrollY);
    };
  }, [present]);

  const links = [
    { href: "/", label: "Home", selected: path === "/" },
    { href: "/cases", label: "Cases", selected: onCase },
    { href: "/blog", label: "Blog", selected: onBlog },
  ];

  return (
    <header
      className={compact ? `site-header is-compact${open ? " is-open" : ""}` : "site-header"}
      ref={headerRef}
    >
      <nav className="nav-pills" aria-label="Primary" ref={navRef}>
        {links.map((link) => (
          <a
            key={link.href}
            className={link.selected ? "pill is-selected" : link.href === "/" ? "pill" : "pill is-blur"}
            href={appHref(link.href)}
            onClick={(event) => go(event, link.href)}
          >
            {link.label}
          </a>
        ))}
      </nav>
      <a
        className="logo"
        href={appHref("/")}
        aria-label="Do Not Press home"
        onClick={(event) => go(event, "/")}
        ref={logoRef}
      >
        <img src={logo} alt="Do Not Press" />
      </a>
      <div className="header-actions">
        {onBlogListing ? null : (
          <a
            className="pill is-dark"
            href={appHref("/contact")}
            onClick={(event) => go(event, "/contact")}
            ref={contactRef}
          >
            Contact Us
          </a>
        )}
        <button
          className="menu-toggle"
          type="button"
          aria-expanded={open}
          aria-controls="site-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? (
            <img className="menu-close" src={menuClose} alt="" width="20" height="20" />
          ) : (
            <span className="menu-mark" aria-hidden="true">
              <span />
              <span />
            </span>
          )}
        </button>
      </div>
      {compact && present ? (
        <nav className={open && settled ? "menu-panel is-in" : "menu-panel"} id="site-menu" aria-label="Primary">
          <div className="menu-list">
            <p className="menu-kicker">
              <span className="menu-index" aria-hidden="true">
                01
              </span>
              Menu
            </p>
            {links.map((link, index) => (
              <a
                key={link.href}
                className="menu-row"
                href={appHref(link.href)}
                aria-current={link.selected ? "page" : undefined}
                onClick={(event) => go(event, link.href)}
              >
                <span className="menu-index">{String(index + 1).padStart(2, "0")}</span>
                <span className="menu-name">{link.label}</span>
              </a>
            ))}
          </div>
          {onBlogListing ? null : (
            <a className="button-l menu-talk" href={appHref("/contact")} onClick={(event) => go(event, "/contact")}>
              Let’s talk
            </a>
          )}
        </nav>
      ) : null}
    </header>
  );
}
