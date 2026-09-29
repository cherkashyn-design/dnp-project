import { yummoCase } from "./yummo.js";
import { salesDriverCase } from "./salesDriver.js";
import { genieCase } from "./genie.js";
import { hermesCase } from "./hermes.js";
import { comfyuiCase } from "./comfyui.js";
import { hiddenCaseHrefs } from "./site.js";

const allGenericCasePages = {
  "/cases/comfyui-pro-ai-tool": comfyuiCase,
  "/cases/hermes-cloud-ai-admin-panel": hermesCase,
  "/cases/genie-node-based-ai-editor": genieCase,
  "/cases/yummo-food-guide-for-moms": yummoCase,
  "/cases/sales-driver-ads-tool": salesDriverCase,
};

export const genericCasePages = Object.fromEntries(
  Object.entries(allGenericCasePages).filter(([href]) => !hiddenCaseHrefs.has(href)),
);
