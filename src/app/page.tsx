import { ProjectRecords } from "@/components/ProjectRecords";
import { Reviews } from "@/components/Reviews";
import { VideoBanner } from "@/components/VideoBanner";
import { site } from "@/data/site";
import { publicFileExists } from "@/lib/media";

export default async function HomePage() {
  /*
   * Only hand the banner the media that is genuinely on disk. Drop a file into
   * public/media and it is picked up on the next render; until then the banner
   * shows its designed still and asks the browser for nothing.
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
