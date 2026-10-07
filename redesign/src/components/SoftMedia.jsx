import { forwardRef, useEffect, useRef, useState } from "react";

function Skeleton() {
  return (
    <span className="media-skeleton" aria-hidden="true">
      <span className="media-skeleton-shine" />
    </span>
  );
}

export const SoftImage = forwardRef(function SoftImage(
  { src, alt = "", className = "", onLoad, onError, decoding = "async", ...props },
  ref,
) {
  const imgRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(false);
    const img = imgRef.current;
    if (img?.complete && img.naturalWidth > 0) setReady(true);
  }, [src]);

  return (
    <span
      ref={ref}
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
          onLoad?.(event);
        }}
        onError={(event) => {
          setReady(true);
          onError?.(event);
        }}
        {...props}
      />
    </span>
  );
});

export const SoftVideo = forwardRef(function SoftVideo(
  { className = "", onCanPlay, onLoadedData, poster, ...props },
  ref,
) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(false);
  }, [props.src, poster]);

  const markReady = () => setReady(true);

  return (
    <span className={`media-shell${ready ? " is-ready" : " is-loading"}${className ? ` ${className}` : ""}`}>
      {!ready ? <Skeleton /> : null}
      <video
        ref={ref}
        poster={poster}
        onLoadedData={(event) => {
          markReady();
          onLoadedData?.(event);
        }}
        onCanPlay={(event) => {
          markReady();
          onCanPlay?.(event);
        }}
        onError={markReady}
        {...props}
      />
    </span>
  );
});
