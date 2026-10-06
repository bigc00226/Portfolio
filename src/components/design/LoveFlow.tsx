"use client";

import { Fragment, useEffect, useRef, type CSSProperties } from "react";

import styles from "./LoveFlow.module.css";
import { Heart } from "./writingArt";

/**
 * 並べる数。一つぶんだけ左へ流れたら最初へ戻るので、画面の幅に、一つぶんと、
 * スクロールで余分に流れるぶんを足した長さを、いつも埋めておく必要があります。
 */
const COPIES = 4;

/** この帯が画面を通り抜けるあいだに、スクロールで余分に流す長さ（画面の幅に対する割合）。 */
const DRIFT = 0.5;

/** スクロールの動きへ、どれだけ遅れて付いていくか（ミリ秒）。 */
const FOLLOW = 160;

type Props = {
  /** 太い字。❤ のところに、ハートの絵が入ります。 */
  heavy: string;
  /** 細い字。 */
  light: string;
  /** 読み上げに使う、ふつうの綴り。 */
  label: string;
};

/**
 * ページの最後を、右から左へ流れていく大きな文字。
 * 止まっていても流れ続け、スクロールすると、そのぶんだけ余分に流れます。
 * 「視差効果を減らす」設定の方には、止めたままお見せします。
 */
export function LoveFlow({ heavy, light, label }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    const shift = root?.querySelector<HTMLElement>("[data-shift]");
    if (!root || !shift) return;
    if (!window.matchMedia("(prefers-reduced-motion: no-preference)").matches) return;

    let frame = 0;
    let near = false;
    let current: number | null = null;
    let last = 0;

    const tick = (now: number) => {
      frame = 0;

      const box = root.getBoundingClientRect();
      const viewport = window.innerHeight;
      /* 0 は画面の下から入る直前、1 は上へ抜けた直後。 */
      const passed = Math.min(1, Math.max(0, (viewport - box.top) / (viewport + box.height)));
      const target = -passed * DRIFT * window.innerWidth;

      const elapsed = Math.max(0, now - last);
      last = now;

      current = current === null ? target : current + (target - current) * (1 - Math.exp(-elapsed / FOLLOW));
      if (Math.abs(target - current) < 0.5) current = target;

      shift.style.transform = `translate3d(${current.toFixed(1)}px, 0, 0)`;
      if (current !== target) frame = requestAnimationFrame(tick);
    };

    const wake = () => {
      if (frame || !near) return;
      last = performance.now() - 16;
      frame = requestAnimationFrame(tick);
    };

    /* 画面の近くにあるあいだだけ、スクロールを追いかけます。 */
    const observer = new IntersectionObserver(
      ([entry]) => {
        near = entry.isIntersecting;
        wake();
      },
      { rootMargin: "25% 0px" },
    );
    observer.observe(root);

    window.addEventListener("scroll", wake, { passive: true });
    window.addEventListener("resize", wake);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", wake);
      window.removeEventListener("resize", wake);
      shift.style.removeProperty("transform");
    };
  }, []);

  const parts = heavy.split("❤");

  return (
    <div ref={ref} className={styles.flow} style={{ "--copies": COPIES } as CSSProperties}>
      <p className="u-sr-only">{label}</p>
      <div className={styles.shift} data-shift="" aria-hidden="true">
        <div className={styles.track}>
          {Array.from({ length: COPIES }, (_, copy) => (
            <span key={copy} className={styles.unit}>
              <span className={styles.heavy}>
                {parts.map((part, index) => (
                  <Fragment key={index}>
                    {index > 0 ? <Heart className={styles.heart} /> : null}
                    {part}
                  </Fragment>
                ))}
              </span>
              <span className={styles.light}>{light}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
