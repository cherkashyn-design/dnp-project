import arrowRightIcon from "../assets/icons/arrow-right-icon.svg";
import { ProgressiveImage } from "./media/ProgressiveImage.jsx";

export function ProjectCard({ project, priority = false }) {
  const content = (
    <>
      <div className="project-image-wrap">
        <ProgressiveImage
          className="project-image"
          src={project.image}
          lqSrc={project.lqImage}
          alt={`${project.name} preview`}
          fill
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
        />
      </div>
      <div className="project-info">
        <div className="project-title-row">
          <img className="project-hover-arrow" src={arrowRightIcon} alt="" aria-hidden="true" />
          <h2>{project.name}</h2>
        </div>
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
