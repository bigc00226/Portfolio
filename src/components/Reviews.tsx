import { Reveal } from "./Reveal";
import { averageRating, reviewCount, reviews } from "@/data/reviews";

import styles from "./Reviews.module.css";

export function Reviews() {
  return (
    <section id="client-reviews" className={styles.section} aria-labelledby="reviews-title">
      <div className="shell">
        <Reveal>
          <header className={styles.head}>
            <div>
              <p className={`mono ${styles.kicker}`}>
                <span className={styles.kickerNum}>02</span>
                お客様の声
              </p>
              <h2 id="reviews-title" className={`display ${styles.title}`}>
                稼働したあとに
                <br />
                いただいた言葉です。
              </h2>
            </div>

            <div className={styles.headAside}>
              <p className="lead">
                {"開発実績だけではお伝えしきれない部分を、実際にご依頼くださった皆さまのお言葉でご紹介します。いずれも、しばらく運用いただいたあとにお寄せいただいたものです。"}
              </p>
            </div>
          </header>
        </Reveal>

        <Reveal>
          <div className={styles.aggregate}>
            <div className={styles.score}>
              <span className={`display ${styles.scoreValue}`}>
                {averageRating.toFixed(1)}
              </span>
              <span className={styles.scoreOf}>/ 5.0</span>
            </div>

            <div className={styles.scoreMeta}>
              <Stars
                rating={Math.round(averageRating)}
                label={`5点満点中${averageRating}点`}
              />
              <p className={`mono ${styles.scoreCount}`}>
                掲載{reviewCount}件の平均評価
              </p>
            </div>

            <p className={styles.scoreNote}>
              {"お客様の許可をいただいたうえで掲載しています。企業名ではなく、役職と業種でご紹介しています。"}
            </p>
          </div>
        </Reveal>

        <ul className={styles.grid}>
          {reviews.map((review, index) => (
            <li key={review.id} className={styles.cell}>
              <Reveal className={styles.cardWrap} delay={(index % 3) * 90}>
                <figure className={styles.card}>
                  <span className={styles.quoteMark} aria-hidden="true">
                    &ldquo;
                  </span>

                  <Stars
                    rating={review.rating}
                    label={`5点満点中${review.rating}点の評価`}
                  />

                  <h3 className={`display ${styles.cardTitle}`}>{review.headline}</h3>

                  <blockquote className={styles.quote}>
                    <p>{review.quote}</p>
                  </blockquote>

                  <figcaption className={styles.author}>
                    <span className={styles.authorName}>{review.author}</span>
                    <span className={styles.authorRole}>{review.role}</span>
                    <span className={styles.authorOrg}>{review.organization}</span>
                    <span className={`mono ${styles.sector}`}>{review.sector}</span>
                  </figcaption>
                </figure>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Stars({ rating, label }: { rating: number; label: string }) {
  return (
    <p className={styles.stars} role="img" aria-label={label}>
      {[1, 2, 3, 4, 5].map((step) => (
        <svg
          key={step}
          className={styles.star}
          data-filled={step <= rating ? "true" : "false"}
          viewBox="0 0 16 16"
          width="13"
          height="13"
          aria-hidden="true"
        >
          <path d="M8 .9 10.1 5.5l5 .6-3.7 3.4 1 4.9L8 11.9l-4.4 2.5 1-4.9L.9 6.1l5-.6L8 .9Z" />
        </svg>
      ))}
    </p>
  );
}
