const ICONS = ["/favicon-cycle/D.png", "/favicon-cycle/N.png", "/favicon-cycle/P.png"];
const INTERVAL_MS = 1000;

function setFavicon(href) {
  document
    .querySelectorAll('link[rel="icon"], link[rel="shortcut icon"]')
    .forEach((node) => node.remove());

  const link = document.createElement("link");
  link.rel = "icon";
  link.type = "image/png";
  link.href = href;
  document.head.appendChild(link);
}

export function startFaviconCycle() {
  let index = 0;
  const tick = () => {
    setFavicon(ICONS[index]);
    index = (index + 1) % ICONS.length;
  };

  tick();
  return window.setInterval(tick, INTERVAL_MS);
}
