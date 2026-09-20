import { site } from "@/data/site";
import { totalIndustries, totalProjects } from "@/data/projects";

import styles from "./SiteHeader.module.css";

export function SiteHeader() {
  return (
    <header className={styles.header}>
      <div className={`shell ${styles.inner}`}>
        <a className={styles.mark} href="#main" aria-label={`${site.name} — home`}>
          <span className={styles.monogram} aria-hidden="true">
            {site.monogram}
          </span>
          <span className={styles.wordmark}>{site.name}</span>
        </a>

        <p className={`mono ${styles.meta}`}>
          <span>{totalProjects} engagements</span>
          <span className={styles.dot} aria-hidden="true" />
          <span>{totalIndustries} industries</span>
        </p>
      </div>
    </header>
  );
}
