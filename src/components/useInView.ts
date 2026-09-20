"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

/** useLayoutEffect warns when it runs on the server, so stand in for it there. */
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Reports the first time an element scrolls into view, then stops observing.
 * Falls back to "visible" wherever IntersectionObserver is unavailable, so
 * content is never left hidden.
 */
export function useInView<T extends HTMLElement>(
  threshold = 0.18,
  rootMargin = "0px 0px -10% 0px",
) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            observer.disconnect();
          }
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return { ref, inView };
}

/**
 * The same idea, but safe for anyone without JavaScript.
 *
 * `active` is true in the server-rendered HTML, so the page reads perfectly
 * with scripts turned off. The moment the component hydrates — before the
 * browser paints, so nothing flickers — it hands control back to the observer
 * and the entrance animation plays as intended.
 */
export function useEntrance<T extends HTMLElement>(threshold?: number) {
  const { ref, inView } = useInView<T>(threshold);
  const [hydrated, setHydrated] = useState(false);

  useIsomorphicLayoutEffect(() => {
    setHydrated(true);
  }, []);

  return { ref, active: !hydrated || inView, hydrated };
}
