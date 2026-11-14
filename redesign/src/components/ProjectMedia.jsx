import { BASE } from "../base.js";
import { RingproofCover } from "./RingproofCover.jsx";
import { SoftImage } from "./SoftMedia.jsx";

/** What a project card shows: the project's picture, or its animated cover if it has one. */
export function ProjectMedia({ project }) {
  if (project.cover === "ringproof") return <RingproofCover />;
  if (project.cover === "wardgrid") return <WardgridCover poster={project.image} />;
  return <SoftImage src={project.image} alt="" />;
}

/**
 * One slide of a concept case, running live in a frame (the files in public/<folder>: ringproof, wardgrid).
 * The poster picture lies under the frame until it has loaded. Only interactive slides take the pointer.
 */
export function LiveSlide({ slide, poster, label, interactive = false, folder = "ringproof" }) {
  return (
    <span className={`media-shell is-ready live-slide${interactive ? " is-interactive" : ""}`}>
      {poster ? <img src={poster} alt="" loading="lazy" decoding="async" /> : null}
      <iframe
        src={`${BASE}/${folder}/case.html?only=${slide}&embed`}
        title={label || folder}
        loading="lazy"
        tabIndex={interactive ? 0 : -1}
      />
    </span>
  );
}

/**
 * Animated cover of the Wardgrid case: its "Take this shift" slide (0.1) running live and filling the frame,
 * whatever the frame's shape. The picture lies underneath until the frame has loaded, and is what a card shows
 * to someone who asked for less motion (the slide itself then stands still).
 */
export function WardgridCover({ poster }) {
  return (
    <span className="media-shell is-ready wg-cover">
      {poster ? <img src={poster} alt="" loading="lazy" decoding="async" /> : null}
      <iframe src={`${BASE}/wardgrid/case.html?only=0.1&embed&cover`} title="Wardgrid: an open shift is taken" loading="lazy" tabIndex={-1} />
    </span>
  );
}
