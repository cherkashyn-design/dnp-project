import { ProgressiveImage } from "./ProgressiveImage.jsx";
import { MockupPlayer } from "./MockupPlayer.jsx";

export function MediaBlock({ id, type, src, poster, caption, variant, mockup }) {
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
          <ProgressiveImage src={src} alt="" fill />
        )}
      </div>
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}
