import { lazy, Suspense } from "react";

import HomePage from "./HomePage.jsx";

const CaseRoutes = lazy(() => import("./CaseRoutes.jsx"));

function CaseRouteFallback() {
  return <main className="case-page" aria-busy="true" />;
}

export default function App() {
  if (window.location.pathname.startsWith("/cases/")) {
    return (
      <Suspense fallback={<CaseRouteFallback />}>
        <CaseRoutes />
      </Suspense>
    );
  }

  return <HomePage />;
}
