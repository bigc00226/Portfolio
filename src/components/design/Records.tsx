"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

import { useIsomorphicLayoutEffect } from "@/components/useInView";
import type { DesignRecord } from "@/data/design";
import type { Discipline } from "@/data/projects";

import { MoreButton } from "./MoreButton";
import styles from "./Records.module.css";
import { MOTION_OK, easeInOut, pageTop, range, startClock } from "./scrollClock";

/**
 * 見出しの二行が、左右から寄ってくる動き。
 * 二行目の上端が画面の下端に入ってから、画面の高さの SPAN 倍だけスクロールする
 * あいだに、一行目は右から、二行目は左から、元の位置へ寄ってきます。
 * FROM は、はじめのずれです（画面の幅に対する割合。プラスが右）。
 */
const SPAN = 0.9;
const FROM: readonly [number, number] = [0.086, -0.156];

/** 区画の上端が、画面のこの高さ（画面の高さに対する割合）を過ぎたら、地の色を明るく切り替えます。 */
const LIGHT_AT = 0.02;

/**
 * 画像が現れる範囲。カードの上端が、画面のこの高さからこの高さへ上がるあいだに、
 * 下から浮かび上がります（画面の高さに対する割合）。
 */
const RISE: readonly [number, number] = [1, 0.7];

type Props = {
  id: string;
  /** 大きな見出し（二行）。 */
  title: readonly string[];
  /** 読み上げに使う見出し。 */
  heading: string;
  items: readonly DesignRecord[];
  tags: Record<Discipline, string>;
  /** 画像にポインターを載せたときに出す文言。 */
  hover: string;
  /** 一件ごとの行き先と、ボタン。 */
  button: { label: string; href: string };
};

/**
 * 開発実績の紹介。
 *
 * サーバーが返す HTML では、明るい地に、見出しと三件の実績が、そのまま並んでいます。
 * JavaScript を無効にしている方と、「視差効果を減らす」設定の方には、そのまま
 * お見せします。それ以外の環境では、暗い地のまま大きな見出しが下から現れ、
 * 二行が左右から寄ってきます。区画が画面を占めたところで、地の色が明るく切り替わり、
 * 続いて、実績の画像が下から浮かび上がります。上へ戻ると、逆の順に戻ります。
 */
export function Records({ id, title, heading, items, tags, hover, button }: Props) {
  const sectionRef = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const motion = window.matchMedia(MOTION_OK);
    const lines = Array.from(section.querySelectorAll<HTMLElement>("[data-line]"));
    const cards = Array.from(section.querySelectorAll<HTMLElement>("[data-card]"), (el) => ({
      el,
      top: 0,
      shown: "",
    }));

    let stop: (() => void) | null = null;

    const start = () => {
      let top = 0;
      let second = 0;
      let width = 1;
      let height = 1;
      let slid = "";
      let lit: boolean | null = null;

      const measure = () => {
        width = window.innerWidth;
        height = window.innerHeight;
        top = pageTop(section);
        /* 行は横へ動かすだけなので、縦の位置は、そのまま測れます。 */
        second = pageTop(lines[1] ?? lines[0] ?? section);
        for (const card of cards) {
          /* 浮かび上がりきった位置で測ります。 */
          card.el.style.setProperty("--risen", "1");
          card.top = pageTop(card.el);
          card.shown = "";
        }
        slid = "";
      };

      const draw = (scroll: number) => {
        /* 見出し：二行が、左右から寄ってきます。 */
        const away = (1 - easeInOut(range(height, height * (1 - SPAN), second - scroll))).toFixed(4);
        if (away !== slid) {
          slid = away;
          lines.forEach((line, index) => {
            const shift = (FROM[index] ?? 0) * width * Number(away);
            line.style.transform = `translate3d(${shift.toFixed(1)}px, 0, 0)`;
          });
        }

        /* 地の色：区画が画面を占めたら、明るく切り替えます。 */
        const bright = top - scroll <= height * LIGHT_AT;
        if (bright !== lit) {
          lit = bright;
          section.toggleAttribute("data-lit", bright);
        }

        /* 画像：下から浮かび上がります。 */
        for (const card of cards) {
          const risen = range(height * RISE[0], height * RISE[1], card.top - scroll).toFixed(3);
          if (risen === card.shown) continue;
          card.shown = risen;
          card.el.style.setProperty("--risen", risen);
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
        section.removeAttribute("data-lit");
        for (const line of lines) line.style.transform = "";
        for (const card of cards) card.el.style.removeProperty("--risen");
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

  return (
    <section ref={sectionRef} id={id} className={styles.records} aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`} className={styles.title} lang="en" aria-label={heading}>
        {title.map((line) => (
          <span key={line} className={styles.line} data-line="">
            {line}
          </span>
        ))}
      </h2>

      <ul className={styles.cards}>
        {items.map((item) => (
          <li key={item.id} className={styles.card} data-card="">
            <Link className={styles.link} href={button.href}>
              <span className={styles.thumb}>
                <Image src={item.image} alt="" fill sizes="(max-width: 760px) 100vw, 40vw" />
                <span className={styles.hover} aria-hidden="true" lang="en">
                  {hover}
                </span>
              </span>
              <span className={styles.meta}>
                <span className={styles.no} lang="en">
                  No.{item.id}
                </span>
                {item.disciplines.map((discipline) => (
                  <span key={discipline} className={styles.tag} data-tag={discipline} lang="en">
                    {tags[discipline]}
                  </span>
                ))}
              </span>
              <span className={styles.name}>{item.title}</span>
              <span className={styles.industry}>{item.industry}</span>
            </Link>
          </li>
        ))}
      </ul>

      <MoreButton className={styles.more} href={button.href} label={button.label} tone="#f06a25" />
    </section>
  );
}
