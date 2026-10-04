import Link from "next/link";
import type { CSSProperties } from "react";

import { site } from "@/data/site";
import { story } from "@/data/story";

import styles from "./Story.module.css";
import { StoryFilm } from "./StoryFilm";
import { scenes } from "./scenes";
import art from "./scenes/Scene.module.css";
import { Figure, Heart, Sparkle, cx } from "./scenes/kit";

const { chapters, film, hero, outro } = story;

const twoDigits = (value: number) => String(value).padStart(2, "0");

/**
 * /home の本体。導入、スクロールで進む物語、結びの順に並べます。
 * 動くのは StoryFilm だけで、絵と文はすべてサーバー側で描いています。
 */
export function Story() {
  const count = chapters.length;

  return (
    <div className={styles.story}>
      <Hero />

      <StoryFilm
        label={film.label}
        railLabel={film.railLabel}
        skipLabel={film.skip}
        skipHref="#story-end"
        chapters={chapters.map((chapter, index) => ({
          title: chapter.title,
          weight: chapter.weight,
          jumpLabel: `${film.chapterPrefix}${index + 1}${film.chapterSuffix}　${chapter.title}`,
        }))}
      >
        {chapters.map((chapter, index) => {
          const Scene = scenes[chapter.id];
          const titleId = `story-title-${chapter.id}`;

          return (
            <section
              key={chapter.id}
              className={styles.chapter}
              aria-labelledby={titleId}
              data-chapter=""
            >
              <div className={styles.shot} data-shot="">
                <div className={styles.sceneBox} data-scene-box="">
                  <Scene />
                </div>
              </div>

              <div className={styles.caption} data-caption="">
                <p className={`mono ${styles.chapterNo}`}>
                  <span className={styles.chapterNoNow}>{twoDigits(index + 1)}</span>
                  <span aria-hidden="true">/</span>
                  <span>{twoDigits(count)}</span>
                </p>
                <h2 id={titleId} className={`display ${styles.chapterTitle}`}>
                  {chapter.title}
                </h2>
                <div className={styles.beats} data-beats="">
                  {chapter.beats.map((beat, beatIndex) => {
                    const next = chapter.beats[beatIndex + 1];
                    /* 最初の文は章の頭から、最後の文は章の終わりまで出しておきます。 */
                    const window = {
                      "--from": beatIndex === 0 ? -1 : beat.at,
                      "--to": next ? next.at : 2,
                    } as CSSProperties;

                    return (
                      <p key={beat.at} className={styles.beat} style={window}>
                        {beat.text}
                      </p>
                    );
                  })}
                </div>
              </div>
            </section>
          );
        })}
      </StoryFilm>

      <Outro />
    </div>
  );
}

function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="story-headline">
      <div className={`shell ${styles.heroInner}`}>
        <div className={styles.heroText}>
          <p className={`mono ${styles.eyebrow}`}>
            <span className={styles.eyebrowTick} aria-hidden="true" />
            {hero.eyebrow}
            <span className={styles.eyebrowSlash} aria-hidden="true">
              /
            </span>
            {site.name}
          </p>

          <h1 id="story-headline" className={`display ${styles.headline}`}>
            {hero.headline.map((line, index) => (
              <span key={line} className={styles.headlineLine}>
                <span
                  className={styles.headlineInner}
                  style={{ "--i": index } as CSSProperties}
                >
                  {line}
                </span>
              </span>
            ))}
          </h1>

          <p className={`lead ${styles.heroLead}`}>{hero.lead}</p>
        </div>

        <div className={styles.heroArt} aria-hidden="true">
          <svg viewBox="0 0 540 432" focusable="false">
            <g className={styles.heroBubble}>
              <path
                className={art.paper}
                d="M 52 66 H 222 a 34 34 0 0 1 34 34 v 2 a 34 34 0 0 1 -12 26 l 30 22 l -46 -10 a 34 34 0 0 1 -6 0 H 52 a 34 34 0 0 1 -34 -34 v -6 a 34 34 0 0 1 34 -34 Z"
              />
              <text className={art.text} x={137} y={103} fontSize={25}>
                {hero.greeting}
              </text>
            </g>

            <g className={styles.heroTwinkle}>
              <Sparkle x={470} y={84} size={1.5} />
            </g>
            <g className={cx(styles.heroTwinkle, styles.heroLate)}>
              <Sparkle x={508} y={150} size={0.9} />
              <Sparkle x={232} y={214} size={1} />
            </g>
            <g className={styles.heroFloat}>
              <Heart x={438} y={34} size={1.5} />
            </g>

            <Figure
              who="me"
              x={356}
              y={430}
              scale={1.36}
              mood="happy"
              armL={[14, 0]}
              armR={[148, 24]}
              fx={{ foreR: { className: styles.heroWave } }}
            />
          </svg>
        </div>
      </div>

      <div className={styles.heroGround} aria-hidden="true" />

      <div className={`shell ${styles.heroFoot}`}>
        <a className={styles.scroll} href="#story-1">
          <span className={styles.scrollRail} aria-hidden="true">
            <span className={styles.scrollDot} />
          </span>
          <span className="mono">{hero.scrollLabel}</span>
        </a>
      </div>
    </section>
  );
}

function Outro() {
  return (
    <section id="story-end" className={styles.outro} aria-labelledby="story-outro-title">
      <div className={`shell ${styles.outroInner}`}>
        <div className={styles.outroText}>
          <p className={`mono ${styles.kicker}`}>
            <span className={styles.eyebrowTick} aria-hidden="true" />
            {outro.kicker}
          </p>
          <h2 id="story-outro-title" className={`display ${styles.outroTitle}`}>
            {outro.title.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h2>
          <p className={`lead ${styles.outroLead}`}>{outro.lead}</p>

          {/*
           * 全ページ共通の「開発実績へスキップ」は #project-records へ飛びます。
           * このページでは、開発実績への入口であるここを、その行き先にしています。
           */}
          <div id="project-records" className={styles.actions}>
            <Link className={cx(styles.action, styles.actionPrimary)} href={outro.primary.href}>
              {outro.primary.label}
              <span className={styles.actionArrow} aria-hidden="true">
                →
              </span>
            </Link>
            <Link className={styles.action} href={outro.secondary.href}>
              {outro.secondary.label}
              <span className={styles.actionArrow} aria-hidden="true">
                →
              </span>
            </Link>
          </div>
        </div>

        <div className={styles.outroArt} aria-hidden="true">
          <svg viewBox="0 0 600 322" focusable="false">
            <Heart x={300} y={26} size={1.7} />
            <Heart x={226} y={58} size={0.9} />
            <Heart x={372} y={52} size={1.1} />
            <Figure who="mother" x={150} y={320} dir={1} mood="happy" armL={[150, 20]} />
            <Figure who="father" x={450} y={320} dir={-1} mood="happy" armR={[150, 20]} />
            <Figure who="me" x={300} y={320} mood="happy" armL={[40, 0]} armR={[40, 0]} />
          </svg>
        </div>
      </div>

      <div className={styles.heroGround} aria-hidden="true" />
    </section>
  );
}
