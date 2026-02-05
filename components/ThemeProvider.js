"use client";

import { useEffect } from "react";

export default function ThemeProvider({ children }) {
  useEffect(() => {
    const applyTheme = (theme) => {
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    };

    const stored = localStorage.getItem("theme");
    
    if (stored) {
      applyTheme(stored);
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const defaultTheme = prefersDark ? "dark" : "light";
      localStorage.setItem("theme", defaultTheme);
      applyTheme(defaultTheme);
    }

    const onStorage = (event) => {
      if (event.key !== "theme") return;
      applyTheme(event.newValue);
    };

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const onMediaChange = (e) => {
      const stored = localStorage.getItem("theme");
      if (!stored) {
        const theme = e.matches ? "dark" : "light";
        localStorage.setItem("theme", theme);
        applyTheme(theme);
      }
    };

    window.addEventListener("storage", onStorage);
    mediaQuery.addEventListener("change", onMediaChange);
    
    return () => {
      window.removeEventListener("storage", onStorage);
      mediaQuery.removeEventListener("change", onMediaChange);
    };
  }, []);

  return children;
}
