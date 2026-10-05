import type { StaticImageData } from "next/image";

import frame01 from "@/images/design/01.jpg";
import frame02 from "@/images/design/02.jpg";
import frame03 from "@/images/design/03.jpg";
import frame04 from "@/images/design/04.jpg";
import frame05 from "@/images/design/05.jpg";
import frame06 from "@/images/design/06.jpg";
import frame07 from "@/images/design/07.jpg";
import frame08 from "@/images/design/08.jpg";

/**
 * /design のページに出てくる文言と画像をまとめています。
 *
 * 帯に並ぶ画像は、本番の写真が用意できるまでの仮のものです。
 * src/images/design/ の 01.jpg〜08.jpg を同じ名前で上書きすれば、
 * そのまま差し替わります。帯の枠は 16:9 です。比率の違う写真は、
 * ゆがめずに、枠いっぱいになるよう切り抜いて表示します。
 */

export type DesignFrame = {
  image: StaticImageData;
  /** 画像の説明。飾りとして扱う場合は空のままにします。 */
  alt: string;
};

export const design = {
  /** ブラウザのタブと、検索結果・SNS のリンクに出る文言。 */
  title: "システム＆AI ❤️愛される❤️ エンジニア｜Love Apple",
  description:
    "システムと AI の開発、そして Web 制作。愛されるエンジニアであるために大切にしていることを、スクロールで動く写真の帯とともにご紹介します。",

  hero: {
    /**
     * 見出しは三行です。二行目（middle）の両側には、ハートが付きます。
     * ハートは、はじめは淡い色で置かれていて、スクロールすると赤い手書きの線で
     * なぞられ、塗られます。二行目は、全角の文字で書いてください。ハートの位置を、
     * 文字数から決めています。
     */
    first: "システム＆AI",
    middle: "愛される",
    last: "エンジニア",
    /** 画面の左右の端に、縦に置く小さな文字。 */
    sideLeft: "SYSTEM & AI DEVELOPMENT",
    sideRight: "BY LOVE APPLE",
    scrollLabel: "スクロール",
  },

  /** 帯に並べる画像。上から順に、先頭から並びます。 */
  frames: [
    { image: frame01, alt: "" },
    { image: frame02, alt: "" },
    { image: frame03, alt: "" },
    { image: frame04, alt: "" },
    { image: frame05, alt: "" },
    { image: frame06, alt: "" },
    { image: frame07, alt: "" },
    { image: frame08, alt: "" },
  ] satisfies DesignFrame[],

  concept: {
    /** 一語ずつ、下からせり上がって現れます。 */
    words: ["CONCEPT", "OF", "A", "BELOVED", "ENGINEER"],
    lead: "「この人にお願いしたい」と思っていただけるエンジニアになること。それが、私の目標です。",
    body: [
      "父はシステムエンジニア、母はデザイナー。二人から受け取ったものを土台に、デザインを理解し、それを自分の手で動く形にする力を磨いてきました。",
      "Web 制作、EC サイト、業務システム、Web・モバイルアプリ、そして AI 開発まで。「こんなサービスをつくりたい」という段階から、一緒に最適な形を考えます。",
    ],
    primary: { label: "開発実績を見る", href: "/#project-records" },
    secondary: { label: "物語を読む", href: "/home" },
  },
} as const;
