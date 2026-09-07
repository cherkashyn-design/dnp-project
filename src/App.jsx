import { lazy, Suspense } from "react";
import { Analytics } from "@vercel/analytics/react";

import HomePage from "./pages/HomePage.jsx";

const CaseRoutes = lazy(() => import("./pages/cases/index.jsx"));

function CaseRouteFallback() {
  return <main className="case-page" aria-busy="true" />;
}

export default function App() {
  const page = window.location.pathname.startsWith("/cases/") ? (
    <Suspense fallback={<CaseRouteFallback />}>
      <CaseRoutes />
    </Suspense>
  ) : (
    <HomePage />
  );

  return (
    <>
      {page}
      <Analytics />
    </>
  );
}
