import { Instrument_Serif } from "next/font/google";
import Image, { getImageProps } from "next/image";
import Link from "next/link";

import { design } from "@/data/design";
import { site } from "@/data/site";
import logo from "@/images/logo.png";

import { About } from "./About";
import { AboutCards } from "./AboutCards";
import { ConceptTitle } from "./ConceptTitle";
import { Contact } from "./Contact";
import styles from "./Design.module.css";
import { DesignFooter } from "./DesignFooter";
import { DesignHero } from "./DesignHero";
import { HeartVeil } from "./HeartVeil";
import { IndustryReel } from "./IndustryReel";
import { LoveFlow } from "./LoveFlow";
import { Records } from "./Records";
import { SmoothWheel } from "./SmoothWheel";
import { WorkWall } from "./WorkWall";
import { Writing } from "./Writing";

const { about, concept, contact, flow, footer, frames, hero, industries, profile, records, work } =
  design;

/** 「仕事の進め方」の見出しで、一部の語に使う、明朝の斜体。このページでだけ読みこみます。 */
const serif = Instrument_Serif({
  weight: "400",
  style: "italic",
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

/**
 * 帯に貼る画像の URL。Next.js の画像最適化を通した、指定の幅のものを返します。
 * 差し替えた写真が大きくても、ブラウザへは必要な大きさで届きます。
 * @param ratio 枠の横と縦の比。
 */
function textureUrl(src: string, width: number, ratio = 16 / 9) {
  const { props } = getImageProps({
    src,
    alt: "",
    width,
    height: Math.round(width / ratio),
  });
  /* srcSet の先頭（1x）が、指定した幅に合わせた画像です。 */
  return props.srcSet?.split(", ")[0]?.split(" ")[0] ?? props.src;
}

/**
 * /design の本体。最初の画面、書かれていく文章、流れる大きな文字、暗い幕の上の紹介文、
 * 業種のギャラリー、ABOUT のカード、仕事の進め方、開発実績、ご相談の入口、
 * いちばん下の案内を、この順に並べます。
 */
export function Design() {
  return (
    <div className={`${styles.page} ${serif.variable}`}>
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

      {/* ここから先は、ハートの幕が背景を受け持ちます。 */}
      <HeartVeil>
        <LoveFlow heavy={flow.heavy} light={flow.light} label={flow.label} />
        <About id="design-about" label={about.label} paragraphs={about.paragraphs} />
        <IndustryReel
          heading={industries.heading}
          items={industries.items.map((item) => ({
            ...item,
            large: textureUrl(item.image.src, 1080, 13 / 8),
            small: textureUrl(item.image.src, 640, 13 / 8),
          }))}
        />
      </HeartVeil>

      <AboutCards
        id="design-profile"
        title={profile.title}
        lead={profile.lead}
        more={profile.more}
        cards={profile.cards}
      />

      <WorkWall
        id="design-work"
        label={work.label}
        statement={work.statement}
        title={work.title}
        button={work.button}
        near={work.near}
        far={work.far}
      />

      <Records
        id="design-records"
        title={records.title}
        heading={records.heading}
        items={records.items}
        tags={records.tags}
        hover={records.hover}
        button={records.button}
      />

      {/* ここから下は、黒い地です。 */}
      <div className={styles.tail}>
        <Contact
          id="design-contact"
          title={contact.title}
          words={contact.words}
          lead={contact.lead}
          links={contact.links}
        />
        <LoveFlow heavy={flow.heavy} light={flow.light} label={flow.label} dark />
        <DesignFooter
          name={site.name}
          logo={logo}
          columns={footer.columns}
          strip={footer.strip}
          touch={footer.touch}
          socials={contact.links.map((link) => ({ label: link.label, href: link.href }))}
          backToTop={footer.backToTop}
        />
      </div>

      {/* ホイールでのスクロールを、なめらかにします（このページだけ）。 */}
      <SmoothWheel />
    </div>
  );
}
