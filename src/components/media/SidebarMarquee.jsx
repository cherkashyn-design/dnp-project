import { ProgressiveImage } from "./ProgressiveImage.jsx";

export function SidebarMarquee({ id, background, cards, caption }) {
  const loopCards = [...cards, ...cards];

  return (
    <figure className="case-media-block" id={id}>
      <div className="case-media case-media-marquee">
        <ProgressiveImage className="marquee-bg" src={background} alt="" fill />
        <div className="marquee-viewport">
          <div className="marquee-track">
            {loopCards.map((card, index) => (
              <div className="marquee-card" key={`${card}-${index}`}>
                <ProgressiveImage src={card} alt="" fill />
              </div>
            ))}
          </div>
        </div>
      </div>
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}
