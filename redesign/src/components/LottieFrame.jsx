import { useEffect, useRef, useState } from "react";
import { Lottie } from "lottie-react";

export function LottieFrame({ load, label, className = "case-lottie" }) {
  const frameRef = useRef(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    const node = frameRef.current;
    if (!node || !load) return undefined;

    let cancelled = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || cancelled) return;
        load()
          .then((module) => {
            if (!cancelled) setData(module.default ?? module);
          })
          .catch(() => {
            if (!cancelled) setData(null);
          });
        observer.disconnect();
      },
      { rootMargin: "240px" },
    );

    observer.observe(node);
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [load]);

  return (
    <div className={className} ref={frameRef} role="img" aria-label={label}>
      {data ? <Lottie src={data} autoplay loop /> : null}
    </div>
  );
}
