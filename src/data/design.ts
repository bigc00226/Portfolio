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

/** 大きな字の色。 */
export type ConceptTone = "blue" | "orange" | "green" | "red" | "ink";

/** 大きな字を書き終えたところに添える、小さな絵。 */
export type ConceptIcon =
  | "megaphone"
  | "heart"
  | "gear"
  | "palette"
  | "bulb"
  | "sprout"
  | "question"
  | "code"
  | "bubble";

/**
 * 文章の一行。
 * 文字列だけを書いた行は、小さな字で、淡い色から黒へ変わっていきます。
 * write を持つ行は、大きな色の字で、ペンを持った手が書いていきます。
 */
export type ConceptLine =
  | string
  | {
      /** 手で書かれる、大きな字。 */
      write: string;
      tone: ConceptTone;
      icon: ConceptIcon;
      /** 大きな字の前と後ろに、同じ行のまま添える小さな字。 */
      before?: string;
      after?: string;
      /** 黄色いマーカーの下線を引きます。 */
      marker?: boolean;
    };

export const design = {
  /** ブラウザのタブと、検索結果・SNS のリンクに出る文言。 */
  title: "システム＆AI ❤️愛される❤️ エンジニア｜Love Apple",
  description:
    "システムと AI の開発、そして Web 制作。愛されるエンジニアであるために大切にしていることを、スクロールで動く写真の帯とともにご紹介します。",

  hero: {
    /**
     * 見出しは三行です。二行目（middle）は、両側にハートを付けて、はじめは淡い色で
     * 置いておきます。スクロールすると、左のハート、字、右のハートの順に、赤い手書きの
     * 線で書かれていきます。
     *
     * 手書きの線は、字ごとに用意した絵です（handwriting.ts の GLYPHS。いまは
     * 「愛・さ・れ・る」の四つ）。ほかの字を使うと、その字は手書きにならず、
     * 黒い字のまま表示されます。位置を文字数から決めているので、二行目は
     * 全角の文字で書いてください。
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
    title: "愛されるエンジニア",
    /** 見出しの横に小さく添える欧文。 */
    label: "CONCEPT OF A BELOVED ENGINEER",
    /**
     * 本文。空行で区切られたひとかたまりを、一つの配列にしています。
     * スクロールすると、画面の下から現れた行が、左から順に書かれていきます。
     */
    stanzas: [
      [
        "私は、",
        { write: "ただシステムを作るエンジニアではありません。", tone: "blue", icon: "megaphone" },
      ],
      [{ write: "「この人にお願いしたい」と思っていただけること。", tone: "red", icon: "heart" }],
      ["それが、私が大切にしていることです。"],
      ["父はシステムエンジニア、", "母はデザイナーとして、同じ会社で働いていました。"],
      ["二人は仕事を通じて出会い、", "その環境の中で、私は自然とものづくりに触れて育ちました。"],
      ["父からは、", { write: "システムを考え、仕組みをつくる力を。", tone: "blue", icon: "gear" }],
      ["母からは、", { write: "人の心を動かすデザインの力を。", tone: "orange", icon: "palette" }],
      ["二人から受け継いだものが、", "今の私のエンジニアとしての原点になっています。"],
      ["Figmaで数pxの違いにこだわること。"],
      ["色やフォント、余白によって、", "画面の印象が大きく変わること。"],
      ["そして、デザインしたものを自分の手でコードに変え、", "実際に画面として動いた瞬間。"],
      [
        "その一つひとつに、",
        { write: "ものづくりの面白さを感じてきました。", tone: "orange", icon: "bulb" },
      ],
      ["Webサイト、ECサイト、業務システム、", "Web・モバイルアプリ、そしてAI。"],
      ["時代とともに技術は変わり続けます。"],
      [
        "だからこそ、",
        { write: "私自身も学び続け、変わり続けたいと考えています。", tone: "green", icon: "sprout" },
      ],
      ["ただ「作る」のではなく、", { write: "なぜ作るのか。", tone: "blue", icon: "question" }],
      ["誰のために作るのか。"],
      ["使う人にとって、本当に便利なのか。"],
      ["その先にあるビジネスに、", "どんな価値を生み出せるのか。"],
      ["技術だけではなく、", "デザインや使いやすさ、運用まで考える。"],
      [
        "そして、お客様の「こんなものを作りたい」という想いを、",
        "一緒に整理し、具体的な形にしていく。",
      ],
      [
        {
          before: "それが、",
          write: "私の考えるエンジニアの仕事",
          after: "です。",
          tone: "green",
          icon: "code",
        },
      ],
      ["まだアイデアの段階でも構いません。"],
      ["小さなご相談でも構いません。"],
      ["「こんなサービスを作りたい」"],
      ["「この業務をもっと便利にしたい」"],
      ["「このアイデアは実現できるだろうか」"],
      [{ write: "そんな想いを、ぜひ聞かせてください。", tone: "orange", icon: "bubble" }],
      ["技術を提供するだけではなく、", "信頼され、相談され、長く一緒に歩んでいける。"],
      [
        { write: "そんな「愛されるエンジニア」を、", tone: "ink", icon: "heart", marker: true },
        "これからも目指していきます。",
      ],
    ] satisfies ConceptLine[][],
    primary: { label: "開発実績を見る", href: "/#project-records" },
    secondary: { label: "物語を読む", href: "/home" },
  },

  /**
   * ページの最後を、右から左へ流れていく大きな文字。
   * heavy は太い字、light は細い字で組みます。❤ のところには、ハートの絵が入ります。
   */
  flow: {
    heavy: "L❤ve",
    light: "Apple",
    /** 読み上げに使う、ふつうの綴り。 */
    label: "Love Apple",
  },
} as const;
