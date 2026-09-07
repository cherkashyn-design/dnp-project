import { ProjectCard } from "../ProjectCard.jsx";
import { cases } from "../../data/site.js";

export function OtherProjectsSection({ currentHref }) {
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
