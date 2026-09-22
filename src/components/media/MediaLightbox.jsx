import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { IconButton } from "../ui/IconButton.jsx";
import closeIcon from "../../assets/icons/pixel-close.svg";
import plusIcon from "../../assets/icons/pixel-plus.svg";
import minusIcon from "../../assets/icons/pixel-minus.svg";

const MIN_SCALE = 1;
const MAX_SCALE = 4;
const SCALE_STEP = 0.5;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function MediaLightbox({ type = "image", src, poster, alt = "", onClose }) {
  const stageRef = useRef(null);
  const pointersRef = useRef(new Map());
  const pinchStartRef = useRef(null);
  const panStartRef = useRef(null);
  const viewRef = useRef({ scale: 1, offset: { x: 0, y: 0 } });
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const commitView = useCallback((nextScale, nextOffset) => {
    const scaleValue = clamp(nextScale, MIN_SCALE, MAX_SCALE);
    const offsetValue =
      scaleValue === MIN_SCALE ? { x: 0, y: 0 } : nextOffset;
    viewRef.current = { scale: scaleValue, offset: offsetValue };
    setScale(scaleValue);
    setOffset(offsetValue);
  }, []);

  const resetView = useCallback(() => {
    commitView(1, { x: 0, y: 0 });
  }, [commitView]);

  const zoomBy = useCallback(
    (delta, originX = 0, originY = 0) => {
      const current = viewRef.current;
      const next = clamp(Number((current.scale + delta).toFixed(2)), MIN_SCALE, MAX_SCALE);
      if (next === current.scale) {
        return;
      }
      if (next === MIN_SCALE) {
        commitView(next, { x: 0, y: 0 });
        return;
      }
      const ratio = next / current.scale;
      commitView(next, {
        x: originX - (originX - current.offset.x) * ratio,
        y: originY - (originY - current.offset.y) * ratio,
      });
    },
    [commitView],
  );

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key === "+" || event.key === "=") {
        event.preventDefault();
        zoomBy(SCALE_STEP);
      }
      if (event.key === "-" || event.key === "_") {
        event.preventDefault();
        zoomBy(-SCALE_STEP);
      }
      if (event.key === "0") {
        event.preventDefault();
        resetView();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose, resetView, zoomBy]);

  useEffect(() => {
    resetView();
  }, [src, resetView]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) {
      return undefined;
    }

    const onWheel = (event) => {
      event.preventDefault();
      const rect = stage.getBoundingClientRect();
      const originX = event.clientX - rect.left - rect.width / 2;
      const originY = event.clientY - rect.top - rect.height / 2;
      const delta = event.deltaY < 0 ? SCALE_STEP / 2 : -SCALE_STEP / 2;
      zoomBy(delta, originX, originY);
    };

    stage.addEventListener("wheel", onWheel, { passive: false });
    return () => stage.removeEventListener("wheel", onWheel);
  }, [zoomBy]);

  const getStagePoint = (clientX, clientY) => {
    const stage = stageRef.current;
    if (!stage) {
      return { x: 0, y: 0 };
    }
    const rect = stage.getBoundingClientRect();
    return {
      x: clientX - rect.left - rect.width / 2,
      y: clientY - rect.top - rect.height / 2,
    };
  };

  const onPointerDown = (event) => {
    if (event.button !== 0 && event.pointerType === "mouse") {
      return;
    }

    const stage = stageRef.current;
    if (!stage) {
      return;
    }

    stage.setPointerCapture(event.pointerId);
    pointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (pointersRef.current.size === 2) {
      const [a, b] = Array.from(pointersRef.current.values());
      pinchStartRef.current = {
        distance: Math.hypot(a.x - b.x, a.y - b.y),
        scale: viewRef.current.scale,
        offset: { ...viewRef.current.offset },
      };
      panStartRef.current = null;
      return;
    }

    if (viewRef.current.scale > MIN_SCALE) {
      panStartRef.current = {
        x: event.clientX,
        y: event.clientY,
        offsetX: viewRef.current.offset.x,
        offsetY: viewRef.current.offset.y,
      };
    }
  };

  const onPointerMove = (event) => {
    if (!pointersRef.current.has(event.pointerId)) {
      return;
    }

    pointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (pointersRef.current.size === 2 && pinchStartRef.current) {
      const [a, b] = Array.from(pointersRef.current.values());
      const distance = Math.hypot(a.x - b.x, a.y - b.y);
      const nextScale = clamp(
        pinchStartRef.current.scale * (distance / Math.max(pinchStartRef.current.distance, 1)),
        MIN_SCALE,
        MAX_SCALE,
      );
      const point = getStagePoint((a.x + b.x) / 2, (a.y + b.y) / 2);
      const ratio = nextScale / pinchStartRef.current.scale;
      commitView(nextScale, {
        x: point.x - (point.x - pinchStartRef.current.offset.x) * ratio,
        y: point.y - (point.y - pinchStartRef.current.offset.y) * ratio,
      });
      return;
    }

    if (panStartRef.current && viewRef.current.scale > MIN_SCALE) {
      commitView(viewRef.current.scale, {
        x: panStartRef.current.offsetX + (event.clientX - panStartRef.current.x),
        y: panStartRef.current.offsetY + (event.clientY - panStartRef.current.y),
      });
    }
  };

  const onPointerUp = (event) => {
    pointersRef.current.delete(event.pointerId);
    if (pointersRef.current.size < 2) {
      pinchStartRef.current = null;
    }
    if (pointersRef.current.size === 0) {
      panStartRef.current = null;
    }
  };

  const onDoubleClick = (event) => {
    event.preventDefault();
    if (viewRef.current.scale > MIN_SCALE) {
      resetView();
      return;
    }
    const point = getStagePoint(event.clientX, event.clientY);
    commitView(2, { x: -point.x, y: -point.y });
  };

  const handleBackdropClick = () => {
    if (viewRef.current.scale > MIN_SCALE) {
      resetView();
      return;
    }
    onClose();
  };

  const canZoomOut = scale > MIN_SCALE;
  const canZoomIn = scale < MAX_SCALE;

  return createPortal(
    <div className="media-lightbox" role="dialog" aria-modal="true" aria-label="Fullscreen media">
      <button
        type="button"
        className="media-lightbox-backdrop"
        aria-label="Close"
        onClick={handleBackdropClick}
      />

      <div className="media-lightbox-toolbar media-lightbox-toolbar-top">
        <IconButton label="Close" onClick={onClose} className="media-lightbox-close">
          <img src={closeIcon} alt="" aria-hidden="true" />
        </IconButton>
      </div>

      <div
        ref={stageRef}
        className={["media-lightbox-stage", scale > MIN_SCALE ? "is-zoomed" : ""].filter(Boolean).join(" ")}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onDoubleClick={onDoubleClick}
      >
        <div
          className="media-lightbox-transform"
          style={{
            transform: `translate3d(${offset.x}px, ${offset.y}px, 0) scale(${scale})`,
          }}
        >
          {type === "video" ? (
            <video
              className="media-lightbox-media"
              src={src}
              poster={poster}
              controls
              autoPlay
              muted
              playsInline
              loop
            />
          ) : (
            <img className="media-lightbox-media" src={src} alt={alt} draggable={false} />
          )}
        </div>
      </div>

      <div className="media-lightbox-toolbar media-lightbox-toolbar-bottom">
        <IconButton label="Zoom out" onClick={() => zoomBy(-SCALE_STEP)} disabled={!canZoomOut}>
          <img src={minusIcon} alt="" aria-hidden="true" />
        </IconButton>
        <IconButton label="Zoom in" onClick={() => zoomBy(SCALE_STEP)} disabled={!canZoomIn}>
          <img src={plusIcon} alt="" aria-hidden="true" />
        </IconButton>
      </div>
    </div>,
    document.body,
  );
}
