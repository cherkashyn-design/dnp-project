import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { inject } from "@vercel/analytics";

import App from "./App.jsx";
import { startFaviconCycle } from "./faviconCycle.js";
import "./styles/global.css";

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}
if (!window.location.hash) {
  window.scrollTo(0, 0);
}

startFaviconCycle();
// The Vercel visit counter only works on Vercel; the Cloudflare build (scripts/build-cloudflare.mjs) leaves it out.
if (import.meta.env.VITE_HOST !== "cloudflare") inject();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
