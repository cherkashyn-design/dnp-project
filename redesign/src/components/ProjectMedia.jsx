import { BASE } from "../base.js";
import { RingproofCover } from "./RingproofCover.jsx";
import { SoftImage } from "./SoftMedia.jsx";

/** What a project card shows: the project's picture, or its animated cover if it has one. */
export function ProjectMedia({ project }) {
  if (project.cover === "ringproof") return <RingproofCover />;
  return <SoftImage src={project.image} alt="" />;
}

/**
 * One slide of the Ringproof case, running live in a frame (the files in public/ringproof).
 * The poster picture lies under the frame until it has loaded. Only interactive slides take the pointer.
 */
export function LiveSlide({ slide, poster, label, interactive = false }) {
  return (
    <span className={`media-shell is-ready live-slide${interactive ? " is-interactive" : ""}`}>
      {poster ? <img src={poster} alt="" loading="lazy" decoding="async" /> : null}
      <iframe
        src={`${BASE}/ringproof/case.html?only=${slide}&embed`}
        title={label || "Ringproof"}
        loading="lazy"
        tabIndex={interactive ? 0 : -1}
      />
    </span>
  );
}
