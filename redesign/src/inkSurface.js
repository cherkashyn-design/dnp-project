const INK_EVENT = "dnp:ink-surface";

function channelLuminance(channel) {
  const value = channel / 255;
  return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}

function relativeLuminance(r, g, b) {
  return 0.2126 * channelLuminance(r) + 0.7152 * channelLuminance(g) + 0.0722 * channelLuminance(b);
}

/** Average relative luminance of a bitmap source. Lower = darker. Returns null if unreadable. */
export function sampleLuminance(source, size = 32) {
  try {
    const width = source.videoWidth || source.naturalWidth || source.width || 0;
    const height = source.videoHeight || source.naturalHeight || source.height || 0;
    if (!width || !height) return null;

    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return null;

    ctx.drawImage(source, 0, 0, size, size);
    const { data } = ctx.getImageData(0, 0, size, size);
    let sum = 0;
    let count = 0;

    for (let i = 0; i < data.length; i += 4) {
      const alpha = data[i + 3] / 255;
      if (alpha < 0.35) continue;
      sum += relativeLuminance(data[i], data[i + 1], data[i + 2]) * alpha;
      count += alpha;
    }

    return count > 0 ? sum / count : null;
  } catch {
    return null;
  }
}

/** Dark enough that white nav pills stay readable. */
export function isDarkLuminance(luminance, threshold = 0.48) {
  return typeof luminance === "number" && luminance < threshold;
}

export function mediaLooksDark(source) {
  return isDarkLuminance(sampleLuminance(source));
}

export function setInkSurface(node, ink) {
  if (!(node instanceof Element)) return;
  const wasInk = node.hasAttribute("data-ink");
  if (ink) node.setAttribute("data-ink", "");
  else node.removeAttribute("data-ink");
  if (wasInk !== Boolean(ink)) {
    window.dispatchEvent(new CustomEvent(INK_EVENT));
  }
}

export function resolveInkMode(ink) {
  if (ink === true || ink === "true") return "force-on";
  if (ink === false || ink === "false") return "force-off";
  return "auto";
}

export { INK_EVENT };
