"use client";

import { useRef } from "react";

import { useIsomorphicLayoutEffect } from "@/components/useInView";
import type { ConceptLine, ConceptTone } from "@/data/design";

import styles from "./Writing.module.css";
import { Hand, Icon } from "./writingArt";

/**
 * 行が書かれていく範囲。行の上端が、画面の下端（FROM）から中央（TO）へ上がる
 * あいだに、左から右へ書き終えます。数字は、画面の高さに対する割合です。
 * 進み方は、はじめが速く、終わりへ向けてゆるやかになります（draw の中の式）。
 */
const FROM = 1;
const TO = 0.5;

/**
 * ページの終わりに近い行は、中央まで上がりきれないことがあります。そのときは
 * 書き終える位置を手前へ寄せますが、範囲はこの長さ（画面の高さに対する割合）
 * より短くしません。
 */
const SHORTEST = 0.14;

/** スクロールの動きへ、どれだけ遅れて付いていくか（ミリ秒）。小さいほど機敏です。 */
const FOLLOW = 120;

/**
 * ペン先を置く位置。書いている端から右へ x、行の下端から下へ y だけずらします
 * （大きな字の一文字ぶんを 1 とした長さ）。
 */
const NIB = { x: 0.46, y: 0.26 };

/** 書きながら手が揺れる角度（度）と、ひと揺れのあいだに進む長さ（一文字ぶんを 1 として）。 */
const SWAY = 4;
const SWAY_STEP = 0.36;

const TONES: Record<ConceptTone, string> = {
  blue: styles.toneBlue,
  orange: styles.toneOrange,
  green: styles.toneGreen,
  red: styles.toneRed,
  ink: styles.toneInk,
};

/** 手で書く、大きな字。位置と長さは measure で測ります。 */
type Stroke = {
  el: HTMLElement;
  text: HTMLElement;
  icon: HTMLElement;
  hand: HTMLElement;
  /** 折り返したあとの各行。位置は、行（Row）の左上から測ったものです。 */
  lines: { left: number; bottom: number; width: number }[];
  /** 各行の幅を足した長さ。終わりの絵も含みます。 */
  length: number;
  /** 終わりの絵が始まるところまでの長さと、絵の幅。 */
  iconFrom: number;
  iconSpan: number;
  /** 大きな字の一文字ぶんの大きさ。 */
  em: number;
};

type Row = {
  el: HTMLElement;
  inks: HTMLElement[];
  stroke: Stroke | null;
  /** ルートの上端からの距離。 */
  top: number;
  /** 書き始めから書き終わりまでに、行が動く距離。 */
  reach: number;
  /** 最後に画面へ反映した進み具合。-1 は、まだ反映していないことを表します。 */
  shown: number;
};

const clamp = (value: number) => Math.min(1, Math.max(0, value));

/**
 * 行の頭に来ると、字の左半分が空いて、ほかの行より引っこんで見える括弧。
 * この字で始まる行は、半文字ぶん左へ寄せて、頭をそろえます。
 */
const OPENERS = "「『（〈《【〔";
const opens = (text: string) => text !== "" && OPENERS.includes(text.charAt(0));

/**
 * スクロールに合わせて書いていく動きを始めます。戻り値は、止めて元に戻す関数です。
 */
function start(root: HTMLElement) {
  const rows: Row[] = Array.from(root.querySelectorAll<HTMLElement>("[data-row]"), (el) => {
    const write = el.querySelector<HTMLElement>("[data-write]");
    const text = write?.querySelector<HTMLElement>("[data-text]");
    const icon = write?.querySelector<HTMLElement>("[data-icon]");
    const hand = el.querySelector<HTMLElement>("[data-hand]");

    return {
      el,
      inks: Array.from(el.querySelectorAll<HTMLElement>("[data-ink]")),
      stroke:
        write && text && icon && hand
          ? { el: write, text, icon, hand, lines: [], length: 0, iconFrom: 0, iconSpan: 1, em: 16 }
          : null,
      top: 0,
      reach: 1,
      shown: -1,
    };
  });

  let viewport = window.innerHeight;
  let frame = 0;
  let current = window.scrollY;
  let last = 0;

  /** 行と、大きな字の位置を測り直します。幅が変わったときと、書体が届いたときに呼びます。 */
  const measure = () => {
    viewport = window.innerHeight;

    const box = root.getBoundingClientRect();
    const origin = box.top + window.scrollY;
    const limit = document.documentElement.scrollHeight - viewport;
    const span = viewport * (FROM - TO);

    for (const row of rows) {
      const frameBox = row.el.getBoundingClientRect();
      row.top = frameBox.top - box.top;
      row.shown = -1;

      /* 書き終える位置までスクロールできない行は、足りないぶんだけ範囲を縮めます。 */
      const short = origin + row.top - viewport * TO - limit;
      row.reach = Math.max(span - Math.max(0, short), viewport * SHORTEST);

      const stroke = row.stroke;
      if (!stroke) continue;

      /* 同じ高さの切れ端は、一行にまとめます。 */
      const lines: { left: number; right: number; bottom: number }[] = [];
      for (const piece of stroke.text.getClientRects()) {
        const tail = lines[lines.length - 1];
        if (tail && Math.abs(tail.bottom - (piece.bottom - frameBox.top)) < 2) {
          tail.right = Math.max(tail.right, piece.right - frameBox.left);
        } else {
          lines.push({
            left: piece.left - frameBox.left,
            right: piece.right - frameBox.left,
            bottom: piece.bottom - frameBox.top,
          });
        }
      }

      stroke.lines = lines.map((line) => ({
        left: line.left,
        bottom: line.bottom,
        width: line.right - line.left,
      }));
      stroke.length = stroke.lines.reduce((sum, line) => sum + line.width, 0);
      stroke.em = parseFloat(getComputedStyle(stroke.text).fontSize) || 16;

      const iconBox = stroke.icon.getBoundingClientRect();
      const end = lines[lines.length - 1];
      stroke.iconSpan = Math.max(1, iconBox.width);
      stroke.iconFrom = end
        ? stroke.length - (end.right - (iconBox.left - frameBox.left))
        : stroke.length;
    }
  };

  const apply = (row: Row, progress: number) => {
    row.shown = progress;

    const value = progress.toFixed(4);
    for (const ink of row.inks) ink.style.setProperty("--p", value);

    const stroke = row.stroke;
    if (!stroke) return;

    stroke.el.style.setProperty("--p", value);

    /* 書いている端までの長さ。終わりの絵は、字を書き終えたあとに続けて現れます。 */
    const reach = progress * stroke.length;
    stroke.icon.style.setProperty(
      "--q",
      clamp((reach - stroke.iconFrom) / stroke.iconSpan).toFixed(3),
    );

    /* 手を、書いている端へ運びます。折り返した行では、次の行の頭へ移ります。 */
    let rest = reach;
    let line = stroke.lines[0];
    for (const candidate of stroke.lines) {
      line = candidate;
      if (rest <= candidate.width) break;
      rest -= candidate.width;
    }

    if (line) {
      const x = line.left + Math.min(rest, line.width) + NIB.x * stroke.em;
      const y = line.bottom + NIB.y * stroke.em;
      const sway = Math.sin(reach / (SWAY_STEP * stroke.em)) * SWAY;
      stroke.hand.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotate(${sway.toFixed(2)}deg)`;
    }

    row.el.toggleAttribute("data-writing", progress > 0 && progress < 1);
  };

  const draw = (scroll: number) => {
    /* ルートの上端の、画面の中での位置。まだ追いついていないぶんを足して求めます。 */
    const base = root.getBoundingClientRect().top + (window.scrollY - scroll);
    const from = viewport * FROM;

    for (const row of rows) {
      const travelled = clamp((from - (base + row.top)) / row.reach);
      /* はじめは速く、終わりへ向けてゆるやかに。 */
      const progress = 1 - (1 - travelled) ** 2;
      if (progress !== row.shown) apply(row, progress);
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

  root.dataset.live = "";
  refresh();

  /* 自身の幅や高さが変わったとき、ページの長さが変わったときに、測り直します。 */
  const observer = new ResizeObserver(refresh);
  observer.observe(root);
  observer.observe(document.body);

  window.addEventListener("scroll", wake, { passive: true });
  window.addEventListener("resize", refresh);
  /* 書体が届くと字の幅が変わるので、そのたびに測り直します。 */
  document.fonts.addEventListener("loadingdone", refresh);

  return () => {
    cancelAnimationFrame(frame);
    observer.disconnect();
    window.removeEventListener("scroll", wake);
    window.removeEventListener("resize", refresh);
    document.fonts.removeEventListener("loadingdone", refresh);

    delete root.dataset.live;
    for (const row of rows) {
      row.el.removeAttribute("data-writing");
      for (const ink of row.inks) ink.style.removeProperty("--p");
      if (!row.stroke) continue;
      row.stroke.el.style.removeProperty("--p");
      row.stroke.icon.style.removeProperty("--q");
      row.stroke.hand.style.removeProperty("transform");
    }
  };
}

/** 大きな字のある行が括弧で始まるとき、その字の大きさに合わせて左へ寄せるクラス。 */
function hang(line: Exclude<ConceptLine, string>) {
  if (line.before) return opens(line.before) ? ` ${styles.hang}` : "";
  return opens(line.write) ? ` ${styles.hangBig}` : "";
}

/** 大きな字の行。最後の一文字と終わりの絵は、行をまたいで離れないようにまとめます。 */
function Written({ line }: { line: Exclude<ConceptLine, string> }) {
  const chars = Array.from(line.write);
  const tail = chars.pop() ?? "";

  return (
    <span
      className={`${styles.pen} ${TONES[line.tone]}${line.marker ? ` ${styles.marker}` : ""}`}
      data-write=""
    >
      <span className={styles.written} data-text="">
        {chars.join("")}
        <span className={styles.keep}>
          {tail}
          <span className={styles.icon} data-icon="">
            <Icon name={line.icon} />
          </span>
        </span>
      </span>
    </span>
  );
}

/**
 * 「愛されるエンジニア」の本文。
 *
 * サーバーが返す HTML では、すべての行が書き終わった姿で並んでいます。JavaScript を
 * 無効にしている方と、「視差効果を減らす」設定の方には、そのままお見せします。
 * それ以外の環境では、スクロールに合わせて、画面の下から現れた行が左から順に
 * 書かれていきます。小さな字は淡い色から黒へ変わり、大きな字は、ペンを持った手が
 * 書いていきます。
 */
export function Writing({ stanzas }: { stanzas: readonly (readonly ConceptLine[])[] }) {
  const ref = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;

    /* 字の形で切り抜いた塗りが使えない環境では、書き終わった姿のままにします。 */
    const clips =
      CSS.supports("background-clip", "text") || CSS.supports("-webkit-background-clip", "text");
    if (!clips) return;

    const motion = window.matchMedia("(prefers-reduced-motion: no-preference)");
    let stop: (() => void) | null = null;

    const sync = () => {
      if (motion.matches && !stop) {
        stop = start(root);
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
    <div ref={ref} className={styles.writing}>
      {stanzas.map((lines, index) => (
        <p key={index} className={styles.stanza}>
          {lines.map((line, row) =>
            typeof line === "string" ? (
              <span
                key={row}
                className={opens(line) ? `${styles.row} ${styles.hang}` : styles.row}
                data-row=""
              >
                <span className={styles.plain} data-ink="">
                  {line}
                </span>
              </span>
            ) : (
              <span key={row} className={`${styles.row}${hang(line)}`} data-row="">
                {line.before ? (
                  <span className={styles.plain} data-ink="">
                    {line.before}
                  </span>
                ) : null}
                <Written line={line} />
                {line.after ? (
                  <span className={styles.plain} data-ink="">
                    {line.after}
                  </span>
                ) : null}
                <span className={styles.hand} data-hand="" aria-hidden="true">
                  <Hand />
                </span>
              </span>
            ),
          )}
        </p>
      ))}
    </div>
  );
}
