import { lazy, Suspense, useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/react";

import { CaseHeader } from "./components/case/CaseHeader.jsx";
import HomePage from "./pages/HomePage.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import PrivacyPage from "./pages/PrivacyPage.jsx";
import TermsPage from "./pages/TermsPage.jsx";

const CaseRoutes = lazy(() => import("./pages/cases/index.jsx"));

function getPath() {
  return window.location.pathname.replace(/\/+$/, "") || "/";
}

function isAppPath(path) {
  return (
    path === "/" ||
    path.startsWith("/cases/") ||
    path === "/contact" ||
    path === "/contacts" ||
    path === "/privacy" ||
    path === "/terms"
  );
}

function CaseRouteFallback() {
  return (
    <main className="case-page" aria-busy="true">
      <CaseHeader navigationItems={[]} />
    </main>
  );
}

function resolvePage(path) {
  if (path.startsWith("/cases/")) {
    return (
      <Suspense fallback={<CaseRouteFallback />}>
        <CaseRoutes key={path} />
      </Suspense>
    );
  }

  if (path === "/contact" || path === "/contacts") {
    return <ContactPage />;
  }

  if (path === "/privacy") {
    return <PrivacyPage />;
  }

  if (path === "/terms") {
    return <TermsPage />;
  }

  return <HomePage />;
}

export default function App() {
  const [path, setPath] = useState(getPath);

  useEffect(() => {
    const onPopState = () => {
      const nextPath = getPath();
      const apply = () => {
        setPath(nextPath);
        window.scrollTo(0, 0);
      };

      if (typeof document.startViewTransition === "function") {
        document.startViewTransition(apply);
      } else {
        apply();
      }
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    const onClick = (event) => {
      if (event.defaultPrevented || event.button !== 0) {
        return;
      }
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const anchor = event.target.closest("a[href]");
      if (!anchor || anchor.hasAttribute("download")) {
        return;
      }
      if (anchor.target && anchor.target !== "_self") {
        return;
      }

      let url;
      try {
        url = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }

      if (url.origin !== window.location.origin) {
        return;
      }

      const nextPath = url.pathname.replace(/\/+$/, "") || "/";
      if (!isAppPath(nextPath)) {
        return;
      }

      // Same-page hash links (case section nav) keep native behavior.
      if (nextPath === getPath() && url.search === window.location.search) {
        return;
      }

      event.preventDefault();

      const go = () => {
        window.history.pushState({}, "", `${url.pathname}${url.search}${url.hash}`);
        setPath(getPath());
        window.scrollTo(0, 0);
      };

      if (typeof document.startViewTransition === "function") {
        document.startViewTransition(go);
      } else {
        go();
      }
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return (
    <>
      {resolvePage(path)}
      <Analytics />
    </>
  );
}
