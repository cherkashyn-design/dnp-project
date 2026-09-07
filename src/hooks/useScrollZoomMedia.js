import { useEffect } from "react";

export function useScrollZoomMedia() {
  useEffect(() => {
    let animationFrame = null;

    const updateMediaScale = () => {
      animationFrame = null;
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const mediaElements = document.querySelectorAll(
        ".case-hero-image-frame .progressive-image, .case-media > .progressive-image, .case-media > video",
      );

      mediaElements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        // Skip off-screen media — writing transforms on every image during Lottie-heavy
        // sections was contributing to scroll jank.
        if (rect.bottom < -160 || rect.top > viewportHeight + 160) {
          return;
        }

        const scrollDistance = viewportHeight + rect.height;
        const progress = Math.min(Math.max((viewportHeight - rect.top) / scrollDistance, 0), 1);
        const easedProgress = 1 - (1 - progress) ** 2;
        const scale = 1.2 - easedProgress * 0.2;

        element.style.transform = `scale(${scale})`;
      });
    };

    const requestUpdate = () => {
      if (animationFrame === null) {
        animationFrame = window.requestAnimationFrame(updateMediaScale);
      }
    };

    updateMediaScale();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (animationFrame !== null) {
        window.cancelAnimationFrame(animationFrame);
      }
    };
  }, []);
}
