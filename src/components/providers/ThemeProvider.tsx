"use client";

import React, { useEffect } from "react";
import { usePreferences } from "@/lib/preferences";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { preferences, mounted } = usePreferences();

  useEffect(() => {
    if (!mounted || typeof document === "undefined") return;

    const root = document.documentElement;

    // 1. Theme application
    const theme = preferences.appearance.theme;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = () => {
      const isDark = theme === "dark" || (theme === "system" && mediaQuery.matches);
      if (isDark) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    };

    applyTheme();

    if (theme === "system") {
      mediaQuery.addEventListener("change", applyTheme);
    }

    // 2. Motion preference
    const reduceMotion = preferences.appearance.reduceMotion;
    if (reduceMotion === "reduce") {
      root.setAttribute("data-reduce-motion", "reduce");
    } else {
      root.removeAttribute("data-reduce-motion");
    }

    // 3. Reading comfort CSS custom properties
    const sizeMap: Record<string, string> = {
      standard: "1rem", // 16px
      large: "1.125rem", // 18px
      "extra-large": "1.25rem", // 20px
    };
    const spacingMap: Record<string, string> = {
      standard: "1.6",
      spacious: "1.8",
    };
    const widthMap: Record<string, string> = {
      standard: "65ch",
      narrow: "52ch",
    };

    const fontSize = sizeMap[preferences.reading.readingTextSize] || "1rem";
    const lineHeight = spacingMap[preferences.reading.lineSpacing] || "1.6";
    const maxWidth = widthMap[preferences.reading.readingWidth] || "65ch";

    root.style.setProperty("--reading-font-size", fontSize);
    root.style.setProperty("--reading-line-height", lineHeight);
    root.style.setProperty("--reading-max-width", maxWidth);

    return () => {
      mediaQuery.removeEventListener("change", applyTheme);
    };
  }, [preferences, mounted]);

  return <>{children}</>;
}
