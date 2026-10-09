import Image, { type StaticImageData } from "next/image";
import Link from "next/link";

import styles from "./DesignFooter.module.css";

type LinkItem = { label: string; href: string };

type Props = {
  /** サイト名と、ロゴの画像。 */
  name: string;
  logo: StaticImageData;
  columns: readonly { title: string; links: readonly LinkItem[] }[];
  /** 横に流れる、湾曲した写真の帯。 */
  strip: readonly StaticImageData[];
  /** 外部サービスへの案内。 */
  touch: string;
  socials: readonly LinkItem[];
  backToTop: string;
};

const external = (href: string) => /^https?:/.test(href);

/** 行き先に合わせて、ページ内・サイト内・外部のリンクを出し分けます。 */
function Anchor({ link, className }: { link: LinkItem; className?: string }) {
  if (external(link.href)) {
    return (
      <a className={className} href={link.href} target="_blank" rel="noopener noreferrer">
        {link.label}
        <span className="u-sr-only" lang="ja">
          （新しいタブで開きます）
        </span>
      </a>
    );
  }
  if (link.href.startsWith("#")) {
    return (
      <a className={className} href={link.href}>
        {link.label}
      </a>
    );
  }
  return (
    <Link className={className} href={link.href}>
      {link.label}
    </Link>
  );
}

/**
 * /design のいちばん下の案内。暗い札の上に、ロゴ、ページの案内、流れる写真の帯を並べます。
 * 写真の帯は、手前にふくらんだ形に切り抜いてあり、ゆっくり左へ流れます
 * （「視差効果を減らす」設定の方には、止めたままお見せします）。
 */
export function DesignFooter({ name, logo, columns, strip, touch, socials, backToTop }: Props) {
  return (
    <footer className={styles.footer}>
      <div className={styles.panel}>
        <div className={styles.top}>
          <div className={styles.brand}>
            <span className={styles.logo}>
              <Image src={logo} alt="" fill sizes="(max-width: 760px) 40vw, 14vw" />
            </span>
            <p className={styles.wordmark} lang="en">
              {name}
            </p>
          </div>

          <nav className={styles.nav} aria-label="ページの案内">
            {columns.map((column) => (
              <div key={column.title} className={styles.column} lang="en">
                <p className={styles.heading}>{column.title}</p>
                <ul className={styles.list}>
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Anchor link={link} className={styles.link} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* 写真の帯。同じ並びを二つ続けて、切れ目なく流します。 */}
        <div className={styles.strip} aria-hidden="true">
          <svg className={styles.clipSource} width="0" height="0" focusable="false">
            <clipPath id="design-strip-clip" clipPathUnits="objectBoundingBox">
              <path d="M0,0.075 Q0.5,-0.075 1,0.075 L1,0.925 Q0.5,1.075 0,0.925 Z" />
            </clipPath>
          </svg>
          <div className={styles.track}>
            {[0, 1].map((copy) => (
              <div key={copy} className={styles.run}>
                {strip.map((image) => (
                  <span key={image.src} className={styles.frame}>
                    <Image src={image} alt="" fill sizes="(max-width: 760px) 60vw, 24vw" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className={styles.touch} lang="en">
          <p className={styles.touchLabel}>{touch}</p>
          <ul className={styles.socials}>
            {socials.map((link) => (
              <li key={link.href}>
                <Anchor link={link} className={styles.link} />
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.base} lang="en">
          <p>
            Copyright &copy; {new Date().getFullYear()} {name}
          </p>
          <a className={styles.back} href="#main">
            {backToTop}
          </a>
        </div>
      </div>
    </footer>
  );
}
