import arrowUpRightIcon from "../../assets/icons/link-icon.svg";
import quoteIcon from "../../assets/icons/quote-icon.svg";
import { ProgressiveImage } from "../../components/media/ProgressiveImage.jsx";
import { MediaBlock } from "../../components/media/MediaBlock.jsx";
import { CaseHeader } from "../../components/case/CaseHeader.jsx";
import { InfoBlock } from "../../components/case/InfoBlock.jsx";
import { StatsSection } from "../../components/case/StatsSection.jsx";
import { OtherProjectsSection } from "../../components/case/OtherProjectsSection.jsx";
import {
  PortfolioCaseSection,
  createCaseNavigationItems,
} from "../../components/case/PortfolioCaseSection.jsx";
import { useScrollZoomMedia } from "../../hooks/useScrollZoomMedia.js";
import { useRevealAnimations } from "../../hooks/useRevealAnimations.js";
import { useCaseNavScroll } from "../../hooks/useCaseNavScroll.js";
import "../../lib/portfolioLq.js";

export default function PortfolioCasePage({ project }) {
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
            <ProgressiveImage
              src={project.heroImage}
              alt={project.heroAlt}
              fill
              loading="eager"
              fetchPriority="high"
            />
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
