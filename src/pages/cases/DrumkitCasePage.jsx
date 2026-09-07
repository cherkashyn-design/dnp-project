import arrowUpRightIcon from "../../assets/icons/link-icon.svg";
import quoteIcon from "../../assets/icons/quote-icon.svg";
import { ProgressiveImage } from "../../components/media/ProgressiveImage.jsx";
import { MediaBlock } from "../../components/media/MediaBlock.jsx";
import { LottieQuadBlock } from "../../components/media/LottieQuadBlock.jsx";
import { SidebarMarquee } from "../../components/media/SidebarMarquee.jsx";
import { CaseHeader } from "../../components/case/CaseHeader.jsx";
import { InfoBlock } from "../../components/case/InfoBlock.jsx";
import { StatsSection } from "../../components/case/StatsSection.jsx";
import { FeatureSection } from "../../components/case/FeatureSection.jsx";
import { OtherProjectsSection } from "../../components/case/OtherProjectsSection.jsx";
import { useScrollZoomMedia } from "../../hooks/useScrollZoomMedia.js";
import { useRevealAnimations } from "../../hooks/useRevealAnimations.js";
import { useCaseNavScroll } from "../../hooks/useCaseNavScroll.js";
import {
  drumkitFavicon,
  drumkitPreview,
  drumkitSlide2,
  drumkitSlide3P1,
  drumkitSlide3P2,
  drumkitSlide5Background,
  drumkitSlide4Animations,
  drumkitSlide9Animations,
  drumkitSlide5Cards,
  drumkitNavigationItems,
  loadDrumkitSlide6,
  loadDrumkitSlide7,
  loadDrumkitSlide8,
} from "../../data/drumkit.js";
import "../../lib/portfolioLq.js";

export default function DrumkitCasePage() {
  useScrollZoomMedia();
  useRevealAnimations();
  useCaseNavScroll();

  return (
    <main className="case-page">
      <CaseHeader navigationItems={drumkitNavigationItems} />

      <section className="case-hero" id="case-hero">
        <div className="case-hero-media">
          <div className="case-hero-image-frame">
            <ProgressiveImage
              src={drumkitPreview}
              alt="Drumkit landing page on a laptop"
              fill
              loading="eager"
              fetchPriority="high"
            />
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
            aspectRatio: "4 / 3",
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
          loadLottie={loadDrumkitSlide6}
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
          loadLottie={loadDrumkitSlide7}
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
          loadLottie={loadDrumkitSlide8}
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
