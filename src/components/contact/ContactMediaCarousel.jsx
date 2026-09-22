import { useEffect, useRef } from "react";

import showreel from "../../assets/contact/Showreel.webm";
import showreelPoster from "../../assets/contact/Showreel.jpg";

export function ContactMediaCarousel() {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      video.pause();
      return;
    }

    const playback = video.play();
    if (playback?.catch) {
      playback.catch(() => {});
    }
  }, []);

  return (
    <div className="contact-media-carousel">
      <video
        ref={videoRef}
        className="contact-media-video"
        src={showreel}
        poster={showreelPoster}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />
    </div>
  );
}
