import { useEffect, useRef, useState } from "react";
import { Lottie, LottieSubscription } from "lottie-react";
import { loadLottieCached } from "../../lib/lottieCache.js";

function isNearViewport(element, marginPx) {
  const rect = element.getBoundingClientRect();
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
  return rect.bottom >= -marginPx && rect.top <= viewportHeight + marginPx;
}

function isMostlyVisible(element, ratio) {
  const rect = element.getBoundingClientRect();
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
  const visibleTop = Math.max(rect.top, 0);
  const visibleBottom = Math.min(rect.bottom, viewportHeight);
  const visibleHeight = Math.max(0, visibleBottom - visibleTop);
  return visibleHeight / Math.max(rect.height, 1) >= ratio;
}

export function LottiePlayer({
  loadAnimation,
  playMode = "visible",
  enabled = true,
  aspectRatio: aspectRatioProp = "336 / 538",
  poster,
}) {
  const containerRef = useRef(null);
  const lottieRef = useRef(null);
  const playingThroughRef = useRef(false);
  const inViewRef = useRef(false);
  const isHoverModeRef = useRef(false);
  const [inLoadRange, setInLoadRange] = useState(false);
  const [inView, setInView] = useState(false);
  const [hoverCapable, setHoverCapable] = useState(false);
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    const hoverQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    const widthQuery = window.matchMedia("(min-width: 501px)");

    const updateHoverCapable = () => {
      setHoverCapable(hoverQuery.matches && widthQuery.matches);
    };

    updateHoverCapable();
    hoverQuery.addEventListener("change", updateHoverCapable);
    widthQuery.addEventListener("change", updateHoverCapable);

    return () => {
      hoverQuery.removeEventListener("change", updateHoverCapable);
      widthQuery.removeEventListener("change", updateHoverCapable);
    };
  }, []);

  const isHoverMode = playMode === "hover" && hoverCapable;
  isHoverModeRef.current = isHoverMode;

  useEffect(() => {
    const element = containerRef.current;
    if (!element) {
      return undefined;
    }

    const LOAD_MARGIN = 400;
    const VIEW_RATIO = 0.2;

    const syncVisibility = () => {
      const near = isNearViewport(element, LOAD_MARGIN);
      // Keep loaded once near — avoids unload/reload thrash while scrolling.
      if (near) {
        setInLoadRange(true);
      }

      const visible = isMostlyVisible(element, VIEW_RATIO);
      inViewRef.current = visible;
      setInView(visible);

      const animation = lottieRef.current;
      if (!animation || isHoverModeRef.current) {
        return;
      }

      if (visible) {
        animation.play();
      }
      // Keep playing while scrolling away; only pause when far from viewport.
      else if (!isNearViewport(element, 0)) {
        animation.pause();
      }
    };

    const loadObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInLoadRange(true);
        }
      },
      { rootMargin: `${LOAD_MARGIN}px 0px`, threshold: 0 },
    );

    const viewObserver = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting;
        inViewRef.current = visible;
        setInView(visible);

        const animation = lottieRef.current;
        if (!animation || isHoverModeRef.current) {
          return;
        }

        if (visible) {
          animation.play();
        }
      },
      { rootMargin: "0px", threshold: VIEW_RATIO },
    );

    loadObserver.observe(element);
    viewObserver.observe(element);
    syncVisibility();

    window.addEventListener("scroll", syncVisibility, { passive: true });
    window.addEventListener("resize", syncVisibility);

    return () => {
      loadObserver.disconnect();
      viewObserver.disconnect();
      window.removeEventListener("scroll", syncVisibility);
      window.removeEventListener("resize", syncVisibility);
    };
  }, []);

  useEffect(() => {
    if (!enabled || !inLoadRange || !loadAnimation) {
      if (!enabled) {
        setAnimationData(null);
      }
      return undefined;
    }

    let cancelled = false;

    loadLottieCached(loadAnimation)
      .then((data) => {
        if (!cancelled) {
          setAnimationData(data);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setAnimationData(null);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [enabled, inLoadRange, loadAnimation]);

  const shouldMount = Boolean(enabled && animationData && inLoadRange);
  const shouldAutoplay = shouldMount && !isHoverMode && inView;

  const playHoverCycle = () => {
    const animation = lottieRef.current;
    if (!animation || playingThroughRef.current) {
      return;
    }

    playingThroughRef.current = true;
    animation.seek(0);
    animation.play();
  };

  return (
    <div
      className={["lottie-player", shouldMount ? "is-mounted" : ""].filter(Boolean).join(" ")}
      ref={containerRef}
      style={{ aspectRatio: aspectRatioProp }}
      onMouseEnter={() => {
        if (isHoverMode) {
          playHoverCycle();
        }
      }}
    >
      {poster && !shouldMount ? (
        <img className="lottie-player-poster" src={poster} alt="" decoding="async" />
      ) : null}
      {shouldMount ? (
        <Lottie
          key={`${isHoverMode ? "hover" : "auto"}-${enabled}`}
          lottieRef={lottieRef}
          src={animationData}
          loop={!isHoverMode}
          autoplay={shouldAutoplay}
          style={{ width: "100%", height: "100%" }}
          subscriptions={{
            [LottieSubscription.ready]: () => {
              if (shouldAutoplay || inViewRef.current) {
                lottieRef.current?.play();
              } else if (!isHoverMode) {
                lottieRef.current?.pause();
              }
            },
            [LottieSubscription.complete]: () => {
              playingThroughRef.current = false;
            },
          }}
        />
      ) : poster ? null : (
        <div className="lottie-player-placeholder" aria-hidden="true" />
      )}
    </div>
  );
}
