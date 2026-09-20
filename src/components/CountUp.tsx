"use client";

import { useEffect, useRef, useState } from "react";

import { useInView, useIsomorphicLayoutEffect } from "./useInView";

type CountUpProps = {
  value: number;
  /** 数え上げにかける時間（ミリ秒）。 */
  duration?: number;
};

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * 画面に入ったところで、数字を数え上げます。
 *
 * サーバーが返す HTML には最終的な数字が入っているため、JavaScript を
 * 無効にしていても、「視差効果を減らす」設定の方にも正しい数が表示されます。
 * 読み込まれた直後、画面が描かれる前にだけ 0 に戻し、そこから数え始めます。
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
