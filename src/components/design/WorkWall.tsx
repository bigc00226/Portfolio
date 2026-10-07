"use client";

import Image, { type StaticImageData } from "next/image";
import { useRef, type CSSProperties } from "react";

import { useIsomorphicLayoutEffect } from "@/components/useInView";

import { HEART_PATH } from "./handwriting";
import { MoreButton } from "./MoreButton";
import { MOTION_OK, clamp, pageTop, range, startClock } from "./scrollClock";
import styles from "./WorkWall.module.css";

/**
 * 写真の壁の形。長さは「壁の単位」（画面の幅の 1/100。縦長の画面では、高さから決めます）で
 * 書いています。数字は、参考にした画面の、写真の四隅と動きを測って合わせたものです。
 *
 * 手前の列は、外側の端がこちらへ迫り出すように傾いた壁で、スクロールの SPEED 倍の速さで
 * 上へ流れます。奥の列は、正面を向いた暗い壁で、ゆっくり流れます。
 */
const NEAR = {
  /** 列の中心の、画面の中央からの距離。 */
  center: 22.2,
  /** 壁の傾き（度）。 */
  tilt: 38.5,
  /** 区画の上端が画面の上端に着いたときの、最初の写真の上端（画面の中央から下へ）。 */
  start: 13.7,
  /** スクロール 1 に対して、壁が上へ流れる量。 */
  speed: 2.18,
};
const FAR = { center: 16.1, start: 10.8, speed: 1.2 };

/** 壁が現れる範囲。区画の上端が画面の上端を過ぎてからの、スクロール量です。 */
const APPEAR: readonly [number, number] = [1, 9];

/**
 * 前の区画（白いカード）が上へ抜けていくあいだ、この区画の文字は、その下から
 * スクロールの半分の速さで現れます。REVEAL は、その遅れの割合です。
 */
const REVEAL = 0.5;

/**
 * 手書きの一語を書く範囲。線の絵の上端が、画面のこの高さからこの高さへ上がる
 * あいだに、書き終えます（画面の高さに対する割合）。
 */
const WRITE: readonly [number, number] = [0.73, 0.14];

/**
 * 手書きの線。「Love.」を、ひと筆で書いています（最後の点は別です）。
 * 見出しの最後の一語を変える場合は、この線も描き直してください。
 */
const SCRIPT = {
  viewBox: "0 0 640 280",
  stroke:
    "M 156 84 C 166 50 140 28 112 40 C 80 54 78 104 86 140 C 94 178 98 204 80 224 C 64 242 34 236 34 214 " +
    "C 34 194 62 190 84 204 C 112 222 150 238 186 224 C 206 216 212 196 222 180 C 234 160 262 152 274 170 " +
    "C 286 190 274 222 252 228 C 230 234 214 214 224 190 C 232 172 252 160 270 166 C 286 172 300 172 314 158 " +
    "C 322 176 328 212 340 228 C 352 214 364 184 374 160 C 380 148 396 150 396 164 C 396 178 384 190 404 192 " +
    "C 426 194 456 190 460 172 C 464 154 440 144 424 160 C 406 178 408 216 432 228 C 456 238 492 224 514 196",
  dot: { x: 548, y: 224 },
};

type Props = {
  id: string;
  label: string;
  statement: readonly string[];
  title: { first: string; second: string; third: string; accent: string; script: string };
  button: { label: string; href: string };
  /** 手前の列（左、右）と、奥の列（左、右）の写真。 */
  near: readonly (readonly StaticImageData[])[];
  far: readonly (readonly StaticImageData[])[];
};

/** 壁の単位。WorkWall.module.css の --wu と同じ式です。 */
const unitOf = (width: number, height: number) =>
  Math.max(width, Math.min(height * 1.1, width * 2.2)) / 100;

/**
 * 仕事の進め方の区画。
 *
 * サーバーが返す HTML では、文章と見出し、ボタンが、そのまま並んでいます。
 * JavaScript を無効にしている方と、「視差効果を減らす」設定の方には、写真の壁を
 * 動かさずに、背景として置いたままお見せします。それ以外の環境では、スクロールに
 * 合わせて、左右の写真の壁が奥行きを持って上へ流れ、見出しの最後の一語が、
 * 手書きで書かれていきます。
 */
export function WorkWall({ id, label, statement, title, button, near, far }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const wallRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const scriptRef = useRef<SVGSVGElement>(null);

  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    const wall = wallRef.current;
    const content = contentRef.current;
    const intro = introRef.current;
    const script = scriptRef.current;
    if (!section || !wall || !content || !intro || !script) return;

    const motion = window.matchMedia(MOTION_OK);
    const columns = Array.from(wall.querySelectorAll<HTMLElement>("[data-column]"), (el) => ({
      el,
      rule: el.dataset.column === "near" ? NEAR : FAR,
      /* 左の列は -1、右の列は +1。 */
      side: el.dataset.side === "left" ? -1 : 1,
      shown: "",
    }));
    const pen = script.querySelector<SVGPathElement>("[data-pen]");
    const extras = Array.from(script.querySelectorAll<SVGElement>("[data-after]"));

    let stop: (() => void) | null = null;

    const start = () => {
      let top = 0;
      let scriptTop = 0;
      let height = 1;
      let unit = 1;
      let lifted = "";
      let faded = "";
      let written = "";

      const measure = () => {
        height = window.innerHeight;
        unit = unitOf(window.innerWidth, height);
        top = pageTop(section);
        /* 文字は動かすので、transform の影響を受けない、組版の上での位置を使います。 */
        scriptTop = top + content.offsetTop + (script.parentElement?.offsetTop ?? 0);
        lifted = "";
        faded = "";
        written = "";
        for (const column of columns) column.shown = "";
      };

      const draw = (scroll: number) => {
        /* 区画の上端が画面の上端を過ぎてからのスクロール量。その前は、マイナスです。 */
        const passed = scroll - top;

        /* 文字：前の区画の下から、半分の速さで現れます。 */
        const covered = clamp(-passed, 0, height);
        const lift = (-covered * REVEAL).toFixed(1);
        if (lift !== lifted) {
          lifted = lift;
          content.style.transform = `translate3d(0, ${lift}px, 0)`;
          intro.style.opacity = (1 - 0.95 * (covered / height)).toFixed(3);
        }

        /* 壁：区画が画面を占めてから現れ、列ごとの速さで、上へ流れていきます。 */
        const alpha = range(APPEAR[0] * unit, APPEAR[1] * unit, passed).toFixed(3);
        if (alpha !== faded) {
          faded = alpha;
          wall.style.opacity = alpha;
        }
        if (alpha !== "0.000") {
          for (const column of columns) {
            const { rule, side } = column;
            const x = side * rule.center * unit;
            const y = rule.start * unit - rule.speed * passed;
            const mark = `${x.toFixed(1)},${y.toFixed(1)}`;
            if (mark === column.shown) continue;
            column.shown = mark;
            column.el.style.transform =
              rule === NEAR
                ? `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotateY(${-side * NEAR.tilt}deg)`
                : `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
          }
        }

        /* 手書き：線の絵が画面を上がっていくのに合わせて、書いていきます。 */
        const ink = range(WRITE[0] * height, WRITE[1] * height, scriptTop - scroll).toFixed(4);
        if (ink !== written) {
          written = ink;
          const done = Number(ink);
          /* 線は全体の 9 割で書き終え、残りで、点とハートを置きます。 */
          if (pen) pen.style.strokeDashoffset = (1 - range(0, 0.9, done)).toFixed(4);
          extras.forEach((extra, index) => {
            const shown = range(0.9 + index * 0.03, 0.94 + index * 0.03, done);
            extra.style.opacity = shown.toFixed(3);
            extra.style.transform = `scale(${(0.4 + 0.6 * shown).toFixed(3)})`;
          });
        }
      };

      const clock = startClock(draw);
      const refresh = () => {
        measure();
        clock.refresh();
      };

      section.dataset.live = "";
      refresh();

      const observer = new ResizeObserver(refresh);
      observer.observe(document.body);
      window.addEventListener("resize", refresh);
      document.fonts.addEventListener("loadingdone", refresh);

      return () => {
        clock.stop();
        observer.disconnect();
        window.removeEventListener("resize", refresh);
        document.fonts.removeEventListener("loadingdone", refresh);

        delete section.dataset.live;
        content.style.transform = "";
        intro.style.opacity = "";
        wall.style.opacity = "";
        for (const column of columns) column.el.style.transform = "";
        if (pen) pen.style.strokeDashoffset = "";
        for (const extra of extras) {
          extra.style.opacity = "";
          extra.style.transform = "";
        }
      };
    };

    const sync = () => {
      if (motion.matches && !stop) {
        stop = start();
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

  const column = (images: readonly StaticImageData[], kind: "near" | "far", side: "left" | "right") => (
    <div
      className={`${styles.column} ${kind === "near" ? styles.near : styles.far}`}
      data-column={kind}
      data-side={side}
      style={{ "--side": side === "left" ? -1 : 1 } as CSSProperties}
    >
      {images.map((image, index) => (
        <span key={`${image.src}-${index}`} className={styles.photo}>
          <Image src={image} alt="" fill sizes="(max-width: 760px) 44vw, 22vw" />
        </span>
      ))}
    </div>
  );

  return (
    <section ref={sectionRef} id={id} className={styles.work} aria-labelledby={`${id}-title`}>
      {/* 写真の壁。飾りなので、読み上げからは外します。 */}
      <div className={styles.backdrop} aria-hidden="true">
        <div ref={wallRef} className={styles.wall}>
          {column(far[0], "far", "left")}
          {column(far[1], "far", "right")}
          {column(near[0], "near", "left")}
          {column(near[1], "near", "right")}
        </div>
      </div>

      <div ref={contentRef} className={styles.content}>
        <div ref={introRef} className={styles.intro}>
          <p className={styles.label} lang="en">
            {label}
          </p>
          <span className={styles.rule} aria-hidden="true" />
          <p className={styles.statement}>
            {statement.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </p>
        </div>

        <h2 id={`${id}-title`} className={styles.title} lang="en">
          <span className={styles.heavy}>{title.first}</span>{" "}
          <span className={styles.light}>{title.second}</span>{" "}
          <span className={styles.last}>
            <span className={styles.heavy}>{title.third}</span>{" "}
            <em className={styles.serif}>{title.accent}</em>
          </span>{" "}
          {/* 最後の一語は、下の線の絵で見せます。読み上げ用に、文字でも置いておきます。 */}
          <span className="u-sr-only">{title.script}</span>
        </h2>

        <div className={styles.scriptBox} aria-hidden="true">
          <svg ref={scriptRef} className={styles.script} viewBox={SCRIPT.viewBox} focusable="false">
            <path className={styles.pen} d={SCRIPT.stroke} pathLength={1} data-pen="" />
            <circle className={styles.dot} cx={SCRIPT.dot.x} cy={SCRIPT.dot.y} r="9" data-after="" />
            <path
              className={styles.spark}
              d={HEART_PATH}
              transform="translate(566 96) rotate(14) scale(0.44)"
              data-after=""
            />
            <path
              className={styles.spark}
              d={HEART_PATH}
              transform="translate(520 40) rotate(-12) scale(0.26)"
              data-after=""
            />
          </svg>
        </div>

        <MoreButton className={styles.more} href={button.href} label={button.label} />
      </div>
    </section>
  );
}
