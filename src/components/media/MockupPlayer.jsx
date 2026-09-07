import { useEffect, useState } from "react";

export function MockupPlayer({
  mockupId,
  width = "100%",
  aspectRatio = "16 / 9",
  trigger,
  triggerLoop,
  cursorRange,
  clickRange,
  zoomMode,
  zoomAmount,
  zoomDuration,
  cursorAffectPage,
  backgroundColor,
  cameraZoom,
}) {
  const [ready, setReady] = useState(false);
  const [renderScale, setRenderScale] = useState(1);

  useEffect(() => {
    const updateRenderScale = () => {
      // Experiment: 4× buffer on small phones only, then CSS-scale back for sharper embeds.
      const narrow = window.matchMedia("(max-width: 500px)").matches;
      setRenderScale(narrow ? 4 : 1);
    };

    updateRenderScale();
    window.addEventListener("resize", updateRenderScale);
    window.visualViewport?.addEventListener("resize", updateRenderScale);

    return () => {
      window.removeEventListener("resize", updateRenderScale);
      window.visualViewport?.removeEventListener("resize", updateRenderScale);
    };
  }, []);

  useEffect(() => {
    if (ready) return undefined;

    let settled = false;
    let quietTimer = null;
    const mountedAt = performance.now();

    const markReady = () => {
      if (settled) return;
      settled = true;
      setReady(true);
    };

    const onMessage = (event) => {
      const data = event.data;
      if (
        data?.type === "mockup-player:ready" &&
        (!data.uid || data.uid === mockupId)
      ) {
        markReady();
      }
    };
    window.addEventListener("message", onMessage);

    const isSceneAsset = (name = "") =>
      name.includes("mckp") ||
      name.includes("mockup") ||
      (mockupId ? name.includes(mockupId) : false);

    const bumpQuiet = () => {
      window.clearTimeout(quietTimer);
      quietTimer = window.setTimeout(markReady, 1400);
    };

    let observer;
    try {
      observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (
            isSceneAsset(entry.name) &&
            entry.startTime >= mountedAt - 50
          ) {
            bumpQuiet();
          }
        }
      });
      observer.observe({ type: "resource", buffered: true });
    } catch {
      // PerformanceObserver may be unavailable.
    }

    const fallback = window.setTimeout(markReady, 10000);

    return () => {
      window.removeEventListener("message", onMessage);
      window.clearTimeout(fallback);
      window.clearTimeout(quietTimer);
      observer?.disconnect();
    };
  }, [mockupId, ready]);

  return (
    <div
      className={["mockup-player-shell", ready ? "is-ready" : ""].filter(Boolean).join(" ")}
      style={{
        "--mockup-aspect": aspectRatio,
        "--mockup-render-scale": String(renderScale),
      }}
    >
      <div className="mockup-player-skeleton" aria-hidden={ready}>
        <span className="mockup-player-skeleton-shine" />
      </div>
      <div className="mockup-player-frame">
        <mockup-player
          mockup-id={mockupId}
          width={width}
          aspect-ratio={aspectRatio}
          trigger={trigger}
          trigger-loop={
            triggerLoop === true ? "true" : triggerLoop === false ? "false" : undefined
          }
          cursor-range={cursorRange}
          click-range={clickRange}
          zoom-mode={zoomMode}
          zoom-amount={zoomAmount}
          zoom-duration={zoomDuration}
          cursor-affect-page={
            cursorAffectPage === false
              ? "false"
              : cursorAffectPage === true
                ? "true"
                : undefined
          }
          background-color={backgroundColor}
          camera-zoom={cameraZoom}
        />
      </div>
    </div>
  );
}
