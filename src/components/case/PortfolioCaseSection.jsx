import { MediaBlock } from "../media/MediaBlock.jsx";

export function getMediaRowId(section, rowIndex) {
  return `${section.id}-row-${rowIndex + 1}`;
}

export function createCaseNavigationItems(project) {
  const mediaItems = project.sections.flatMap((section) => {
    if (section.tabs?.length) {
      return [
        {
          href: `#${section.id}`,
          label: section.title,
          src: section.tabs[0].src,
        },
      ];
    }

    return section.mediaRows.map((row, rowIndex) => ({
      href: row.length === 1 ? `#${row[0].id}` : `#${getMediaRowId(section, rowIndex)}`,
      label: row.length === 1 ? row[0].caption : `${section.title} images ${rowIndex + 1}`,
      src:
        row.length === 1
          ? row[0].poster || row[0].src
          : row.map((media) => media.poster || media.src),
    }));
  });

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

      {section.kicker ? <h3 className="case-section-kicker">{section.kicker}</h3> : null}

      {section.mediaRows.map((row, rowIndex) =>
        row.length === 1 ? (
          <MediaBlock
            key={row[0].id}
            id={row[0].id}
            type={row[0].type || "image"}
            src={row[0].src}
            poster={row[0].poster}
            caption={row[0].caption}
            loadAnimation={row[0].loadAnimation}
            aspectRatio={row[0].aspectRatio}
            mockup={row[0].mockup}
          />
        ) : (
          <div className="media-grid" id={getMediaRowId(section, rowIndex)} key={getMediaRowId(section, rowIndex)}>
            {row.map((media) => (
              <MediaBlock
                key={media.id}
                id={media.id}
                type={media.type || "image"}
                src={media.src}
                poster={media.poster}
                caption={media.caption}
                loadAnimation={media.loadAnimation}
                aspectRatio={media.aspectRatio}
                mockup={media.mockup}
              />
            ))}
          </div>
        ),
      )}
    </section>
  );
}
