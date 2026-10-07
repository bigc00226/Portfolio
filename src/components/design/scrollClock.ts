/**
 * スクロールに合わせて動かす部品が、共通で使う時計。
 *
 * スクロール位置を少し遅れて追いかけ、追いついたら止まります。描く関数には、
 * 追いかけている途中の位置（ページの先頭からのピクセル）が渡ります。動きはすべて
 * この位置から決めるので、上へ戻るときも、同じ道すじを逆にたどります。
 */
export type ScrollClock = {
  /** 次のコマで描き直します。 */
  request: () => void;
  /** 位置や大きさを測り直したあとに呼びます。追いかけずに、いまの位置で、すぐ描き直します。 */
  refresh: () => void;
  stop: () => void;
};

/**
 * @param draw 一コマ描く関数。自分で動いている最中（次のコマも描きたいとき）は true を返します。
 * @param lag スクロールへ、どれだけ遅れて付いていくか（ミリ秒）。小さいほど機敏です。
 */
export function startClock(
  draw: (scroll: number, elapsed: number) => boolean | void,
  lag = 110,
): ScrollClock {
  let frame = 0;
  let current = window.scrollY;
  let before = 0;

  const tick = (now: number) => {
    frame = 0;

    const elapsed = Math.min(Math.max(now - before, 0), 250);
    before = now;

    const target = window.scrollY;
    const gap = target - current;
    current = Math.abs(gap) < 0.5 ? target : current + gap * (1 - Math.exp(-elapsed / lag));

    const busy = draw(current, elapsed) === true;
    if (current !== target || busy) frame = requestAnimationFrame(tick);
  };

  const request = () => {
    if (frame) return;
    before = performance.now() - 16;
    frame = requestAnimationFrame(tick);
  };

  const refresh = () => {
    current = window.scrollY;
    if (draw(current, 0) === true) request();
  };

  window.addEventListener("scroll", request, { passive: true });

  return {
    request,
    refresh,
    stop: () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", request);
    },
  };
}

export const clamp = (value: number, low = 0, high = 1) => Math.min(high, Math.max(low, value));

/** from から to までを 0〜1 に写します。範囲の外は、0 か 1 に丸めます。 */
export const range = (from: number, to: number, value: number) =>
  clamp((value - from) / (to - from));

/** はじめは速く、終わりへ向けてゆるやかに。 */
export const easeOut = (value: number) => 1 - (1 - value) ** 2;

/** ゆっくり動きだして、ゆっくり止まります。 */
export const easeInOut = (value: number) => (1 - Math.cos(Math.PI * value)) / 2;

export const MOTION_OK = "(prefers-reduced-motion: no-preference)";

/** 要素の上端の、ページの先頭からの位置。transform の掛かっていない要素で測ってください。 */
export const pageTop = (element: Element) => element.getBoundingClientRect().top + window.scrollY;
