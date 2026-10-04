/**
 * 物語の時間割。長さの単位は svh（画面の高さの 100 分の 1）です。
 *
 * 章ごとに「絵が動く区間」と「止めて見せる区間」があり、章と章のあいだに
 * 「次の絵へ送る区間」をはさみます。CSS が決めるフィルム全体の高さと、
 * スクロール位置から絵の進み具合を求める計算の両方が、この一か所を参照します。
 */

/** 章の weight 1 あたりの、絵が動く区間の長さ。 */
export const PLAY_UNIT = 54;
/** 章の終わりに、仕上がった絵を止めておく長さ。 */
export const HOLD = 12;
/** 次の章へ絵を送る長さ。 */
export const PAN = 40;

export type Segment = {
  /** 章が始まる位置。 */
  start: number;
  /** 絵が動く区間の長さ。 */
  play: number;
  /** 次の章へ送り始める位置。 */
  panStart: number;
};

export type Timeline = {
  segments: Segment[];
  /** フィルム全体の長さ。 */
  total: number;
};

export function buildTimeline(weights: readonly number[]): Timeline {
  let cursor = 0;

  const segments = weights.map((weight, index) => {
    const play = weight * PLAY_UNIT;
    const segment: Segment = {
      start: cursor,
      play,
      panStart: cursor + play + HOLD,
    };
    cursor = segment.panStart + (index < weights.length - 1 ? PAN : 0);
    return segment;
  });

  return { segments, total: cursor };
}
