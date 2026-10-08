import { useEffect, useRef, useState } from "react";

import yc from "../assets/brand/yc.svg";
import plus from "../assets/icons/plus.svg";
import minus from "../assets/icons/minus.svg";
import arrowLight from "../assets/icons/arrow-light.svg";
import keepBuilding from "../assets/features/keep-building.svg";
import designTeam from "../assets/features/design-team.svg";
import showreelDesktop from "../assets/showreel/showreel-desktop.webm";
import showreelDesktopPoster from "../assets/showreel/showreel-desktop-poster.webp";
import soc2 from "../assets/standards/soc2.svg";
import iso from "../assets/standards/iso.svg";
import gdpr from "../assets/standards/gdpr.svg";
import ycBadge from "../assets/standards/yc.svg";
import maksym from "../assets/people/maksym.webp";
import { appHref } from "../base.js";
import { ContactSection } from "../components/ContactSection.jsx";
import { SoftImage, SoftVideo } from "../components/SoftMedia.jsx";
import { cases } from "../data/cases.js";
import { faqs, services, testimonials } from "../data/content.js";
import { spawnPressRipple } from "../pressRipple.js";

const MOBILE_HERO = "(max-width: 720px)";

function isMobileHero() {
  return typeof window !== "undefined" && window.matchMedia(MOBILE_HERO).matches;
}

function Showreel({ className }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const start = () => {
      video.play().catch(() => {});
    };
    start();
    video.addEventListener("loadeddata", start);
    video.addEventListener("canplay", start);
    return () => {
      video.removeEventListener("loadeddata", start);
      video.removeEventListener("canplay", start);
    };
  }, []);

  return (
    <SoftVideo
      ref={videoRef}
      className={className}
      src={showreelDesktop}
      poster={showreelDesktopPoster}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
    />
  );
}

export function HomePage({ onNavigate }) {
  const heroRef = useRef(null);
  const dragRef = useRef(null);
  const founderRef = useRef(null);
  const portraitRef = useRef(null);
  const [openService, setOpenService] = useState(0);
  const [openFaq, setOpenFaq] = useState(0);
  const [mobileHero, setMobileHero] = useState(() => isMobileHero());

  useEffect(() => {
    const media = window.matchMedia(MOBILE_HERO);
    const onChange = () => setMobileHero(media.matches);
    onChange();
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const onShowreelPointerDown = (event) => {
    if (event.button !== 0 || isMobileHero()) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    document.documentElement.style.scrollBehavior = "auto";
    dragRef.current = { y: event.clientY, scroll: window.scrollY };
  };

  useEffect(() => {
    const move = (event) => {
      const drag = dragRef.current;
      const node = heroRef.current;
      if (!drag || !node) return;
      const range = Math.max(node.offsetHeight - window.innerHeight, 0);
      const next = Math.min(Math.max(drag.scroll + drag.y - event.clientY, 0), range);
      const progress = range > 0 ? next / range : 0;
      node.style.setProperty("--showreel", String(progress));
      node.classList.toggle("is-resting", progress < 0.02);
      window.scrollTo(0, next);
    };
    const end = () => {
      if (!dragRef.current) return;
      dragRef.current = null;
      document.documentElement.style.scrollBehavior = "";
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", end);
    window.addEventListener("pointercancel", end);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", end);
      window.removeEventListener("pointercancel", end);
    };
  }, []);

  const openCase = (event, slug) => {
    event.preventDefault();
    onNavigate(`/cases/${slug}`);
  };

  useEffect(() => {
    const node = heroRef.current;
    if (!node) return;

    let frame = 0;
    const update = () => {
      if (dragRef.current) return;
      if (isMobileHero()) {
        node.style.marginTop = "";
        node.style.setProperty("--showreel", "0");
        node.classList.add("is-resting");
        node.classList.add("is-mobile-static");
        return;
      }
      node.classList.remove("is-mobile-static");
      const header = document.querySelector(".site-header");
      node.style.marginTop = `-${header?.offsetHeight ?? 0}px`;
      const range = node.offsetHeight - window.innerHeight;
      const scrolled = Math.min(Math.max(-node.getBoundingClientRect().top, 0), Math.max(range, 0));
      const progress = range > 0 ? scrolled / range : 0;
      node.style.setProperty("--showreel", String(progress));
      node.classList.toggle("is-resting", progress < 0.02);
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    const nodes = document.querySelectorAll("[data-reveal]");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      nodes.forEach((node) => node.classList.add("is-in"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px", threshold: 0 },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const section = founderRef.current;
    const portrait = portraitRef.current;
    if (!section || !portrait) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const update = () => {
      const rect = section.getBoundingClientRect();
      const progress = (window.innerHeight / 2 - (rect.top + rect.height / 2)) / window.innerHeight;
      const maxShift = parseFloat(getComputedStyle(section).getPropertyValue("--founder-shift")) || 120;
      const shift = Math.max(-maxShift, Math.min(maxShift, progress * 280));
      portrait.style.transform = `translate3d(0, ${shift}px, 0)`;
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <>
      <div className="hero-scroll is-resting" ref={heroRef}>
        <section className="hero">
          <div className="hero-copy">
            <div>
              <h1>
                Pull prototype into
                <br />
                shippable product design
              </h1>
              <p className="hero-subtitle">
                <span className="hero-subtitle-line">Product design studio &amp; agency</span>
                <span className="hero-subtitle-line">
                  experienced with{" "}
                  <span className="yc-badge">
                    <img src={yc} alt="" />
                    Backed
                  </span>{" "}
                  startups
                </span>
              </p>
            </div>
            <a className="button-l" href="#contact">
              <span>Let’s talk</span>
              <img className="button-arrow" src={arrowLight} alt="" />
            </a>
          </div>
          <div className="showreel" data-ink onPointerDown={onShowreelPointerDown}>
            {!mobileHero ? (
              <button className="showreel-handle" type="button" aria-label="Drag to expand showreel" tabIndex={-1}>
                <span className="showreel-mark" />
              </button>
            ) : null}
            <Showreel />
          </div>
        </section>
      </div>

      <section className="standards">
        <h2 data-reveal>Our clients meet the highest standards in the industry</h2>
        <div className="standards-row">
          <div className="standards-item">
            <div className="standards-mark">
              <img className="is-soc2" src={soc2} alt="" width="88" height="81" />
            </div>
            <span>SOC2</span>
          </div>
          <div className="standards-item">
            <div className="standards-mark">
              <img className="is-iso" src={iso} alt="" width="91" height="77" />
            </div>
            <span>ISO 27001</span>
          </div>
          <div className="standards-item">
            <div className="standards-mark">
              <img className="is-gdpr" src={gdpr} alt="" width="124" height="124" />
            </div>
            <span>GDPR</span>
          </div>
          <div className="standards-item">
            <div className="standards-mark">
              <img className="is-yc" src={ycBadge} alt="" width="86.3349" height="87.1701" />
            </div>
            <span>Backed by Y Combinator</span>
          </div>
        </div>
      </section>

      <section className="section" id="projects">
        <h2 className="section-title" data-reveal>
          Projects<sup>({cases.length})</sup>
        </h2>
        <div className="project-grid">
          {cases.map((project, index) => (
            <a
              key={project.slug}
              className="project-card"
              data-reveal
              href={appHref(`/cases/${project.slug}`)}
              style={{ "--reveal": `${index * 80}ms` }}
              onClick={(event) => openCase(event, project.slug)}
            >
              <SoftImage src={project.image} alt="" />
              <span className="project-hover">
                <span className="project-title">{project.title}</span>
                <span className="project-tags">
                  {project.tags.map((tag) => (
                    <span className="tag" key={tag}>
                      {tag}
                    </span>
                  ))}
                </span>
              </span>
            </a>
          ))}
        </div>
      </section>

      <section className="section proof" id="proof">
        <div className="proof-panel">
        <h2 className="section-title" data-reveal>
          Proof, from founders we’ve shipped with
        </h2>
        <div className="proof-grid">
          {testimonials.map((item, index) => (
            <article
              key={item.name}
              className="proof-card"
              data-reveal
              style={{ "--reveal": `${120 + index * 90}ms` }}
            >
              <div className="proof-copy">
                <div className="proof-author">
                  <SoftImage src={item.avatar} alt="" />
                  <div>
                    <span className="proof-name">{item.name}</span>
                    <span className="proof-role">{item.role}</span>
                  </div>
                </div>
                <p className="proof-quote">{item.quote}</p>
              </div>
              {item.logo ? (
                <>
                  <hr />
                  <img className="proof-logo" src={item.logo} alt={item.logoAlt} />
                </>
              ) : null}
            </article>
          ))}
        </div>
        </div>
      </section>

      <section className="section" id="services">
        <h2 className="section-title" data-reveal>
          Services
        </h2>
        <div className="accordion" data-reveal style={{ "--reveal": "80ms" }}>
          {services.map((service, index) => {
            const open = openService === index;
            return (
              <button
                key={service.number}
                className="accordion-item"
                type="button"
                aria-expanded={open}
                onPointerDown={spawnPressRipple}
                onClick={() => setOpenService(open ? -1 : index)}
              >
                <p className="accordion-number">{service.number}</p>
                <div className="accordion-body">
                  <div className={open ? "fold is-open" : "fold"} aria-hidden={!open}>
                    <div>
                      <p className="accordion-copy">{service.description}</p>
                    </div>
                  </div>
                </div>
                <div className="accordion-head">
                  <div className="accordion-title-row">
                    <h3 className="accordion-title">{service.title}</h3>
                    <img className="accordion-icon" src={open ? minus : plus} alt="" />
                  </div>
                  {service.shot ? (
                    <div className={open ? "fold is-open" : "fold"} aria-hidden={!open}>
                      <div>
                        <SoftImage className="accordion-shot" src={service.shot.image} alt={service.shot.name} />
                      </div>
                    </div>
                  ) : null}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="section">
        <div className="feature-band">
          <article className="feature-card" data-reveal>
            <img src={keepBuilding} alt="" />
            <div className="feature-copy">
              <h3>Keep building with AI</h3>
              <p>
                Reusable components, guidelines, and prompts so your team and AI tools stay
                consistent after we leave
              </p>
            </div>
          </article>
          <article className="feature-card" data-reveal style={{ "--reveal": "100ms" }}>
            <img src={designTeam} alt="" />
            <div className="feature-copy">
              <h3>Your design team in Slack</h3>
              <p>
                Share ideas, review progress, and give feedback directly, without waiting on a
                weekly status deck
              </p>
            </div>
          </article>
        </div>
      </section>

      <section className="section founder" ref={founderRef}>
        <p className="founder-meta" data-reveal>
          <span className="founder-name">Maksym C.</span>
          <span className="founder-role">Founder & lead designer</span>
        </p>
        <div className="founder-stage">
          <p className="founder-quote" data-reveal style={{ "--reveal": "80ms" }}>
            Every “press”, engineered to feel right. We partner with startups to build the exact
            workflow they need to stop guessing and start scaling
          </p>
          <div className="founder-portrait" ref={portraitRef}>
          <SoftImage src={maksym} alt="Maksym C." />
          <p className="founder-bio">
            Product designer for 20+ YC-backed startups.
            <br />
            Design systems, conversion, and complex professional UI, from Figma to ship
          </p>
          </div>
        </div>
      </section>

      <section className="section faq" id="faq">
        <h2 className="section-title" data-reveal>
          Common questions
        </h2>
        <div>
          {faqs.map((item, index) => {
            const open = openFaq === index;
            return (
              <button
                key={item.question}
                className="faq-item"
                type="button"
                aria-expanded={open}
                onPointerDown={spawnPressRipple}
                onClick={() => setOpenFaq(open ? -1 : index)}
              >
                <div>
                  <h3>{item.question}</h3>
                  <div className={open ? "fold is-open" : "fold"} aria-hidden={!open}>
                    <div>
                      <p>{item.answer}</p>
                    </div>
                  </div>
                </div>
                <img src={open ? minus : plus} alt="" />
              </button>
            );
          })}
        </div>
      </section>

      <ContactSection />
    </>
  );
}
