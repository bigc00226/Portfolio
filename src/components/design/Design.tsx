import Image, { getImageProps } from "next/image";
import Link from "next/link";

import { design } from "@/data/design";

import { ConceptTitle } from "./ConceptTitle";
import styles from "./Design.module.css";
import { DesignHero } from "./DesignHero";
import { LoveFlow } from "./LoveFlow";
import { Writing } from "./Writing";

const { concept, flow, frames, hero } = design;

/**
 * 帯に貼る画像の URL。Next.js の画像最適化を通した、指定の幅のものを返します。
 * 差し替えた写真が大きくても、ブラウザへは必要な大きさで届きます。
 */
function textureUrl(src: string, width: number) {
  const { props } = getImageProps({
    src,
    alt: "",
    width,
    height: Math.round((width * 9) / 16),
  });
  /* srcSet の先頭（1x）が、指定した幅に合わせた画像です。 */
  return props.srcSet?.split(", ")[0]?.split(" ")[0] ?? props.src;
}

/** /design の本体。最初の画面、書かれていく文章、最後に流れる大きな文字を並べます。 */
export function Design() {
  return (
    <div className={styles.page}>
      <DesignHero
        copy={hero}
        frames={frames.map((frame) => ({
          large: textureUrl(frame.image.src, 1080),
          small: textureUrl(frame.image.src, 640),
        }))}
        fallback={frames.slice(0, 4).map((frame) => (
          <span key={frame.image.src} className={styles.stripFrame}>
            <Image src={frame.image} alt="" fill sizes="(max-width: 760px) 60vw, 30vw" />
          </span>
        ))}
      />

      <section className={styles.concept} aria-labelledby="design-concept">
        <div className="shell">
          <ConceptTitle id="design-concept" title={concept.title} label={concept.label} />
          <Writing stanzas={concept.stanzas} />

          {/*
           * 全ページ共通の「開発実績へスキップ」は #project-records へ飛びます。
           * このページでは、開発実績への入口であるここを、その行き先にしています。
           */}
          <div id="project-records" className={styles.actions}>
            <Link className={`${styles.action} ${styles.actionPrimary}`} href={concept.primary.href}>
              {concept.primary.label}
              <span className={styles.actionArrow} aria-hidden="true">
                →
              </span>
            </Link>
            <Link className={styles.action} href={concept.secondary.href}>
              {concept.secondary.label}
              <span className={styles.actionArrow} aria-hidden="true">
                →
              </span>
            </Link>
          </div>
        </div>
      </section>

      <LoveFlow heavy={flow.heavy} light={flow.light} label={flow.label} />
    </div>
  );
}
