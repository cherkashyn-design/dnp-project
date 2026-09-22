import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { Analytics } from "@vercel/analytics/react";

import { CaseHeader } from "./components/case/CaseHeader.jsx";
import HomePage from "./pages/HomePage.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import PrivacyPage from "./pages/PrivacyPage.jsx";
import TermsPage from "./pages/TermsPage.jsx";

const loadCaseRoutes = () => import("./pages/cases/index.jsx");
const CaseRoutes = lazy(loadCaseRoutes);

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

function scrollWindowTo(top) {
  const html = document.documentElement;
  const previousBehavior = html.style.scrollBehavior;
  html.style.scrollBehavior = "auto";
  window.scrollTo({ top, left: 0, behavior: "auto" });
  html.scrollTop = top;
  document.body.scrollTop = top;
  html.style.scrollBehavior = previousBehavior;
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
  const pathRef = useRef(path);
  const isHome = path === "/";

  useEffect(() => {
    pathRef.current = path;
  }, [path]);

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    // Warm the cases chunk so home → case transitions don't snapshot a Suspense fallback.
    const warm = () => {
      loadCaseRoutes().catch(() => {});
    };
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(warm, { timeout: 1500 });
      return () => window.cancelIdleCallback(id);
    }
    const timer = window.setTimeout(warm, 400);
    return () => window.clearTimeout(timer);
  }, []);

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

  const applyPathChange = (nextPath) => {
    const previousPath = pathRef.current;

    if (previousPath === "/" && nextPath !== "/") {
      const y = window.scrollY || document.documentElement.scrollTop || 0;
      homeScrollRef.current = y;
      writeHomeScroll(y);
    }

    flushSync(() => {
      setPath(nextPath);
      pathRef.current = nextPath;
    });

    if (nextPath === "/") {
      scrollWindowTo(homeScrollRef.current);
    } else {
      scrollWindowTo(0);
    }
  };

  const navigateWithTransition = async (nextPath, beforeApply) => {
    if (nextPath.startsWith("/cases/")) {
      try {
        await loadCaseRoutes();
      } catch {
        // Fall through; Suspense will handle a failed warm.
      }
    }

    const run = () => {
      beforeApply?.();
      applyPathChange(nextPath);
    };

    if (typeof document.startViewTransition === "function") {
      const transition = document.startViewTransition(run);
      try {
        await transition.finished;
      } catch {
        // Transition may be skipped; still ensure case pages sit at the top.
      }
      if (getPath() !== "/") {
        scrollWindowTo(0);
      }
      return;
    }

    run();
  };

  useEffect(() => {
    const onPopState = () => {
      void navigateWithTransition(getPath());
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

      void navigateWithTransition(nextPath, () => {
        window.history.pushState({}, "", `${url.pathname}${url.search}${url.hash}`);
      });
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
