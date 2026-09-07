import { useEffect, useRef, useState } from "react";
import { LottiePlayer } from "./LottiePlayer.jsx";

export function LottieQuadBlock({ id, animations, caption }) {
  const cardRefs = useRef([]);
  const [activeLabel, setActiveLabel] = useState(animations[0]?.label ?? null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Single-active Lottie only on small phones; tablets/desktop keep all four mounted.
    const query = window.matchMedia("(max-width: 500px)");
    const update = () => setIsMobile(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!isMobile) {
      return undefined;
    }

    const nodes = cardRefs.current.filter(Boolean);
    if (nodes.length === 0) {
      return undefined;
    }

    const ratios = new Map();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const label = entry.target.getAttribute("data-lottie-label");
          if (!label) {
            return;
          }
          ratios.set(label, entry.isIntersecting ? entry.intersectionRatio : 0);
        });

        let bestLabel = animations[0]?.label ?? null;
        let bestRatio = -1;
        animations.forEach((animation) => {
          const ratio = ratios.get(animation.label) ?? 0;
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestLabel = animation.label;
          }
        });

        if (bestRatio > 0 && bestLabel) {
          setActiveLabel((current) => (current === bestLabel ? current : bestLabel));
        }
      },
      { threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [animations, isMobile]);

  return (
    <figure className="case-media-block" id={id}>
      <div className="lottie-quad-grid" role="list">
        {animations.map((animation, index) => (
          <div
            className="lottie-card"
            key={animation.label}
            role="listitem"
            aria-label={animation.label}
            data-lottie-label={animation.label}
            ref={(node) => {
              cardRefs.current[index] = node;
            }}
          >
            <LottiePlayer
              loadAnimation={animation.load}
              playMode={isMobile ? "visible" : "hover"}
              enabled={!isMobile || activeLabel === animation.label}
              aspectRatio="336 / 538"
            />
          </div>
        ))}
      </div>
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}
