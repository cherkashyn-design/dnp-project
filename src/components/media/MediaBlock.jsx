import { ProgressiveImage } from "./ProgressiveImage.jsx";
import { MockupPlayer } from "./MockupPlayer.jsx";
import { LottiePlayer } from "./LottiePlayer.jsx";

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
          <video src={src} poster={poster} autoPlay muted loop playsInline />
        ) : (
          <ProgressiveImage src={src} alt="" fill />
        )}
      </div>
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}
