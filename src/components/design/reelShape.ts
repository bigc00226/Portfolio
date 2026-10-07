/**
 * 横に流れるギャラリーの形。
 *
 * 画像の帯は、手前にふくらんだ円筒の表面に貼りついています。画面の中央がいちばん
 * 手前で、左右へ離れるほど奥へ回りこむので、小さく、幅も詰まって見えます。
 * 数字は、参考にした画面の画像の端と高さを測って、当てはめたものです。
 *
 * 帯の上の位置は、画面の中央を 0 として、右をプラスに数えます。
 */

/**
 * 円筒の半径と、視点から円筒のいちばん手前までの距離。
 * 「円筒の長さ」（drumOf）を 1 とした値です。横長の画面では、円筒の輪郭が、
 * ちょうど画面の左右の端のあたりに来ます。
 */
export const RADIUS = 0.806;
export const FOCUS = 0.945;

/**
 * 画像の幅と高さ（13:8）、となりの画像までの間隔。
 * ここから下の数字は、「基準の長さ」（unitOf）を 1 とした値です。
 */
export const WIDTH = 0.343;
export const HEIGHT = 0.211;
export const PITCH = 0.477;

/** 円筒の輪郭にあたる角度。これより先は裏側に回るので、描きません。 */
export const LIMIT = Math.acos(RADIUS / (RADIUS + FOCUS));

/** 画面を固定した瞬間に、最初の画像の中心がある位置。 */
export const START = 0.156;
/**
 * 最後の画像の中心がここまで来たら、固定を終えます。画像が左の端へ流れきるまで
 * 固定を続け、そのあいだに、次の区画の見出し（ABOUT）が右から入ってきます。
 */
export const EXIT = -1.13;
/**
 * 最後の画像が中央を過ぎたあとは、帯を、この倍率だけ速く流します。
 * 画像が左へ抜けていくのと、次の見出しが入ってくるのとが、ちょうど入れ替わります。
 */
export const HURRY = 1.22;
/** 画像の中心がここを左へ越えたら、その業種名に切り替えます。 */
export const SWITCH = 0.068;

/** 最後の画像が中央に来るまでに、帯が流れる長さ。 */
export const runOf = (count: number) => START + (count - 1) * PITCH;

/**
 * 画面を固定しておく長さを決める数。帯が流れる長さを、ふつうの速さで流したときの
 * 長さに直したものです（速く流す区間は、そのぶん短く数えます）。
 */
export const travelOf = (count: number) => runOf(count) - EXIT / HURRY;

/**
 * 円筒の長さ。横長の画面では画面の幅です。縦長の画面では、画像が小さくなりすぎない
 * よう、高さから決めます。
 */
export const drumOf = (width: number, height: number) =>
  Math.max(width, Math.min(height * 1.1, width * 2.2));

/**
 * 基準の長さ。ふつうは円筒の長さと同じですが、縦に余裕のある横長の画面では、
 * 画像が小さく見えないよう、2 割まで大きくします（参考にした画面の縦横比のとき、
 * ちょうど画面の幅になります）。IndustryReel.module.css の --u と同じ式です。
 */
export const unitOf = (width: number, height: number) =>
  Math.max(drumOf(width, height), Math.min(Math.max(width, height * 2.152), width * 1.2));

/**
 * 帯の上の位置を、画面の上の位置へ写します。
 * @param drum 円筒の長さ（drumOf）。
 * @returns 画面の中央からの横の距離と、その位置での縮み（中央が 1）。
 */
export function project(along: number, drum: number): [x: number, scale: number] {
  const radius = RADIUS * drum;
  const focus = FOCUS * drum;
  const angle = Math.max(-LIMIT, Math.min(LIMIT, along / radius));
  const scale = focus / (focus + radius * (1 - Math.cos(angle)));
  return [radius * Math.sin(angle) * scale, scale];
}

/**
 * 画面の上の位置から、帯の上の位置を求めます（project の逆）。
 * 円筒の輪郭より外側なら null を返します。
 */
export function unproject(x: number, drum: number): number | null {
  const edge = LIMIT * RADIUS * drum;
  if (Math.abs(x) >= project(edge, drum)[0]) return null;

  let low = -edge;
  let high = edge;
  for (let step = 0; step < 28; step += 1) {
    const middle = (low + high) / 2;
    if (project(middle, drum)[0] < x) low = middle;
    else high = middle;
  }
  return (low + high) / 2;
}
