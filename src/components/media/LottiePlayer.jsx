import { useEffect, useRef, useState } from "react";
import { Lottie, LottieSubscription } from "lottie-react";
import { loadLottieCached } from "../../lib/lottieCache.js";

export function LottiePlayer({
  loadAnimation,
  playMode = "visible",
  enabled = true,
  aspectRatio: aspectRatioProp = "336 / 538",
}) {
  const containerRef = useRef(null);
  const lottieRef = useRef(null);
  const playingThroughRef = useRef(false);
  const scrollIdleTimerRef = useRef(null);
  const inViewRef = useRef(false);
  const isScrollingRef = useRef(false);
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

    const loadObserver = new IntersectionObserver(
      ([entry]) => {
        setInLoadRange(entry.isIntersecting);
      },
      { rootMargin: "400px 0px", threshold: 0 },
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

        if (visible && !isScrollingRef.current) {
          animation.play();
        } else {
          animation.pause();
        }
      },
      { rootMargin: "0px", threshold: 0.2 },
    );

    loadObserver.observe(element);
    viewObserver.observe(element);

    return () => {
      loadObserver.disconnect();
      viewObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    const syncPlayback = () => {
      const animation = lottieRef.current;
      if (!animation || isHoverModeRef.current) {
        return;
      }

      if (inViewRef.current && !isScrollingRef.current) {
        animation.play();
      } else {
        animation.pause();
      }
    };

    const onScroll = () => {
      if (!isScrollingRef.current) {
        isScrollingRef.current = true;
        lottieRef.current?.pause();
      }

      if (scrollIdleTimerRef.current !== null) {
        window.clearTimeout(scrollIdleTimerRef.current);
      }

      scrollIdleTimerRef.current = window.setTimeout(() => {
        isScrollingRef.current = false;
        scrollIdleTimerRef.current = null;
        syncPlayback();
      }, 140);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (scrollIdleTimerRef.current !== null) {
        window.clearTimeout(scrollIdleTimerRef.current);
      }
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
    if (!animation || playingThroughRef.current || isScrollingRef.current) {
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
              if (shouldAutoplay && !isScrollingRef.current) {
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
      ) : (
        <div className="lottie-player-placeholder" aria-hidden="true" />
      )}
    </div>
  );
}
