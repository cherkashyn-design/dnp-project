import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.jsx";
import { startFaviconCycle } from "./faviconCycle.js";
import "./styles/global.css";

startFaviconCycle();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
