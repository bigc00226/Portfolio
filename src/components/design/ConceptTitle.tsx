"use client";

import { useEntrance } from "@/components/useInView";

import styles from "./Design.module.css";

/**
 * 下からせり上がって現れる見出し。右には、小さな欧文を添えます。
 * サーバーが返す HTML では最初から表示されているので、JavaScript を
 * 無効にしていても、そのまま読めます。
 */
export function ConceptTitle({ id, title, label }: { id: string; title: string; label: string }) {
  const { ref, active } = useEntrance<HTMLDivElement>(0.4);

  return (
    <div ref={ref} className={styles.conceptHead} data-shown={active ? "" : undefined}>
      <h2 id={id} className={styles.conceptTitle}>
        <span className={styles.wordMask}>
          <span className={styles.word}>{title}</span>
        </span>
      </h2>
      <p className={`mono ${styles.conceptLabel}`} lang="en">
        {label}
      </p>
    </div>
  );
}
