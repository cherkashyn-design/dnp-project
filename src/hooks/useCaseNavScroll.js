import { useEffect } from "react";

function getTrackOriginX(panel) {
  const styles = window.getComputedStyle(panel);
  const borderLeft = Number.parseFloat(styles.borderLeftWidth) || 0;
  return panel.getBoundingClientRect().left + borderLeft;
}

function getThumbCenterX(links, progress) {
  const last = links.length - 1;
  if (last < 0) {
    return 0;
  }

  if (progress <= 0) {
    return links[0].offsetLeft + links[0].offsetWidth / 2;
  }

  if (progress >= last) {
    return links[last].offsetLeft + links[last].offsetWidth / 2;
  }

  const index = Math.floor(progress);
  const nextIndex = Math.min(index + 1, last);
  const mix = progress - index;
  const current = links[index].offsetLeft + links[index].offsetWidth / 2;
  const next = links[nextIndex].offsetLeft + links[nextIndex].offsetWidth / 2;
  return current + (next - current) * mix;
}

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
      const sliders = Array.from(document.querySelectorAll(".case-nav-slider")).filter(
        (slider) => slider.getClientRects().length > 0,
      );

      sliders.forEach((slider) => {
        const leftPanel = slider.querySelector(".case-nav-panel-left");
        const rightPanel = slider.querySelector(".case-nav-panel-right");
        const leftTrack = leftPanel?.querySelector(".case-nav-track");
        const rightTrack = rightPanel?.querySelector(".case-nav-track");
        if (!leftPanel || !rightPanel || !leftTrack || !rightTrack) {
          return;
        }

        const links = Array.from(leftTrack.querySelectorAll("a.case-nav-thumb"));
        if (links.length === 0) {
          return;
        }

        const progress = getSectionProgress(links);
        const thumbCenter = getThumbCenterX(links, progress);
        const sliderRect = slider.getBoundingClientRect();
        const sliderCenter = sliderRect.left + sliderRect.width / 2;
        const leftOrigin = getTrackOriginX(leftPanel);
        const rightOrigin = getTrackOriginX(rightPanel);
        const syncGap = rightOrigin - leftOrigin;
        const leftTranslate = sliderCenter - leftOrigin - thumbCenter;

        leftTrack.style.transform = `translateX(${leftTranslate}px)`;
        rightTrack.style.transform = `translateX(${leftTranslate - syncGap}px)`;
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
    document.querySelectorAll(".case-nav-slider").forEach((slider) => {
      resizeObserver?.observe(slider);
    });

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
