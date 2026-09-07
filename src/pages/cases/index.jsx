import DrumkitCasePage from "./DrumkitCasePage.jsx";
import PortfolioCasePage from "./PortfolioCasePage.jsx";
import { genericCasePages } from "../../data/casesIndex.js";

export default function CaseRoutes() {
  if (window.location.pathname === "/cases/drumkit-logistic-saas") {
    return <DrumkitCasePage />;
  }

  const genericCasePage = genericCasePages[window.location.pathname];
  if (genericCasePage) {
    return <PortfolioCasePage project={genericCasePage} />;
  }

  return null;
}
