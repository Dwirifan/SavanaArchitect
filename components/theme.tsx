"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { flushSync } from "react-dom";

type Theme = "light" | "dark";
const Ctx = createContext<{ theme: Theme; toggle: (e?: React.MouseEvent) => void } | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  
  useEffect(() => {
    const saved = localStorage.getItem("savana-theme") as Theme | null;
    const pref = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "dark"; // default dark ala AlienDC
    const t = saved || pref;
    setTheme(t);
    document.documentElement.classList.toggle("dark", t === "dark");
  }, []);

  const toggle = (e?: React.MouseEvent) => {
    const next = theme === "dark" ? "light" : "dark";
    const root = document.documentElement;

    const updateTheme = () => {
      localStorage.setItem("savana-theme", next);
      root.classList.toggle("dark", next === "dark");
      flushSync(() => setTheme(next));
    };

    const viewTransitionDocument = document as Document & {
      startViewTransition?: (update: () => void) => { finished: Promise<void>; ready: Promise<void> };
    };

    if (viewTransitionDocument.startViewTransition && e) {
      const x = e.clientX;
      const y = e.clientY;
      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );

      const transition = viewTransitionDocument.startViewTransition(updateTheme);
      
      transition.ready.then(() => {
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${endRadius}px at ${x}px ${y}px)`
            ]
          },
          {
            duration: 700,
            easing: "cubic-bezier(0.65, 0, 0.35, 1)",
            pseudoElement: "::view-transition-new(root)"
          }
        );
      });
    } else {
      updateTheme();
    }
  };

  return <Ctx.Provider value={{ theme, toggle }}>{children}</Ctx.Provider>;
}

export function useTheme() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useTheme outside provider");
  return v;
}
