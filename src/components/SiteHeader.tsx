import { site } from "@/data/site";
import { totalIndustries, totalProjects } from "@/data/projects";

import styles from "./SiteHeader.module.css";

export function SiteHeader() {
  return (
    <header className={styles.header}>
      <div className={`shell ${styles.inner}`}>
        <a className={styles.mark} href="#main" aria-label={`${site.name}　トップへ`}>
          <span className={styles.monogram} aria-hidden="true">
            {site.monogram}
          </span>
          <span className={styles.wordmark}>{site.name}</span>
        </a>

        <p className={`mono ${styles.meta}`}>
          <span>
            {totalProjects}
            {site.header.projectsLabel}
          </span>
          <span className={styles.dot} aria-hidden="true" />
          <span>
            {totalIndustries}
            {site.header.industriesLabel}
          </span>
        </p>
      </div>
    </header>
  );
}
