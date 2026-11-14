import { appHref } from "../base.js";
import { ProjectMedia } from "../components/ProjectMedia.jsx";
import { cases } from "../data/cases.js";
import { ContactSection } from "../components/ContactSection.jsx";

const listingOrder = [
  "ringproof",
  "drumkit-logistic-saas",
  "yummo-food-guide-for-moms",
  "sales-driver-ads-tool",
  "nodity",
];

export function CasesPage({ onNavigate }) {
  const listed = listingOrder
    .map((slug) => cases.find((item) => item.slug === slug))
    .filter(Boolean);

  const open = (event, href) => {
    event.preventDefault();
    onNavigate(href);
  };

  return (
    <>
      <section className="cases-hero">
        <div className="cases-hero-copy">
          <h1>Cases</h1>
          <p>Product, brand, and landing work from Do Not Press studio.</p>
        </div>
      </section>
      <section className="cases-list" aria-label="Cases">
        <div className="cases-rule" />
        <div className="project-grid">
          {listed.map((project) => (
            <a
              className="project-card"
              data-reveal
              href={appHref(`/cases/${project.slug}`)}
              key={project.slug}
              onClick={(event) => open(event, `/cases/${project.slug}`)}
            >
              <ProjectMedia project={project} />
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
      <ContactSection />
    </>
  );
}
