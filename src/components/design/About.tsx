import type { CSSProperties } from "react";

import styles from "./About.module.css";

type Props = {
  id: string;
  /** 小見出し。一文字ずつ、下から現れます。 */
  label: string;
  /** 本文。段落ごとに、行を並べたものです。 */
  paragraphs: readonly (readonly string[])[];
};

/**
 * 暗い幕の上に現れる紹介文。
 *
 * ここには文字を置くだけで、動きは HeartVeil.tsx が付けます（data-char・data-rule・
 * data-rise の付いた要素を、スクロールに合わせて動かします）。動かせない環境では、
 * そのまま読める形で並びます。
 */
export function About({ id, label, paragraphs }: Props) {
  const words = label.split(" ");
  let order = 0;

  return (
    <section className={styles.about} aria-labelledby={id}>
      <div className="shell">
        <h2 id={id} className={styles.label} lang="en" data-veil-anchor="">
          <span className="u-sr-only">{label}</span>
          <span aria-hidden="true">
            {words.map((word, index) => (
              <span key={`${word}-${index}`}>
                {/* 語ごとの窓。字は、この窓の下から上がってきます。 */}
                <span className={styles.word}>
                  {Array.from(word, (char) => {
                    const position = order;
                    order += 1;
                    return (
                      <span
                        key={position}
                        className={styles.char}
                        style={{ "--i": position } as CSSProperties}
                        data-char=""
                      >
                        {char}
                      </span>
                    );
                  })}
                </span>
                {index < words.length - 1 ? " " : null}
              </span>
            ))}
          </span>
        </h2>

        <span className={styles.rule} data-rule="" aria-hidden="true" />

        <div className={styles.body}>
          {paragraphs.map((lines) => (
            <p key={lines[0]} className={styles.paragraph}>
              {lines.map((line) => (
                /* 行ごとの窓。行は、この窓の下から上がってきます。 */
                <span key={line} className={styles.line}>
                  <span className={styles.rise} data-rise="">
                    {line}
                  </span>
                </span>
              ))}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
