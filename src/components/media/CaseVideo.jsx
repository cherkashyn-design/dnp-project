import { useEffect, useId, useRef, useState } from "react";

import { MediaLightbox } from "./MediaLightbox.jsx";
import {
  beginCaseVideoLightbox,
  endCaseVideoLightbox,
  getCaseVideoPolicy,
  registerCaseVideo,
  reportCaseVideoRatio,
} from "../../lib/caseVideoCoordinator.js";

const LOAD_MARGIN_PX = 400;

function isNearViewport(element, marginPx) {
  const rect = element.getBoundingClientRect();
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
  return rect.bottom >= -marginPx && rect.top <= viewportHeight + marginPx;
}

function tryPlay(video) {
  if (!video) {
    return;
  }
  const playback = video.play();
  if (playback && typeof playback.catch === "function") {
    playback.catch(() => {});
  }
}

/**
 * Case study video with Lottie-style memory guards:
 * - load only near viewport
 * - unload when far / inactive / lightbox open / reduced motion
 * - on ≤500px, at most one case video decodes at a time
 * - optional `srcMobile` for lighter encodes on narrow viewports
 */
export function CaseVideo({ src, srcMobile, poster, expandable = false }) {
  const reactId = useId();
  const idRef = useRef(Symbol(reactId));
  const shellRef = useRef(null);
  const videoRef = useRef(null);

  const [nearViewport, setNearViewport] = useState(false);
  const [policy, setPolicy] = useState(() => getCaseVideoPolicy(idRef.current));
  const [ready, setReady] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const activeSrc = policy.mobile && srcMobile ? srcMobile : src;
  const shouldAttach = Boolean(activeSrc) && nearViewport && policy.allowLoad;
  const showPosterFallback = Boolean(poster) && (!shouldAttach || policy.reducedMotion);
  const showSkeleton = shouldAttach && !ready;

  useEffect(() => {
    const id = idRef.current;
    return registerCaseVideo(id, () => {
      setPolicy(getCaseVideoPolicy(id));
    });
  }, []);

  useEffect(() => {
    const element = shellRef.current;
    if (!element) {
      return undefined;
    }

    const id = idRef.current;

    const syncNear = () => {
      const near = isNearViewport(element, LOAD_MARGIN_PX);
      setNearViewport((current) => (current === near ? current : near));
    };

    // Proximity → decide whether src may attach.
    const loadObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNearViewport(true);
        } else {
          syncNear();
        }
      },
      { rootMargin: `${LOAD_MARGIN_PX}px 0px`, threshold: 0 },
    );

    // Real viewport ratio → mobile single-active picker (no rootMargin).
    const viewObserver = new IntersectionObserver(
      ([entry]) => {
        reportCaseVideoRatio(id, entry.isIntersecting ? entry.intersectionRatio : 0);
      },
      { rootMargin: "0px", threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] },
    );

    loadObserver.observe(element);
    viewObserver.observe(element);
    syncNear();

    window.addEventListener("scroll", syncNear, { passive: true });
    window.addEventListener("resize", syncNear);

    return () => {
      loadObserver.disconnect();
      viewObserver.disconnect();
      window.removeEventListener("scroll", syncNear);
      window.removeEventListener("resize", syncNear);
      reportCaseVideoRatio(id, 0);
    };
  }, []);

  useEffect(() => {
    setReady(false);
  }, [activeSrc, shouldAttach]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return undefined;
    }

    if (!shouldAttach) {
      video.pause();
      video.removeAttribute("src");
      video.load();
      setReady(false);
      return undefined;
    }

    if (video.getAttribute("src") !== activeSrc) {
      video.src = activeSrc;
      video.load();
    }

    if (policy.allowPlay) {
      tryPlay(video);
    } else {
      video.pause();
    }

    return undefined;
  }, [activeSrc, shouldAttach, policy.allowPlay]);

  useEffect(() => {
    if (!lightboxOpen) {
      return undefined;
    }
    beginCaseVideoLightbox();
    return () => endCaseVideoLightbox();
  }, [lightboxOpen]);

  const markReady = () => setReady(true);

  const openLightbox = () => {
    if (expandable && activeSrc) {
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
        ref={shellRef}
        className={[
          "case-video-shell",
          ready && shouldAttach ? "is-ready" : "",
          expandable ? "is-expandable" : "",
          showPosterFallback ? "has-poster-fallback" : "",
          showSkeleton ? "is-loading" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        role={expandable ? "button" : undefined}
        tabIndex={expandable ? 0 : undefined}
        aria-label={expandable ? "View video fullscreen" : undefined}
        onClick={expandable ? openLightbox : undefined}
        onKeyDown={expandable ? onKeyDown : undefined}
      >
        {showSkeleton ? (
          <div className="case-video-skeleton" aria-hidden="true">
            <span className="case-video-skeleton-shine" />
          </div>
        ) : null}
        {showPosterFallback ? (
          <img
            className="case-video-poster"
            src={poster}
            alt=""
            decoding="async"
            draggable={false}
          />
        ) : null}
        <video
          ref={videoRef}
          poster={poster}
          muted
          loop
          playsInline
          preload="none"
          onLoadedData={markReady}
          onCanPlay={markReady}
          onPlaying={markReady}
        />
      </div>
      {lightboxOpen ? (
        <MediaLightbox
          type="video"
          src={activeSrc}
          poster={poster}
          onClose={() => setLightboxOpen(false)}
        />
      ) : null}
    </>
  );
}
