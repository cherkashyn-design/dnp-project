import { useEffect, useRef, useState } from "react";

import { MediaLightbox } from "./MediaLightbox.jsx";

export function CaseVideo({ src, poster, expandable = false }) {
  const videoRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    setReady(false);
    const video = videoRef.current;
    if (video && video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      setReady(true);
    }
  }, [src]);

  const markReady = () => setReady(true);

  const openLightbox = () => {
    if (expandable && src) {
      setLightboxOpen(true);
    }
  };

  const onKeyDown = (event) => {
    if (!expandable) {
      return;
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openLightbox();
    }
  };

  return (
    <>
      <div
        className={[
          "case-video-shell",
          ready ? "is-ready" : "",
          expandable ? "is-expandable" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        role={expandable ? "button" : undefined}
        tabIndex={expandable ? 0 : undefined}
        aria-label={expandable ? "View video fullscreen" : undefined}
        onClick={expandable ? openLightbox : undefined}
        onKeyDown={expandable ? onKeyDown : undefined}
      >
        <div className="case-video-skeleton" aria-hidden={ready}>
          <span className="case-video-skeleton-shine" />
        </div>
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          onLoadedData={markReady}
          onCanPlay={markReady}
          onPlaying={markReady}
        />
      </div>
      {lightboxOpen ? (
        <MediaLightbox
          type="video"
          src={src}
          poster={poster}
          onClose={() => setLightboxOpen(false)}
        />
      ) : null}
    </>
  );
}
