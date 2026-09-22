import { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Analytics } from "@vercel/analytics/react";

import { CaseHeader } from "./components/case/CaseHeader.jsx";
import HomePage from "./pages/HomePage.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import PrivacyPage from "./pages/PrivacyPage.jsx";
import TermsPage from "./pages/TermsPage.jsx";

const CaseRoutes = lazy(() => import("./pages/cases/index.jsx"));

const HOME_SCROLL_KEY = "dnp:home-scroll";

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

function readHomeScroll() {
  const value = Number(sessionStorage.getItem(HOME_SCROLL_KEY));
  return Number.isFinite(value) && value > 0 ? value : 0;
}

function writeHomeScroll(y) {
  sessionStorage.setItem(HOME_SCROLL_KEY, String(Math.max(0, Math.round(y))));
}

function CaseRouteFallback() {
  return (
    <main className="case-page" aria-busy="true">
      <CaseHeader navigationItems={[]} />
    </main>
  );
}

function resolveNonHomePage(path) {
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

  return null;
}

export default function App() {
  const [path, setPath] = useState(getPath);
  const homeScrollRef = useRef(readHomeScroll());
  const isHome = path === "/";

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  useLayoutEffect(() => {
    if (isHome) {
      window.scrollTo({ top: homeScrollRef.current, left: 0, behavior: "auto" });
      return;
    }
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [path, isHome]);

  useEffect(() => {
    const rememberHomeScroll = () => {
      if (getPath() !== "/") {
        return;
      }
      const y = window.scrollY || document.documentElement.scrollTop || 0;
      homeScrollRef.current = y;
      writeHomeScroll(y);
    };

    window.addEventListener("scroll", rememberHomeScroll, { passive: true });
    window.addEventListener("pagehide", rememberHomeScroll);
    return () => {
      window.removeEventListener("scroll", rememberHomeScroll);
      window.removeEventListener("pagehide", rememberHomeScroll);
    };
  }, []);

  useEffect(() => {
    const onPopState = () => {
      const previousPath = path;
      const nextPath = getPath();

      if (previousPath === "/") {
        const y = window.scrollY || document.documentElement.scrollTop || 0;
        homeScrollRef.current = y;
        writeHomeScroll(y);
      }

      const apply = () => {
        setPath(nextPath);
      };

      if (typeof document.startViewTransition === "function") {
        document.startViewTransition(apply);
      } else {
        apply();
      }
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [path]);

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
        if (getPath() === "/") {
          const y = window.scrollY || document.documentElement.scrollTop || 0;
          homeScrollRef.current = y;
          writeHomeScroll(y);
        }

        window.history.pushState({}, "", `${url.pathname}${url.search}${url.hash}`);
        setPath(getPath());
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
      <div
        className={isHome ? undefined : "app-home-parked"}
        aria-hidden={isHome ? undefined : true}
        inert={isHome ? undefined : true}
      >
        <HomePage />
      </div>
      {!isHome ? resolveNonHomePage(path) : null}
      <Analytics />
    </>
  );
}
