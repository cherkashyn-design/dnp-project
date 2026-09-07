import { useEffect } from "react";

export function useCaseNavScroll() {
  useEffect(() => {
    let animationFrame = null;

    const getMediaTarget = (section) =>
      section.querySelector(
        [
          ".case-hero-image-frame",
          ".case-media",
          ".lottie-quad-grid",
          ".feature-media",
          ".case-media-marquee",
        ].join(", "),
      ) || section;

    const getSectionProgress = (links) => {
      const viewportCenter = window.innerHeight / 2;
      const centers = links.map((link) => {
        const id = link.getAttribute("href")?.replace(/^#/, "");
        const section = id ? document.getElementById(id) : null;
        if (!section) return null;
        const media = getMediaTarget(section);
        const rect = media.getBoundingClientRect();
        return rect.top + rect.height / 2;
      });

      if (centers.every((center) => center == null)) {
        return 0;
      }

      const first = centers.findIndex((center) => center != null);
      let last = -1;
      for (let index = centers.length - 1; index >= 0; index -= 1) {
        if (centers[index] != null) {
          last = index;
          break;
        }
      }

      if (centers[first] >= viewportCenter) {
        return first;
      }

      if (centers[last] <= viewportCenter) {
        return last;
      }

      for (let index = 0; index < centers.length - 1; index += 1) {
        const current = centers[index];
        let nextIndex = index + 1;
        while (nextIndex < centers.length && centers[nextIndex] == null) {
          nextIndex += 1;
        }
        const next = centers[nextIndex];
        if (current == null || next == null) {
          continue;
        }

        if (current <= viewportCenter && viewportCenter <= next) {
          const span = next - current || 1;
          return index + ((viewportCenter - current) / span) * (nextIndex - index);
        }
      }

      return first;
    };

    const updateNavPosition = () => {
      animationFrame = null;
      const tracks = Array.from(document.querySelectorAll(".case-nav-track")).filter(
        (track) => {
          const slider = track.closest(".case-nav-slider");
          return slider && slider.getClientRects().length > 0;
        },
      );
      if (tracks.length === 0) {
        return;
      }

      const referenceTrack = tracks[0];
      const links = Array.from(referenceTrack.querySelectorAll("a.case-nav-thumb"));
      if (links.length === 0) {
        return;
      }

      const slider = referenceTrack.closest(".case-nav-slider");
      const leftPanel = referenceTrack.parentElement;
      if (!slider || !leftPanel) {
        return;
      }

      const progress = getSectionProgress(links);
      const thumbWidth = links[0].offsetWidth || 48;
      const gap = Number.parseFloat(window.getComputedStyle(referenceTrack).gap) || 4;
      const step = thumbWidth + gap;
      const sliderRect = slider.getBoundingClientRect();
      const panelRect = leftPanel.getBoundingClientRect();
      const centerInLeftPanel = sliderRect.left + sliderRect.width / 2 - panelRect.left;
      const leftBase = Number(referenceTrack.dataset.baseOffset || 0);
      const sharedDelta =
        centerInLeftPanel - leftBase - progress * step - thumbWidth / 2;

      document.querySelectorAll(".case-nav-track").forEach((track) => {
        const baseOffset = Number(track.dataset.baseOffset || 0);
        track.style.transform = `translateX(${baseOffset + sharedDelta}px)`;
      });
    };

    const requestUpdate = () => {
      if (animationFrame === null) {
        animationFrame = window.requestAnimationFrame(updateNavPosition);
      }
    };

    updateNavPosition();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    const resizeObserver =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(() => requestUpdate());
    resizeObserver?.observe(document.documentElement);

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      resizeObserver?.disconnect();
      if (animationFrame !== null) {
        window.cancelAnimationFrame(animationFrame);
      }
    };
  }, []);
}
