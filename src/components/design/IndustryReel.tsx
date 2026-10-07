"use client";

import Image, { type StaticImageData } from "next/image";
import { useRef, useState, type CSSProperties } from "react";

import { useIsomorphicLayoutEffect } from "@/components/useInView";

import styles from "./IndustryReel.module.css";
import type { Reel } from "./reel";
import { HURRY, PITCH, START, SWITCH, drumOf, runOf, travelOf, unitOf } from "./reelShape";

const MOTION_OK = "(prefers-reduced-motion: no-preference)";

/**
 * 帯が、スクロールの何倍の速さで流れるか。大きくするほど、画面を固定しておく
 * 長さが短くなります。
 */
const RATE = 1.8;

/** スクロールの動きへ、どれだけ遅れて付いていくか（ミリ秒）。小さいほど機敏です。 */
const FOLLOW = 110;

/**
 * 流れる勢いによる、画像のたわみ。帯の速さ（ピクセル毎秒）に BOW を掛けた量だけ、
 * 画像の中ほどが先へ出ます。上限は、基準の長さに対する割合です。
 */
const BOW = 0.016;
const BOW_LIMIT = 0.022;
/** たわみが勢いに追いつく、また元へ戻るまでの時間（ミリ秒）。 */
const SPRING = 150;

/** 下端の目盛りの間隔（ピクセル）。IndustryReel.module.css の .ruler と合わせます。 */
const TICK = 14;

/** 最後の画像が中央を過ぎたあと、業種名などを消していく範囲（基準の長さに対する割合）。 */
const FADE: readonly [number, number] = [-0.02, -0.1];

/** ポインターを載せた画像の業種名を染める色。画像の順に、くり返して使います。 */
const TONES = ["#ff4f9a", "#ff6a2b", "#ffd23f", "#3ddc97", "#4cc9f0", "#a493ff"];

export type ReelItem = {
  id: string;
  /** 大きく出す業種名。行ごとに分けてあります。 */
  lines: readonly string[];
  /** 画像の下に小さく添える欧文。 */
  caption: string;
  image: StaticImageData;
  /** 帯に貼る画像の URL（広い画面用と、狭い画面用）。 */
  large: string;
  small: string;
};

type Props = {
  /** 読み上げに使う、この区画の見出し。 */
  heading: string;
  items: readonly ReelItem[];
};

const clamp = (value: number, low: number, high: number) => Math.min(high, Math.max(low, value));

/** 一行の幅を、全角一文字を 1 として見積もります。字の大きさを決めるのに使います。 */
const widthOf = (line: string) =>
  Array.from(line).reduce((sum, char) => sum + (char === "・" ? 0.6 : char.charCodeAt(0) < 0x2000 ? 0.66 : 1), 0);

/** 業種名の字の大きさ（基準の長さに対する割合）。一行のときは、大きく出します。 */
const TITLE_SIZE = { single: 0.08, stacked: 0.0625 };

/** 大きな業種名。切り替わるたびに作り直され、一文字ずつ、下から現れます。 */
function Title({ lines, tone }: { lines: readonly string[]; tone: string | null }) {
  let order = 0;

  return (
    <p
      className={styles.title}
      style={
        {
          "--n": Math.max(...lines.map(widthOf)).toFixed(2),
          "--size": lines.length > 1 ? TITLE_SIZE.stacked : TITLE_SIZE.single,
          color: tone ?? undefined,
        } as CSSProperties
      }
    >
      {lines.map((line) => (
        <span key={line} className={styles.titleLine}>
          {Array.from(line, (char) => {
            const index = order;
            order += 1;
            return (
              <span key={index} className={styles.titleChar} style={{ "--i": index } as CSSProperties}>
                {char}
              </span>
            );
          })}
        </span>
      ))}
    </p>
  );
}

/**
 * これまでに携わってきた業種のギャラリー。
 *
 * サーバーが返す HTML は、画像と業種名を並べた一覧です。JavaScript を無効にしている方、
 * 「視差効果を減らす」設定の方、WebGL が使えない環境の方には、そのままお見せします。
 * それ以外の環境では、画面を固定し、スクロールに合わせて、湾曲した画像の帯を右から左へ
 * 流します。中央に来た画像に合わせて、大きな業種名が切り替わります。
 */
export function IndustryReel({ heading, items }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const hudRef = useRef<HTMLDivElement>(null);
  const rulerRef = useRef<HTMLSpanElement>(null);

  const [motion, setMotion] = useState(false);
  /* WebGL が使えなかったときは、一覧のままにします。 */
  const [failed, setFailed] = useState(false);
  /* いま大きく出している業種。hovered は、ポインターを載せた画像のものかどうか。 */
  const [shown, setShown] = useState({ index: 0, hovered: false });

  const cinema = motion && !failed;

  useIsomorphicLayoutEffect(() => {
    const query = window.matchMedia(MOTION_OK);
    const sync = () => setMotion(query.matches);

    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const host = canvasRef.current;
    const hud = hudRef.current;
    const ruler = rulerRef.current;
    if (!cinema || !section || !stage || !host || !hud || !ruler) return;

    const count = items.length;
    const travel = travelOf(count);
    const run = runOf(count);

    let reel: Reel | null = null;
    let loading = false;
    let disposed = false;

    let width = 1;
    let height = 1;
    let unit = 1;
    let pin = 1;

    let target = 0;
    let moved = 0;
    let snap = true;
    let dirty = true;
    let near = false;
    let frame = 0;
    let before = 0;

    let bow = 0;
    let lastFirst: number | null = null;
    let pointer: { x: number; y: number } | null = null;
    let hovered = -1;
    let current = -1;
    let wasHovered = false;
    let opacity = "";
    let lifted = "";

    const measure = () => {
      width = stage.offsetWidth;
      height = stage.offsetHeight;
      unit = unitOf(width, height);
      pin = Math.max(1, section.offsetHeight - height);
      reel?.resize(width, height, unit, drumOf(width, height));
      dirty = true;
    };

    /** 画面を固定しはじめる位置を 0 とした、スクロール量。その前は、マイナスになります。 */
    const read = () => -section.getBoundingClientRect().top;

    const draw = (scrolled: number, elapsed: number) => {
      /*
       * 最初の画像の中心の位置。固定する前から流れはじめ、固定が外れたあとも流れつづけます。
       * 最後の画像が中央を過ぎたあとは、少し速く流します。
       */
      const paced = (scrolled / pin) * travel;
      const flowed = paced <= run ? paced : run + (paced - run) * HURRY;
      const first = (START - flowed) * unit;
      const pitch = PITCH * unit;

      /* 流れる勢いに合わせて、画像をたわませます。 */
      const speed = lastFirst === null || elapsed <= 0 ? 0 : ((first - lastFirst) / elapsed) * 1000;
      lastFirst = first;
      const pull = clamp(-speed * BOW, -BOW_LIMIT * unit, BOW_LIMIT * unit);
      bow += (pull - bow) * (1 - Math.exp(-elapsed / SPRING));
      if (Math.abs(bow) < 0.2 && pull === 0) bow = 0;

      hovered = pointer && reel ? reel.locate(pointer.x, pointer.y) : -1;
      const fading = reel?.render(first, bow, hovered, elapsed) ?? false;

      /*
       * 舞台が下から上がってくるあいだ、画像は、固定したあとと同じ高さに置いておきます。
       * 業種名が上がってくるところへ、画像が横から入ってくる形になります。
       */
      const lift = Math.max(0, -scrolled).toFixed(1);
      if (lift !== lifted) {
        lifted = lift;
        host.style.transform = `translate3d(0, -${lift}px, 0)`;
      }

      /* 下端の目盛りは、帯と一緒に流れます。 */
      ruler.style.transform = `translate3d(${(first % TICK).toFixed(1)}px, 0, 0)`;

      /* 画像の中心が、中央の少し右を越えたら、その業種名に切り替えます。 */
      const index = clamp(Math.floor((SWITCH * unit - first) / pitch), 0, count - 1);
      const display = hovered >= 0 ? hovered : index;
      if (display !== current || hovered >= 0 !== wasHovered) {
        current = display;
        wasHovered = hovered >= 0;
        setShown({ index: display, hovered: wasHovered });
      }

      /* 最後の画像が中央を過ぎたら、業種名などを消していきます。 */
      const last = (first + (count - 1) * pitch) / unit;
      const visible = (1 - clamp((FADE[0] - last) / (FADE[0] - FADE[1]), 0, 1)).toFixed(3);
      if (visible !== opacity) {
        opacity = visible;
        hud.style.opacity = visible;
      }

      return fading || bow !== 0;
    };

    const tick = (now: number) => {
      const elapsed = Math.min(now - before, 250);
      before = now;
      target = read();

      const gap = target - moved;
      const next =
        snap || Math.abs(gap) < 0.5 ? target : moved + gap * (1 - Math.exp(-elapsed / FOLLOW));
      snap = false;

      if (next !== moved) dirty = true;
      moved = next;

      /*
       * 舞台が画面に掛かっていないあいだは描かず、戻ってきたときに描き直します。
       * 画面の近くに来た時点（near）で読みこみは始めますが、描くのは、見えてからです。
       */
      const seen = near && moved > -height * 1.05 && moved < pin + height * 1.05;
      if (dirty && seen) dirty = draw(moved, elapsed);

      frame = moved === target && !(dirty && seen) ? 0 : requestAnimationFrame(tick);
    };

    const request = () => {
      if (frame) return;
      before = performance.now();
      frame = requestAnimationFrame(tick);
    };

    const resize = () => {
      measure();
      snap = true;
      lastFirst = null;
      request();
    };

    /*
     * Three.js と画像は、この区画が近づいてから読みこみます。
     * WebGL が使えない環境では失敗するので、そのときは一覧のままにします。
     */
    const load = () => {
      if (loading) return;
      loading = true;

      void import("./reel")
        .then(({ createReel }) => {
          if (disposed) return;
          const small = window.matchMedia("(max-width: 760px)").matches;
          reel = createReel(
            host,
            items.map((item) => (small ? item.small : item.large)),
            () => {
              dirty = true;
              request();
            },
          );
          measure();
          request();
        })
        .catch(() => {
          if (!disposed) setFailed(true);
        });
    };

    const point = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const box = stage.getBoundingClientRect();
      pointer = { x: event.clientX - box.left - box.width / 2, y: box.top + box.height / 2 - event.clientY };
      dirty = true;
      request();
    };

    const leave = () => {
      pointer = null;
      dirty = true;
      request();
    };

    measure();
    target = read();
    moved = target;

    const watcher = new IntersectionObserver(
      ([entry]) => {
        near = entry.isIntersecting;
        if (near) {
          load();
          dirty = true;
          lastFirst = null;
          request();
        }
      },
      { rootMargin: "80% 0px" },
    );
    watcher.observe(section);

    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", resize);
    stage.addEventListener("pointermove", point, { passive: true });
    stage.addEventListener("pointerleave", leave);
    const observer = new ResizeObserver(resize);
    observer.observe(stage);

    return () => {
      disposed = true;
      watcher.disconnect();
      observer.disconnect();
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", resize);
      stage.removeEventListener("pointermove", point);
      stage.removeEventListener("pointerleave", leave);
      if (frame) cancelAnimationFrame(frame);
      reel?.dispose();

      hud.style.opacity = "";
      host.style.transform = "";
      ruler.style.transform = "";
    };
  }, [cinema, items]);

  const item = items[Math.min(shown.index, items.length - 1)];
  const tone = shown.hovered ? TONES[shown.index % TONES.length] : null;

  return (
    <section
      ref={sectionRef}
      className={cinema ? `${styles.reel} ${styles.cinema}` : styles.reel}
      style={{ "--travel": travelOf(items.length).toFixed(3), "--rate": RATE } as CSSProperties}
      data-reel={failed ? "off" : cinema ? "on" : undefined}
      aria-labelledby="design-industries"
    >
      <h2 id="design-industries" className="u-sr-only">
        {heading}
      </h2>

      <div ref={stageRef} className={styles.stage}>
        {/* 画像の帯を描くキャンバスの入れもの。中身は reel.ts が置きます。 */}
        <div ref={canvasRef} className={styles.canvas} aria-hidden="true" />

        {/* 画面に固定して重ねる文字。内容は下の一覧と同じなので、読み上げからは外します。 */}
        <div ref={hudRef} className={styles.hud} aria-hidden="true">
          <Title key={`${shown.index}-${tone ?? "plain"}`} lines={item.lines} tone={tone} />
          <p className={`mono ${styles.caption}`}>{item.caption}</p>
          <p className={styles.number}>{String(shown.index + 1).padStart(2, "0")}</p>
          <span className={styles.needle} />
          <span className={styles.scale}>
            <span ref={rulerRef} className={styles.ruler} />
          </span>
        </div>

        <ol className={`shell ${styles.cards}`}>
          {items.map((entry, index) => (
            <li key={entry.id} className={styles.card}>
              <span className={styles.thumb}>
                <Image
                  src={entry.image}
                  alt=""
                  fill
                  sizes="(max-width: 600px) 100vw, (max-width: 1100px) 50vw, 25vw"
                />
              </span>
              <span className={styles.cardNumber}>{String(index + 1).padStart(2, "0")}</span>
              <span className={styles.cardName}>{entry.lines.join("")}</span>
              <span className={`mono ${styles.cardCaption}`} lang="en">
                {entry.caption}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
