import { useEffect, useRef, useState } from "react";

import dhruv from "../assets/people/dhruv.png";
import plus from "../assets/icons/plus.svg";
import minus from "../assets/icons/minus.svg";
import { appHref } from "../base.js";
import { ContactSection } from "../components/ContactSection.jsx";
import { LottieFrame } from "../components/LottieFrame.jsx";
import { LottieStrip } from "../components/LottieStrip.jsx";
import { SoftImage, SoftVideo } from "../components/SoftMedia.jsx";
import { SidebarReel } from "../components/SidebarReel.jsx";
import { cases } from "../data/cases.js";
import { genieCase } from "../../../src/data/genie.js";
import { salesDriverCase } from "../../../src/data/salesDriver.js";
import { yummoCase } from "../../../src/data/yummo.js";
import {
  drumkitPreview,
  drumkitSlide2,
  drumkitSlide3P1,
  drumkitSlide3P2,
  drumkitSlide4Animations,
  drumkitSlide5Background,
  drumkitSlide5Cards,
  drumkitSlide9Animations,
  drumkitSummaryVideo,
  drumkitSummaryVideoMobile,
  loadDrumkitSlide6,
  loadDrumkitSlide7,
  loadDrumkitSlide8,
} from "../../../src/data/drumkit.js";

const legacyCases = {
  "yummo-food-guide-for-moms": yummoCase,
  nodify: genieCase,
  "sales-driver-ads-tool": salesDriverCase,
};

const drumkitStories = [
  {
    title: "Load and mail integration",
    load: loadDrumkitSlide6,
    items: [
      ["Problem", "All departments and clients has their own solutions to track loads. That’s creating mistakes and misunderstandings."],
      ["Solution", "Automatically tracks all your services (Aljex, Tai, AscendTMS and other). Collecting data and update it in sidebar."],
      [
        "Case of use",
        "1. Collect load update from Aljex\n2. Send update to the client with Outlook\n3. Automatically refresh status based on client feedback.",
      ],
      ["Result", "That makes whole the flow more consistent, departments synced and time spent on load management 61% less."],
    ],
  },
  {
    title: "Simplify SOPs",
    load: loadDrumkitSlide7,
    items: [
      ["Problem", "Logistic companies has a lot of clients and drivers and spent a lot of time to manage their process and slots."],
      ["Solution", "Automatically send updates and slot options to the clients during the process instead of manual work."],
      [
        "Case of use",
        "1. Client select pickup timeslot\n2. Auto match with the truck\n3. Driver confirm loaded\n4. Client may track transit\n5. Client select dropoff timeslot\n6. Driver mark completed.",
      ],
      ["Result", "Only corner cases requires management attention, that made time spent 94% less."],
    ],
  },
  {
    title: "Management dashboard",
    load: loadDrumkitSlide8,
    items: [
      ["Problem", "Due to a lot of product there no way to track managers effectivency"],
      ["Solution", "Merge all the data in one place. Show it as dashboard"],
      [
        "Case of use",
        "1. Managers lead go to dashboard\n2. Review each manager stats and clients communication history\n3. Based on it can manage compensation policy",
      ],
      ["Result", "More effective management department"],
    ],
  },
];

function CaseVideo({ src, srcMobile, poster }) {
  const videoRef = useRef(null);
  const [source, setSource] = useState(src);

  useEffect(() => {
    if (!srcMobile) return undefined;
    const query = window.matchMedia("(max-width: 720px)");
    const update = () => setSource(query.matches ? srcMobile : src);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, [src, srcMobile]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;
    video.muted = true;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const start = () => video.play().catch(() => {});
    start();
    video.addEventListener("canplay", start);
    return () => video.removeEventListener("canplay", start);
  }, [source]);

  return (
    <SoftVideo ref={videoRef} src={source} poster={poster} muted loop playsInline autoPlay />
  );
}

function Shot({ media }) {
  return (
    <figure className="case-shot">
      {media.type === "video" ? (
        <CaseVideo src={media.src} srcMobile={media.srcMobile} poster={media.poster} />
      ) : (
        <SoftImage src={media.src} alt="" />
      )}
      {media.caption ? <figcaption className="tag">{media.caption}</figcaption> : null}
    </figure>
  );
}

function ShotRow({ row }) {
  if (row.length === 1) return <Shot media={row[0]} />;
  return (
    <div className="case-shot-row">
      {row.map((media) => (
        <Shot key={media.id || media.src} media={media} />
      ))}
    </div>
  );
}

function CaseHeading({ title, text }) {
  return (
    <header className="case-heading">
      <hr />
      <div>
        <h2 data-reveal>{title}</h2>
        {text ? <p>{text}</p> : null}
      </div>
    </header>
  );
}

function Story({ story }) {
  const [open, setOpen] = useState(0);

  return (
    <article className="case-story">
      <h3 data-reveal>{story.title}</h3>
      <div className="case-story-row">
        <LottieFrame className="case-lottie is-wide" load={story.load} label={story.title} />
        <div>
          {story.items.map(([question, answer], index) => {
            const isOpen = open === index;
            return (
              <button
                key={question}
                className="faq-item story-item"
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? -1 : index)}
              >
                <div>
                  <h3>{question}</h3>
                  <div className={isOpen ? "fold is-open" : "fold"} aria-hidden={!isOpen}>
                    <div>
                      <p>{answer}</p>
                    </div>
                  </div>
                </div>
                <img src={isOpen ? minus : plus} alt="" />
              </button>
            );
          })}
        </div>
      </div>
    </article>
  );
}

function Stats({ items }) {
  return (
    <div className="case-stats">
      {items.map(([value, label]) => (
        <div className="case-stat" key={label}>
          <strong>{value}</strong>
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}

function MotionBand({ text, animations }) {
  return (
    <section className="case-motion">
      <h2>{text}</h2>
      <LottieStrip animations={animations} />
    </section>
  );
}

function OtherProjects({ slug, onNavigate }) {
  const others = cases.filter((item) => item.slug !== slug).slice(0, 2);

  return (
    <section className="case-block">
      <div className="case-more-head">
        <h2 data-reveal>Other Projects</h2>
        <a
          className="pill is-dark"
          href={appHref("/cases")}
          onClick={(event) => {
            event.preventDefault();
            onNavigate("/cases");
          }}
        >
          View All
        </a>
      </div>
      <div className="project-grid">
        {others.map((item) => (
          <a
            className="project-card"
            key={item.slug}
            href={appHref(`/cases/${item.slug}`)}
            onClick={(event) => {
              event.preventDefault();
              onNavigate(`/cases/${item.slug}`);
            }}
          >
            <SoftImage src={item.image} alt="" />
            <span className="project-hover">
              <span className="project-title">{item.title}</span>
              <span className="project-tags">
                {item.tags.map((tag) => (
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
  );
}

export { ContactSection as CaseContact } from "../components/ContactSection.jsx";

function sectionRows(section) {
  if (section.mediaRows) return section.mediaRows;
  if (section.tabs) return section.tabs.map((tab) => [tab]);
  return [];
}

function labelText(label) {
  const word = label.replace(/[\[\]]/g, "").trim().toLowerCase();
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function DrumkitCase({ onNavigate }) {
  const quoteRef = useRef(null);
  const portraitRef = useRef(null);

  useEffect(() => {
    const section = quoteRef.current;
    const portrait = portraitRef.current;
    if (!section || !portrait) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    let frame = 0;
    const update = () => {
      const rect = section.getBoundingClientRect();
      const progress = (window.innerHeight / 2 - (rect.top + rect.height / 2)) / window.innerHeight;
      const maxShift = parseFloat(getComputedStyle(section).getPropertyValue("--quote-shift")) || 120;
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
    <article className="case-page">
      <section className="case-hero">
        <div className="case-hero-copy">
          <h1>Drumkit - Logistic SaaS</h1>
          <p>AI B2B tool to optimize logistic expenses and time spent</p>
        </div>
        <figure className="case-shot">
          <SoftImage src={drumkitPreview} alt="Drumkit landing page on a laptop" />
        </figure>
      </section>

      <section className="case-quote" ref={quoteRef}>
        <div className="case-quote-person">
          <p>Dhruv G.</p>
          <span>Founder, Drumkit & Axle Technologies</span>
        </div>
        <div className="case-quote-body">
          <blockquote>
            DNP is excellent and incredibly talented. They are rapid and pretty detail-oriented. They
            also got a very positive attitude, is persistent through design changes/requests, and
            thoughtful throughout. They a pleasure to work with and I would gladly work with they again.
          </blockquote>
          <SoftImage ref={portraitRef} src={dhruv} alt="Dhruv G." />
        </div>
      </section>

      <section className="case-info">
        <div className="case-info-copy">
          <div>
            <h2>Goal</h2>
            <p>
              To redesign the existent product, from MVP to YC level startup. It existed as an MVP
              developed by one person, but there was no branding and no UX best practices. We needed to
              improve UX to get more conversion and retention.
            </p>
          </div>
          <div>
            <h2>Idea</h2>
            <p>
              To build SaaS product to help logistic companies deliver. It has a sidebar with integrated
              emails and messengers. You have a dashboard with all the data about your company and
              managers performance. All these functionalities are united in one place but integrated into
              current user workflow.
            </p>
          </div>
        </div>
        <dl>
          <div>
            <dt>Year</dt>
            <dd>2026</dd>
          </div>
          <div>
            <dt>Industry</dt>
            <dd>Transportation & Logistics</dd>
          </div>
          <div>
            <dt>Services</dt>
            <dd>
              <span className="case-chip">SaaS</span>
              <span className="case-chip">Landing</span>
            </dd>
          </div>
        </dl>
      </section>

      <section className="case-block">
        <CaseHeading title="Website" />
        <div className="case-shots">
          <Shot
            media={{
              type: "video",
              src: drumkitSummaryVideo,
              srcMobile: drumkitSummaryVideoMobile,
              poster: drumkitPreview,
              caption: "Animated first sections to show product in action",
            }}
          />
          <Shot
            media={{
              src: drumkitSlide2,
              caption: "Step by step reviewing the process, to understand how it works for you",
            }}
          />
          <ShotRow
            row={[
              { id: "features", src: drumkitSlide3P1, caption: "Main features review to meet with the product" },
              {
                id: "integrations",
                src: drumkitSlide3P2,
                caption:
                  "Integrations preview. Some users seeking for the product who integrated into their existent system, we should to emphasise them",
              },
            ]}
          />
        </div>
      </section>

      <MotionBand
        text="Motion animation to show the main features. It’s essential for B2B product, user can’t just register to try the product. It requires to go through the demo and connect user CRM’s and other backend to our platform."
        animations={drumkitSlide4Animations}
      />

      <Stats
        items={[
          ["+56%", "Conversion rate"],
          ["+451%", "Time spent"],
          ["11", "Lottie animations"],
        ]}
      />

      <section className="case-block">
        <CaseHeading
          title="Sidebar"
          text="It’s a Chrome extension. It integrates into whole logistic process so has a lot of states. I’ll highlight you the most important"
        />
        <figure className="case-shot is-reel">
          <SidebarReel background={drumkitSlide5Background} cards={drumkitSlide5Cards} />
          <figcaption className="tag">
            Sidebar is a key functional and has a lot of states. We reworked the sidebar with a lot of
            users tests and keeping in mind the previous solution.
          </figcaption>
        </figure>
        {drumkitStories.map((story) => (
          <Story key={story.title} story={story} />
        ))}
      </section>

      <section className="case-block">
        <CaseHeading
          title="Summary"
          text="We have website, dashboard and side panel which is made the whole process much more effective"
        />
        <Stats
          items={[
            ["+56%", "Website conversion rate"],
            ["-61%", "Load management time spent"],
            ["-94%", "SOP management time spent"],
          ]}
        />
        <LottieStrip animations={drumkitSlide9Animations} />
        <p className="case-note">
          Autofilling, appointment, slots matching and carrier functionality animations to show the product
        </p>
      </section>

      <OtherProjects slug="drumkit-logistic-saas" onNavigate={onNavigate} />
      <CaseContact />
    </article>
  );
}

function LegacyCase({ project, data, onNavigate }) {
  return (
    <article className="case-page">
      <section className="case-hero">
        <div className="case-hero-copy">
          <h1>{data.title}</h1>
          {data.subtitle ? <p>{data.subtitle}</p> : null}
        </div>
        <figure className="case-shot">
          <SoftImage src={data.heroImage} alt={data.heroAlt || ""} />
        </figure>
      </section>

      {data.overview?.length ? (
        <section className="case-info">
          <div className="case-info-copy">
            {data.overview.map(([label, body]) => (
              <div key={label}>
                <h2>{labelText(label)}</h2>
                <p>{body}</p>
              </div>
            ))}
          </div>
          <dl>
            <div>
              <dt>Services</dt>
              <dd>
                {data.tags.map((tag) => (
                  <span className="case-chip" key={tag}>
                    {tag}
                  </span>
                ))}
              </dd>
            </div>
          </dl>
        </section>
      ) : null}

      {data.sections.map((section) => (
        <section className="case-block" key={section.id}>
          <CaseHeading title={section.title} text={section.description} />
          {section.kicker ? <p className="case-kicker">{section.kicker}</p> : null}
          <div className="case-shots">
            {sectionRows(section).map((row, index) => (
              <ShotRow key={row[0]?.id || index} row={row} />
            ))}
          </div>
        </section>
      ))}

      {data.summary ? (
        <>
          <section className="case-block">
            <CaseHeading title={data.summary.title || "Summary"} text={data.summary.description} />
          </section>
          {data.summary.stats ? <Stats items={data.summary.stats} /> : null}
          {data.summary.video ? (
            <section className="case-block">
              <figure className="case-shot">
                <CaseVideo
                  src={data.summary.video}
                  srcMobile={data.summary.videoMobile}
                  poster={data.summary.poster || data.heroImage}
                />
              </figure>
            </section>
          ) : null}
        </>
      ) : null}

      <OtherProjects slug={project.slug} onNavigate={onNavigate} />
      <CaseContact />
    </article>
  );
}

export function CasePage({ project, onNavigate }) {
  if (project.slug === "drumkit-logistic-saas") {
    return <DrumkitCase onNavigate={onNavigate} />;
  }

  const data = legacyCases[project.slug];
  if (!data) return null;
  return <LegacyCase project={project} data={data} onNavigate={onNavigate} />;
}
