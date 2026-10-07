import { SoftImage } from "./SoftMedia.jsx";

export function SidebarReel({ background, cards }) {
  const loop = [...cards, ...cards];

  return (
    <div className="case-marquee" data-ink>
      <SoftImage className="case-marquee-bg" src={background} alt="" />
      <div className="case-marquee-viewport">
        <div className="case-marquee-track">
          {loop.map((card, index) => (
            <SoftImage key={`${card}-${index}`} src={card} alt="" />
          ))}
        </div>
      </div>
    </div>
  );
}
