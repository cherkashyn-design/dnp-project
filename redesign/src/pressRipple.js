/** Spawns a circular press ripple from the pointer, clipped by the host. */
export function spawnPressRipple(event) {
  const host = event.currentTarget;
  if (!(host instanceof HTMLElement)) return;
  if (typeof event.button === "number" && event.button !== 0) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const rect = host.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const radius = Math.hypot(Math.max(x, rect.width - x), Math.max(y, rect.height - y));
  const size = Math.ceil(radius * 2);

  const ripple = document.createElement("span");
  ripple.className = "press-ripple";
  ripple.setAttribute("aria-hidden", "true");
  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;
  ripple.style.setProperty("--ripple-size", `${Math.max(size, 48)}px`);

  host.appendChild(ripple);
  ripple.addEventListener(
    "animationend",
    () => {
      ripple.remove();
    },
    { once: true },
  );
}
