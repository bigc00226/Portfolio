import type { StaticImageData } from "next/image";

import logoCrowdworks from "@/images/brands/crowdworks.svg";
import logoLancers from "@/images/brands/lancers.svg";
import frame01 from "@/images/design/01.jpg";
import frame02 from "@/images/design/02.jpg";
import frame03 from "@/images/design/03.jpg";
import frame04 from "@/images/design/04.jpg";
import frame05 from "@/images/design/05.jpg";
import frame06 from "@/images/design/06.jpg";
import frame07 from "@/images/design/07.jpg";
import frame08 from "@/images/design/08.jpg";
import imgAgriculture from "@/images/design/industries/agriculture.jpg";
import imgCare from "@/images/design/industries/care.jpg";
import imgEducation from "@/images/design/industries/education.jpg";
import imgEnergy from "@/images/design/industries/energy.jpg";
import imgFinance from "@/images/design/industries/finance.jpg";
import imgGovernment from "@/images/design/industries/government.jpg";
import imgHealthcare from "@/images/design/industries/healthcare.jpg";
import imgLogistics from "@/images/design/industries/logistics.jpg";
import imgManufacturing from "@/images/design/industries/manufacturing.jpg";
import imgMedia from "@/images/design/industries/media.jpg";
import imgOperations from "@/images/design/industries/operations.jpg";
import imgProperty from "@/images/design/industries/property.jpg";
import imgResearch from "@/images/design/industries/research.jpg";
import imgRetail from "@/images/design/industries/retail.jpg";
import imgSecurity from "@/images/design/industries/security.jpg";
import sceneAi from "@/images/design/scenes/ai.jpg";
import sceneCloud from "@/images/design/scenes/cloud.jpg";
import sceneCode from "@/images/design/scenes/code.jpg";
import sceneDashboard from "@/images/design/scenes/dashboard.jpg";
import sceneDesign from "@/images/design/scenes/design.jpg";
import sceneHearing from "@/images/design/scenes/hearing.jpg";
import sceneLaunch from "@/images/design/scenes/launch.jpg";
import sceneMobile from "@/images/design/scenes/mobile.jpg";
import sceneSketch from "@/images/design/scenes/sketch.jpg";
import sceneSupport from "@/images/design/scenes/support.jpg";
import sceneTest from "@/images/design/scenes/test.jpg";
import sceneTrust from "@/images/design/scenes/trust.jpg";
import stripSkillTile from "@/images/design/strips/skill-tile.jpg";
import stripSkillWide from "@/images/design/strips/skill-wide.jpg";
import stripStoryTile from "@/images/design/strips/story-tile.jpg";
import stripStoryWide from "@/images/design/strips/story-wide.jpg";
import stripValuesTile from "@/images/design/strips/values-tile.jpg";
import stripValuesWide from "@/images/design/strips/values-wide.jpg";
import stripVoiceTile from "@/images/design/strips/voice-tile.jpg";
import stripVoiceWide from "@/images/design/strips/voice-wide.jpg";

import { allProjects, industries, totalIndustries, totalProjects, type Discipline } from "./projects";

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

/** 横に流れるギャラリーの一枚。 */
export type DesignIndustry = {
  id: string;
  /**
   * 大きく出す業種名。長い名前は、行ごとに分けて書きます。
   * 行をつなげたものが、業種名そのものになるようにしてください。
   */
  lines: readonly string[];
  /** 画像の下に小さく添える欧文。 */
  caption: string;
  image: StaticImageData;
};

/** 白いカードの差し色。見出しの色の字、ボタン、小さな札に使います。 */
export type CardTone = "green" | "yellow" | "orange" | "blue";

/** 白いカードの見出しに並べる部品。字か、絵です。 */
export type CardPart =
  | { text: string; /** 差し色で組みます。 */ tinted?: boolean }
  | { image: StaticImageData; /** 幅の決め方。fill は、行の残りの幅いっぱいに広げます。 */ size: "tile" | "fill" };

/** 白いカードの一枚ぶん。 */
export type DesignCard = {
  id: string;
  tone: CardTone;
  /** 大きな見出し。二行で、それぞれに字と絵を並べます。 */
  rows: readonly [readonly CardPart[], readonly CardPart[]];
  /** 読み上げと、動かない表示で使う見出し。 */
  heading: string;
  /** 説明文。行ごとに分けて書きます。 */
  text: readonly string[];
  /** ボタンの行き先。 */
  href: string;
  /** 見出しのまわりに貼る、小さな丸い札。 */
  badges: readonly [ConceptIcon, ConceptIcon];
};

/** 開発実績から選んで並べる一件。 */
export type DesignRecord = {
  id: string;
  /** 業種名。 */
  industry: string;
  title: string;
  disciplines: readonly Discipline[];
  image: StaticImageData;
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

/**
 * お仕事を受けている、外部のサービスのプロフィール。ご相談の入口のボタンと、
 * いちばん下の案内（CONTACT と FIND ME ON…）は、どちらもここへ移ります。
 *
 * logo は、それぞれのサービスが自分のサイトで使っている、公式のアイコンです
 * （src/images/brands/）。色も形も、手を加えずにそのまま使っています。
 * - crowdworks.svg … crowdworks.jp のアイコン（https://crowdworks.jp/favicon.svg）。
 *   角の丸い白い地が、絵に含まれています。
 * - lancers.svg … www.lancers.jp がアプリの案内に使っているアイコン
 *   （https://static.lancers.jp/renewal/img/common/header/logo_app_lancers.svg）。
 *   絵は四角なので、ランサーズ自身の表示（34px に対して角の丸み 8px）に合わせて、
 *   logoCorner で角を丸めて表示します。
 */
const platforms = {
  crowdworks: {
    name: "CrowdWorks",
    href: "https://crowdworks.jp/public/employees/7102715",
    logo: logoCrowdworks,
    logoCorner: undefined,
  },
  lancers: {
    name: "Lancers",
    href: "https://www.lancers.jp/profile/funa_10Apple",
    logo: logoLancers,
    logoCorner: "23.5%",
  },
} as const;

/** 開発実績（projects.ts）から、番号で一件を選びます。画像は、その業種のものを使います。 */
function record(id: string, image: StaticImageData): DesignRecord {
  const project = allProjects.find((item) => item.id === id);
  const group = industries.find((item) => item.projects.some((entry) => entry.id === id));
  if (!project || !group) throw new Error(`開発実績 ${id} が見つかりません。`);

  return {
    id,
    industry: group.name,
    title: project.title,
    disciplines: project.disciplines,
    image,
  };
}

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

  /**
   * 流れる大きな文字のあと、暗いハートが広がって画面を覆い、その上に現れる紹介文。
   * label は小見出し、paragraphs は本文です（段落ごとに、行を並べます）。
   */
  about: {
    label: "LOVE APPLE — TECHNOLOGY × DESIGN × DEVELOPMENT",
    paragraphs: [
      [
        "Love Appleは、両親から受け継いだウェブ制作とシステム開発の知識を原点に、",
        "留学時代や開発会社で培ったシステム開発・アプリ開発・AI開発の経験を活かし、",
        "これまで15種類の業種にわたるさまざまなプロジェクトに携わってきました。",
      ],
      [
        "Webサイトから業務システム、アプリ、AIまで、",
        "業種や課題に合わせて技術を組み合わせ、",
        "アイデアを具体的なカタチへと変えていきます。",
      ],
    ],
  },

  /**
   * 紹介文のあと、横に流れていく 15 の業種。並びは、トップページの開発実績と同じです。
   *
   * 画像は、本番の写真が用意できるまでの仮の絵です。src/images/design/industries/ の
   * 同じ名前のファイルを上書きすれば、そのまま差し替わります。枠は 13:8 です。
   * 比率の違う写真は、ゆがめずに、枠いっぱいになるよう切り抜いて表示します。
   */
  industries: {
    /** 読み上げに使う、この区画の見出し。 */
    heading: "これまでに携わってきた15の業種",
    items: [
      { id: "agriculture", lines: ["農林水産業"], caption: "AGRICULTURE, FORESTRY & FISHERIES", image: imgAgriculture },
      { id: "manufacturing", lines: ["製造業"], caption: "MANUFACTURING", image: imgManufacturing },
      { id: "retail", lines: ["小売・EC・飲食"], caption: "RETAIL, E-COMMERCE & FOOD", image: imgRetail },
      { id: "healthcare", lines: ["医療・", "ヘルスケア"], caption: "MEDICAL & HEALTHCARE", image: imgHealthcare },
      { id: "care", lines: ["介護・福祉"], caption: "NURSING CARE & WELFARE", image: imgCare },
      { id: "government", lines: ["行政・公共"], caption: "GOVERNMENT & PUBLIC SERVICES", image: imgGovernment },
      { id: "education", lines: ["教育"], caption: "EDUCATION", image: imgEducation },
      { id: "finance", lines: ["金融・保険"], caption: "FINANCE & INSURANCE", image: imgFinance },
      { id: "logistics", lines: ["物流・運輸・", "モビリティ"], caption: "LOGISTICS, TRANSPORT & MOBILITY", image: imgLogistics },
      { id: "property", lines: ["不動産・建設"], caption: "REAL ESTATE & CONSTRUCTION", image: imgProperty },
      { id: "energy", lines: ["エネルギー・", "環境"], caption: "ENERGY & ENVIRONMENT", image: imgEnergy },
      { id: "operations", lines: ["バックオフィス・", "経営管理"], caption: "BACK OFFICE & MANAGEMENT", image: imgOperations },
      { id: "media", lines: ["メディア・", "エンタメ・スポーツ"], caption: "MEDIA, ENTERTAINMENT & SPORTS", image: imgMedia },
      { id: "security", lines: ["セキュリティ・", "インフラ"], caption: "SECURITY & INFRASTRUCTURE", image: imgSecurity },
      { id: "research", lines: ["研究・科学・", "分野横断AI"], caption: "RESEARCH, SCIENCE & CROSS-DOMAIN AI", image: imgResearch },
    ] satisfies DesignIndustry[],
  },

  /**
   * 業種のギャラリーの最後に、右から入ってくる見出しと、そのあとに重なる白いカード。
   * カードは画面に固定され、スクロールすると、見出しが一枚ずつ切り替わります。
   *
   * 見出しの絵は、仮の絵です。src/images/design/strips/ の同じ名前のファイルを
   * 上書きすれば、そのまま差し替わります（横長の絵は 5:1、小さな絵も 5:1 で、
   * 枠に合わせて切り抜きます）。
   */
  profile: {
    title: "ABOUT",
    /** 見出しの下に添える二行。 */
    lead: ["Not just an engineer who builds systems,", "but one you can rely on, again and again."],
    /** ボタンの文言。どのカードでも同じです。 */
    more: "MORE DETAILS",
    cards: [
      {
        id: "promise",
        tone: "green",
        heading: "PROMISE & VALUES",
        rows: [
          [{ text: "PROMISE" }, { text: "&", tinted: true }, { image: stripValuesTile, size: "tile" }],
          [{ image: stripValuesWide, size: "fill" }, { text: "VALUES", tinted: true }],
        ],
        text: [
          "ただシステムを作るのではなく、なぜ作るのか、誰のために作るのか。",
          "技術だけでなく、デザインや使いやすさ、運用まで考えて、",
          "「この人にお願いしたい」と思っていただける仕事を大切にしています。",
        ],
        href: "#design-concept",
        badges: ["heart", "bulb"],
      },
      {
        id: "history",
        tone: "yellow",
        heading: "PROFILE & HISTORY",
        rows: [
          [{ text: "PROFILE" }, { text: "&", tinted: true }, { image: stripStoryTile, size: "fill" }],
          [{ image: stripStoryWide, size: "fill" }, { text: "HISTORY", tinted: true }],
        ],
        text: [
          "父はシステムエンジニア、母はデザイナー。",
          "ものづくりに触れて育ち、留学と開発会社での経験を経て、",
          "いまはフリーランスのエンジニアとして活動しています。",
        ],
        href: "/home",
        badges: ["palette", "sprout"],
      },
      {
        id: "skills",
        tone: "orange",
        heading: "SYSTEM, APP & AI",
        rows: [
          [{ text: "SYSTEM" }, { image: stripSkillWide, size: "fill" }],
          [{ text: "APP & AI" }, { image: stripSkillTile, size: "fill" }],
        ],
        text: [
          "Webサイト、ECサイト、業務システムから、",
          "Web・モバイルアプリ、そしてAI開発まで。",
          `${totalIndustries}の業種で、${totalProjects}件のプロジェクトに携わってきました。`,
        ],
        href: "/#project-records",
        badges: ["gear", "code"],
      },
      {
        id: "voices",
        tone: "blue",
        heading: "VOICES",
        rows: [
          [{ text: "VOICE" }, { text: "S", tinted: true }, { image: stripVoiceTile, size: "fill" }],
          [{ image: stripVoiceWide, size: "fill" }],
        ],
        text: [
          "納期を守ること。ご要望の背景まで確かめること。",
          "そして、公開したあとも、長く一緒に歩んでいくこと。",
          "お客様からいただいた声を、ご紹介しています。",
        ],
        href: "/#client-reviews",
        badges: ["bubble", "megaphone"],
      },
    ] satisfies DesignCard[],
  },

  /**
   * 仕事の進め方。写真の壁が、左右を奥行きのある二列ずつで流れていきます。
   *
   * 写真は、仮の絵です。src/images/design/scenes/ の同じ名前のファイルを上書きすれば、
   * そのまま差し替わります（枠は 5:6 の縦長で、比率の違う写真は切り抜いて表示します）。
   */
  work: {
    label: "WORK STYLE",
    statement: [
      "ご相談から、設計、開発、公開、そして運用まで。",
      "技術を提供するだけでなく、信頼され、相談され、",
      "長く一緒に歩んでいけるエンジニアでありたい。",
    ],
    /**
     * 大きな見出し。一行目は太い字、二行目は細い斜体、三行目は太い字と、
     * 明朝の斜体を並べます。最後の script は、手書きで書かれていく一語です
     * （線の絵は WorkWall.tsx の SCRIPT にあり、いまは「Love.」だけです）。
     */
    title: { first: "BUILD", second: "YOUR IDEA", third: "WITH", accent: "So Much", script: "Love." },
    button: { label: "MORE DETAILS", href: "#design-concept" },
    /** 手前の列（左、右）。上から順に流れてきます。 */
    near: [
      [sceneHearing, sceneDesign, sceneMobile, sceneTest, sceneSupport],
      [sceneSketch, sceneCode, sceneAi, sceneLaunch, sceneTrust],
    ],
    /** 奥の列（左、右）。暗く、ゆっくり流れます。 */
    far: [
      [sceneDashboard, imgRetail, imgEducation, imgEnergy],
      [sceneCloud, imgHealthcare, imgLogistics, imgMedia],
    ],
  },

  /** 開発実績の紹介。大きな見出しが左右から寄ってきて、途中で、地の色が明るく切り替わります。 */
  records: {
    /** 見出しは二行です。一行目は右から、二行目は左から寄ってきます。 */
    title: ["PROJECT", "RECORDS"],
    /** 読み上げに使う見出し。 */
    heading: "開発実績",
    items: [record("08", imgRetail), record("14", imgHealthcare), record("53", imgResearch)],
    /** 分野の札に出す文言。 */
    tags: { system: "SYSTEM", app: "APP", ai: "AI" } satisfies Record<Discipline, string>,
    hover: "VIEW MORE",
    button: { label: "MORE DETAILS", href: "/#project-records" },
  },

  /**
   * ご相談の入口。ボタンを押すと、それぞれのサービスのプロフィールが、新しいタブで開きます。
   * 行き先は、上の platforms にまとめてあります。
   */
  contact: {
    title: "CONTACT",
    /** 背景に大きく並べる語。 */
    words: ["BELOVED", "ENGINEER", "FOR YOU"],
    lead: "まだアイデアの段階でも、小さなご相談でも構いません。",
    links: [
      { label: "CROWDWORKS", ...platforms.crowdworks },
      { label: "LANCERS", ...platforms.lancers },
    ],
  },

  /** ページのいちばん下の案内。 */
  footer: {
    columns: [
      {
        title: "PAGES",
        links: [
          { label: "Portfolio", href: "/" },
          { label: "Story", href: "/home" },
          { label: "Design", href: "#main" },
        ],
      },
      {
        title: "ABOUT",
        links: [
          { label: "Concept", href: "#design-concept" },
          { label: "Industries", href: "#design-industries" },
          { label: "Profile", href: "#design-profile" },
          { label: "Work Style", href: "#design-work" },
        ],
      },
      {
        title: "WORKS",
        links: [
          { label: "Project Records", href: "/#project-records" },
          { label: "Client Reviews", href: "/#client-reviews" },
        ],
      },
      {
        title: "CONTACT",
        links: [
          { label: platforms.crowdworks.name, href: platforms.crowdworks.href },
          { label: platforms.lancers.name, href: platforms.lancers.href },
        ],
      },
    ],
    /** 横に流れる、湾曲した写真の帯。 */
    strip: [
      imgAgriculture,
      imgManufacturing,
      imgRetail,
      imgHealthcare,
      imgCare,
      imgGovernment,
      imgEducation,
      imgFinance,
      imgLogistics,
      imgProperty,
      imgEnergy,
      imgOperations,
      imgMedia,
      imgSecurity,
      imgResearch,
    ],
    touch: "FIND ME ON…",
    backToTop: "Back to top",
  },
} as const;
