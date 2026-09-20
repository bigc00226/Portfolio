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
                Client reviews
              </p>
              <h2 id="reviews-title" className={`display ${styles.title}`}>
                What clients say
                <br />
                once it is live.
              </h2>
            </div>

            <div className={styles.headAside}>
              <p className="lead">
                The records above are only half the story. What follows is what the
                people who commissioned that work had to say once the systems had
                been running for a while.
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
              <Stars rating={Math.round(averageRating)} label={`${averageRating} out of 5`} />
              <p className={`mono ${styles.scoreCount}`}>
                Average across {reviewCount} published reviews
              </p>
            </div>

            <p className={styles.scoreNote}>
              Reviews are published with the client&rsquo;s permission and are
              attributed by role and sector rather than by company name.
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
                    label={`Rated ${review.rating} out of 5`}
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
