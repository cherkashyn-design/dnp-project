import { useEffect, useRef, useState } from "react";

export function CaseVideo({ src, poster }) {
  const videoRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(false);
    const video = videoRef.current;
    if (video && video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      setReady(true);
    }
  }, [src]);

  const markReady = () => setReady(true);

  return (
    <div
      className={["case-video-shell", ready ? "is-ready" : ""].filter(Boolean).join(" ")}
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
  );
}
