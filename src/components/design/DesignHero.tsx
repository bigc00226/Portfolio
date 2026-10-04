"use client";

import { useRef, useState, type CSSProperties, type ReactNode } from "react";

import { useIsomorphicLayoutEffect } from "@/components/useInView";

import styles from "./Design.module.css";
import type { Ribbon } from "./ribbon";

export type HeroCopy = {
  first: string;
  solid: string;
  ghost: string;
  last: string;
  reading: string;
  sideLeft: string;
  sideRight: string;
  scrollLabel: string;
};

type DesignHeroProps = {
  copy: HeroCopy;
  /** 帯に並べる画像の URL。大きい画面用と、小さい画面用。 */
  frames: { large: string; small: string }[];
  /** 帯を 3D で描けないときに代わりに見せる、画像の並び。 */
  fallback: ReactNode;
};

const MOTION_OK = "(prefers-reduced-motion: no-preference)";

/** 舞台を固定しておく長さ（画面の高さの 100 分の 1 が単位）。 */
const PIN = 260;

/** スクロールの動きを、絵がこの時間（ミリ秒）で追いかけます。 */
const FOLLOW = 110;

/** 手書きの「Loved」。一本の線で、左から右へ書き順どおりに並んでいます。 */
const SCRIPT =
  "M 96 262 C 150 214 232 96 212 56 C 198 28 152 50 152 112 C 152 214 166 312 122 380 C 96 420 44 396 70 360 C 96 326 170 404 252 392 C 300 384 350 320 365 276 C 372 250 330 246 305 280 C 280 316 282 380 322 392 C 360 402 386 330 366 276 C 380 300 410 300 430 268 C 446 300 456 392 478 392 C 506 392 526 310 536 262 C 540 290 558 322 586 338 C 640 334 666 270 626 258 C 586 248 570 330 586 366 C 602 400 660 400 700 350 C 740 320 790 290 816 270 C 800 248 740 250 722 320 C 706 386 776 410 812 340 C 840 286 880 150 872 70 C 866 30 822 60 826 150 C 830 260 822 360 858 390 C 890 412 940 380 970 330";

/** 手書きの線のうち、最後まで残しておく部分（「ed」）の始まり。 */
const SCRIPT_KEEP = 0.53;

const clamp01 = (value: number) => (value < 0 ? 0 : value > 1 ? 1 : value);
const ease = (x: number) => x * x * (3 - 2 * x);
const range = (from: number, to: number, value: number) => clamp01((value - from) / (to - from));

/**
 * ページの最初の画面。大きな見出しのあいだを、写真の帯がくぐり抜けていきます。
 *
 * サーバーが返す HTML は、見出しと画像の並びだけの、動かない画面です。
 * JavaScript を無効にしている方と、「視差効果を減らす」設定の方には、
 * そのままお見せします。動かせる環境では舞台を画面に固定し、スクロール量を
 * 帯の進み具合・手書きの線の長さ・見出しの退場に置き換えます。
 */
export function DesignHero({ copy, frames, fallback }: DesignHeroProps) {
  const heroRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);
  const frontRef = useRef<HTMLDivElement>(null);
  const scriptRef = useRef<SVGPathElement>(null);
  const cueRef = useRef<HTMLParagraphElement>(null);
  const [cinema, setCinema] = useState(false);

  useIsomorphicLayoutEffect(() => {
    const query = window.matchMedia(MOTION_OK);
    const sync = () => setCinema(query.matches);

    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useIsomorphicLayoutEffect(() => {
    const hero = heroRef.current;
    const stage = stageRef.current;
    const back = backRef.current;
    const front = frontRef.current;
    const script = scriptRef.current;
    if (!cinema || !hero || !stage || !back || !front || !script) return;

    const exits = Array.from(stage.querySelectorAll<HTMLElement>("[data-exit]"));
    const cue = cueRef.current;

    let ribbon: Ribbon | null = null;
    let disposed = false;
    let travel = 1;
    let stageHeight = 1;
    let target = 0;
    let shown = 0;
    let pointerX = 0;
    let pointerY = 0;
    let lookX = 0;
    let lookY = 0;
    let snap = true;
    let dirty = true;
    let visible = true;
    let frame = 0;
    let before = 0;

    const measure = () => {
      stageHeight = stage.offsetHeight;
      travel = Math.max(1, hero.offsetHeight - stageHeight);
      ribbon?.resize(stage.offsetWidth, stageHeight);
      dirty = true;
    };

    /** 固定が外れて舞台が流れていくあいだも、少し先まで数えます。 */
    const read = () => {
      const rect = hero.getBoundingClientRect();
      visible = rect.bottom > 0 && rect.top < window.innerHeight;
      return Math.min(Math.max(-rect.top, 0), travel + stageHeight);
    };

    const draw = (scrolled: number) => {
      /* 固定しているあいだが 0〜1。固定が外れたあとは 1 を超えていきます。 */
      const pinned = scrolled / travel;
      /* 見出しが抜けていく時計。画面の高さひとつ分のスクロールで 1 進みます。 */
      const leaving = (scrolled - travel) / stageHeight + 0.06;

      /* 手書きの線：書いて、しばらく見せて、書き始めのほうから消していきます。 */
      const written = ease(range(0.16, 0.36, pinned));
      const erased = SCRIPT_KEEP * ease(range(0.74, 1, pinned));
      const length = written - erased;
      script.style.strokeDasharray = `${Math.max(length, 0).toFixed(4)} 1`;
      script.style.strokeDashoffset = (-erased).toFixed(4);
      script.style.opacity = length > 0.002 ? "1" : "0";

      /* 見出しは、固定が外れる少し前から、上の行から順に抜けていきます。 */
      exits.forEach((line, index) => {
        const out = ease(range(0, 0.3, leaving - index * 0.045));
        line.style.transform = `translate3d(0, ${(-out * 104).toFixed(2)}%, 0)`;
      });

      if (cue) cue.style.opacity = (1 - range(0, 0.06, pinned)).toFixed(3);

      /* 帯は、固定が外れたあともしばらく奥へ進みつづけます。 */
      ribbon?.render(clamp01(scrolled / (travel + stageHeight * 0.85)), lookX, lookY);
    };

    const tick = (now: number) => {
      const elapsed = Math.min(now - before, 250);
      before = now;
      target = read();

      const follow = 1 - Math.exp(-elapsed / FOLLOW);
      const gap = target - shown;
      const moved = snap || Math.abs(gap) < 0.5 ? target : shown + gap * follow;
      snap = false;

      const nextX = lookX + (pointerX - lookX) * follow * 0.6;
      const nextY = lookY + (pointerY - lookY) * follow * 0.6;
      const settled = Math.abs(pointerX - nextX) < 0.002 && Math.abs(pointerY - nextY) < 0.002;

      const changed = moved !== shown || nextX !== lookX || nextY !== lookY;
      shown = moved;
      lookX = settled ? pointerX : nextX;
      lookY = settled ? pointerY : nextY;

      /* 画面の外にあるあいだは描かず、戻ってきたときに描き直します。 */
      if (changed) dirty = true;
      if (dirty && visible) {
        dirty = false;
        draw(shown);
      }

      frame = shown === target && settled ? 0 : requestAnimationFrame(tick);
    };

    const request = () => {
      if (frame) return;
      before = performance.now();
      frame = requestAnimationFrame(tick);
    };

    const resize = () => {
      measure();
      snap = true;
      request();
    };

    const point = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      pointerX = (event.clientX / window.innerWidth) * 2 - 1;
      pointerY = (event.clientY / window.innerHeight) * 2 - 1;
      if (visible) request();
    };

    measure();
    target = read();
    shown = target;
    draw(shown);
    dirty = false;

    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", point, { passive: true });
    const observer =
      typeof ResizeObserver === "undefined" ? null : new ResizeObserver(resize);
    observer?.observe(stage);

    /*
     * Three.js は大きいので、このページを動かせるときにだけ読みこみます。
     * WebGL が使えない環境では失敗するので、そのときは画像の並びを残します。
     */
    void import("./ribbon")
      .then(({ createRibbon }) => {
        if (disposed) return;
        const small = window.matchMedia("(max-width: 760px)").matches;
        ribbon = createRibbon(
          back,
          front,
          frames.map((item) => (small ? item.small : item.large)),
          (loaded) => {
            /* はじめの数枚がそろってから、帯を見せます。 */
            if (loaded >= Math.min(3, frames.length)) hero.setAttribute("data-ribbon", "on");
            dirty = true;
            request();
          },
        );
        measure();
        request();
      })
      .catch(() => {
        if (disposed) return;
        hero.setAttribute("data-ribbon", "off");
        /* 固定しておく長さが変わるので、測り直します。 */
        resize();
      });

    return () => {
      disposed = true;
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", point);
      observer?.disconnect();
      if (frame) cancelAnimationFrame(frame);
      ribbon?.dispose();

      hero.removeAttribute("data-ribbon");
      script.style.strokeDasharray = "";
      script.style.strokeDashoffset = "";
      script.style.opacity = "";
      for (const line of exits) line.style.transform = "";
      if (cue) cue.style.opacity = "";
    };
  }, [cinema, frames]);

  const line = (children: ReactNode, index: number) => (
    <span className={styles.mask}>
      <span className={styles.exit} data-exit="">
        <span className={styles.rise} style={{ "--i": index } as CSSProperties}>
          {children}
        </span>
      </span>
    </span>
  );

  return (
    <section
      ref={heroRef}
      className={cinema ? `${styles.hero} ${styles.cinema}` : styles.hero}
      style={{ "--pin": PIN } as CSSProperties}
      aria-labelledby="design-headline"
    >
      <div ref={stageRef} className={styles.stage}>
        {/* 帯を描くキャンバスの入れもの。中身は ribbon.ts が置きます。 */}
        <div ref={backRef} className={`${styles.layer} ${styles.back}`} aria-hidden="true" />

        <div className={styles.type}>
          <h1 id="design-headline" className={styles.headline}>
            {/* 行のあいだの空白は、読み上げや検索で語がつながらないようにするためのものです。 */}
            <span lang="en">
              <span className={styles.line}>{line(copy.first, 0)}</span>{" "}
              <span className={styles.line}>
                {line(
                  <>
                    {copy.solid}
                    <span className={styles.ghost}>{copy.ghost}</span>
                  </>,
                  1,
                )}
                <svg
                  className={styles.script}
                  viewBox="0 0 1040 470"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path ref={scriptRef} d={SCRIPT} pathLength={1} />
                </svg>
              </span>{" "}
              <span className={styles.line}>{line(copy.last, 2)}</span>
            </span>{" "}
            {/* 英字の見出しを、日本語で補います。 */}
            <span className="u-sr-only">{copy.reading}</span>
          </h1>
        </div>

        <div ref={frontRef} className={`${styles.layer} ${styles.front}`} aria-hidden="true" />

        <div className={styles.strip} aria-hidden="true">
          {fallback}
        </div>

        <p className={`mono ${styles.side} ${styles.sideLeft}`} lang="en">
          {copy.sideLeft}
        </p>
        <p className={`mono ${styles.side} ${styles.sideRight}`} lang="en">
          {copy.sideRight}
        </p>

        <p ref={cueRef} className={styles.cue}>
          <span className={styles.cueRail} aria-hidden="true">
            <span className={styles.cueDot} />
          </span>
          <span className="mono">{copy.scrollLabel}</span>
        </p>
      </div>
    </section>
  );
}
