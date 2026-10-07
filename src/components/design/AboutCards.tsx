"use client";

import Image from "next/image";
import { useRef, useState, type CSSProperties } from "react";

import { useIsomorphicLayoutEffect } from "@/components/useInView";
import type { CardPart, CardTone, DesignCard } from "@/data/design";

import styles from "./AboutCards.module.css";
import { HEART_BOX, HEART_PATH } from "./handwriting";
import { MoreButton } from "./MoreButton";
import { MOTION_OK, clamp, easeOut, pageTop, range, startClock } from "./scrollClock";
import { Icon } from "./writingArt";

/**
 * 見出し（ABOUT）が右から入ってくる動き。
 * 前の区画（業種のギャラリー）の固定が外れるまでの残りを、画面の高さを 1 として
 * 数えます。残りが ENTER を切ったら現れ、0 になったとき、画面の中央に着きます。
 * 中央からの横のずれは、画面の幅 × REACH × 残り² です（はじめは速く、着く手前でゆるやかに）。
 */
const ENTER = 0.92;
const REACH = 1.04;

/**
 * 見出しの字は、入ってきながら、一文字ずつ縦に回って現れます。
 * from は最初の字が回りはじめる残り、step は字ごとの遅れ、span は回りきるまでの長さです。
 */
const ROLL = {
  title: { from: 0.76, step: 0.012, span: 0.25 },
  lead: { from: 0.86, step: 0.012, span: 0.14 },
};

/**
 * 固定が外れたあとの見出し。スクロールの DRIFT 倍の速さで上へ動き、画面の高さ
 * ひとつ分スクロールするあいだに、FADE だけ薄れます。その上へ、白いカードが重なります。
 */
const DRIFT = 0.25;
const FADE = 0.8;

/** カードが下から入ってくるときの、はじめの大きさ。画面の上端に着くと、等倍になります。 */
const SHRINK = 0.75;

/**
 * カードの切り替え。画面の高さひとつ分のスクロールを 1 として、その中の TURN の
 * 範囲で、前の見出しが上へ畳まれ、次の見出しが下から伸びてきます。
 * 次の見出しは GROW 倍の速さで伸びるので、畳まれきるより先に、伸びきります。
 */
const TURN: readonly [number, number] = [0.075, 0.715];
const GROW = 1.4;
/** 次の見出しがここまで伸びたら、番号・説明文・ボタンも切り替えます。 */
const SWITCH = 0.85;

const TONES: Record<CardTone, string> = {
  green: styles.toneGreen,
  yellow: styles.toneYellow,
  orange: styles.toneOrange,
  blue: styles.toneBlue,
};

type Props = {
  id: string;
  title: string;
  /** 見出しの下に添える二行。 */
  lead: readonly string[];
  /** ボタンの文言。 */
  more: string;
  cards: readonly DesignCard[];
};

/** 要素の左上の、祖先の中での位置。transform の影響を受けない、組版の上での位置です。 */
function offsetWithin(element: HTMLElement, ancestor: HTMLElement) {
  let left = 0;
  let top = 0;
  for (let node: HTMLElement | null = element; node && node !== ancestor; ) {
    left += node.offsetLeft;
    top += node.offsetTop;
    node = node.offsetParent instanceof HTMLElement ? node.offsetParent : null;
  }
  return { left, top };
}

/** 縦に回って現れる字。同じ字を縦に二つ重ね、上へ送ります。 */
function Rolling({ text, kind }: { text: string; kind: "title" | "lead" }) {
  return (
    <>
      {Array.from(text, (char, index) => (
        <span key={index} className={styles.roll} data-roll={kind} data-order={index}>
          <span className={styles.rollInner}>
            {/* 行頭や語間の空白は、そのままだと幅がなくなるので、改行しない空白に替えます。 */}
            <span>{char === " " ? " " : char}</span>
            <span>{char === " " ? " " : char}</span>
          </span>
        </span>
      ))}
    </>
  );
}

/** 見出しの行に並べる部品。anchor は、ハートの置き場所の目印です。 */
function Part({ part, anchor }: { part: CardPart; anchor: boolean }) {
  if ("text" in part) {
    return (
      <span
        className={part.tinted ? `${styles.word} ${styles.tinted}` : styles.word}
        data-anchor={anchor ? "" : undefined}
      >
        {part.text}
      </span>
    );
  }

  return (
    <span className={`${styles.picture} ${part.size === "fill" ? styles.fill : styles.tile}`}>
      <Image src={part.image} alt="" fill sizes="(max-width: 760px) 90vw, 70vw" />
    </span>
  );
}

/**
 * ハートの置き場所の目印にする部品の番号。一枚目は一行目の最初の字、
 * それ以降は、一行目の最後の字です。
 */
function anchorOf(row: readonly CardPart[], first: boolean) {
  const texts = row.flatMap((part, order) => ("text" in part ? [order] : []));
  return first ? texts[0] : texts[texts.length - 1];
}

/** カードの上を、切り替わるたびに跳ねて移る、目の付いたハート。 */
function Mascot() {
  return (
    <svg viewBox={HEART_BOX} aria-hidden="true" focusable="false">
      <path d={HEART_PATH} fill="#e8384f" />
      <circle cx="31" cy="34" r="15" fill="#ffffff" />
      <circle cx="68" cy="34" r="15" fill="#ffffff" />
      <circle cx="36" cy="38" r="7" fill="#1c1b1d" />
      <circle cx="73" cy="38" r="7" fill="#1c1b1d" />
    </svg>
  );
}

/**
 * 「ABOUT」の区画。
 *
 * サーバーが返す HTML では、見出しのあとに、四枚のカードが縦に並んでいます。
 * JavaScript を無効にしている方と、「視差効果を減らす」設定の方には、そのまま
 * お見せします。それ以外の環境では、次のように動きます。
 *
 * 1. 業種のギャラリーの終わりに、見出しが、一文字ずつ回りながら右から入ってくる。
 * 2. 見出しがゆっくり上へ動いて薄れ、その上へ、白いカードが、広がりながら重なる。
 * 3. カードが画面に固定され、スクロールすると、大きな見出しが上へ畳まれて、
 *    次の見出しに切り替わる。番号、説明文、ボタンの色も、一緒に替わる。
 */
export function AboutCards({ id, title, lead, more, cards }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const flyingRef = useRef<HTMLDivElement>(null);
  const moverRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const slidesRef = useRef<HTMLDivElement>(null);
  const mascotRef = useRef<HTMLSpanElement>(null);
  /** カードを固定しはじめる位置と、一枚ぶんの長さ。フォーカスが移ったときに使います。 */
  const pinned = useRef({ top: 0, step: 1 });

  const [cinema, setCinema] = useState(false);
  const [active, setActive] = useState(0);

  useIsomorphicLayoutEffect(() => {
    const query = window.matchMedia(MOTION_OK);
    const sync = () => setCinema(query.matches);

    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    const flying = flyingRef.current;
    const mover = moverRef.current;
    const pin = pinRef.current;
    const card = cardRef.current;
    const box = slidesRef.current;
    const mascot = mascotRef.current;
    if (!cinema || !section || !flying || !mover || !pin || !card || !box || !mascot) return;

    const rolls = Array.from(flying.querySelectorAll<HTMLElement>("[data-roll]"), (el) => ({
      inner: el.firstElementChild as HTMLElement,
      rule: ROLL[el.dataset.roll === "lead" ? "lead" : "title"],
      order: Number(el.dataset.order),
      shown: "",
    }));
    const slides = Array.from(box.querySelectorAll<HTMLElement>("[data-slide]"), (el) => ({
      rows: Array.from(el.querySelectorAll<HTMLElement>("[data-row]")),
      anchor: el.querySelector<HTMLElement>("[data-anchor]"),
      shown: "",
    }));
    const last = slides.length - 1;

    let top = 0;
    let width = 1;
    let height = 1;
    let flyingOn = false;
    let current = -1;
    let seen = "";
    let scaled = "";
    let anchors: { x: number; y: number }[] = [];

    const place = () => {
      const spot = anchors[current];
      if (spot) mascot.style.transform = `translate3d(${spot.x.toFixed(1)}px, ${spot.y.toFixed(1)}px, 0)`;
    };

    const measure = () => {
      /*
       * ギャラリーが動かない一覧になっているときは、見出しを飛ばさず、その場に置きます。
       * 見出しを置くかどうかで、カードの位置が変わるので、位置を測る前に決めておきます。
       */
      flyingOn = document.querySelector('[data-reel="on"]') !== null;
      section.dataset.flying = flyingOn ? "on" : "off";

      width = window.innerWidth;
      height = card.offsetHeight;
      top = pageTop(pin);
      pinned.current = { top, step: height };

      /* ハートの置き場所。一枚目は見出しの頭、それ以降は、一行目の字の終わりです。 */
      anchors = slides.map((slide, index) => {
        if (!slide.anchor) return { x: 0, y: 0 };
        const spot = offsetWithin(slide.anchor, box);
        return { x: spot.left + (index === 0 ? 0 : slide.anchor.offsetWidth), y: spot.top };
      });
      place();

      seen = "";
      scaled = "";
      for (const roll of rolls) roll.shown = "";
      for (const slide of slides) slide.shown = "";
    };

    const draw = (scroll: number) => {
      /* カードの（流れの上での）上端の、画面の中での位置。 */
      const y = top - scroll;
      /* 前の区画の固定が外れるまでの残り。外れたあとは、マイナスになります。 */
      const left = (y - height) / height;

      /* 見出し：右から入り、中央に着いたあとは、ゆっくり上へ動いて薄れます。 */
      const visible = flyingOn && left < ENTER && y > 0;
      const state = visible
        ? `${(left > 0 ? REACH * width * left * left : 0).toFixed(1)}|${(left < 0 ? DRIFT * left * height : 0).toFixed(1)}|${(left > 0 ? 0.5 + 0.5 * range(0.78, 0.5, left) : clamp(1 + FADE * left)).toFixed(3)}`
        : "";
      if (state !== seen) {
        seen = state;
        flying.style.visibility = visible ? "visible" : "hidden";
        if (visible) {
          const [x, lift, alpha] = state.split("|");
          mover.style.transform = `translate3d(${x}px, ${lift}px, 0)`;
          mover.style.opacity = alpha;
        }
      }

      if (visible) {
        for (const roll of rolls) {
          const from = roll.rule.from - roll.order * roll.rule.step;
          const turned = (range(from, from - roll.rule.span, left) * 50).toFixed(2);
          if (turned === roll.shown) continue;
          roll.shown = turned;
          roll.inner.style.transform = `translate3d(0, -${turned}%, 0)`;
        }
      }

      /* カード：下から入ってくるあいだ、少し小さいところから、画面いっぱいへ広がります。 */
      const scale = (SHRINK + (1 - SHRINK) * easeOut(clamp(1 - y / height))).toFixed(4);
      if (scale !== scaled) {
        scaled = scale;
        card.style.transform = scale === "1.0000" ? "" : `scale(${scale})`;
      }

      /* 見出しの切り替え。固定してからのスクロールを、画面の高さを 1 として数えます。 */
      const turn = -y / height;
      let next = 0;

      slides.forEach((slide, index) => {
        const coming = index === 0 ? 1 : range(index - 1 + TURN[0], index - 1 + TURN[1], turn);
        const going = index === last ? 0 : range(index + TURN[0], index + TURN[1], turn);
        const grown = Math.min(1, coming * GROW);
        if (index === 0 || grown >= SWITCH) next = index;

        /* 出ていく行は上の端を、入ってくる行は下の端を軸にして、縦に伸び縮みします。 */
        const leaving = going > 0;
        const size = leaving ? (1 - going) ** 2 : grown;
        const alpha = leaving
          ? going >= 1
            ? 0
            : Math.max(0.12, 1 - 1.2 * going)
          : coming <= 0
            ? 0
            : 0.2 + 0.8 * grown;

        const mark = `${leaving ? "t" : "b"}${size.toFixed(4)}|${alpha.toFixed(3)}`;
        if (mark === slide.shown) return;
        slide.shown = mark;

        for (const row of slide.rows) {
          row.style.transformOrigin = leaving ? "50% 0" : "50% 100%";
          row.style.transform = `scaleY(${size.toFixed(4)})`;
          row.style.opacity = alpha.toFixed(3);
        }
      });

      if (next !== current) {
        current = next;
        place();
        setActive(next);
      }
    };

    const clock = startClock(draw);
    const refresh = () => {
      measure();
      clock.refresh();
    };

    refresh();

    /* ページの長さが変わったとき（前の区画が切り替わったときなど）にも、測り直します。 */
    const observer = new ResizeObserver(refresh);
    observer.observe(document.body);
    window.addEventListener("resize", refresh);
    document.fonts.addEventListener("loadingdone", refresh);

    return () => {
      clock.stop();
      observer.disconnect();
      window.removeEventListener("resize", refresh);
      document.fonts.removeEventListener("loadingdone", refresh);

      delete section.dataset.flying;
      flying.style.visibility = "";
      mover.style.transform = "";
      mover.style.opacity = "";
      card.style.transform = "";
      mascot.style.transform = "";
      for (const roll of rolls) roll.inner.style.transform = "";
      for (const slide of slides) {
        for (const row of slide.rows) {
          row.style.transformOrigin = "";
          row.style.transform = "";
          row.style.opacity = "";
        }
      }
    };
  }, [cinema, cards]);

  /** そのカードが映る位置まで、スクロールします。 */
  const goTo = (index: number) => {
    if (!cinema) return;
    window.scrollTo({ top: pinned.current.top + index * pinned.current.step + 1 });
  };

  const number = (index: number) => String(index + 1).padStart(2, "0");

  return (
    <section
      ref={sectionRef}
      id={id}
      className={cinema ? `${styles.about} ${styles.cinema}` : styles.about}
      style={{ "--count": cards.length } as CSSProperties}
      aria-labelledby={`${id}-title`}
    >
      <header className={`shell ${styles.head}`}>
        <h2 id={`${id}-title`} className={styles.headTitle} lang="en">
          {title}
        </h2>
        <p className={styles.headLead} lang="en">
          {lead.map((line) => (
            <span key={line}>{line} </span>
          ))}
        </p>
      </header>

      {/* 画面に貼りつけて動かす見出し。内容は上の見出しと同じなので、読み上げからは外します。 */}
      <div ref={flyingRef} className={styles.flying} aria-hidden="true">
        <div ref={moverRef} className={styles.mover}>
          <p className={styles.flyingTitle}>
            <Rolling text={title} kind="title" />
          </p>
          <p className={styles.flyingLead}>
            {lead.map((line) => (
              <span key={line}>
                <Rolling text={line} kind="lead" />
              </span>
            ))}
          </p>
        </div>
      </div>

      <div ref={pinRef} className={styles.pin}>
        <div ref={cardRef} className={styles.card}>
          <p className={styles.number} aria-hidden="true">
            {number(active)}
          </p>

          <div ref={slidesRef} className={styles.slides}>
            {cards.map((card, index) => (
              <article
                key={card.id}
                className={`${styles.slide} ${TONES[card.tone]}`}
                data-slide=""
                data-active={!cinema || index === active ? "" : undefined}
              >
                <h3 className="u-sr-only">{card.heading}</h3>

                <div className={styles.rows} aria-hidden="true">
                  {card.rows.map((row, line) => (
                    <div key={line} className={styles.row} data-row="">
                      {row.map((part, order) => (
                        <Part
                          key={order}
                          part={part}
                          anchor={line === 0 && order === anchorOf(row, index === 0)}
                        />
                      ))}
                    </div>
                  ))}

                  {card.badges.map((icon, order) => (
                    <span key={icon} className={`${styles.badge} ${order === 0 ? styles.badgeFirst : styles.badgeSecond}`}>
                      <Icon name={icon} />
                    </span>
                  ))}
                </div>

                <div className={styles.copy}>
                  <p className={styles.text}>
                    {card.text.map((line) => (
                      <span key={line}>{line}</span>
                    ))}
                  </p>
                  <MoreButton
                    className={styles.more}
                    href={card.href}
                    label={more}
                    onFocus={() => goTo(index)}
                  />
                </div>
              </article>
            ))}

            <span ref={mascotRef} className={styles.mascot}>
              <Mascot />
            </span>
          </div>

          <ol className={styles.dots}>
            {cards.map((card, index) => (
              <li key={card.id}>
                <button
                  type="button"
                  className={styles.dot}
                  aria-label={`${number(index)}　${card.heading}`}
                  aria-current={index === active ? "true" : undefined}
                  onClick={() => goTo(index)}
                />
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
