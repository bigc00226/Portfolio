/**
 * はじめに書き換えることの多い項目をまとめています。
 * サイト名、見出し、バナー動画のファイル名などです。
 */

export const site = {
  /** 左上のロゴとブラウザのタブに表示されます。 */
  name: "システム＆AIエンジニア",
  /** ロゴマークの二文字。 */
  monogram: "SA",
  title: "システム＆AIエンジニア｜ポートフォリオ",
  description:
    "業務システム、アプリケーション、AI開発。15の業種にわたる54件の開発実績と、お客様からいただいた声をご紹介しています。",
  /** 公開前に、ご自身のドメインへ変更してください。 */
  url: "https://example.com",

  banner: {
    /**
     * バナー動画は public/media/banner.mp4 に置いてください。
     * WebM をお持ちの場合は public/media/banner.webm も読み込みます。
     * ファイルがない間は、用意した静止画面に切り替わります。
     */
    sources: [
      { src: "/media/banner.webm", type: "video/webm" },
      { src: "/media/banner.mp4", type: "video/mp4" },
    ],
    /** 読み込み中に表示する一枚絵：public/media/banner-poster.jpg */
    poster: "/media/banner-poster.jpg",
    eyebrow: "ポートフォリオ",
    headline: ["現場で動き続ける", "システムを、", "つくっています。"],
    lead: "業務システム、アプリケーション、AI開発。15の業種で、要件定義から開発、運用・保守までを一貫して担当しています。",
    /** バナー下部の案内。 */
    scrollLabel: "開発実績を見る",
    controls: {
      play: "再生",
      pause: "一時停止",
      playLabel: "バナー動画を再生する",
      pauseLabel: "バナー動画を一時停止する",
      soundOn: "音声オン",
      soundOff: "音声オフ",
      unmuteLabel: "バナー動画の音声を出す",
      muteLabel: "バナー動画の音声を消す",
    },
  },

  header: {
    /** 「54件」「15業種」の後ろに付く語。 */
    projectsLabel: "件の開発実績",
    industriesLabel: "業種",
  },

  footer: {
    backToTop: "ページ上部へ戻る",
  },

  skipLink: "開発実績へスキップ",
} as const;
