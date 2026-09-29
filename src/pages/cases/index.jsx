import { useEffect } from "react";

import DrumkitCasePage from "./DrumkitCasePage.jsx";
import PortfolioCasePage from "./PortfolioCasePage.jsx";
import { genericCasePages } from "../../data/casesIndex.js";

export default function CaseRoutes() {
  const pathname = window.location.pathname;
  const isDrumkit = pathname === "/cases/drumkit-logistic-saas";
  const genericCasePage = genericCasePages[pathname];
  const isKnownCase = isDrumkit || Boolean(genericCasePage);

  useEffect(() => {
    if (isKnownCase) {
      return;
    }
    window.history.replaceState({}, "", "/");
    window.dispatchEvent(new PopStateEvent("popstate"));
  }, [isKnownCase]);

  if (isDrumkit) {
    return <DrumkitCasePage />;
  }

  if (genericCasePage) {
    return <PortfolioCasePage project={genericCasePage} />;
  }

  return null;
}
