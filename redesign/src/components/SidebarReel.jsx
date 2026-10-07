export function SidebarReel({ background, cards }) {
  const loop = [...cards, ...cards];

  return (
    <div className="case-marquee" data-ink>
      <img className="case-marquee-bg" src={background} alt="" />
      <div className="case-marquee-viewport">
        <div className="case-marquee-track">
          {loop.map((card, index) => (
            <img key={`${card}-${index}`} src={card} alt="" />
          ))}
        </div>
      </div>
    </div>
  );
}
