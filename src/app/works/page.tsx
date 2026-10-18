import type { Metadata } from "next";

import { ProjectRecords } from "@/components/ProjectRecords";
import { Reviews } from "@/components/Reviews";
import { VideoBanner } from "@/components/VideoBanner";
import { site } from "@/data/site";
import { publicFileExists } from "@/lib/media";

/*
 * 題名と説明は、レイアウトの既定（site.ts の title・description）をそのまま使います。
 * openGraph をここで書くと、レイアウトのものが丸ごと置き換わるため、URL の正規化だけを足しています。
 */
export const metadata: Metadata = {
  alternates: { canonical: "/works" },
};

export default async function WorksPage() {
  /*
   * 実際に置かれているファイルだけをバナーに渡します。public/media に
   * 置けば次の描画から読み込まれ、それまでは用意した静止画面が表示され、
   * ブラウザは何も取りにいきません。
   */
  const available = await Promise.all(
    site.banner.sources.map(async (source) => ({
      source,
      exists: await publicFileExists(source.src),
    })),
  );

  const sources = available
    .filter((entry) => entry.exists)
    .map(({ source }) => ({ src: source.src, type: source.type }));

  const hasPoster = await publicFileExists(site.banner.poster);

  return (
    <main id="main">
      <VideoBanner
        sources={sources}
        poster={hasPoster ? site.banner.poster : undefined}
      />
      <ProjectRecords />
      <Reviews />
    </main>
  );
}
