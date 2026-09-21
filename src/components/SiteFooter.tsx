import Image from "next/image";

import { site } from "@/data/site";
import logo from "@/images/logo.png";

import styles from "./SiteFooter.module.css";

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={`shell ${styles.inner}`}>
        <p className={`mono ${styles.line}`}>
          <span className={styles.logo}>
            <Image src={logo} alt="" fill sizes="34px" />
          </span>
          {site.name}
        </p>
        <p className={`mono ${styles.line}`}>
          <span>&copy; {new Date().getFullYear()}</span>
          <a className={styles.top} href="#main">
            {site.footer.backToTop}
          </a>
        </p>
      </div>
    </footer>
  );
}
