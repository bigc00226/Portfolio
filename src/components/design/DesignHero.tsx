"use client";

import { useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";

import { useIsomorphicLayoutEffect } from "@/components/useInView";

import styles from "./Design.module.css";
import { buildHearts } from "./hearts";
import type { Ribbon } from "./ribbon";

export type HeroCopy = {
  first: string;
  middle: string;
  last: string;
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

/**
 * 舞台を固定しておく長さ（画面の高さの 100 分の 1 が単位）。
 * 大きくするほど、帯がゆっくり回ります。
 */
const PIN = 190;

/** スクロールの動きを、絵がこの時間（ミリ秒）で追いかけます。 */
const FOLLOW = 110;

/**
 * 手書きの線を書く区間と、消していく区間（固定しているあいだの進み具合）。
 * 消すのは左のハートと下線だけで、右のハートは最後まで残します。
 */
const WRITE = [0.05, 0.3] as const;
const WIPE = [0.6, 0.95] as const;

/**
 * 見出しの各行が抜けていく時期。固定が外れる瞬間を 0 として、画面の高さ
 * ひとつ分のスクロールを 1 と数えます。上の行ほど早く、速く抜けます。
 */
const EXITS = [
  { from: -0.42, span: 0.5 },
  { from: -0.38, span: 0.57 },
  { from: -0.34, span: 0.64 },
];

const clamp01 = (value: number) => (value < 0 ? 0 : value > 1 ? 1 : value);
const ease = (x: number) => x * x * (3 - 2 * x);
const range = (from: number, to: number, value: number) => clamp01((value - from) / (to - from));

/** 欧文のまとまりを包みます。和文と高さがそろうよう、CSS で少し大きく組みます。 */
function mixed(text: string) {
  return text.split(/([A-Za-z0-9]+)/).map((run, index) =>
    index % 2 === 1 ? (
      <span key={index} className={styles.latin}>
        {run}
      </span>
    ) : (
      run
    ),
  );
}

/**
 * ページの最初の画面。写真の帯が、大きな見出しの前後を、輪を描いて回っていきます。
 *
 * サーバーが返す HTML は、見出しと画像の並びだけの、動かない画面です。
 * JavaScript を無効にしている方と、「視差効果を減らす」設定の方には、
 * そのままお見せします。動かせる環境では舞台を画面に固定し、スクロール量を
 * 帯の進み具合・ハートを書く手書きの線・見出しの退場に置き換えます。
 */
export function DesignHero({ copy, frames, fallback }: DesignHeroProps) {
  const heroRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);
  const frontRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLParagraphElement>(null);
  const [cinema, setCinema] = useState(false);

  /* 二行目は全角の文字で書く前提で、文字数からハートの位置を決めます。 */
  const hearts = useMemo(() => buildHearts(Array.from(copy.middle).length), [copy.middle]);

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
    if (!cinema || !hero || !stage || !back || !front) return;

    const exits = Array.from(stage.querySelectorAll<HTMLElement>("[data-exit]"));
    const cue = cueRef.current;
    const root = document.documentElement;

    /* 手書きの線（左のハート、下線、右のハート）と、ハートの塗り（左、右）。 */
    const pens = Array.from(stage.querySelectorAll<SVGPathElement>("[data-pen]"));
    const fills = Array.from(stage.querySelectorAll<SVGPathElement>("[data-heart]"));
    const inks = pens.map((pen) => pen.getTotalLength());
    const inkTotal = inks.reduce((sum, length) => sum + length, 0);
    const firstInk = inks[0] ?? 0;
    const lastInk = inks[inks.length - 1] ?? 0;

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
    let onStage = true;
    let frame = 0;
    let before = 0;

    const measure = () => {
      stageHeight = stage.offsetHeight;
      travel = Math.max(1, hero.offsetHeight - stageHeight);
      ribbon?.resize(stage.offsetWidth, stageHeight);
      dirty = true;
    };

    /** 舞台が画面の上へ流れきる位置。 */
    const leaveAt = () => travel + stageHeight - 1;

    /** 固定が外れて舞台が流れていくあいだも、流れきるまで数えます。 */
    const read = () => {
      const rect = hero.getBoundingClientRect();
      visible = rect.bottom > 0 && rect.top < window.innerHeight;
      return Math.min(Math.max(-rect.top, 0), travel + stageHeight);
    };

    const draw = (scrolled: number, now: number) => {
      /* 固定しているあいだが 0〜1。固定が外れたあとは 1 を超えていきます。 */
      const progress = scrolled / travel;
      /* 固定が外れる瞬間を 0 とした、画面の高さひとつ分を 1 とする時計。 */
      const released = (scrolled - travel) / stageHeight;

      /* 手書きの線：書いて、しばらく見せて、書き始めのほうから消していきます。 */
      const drawn = range(WRITE[0], WRITE[1], progress) * inkTotal;
      const wiped = ease(range(WIPE[0], WIPE[1], progress)) * (inkTotal - lastInk);
      let start = 0;
      pens.forEach((pen, index) => {
        const length = inks[index];
        const from = Math.max(wiped, start);
        const to = Math.min(drawn, start + length);
        if (to - from < 0.05) {
          pen.style.opacity = "0";
        } else {
          pen.style.opacity = "1";
          pen.style.strokeDasharray = `${((to - from) / length).toFixed(4)} 1`;
          pen.style.strokeDashoffset = (-(from - start) / length).toFixed(4);
        }
        start += length;
      });

      /* ハートは、線がひとまわりしたところで塗られます。左は、線と一緒に消えます。 */
      const filled = [
        range(firstInk * 0.86, firstInk * 1.1, drawn) * (1 - range(0, firstInk * 0.7, wiped)),
        range(inkTotal - lastInk * 0.14, inkTotal, drawn),
      ];
      fills.forEach((fill, index) => {
        fill.style.opacity = (filled[index] ?? 0).toFixed(3);
      });

      /* 見出しは、ゆっくり動きだして、上の行から順に抜けていきます。 */
      exits.forEach((line, index) => {
        const { from, span } = EXITS[Math.min(index, EXITS.length - 1)];
        const out = range(from, from + span, released) ** 1.8;
        line.style.transform = `translate3d(0, ${(-out * 104).toFixed(2)}%, 0)`;
      });

      if (cue) cue.style.opacity = (1 - range(0, 0.05, progress)).toFixed(3);

      /* 帯は、固定が外れたあとも、舞台が流れ去るまで回りつづけます。 */
      return ribbon?.render(progress, lookX, lookY, now) ?? false;
    };

    const tick = (now: number) => {
      const elapsed = Math.min(now - before, 250);
      before = now;
      target = read();

      /*
       * 舞台が画面に残っているあいだは、ページ共通のヘッダーも画面に残して
       * もらいます（SiteHeader.module.css が、この目印を見ています）。
       */
      if (target < leaveAt() !== onStage) {
        onStage = !onStage;
        root.setAttribute("data-design-hero", onStage ? "on" : "left");
      }

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
        /* 帯が自分で動いている最中なら、次のコマも描きます。 */
        dirty = draw(shown, now);
      }

      frame =
        shown === target && settled && !(dirty && visible) ? 0 : requestAnimationFrame(tick);
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
    onStage = target < leaveAt();
    root.setAttribute("data-design-hero", onStage ? "on" : "left");
    draw(shown, performance.now());
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
      root.removeAttribute("data-design-hero");
      for (const pen of pens) {
        pen.style.strokeDasharray = "";
        pen.style.strokeDashoffset = "";
        pen.style.opacity = "";
      }
      for (const fill of fills) fill.style.opacity = "";
      for (const line of exits) line.style.transform = "";
      if (cue) cue.style.opacity = "";
    };
  }, [cinema, frames, hearts]);

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
            <span className={styles.line}>{line(mixed(copy.first), 0)}</span>{" "}
            <span className={styles.line}>
              {line(
                <>
                  <span className={styles.heartSlot} aria-hidden="true" />
                  {mixed(copy.middle)}
                  <span className={styles.heartSlot} aria-hidden="true" />
                  {/* 淡い色のハート。行と一緒に動き、上から赤い線でなぞられます。 */}
                  <svg
                    className={`${styles.overlay} ${styles.ghost}`}
                    viewBox={hearts.viewBox}
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path d={hearts.fills[0]} />
                    <path d={hearts.fills[1]} />
                  </svg>
                </>,
                1,
              )}
              {/* 手書きの線と、塗られたハート。見出しが抜けたあとも、その場に残ります。 */}
              <svg
                className={`${styles.overlay} ${styles.script}`}
                viewBox={hearts.viewBox}
                aria-hidden="true"
                focusable="false"
              >
                {hearts.fills.map((d) => (
                  <path key={d} className={styles.fill} d={d} data-heart="" />
                ))}
                {hearts.pens.map((d) => (
                  <path key={d} className={styles.pen} d={d} pathLength={1} data-pen="" />
                ))}
              </svg>
            </span>{" "}
            <span className={styles.line}>{line(mixed(copy.last), 2)}</span>
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
