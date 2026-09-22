import { ProgressiveImage } from "./ProgressiveImage.jsx";
import { MockupPlayer } from "./MockupPlayer.jsx";
import { LottiePlayer } from "./LottiePlayer.jsx";
import { CaseVideo } from "./CaseVideo.jsx";

export function MediaBlock({
  id,
  type = "image",
  src,
  poster,
  caption,
  variant,
  mockup,
  loadAnimation,
  aspectRatio,
}) {
  return (
    <figure className="case-media-block" id={id}>
      <div
        className={[
          "case-media",
          variant === "wide" ? "case-media-wide" : "",
          type === "mockup" ? "case-media-mockup" : "",
          type === "lottie" ? "case-media-lottie-slot" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {type === "mockup" ? (
          <MockupPlayer {...mockup} />
        ) : type === "lottie" ? (
          <LottiePlayer
            loadAnimation={loadAnimation}
            playMode="visible"
            aspectRatio={aspectRatio || "4 / 3"}
            poster={src || poster}
          />
        ) : type === "video" ? (
          <CaseVideo src={src} poster={poster} expandable />
        ) : (
          <ProgressiveImage src={src} alt="" fill expandable />
        )}
      </div>
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}
