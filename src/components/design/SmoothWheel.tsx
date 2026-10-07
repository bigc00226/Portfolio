"use client";

import { useEffect } from "react";

import { MOTION_OK } from "./scrollClock";

/**
 * ホイールを回したぶんへ、ページが追いつくまでの時間（ミリ秒）。大きくするほど、
 * ゆったり流れます。0 にすると、ブラウザのふつうのスクロールに戻ります。
 */
const GLIDE = 150;

/** ホイールの一目盛りを「行」や「ページ」で伝えてくる環境のための、ピクセルへの換算。 */
const LINE = 40;

/** 途中に、自分でスクロールする要素（入力欄や、はみ出しを隠した箱）があるかどうか。 */
function scrollsInside(target: EventTarget | null) {
  for (let node = target instanceof Element ? target : null; node; node = node.parentElement) {
    if (node === document.body || node === document.documentElement) return false;
    if (node.scrollHeight <= node.clientHeight + 1) continue;

    const overflow = getComputedStyle(node).overflowY;
    if (overflow === "auto" || overflow === "scroll") return true;
  }
  return false;
}

/**
 * ホイールでのスクロールを、なめらかにします。
 *
 * ホイールは一目盛りごとに、まとまった量を一度に送ってきます。そのままだと、ページが
 * 段々に動いて、スクロールに合わせた動きも硬く見えます。ここでは、送られてきた量を
 * 行き先としてためておき、ページをそこへ、なめらかに近づけます。上へ戻るときも同じです。
 *
 * 手を入れるのは、ホイール（とタッチパッド）だけです。キーボード、スクロールバー、
 * タッチでのスクロールは、ブラウザに任せます。「視差効果を減らす」設定の方には、
 * 何もしません。
 */
export function SmoothWheel() {
  useEffect(() => {
    const motion = window.matchMedia(MOTION_OK);
    if (GLIDE <= 0) return;

    let frame = 0;
    let target = window.scrollY;
    let current = window.scrollY;
    let before = 0;

    const limit = () => document.documentElement.scrollHeight - window.innerHeight;

    const halt = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };

    const tick = (now: number) => {
      /* コマが落ちても、行き先へ着くまでの時間が延びないよう、実際に経った時間で進めます。 */
      const elapsed = Math.min(Math.max(now - before, 0), 250);
      before = now;

      const gap = target - current;
      current = Math.abs(gap) < 0.4 ? target : current + gap * (1 - Math.exp(-elapsed / GLIDE));
      window.scrollTo({ top: current, behavior: "instant" });

      frame = current === target ? 0 : requestAnimationFrame(tick);
    };

    const wheel = (event: WheelEvent) => {
      if (!motion.matches || event.defaultPrevented) return;
      /* 拡大・縮小の操作と、横へのスクロールは、そのまま通します。 */
      if (event.ctrlKey || event.metaKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
      if (scrollsInside(event.target)) return;

      event.preventDefault();

      const unit =
        event.deltaMode === WheelEvent.DOM_DELTA_LINE
          ? LINE
          : event.deltaMode === WheelEvent.DOM_DELTA_PAGE
            ? window.innerHeight
            : 1;

      if (!frame) {
        current = window.scrollY;
        target = current;
      }
      target = Math.min(Math.max(target + event.deltaY * unit, 0), limit());

      if (!frame && target !== current) {
        before = performance.now() - 16;
        frame = requestAnimationFrame(tick);
      }
    };

    /* ほかの方法（キーボードやスクロールバー、ページ内リンク）で動いたら、そちらに従います。 */
    const scroll = () => {
      if (frame && Math.abs(window.scrollY - current) > 2) halt();
    };

    window.addEventListener("wheel", wheel, { passive: false });
    window.addEventListener("scroll", scroll, { passive: true });

    return () => {
      halt();
      window.removeEventListener("wheel", wheel);
      window.removeEventListener("scroll", scroll);
    };
  }, []);

  return null;
}
