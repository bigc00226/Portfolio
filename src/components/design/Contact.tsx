import Image, { type StaticImageData } from "next/image";

import { HEART_BOX, HEART_PATH } from "./handwriting";
import styles from "./Contact.module.css";

type Props = {
  id: string;
  title: string;
  /** 背景に大きく並べる語。 */
  words: readonly string[];
  lead: string;
  /**
   * 行き先のボタン。logo は、そのサービスのロゴです。logoCorner は、ロゴの絵に
   * 角の丸みがないときに、表示で付ける角の丸み（CSS の border-radius）です。
   */
  links: readonly {
    label: string;
    href: string;
    logo: StaticImageData;
    logoCorner?: string;
  }[];
};

/**
 * ご相談の入口。黒い地に、背景の大きな語と、見出し、行き先のボタンを重ねます。
 * 動きは付けていないので、どの環境でも同じ表示です。
 */
export function Contact({ id, title, words, lead, links }: Props) {
  return (
    <section id={id} className={styles.contact} aria-labelledby={`${id}-title`}>
      <p className={styles.words} aria-hidden="true" lang="en">
        {words.map((word) => (
          <span key={word}>{word}</span>
        ))}
      </p>

      <div className={styles.front}>
        <h2 id={`${id}-title`} className={styles.title} lang="en">
          {/* 見出しの頭に載せる、目の付いたハート。 */}
          <svg className={styles.mascot} viewBox={HEART_BOX} aria-hidden="true" focusable="false">
            <path d={HEART_PATH} fill="#e8384f" />
            <circle cx="31" cy="34" r="15" fill="#ffffff" />
            <circle cx="68" cy="34" r="15" fill="#ffffff" />
            <circle cx="36" cy="38" r="7" fill="#1c1b1d" />
            <circle cx="73" cy="38" r="7" fill="#1c1b1d" />
          </svg>
          {title}
        </h2>

        <p className={styles.lead}>{lead}</p>

        <ul className={styles.links}>
          {links.map((link) => (
            <li key={link.href}>
              <a className={styles.pill} href={link.href} target="_blank" rel="noopener noreferrer">
                {/* ロゴは飾りとして扱います。サービスの名前は、すぐ隣の文字で読み上げられます。 */}
                <span className={styles.logo}>
                  {/*
                   * 大きさは CSS で字の高さに合わせます。ここで渡す 48 は、HTML に書く目安の
                   * 大きさです（渡さないと、絵の大きさ。ランサーズの絵は 1537 になります）。
                   */}
                  <Image
                    src={link.logo}
                    alt=""
                    width={48}
                    height={48}
                    style={link.logoCorner ? { borderRadius: link.logoCorner } : undefined}
                  />
                </span>
                <span lang="en">{link.label}</span>
                <span className="u-sr-only">のプロフィール（新しいタブで開きます）</span>
                <svg className={styles.arrow} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path d="M4 12h15M13 6l6 6-6 6" />
                </svg>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
