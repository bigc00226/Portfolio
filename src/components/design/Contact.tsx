import { HEART_BOX, HEART_PATH } from "./handwriting";
import styles from "./Contact.module.css";

type Props = {
  id: string;
  title: string;
  /** 背景に大きく並べる語。 */
  words: readonly string[];
  lead: string;
  links: readonly { label: string; href: string }[];
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
              <a className={styles.pill} href={link.href} target="_blank" rel="noopener noreferrer" lang="en">
                {link.label}
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
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
