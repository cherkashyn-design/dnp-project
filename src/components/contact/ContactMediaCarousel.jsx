import { useEffect, useRef } from "react";

import showreel from "../../assets/contact/Showreel.webm";
import showreelPoster from "../../assets/contact/Showreel.jpg";

function tryPlay(video) {
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
}

export function ContactMediaCarousel() {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return undefined;
    }

    tryPlay(video);

    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        tryPlay(video);
      }
    };

    const onReady = () => tryPlay(video);

    document.addEventListener("visibilitychange", onVisibility);
    video.addEventListener("loadeddata", onReady);
    video.addEventListener("canplay", onReady);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      video.removeEventListener("loadeddata", onReady);
      video.removeEventListener("canplay", onReady);
    };
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
