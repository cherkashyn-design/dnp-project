import { useEffect, useRef, useState } from "react";
import { Lottie } from "lottie-react";

import { loadLottieCached } from "../lottieCache.js";

export function LottieFrame({
  load,
  label,
  className = "case-lottie",
  enabled = true,
}) {
  const frameRef = useRef(null);
  const [inLoadRange, setInLoadRange] = useState(false);
  const [inView, setInView] = useState(false);
  const [data, setData] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const node = frameRef.current;
    if (!node) return undefined;

    const loadObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInLoadRange(true);
      },
      { rootMargin: "240px 0px", threshold: 0 },
    );

    const viewObserver = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "0px", threshold: 0.2 },
    );

    loadObserver.observe(node);
    viewObserver.observe(node);
    return () => {
      loadObserver.disconnect();
      viewObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!enabled || !inLoadRange || !load) {
      if (!enabled) {
        setData(null);
        setFailed(false);
      }
      return undefined;
    }

    let cancelled = false;
    loadLottieCached(load)
      .then((next) => {
        if (!cancelled) {
          setData(next);
          setFailed(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setData(null);
          setFailed(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [enabled, inLoadRange, load]);

  const mounted = Boolean(enabled && data);
  const showSkeleton = enabled && !mounted && !failed;

  return (
    <div
      className={`media-shell${showSkeleton ? " is-loading" : " is-ready"} ${className}`.trim()}
      ref={frameRef}
      role="img"
      aria-label={label}
      aria-busy={showSkeleton}
    >
      {showSkeleton ? (
        <span className="media-skeleton" aria-hidden="true">
          <span className="media-skeleton-shine" />
        </span>
      ) : null}
      {mounted ? <Lottie src={data} autoplay={inView} loop /> : null}
    </div>
  );
}
