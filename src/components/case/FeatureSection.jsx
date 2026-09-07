import { ProgressiveImage } from "../media/ProgressiveImage.jsx";
import { LottiePlayer } from "../media/LottiePlayer.jsx";
import { InfoBlock } from "./InfoBlock.jsx";

export function FeatureSection({ id, title, mediaSrc, loadLottie, items }) {
  return (
    <section className="feature-section" id={id}>
      <h3>{title}</h3>
      {loadLottie ? (
        <div className="case-media feature-media case-media-lottie">
          <LottiePlayer
            loadAnimation={loadLottie}
            playMode="visible"
            aspectRatio="664 / 476"
          />
        </div>
      ) : mediaSrc ? (
        <div className="case-media feature-media">
          <ProgressiveImage src={mediaSrc} alt="" fill />
        </div>
      ) : null}
      <div className="feature-grid">
        {items.map(([label, body]) => (
          <InfoBlock key={label} eyebrow={`[ ${label.toUpperCase()} ]`} body={body} />
        ))}
      </div>
    </section>
  );
}
