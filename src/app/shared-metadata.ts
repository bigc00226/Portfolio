import { site } from "@/data/site";

/*
 * どのページにも付ける、OGP と X（Twitter）のカードの項目です。
 * ページで openGraph や twitter を書くと、レイアウトのものは丸ごと置き換わり、足し合わされません。
 * ページ側でも、これを先頭に広げてから、題名などを書いてください。
 */
export const sharedOpenGraph = {
  siteName: site.name,
  type: "website",
  locale: "ja_JP",
} as const;

export const sharedTwitter = {
  card: "summary_large_image",
} as const;
