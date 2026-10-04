/**
 * /home の物語ページに出てくる文言をまとめています。
 * 章の見出し、スクロールに合わせて切り替わる文、絵の中の看板や名札など、
 * 書き換えることの多いものはすべてこのファイルにあります。
 */

export type StoryChapterId =
  | "office"
  | "project"
  | "wedding"
  | "birth"
  | "lessons"
  | "design"
  | "coding"
  | "todo"
  | "abroad"
  | "career"
  | "freelance"
  | "loved";

export type StoryBeat = {
  /**
   * 章の進み具合（0〜1）のうち、この文を出し始める位置。
   * 次の文が出るまで、画面に残ります。
   */
  at: number;
  text: string;
};

export type StoryChapter = {
  id: StoryChapterId;
  title: string;
  /**
   * 章の長さ。数字が大きいほど、その章にかけるスクロール量が増え、
   * 絵がゆっくり動きます。
   */
  weight: number;
  beats: StoryBeat[];
};

export const story = {
  /** ブラウザのタブと、検索結果・SNS のリンクに出る文言。 */
  title: "愛されるエンジニア｜私の物語",
  description:
    "デザイナーの母と、システムエンジニアの父。二人の出会いから、フリーランスとして活動する現在までを、スクロールで読み進める物語にしました。",

  hero: {
    eyebrow: "ストーリー",
    headline: ["愛される", "エンジニア"],
    lead: "「この人にお願いしたい」と思っていただけるエンジニアになること。それが、私の目標です。そう考えるようになった理由を、少しだけお話しさせてください。",
    greeting: "はじめまして。",
    scrollLabel: "スクロールして物語を読む",
  },

  film: {
    /** 画面左上に出し続ける小さな題。 */
    label: "私の物語",
    skip: "物語をとばす",
    railLabel: "物語の章",
    /** 章番号の前後に付く語。「第3章」のように読み上げられます。 */
    chapterPrefix: "第",
    chapterSuffix: "章",
  },

  chapters: [
    {
      id: "office",
      title: "はじまりは、ひとつのオフィス",
      weight: 2.4,
      beats: [
        { at: 0, text: "物語は、Hitachi のオフィスから始まります。" },
        { at: 0.32, text: "母は、デザイナーとして。" },
        {
          at: 0.66,
          text: "父は、システムエンジニアとして。二人は、同じ会社で働いていました。",
        },
      ],
    },
    {
      id: "project",
      title: "ひとつのチームに",
      weight: 2.4,
      beats: [
        {
          at: 0,
          text: "大きなプロジェクトが立ち上がり、デザイナーとたくさんのエンジニアが、ひとつのチームで日々を過ごすことになりました。",
        },
        {
          at: 0.3,
          text: "母は画面をデザインし、父はそれを動かす仕組みをつくる。",
        },
        {
          at: 0.64,
          text: "力を合わせるほどに、二人のご縁も深まっていきました。",
        },
      ],
    },
    {
      id: "wedding",
      title: "結婚",
      weight: 1.4,
      beats: [
        { at: 0, text: "プロジェクトをやり遂げたあと、二人は結婚しました。" },
      ],
    },
    {
      id: "birth",
      title: "そして、私が生まれました",
      weight: 1.4,
      beats: [
        {
          at: 0,
          text: "デザイナーの母と、システムエンジニアの父。その二人のあいだに、私は生まれました。",
        },
      ],
    },
    {
      id: "lessons",
      title: "母から、父から",
      weight: 2.4,
      beats: [
        { at: 0, text: "母からは、デザインと Web 制作を。" },
        { at: 0.36, text: "父からは、システム開発の考え方と技術を。" },
        {
          at: 0.7,
          text: "持っているものを少しでも多く伝えようと、一生懸命に教えてくれた二人の姿を、今でも忘れることができません。",
        },
      ],
    },
    {
      id: "design",
      title: "はじめてのデザイン",
      weight: 1.9,
      beats: [
        {
          at: 0,
          text: "Figma で、数 px 単位の余白をととのえる。色やフォントサイズひとつで、印象は大きく変わります。",
        },
        { at: 0.68, text: "デザインを仕上げたときの、あのうれしさ。" },
      ],
    },
    {
      id: "coding",
      title: "画面に、あらわれた",
      weight: 1.9,
      beats: [
        {
          at: 0,
          text: "仕上げたデザインを、今度は自分の手でコーディングしていきます。",
        },
        {
          at: 0.62,
          text: "はじめて HTML として画面に表示できたときの感動は、今でも鮮明に覚えています。",
        },
      ],
    },
    {
      id: "todo",
      title: "自分でつくった TODO アプリ",
      weight: 1.9,
      beats: [
        { at: 0, text: "父から受け取った知識で、TODO アプリをつくりました。" },
        {
          at: 0.34,
          text: "一日の予定を、自分のアプリでひとつずつチェックしていく。つくったもので毎日が便利になる。その喜びを知りました。",
        },
      ],
    },
    {
      id: "abroad",
      title: "海の向こうへ",
      weight: 2,
      beats: [
        { at: 0, text: "やがて飛行機に乗り、海外へ。" },
        { at: 0.56, text: "現地の大学で学び、卒業しました。" },
      ],
    },
    {
      id: "career",
      title: "システム、アプリ、そして AI",
      weight: 2.2,
      beats: [
        {
          at: 0,
          text: "卒業後は開発会社に入り、さまざまな分野のシステムを開発。",
        },
        { at: 0.38, text: "モバイルアプリの開発にも携わり、" },
        {
          at: 0.66,
          text: "AI の学習と開発へと、技術の幅を広げていきました。",
        },
      ],
    },
    {
      id: "freelance",
      title: "帰国、そしてフリーランスへ",
      weight: 2.2,
      beats: [
        { at: 0, text: "帰国してからは、株式会社で経験を重ねました。" },
        {
          at: 0.5,
          text: "いまはフリーランスとして、クラウドワークスとランサーズで活動しています。",
        },
      ],
    },
    {
      id: "loved",
      title: "愛されるエンジニアへ",
      weight: 1.7,
      beats: [
        {
          at: 0,
          text: "Web 制作、EC サイト、業務システム、Web・モバイルアプリ、そして AI 開発まで。",
        },
        {
          at: 0.58,
          text: "「この人にお願いしたい」と思っていただけるエンジニアであるために、今日も手を動かしています。",
        },
      ],
    },
  ] satisfies StoryChapter[],

  /** 絵の中に書かれている文字。 */
  labels: {
    /** 最初の章の、ビルの看板。 */
    company: "HITACHI",
    designer: "デザイナー",
    engineer: "システムエンジニア",
    mother: "母",
    father: "父",
    me: "私",
    project: "PROJECT",
    design: "DESIGN",
    system: "SYSTEM",
    figma: "Figma",
    done: "完成",
    /** 第5章の、子どものノートに並ぶ二本の目盛り。 */
    skills: ["デザイン", "システム"],
    /** 第7章の、エディタの窓とブラウザの窓の題。 */
    editor: "index.html",
    browser: "localhost",
    start: "Start",
    todo: {
      title: "TODO",
      morning: "朝",
      night: "夜",
      items: [
        { time: "7:00", label: "起きる" },
        { time: "8:30", label: "学校" },
        { time: "16:00", label: "宿題" },
        { time: "19:00", label: "コーディング" },
        { time: "21:00", label: "日記" },
      ],
    },
    university: "UNIVERSITY",
    career: ["SYSTEM", "MOBILE APP", "AI"],
    /** 帰国後に勤めた会社の看板。 */
    corporation: "株式会社",
    platforms: ["CrowdWorks", "Lancers"],
    order: "ご依頼",
    services: ["Web制作", "ECサイト", "業務システム", "アプリ", "AI"],
    thanks: ["ありがとう！", "またお願いします！"],
  },

  outro: {
    kicker: "ご相談",
    title: ["まずは、お気軽に", "ご相談ください。"],
    lead: "「こんなサービスをつくりたい」「アイデアを形にできるか相談したい」という段階でも大歓迎です。一緒に最適な形を考え、プロジェクトの実現を全力でサポートいたします。",
    primary: { label: "開発実績を見る", href: "/#project-records" },
    secondary: { label: "お客様の声を見る", href: "/#client-reviews" },
  },
} as const;
