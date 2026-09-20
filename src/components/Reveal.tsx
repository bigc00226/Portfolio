"use client";

import type { CSSProperties, ReactNode } from "react";

import { useEntrance } from "./useInView";

type RevealProps = {
  children: ReactNode;
  /** Stagger, in milliseconds. */
  delay?: number;
  className?: string;
};

/** Fades and lifts its contents into place the first time they are seen. */
export function Reveal({ children, delay = 0, className }: RevealProps) {
  const { ref, active } = useEntrance<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={className}
      data-reveal={active ? "shown" : ""}
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}
