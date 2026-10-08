import { useEffect, useState } from "react";

import checkIcon from "../assets/icons/check.svg";

const ANIMATION_MS = 360;

export function CopiedToast({ open, restartKey = 0 }) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!open) {
      setVisible(false);
      const hideTimer = window.setTimeout(() => setMounted(false), ANIMATION_MS);
      return () => window.clearTimeout(hideTimer);
    }

    setMounted(true);
    setVisible(false);

    let outerFrame = 0;
    let innerFrame = 0;
    outerFrame = window.requestAnimationFrame(() => {
      innerFrame = window.requestAnimationFrame(() => {
        setVisible(true);
      });
    });

    return () => {
      window.cancelAnimationFrame(outerFrame);
      window.cancelAnimationFrame(innerFrame);
    };
  }, [open, restartKey]);

  if (!mounted) return null;

  return (
    <div className="copied-toast" aria-live="polite" aria-atomic="true">
      <div className={visible ? "copied-toast-pill is-visible" : "copied-toast-pill"}>
        <img className="copied-toast-icon" src={checkIcon} alt="" aria-hidden="true" />
        <span>Copied</span>
      </div>
    </div>
  );
}
