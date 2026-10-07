import { useEffect, useRef, useState } from "react";

import { LottieFrame } from "./LottieFrame.jsx";

/** 4-up Lottie row: grid on desktop, snap horizontal scroll + one active player on phones. */
export function LottieStrip({ animations, className = "case-motion-row" }) {
  const stripRef = useRef(null);
  const cardRefs = useRef([]);
  const [activeLabel, setActiveLabel] = useState(animations[0]?.label ?? null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 720px)");
    const update = () => setIsMobile(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!isMobile) return undefined;

    const root = stripRef.current;
    const nodes = cardRefs.current.filter(Boolean);
    if (!root || nodes.length === 0) return undefined;

    const ratios = new Map();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const label = entry.target.getAttribute("data-lottie-label");
          if (!label) return;
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
      { root, threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [animations, isMobile]);

  return (
    <div className={className} ref={stripRef} role="list">
      {animations.map((animation, index) => (
        <div
          className="case-lottie-card"
          data-lottie-label={animation.label}
          key={animation.label}
          ref={(node) => {
            cardRefs.current[index] = node;
          }}
          role="listitem"
        >
          <LottieFrame
            load={animation.load}
            label={animation.label}
            enabled={!isMobile || activeLabel === animation.label}
          />
        </div>
      ))}
    </div>
  );
}
