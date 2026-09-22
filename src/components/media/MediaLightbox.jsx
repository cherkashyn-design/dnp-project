import { useEffect } from "react";
import { createPortal } from "react-dom";

export function MediaLightbox({ type = "image", src, poster, alt = "", onClose }) {
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  return createPortal(
    <div className="media-lightbox" role="dialog" aria-modal="true" aria-label="Fullscreen media">
      <button type="button" className="media-lightbox-backdrop" aria-label="Close" onClick={onClose} />
      <button type="button" className="media-lightbox-close" aria-label="Close" onClick={onClose}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M6.4 6.4l11.2 11.2M17.6 6.4L6.4 17.6"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      </button>
      <div className="media-lightbox-stage">
        {type === "video" ? (
          <video
            className="media-lightbox-media"
            src={src}
            poster={poster}
            controls
            autoPlay
            muted
            playsInline
            loop
          />
        ) : (
          <img className="media-lightbox-media" src={src} alt={alt} />
        )}
      </div>
    </div>,
    document.body,
  );
}
