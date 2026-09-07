import { ProgressiveImage } from "../media/ProgressiveImage.jsx";

export function CaseNavigationSlider({ navigationItems }) {
  return (
    <nav className="case-nav-slider" aria-label="Case page position">
      <div className="case-nav-panel case-nav-panel-left">
        <ThumbnailTrack baseOffset={118} navigationItems={navigationItems} />
      </div>
      <div className="case-nav-panel case-nav-panel-right">
        <ThumbnailTrack baseOffset={-56} navigationItems={navigationItems} />
      </div>
    </nav>
  );
}

function ThumbnailTrack({ baseOffset, navigationItems }) {
  return (
    <div className="case-nav-track" data-base-offset={baseOffset} style={{ transform: `translateX(${baseOffset}px)` }}>
      {navigationItems.map((item, index) => (
        <a
          className={Array.isArray(item.src) ? "case-nav-thumb case-nav-thumb-combined" : "case-nav-thumb"}
          href={item.href}
          key={`${item.href}-${index}`}
          aria-label={item.label}
        >
          {Array.isArray(item.src) ? (
            item.src.map((src) => <NavThumbMedia key={src} src={src} />)
          ) : (
            <NavThumbMedia src={item.src} />
          )}
        </a>
      ))}
    </div>
  );
}

function NavThumbMedia({ src }) {
  return src.endsWith(".mp4") ? (
    <video src={src} muted playsInline />
  ) : (
    <ProgressiveImage src={src} alt="" fill />
  );
}
