"use client";

import type { CSSProperties, ReactNode } from "react";

import { useEntrance } from "./useInView";

type RevealProps = {
  children: ReactNode;
  /** ずらして表示する時間（ミリ秒）。 */
  delay?: number;
  className?: string;
};

/** 初めて画面に入ったとき、内容をゆっくり浮かび上がらせます。 */
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
