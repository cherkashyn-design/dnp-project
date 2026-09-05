import { forwardRef, useEffect, useRef, useState } from "react";
import { Lottie, LottieSubscription } from "lottie-react";

import arrowUpRightIcon from "./assets/Icons/link-icon.svg";
import backIcon from "./assets/Icons/back-icon.svg";
import quoteIcon from "./assets/Icons/quote-icon.svg";
import dnpLogo from "./assets/Global/dnp-logo.png";
import drumkitPreview from "../portfolio/Drumkit-UI/lottie/Preview.jpg";
import drumkitNavPreview from "../portfolio/Drumkit-UI/lottie/Previews/Preview-Preview.jpg";
import drumkitNavSlide1 from "../portfolio/Drumkit-UI/lottie/Previews/Slide-1-Preview.jpg";
import drumkitNavSlide2 from "../portfolio/Drumkit-UI/lottie/Previews/Slide-2-Preview.jpg";
import drumkitNavSlide3 from "../portfolio/Drumkit-UI/lottie/Previews/Slide-3-Preview.jpg";
import drumkitNavSlide4 from "../portfolio/Drumkit-UI/lottie/Previews/Slide-4-Preview.jpg";
import drumkitNavSlide5 from "../portfolio/Drumkit-UI/lottie/Previews/Slide-5-Preview.jpg";
import drumkitNavSlide6 from "../portfolio/Drumkit-UI/lottie/Previews/Slide-6-Preview.jpg";
import drumkitNavSlide7 from "../portfolio/Drumkit-UI/lottie/Previews/Slide-7-Preview.jpg";
import drumkitNavSlide8 from "../portfolio/Drumkit-UI/lottie/Previews/Slide-8-Preview.jpg";
import drumkitNavSlide9 from "../portfolio/Drumkit-UI/lottie/Previews/Slide-9-Preview.jpg";
import drumkitSlide2 from "../portfolio/Drumkit-UI/lottie/Slide-2.jpg";
import drumkitSlide3P1 from "../portfolio/Drumkit-UI/lottie/Slide-3/p1.jpg";
import drumkitSlide3P2 from "../portfolio/Drumkit-UI/lottie/Slide-3/p2.jpg";
import drumkitSlide4QuickQuote from "../portfolio/Drumkit-UI/lottie/Slide-4-Quick-Quote.json";
import drumkitSlide4Sidebar from "../portfolio/Drumkit-UI/lottie/Slide-4-Integrated-Sidebar.json";
import drumkitSlide4LoadBuilding from "../portfolio/Drumkit-UI/lottie/Slide-4-Load-building.json";
import drumkitSlide4SmartAutoreplies from "../portfolio/Drumkit-UI/lottie/Slide-4-Smart-Autoreplies.json";
import drumkitSlide5Background from "../portfolio/Drumkit-UI/lottie/Slide-5/Background.jpg";
import drumkitSlide5Carrier from "../portfolio/Drumkit-UI/lottie/Slide-5/Content/Carrier.svg";
import drumkitSlide5Quote from "../portfolio/Drumkit-UI/lottie/Slide-5/Content/Quote.svg";
import drumkitSlide5Loan from "../portfolio/Drumkit-UI/lottie/Slide-5/Content/Loan.svg";
import drumkitSlide5Track from "../portfolio/Drumkit-UI/lottie/Slide-5/Content/Track.svg";
import drumkitSlide5Autoreplies from "../portfolio/Drumkit-UI/lottie/Slide-5/Content/Autoreplies.svg";
import drumkitSlide5Quote1 from "../portfolio/Drumkit-UI/lottie/Slide-5/Content/Quote-1.svg";
import drumkitSlide5Autoreplies3 from "../portfolio/Drumkit-UI/lottie/Slide-5/Content/Autoreplies-3.svg";
import drumkitSlide5Quote3 from "../portfolio/Drumkit-UI/lottie/Slide-5/Content/Quote-3.svg";
import drumkitSlide6 from "../portfolio/Drumkit-UI/lottie/Slide-6-Automate-data-entry.json";
import drumkitSlide7 from "../portfolio/Drumkit-UI/lottie/Slide-7-Simplify-SOPs.json";
import drumkitSlide8 from "../portfolio/Drumkit-UI/lottie/Slide-8-Analyze-metrics.json";
import drumkitSlide9Appointment from "../portfolio/Drumkit-UI/lottie/Slide-9-Appointment.json";
import drumkitSlide9Freight from "../portfolio/Drumkit-UI/lottie/Slide-9-Digital-Freight-Matching.json";
import drumkitSlide9SmartAutoreplies from "../portfolio/Drumkit-UI/lottie/Slide-9-Smart-Autoreplies.json";
import drumkitSlide9Track from "../portfolio/Drumkit-UI/lottie/Slide-9-Track-and-Trace.json";
import notionProjectDrumkit from "../portfolio/Drumkit-UI/lottie/Preview.jpg";
import notionProjectSalesDriver from "../portfolio/SalesDriver/notion-preview.jpg";
import notionProjectYummo from "../portfolio/Yummo/notion-preview.jpg";
import salesDriverPreview from "../portfolio/SalesDriver/Preview.jpg";
import salesDriverNavPreview from "../portfolio/SalesDriver/Previews/Preview-Preview.jpg";
import salesDriverNavSlide1 from "../portfolio/SalesDriver/Previews/Slide-1-Preview.jpg";
import salesDriverNavSlide2 from "../portfolio/SalesDriver/Previews/Slide-2-Preview.jpg";
import salesDriverNavSlide3 from "../portfolio/SalesDriver/Previews/Slide-3-Preview.jpg";
import salesDriverNavSlide4 from "../portfolio/SalesDriver/Previews/Slide-4-Preview.jpg";
import salesDriverNavSlide5 from "../portfolio/SalesDriver/Previews/Slide-5-Preview.jpg";
import salesDriverNavSlide6 from "../portfolio/SalesDriver/Previews/Slide-6-Preview.jpg";
import salesDriverNavSlide7 from "../portfolio/SalesDriver/Previews/Slide-7-Preview.jpg";
import salesDriverNavSlide8 from "../portfolio/SalesDriver/Previews/Slide-8-Preview.jpg";
import salesDriverNavSlide9 from "../portfolio/SalesDriver/Previews/Slide-9-Preview.jpg";
import salesDriverNavSlide10 from "../portfolio/SalesDriver/Previews/Slide-10-Preview.jpg";
import salesDriverNavSlide11 from "../portfolio/SalesDriver/Previews/Slide-11-Preview.jpg";
import salesDriverSlide1 from "../portfolio/SalesDriver/Slide-1.jpg";
import salesDriverSlide2 from "../portfolio/SalesDriver/Slide-2.jpg";
import salesDriverSlide3P1 from "../portfolio/SalesDriver/Slide-3/p1.jpg";
import salesDriverSlide3P2 from "../portfolio/SalesDriver/Slide-3/p2.jpg";
import salesDriverSlide4 from "../portfolio/SalesDriver/Slide-4.jpg";
import salesDriverSlide5P1 from "../portfolio/SalesDriver/Slide-5/p1.jpg";
import salesDriverSlide5P2 from "../portfolio/SalesDriver/Slide-5/p2.jpg";
import salesDriverSlide6 from "../portfolio/SalesDriver/Slide-6.jpg";
import salesDriverSlide7 from "../portfolio/SalesDriver/Slide-7.jpg";
import salesDriverSlide8 from "../portfolio/SalesDriver/Slide-8.jpg";
import salesDriverSlide9 from "../portfolio/SalesDriver/Slide-9.jpg";
import salesDriverSlide10P1 from "../portfolio/SalesDriver/Slide-10/p1.jpg";
import salesDriverSlide10P2 from "../portfolio/SalesDriver/Slide-10/p2.jpg";
import salesDriverSlide11 from "../portfolio/SalesDriver/Slide-11.jpg";
import yummoPreview from "../portfolio/Yummo/Preview.jpg";
import yummoNavPreview from "../portfolio/Yummo/Previews/Preview-Preview.jpg";
import yummoNavSlide1 from "../portfolio/Yummo/Previews/Slide-1-Preview.jpg";
import yummoNavSlide2 from "../portfolio/Yummo/Previews/Slide-2-Preview.jpg";
import yummoNavSlide3 from "../portfolio/Yummo/Previews/Slide-3-Preview.jpg";
import yummoNavSlide4 from "../portfolio/Yummo/Previews/Slide-4-Preview.jpg";
import yummoNavSlide5 from "../portfolio/Yummo/Previews/Slide-5-Preview.jpg";
import yummoNavSlide6 from "../portfolio/Yummo/Previews/Slide-6-Preview.jpg";
import yummoNavSlide7 from "../portfolio/Yummo/Previews/Slide-7-Preview.jpg";
import yummoNavSlide8 from "../portfolio/Yummo/Previews/Slide-8-Preview.jpg";
import yummoNavSlide9 from "../portfolio/Yummo/Previews/Slide-9-Preview.jpg";
import yummoNavSlide10 from "../portfolio/Yummo/Previews/Slide-10-Preview.jpg";
import yummoNavSlide11 from "../portfolio/Yummo/Previews/Slide-11-Preview.jpg";
import yummoSlide1 from "../portfolio/Yummo/Slide-1.jpg";
import yummoSlide2 from "../portfolio/Yummo/Slide-2.jpg";
import yummoSlide3 from "../portfolio/Yummo/Slide-3.jpg";
import yummoSlide4P1 from "../portfolio/Yummo/Slide-4/p1.jpg";
import yummoSlide4P2 from "../portfolio/Yummo/Slide-4/p2.jpg";
import yummoSlide5 from "../portfolio/Yummo/Slide-5.jpg";
import yummoSlide6 from "../portfolio/Yummo/Slide-6.jpg";
import yummoSlide7 from "../portfolio/Yummo/Slide-7.jpg";
import yummoSlide8 from "../portfolio/Yummo/Slide-8.jpg";
import yummoSlide9P1 from "../portfolio/Yummo/Slide-9/p1.jpg";
import yummoSlide9P2 from "../portfolio/Yummo/Slide-9/p2.jpg";
import yummoSlide10 from "../portfolio/Yummo/Slide-10.jpg";
import yummoSlide11 from "../portfolio/Yummo/Slide-11.jpg";

const portfolioAssets = import.meta.glob(
  [
    "../portfolio/SalesDriver/*.{png,jpg,jpeg,mp4}",
    "../portfolio/Yummo-App/*.{png,jpg,jpeg,mp4}",
    "../portfolio/Yummo-Landing/*.{png,jpg,jpeg,mp4}",
  ],
  {
    eager: true,
    import: "default",
  },
);

function portfolioAsset(path) {
  return portfolioAssets[`../portfolio/${path}`];
}

const email = "contact@donotpress.com";
const drumkitFavicon = "https://www.google.com/s2/favicons?domain=drumkit.ai&sz=32";
const yummoFavicon = "https://www.google.com/s2/favicons?domain=yummoapp.com&sz=32";

const drumkitSlide4Animations = [
  { data: drumkitSlide4QuickQuote, label: "Quick Quote" },
  { data: drumkitSlide4Sidebar, label: "Integrated Sidebar" },
  { data: drumkitSlide4LoadBuilding, label: "Load building" },
  { data: drumkitSlide4SmartAutoreplies, label: "Smart Autoreplies" },
];

const drumkitSlide9Animations = [
  { data: drumkitSlide9Appointment, label: "Appointment" },
  { data: drumkitSlide9Freight, label: "Digital Freight Matching" },
  { data: drumkitSlide9SmartAutoreplies, label: "Smart Autoreplies" },
  { data: drumkitSlide9Track, label: "Track and Trace" },
];

const drumkitSlide5Cards = [
  drumkitSlide5Carrier,
  drumkitSlide5Quote,
  drumkitSlide5Loan,
  drumkitSlide5Track,
  drumkitSlide5Autoreplies,
  drumkitSlide5Quote1,
  drumkitSlide5Autoreplies3,
  drumkitSlide5Quote3,
];

const drumkitNavigationItems = [
  { src: drumkitNavPreview, href: "#case-hero", label: "Hero" },
  { src: drumkitNavSlide1, href: "#case-landing-motion", label: "Landing animation" },
  { src: drumkitNavSlide2, href: "#case-landing-process", label: "Landing process" },
  { src: drumkitNavSlide3, href: "#case-feature-row", label: "Main features and integrations" },
  { src: drumkitNavSlide4, href: "#case-product-motion", label: "Feature animations" },
  { src: drumkitNavSlide5, href: "#case-sidebar-preview", label: "Sidebar" },
  { src: drumkitNavSlide6, href: "#case-feature-load-mail", label: "Load and mail integration" },
  { src: drumkitNavSlide7, href: "#case-feature-sops", label: "Simplify SOPs" },
  { src: drumkitNavSlide8, href: "#case-feature-dashboard", label: "Management dashboard" },
  { src: drumkitNavSlide9, href: "#case-summary-preview", label: "Summary" },
];

const cases = [
  {
    name: "Yummo - Food guide for moms",
    image: notionProjectYummo,
    tags: ["Branding", "Landing", "App"],
    href: "/cases/yummo-food-guide-for-moms",
  },
  {
    name: "Sales Driver - Ads Tool",
    image: notionProjectSalesDriver,
    tags: ["Branding", "Landing", "Deck"],
    href: "/cases/sales-driver-ads-tool",
  },
  {
    name: "Drumkit - Logistic SaaS",
    image: notionProjectDrumkit,
    tags: ["Web UI / SaaS", "Landing"],
    href: "/cases/drumkit-logistic-saas",
  },
];

const genericCasePages = {
  "/cases/yummo-food-guide-for-moms": {
    title: "Yummo - Food guide for moms",
    subtitle: "Ukrainian B2C mobile app to build healthy meal plans for the babies",
    heroAlt: "Yummo mobile app on a phone mockup",
    heroImage: yummoPreview,
    tags: ["Branding", "Landing", "App"],
    productionLink: {
      href: "https://yummoapp.com",
      label: "yummoapp.com",
      favicon: yummoFavicon,
    },
    navigationItems: [
      { src: yummoNavPreview, href: "#case-hero", label: "Hero" },
      { src: yummoNavSlide1, href: "#case-yummo-app-1", label: "App catalogue" },
      { src: yummoNavSlide2, href: "#case-yummo-app-2", label: "App calendar" },
      { src: yummoNavSlide3, href: "#case-yummo-app-3", label: "App recipes" },
      { src: yummoNavSlide4, href: "#case-app-design-row-4", label: "App knowledge" },
      { src: yummoNavSlide5, href: "#case-yummo-landing-1", label: "Landing hero" },
      { src: yummoNavSlide6, href: "#case-yummo-landing-2", label: "Landing features" },
      { src: yummoNavSlide7, href: "#case-yummo-landing-3", label: "Landing continuation" },
      { src: yummoNavSlide8, href: "#case-yummo-landing-4", label: "Landing more" },
      { src: yummoNavSlide9, href: "#case-landing-page-row-5", label: "Landing knowledge" },
      { src: yummoNavSlide10, href: "#case-yummo-landing-6", label: "Landing footer" },
      { src: yummoNavSlide11, href: "#case-yummo-summary", label: "Summary" },
    ],
    overview: [
      [
        "[ GOAL ]",
        "Redesign the app based on beta testers feedback, make the design system more development friendly, sync production and design.",
      ],
      [
        "[ IDEA ]",
        "Make positive and synced design system. Recipes, plates, products - all of them require custom approach, so we need to help parents to build balanced meal plan.",
      ],
    ],
    sections: [
      {
        id: "case-app-design",
        title: "App design",
        description: "You can find it in App Store and Google Play",
        mediaRows: [
          [
            {
              id: "case-yummo-app-1",
              src: yummoSlide1,
              caption: "Find your food in catalogue",
            },
          ],
          [
            {
              id: "case-yummo-app-2",
              src: yummoSlide2,
              caption: "Read tips and add to your calendar",
            },
          ],
          [
            {
              id: "case-yummo-app-3",
              src: yummoSlide3,
              caption: "Search for ideas at the Recipes and Plates",
            },
          ],
          [
            {
              id: "case-yummo-app-4a",
              src: yummoSlide4P1,
              caption: "Learn more in Knowledge",
            },
            {
              id: "case-yummo-app-4b",
              src: yummoSlide4P2,
              caption: "Get subscription for advanced features",
            },
          ],
        ],
      },
      {
        id: "case-landing-page",
        title: "Landing page",
        description: "Our adds linked to this page, we are explaining key features and push to download",
        mediaRows: [
          [{ id: "case-yummo-landing-1", src: yummoSlide5 }],
          [{ id: "case-yummo-landing-2", src: yummoSlide6 }],
          [{ id: "case-yummo-landing-3", src: yummoSlide7 }],
          [{ id: "case-yummo-landing-4", src: yummoSlide8 }],
          [
            { id: "case-yummo-landing-5a", src: yummoSlide9P1 },
            { id: "case-yummo-landing-5b", src: yummoSlide9P2 },
          ],
          [{ id: "case-yummo-landing-6", src: yummoSlide10 }],
        ],
      },
    ],
    summary: {
      title: "Summary",
      description:
        "We have well structured redesigned app. Also, we have roadmap for future retention features, but it’s already affected user experience",
      stats: [
        ["+30%", "Website conversion rate"],
        ["+31%", "Daily active users rate"],
        ["6000+", "Users at the first week after release"],
      ],
      image: yummoSlide11,
      imageId: "case-yummo-summary",
    },
  },
  "/cases/sales-driver-ads-tool": {
    title: "Sales Driver - Ads Tool",
    subtitle: "AI B2B tool to get leads in one tap",
    heroAlt: "Sales Driver phone mockup with Get Leads button",
    heroImage: salesDriverPreview,
    tags: ["Branding", "Landing", "Deck"],
    navigationItems: [
      { src: salesDriverNavPreview, href: "#case-hero", label: "Hero" },
      { src: salesDriverNavSlide1, href: "#case-salesdriver-concept-1", label: "Design concept card" },
      { src: salesDriverNavSlide2, href: "#case-salesdriver-concept-2", label: "Design concept mobile" },
      { src: salesDriverNavSlide3, href: "#case-design-concept-row-3", label: "Design concept details" },
      { src: salesDriverNavSlide4, href: "#case-salesdriver-landing-1", label: "Landing page desktop" },
      { src: salesDriverNavSlide5, href: "#case-landing-page-row-2", label: "Landing page mobile" },
      { src: salesDriverNavSlide6, href: "#case-salesdriver-landing-3", label: "Landing page showcase" },
      { src: salesDriverNavSlide7, href: "#case-salesdriver-brand-1", label: "Brand system" },
      { src: salesDriverNavSlide8, href: "#case-salesdriver-brand-2", label: "Brand print" },
      { src: salesDriverNavSlide9, href: "#case-salesdriver-deck-1", label: "Pitch deck" },
      { src: salesDriverNavSlide10, href: "#case-pitch-deck-row-2", label: "Pitch deck details" },
      { src: salesDriverNavSlide11, href: "#case-salesdriver-summary", label: "Summary" },
    ],
    overview: [
      [
        "[ GOAL ]",
        "To build standalone brand for AI sales tool. It should be technical and modern",
      ],
      [
        "[ IDEA ]",
        "Usually AI B2B tools takes a lot of time to setting up. It’s a tool which automatically analyzes your business artifacts and provides the leads by a simple button “Get leads”. No need specialists to setting up",
      ],
    ],
    sections: [
      {
        id: "case-design-concept",
        title: "Design concept",
        description:
          "As a result of brainstorming we build acid modern design solution for the brand and presented it",
        mediaRows: [
          [
            {
              id: "case-salesdriver-concept-1",
              src: salesDriverSlide1,
              caption:
                "We found non usual solution for the business card. We are keep the idea of the one tap “Get leads” even for phisical objects",
            },
          ],
          [
            {
              id: "case-salesdriver-concept-2",
              src: salesDriverSlide2,
              caption:
                "Based on analytics main users is still uses mobile, so we had mobile first approach for this B2B product",
            },
          ],
          [
            {
              id: "case-salesdriver-concept-3a",
              src: salesDriverSlide3P1,
              caption: "We bought green paper for the docs to standalone",
            },
            {
              id: "case-salesdriver-concept-3b",
              src: salesDriverSlide3P2,
              caption: "Unique style for peach decks",
            },
          ],
        ],
      },
      {
        id: "case-landing-page",
        title: "Landing page",
        description: "We rebuild the landing page in our style based on AIDA sales pattern",
        mediaRows: [
          [
            {
              id: "case-salesdriver-landing-1",
              src: salesDriverSlide4,
            },
          ],
          [
            {
              id: "case-salesdriver-landing-2a",
              src: salesDriverSlide5P1,
            },
            {
              id: "case-salesdriver-landing-2b",
              src: salesDriverSlide5P2,
            },
          ],
          [
            {
              id: "case-salesdriver-landing-3",
              src: salesDriverSlide6,
            },
          ],
        ],
      },
      {
        id: "case-brand-system",
        title: "Brand system",
        description: "Clear rules and assents for the brand team to expand the style",
        mediaRows: [
          [
            {
              id: "case-salesdriver-brand-1",
              src: salesDriverSlide7,
            },
          ],
          [
            {
              id: "case-salesdriver-brand-2",
              src: salesDriverSlide8,
            },
          ],
        ],
      },
      {
        id: "case-pitch-deck",
        title: "Pitch deck",
        description: "Important tool for B2B sales build from stratch",
        mediaRows: [
          [
            {
              id: "case-salesdriver-deck-1",
              src: salesDriverSlide9,
            },
          ],
          [
            {
              id: "case-salesdriver-deck-2a",
              src: salesDriverSlide10P1,
            },
            {
              id: "case-salesdriver-deck-2b",
              src: salesDriverSlide10P2,
            },
          ],
        ],
      },
    ],
    summary: {
      title: "Summary",
      description:
        "We have branding, pith deck and landing. Everything you need to get traffic to your startup",
      stats: [
        ["+78%", "Website conversion rate"],
        ["+120%", "More leads remember us for a month after first touch"],
      ],
      image: salesDriverSlide11,
      imageId: "case-salesdriver-summary",
    },
  },
};

function App() {
  if (window.location.pathname === "/cases/drumkit-logistic-saas") {
    return <DrumkitCasePage />;
  }

  const genericCasePage = genericCasePages[window.location.pathname];
  if (genericCasePage) {
    return <PortfolioCasePage project={genericCasePage} />;
  }

  return <HomePage />;
}

function HomePage() {
  const casesRef = useRef(null);
  const [scrollState, setScrollState] = useState({
    hasScrolledCases: false,
    isAtEnd: false,
    isCasesActive: false,
  });

  useScrollZoomMedia();
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

function DrumkitCasePage() {
  useScrollZoomMedia();
  useRevealAnimations();
  useCaseNavScroll();

  return (
    <main className="case-page">
      <CaseHeader navigationItems={drumkitNavigationItems} />

      <section className="case-hero" id="case-hero">
        <div className="case-hero-media">
          <div className="case-hero-image-frame">
            <img src={drumkitPreview} alt="Drumkit landing page on a laptop" />
          </div>
        </div>
        <div className="case-hero-info">
          <div className="case-hero-title-block">
            <h1>Drumkit - Logistic SaaS</h1>
            <p className="case-hero-subtitle">
              AI B2B tool to optimize logistic expenses and time spent
            </p>
          </div>
          <dl className="case-meta">
            <div>
              <dt>Deliveries:</dt>
              <dd>
                <span>SaaS</span>
                <span>Landing</span>
              </dd>
            </div>
            <div>
              <dt>Production link:</dt>
              <dd>
                <a className="production-link" href="https://drumkit.ai" target="_blank" rel="noreferrer">
                  <img src={drumkitFavicon} alt="" />
                  drumkit.ai
                  <img className="external-arrow-icon" src={arrowUpRightIcon} alt="" />
                </a>
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="case-section case-overview" id="case-overview">
        <div className="overview-grid">
          <div>
            <InfoBlock
              eyebrow="[ GOAL ]"
              body="To redesign the existent product, from MVP to YC level startup. It existed as an MVP developed by one person, but there was no branding and no UX best practices. We needed to improve UX to get more conversion and retention."
            />
            <InfoBlock
              eyebrow="[ IDEA ]"
              body="To build SaaS product to help logistic companies deliver. It has a sidebar with integrated emails and messengers. You have a dashboard with all the data about your company and managers performance. All these functionalities are united in one place but integrated into current user workflow."
            />
          </div>
          <blockquote>
            <span className="quote-icon" aria-hidden="true">
              <img src={quoteIcon} alt="" />
            </span>
            <div>
              <p>
                DNP is excellent and incredibly talented. They are rapid and pretty
                detail-oriented. They also got a very positive attitude, is
                persistent through design changes/requests, and thoughtful
                throughout. They a pleasure to work with and I would gladly work
                with they again.
              </p>
              <cite>Dhruv G. from Axle Technologies, Inc</cite>
            </div>
          </blockquote>
        </div>
      </section>

      <section className="case-section" id="case-landing">
        <h2>Website</h2>
        <MediaBlock
          id="case-landing-motion"
          type="mockup"
          mockup={{
            mockupId: "5a26d7db-4784-4595-8db1-f16a744ec2b3",
            width: "100%",
            aspectRatio: "16 / 9",
            trigger: "load",
            triggerLoop: false,
            cursorRange: "17-56-14-55",
            clickRange: "12-12-11-11",
            cameraZoom: "30",
          }}
          caption="Animated first sections to show product in action"
        />
        <MediaBlock
          id="case-landing-process"
          type="image"
          src={drumkitSlide2}
          caption="Step by step reviewing the process, to understand how it works for you"
        />
        <div className="media-grid" id="case-feature-row">
          <MediaBlock
            id="case-main-features"
            type="image"
            src={drumkitSlide3P1}
            caption="Main features review to meet with the product"
          />
          <MediaBlock
            id="case-integrations"
            type="image"
            src={drumkitSlide3P2}
            caption="Integrations preview. Some users seeking for the product who integrated into their existent system, we should to emphasise them."
          />
        </div>
        <LottieQuadBlock
          id="case-product-motion"
          animations={drumkitSlide4Animations}
          caption="Motion animation to show the main features. It’s essential for B2B product, user can’t just register to try the product. It requires to go through the demo and connect user CRM’s and other backend to our platform."
        />
        <StatsSection
          className="case-stats-compact"
          eyebrow="[ RESULTS ]"
          stats={[
            ["+56%", "Conversion rate"],
            ["+451%", "Time spent"],
            ["11", "Lottie animations"],
          ]}
        />
      </section>

      <section className="case-section" id="case-sidebar">
        <div className="section-heading-row section-heading-stack">
          <h2>Sidebar</h2>
          <p>
            It’s a Chrome extension. It integrates into whole logistic process so
            has a lot of states. I’ll highlight you the most important.
          </p>
        </div>
        <SidebarMarquee
          id="case-sidebar-preview"
          background={drumkitSlide5Background}
          cards={drumkitSlide5Cards}
          caption="Sidebar is a key functional and has a lot of states. We reworked the sidebar with a lot of users tests and keeping in mind the previous solution."
        />
        <FeatureSection
          id="case-feature-load-mail"
          title="Load and mail integration"
          lottieData={drumkitSlide6}
          items={[
            ["Problem", "All departments and clients has their own solutions to track loads. That’s creating mistakes and misunderstandings."],
            ["Solution", "Automatically tracks all your services (Aljex, Tai, AscendTMS and other). Collecting data and update it in sidebar."],
            [
              "Case of use",
              "1. Collect load update from Aljex\n2. Send update to the client with Outlook\n3. Automatically refresh status based on client feedback.",
            ],
            [
              "Result",
              <>
                That makes whole the flow more consistent, departments synced and time spent on load management{" "}
                <strong>61% less</strong>.
              </>,
            ],
          ]}
        />
        <FeatureSection
          id="case-feature-sops"
          title="Simplify SOPs"
          lottieData={drumkitSlide7}
          items={[
            ["Problem", "Logistic companies has a lot of clients and drivers and spent a lot of time to manage their process and slots."],
            ["Solution", "Automatically send updates and slot options to the clients during the process instead of manual work."],
            [
              "Case of use",
              "1. Client select pickup timeslot\n2. Auto match with the truck\n3. Driver confirm loaded\n4. Client may track transit\n5. Client select dropoff timeslot\n6. Driver mark completed.",
            ],
            [
              "Result",
              <>
                Only corner cases requires management attention, that made time spent <strong>94% less</strong>.
              </>,
            ],
          ]}
        />
        <FeatureSection
          id="case-feature-dashboard"
          title="Management dashboard"
          lottieData={drumkitSlide8}
          items={[
            ["Problem", "Due to a lot of product there no way to track managers effectivency"],
            ["Solution", "Merge all the data in one place. Show it as dashboard"],
            [
              "Case of use",
              "1. Managers lead go to dashboard\n2. Review each manager stats and clients communication history\n3. Based on it can manage compensation policy",
            ],
            ["Result", "More effective management department"],
          ]}
        />
      </section>

      <section className="case-section case-summary" id="case-summary">
        <h2>Summary</h2>
        <p>
          We have website, dashboard and side panel which is made the whole
          process much more effective.
        </p>
        <StatsSection
          stats={[
            ["+56%", "Website conversion rate"],
            ["-61%", "Load management time spent"],
            ["-94%", "SOP management time spent"],
          ]}
        />
        <LottieQuadBlock
          id="case-summary-preview"
          animations={drumkitSlide9Animations}
          caption="Autofilling, appointment, slots matching and carrier functionality animations to show the product"
        />
      </section>

      <OtherProjectsSection currentHref="/cases/drumkit-logistic-saas" />
    </main>
  );
}

function PortfolioCasePage({ project }) {
  const navigationItems = project.navigationItems || createCaseNavigationItems(project);

  useScrollZoomMedia();
  useRevealAnimations();
  useCaseNavScroll();

  return (
    <main className="case-page">
      <CaseHeader navigationItems={navigationItems} />

      <section className="case-hero" id="case-hero">
        <div className="case-hero-media">
          <div className="case-hero-image-frame">
            <img src={project.heroImage} alt={project.heroAlt} />
          </div>
        </div>
        <div className="case-hero-info">
          <div className="case-hero-title-block">
            <h1>{project.title}</h1>
            {project.subtitle ? <p className="case-hero-subtitle">{project.subtitle}</p> : null}
          </div>
          {project.idea ? <InfoBlock eyebrow="[ IDEA ]" body={project.idea} /> : null}
          <dl className="case-meta">
            <div>
              <dt>Deliveries:</dt>
              <dd>
                {project.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </dd>
            </div>
            {project.status ? (
              <div>
                <dt>Status:</dt>
                <dd>
                  <span>{project.status}</span>
                </dd>
              </div>
            ) : null}
            {project.productionLink ? (
              <div>
                <dt>Production link:</dt>
                <dd>
                  <a
                    className="production-link"
                    href={project.productionLink.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {project.productionLink.favicon ? (
                      <img src={project.productionLink.favicon} alt="" />
                    ) : null}
                    {project.productionLink.label}
                    <img className="external-arrow-icon" src={arrowUpRightIcon} alt="" />
                  </a>
                </dd>
              </div>
            ) : null}
          </dl>
        </div>
      </section>

      <section className="case-section case-overview" id="case-overview">
        {project.quote ? <h2>About the project</h2> : null}
        {project.quote ? (
          <div className="overview-grid">
            <div>
              {project.overview.map(([eyebrow, body]) => (
                <InfoBlock key={eyebrow} eyebrow={eyebrow} body={body} />
              ))}
            </div>
            <blockquote>
              <span className="quote-icon" aria-hidden="true">
              <img src={quoteIcon} alt="" />
            </span>
              <div>
                <p>{project.quote.text}</p>
                <cite>{project.quote.cite}</cite>
              </div>
            </blockquote>
          </div>
        ) : (
          <div className="overview-plain">
            {project.overview.map(([eyebrow, body]) => (
              <InfoBlock key={eyebrow} eyebrow={eyebrow} body={body} />
            ))}
          </div>
        )}
      </section>

      {project.stats ? (
        <section className="case-section" id="case-deliverables">
          <StatsSection eyebrow="[ DELIVERABLES ]" stats={project.stats} />
        </section>
      ) : null}

      {project.sections.map((section) => (
        <PortfolioCaseSection key={section.id} section={section} />
      ))}

      {project.summary ? (
        <section className="case-section case-summary" id="case-summary">
          <div className="section-heading-row section-heading-stack">
            <h2>{project.summary.title}</h2>
            {project.summary.description ? <p>{project.summary.description}</p> : null}
          </div>
          <StatsSection stats={project.summary.stats} />
          {project.summary.mockup ? (
            <MediaBlock
              id={project.summary.imageId || "case-summary-preview"}
              type="mockup"
              mockup={project.summary.mockup}
              caption={project.summary.caption}
              variant="wide"
            />
          ) : project.summary.image ? (
            <MediaBlock
              id={project.summary.imageId || "case-summary-preview"}
              type="image"
              src={project.summary.image}
              caption={project.summary.caption}
              variant="wide"
            />
          ) : null}
        </section>
      ) : null}

      <OtherProjectsSection currentHref={window.location.pathname} />
    </main>
  );
}

function OtherProjectsSection({ currentHref }) {
  const otherProjects = cases.filter((project) => project.href !== currentHref).slice(0, 2);

  return (
    <section className="other-projects-section" id="case-other-projects" aria-label="Other projects">
      <h2 className="other-projects-title">Other Projects</h2>
      <div className="other-projects-grid">
        {otherProjects.map((project) => (
          <ProjectCard key={project.name} project={project} />
        ))}
      </div>
      <a className="all-projects-link" href="/">
        <span className="all-projects-spacer" aria-hidden="true">
          {cases.length} Projects
        </span>
        <span className="all-projects-label">All Projects</span>
        <span className="all-projects-count">{cases.length} Projects</span>
      </a>
    </section>
  );
}

function PortfolioCaseSection({ section }) {
  return (
    <section className="case-section" id={section.id}>
      <div className="section-heading-row section-heading-stack">
        <h2>{section.title}</h2>
        {section.description ? <p>{section.description}</p> : null}
      </div>

      {section.mediaRows.map((row, rowIndex) =>
        row.length === 1 ? (
          <MediaBlock key={row[0].id} id={row[0].id} type="image" src={row[0].src} caption={row[0].caption} />
        ) : (
          <div className="media-grid" id={getMediaRowId(section, rowIndex)} key={getMediaRowId(section, rowIndex)}>
            {row.map((media) => (
              <MediaBlock key={media.id} id={media.id} type="image" src={media.src} caption={media.caption} />
            ))}
          </div>
        ),
      )}
    </section>
  );
}

function createCaseNavigationItems(project) {
  const mediaItems = project.sections.flatMap((section) =>
    section.mediaRows.map((row, rowIndex) => ({
      href: row.length === 1 ? `#${row[0].id}` : `#${getMediaRowId(section, rowIndex)}`,
      label: row.length === 1 ? row[0].caption : `${section.title} images ${rowIndex + 1}`,
      src: row.length === 1 ? row[0].src : row.map((media) => media.src),
    })),
  );

  const items = [{ src: project.heroImage, href: "#case-hero", label: "Hero" }, ...mediaItems];

  if (project.summary?.image || project.summary?.mockup) {
    items.push({
      src: project.summary.navPreview || project.summary.image || project.heroImage,
      href: `#${project.summary.imageId || "case-summary-preview"}`,
      label: project.summary.title || "Summary",
    });
  }

  return items;
}

function getMediaRowId(section, rowIndex) {
  return `${section.id}-row-${rowIndex + 1}`;
}

function CaseHeader({ navigationItems }) {
  return (
    <>
      <header className="case-header">
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

function CaseNavigationSlider({ navigationItems }) {
  return (
    <nav className="case-nav-slider" aria-label="Case page position">
      <div className="case-nav-panel case-nav-panel-left">
        <ThumbnailTrack baseOffset={118} navigationItems={navigationItems} />
      </div>
      <div className="case-nav-panel case-nav-panel-right">
        <ThumbnailTrack baseOffset={-56} navigationItems={navigationItems} />
      </div>
    </nav>
  );
}

function ThumbnailTrack({ baseOffset, navigationItems }) {
  return (
    <div className="case-nav-track" data-base-offset={baseOffset} style={{ transform: `translateX(${baseOffset}px)` }}>
      {navigationItems.map((item, index) => (
        <a
          className={Array.isArray(item.src) ? "case-nav-thumb case-nav-thumb-combined" : "case-nav-thumb"}
          href={item.href}
          key={`${item.href}-${index}`}
          aria-label={item.label}
        >
          {Array.isArray(item.src) ? (
            item.src.map((src) => <NavThumbMedia key={src} src={src} />)
          ) : (
            <NavThumbMedia src={item.src} />
          )}
        </a>
      ))}
    </div>
  );
}

function NavThumbMedia({ src }) {
  return src.endsWith(".mp4") ? <video src={src} muted playsInline /> : <img src={src} alt="" />;
}

function InfoBlock({ eyebrow, body }) {
  return (
    <div className="info-block">
      <p>{eyebrow}</p>
      <p>{body}</p>
    </div>
  );
}

function MediaBlock({ id, type, src, poster, caption, variant, mockup }) {
  return (
    <figure className="case-media-block" id={id}>
      <div
        className={[
          "case-media",
          variant === "wide" ? "case-media-wide" : "",
          type === "mockup" ? "case-media-mockup" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {type === "mockup" ? (
          <MockupPlayer {...mockup} />
        ) : type === "video" ? (
          <video src={src} poster={poster} autoPlay muted loop playsInline />
        ) : (
          <img src={src} alt="" />
        )}
      </div>
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}

function MockupPlayer({
  mockupId,
  width = "100%",
  aspectRatio = "16 / 9",
  trigger,
  triggerLoop,
  cursorRange,
  clickRange,
  zoomMode,
  zoomAmount,
  zoomDuration,
  cursorAffectPage,
  backgroundColor,
  cameraZoom,
}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (ready) return undefined;

    let settled = false;
    let quietTimer = null;
    const mountedAt = performance.now();

    const markReady = () => {
      if (settled) return;
      settled = true;
      setReady(true);
    };

    const onMessage = (event) => {
      const data = event.data;
      if (
        data?.type === "mockup-player:ready" &&
        (!data.uid || data.uid === mockupId)
      ) {
        markReady();
      }
    };
    window.addEventListener("message", onMessage);

    const isSceneAsset = (name = "") =>
      name.includes("mckp") ||
      name.includes("mockup") ||
      (mockupId ? name.includes(mockupId) : false);

    const bumpQuiet = () => {
      window.clearTimeout(quietTimer);
      quietTimer = window.setTimeout(markReady, 1400);
    };

    let observer;
    try {
      observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (
            isSceneAsset(entry.name) &&
            entry.startTime >= mountedAt - 50
          ) {
            bumpQuiet();
          }
        }
      });
      observer.observe({ type: "resource", buffered: true });
    } catch {
      // PerformanceObserver may be unavailable.
    }

    const fallback = window.setTimeout(markReady, 10000);

    return () => {
      window.removeEventListener("message", onMessage);
      window.clearTimeout(fallback);
      window.clearTimeout(quietTimer);
      observer?.disconnect();
    };
  }, [mockupId, ready]);

  return (
    <div
      className={["mockup-player-shell", ready ? "is-ready" : ""].filter(Boolean).join(" ")}
      style={{ "--mockup-aspect": aspectRatio }}
    >
      <div className="mockup-player-skeleton" aria-hidden={ready}>
        <span className="mockup-player-skeleton-shine" />
      </div>
      <mockup-player
        mockup-id={mockupId}
        width={width}
        aspect-ratio={aspectRatio}
        trigger={trigger}
        trigger-loop={
          triggerLoop === true ? "true" : triggerLoop === false ? "false" : undefined
        }
        cursor-range={cursorRange}
        click-range={clickRange}
        zoom-mode={zoomMode}
        zoom-amount={zoomAmount}
        zoom-duration={zoomDuration}
        cursor-affect-page={
          cursorAffectPage === false
            ? "false"
            : cursorAffectPage === true
              ? "true"
              : undefined
        }
        background-color={backgroundColor}
        camera-zoom={cameraZoom}
      />
    </div>
  );
}

function StatsSection({ eyebrow, stats, className = "" }) {
  return (
    <div className={["case-stats", className].filter(Boolean).join(" ")}>
      {eyebrow ? <p className="stats-eyebrow">{eyebrow}</p> : null}
      <div style={{ gridTemplateColumns: `repeat(${Math.max(stats.length, 1)}, minmax(0, 1fr))` }}>
        {stats.map(([value, label]) => (
          <article key={`${value}-${label}`}>
            <strong>{value}</strong>
            <span>{label}</span>
          </article>
        ))}
      </div>
    </div>
  );
}

function FeatureSection({ id, title, mediaSrc, lottieData, items }) {
  return (
    <section className="feature-section" id={id}>
      <h3>{title}</h3>
      {lottieData ? (
        <div className="case-media feature-media case-media-lottie">
          <LottiePlayer animationData={lottieData} playMode="visible" />
        </div>
      ) : mediaSrc ? (
        <div className="case-media feature-media">
          <img src={mediaSrc} alt="" />
        </div>
      ) : null}
      <div className="feature-grid">
        {items.map(([label, body]) => (
          <InfoBlock key={label} eyebrow={`[ ${label.toUpperCase()} ]`} body={body} />
        ))}
      </div>
    </section>
  );
}

function LottieQuadBlock({ id, animations, caption }) {
  return (
    <figure className="case-media-block" id={id}>
      <div className="lottie-quad-grid" role="list">
        {animations.map((animation) => {
          const width = animation.data?.w;
          const height = animation.data?.h;
          const aspectRatio = width && height ? `${width} / ${height}` : undefined;

          return (
            <div
              className="lottie-card"
              key={animation.label}
              role="listitem"
              aria-label={animation.label}
              style={aspectRatio ? { aspectRatio } : undefined}
            >
              <LottiePlayer animationData={animation.data} playMode="hover" />
            </div>
          );
        })}
      </div>
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}

function SidebarMarquee({ id, background, cards, caption }) {
  const loopCards = [...cards, ...cards];

  return (
    <figure className="case-media-block" id={id}>
      <div className="case-media case-media-marquee">
        <img className="marquee-bg" src={background} alt="" />
        <div className="marquee-viewport">
          <div className="marquee-track">
            {loopCards.map((card, index) => (
              <div className="marquee-card" key={`${card}-${index}`}>
                <img src={card} alt="" />
              </div>
            ))}
          </div>
        </div>
      </div>
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}

function LottiePlayer({ animationData, playMode = "visible" }) {
  const containerRef = useRef(null);
  const lottieRef = useRef(null);
  const playingThroughRef = useRef(false);
  const [inView, setInView] = useState(false);
  const [hoverCapable, setHoverCapable] = useState(false);
  const aspectRatio =
    animationData?.w && animationData?.h ? `${animationData.w} / ${animationData.h}` : undefined;

  useEffect(() => {
    const hoverQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    const widthQuery = window.matchMedia("(min-width: 800px)");

    const updateHoverCapable = () => {
      setHoverCapable(hoverQuery.matches && widthQuery.matches);
    };

    updateHoverCapable();
    hoverQuery.addEventListener("change", updateHoverCapable);
    widthQuery.addEventListener("change", updateHoverCapable);

    return () => {
      hoverQuery.removeEventListener("change", updateHoverCapable);
      widthQuery.removeEventListener("change", updateHoverCapable);
    };
  }, []);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { threshold: 0.2 },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const isHoverMode = playMode === "hover" && hoverCapable;

  useEffect(() => {
    const animation = lottieRef.current;
    if (!animation || isHoverMode) {
      return;
    }

    if (inView) {
      animation.play();
      return;
    }

    animation.pause();
  }, [inView, isHoverMode]);

  const playHoverCycle = () => {
    const animation = lottieRef.current;
    if (!animation || !inView || playingThroughRef.current) {
      return;
    }

    playingThroughRef.current = true;
    animation.seek(0);
    animation.play();
  };

  return (
    <div
      className="lottie-player"
      ref={containerRef}
      style={aspectRatio ? { aspectRatio } : undefined}
      onMouseEnter={() => {
        if (isHoverMode) {
          playHoverCycle();
        }
      }}
    >
      <Lottie
        lottieRef={lottieRef}
        src={animationData}
        loop={!isHoverMode}
        autoplay={false}
        style={{ width: "100%", height: "100%" }}
        subscriptions={{
          [LottieSubscription.complete]: () => {
            playingThroughRef.current = false;
          },
        }}
      />
    </div>
  );
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

      <section className="cta" aria-label="Start a project">
        <p>If you're launching — let’s do it right:</p>
        <div className="cta-actions">
          <a className="button button-primary" href={`mailto:${email}?subject=Start%20a%20Project`}>
            Start a Project
          </a>
          <button className="button button-email" type="button" onClick={copyEmail}>
            <span>{email}</span>
            <span className="copy-icon" aria-hidden="true">
              <span />
              <span />
            </span>
          </button>
        </div>
      </section>
    </aside>
  );
}

const CaseList = forwardRef(function CaseList(_props, ref) {
  return (
    <section className="cases-column" ref={ref} aria-label="Selected cases">
      <div className="cases-grid">
        {cases.map((project) => (
          <ProjectCard key={project.name} project={project} />
        ))}
      </div>
      <SiteFooter />
    </section>
  );
});

function ProjectCard({ project }) {
  const content = (
    <>
      <div className="project-image-wrap">
        <img className="project-image" src={project.image} alt={`${project.name} preview`} />
        <span className="project-view-pill">View Project</span>
      </div>
      <div className="project-info">
        <h2>{project.name}</h2>
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

function SiteFooter() {
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

async function copyEmail() {
  if (!navigator.clipboard) {
    window.location.href = `mailto:${email}`;
    return;
  }

  await navigator.clipboard.writeText(email);
}

function useScrollZoomMedia() {
  useEffect(() => {
    let animationFrame = null;

    const updateMediaScale = () => {
      animationFrame = null;
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const mediaElements = document.querySelectorAll(
        ".project-image, .case-hero-image-frame img, .case-media > img, .case-media > video",
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

function useCaseNavScroll() {
  useEffect(() => {
    let animationFrame = null;

    const getMediaTarget = (section) =>
      section.querySelector(
        [
          ".case-hero-image-frame",
          ".case-media",
          ".lottie-quad-grid",
          ".feature-media",
          ".case-media-marquee",
        ].join(", "),
      ) || section;

    const getSectionProgress = (links) => {
      const viewportCenter = window.innerHeight / 2;
      const centers = links.map((link) => {
        const id = link.getAttribute("href")?.replace(/^#/, "");
        const section = id ? document.getElementById(id) : null;
        if (!section) return null;
        const media = getMediaTarget(section);
        const rect = media.getBoundingClientRect();
        return rect.top + rect.height / 2;
      });

      if (centers.every((center) => center == null)) {
        return 0;
      }

      const first = centers.findIndex((center) => center != null);
      let last = -1;
      for (let index = centers.length - 1; index >= 0; index -= 1) {
        if (centers[index] != null) {
          last = index;
          break;
        }
      }

      if (centers[first] >= viewportCenter) {
        return first;
      }

      if (centers[last] <= viewportCenter) {
        return last;
      }

      for (let index = 0; index < centers.length - 1; index += 1) {
        const current = centers[index];
        let nextIndex = index + 1;
        while (nextIndex < centers.length && centers[nextIndex] == null) {
          nextIndex += 1;
        }
        const next = centers[nextIndex];
        if (current == null || next == null) {
          continue;
        }

        if (current <= viewportCenter && viewportCenter <= next) {
          const span = next - current || 1;
          return index + ((viewportCenter - current) / span) * (nextIndex - index);
        }
      }

      return first;
    };

    const updateNavPosition = () => {
      animationFrame = null;
      const tracks = Array.from(document.querySelectorAll(".case-nav-track")).filter(
        (track) => {
          const slider = track.closest(".case-nav-slider");
          return slider && slider.getClientRects().length > 0;
        },
      );
      if (tracks.length === 0) {
        return;
      }

      const referenceTrack = tracks[0];
      const links = Array.from(referenceTrack.querySelectorAll("a.case-nav-thumb"));
      if (links.length === 0) {
        return;
      }

      const slider = referenceTrack.closest(".case-nav-slider");
      const leftPanel = referenceTrack.parentElement;
      if (!slider || !leftPanel) {
        return;
      }

      const progress = getSectionProgress(links);
      const thumbWidth = links[0].offsetWidth || 48;
      const gap = Number.parseFloat(window.getComputedStyle(referenceTrack).gap) || 4;
      const step = thumbWidth + gap;
      const sliderRect = slider.getBoundingClientRect();
      const panelRect = leftPanel.getBoundingClientRect();
      const centerInLeftPanel = sliderRect.left + sliderRect.width / 2 - panelRect.left;
      const leftBase = Number(referenceTrack.dataset.baseOffset || 0);
      const sharedDelta =
        centerInLeftPanel - leftBase - progress * step - thumbWidth / 2;

      document.querySelectorAll(".case-nav-track").forEach((track) => {
        const baseOffset = Number(track.dataset.baseOffset || 0);
        track.style.transform = `translateX(${baseOffset + sharedDelta}px)`;
      });
    };

    const requestUpdate = () => {
      if (animationFrame === null) {
        animationFrame = window.requestAnimationFrame(updateNavPosition);
      }
    };

    updateNavPosition();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    const resizeObserver =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(() => requestUpdate());
    resizeObserver?.observe(document.documentElement);

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      resizeObserver?.disconnect();
      if (animationFrame !== null) {
        window.cancelAnimationFrame(animationFrame);
      }
    };
  }, []);
}

function useRevealAnimations() {
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
          ".cta p",
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

    const animatedElements = [...textElements, ...motionElements];

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

export default App;
