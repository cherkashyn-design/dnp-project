export const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

export function appHref(href) {
  if (!href || href.startsWith("#")) return href;
  const url = new URL(href, "http://dnp.local");
  const path = url.pathname === "/" ? BASE || "/" : `${BASE}${url.pathname}`;
  return `${path}${url.search}${url.hash}`;
}

export function stripBase(pathname) {
  const clean = pathname.replace(/\/+$/, "") || "/";
  if (!BASE) return clean;
  if (clean === BASE) return "/";
  if (clean.startsWith(`${BASE}/`)) return clean.slice(BASE.length) || "/";
  return clean;
}
