import styles from "./Texture.module.css";

/**
 * The four layers that give the page its surface: film grain, a woven
 * scanline, the column hairlines, and a vignette that keeps the edges heavy.
 */
export function Texture() {
  return (
    <div className={styles.texture} aria-hidden="true">
      <div className={styles.vignette} />
      <div className={styles.weave} />
      <div className={styles.rules}>
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>
      <div className={styles.grain} />
    </div>
  );
}
