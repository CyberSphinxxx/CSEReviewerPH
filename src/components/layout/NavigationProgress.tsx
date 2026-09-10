"use client";

import React, { useEffect, useState, useTransition } from "react";
import { usePathname } from "next/navigation";

/**
 * NavigationProgress provides an instant visual indicator at the top of the
 * viewport whenever a page switch occurs.
 *
 * This eliminates perceived latency when navigating between dynamic or server-rendered
 * routes by providing immediate visual feedback upon clicking any internal link.
 */
export function NavigationProgress() {
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [, startTransition] = useTransition();

  // Whenever the pathname changes, complete the navigation progress smoothly
  useEffect(() => {
    if (isNavigating) {
      setProgress(100);
      const timer = setTimeout(() => {
        setIsNavigating(false);
        setProgress(0);
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [pathname, isNavigating]);

  // Intercept click on internal links to provide instant feedback
  useEffect(() => {
    const handleLinkClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest("a") as HTMLAnchorElement | null;

      if (!anchor || !anchor.href) return;

      // Ignore modified clicks (cmd/ctrl click, shift click, right click) or targets with _blank
      if (
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        anchor.target === "_blank" ||
        anchor.hasAttribute("download")
      ) {
        return;
      }

      // Check if same origin and different destination
      try {
        const destination = new URL(anchor.href, window.location.href);
        if (
          destination.origin === window.location.origin &&
          (destination.pathname !== window.location.pathname ||
            destination.search !== window.location.search)
        ) {
          startTransition(() => {
            setIsNavigating(true);
            setProgress(30);
          });
        }
      } catch {
        // Invalid URL, ignore
      }
    };

    document.addEventListener("click", handleLinkClick, { capture: true });
    return () => {
      document.removeEventListener("click", handleLinkClick, { capture: true });
    };
  }, []);

  // Slowly creep up progress while waiting for route transition
  useEffect(() => {
    if (!isNavigating) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        const increment = Math.max(1, (90 - prev) * 0.1);
        return Math.min(90, prev + increment);
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isNavigating]);

  if (!isNavigating && progress === 0) return null;

  return (
    <div
      role="progressbar"
      aria-label="Page loading progress"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
      className="fixed top-0 left-0 right-0 z-50 h-[3px] pointer-events-none transition-opacity duration-300"
      style={{ opacity: isNavigating ? 1 : 0 }}
    >
      <div
        className="h-full bg-gradient-to-r from-brand-600 via-gold-500 to-emerald-500 transition-all ease-out duration-200 shadow-sm shadow-gold-500/50"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
