import Image from "next/image";

import { site } from "@/data/site";
import { totalProjects } from "@/data/projects";
import logo from "@/images/logo.png";

import styles from "./SiteHeader.module.css";

export function SiteHeader() {
  return (
    <header className={styles.header}>
      <div className={`shell ${styles.inner}`}>
        {/*
         * どのページからでも、トップページ（/）の先頭へ戻ります。
         * / にいるときは、読み直さずに、その場で先頭へ移ります。ただし、URL に
         * 「?fbclid=…」などが付いているときは、/ を読み直します。
         */}
        <a className={styles.mark} href="/#main" aria-label={`${site.name}　トップページへ`}>
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
        </p>
      </div>
    </header>
  );
}
