"use client";

import { useRef, type ReactNode } from "react";

import { useIsomorphicLayoutEffect } from "@/components/useInView";

import { HEART_PATH } from "./handwriting";
import styles from "./HeartVeil.module.css";

/**
 * ハートが広がりきるまでにスクロールする長さと、広がりはじめるときに、目印
 * （紹介文の小見出し）が画面の下端よりどれだけ下にあるか。
 * どちらも、画面の高さに対する割合です。
 */
const SPAN = 0.46;
const LEAD = 0.03;

/** 広がりはじめのハートの傾き（度）。広がるにつれて、まっすぐに起き上がります。 */
const TILT = -16;

/**
 * ハートの形の中心（handwriting.ts の HEART_PATH の座標）と、広がりきったときの
 * 倍率を決める長さ。画面の半分の高さ・幅を、それぞれこの長さで割った大きいほうを
 * 倍率にすると、谷（上のくぼみ）と下の両隅まで、ハートの内側に収まります。
 */
const PIVOT = { x: 50.5, y: 44 };
const COVER = { rise: 21, half: 29 };

/** 小見出しの字が、左から順に現れるときの、ずれの大きさ。 */
const STAGGER = 1.3;

/**
 * 行が下から上がってくる範囲。行の窓の上端が、画面のこの高さからこの高さへ
 * 動くあいだに現れます（画面の高さに対する割合）。
 */
const RISE: readonly [number, number] = [0.93, 0.8];

/** スクロールの動きへ、どれだけ遅れて付いていくか（ミリ秒）。 */
const FOLLOW = 110;

const clamp = (value: number) => Math.min(1, Math.max(0, value));
const easeOut = (value: number) => 1 - (1 - value) ** 3;

type Mark = { el: HTMLElement; top: number; shown: string };

function start(realm: HTMLElement, veil: HTMLElement, tint: HTMLElement, heart: SVGPathElement) {
  const anchor = realm.querySelector<HTMLElement>("[data-veil-anchor]");
  const rule = realm.querySelector<HTMLElement>("[data-rule]");
  const chars: Mark[] = Array.from(realm.querySelectorAll<HTMLElement>("[data-char]"), (el) => ({
    el,
    top: 0,
    shown: "",
  }));
  const lines: Mark[] = Array.from(realm.querySelectorAll<HTMLElement>("[data-rise]"), (el) => ({
    el,
    top: 0,
    shown: "",
  }));

  let width = 1;
  let height = 1;
  let anchorTop = 0;
  let frame = 0;
  let current = window.scrollY;
  let last = 0;
  let mark = "";
  let ruled = "";

  /** 目印と各行の位置を、幕で包んだ範囲の上端から測ります。 */
  const measure = () => {
    width = veil.offsetWidth;
    height = veil.offsetHeight;

    const box = realm.getBoundingClientRect();
    anchorTop = anchor ? anchor.getBoundingClientRect().top - box.top : 0;
    for (const line of lines) {
      /* 行そのものは動かすので、動かない窓（親）の位置を測ります。 */
      const frameBox = (line.el.parentElement ?? line.el).getBoundingClientRect();
      line.top = frameBox.top - box.top;
      line.shown = "";
    }
    mark = "";
    ruled = "";
  };

  const draw = (scroll: number) => {
    /* 包んだ範囲の上端の、画面の中での位置。まだ追いついていないぶんを足して求めます。 */
    const base = realm.getBoundingClientRect().top + (window.scrollY - scroll);
    const label = base + anchorTop;

    /* 幕：小見出しが画面の下から入ってくるのに合わせて、ハートが広がり、地が暗くなります。 */
    const spread = clamp((height * (1 + LEAD) - label) / (height * SPAN));
    const next = spread.toFixed(4);
    if (next !== mark) {
      mark = next;

      const scale = spread * Math.max(height / 2 / COVER.rise, width / 2 / COVER.half);
      const tilt = TILT * (1 - spread) ** 2;
      heart.setAttribute(
        "transform",
        `translate(${(width / 2).toFixed(1)} ${(height / 2).toFixed(1)}) rotate(${tilt.toFixed(2)}) scale(${scale.toFixed(4)}) translate(${-PIVOT.x} ${-PIVOT.y})`,
      );

      /* 地は、下のほうから先に暗くなります。 */
      const shade = (value: number) => (1 - (1 - clamp(value)) ** 1.6).toFixed(3);
      tint.style.setProperty("--top", shade(spread * 1.08 - 0.08));
      tint.style.setProperty("--bottom", shade(spread * 1.08 + 0.04));
    }

    /* 小見出し：左の字から順に、窓の下から上がってきます。 */
    const typed = clamp((height - label) / (height * 0.3));
    chars.forEach((char, index) => {
      const local = clamp(typed * (1 + STAGGER) - (index / Math.max(1, chars.length - 1)) * STAGGER);
      const shown = ((1 - easeOut(local)) * 110).toFixed(1);
      if (shown === char.shown) return;
      char.shown = shown;
      char.el.style.transform = `translate3d(0, ${shown}%, 0)`;
    });

    if (rule) {
      const drawn = easeOut(clamp((height * 1.02 - label) / (height * 0.34))).toFixed(3);
      if (drawn !== ruled) {
        ruled = drawn;
        rule.style.transform = `scaleX(${drawn})`;
      }
    }

    /* 本文：行ごとに、窓の下から上がってきます。 */
    for (const line of lines) {
      const top = base + line.top;
      const risen = easeOut(clamp((height * RISE[0] - top) / (height * (RISE[0] - RISE[1]))));
      const shown = ((1 - risen) * 108).toFixed(1);
      if (shown === line.shown) continue;
      line.shown = shown;
      line.el.style.transform = `translate3d(0, ${shown}%, 0)`;
    }
  };

  const tick = (now: number) => {
    frame = 0;

    const target = window.scrollY;
    const elapsed = Math.max(0, now - last);
    last = now;

    current += (target - current) * (1 - Math.exp(-elapsed / FOLLOW));
    if (Math.abs(target - current) < 0.5) current = target;

    draw(current);
    if (current !== target) frame = requestAnimationFrame(tick);
  };

  const wake = () => {
    if (frame) return;
    last = performance.now() - 16;
    frame = requestAnimationFrame(tick);
  };

  const refresh = () => {
    measure();
    draw(current);
  };

  realm.dataset.veil = "on";
  refresh();

  const observer = new ResizeObserver(refresh);
  observer.observe(realm);

  window.addEventListener("scroll", wake, { passive: true });
  window.addEventListener("resize", refresh);
  document.fonts.addEventListener("loadingdone", refresh);

  return () => {
    cancelAnimationFrame(frame);
    observer.disconnect();
    window.removeEventListener("scroll", wake);
    window.removeEventListener("resize", refresh);
    document.fonts.removeEventListener("loadingdone", refresh);

    delete realm.dataset.veil;
    heart.removeAttribute("transform");
    tint.style.removeProperty("--top");
    tint.style.removeProperty("--bottom");
    rule?.style.removeProperty("transform");
    for (const item of [...chars, ...lines]) item.el.style.removeProperty("transform");
  };
}

/**
 * 流れる大きな文字から、暗い画面へ移る幕。
 *
 * 包んだ範囲（流れる文字、紹介文、業種のギャラリー）の背景を受け持ちます。
 * 紹介文が画面の下から入ってくると、中央に暗いハートが現れ、スクロールに合わせて
 * 広がって、画面ぜんたいを覆います。そのあとは、包んだ範囲が終わるまで、暗い地の
 * まま画面に残ります。紹介文（About.tsx）の字を動かすのも、ここの役目です。
 *
 * JavaScript を無効にしている方と、「視差効果を減らす」設定の方には、幕を出さず、
 * 紹介文とギャラリーが、それぞれ自分の暗い背景で並びます。
 */
export function HeartVeil({ children }: { children: ReactNode }) {
  const realmRef = useRef<HTMLDivElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);
  const tintRef = useRef<HTMLSpanElement>(null);
  const heartRef = useRef<SVGPathElement>(null);

  useIsomorphicLayoutEffect(() => {
    const realm = realmRef.current;
    const veil = veilRef.current;
    const tint = tintRef.current;
    const heart = heartRef.current;
    if (!realm || !veil || !tint || !heart) return;

    const motion = window.matchMedia("(prefers-reduced-motion: no-preference)");
    let stop: (() => void) | null = null;

    const sync = () => {
      if (motion.matches && !stop) {
        stop = start(realm, veil, tint, heart);
      } else if (!motion.matches && stop) {
        stop();
        stop = null;
      }
    };

    sync();
    motion.addEventListener("change", sync);

    return () => {
      motion.removeEventListener("change", sync);
      stop?.();
    };
  }, []);

  return (
    <div ref={realmRef} className={styles.realm}>
      {/* 幕の通り道。包んだ範囲より、画面ひとつ分だけ上から始めます。 */}
      <div className={styles.track} aria-hidden="true">
        <div ref={veilRef} className={styles.veil}>
          <span ref={tintRef} className={styles.tint} />
          <svg className={styles.heart} focusable="false">
            <path ref={heartRef} d={HEART_PATH} transform="scale(0)" />
          </svg>
        </div>
      </div>
      {children}
    </div>
  );
}
