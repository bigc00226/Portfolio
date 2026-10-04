"use client";

import { Fragment, type CSSProperties } from "react";

import { useEntrance } from "@/components/useInView";

import styles from "./Design.module.css";

/**
 * 一語ずつ、下からせり上がって現れる見出し。
 * サーバーが返す HTML では最初から表示されているので、JavaScript を
 * 無効にしていても、そのまま読めます。
 */
export function ConceptTitle({ id, words }: { id: string; words: readonly string[] }) {
  const { ref, active } = useEntrance<HTMLHeadingElement>(0.4);

  return (
    <h2
      ref={ref}
      id={id}
      className={styles.conceptTitle}
      data-shown={active ? "" : undefined}
      lang="en"
    >
      {words.map((word, index) => (
        <Fragment key={`${word}-${index}`}>
          <span className={styles.wordMask}>
            <span className={styles.word} style={{ "--i": index } as CSSProperties}>
              {word}
            </span>
          </span>
          {/* 語と語のあいだの空白は、窓の外に置きます。中に置くと詰められてしまいます。 */}
          {index < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </h2>
  );
}
