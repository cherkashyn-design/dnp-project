import { MediaBlock } from "../media/MediaBlock.jsx";

export function getMediaRowId(section, rowIndex) {
  return `${section.id}-row-${rowIndex + 1}`;
}

export function createCaseNavigationItems(project) {
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

export function PortfolioCaseSection({ section }) {
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
