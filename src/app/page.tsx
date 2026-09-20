import { ProjectRecords } from "@/components/ProjectRecords";
import { Reviews } from "@/components/Reviews";
import { VideoBanner } from "@/components/VideoBanner";
import { site } from "@/data/site";
import { publicFileExists } from "@/lib/media";

export default async function HomePage() {
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
