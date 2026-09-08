import { useEffect, useRef, useState } from "react";

const lqByFullUrl = new Map();

export function registerLqMap(entries) {
  for (const [fullUrl, lqUrl] of entries) {
    lqByFullUrl.set(fullUrl, lqUrl);
  }
}

export function getLqSrc(src) {
  return lqByFullUrl.get(src);
}

/* Progressive LQ + deferred full-image load. Flip to false to disable. */
const ENABLE_PROGRESSIVE_LOADING = true;

export function ProgressiveImage({
  src,
  lqSrc: lqSrcProp,
  alt = "",
  className = "",
  style,
  decoding = "async",
  loading,
  fetchPriority,
  rootMargin = "800px 0px",
  /** When true, fill a sized parent instead of reserving aspect-ratio locally. */
  fill = false,
  /** Used when fill is false to reserve layout space before the image loads. */
  aspectRatio = "4 / 3",
  ...props
}) {
  const wantsEager = loading === "eager" || fetchPriority === "high";
  // Skip LQ on eager/hero images — blur under a fading full image doubles soft dark edges.
  const lqSrc =
    ENABLE_PROGRESSIVE_LOADING && !wantsEager ? (lqSrcProp ?? getLqSrc(src)) : undefined;
  const rootRef = useRef(null);
  const fullRef = useRef(null);
  const loadEager = !ENABLE_PROGRESSIVE_LOADING || wantsEager;
  const [activeSrc, setActiveSrc] = useState(loadEager ? src : undefined);
  const [loaded, setLoaded] = useState(Boolean(loadEager && !lqSrc));

  useEffect(() => {
    setActiveSrc(loadEager ? src : undefined);
    setLoaded(Boolean(loadEager && !lqSrc));
  }, [src, lqSrc, loadEager]);

  useEffect(() => {
    if (loadEager || activeSrc === src) {
      return undefined;
    }

    const node = rootRef.current;
    if (!node) {
      return undefined;
    }

    if (typeof IntersectionObserver === "undefined") {
      setActiveSrc(src);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setActiveSrc(src);
          observer.disconnect();
        }
      },
      { rootMargin, threshold: 0.01 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [src, loadEager, activeSrc, rootMargin]);

  useEffect(() => {
    if (!activeSrc) {
      return undefined;
    }

    const image = fullRef.current;
    if (image?.complete && image.naturalWidth > 0) {
      setLoaded(true);
    }

    return undefined;
  }, [activeSrc, lqSrc]);

  return (
    <span
      ref={rootRef}
      className={[
        "progressive-image",
        fill ? "is-fill" : "",
        loaded ? "is-loaded" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        ...style,
        ...(!fill && aspectRatio ? { aspectRatio } : null),
      }}
    >
      <span className="progressive-image-placeholder" aria-hidden="true" />
      {lqSrc ? (
        <img className="progressive-image-lq" src={lqSrc} alt="" aria-hidden="true" decoding="async" />
      ) : null}
      {activeSrc ? (
        <img
          ref={fullRef}
          className="progressive-image-full"
          src={activeSrc}
          alt={alt}
          decoding={decoding}
          loading={loadEager ? "eager" : "lazy"}
          fetchPriority={fetchPriority}
          onLoad={() => setLoaded(true)}
          {...props}
        />
      ) : null}
    </span>
  );
}
