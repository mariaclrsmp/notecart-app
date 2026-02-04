"use client";

import { useEffect } from "react";

export default function ThemeProvider({ children }) {
  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const shouldBeDark = stored === "dark";

    if (shouldBeDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    const onStorage = (event) => {
      if (event.key !== "theme") return;
      const nextShouldBeDark = event.newValue === "dark";
      if (nextShouldBeDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return children;
}
