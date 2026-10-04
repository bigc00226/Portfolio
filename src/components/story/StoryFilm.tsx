"use client";

import { useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";

import { useIsomorphicLayoutEffect } from "@/components/useInView";

import styles from "./Story.module.css";
import { PAN, buildTimeline } from "./timeline";

export type FilmChapter = {
  title: string;
  weight: number;
  /** 章へ移動するリンクの読み上げ用の文言。 */
  jumpLabel: string;
};

type StoryFilmProps = {
  chapters: FilmChapter[];
  label: string;
  railLabel: string;
  skipLabel: string;
  /** 「物語をとばす」の行き先。 */
  skipHref: string;
  /** サーバー側で描いた各章。 */
  children: ReactNode;
};

const MOTION_OK = "(prefers-reduced-motion: no-preference)";

/** スクロールの動きを、絵がこの時間（ミリ秒）で追いかけます。 */
const FOLLOW = 85;

/**
 * 舞台が画面に入ってきてから固定されるまでのあいだに、最初の章を
 * ここまで進めておきます。何もない舞台を見せる時間をなくすためです。
 */
const LEAD_IN = 0.12;

const clamp01 = (value: number) => (value < 0 ? 0 : value > 1 ? 1 : value);
const smoother = (x: number) => x * x * x * (x * (x * 6 - 15) + 10);
/** 送られていく絵は、画面の端に近づいてから薄くします。 */
const fadeLate = (distance: number) => 1 - smoother(clamp01((distance - 0.4) / 0.6));

/** 絵の中で動く要素ひとつ。a〜b が、章の進み具合のうちの持ち場です。 */
type Part = {
  el: SVGElement;
  a: number;
  speed: number;
  shown: number;
  /** その要素の CSS アニメーション。取り出せない環境では null のままです。 */
  clock: Animation | null;
};

type ChapterNode = {
  el: HTMLElement;
  shot: HTMLElement;
  caption: HTMLElement;
  beats: HTMLElement | null;
  parts: Part[];
  /** アニメーションを取り出し済みかどうか。 */
  wound: boolean;
  live: boolean;
  /** 直前に書きこんだ値。同じ値は書き直しません。 */
  t: number;
  shift: number;
  fade: number;
  words: number;
};

/** 絵の側（scenes/kit.tsx の span）が書いた持ち場を読み取ります。 */
function readParts(root: HTMLElement): Part[] {
  const parts: Part[] = [];
  for (const el of root.querySelectorAll<SVGElement>('[style*="--a"]')) {
    const a = Number.parseFloat(el.style.getPropertyValue("--a"));
    const b = Number.parseFloat(el.style.getPropertyValue("--b"));
    if (Number.isFinite(a) && Number.isFinite(b) && b > a) {
      parts.push({ el, a, speed: 1 / (b - a), shown: -1, clock: null });
    }
  }
  return parts;
}

/**
 * 物語を「フィルム」として再生します。
 *
 * サーバーが返す HTML では、章が上から順に並んだ読みものです。JavaScript を
 * 無効にしている方と、「視差効果を減らす」設定の方には、そのままお見せします。
 * 動かせる環境では、画面が描かれる前に上映用の配置へ切り替え、舞台を画面に
 * 固定したうえで、スクロール位置を各章の進み具合に置き換えます。
 *
 * 絵そのものの動きは、止めたままの CSS アニメーション（長さ 1 秒）です。
 * ここでは、いま動いている要素のアニメーションだけを、進み具合に合った
 * 時刻へ送ります。持ち場の外にいる要素には触れないので、一コマあたりの
 * 仕事はわずかです。
 */
export function StoryFilm({
  chapters,
  label,
  railLabel,
  skipLabel,
  skipHref,
  children,
}: StoryFilmProps) {
  const filmRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [cinema, setCinema] = useState(false);

  const timeline = useMemo(
    () => buildTimeline(chapters.map((chapter) => chapter.weight)),
    [chapters],
  );

  useIsomorphicLayoutEffect(() => {
    const query = window.matchMedia(MOTION_OK);
    const sync = () => setCinema(query.matches);

    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useIsomorphicLayoutEffect(() => {
    const film = filmRef.current;
    const stage = stageRef.current;
    if (!cinema || !film || !stage) return;

    const { segments, total } = timeline;
    const last = segments.length - 1;

    const nodes: ChapterNode[] = [];
    for (const el of film.querySelectorAll<HTMLElement>("[data-chapter]")) {
      const shot = el.querySelector<HTMLElement>("[data-shot]");
      const caption = el.querySelector<HTMLElement>("[data-caption]");
      if (!shot || !caption) continue;
      nodes.push({
        el,
        shot,
        caption,
        beats: el.querySelector<HTMLElement>("[data-beats]"),
        parts: readParts(shot),
        wound: false,
        live: false,
        t: -1,
        shift: Number.NaN,
        fade: -1,
        words: -1,
      });
    }
    const ticks = Array.from(film.querySelectorAll<HTMLElement>("[data-tick]"));
    const fills = ticks.map(() => -1);
    const box = film.querySelector<HTMLElement>("[data-scene-box]");

    let travel = 1;
    let approach = 1;
    let reach = 0;
    let target = 0;
    let shown = 0;
    let drawn = Number.NaN;
    let snap = true;
    let frame = 0;
    let before = 0;
    let currentTick = -1;

    const measure = () => {
      travel = Math.max(1, film.offsetHeight - stage.offsetHeight);
      approach = stage.offsetHeight * 0.7;
      /* となりの絵が重ならないだけ離します。広い画面では、画面の半分で足ります。 */
      reach = Math.max(box?.offsetWidth ?? 0, stage.offsetWidth / 2);
    };

    /** フィルムの上端から、どれだけ進んだか。固定される前は負の値になります。 */
    const read = () =>
      Math.min(Math.max(-film.getBoundingClientRect().top, -approach), travel);

    const draw = (scrolled: number) => {
      const pos = (Math.max(scrolled, 0) / travel) * total;
      const lead = scrolled < 0 ? 1 + scrolled / approach : 1;

      nodes.forEach((node, index) => {
        const segment = segments[index];
        const enter =
          index === 0
            ? 1
            : smoother(clamp01((pos - segments[index - 1].panStart) / PAN));
        const exit =
          index === last ? 0 : smoother(clamp01((pos - segment.panStart) / PAN));
        const live = enter > 0 && exit < 1;

        if (live !== node.live) {
          node.live = live;
          node.el.toggleAttribute("data-live", live);
          /* 遠くの章へ一気に飛んだときも、文が残らないよう既定（透明）へ戻します。 */
          if (!live) {
            node.caption.style.opacity = "";
            node.caption.style.transform = "";
            node.words = -1;
          }
        }
        if (!live) return;

        /*
         * はじめて映す章は、先にアニメーションをまとめて取り出しておきます。
         * 書き込みの合間に一つずつ取り出すと、そのたびにスタイルの計算が走ります。
         */
        if (!node.wound) {
          node.wound = true;
          for (const part of node.parts) {
            part.clock = part.el.getAnimations?.()[0] ?? null;
          }
        }

        const played = clamp01((pos - segment.start) / segment.play);
        const t =
          Math.round((index === 0 ? LEAD_IN * lead + (1 - LEAD_IN) * played : played) * 1e4) /
          1e4;
        const shift = Math.round((1 - enter - exit) * reach * 10) / 10;
        const fade = Math.round(fadeLate(1 - enter) * fadeLate(exit) * 1e3) / 1e3;
        const words =
          Math.round(clamp01((enter - 0.6) / 0.4) * clamp01(1 - exit / 0.4) * 1e3) / 1e3;

        if (t !== node.t) {
          node.t = t;
          node.beats?.style.setProperty("--t", String(t));
          for (const part of node.parts) {
            const at = Math.round(clamp01((t - part.a) * part.speed) * 1e4) / 1e4;
            if (at === part.shown) continue;
            part.shown = at;
            if (part.clock) {
              part.clock.currentTime = at * 1000;
            } else {
              /* アニメーションを取り出せない環境では、開始位置をずらして同じ絵にします。 */
              part.el.style.animationDelay = `${-at}s`;
            }
          }
        }

        if (shift !== node.shift) {
          node.shift = shift;
          node.shot.style.transform = `translate3d(${shift}px, 0, 0)`;
        }
        if (fade !== node.fade) {
          node.fade = fade;
          node.shot.style.opacity = String(fade);
        }
        if (words !== node.words) {
          node.words = words;
          node.caption.style.opacity = String(words);
          node.caption.style.transform = `translate3d(0, ${((1 - words) * 14).toFixed(1)}px, 0)`;
        }
      });

      let active = 0;
      ticks.forEach((tick, index) => {
        const start = segments[index].start;
        const end = index === last ? total : segments[index + 1].start;
        const fill = Math.round(clamp01((pos - start) / (end - start)) * 1e3) / 1e3;
        if (fill !== fills[index]) {
          fills[index] = fill;
          tick.style.setProperty("--fill", String(fill));
        }
        if (pos >= start - PAN / 2) active = index;
      });

      if (active !== currentTick) {
        ticks[currentTick]?.removeAttribute("aria-current");
        ticks[active]?.setAttribute("aria-current", "step");
        currentTick = active;
      }
    };

    const tick = (now: number) => {
      const elapsed = Math.min(now - before, 250);
      before = now;

      /* 読み取りは、書き込みの前にまとめて済ませます。 */
      target = read();

      const gap = target - shown;
      shown =
        snap || Math.abs(gap) < 0.5 ? target : shown + gap * (1 - Math.exp(-elapsed / FOLLOW));
      snap = false;

      /* 物語の外をスクロールしているあいだは、位置が変わらないので何もしません。 */
      if (shown !== drawn) {
        drawn = shown;
        draw(shown);
      }
      frame = shown === target ? 0 : requestAnimationFrame(tick);
    };

    const request = () => {
      if (frame) return;
      before = performance.now();
      frame = requestAnimationFrame(tick);
    };

    const resize = () => {
      measure();
      snap = true;
      drawn = Number.NaN;
      request();
    };

    measure();
    target = read();
    shown = target;
    drawn = shown;
    snap = false;
    draw(shown);

    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", resize);
    const observer =
      typeof ResizeObserver === "undefined" ? null : new ResizeObserver(resize);
    observer?.observe(stage);

    return () => {
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", resize);
      observer?.disconnect();
      if (frame) cancelAnimationFrame(frame);

      for (const node of nodes) {
        node.el.removeAttribute("data-live");
        node.beats?.style.removeProperty("--t");
        for (const part of node.parts) part.el.style.animationDelay = "";
        node.shot.style.transform = "";
        node.shot.style.opacity = "";
        node.caption.style.transform = "";
        node.caption.style.opacity = "";
      }
      for (const tick of ticks) {
        tick.removeAttribute("aria-current");
        tick.style.removeProperty("--fill");
      }
    };
  }, [cinema, timeline]);

  return (
    <div
      ref={filmRef}
      className={cinema ? `${styles.film} ${styles.cinema}` : styles.film}
      data-story-mode={cinema ? "cinema" : "static"}
      style={{ "--film-length": timeline.total.toFixed(1) } as CSSProperties}
    >
      {/* 章へ飛ぶための目印。置く位置は Story.module.css が決めます。 */}
      {timeline.segments.map((segment, index) => (
        <span
          key={index}
          id={`story-${index + 1}`}
          className={styles.marker}
          style={{ "--at": segment.start.toFixed(1) } as CSSProperties}
        />
      ))}

      <div ref={stageRef} className={styles.stage}>
        <div className={styles.topBar}>
          <p className={`mono ${styles.filmLabel}`}>
            <span className={styles.filmTick} aria-hidden="true" />
            {label}
          </p>
          <a className={`mono ${styles.skip}`} href={skipHref}>
            {skipLabel}
            <span aria-hidden="true">↓</span>
          </a>
        </div>

        <div className={styles.ground} aria-hidden="true" />

        <div className={styles.chapters}>{children}</div>

        <nav className={styles.rail} aria-label={railLabel}>
          <ol className={styles.ticks}>
            {chapters.map((chapter, index) => (
              <li key={index}>
                <a
                  className={styles.tick}
                  href={`#story-${index + 1}`}
                  aria-label={chapter.jumpLabel}
                  data-tick=""
                >
                  <span className={styles.tickBar} aria-hidden="true" />
                  <span className={styles.tickTitle} aria-hidden="true">
                    {chapter.title}
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </div>
  );
}
