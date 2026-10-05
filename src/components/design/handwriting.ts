/**
 * 見出しの二行目に添える、二つのハートと、それを書いていく手書きの線。
 *
 * 座標は、二行目の行ぜんたいに重ねる枠のものです。100 が全角一文字ぶんの幅で、
 * 高さ 160 の中央（y = 80）が行の中央に重なります。
 */

type Point = readonly [number, number];

/**
 * ハートを置く、文字の両側のすきまの幅（全角一文字が 100）。
 * Design.module.css の .heartSlot の幅（0.9em）と合わせています。
 */
const SLOT = 90;

/** 枠の高さ。 */
const HEIGHT = 160;

/** ハートの中心の高さ。文字の見た目の中心は、行の中央より少し下にあります。 */
const CENTER_Y = 86;

/** 手書きの下線を通す高さ。二行目と三行目の、字のあいだです。 */
const UNDERLINE_Y = 142;

/**
 * 手書きのハート。幅 100・高さ 90 ほどの枠に描いた形です。下の先から書き始め、
 * 左の山、右の山と回って、先を少し通りすぎたところで終わります。
 * 塗りのハートにも同じ形を使うので、線は塗りの縁をぴったりなぞります。
 */
const HEART: readonly Point[] = [
  [51, 91],
  [28, 72],
  [-2, 50],
  [1, 24],
  [3, 2],
  [32, -8],
  [49, 17],
  [60, -7],
  [95, -5],
  [99, 22],
  [103, 48],
  [74, 68],
  [48.5, 93.5],
];

/** 枠（幅 100）に描いた点を、縮めて傾け、決めた中心へ運ぶ関数を作ります。 */
function placer(centerX: number, tilt: number, scale: number) {
  const cos = Math.cos((tilt * Math.PI) / 180);
  const sin = Math.sin((tilt * Math.PI) / 180);

  return ([x, y]: Point): Point => {
    const dx = (x - 50) * scale;
    const dy = (y - 44) * scale;
    return [centerX + dx * cos - dy * sin, CENTER_Y + dx * sin + dy * cos];
  };
}

const text = ([x, y]: Point) => `${x.toFixed(1)} ${y.toFixed(1)}`;

/** 最初の点から、三点ずつの曲線でつないだ道すじにします。 */
function path(points: readonly Point[]) {
  const [start, ...rest] = points;
  let d = `M ${text(start)}`;
  for (let i = 0; i < rest.length; i += 3) {
    d += ` C ${text(rest[i])} ${text(rest[i + 1])} ${text(rest[i + 2])}`;
  }
  return d;
}

export type Hearts = {
  viewBox: string;
  /** 塗りのハート（左、右）。 */
  fills: [string, string];
  /** 手書きの線。左のハート、文字の下を走る線、右のハートの順に書きます。 */
  pens: [string, string, string];
};

/**
 * @param count 二行目の文字数（全角）。ハートの位置と、下線の長さが決まります。
 */
export function buildHearts(count: number): Hearts {
  const width = SLOT * 2 + count * 100;
  const leftX = SLOT / 2;
  const rightX = width - SLOT / 2;

  /* 二つのハートは、外側へ少し傾けます。 */
  const left = HEART.map(placer(leftX, -9, 0.78));
  const right = HEART.map(placer(rightX, 9, 0.78));

  /* 左のハートを書き終えた手で、そのまま文字の下をゆるく走り、右のハートへ入ります。 */
  const from = left[left.length - 1];
  const to = right[0];
  const underline: Point[] = [
    from,
    [from[0] - 9, from[1] + 9],
    [from[0] + 12, UNDERLINE_Y + 0.5],
    [from[0] + 62, UNDERLINE_Y],
    [width * 0.34, UNDERLINE_Y - 1.5],
    [width * 0.46, UNDERLINE_Y + 2.5],
    [width * 0.6, UNDERLINE_Y - 0.5],
    [width * 0.74, UNDERLINE_Y - 3.5],
    [to[0] - 44, UNDERLINE_Y + 4],
    to,
  ];

  return {
    viewBox: `0 0 ${width} ${HEIGHT}`,
    fills: [`${path(left)} Z`, `${path(right)} Z`],
    pens: [path(left), path(underline), path(right)],
  };
}
