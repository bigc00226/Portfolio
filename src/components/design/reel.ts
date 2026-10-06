import {
  Camera,
  Color,
  Mesh,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  TextureLoader,
  Vector2,
  WebGLRenderer,
  type Texture,
} from "three";

import { FOCUS, HEIGHT, LIMIT, PITCH, RADIUS, WIDTH, project, unproject } from "./reelShape";
import { canUseWebGL } from "./ribbon";

/**
 * 横に流れるギャラリーの画像を描きます。
 *
 * 画像は、手前にふくらんだ円筒の表面に並んでいます（形は reelShape.ts）。
 * 円筒への貼りつけと遠近は、頂点シェーダーの中で計算しています。画面に出る位置を
 * 式のまま決められるので、ポインターがどの画像の上にあるかも、同じ式から求められます。
 */

/** 一枚の画像を曲げるための分割数（横と縦）。 */
const COLUMNS = 28;
const ROWS = 10;

/** 画像が届くまで見せておく色。 */
const BLANK = 0x2a292c;

/** ポインターを載せた画像が白黒へ変わる速さ（1 秒あたり）。 */
const FADE = 5;

const VERTEX = /* glsl */ `
  uniform vec2 uView;
  uniform vec2 uSize;
  uniform float uRadius;
  uniform float uFocus;
  uniform float uLimit;
  uniform float uBow;
  uniform float uCenter;

  varying vec2 vUv;

  void main() {
    vUv = uv;

    // 帯の上での位置（画面の中央が 0）。流れているあいだは、上下の端より
    // 中ほどが、進む向きへ先に出ます。
    float lead = 1.0 - 4.0 * position.y * position.y;
    float along = uCenter + position.x * uSize.x - uBow * lead;

    // 円筒に貼りつけて、遠近をつけます。輪郭より先は、輪郭の上に畳みます。
    float angle = clamp(along / uRadius, -uLimit, uLimit);
    float scale = uFocus / (uFocus + uRadius * (1.0 - cos(angle)));
    vec2 point = vec2(uRadius * sin(angle), position.y * uSize.y) * scale;

    gl_Position = vec4(point / uView, 0.0, 1.0);
  }
`;

const FRAGMENT = /* glsl */ `
  uniform sampler2D uMap;
  uniform vec2 uCover;
  uniform vec3 uBlank;
  uniform float uLoaded;
  uniform float uGray;

  varying vec2 vUv;

  void main() {
    vec2 uv = (vUv - 0.5) * uCover + 0.5;
    vec3 color = mix(uBlank, texture2D(uMap, uv).rgb, uLoaded);
    float luma = dot(color, vec3(0.299, 0.587, 0.114));
    gl_FragColor = vec4(mix(color, vec3(luma), uGray), 1.0);
  }
`;

export type Reel = {
  /** 画面の大きさと、基準の長さ・円筒の長さ（reelShape.ts の unitOf と drumOf）を伝えます。 */
  resize: (width: number, height: number, unit: number, drum: number) => void;
  /**
   * 一コマ描きます。
   * @param first 最初の画像の中心の位置（帯の上、画面の中央が 0、ピクセル）。
   * @param bow 流れる勢いによる、たわみの量（ピクセル）。
   * @param hovered ポインターが載っている画像の番号。なければ -1。
   * @param elapsed 前のコマからの時間（ミリ秒）。
   * @returns 白黒への切り替えが、まだ途中かどうか。
   */
  render: (first: number, bow: number, hovered: number, elapsed: number) => boolean;
  /** 画面の中央から測った位置にある、画像の番号を返します。なければ -1。 */
  locate: (x: number, y: number) => number;
  dispose: () => void;
};

/**
 * 入れものにキャンバスを置いて、ギャラリーを描きます。
 * WebGL2 が使えない環境では例外を投げます。呼び出し側は、それを受けて
 * 動かない一覧に切り替えます。
 *
 * @param images 画像の URL。帯の先頭から順に並びます。
 * @param onChange 画像が読みこまれて、描き直しが必要になるたびに呼ばれます。
 */
export function createReel(
  host: HTMLElement,
  images: readonly string[],
  onChange: () => void,
): Reel {
  if (!canUseWebGL()) throw new Error("WebGL2 is not available");

  const canvas = document.createElement("canvas");
  host.appendChild(canvas);

  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
  } catch (error) {
    canvas.remove();
    throw error;
  }
  renderer.setClearColor(0x000000, 0);

  const scene = new Scene();
  /* 頂点の位置はシェーダーが決めるので、カメラは形だけ置きます。 */
  const camera = new Camera();

  /* すべての画像で共有する値。大きさが変わったときと、描く直前に書き換えます。 */
  const shared = {
    uView: { value: new Vector2(1, 1) },
    uSize: { value: new Vector2(1, 1) },
    uRadius: { value: 1 },
    uFocus: { value: 1 },
    uLimit: { value: LIMIT },
    uBow: { value: 0 },
  };

  const geometry = new PlaneGeometry(1, 1, COLUMNS, ROWS);
  const frames = images.map(() => {
    const material = new ShaderMaterial({
      vertexShader: VERTEX,
      fragmentShader: FRAGMENT,
      uniforms: {
        ...shared,
        uCenter: { value: 0 },
        uMap: { value: null },
        uCover: { value: new Vector2(1, 1) },
        uBlank: { value: new Color(BLANK) },
        uLoaded: { value: 0 },
        uGray: { value: 0 },
      },
    });

    const mesh = new Mesh(geometry, material);
    /* 頂点をシェーダーで動かすので、形から求めた範囲での間引きは当てになりません。 */
    mesh.frustumCulled = false;
    scene.add(mesh);
    return mesh;
  });

  const loader = new TextureLoader();
  const anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  const textures: Texture[] = [];
  let disposed = false;

  images.forEach((src, index) => {
    loader.load(src, (texture) => {
      if (disposed) {
        texture.dispose();
        return;
      }
      texture.anisotropy = anisotropy;
      textures.push(texture);

      /* 写真の比率が枠と違っても、ゆがめずに枠いっぱいへ収めます。 */
      const ratio = texture.image.width / texture.image.height;
      const frame = WIDTH / HEIGHT;
      const { uniforms } = frames[index].material;
      const cover = uniforms.uCover.value as Vector2;
      if (ratio > frame) cover.set(frame / ratio, 1);
      else cover.set(1, ratio / frame);
      uniforms.uMap.value = texture;
      uniforms.uLoaded.value = 1;

      onChange();
    });
  });

  let unit = 1;
  let drum = 1;
  let first = 0;

  const resize = (width: number, height: number, nextUnit: number, nextDrum: number) => {
    unit = nextUnit;
    drum = nextDrum;
    shared.uView.value.set(width / 2, height / 2);
    shared.uSize.value.set(WIDTH * unit, HEIGHT * unit);
    shared.uRadius.value = RADIUS * drum;
    shared.uFocus.value = FOCUS * drum;

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height, false);
  };

  const render = (start: number, bow: number, hovered: number, elapsed: number) => {
    first = start;
    shared.uBow.value = bow;

    /* 輪郭より外へ出きった画像は、描きません。 */
    const reach = LIMIT * RADIUS * drum + (WIDTH / 2) * unit + Math.abs(bow);
    const step = Math.min(1, (elapsed / 1000) * FADE);
    let fading = false;

    frames.forEach((mesh, index) => {
      const center = start + index * PITCH * unit;
      const { uniforms } = mesh.material;
      uniforms.uCenter.value = center;
      mesh.visible = Math.abs(center) < reach;

      const gray = uniforms.uGray.value as number;
      const target = index === hovered ? 1 : 0;
      if (gray !== target) {
        const next = gray + Math.sign(target - gray) * step;
        uniforms.uGray.value = target === 1 ? Math.min(1, next) : Math.max(0, next);
        fading = fading || uniforms.uGray.value !== target;
      }
    });

    renderer.render(scene, camera);
    return fading;
  };

  const locate = (x: number, y: number) => {
    const along = unproject(x, drum);
    if (along === null) return -1;

    const pitch = PITCH * unit;
    const index = Math.round((along - first) / pitch);
    if (index < 0 || index >= frames.length) return -1;
    if (Math.abs(along - (first + index * pitch)) > (WIDTH * unit) / 2) return -1;

    const [, scale] = project(along, drum);
    return Math.abs(y) <= (HEIGHT * unit * scale) / 2 ? index : -1;
  };

  const dispose = () => {
    disposed = true;
    geometry.dispose();
    for (const mesh of frames) mesh.material.dispose();
    for (const texture of textures) texture.dispose();
    renderer.dispose();
    canvas.remove();
  };

  return { resize, render, locate, dispose };
}
