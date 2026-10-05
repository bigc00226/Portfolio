/**
 * 見出しの二行目に重ねる手書き。左のハート、字、右のハートの順に書いていきます。
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

/**
 * 字の升目（全角一文字ぶん、100 × 100）の上端。
 * 見出しの書体と行の高さから決まる位置で、ブラウザで測って合わせています。
 */
const CELL_TOP = 25;

/** ハートの中心の高さ。字の中心（升目の中央）より、わずかに下げています。 */
const HEART_Y = 79;

/**
 * 手書きのハート。幅 100・高さ 90 ほどの枠に描いた形です。下の先から書き始め、
 * 左の山、右の山と回って、また先へ戻ります。
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
  [51, 91],
];

/**
 * 字の線。100 × 100 の升目に、書き順どおりに並べています。
 * 見出しの書体（Noto Sans JP の極太）の、各画の中心をなぞる形です。線の端は、
 * 丸い筆先のぶんだけ、画の端より内側で止めています。
 * ここにない字は、手書きにならず、黒い字のまま表示されます。
 */
const GLYPHS: Readonly<Record<string, readonly string[]>> = {
  愛: [
    /* 爫：上の払い、点、点、ノ */
    "M 83 7.2 Q 48 12 15 13",
    "M 24.5 17 Q 28.5 21 30.5 27",
    "M 46.5 16 Q 50 21 51.5 27",
    "M 78.5 16 Q 75.5 22 71 27",
    /* 冖：左の短い画、横から折れ */
    "M 12.6 30.5 L 12.6 41.5",
    "M 11 31 L 85 31 Q 87.4 31 87.3 34 L 87.1 42.5",
    /* 心：左の点、はね、点、点 */
    "M 26.5 43.5 Q 22 51 16 55.5",
    "M 37 43.5 L 37 47 C 37 52 40 53.5 46 53.5 L 57 53.5 C 62.5 53.5 64.8 52 65.3 49",
    "M 46 36.5 Q 51.5 38.8 55.5 42",
    "M 72.5 43 Q 79 48.5 83 54",
    /* 夂：ノ、フ、右払い */
    "M 44 59 Q 30 69.5 14 76",
    "M 39 66.5 L 74 65.5 C 66 76 52 86 12 92",
    "M 33 72.5 C 44 80 60 88 89 91.5",
  ],
  さ: [
    "M 18.5 28.3 Q 52 32 83 24",
    "M 55 10.5 C 58 23 64.5 38.5 78 58.8 L 55.5 57.2",
    "M 26.5 58 C 20.5 68 21 80 36 85.5 C 48 89 62 88.2 73.5 85.6",
  ],
  れ: [
    "M 33.8 11 C 32 30 30.5 50 30.5 60 L 30.9 89.5",
    "M 10.5 31 L 38.5 27 L 10.5 73.5 C 23 57 40 32 62 27.5 C 76 25 76.5 40 74.5 52 C 72.5 66 70 80 78 83 C 83.5 85 88 81 91.5 77.5",
  ],
  る: [
    "M 25.5 18 L 70 16.5 L 17 62.5 C 31 50 44 45 56 45 C 72 45 81 54 81 66 C 81 80 68 89 52 88.5 C 40 88 33 84 33 77 C 33 70 39 66.5 45.5 66.5 C 53 66.5 61 71 59.5 81",
  ],
};

/** その字を、手書きで書けるかどうか。 */
export const canWrite = (char: string) => Object.hasOwn(GLYPHS, char);

/** 枠（幅 100）に描いた点を、縮めて傾け、決めた中心へ運ぶ関数を作ります。 */
function placer(centerX: number, tilt: number, scale: number) {
  const cos = Math.cos((tilt * Math.PI) / 180);
  const sin = Math.sin((tilt * Math.PI) / 180);

  return ([x, y]: Point): Point => {
    const dx = (x - 50) * scale;
    const dy = (y - 44) * scale;
    return [centerX + dx * cos - dy * sin, HEART_Y + dx * sin + dy * cos];
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

export type Handwriting = {
  viewBox: string;
  /** ハートの形（左、右）。塗りにも、手書きの線にも使います。 */
  hearts: [string, string];
  /** 手書きで書く字。升目の左上の位置と、書き順どおりの線です。 */
  glyphs: { x: number; y: number; strokes: readonly string[] }[];
};

/**
 * @param phrase 二行目の文言。全角の文字で書かれている前提で、位置を決めます。
 */
export function buildHandwriting(phrase: string): Handwriting {
  const chars = Array.from(phrase);
  const width = SLOT * 2 + chars.length * 100;

  /* 二つのハートは、外側へ少し傾けます。 */
  const left = HEART.map(placer(SLOT / 2, -9, 0.78));
  const right = HEART.map(placer(width - SLOT / 2, 9, 0.78));

  return {
    viewBox: `0 0 ${width} ${HEIGHT}`,
    hearts: [`${path(left)} Z`, `${path(right)} Z`],
    glyphs: chars.flatMap((char, index) =>
      canWrite(char) ? [{ x: SLOT + index * 100, y: CELL_TOP, strokes: GLYPHS[char] }] : [],
    ),
  };
}
