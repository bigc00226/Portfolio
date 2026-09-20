"use client";

import { useEffect, useRef, useState } from "react";

import { useInView, useIsomorphicLayoutEffect } from "./useInView";

type CountUpProps = {
  value: number;
  /** Duration of the count, in milliseconds. */
  duration?: number;
};

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * Counts up to a figure once it is on screen.
 *
 * The finished number is what gets server-rendered, so the page is correct
 * without JavaScript and correct for anyone who has asked for reduced motion.
 * Only after hydration — and before the first paint — does it wind back to
 * zero, ready to count.
 */
export function CountUp({ value, duration = 1400 }: CountUpProps) {
  const { ref, inView } = useInView<HTMLSpanElement>(0.5);
  const [shown, setShown] = useState(value);
  const [armed, setArmed] = useState(false);
  const frame = useRef<number | null>(null);

  useIsomorphicLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setShown(0);
    setArmed(true);
  }, []);

  useEffect(() => {
    if (!armed || !inView) return;

    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setShown(Math.round(easeOut(progress) * value));
      if (progress < 1) {
        frame.current = requestAnimationFrame(tick);
      }
    };

    frame.current = requestAnimationFrame(tick);

    return () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, [armed, inView, value, duration]);

  return (
    <span ref={ref}>
      <span aria-hidden="true">{shown}</span>
      <span className="u-sr-only">{value}</span>
    </span>
  );
}
