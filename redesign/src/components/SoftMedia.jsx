import { forwardRef, useEffect, useRef, useState } from "react";

import { mediaLooksDark, resolveInkMode, setInkSurface } from "../inkSurface.js";

function Skeleton() {
  return (
    <span className="media-skeleton" aria-hidden="true">
      <span className="media-skeleton-shine" />
    </span>
  );
}

function applyInk(shell, media, ink) {
  if (!shell) return;
  const mode = resolveInkMode(ink);
  if (mode === "force-on") {
    setInkSurface(shell, true);
    return;
  }
  if (mode === "force-off") {
    setInkSurface(shell, false);
    return;
  }
  setInkSurface(shell, media ? mediaLooksDark(media) : false);
}

export const SoftImage = forwardRef(function SoftImage(
  { src, alt = "", className = "", ink, onLoad, onError, decoding = "async", ...props },
  ref,
) {
  const shellRef = useRef(null);
  const imgRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(false);
    const img = imgRef.current;
    if (img?.complete && img.naturalWidth > 0) {
      setReady(true);
      applyInk(shellRef.current, img, ink);
      return;
    }
    // Until the bitmap is readable, only forced-on media count as ink.
    applyInk(shellRef.current, null, resolveInkMode(ink) === "force-on" ? true : false);
  }, [src, ink]);

  return (
    <span
      ref={(node) => {
        shellRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      }}
      className={`media-shell${ready ? " is-ready" : " is-loading"}${className ? ` ${className}` : ""}`}
    >
      {!ready ? <Skeleton /> : null}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        decoding={decoding}
        onLoad={(event) => {
          setReady(true);
          applyInk(shellRef.current, event.currentTarget, ink);
          onLoad?.(event);
        }}
        onError={(event) => {
          setReady(true);
          applyInk(shellRef.current, null, false);
          onError?.(event);
        }}
        {...props}
      />
    </span>
  );
});

export const SoftVideo = forwardRef(function SoftVideo(
  { className = "", ink, onCanPlay, onLoadedData, poster, ...props },
  ref,
) {
  const shellRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(false);
    applyInk(shellRef.current, null, resolveInkMode(ink) === "force-on" ? true : false);
  }, [props.src, poster, ink]);

  const markReady = (video) => {
    setReady(true);
    applyInk(shellRef.current, video, ink);
  };

  return (
    <span
      ref={shellRef}
      className={`media-shell${ready ? " is-ready" : " is-loading"}${className ? ` ${className}` : ""}`}
    >
      {!ready ? <Skeleton /> : null}
      <video
        ref={ref}
        poster={poster}
        onLoadedData={(event) => {
          markReady(event.currentTarget);
          onLoadedData?.(event);
        }}
        onCanPlay={(event) => {
          markReady(event.currentTarget);
          onCanPlay?.(event);
        }}
        onError={() => {
          setReady(true);
          applyInk(shellRef.current, null, false);
        }}
        {...props}
      />
    </span>
  );
});
