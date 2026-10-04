import {
  BufferAttribute,
  BufferGeometry,
  Color,
  DoubleSide,
  DynamicDrawUsage,
  Mesh,
  PerspectiveCamera,
  Scene,
  ShaderMaterial,
  TextureLoader,
  Vector2,
  WebGLRenderer,
  type Texture,
} from "three";

/**
 * 写真の帯を、3D の空間で走らせます。
 *
 * 帯は、縦に立てた大きな筒に、らせん状に巻きついています。筒が回りながら
 * 奥から近づき、やがて遠ざかるので、写真は左下の奥から現れ、手前を大きく
 * 横切り、右端で裏へ回って、文字の後ろを遠ざかっていきます。
 *
 * 見出しの文字は HTML のままなので、帯を「文字より奥」と「文字より手前」の
 * 二枚のキャンバスに描き分け、文字をそのあいだに挟んでいます。
 * 奥行き 0 の面が、文字のある位置です。
 *
 * 長さの単位は CSS ピクセルで、奥行き 0 の面では画面上の大きさと一致します。
 */

/** カメラの画角（縦）。 */
const FOV = 30;
/** 一枚の写真を曲げるための分割数。 */
const SEGMENTS = 24;
/** 一枚の横と縦の比。 */
const FRAME_RATIO = 1.5;
/** 写真と写真のすきま（帯の高さに対する割合）。 */
const GAP = 0.045;

/** 帯に並べる枚数。画像が足りない分は、先頭からくり返して並べます。 */
const COUNT = 12;

/** 筒の半径と、帯の高さ（どちらも、画面の高さを 1 とした値）。 */
const RADIUS = 1.7;
const BAND = 0.38;
/** らせんの上がり方。筒を一ラジアン回るごとに、これだけ上がります。 */
const RISE = 0.07;

/**
 * 帯が見えるのは、筒の左手前から、裏側の中ほどまで。その外では薄れて消えます。
 * 角度は、筒の正面（いちばん手前）を 0、右まわりをプラスとしたラジアンです。
 */
const ENTER = -1.0;
const LEAVE = 2.9;

/**
 * 進み具合ごとの、筒の置き方。あいだは、なめらかにつなぎます。
 *
 * [進み具合, 横位置, 縦位置, 大きさ, 先頭の角度, 傾き, 見下ろし]
 * - 横位置と縦位置は、筒の正面が画面のどこに来るか（中心が 0、端が ±1）。
 * - 大きさは、正面の写真が何倍に見えるか。1 で、文字と同じ面にあります。
 * - 先頭の角度は、帯の先頭が筒のどこまで回ったか。
 * - 傾きは筒を画面の中で倒す角度で、プラスが右上がり。
 *   見下ろしは筒を上から見こむ角度です（どちらもラジアン）。
 */
const KEYS: readonly (readonly number[])[] = [
  [0.0, -0.45, -0.72, 0.5, 0.53, 0.2, 0.06],
  [0.14, 0.3, -0.78, 1.7, 1.05, 0.15, 0.06],
  [0.27, 0.35, -0.74, 1.72, 1.4, 0.13, 0.06],
  [0.4, 0.4, -0.5, 1.75, 1.95, 0.08, 0.06],
  [0.52, 0.3, -0.36, 1.78, 2.6, 0.06, 0.06],
  [0.66, 0.5, -0.05, 1.65, 3.6, 0.02, 0.06],
  [0.75, 0.62, 0.16, 1.5, 4.0, 0.0, 0.06],
  [0.87, 0.62, 0.2, 1.4, 5.3, 0.0, 0.06],
  [1.0, 0.62, 0.25, 1.3, 6.6, 0.0, 0.06],
];

const VERTEX = /* glsl */ `
  uniform float uLead;
  uniform float uLength;
  uniform float uHeadAngle;
  uniform float uArc;

  varying vec2 vUv;
  varying float vHead;
  varying float vAngle;
  varying float vDepth;

  void main() {
    vUv = uv;
    // 帯の先頭からの距離と、筒の上での角度。
    vHead = uLead + (1.0 - uv.x) * uLength;
    vAngle = uHeadAngle - vHead / uArc;
    vDepth = position.z;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAGMENT = /* glsl */ `
  uniform sampler2D uMap;
  uniform vec2 uCover;
  uniform vec3 uTone;
  uniform float uLoaded;
  uniform float uFade;
  uniform float uEnter;
  uniform float uLeave;
  uniform float uSide;

  varying vec2 vUv;
  varying float vHead;
  varying float vAngle;
  varying float vDepth;

  void main() {
    // 文字の面より手前か奥か。担当でないほうは描きません。
    if (uSide > 0.0 ? vDepth < 0.0 : vDepth >= 0.0) discard;

    // 先頭は薄く。筒の裏から回ってくるところと、裏へ消えていくところも薄く。
    float alpha = smoothstep(0.0, uFade, vHead)
      * smoothstep(uEnter - 0.55, uEnter, vAngle)
      * (1.0 - smoothstep(uLeave, uLeave + 0.6, vAngle));
    if (alpha < 0.004) discard;

    vec2 uv = vUv;
    // 裏へ回ったあとは帯を裏から見ることになるので、左右を戻します。
    if (!gl_FrontFacing) uv.x = 1.0 - uv.x;
    uv = (uv - 0.5) * uCover + 0.5;

    vec3 color = mix(uTone, texture2D(uMap, uv).rgb, uLoaded);
    gl_FragColor = vec4(color, alpha);
  }
`;

type Frame = {
  mesh: Mesh<BufferGeometry, ShaderMaterial>;
  positions: Float32Array;
  attribute: BufferAttribute;
};

export type Ribbon = {
  resize: (width: number, height: number) => void;
  /** 進み具合（0〜1）と、ポインターの位置（中央が 0、端が ±1）から一枚描きます。 */
  render: (progress: number, pointerX: number, pointerY: number) => void;
  dispose: () => void;
};

/** KEYS の一列を、進み具合に合わせて、なめらかにつないだ値で返します。 */
function track(column: number, progress: number) {
  const last = KEYS.length - 1;
  if (progress <= KEYS[0][0]) return KEYS[0][column];
  if (progress >= KEYS[last][0]) return KEYS[last][column];

  let index = 0;
  while (index < last - 1 && progress > KEYS[index + 1][0]) index++;

  const from = KEYS[index];
  const to = KEYS[index + 1];
  const before = KEYS[Math.max(index - 1, 0)];
  const after = KEYS[Math.min(index + 2, last)];

  /* 前後の点から傾きを決める、エルミート補間です。 */
  const span = to[0] - from[0];
  const t = (progress - from[0]) / span;
  const slopeFrom = ((to[column] - before[column]) / (to[0] - before[0])) * span;
  const slopeTo = ((after[column] - from[column]) / (after[0] - from[0])) * span;
  const t2 = t * t;
  const t3 = t2 * t;

  return (
    (2 * t3 - 3 * t2 + 1) * from[column] +
    (t3 - 2 * t2 + t) * slopeFrom +
    (-2 * t3 + 3 * t2) * to[column] +
    (t3 - t2) * slopeTo
  );
}

/** WebGL2 が使えるかどうかを、使い捨てのキャンバスで確かめます。 */
function canUseWebGL() {
  try {
    const context = document.createElement("canvas").getContext("webgl2");
    context?.getExtension("WEBGL_lose_context")?.loseContext();
    return context !== null;
  } catch {
    return false;
  }
}

/**
 * 二つの入れもの（文字より奥と、文字より手前）にキャンバスを置いて、帯を描きます。
 * キャンバスは呼ばれるたびに新しく作り、片づけるときに取り除きます。
 *
 * WebGL2 が使えない環境では例外を投げます。呼び出し側は、それを受けて
 * 画像の並びに切り替えます。
 *
 * @param images 画像の URL。帯の先頭から順に並びます。
 * @param onChange 画像が読みこまれて描き直しが必要になるたびに、読みこみ済みの枚数とともに呼ばれます。
 */
export function createRibbon(
  backHost: HTMLElement,
  frontHost: HTMLElement,
  images: readonly string[],
  onChange: (loaded: number) => void,
): Ribbon {
  if (!canUseWebGL()) throw new Error("WebGL2 is not available");

  const canvases: HTMLCanvasElement[] = [];
  const renderers: WebGLRenderer[] = [];
  try {
    for (const host of [backHost, frontHost]) {
      const canvas = document.createElement("canvas");
      host.appendChild(canvas);
      canvases.push(canvas);

      const renderer = new WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
      renderer.setClearColor(0x000000, 0);
      renderers.push(renderer);
    }
  } catch (error) {
    for (const renderer of renderers) renderer.dispose();
    for (const canvas of canvases) canvas.remove();
    throw error;
  }

  const scene = new Scene();
  const camera = new PerspectiveCamera(FOV, 1, 1, 10);

  /* すべての写真で共有する値。描く直前に書き換えます。 */
  const shared = {
    uSide: { value: 1 },
    uFade: { value: 1 },
    uHeadAngle: { value: 0 },
    uArc: { value: 1 },
    uEnter: { value: ENTER },
    uLeave: { value: LEAVE },
  };

  const uvs = new Float32Array((SEGMENTS + 1) * 4);
  const indices: number[] = [];
  for (let i = 0; i <= SEGMENTS; i++) {
    uvs.set([i / SEGMENTS, 1, i / SEGMENTS, 0], i * 4);
    if (i < SEGMENTS) {
      const a = i * 2;
      indices.push(a, a + 1, a + 2, a + 2, a + 1, a + 3);
    }
  }

  const frames: Frame[] = Array.from({ length: COUNT }, () => {
    const positions = new Float32Array((SEGMENTS + 1) * 6);
    const attribute = new BufferAttribute(positions, 3);
    attribute.setUsage(DynamicDrawUsage);

    const geometry = new BufferGeometry();
    geometry.setAttribute("position", attribute);
    geometry.setAttribute("uv", new BufferAttribute(uvs, 2));
    geometry.setIndex(indices);

    const material = new ShaderMaterial({
      vertexShader: VERTEX,
      fragmentShader: FRAGMENT,
      uniforms: {
        ...shared,
        uMap: { value: null },
        uCover: { value: new Vector2(1, 1) },
        uTone: { value: new Color(0xe4e4e3) },
        uLoaded: { value: 0 },
        uLead: { value: 0 },
        uLength: { value: 1 },
      },
      side: DoubleSide,
      transparent: true,
    });

    const mesh = new Mesh(geometry, material);
    /* 頂点を毎回動かすので、形から求めた範囲での間引きは当てになりません。 */
    mesh.frustumCulled = false;
    scene.add(mesh);

    return { mesh, positions, attribute };
  });

  /* 画像は一枚につき一度だけ読みこみ、同じ画像を使う枚すべてに配ります。 */
  const loader = new TextureLoader();
  const anisotropy = Math.min(8, renderers[0].capabilities.getMaxAnisotropy());
  const textures: Texture[] = [];
  let disposed = false;

  images.forEach((src, source) => {
    loader.load(src, (texture) => {
      if (disposed) {
        texture.dispose();
        return;
      }
      texture.anisotropy = anisotropy;
      textures.push(texture);

      /* 写真の比率が枠と違っても、ゆがめずに枠いっぱいへ収めます。 */
      const ratio = texture.image.width / texture.image.height;

      frames.forEach((frame, index) => {
        if (index % images.length !== source) return;
        const { uniforms } = frame.mesh.material;
        const cover = uniforms.uCover.value as Vector2;
        if (ratio > FRAME_RATIO) cover.set(FRAME_RATIO / ratio, 1);
        else cover.set(1, ratio / FRAME_RATIO);
        uniforms.uMap.value = texture;
        uniforms.uLoaded.value = 1;
      });

      onChange(textures.length);
    });
  });

  let width = 1;
  let height = 1;
  let distance = 1;

  const resize = (nextWidth: number, nextHeight: number) => {
    width = Math.max(1, nextWidth);
    height = Math.max(1, nextHeight);
    distance = height / 2 / Math.tan((FOV * Math.PI) / 360);

    camera.aspect = width / height;
    camera.near = distance * 0.04;
    camera.far = distance * 8;
    camera.updateProjectionMatrix();

    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    for (const renderer of renderers) {
      renderer.setPixelRatio(ratio);
      renderer.setSize(width, height, false);
    }
  };

  const render = (progress: number, pointerX: number, pointerY: number) => {
    /* 縦長の画面では、筒も帯も小さくして、写真が大きくなりすぎないようにします。 */
    const unit = height * Math.min(1, Math.max(0.5, width / (height * 1.3)));
    const radius = unit * RADIUS;
    const band = unit * BAND;
    const rise = unit * RISE;
    const frameLength = band * FRAME_RATIO;
    const pitch = frameLength + band * GAP;

    /* 筒の正面を、決めた大きさ・決めた画面位置に置きます。 */
    const scale = track(3, progress);
    const frontZ = distance * (1 - 1 / scale);
    const centerX = (track(1, progress) * (width / 2)) / scale;
    const centerY = (track(2, progress) * (height / 2)) / scale;
    const headAngle = track(4, progress);

    /* 筒の向き。画面の中で倒し、さらに上から見こみます。 */
    const tilt = track(5, progress);
    const look = track(6, progress);
    const cosT = Math.cos(tilt);
    const sinT = Math.sin(tilt);
    const cosL = Math.cos(look);
    const sinL = Math.sin(look);

    shared.uFade.value = frameLength * 0.9;
    shared.uHeadAngle.value = headAngle;
    shared.uArc.value = radius;

    frames.forEach((frame, index) => {
      const lead = index * pitch;
      const uniforms = frame.mesh.material.uniforms;
      uniforms.uLead.value = lead;
      uniforms.uLength.value = frameLength;

      const { positions } = frame;
      for (let i = 0; i <= SEGMENTS; i++) {
        /* i = 0 が後ろの端、i = SEGMENTS が進行方向の端です。 */
        const angle = headAngle - (lead + frameLength * (1 - i / SEGMENTS)) / radius;

        /* 筒の上の一点（筒の軸が真上を向いているときの座標）。 */
        const x = radius * Math.sin(angle);
        const z = radius * Math.cos(angle) - radius;
        const y = rise * angle;

        for (let edge = 0; edge < 2; edge++) {
          const ly = y + (edge === 0 ? band / 2 : -band / 2);

          /* 上から見こむ（横軸まわり）→ 画面の中で倒す（奥行きの軸まわり）。 */
          const ry = ly * cosL - z * sinL;
          const rz = ly * sinL + z * cosL;
          const offset = i * 6 + edge * 3;
          positions[offset] = centerX + x * cosT - ry * sinT;
          positions[offset + 1] = centerY + x * sinT + ry * cosT;
          positions[offset + 2] = frontZ + rz;
        }
      }
      frame.attribute.needsUpdate = true;
    });

    /* ポインターに合わせて、視点をわずかに振ります。 */
    camera.position.set(pointerX * width * 0.018, -pointerY * height * 0.018, distance);
    camera.lookAt(0, 0, 0);

    shared.uSide.value = -1;
    renderers[0].render(scene, camera);
    shared.uSide.value = 1;
    renderers[1].render(scene, camera);
  };

  /* 描画の環境が作り直されたら（GPU の切り替えなど）、描き直しを頼みます。 */
  const restored = () => onChange(textures.length);
  for (const canvas of canvases) canvas.addEventListener("webglcontextrestored", restored);

  const dispose = () => {
    disposed = true;
    for (const canvas of canvases) canvas.removeEventListener("webglcontextrestored", restored);
    for (const frame of frames) {
      frame.mesh.geometry.dispose();
      frame.mesh.material.dispose();
    }
    for (const texture of textures) texture.dispose();
    for (const renderer of renderers) {
      renderer.dispose();
      /* 描画の環境は数に限りがあるので、すぐに手放します。 */
      renderer.forceContextLoss();
    }
    for (const canvas of canvases) canvas.remove();
  };

  return { resize, render, dispose };
}
