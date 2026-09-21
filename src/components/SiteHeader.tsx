import Image from "next/image";

import { site } from "@/data/site";
import { totalIndustries, totalProjects } from "@/data/projects";
import logo from "@/images/logo.png";

import styles from "./SiteHeader.module.css";

export function SiteHeader() {
  return (
    <header className={styles.header}>
      <div className={`shell ${styles.inner}`}>
        <a className={styles.mark} href="#main" aria-label={`${site.name}　トップへ`}>
          <span className={styles.logo}>
            <Image src={logo} alt={site.logoAlt} fill sizes="52px" priority />
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
