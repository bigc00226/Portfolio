import Link from "next/link";
import type { CSSProperties, FocusEventHandler } from "react";

import styles from "./MoreButton.module.css";

type Props = {
  href: string;
  label: string;
  /** ボタンの色。省くと、親の要素が決めた色（--tone）を使います。 */
  tone?: string;
  /** 置き場所ごとの余白などを足すためのクラス。 */
  className?: string;
  onFocus?: FocusEventHandler<HTMLAnchorElement>;
};

/** 色の付いた四角いボタン。右に、矢印の入った白い丸が付きます。 */
export function MoreButton({ href, label, tone, className, onFocus }: Props) {
  return (
    <Link
      className={className ? `${styles.button} ${className}` : styles.button}
      href={href}
      style={tone ? ({ "--tone": tone } as CSSProperties) : undefined}
      onFocus={onFocus}
    >
      <span lang="en">{label}</span>
      <span className={styles.icon} aria-hidden="true">
        <svg viewBox="0 0 24 24" focusable="false">
          <path d="M5 12h13M12.5 6l6 6-6 6" />
        </svg>
      </span>
    </Link>
  );
}
