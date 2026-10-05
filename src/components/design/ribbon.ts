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
 * 写真の帯を、輪（円軌道）に沿って走らせます。
 *
 * 帯は、縦に立てた大きな輪の上を一周します。輪のいちばん奥で現れ、奥側を
 * 小さく左へ流れ、左端で折り返して、手前を大きく右へ横切り、右端でもう一度
 * 折り返して、奥側を流れながら、いちばん奥で消えていきます。
 * スクロールが進むにつれて、輪そのものも画面の下から上へ昇っていきます。
 *
 * 見出しの文字は HTML のままなので、帯を「文字より奥」と「文字より手前」の
 * 二枚のキャンバスに描き分け、文字をそのあいだに挟んでいます。輪の中心は
 * 文字の面（奥行き 0）にあり、手前の半分だけが文字の前を通ります。
 *
 * 長さの単位は CSS ピクセルで、奥行き 0 の面では画面上の大きさと一致します。
 */

/** 一枚の写真を曲げるための分割数。 */
const SEGMENTS = 24;
/** 一枚の横と縦の比。 */
const FRAME_RATIO = 16 / 9;
/** 帯に並べる枚数。画像が足りない分は、先頭からくり返して並べます。 */
const COUNT = 10;

/**
 * 輪の半径と、写真の高さ。どちらも「基準の長さ」を 1 とした値です。
 * 基準の長さは、横長の画面では画面の高さ、縦長の画面では画面の幅の 8 割です。
 */
const RADIUS = 0.973;
const FRAME_HEIGHT = 0.2925;
/** 視点から文字の面までの距離（基準の長さが単位）。大きくするほど、遠近が弱まります。 */
const DISTANCE = 1.866;

/** 写真一枚が輪の上で占める角度と、となりの写真までの角度（ラジアン）。 */
const FRAME_ANGLE = (FRAME_HEIGHT * FRAME_RATIO) / RADIUS;
const STEP = FRAME_ANGLE + 0.0096;

/**
 * 輪のいちばん奥にある継ぎ目。帯はここで現れ、ここで消えます。
 * 角度は、輪のいちばん手前を 0、右まわりをプラスとしたラジアンです。
 */
const SEAM_IN: readonly [number, number] = [-Math.PI - 0.13, -Math.PI - 0.01];
const SEAM_OUT: readonly [number, number] = [Math.PI - 0.16, Math.PI + 0.06];

/**
 * 帯の先頭が輪のどこにいるか。進み具合 0 のときの角度と、進み具合が 1 進む
 * あいだに回る角度です。帯は、スクロールに対していつも同じ速さで回ります。
 */
const HEAD_START = -0.05;
const TURN = 6.57;

/**
 * 進み具合ごとの、輪の置き方。あいだは、なめらかにつなぎます。
 * 進み具合は、画面を固定しているあいだが 0〜1。固定が外れたあとも続きます。
 *
 * [進み具合, 横位置, 縦位置, 傾き, 見下ろし, すぼまり]
 * - 横位置は輪の中心（基準の長さが単位）、縦位置は画面の高さが単位。
 *   どちらも画面の中心が 0 で、右と上がプラスです。
 * - 傾きは、輪を画面の中で倒す角度。プラスで右上がり。
 * - 見下ろしは、輪の奥側を持ち上げる角度。プラスで、上から見こむ形になります。
 * - すぼまりは、帯の上の縁と下の縁の半径の差を角度にしたもの。マイナスで、
 *   上の縁が内側へ入ります（角度はどれも度）。
 */
const KEYS: readonly (readonly number[])[] = [
  [0.0, -0.135, -0.403, 11.0, -3.8, -39.0],
  [0.0304, -0.124, -0.375, 11.0, -4.1, -28.0],
  [0.0578, -0.112, -0.353, 10.6, -4.4, -20.0],
  [0.1339, -0.062, -0.255, 10.4, -3.2, -13.0],
  [0.2892, -0.015, -0.169, 8.3, -2.0, -7.0],
  [0.4673, 0.05, -0.045, 5.6, -1.9, -0.4],
  [0.6362, 0.01, -0.012, 3.4, 1.4, 6.0],
  [0.8417, 0.04, 0.103, 0.4, 4.9, 20.0],
  [1.0654, -0.146, 0.253, -7.5, 3.0, 14.0],
  [1.53, -0.3, 0.5, -14.0, 2.0, 10.0],
];

/** 読みこみ直後、帯が回りこんできて位置につくまでの時間（ミリ秒）。 */
const INTRO = 2000;
/** そのとき、帯をどれだけ戻した位置から回しはじめるか（ラジアン）。 */
const INTRO_TURN = 1.5;

const VERTEX = /* glsl */ `
  attribute float angle;

  varying vec2 vUv;
  varying float vAngle;
  varying float vDepth;

  void main() {
    vUv = uv;
    vAngle = angle;
    vDepth = position.z;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAGMENT = /* glsl */ `
  uniform sampler2D uMap;
  uniform vec2 uCover;
  uniform vec3 uTone;
  uniform float uLoaded;
  uniform vec4 uSeam;
  uniform float uSide;

  varying vec2 vUv;
  varying float vAngle;
  varying float vDepth;

  void main() {
    // 文字の面より手前か奥か。担当でないほうは描きません。
    if (uSide > 0.0 ? vDepth < 0.0 : vDepth >= 0.0) discard;

    // 輪のいちばん奥の継ぎ目では、薄れて消えます。
    float alpha = smoothstep(uSeam.x, uSeam.y, vAngle)
      * (1.0 - smoothstep(uSeam.z, uSeam.w, vAngle));
    if (alpha < 0.004) discard;

    vec2 uv = vUv;
    // 奥側では帯を裏から見ることになるので、左右を戻します。
    if (!gl_FrontFacing) uv.x = 1.0 - uv.x;
    uv = (uv - 0.5) * uCover + 0.5;

    vec3 color = mix(uTone, texture2D(uMap, uv).rgb, uLoaded);
    gl_FragColor = vec4(color, alpha);
  }
`;

type Frame = {
  mesh: Mesh<BufferGeometry, ShaderMaterial>;
  positions: Float32Array;
  angles: Float32Array;
  position: BufferAttribute;
  angle: BufferAttribute;
};

export type Ribbon = {
  resize: (width: number, height: number) => void;
  /**
   * 進み具合と、ポインターの位置（中央が 0、端が ±1）から一枚描きます。
   * 自分で動いている最中（読みこみ直後の回りこみ）は true を返すので、
   * そのあいだは続けて呼んでください。
   */
  render: (progress: number, pointerX: number, pointerY: number, now: number) => boolean;
  dispose: () => void;
};

const RAD = Math.PI / 180;

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
  const camera = new PerspectiveCamera(30, 1, 1, 10);

  /* すべての写真で共有する値。描く直前に書き換えます。 */
  const shared = {
    uSide: { value: 1 },
    uSeam: { value: [SEAM_IN[0], SEAM_IN[1], SEAM_OUT[0], SEAM_OUT[1]] },
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
    const angles = new Float32Array((SEGMENTS + 1) * 2);
    const position = new BufferAttribute(positions, 3);
    const angle = new BufferAttribute(angles, 1);
    position.setUsage(DynamicDrawUsage);
    angle.setUsage(DynamicDrawUsage);

    const geometry = new BufferGeometry();
    geometry.setAttribute("position", position);
    geometry.setAttribute("angle", angle);
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
      },
      side: DoubleSide,
      transparent: true,
    });

    const mesh = new Mesh(geometry, material);
    /* 頂点を毎回動かすので、形から求めた範囲での間引きは当てになりません。 */
    mesh.frustumCulled = false;
    scene.add(mesh);

    return { mesh, positions, angles, position, angle };
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
  let unit = 1;
  let distance = 1;
  /** 読みこみ直後の回りこみを始めた時刻。まだなら -1。 */
  let introStart = -1;

  const resize = (nextWidth: number, nextHeight: number) => {
    width = Math.max(1, nextWidth);
    height = Math.max(1, nextHeight);
    unit = Math.min(height, width * 0.8);
    distance = unit * DISTANCE;

    /* 奥行き 0 の面が、画面の大きさとぴったり重なる画角にします。 */
    camera.fov = (2 * Math.atan(height / 2 / distance)) / RAD;
    camera.aspect = width / height;
    camera.near = distance * 0.04;
    camera.far = distance * 6;
    camera.updateProjectionMatrix();

    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    for (const renderer of renderers) {
      renderer.setPixelRatio(ratio);
      renderer.setSize(width, height, false);
    }
  };

  const render = (progress: number, pointerX: number, pointerY: number, now: number) => {
    /*
     * 読みこみ直後は、帯を少し手前から回しこみます。途中までスクロールした
     * 位置で開いたときは、その分だけ控えめにします。
     */
    const ready = textures.length >= Math.min(3, images.length);
    if (ready && introStart < 0) introStart = now;
    const elapsed = ready ? Math.min((now - introStart) / INTRO, 1) : 0;
    const intro = (1 - elapsed) ** 3 * Math.max(0, 1 - progress * 8);

    const head = HEAD_START + TURN * progress - intro * INTRO_TURN;
    const centerX = track(1, progress) * unit;
    const centerY = (track(2, progress) - intro * 0.06) * height;
    const roll = track(3, progress) * RAD;
    const pitch = track(4, progress) * RAD;
    const flare = Math.tan(track(5, progress) * RAD);

    const cosR = Math.cos(roll);
    const sinR = Math.sin(roll);
    const cosP = Math.cos(pitch);
    const sinP = Math.sin(pitch);
    const radius = unit * RADIUS;
    const half = (unit * FRAME_HEIGHT) / 2;

    frames.forEach((frame, index) => {
      const lead = head - index * STEP;
      const trail = lead - FRAME_ANGLE;

      /* 継ぎ目の外にいる写真は、描く手間を省きます。 */
      frame.mesh.visible = lead > SEAM_IN[0] && trail < SEAM_OUT[1];
      if (!frame.mesh.visible) return;

      const { positions, angles } = frame;
      for (let i = 0; i <= SEGMENTS; i++) {
        /* i = 0 が後ろの端、i = SEGMENTS が進行方向の端です。 */
        const theta = trail + (FRAME_ANGLE * i) / SEGMENTS;
        const sin = Math.sin(theta);
        const cos = Math.cos(theta);

        for (let edge = 0; edge < 2; edge++) {
          const v = edge === 0 ? half : -half;
          /* 輪の上の一点。輪の軸が真上を向いているときの座標です。 */
          const r = radius + v * flare;
          const x = r * sin;
          const z = r * cos;

          /* 奥側を持ち上げる（横軸まわり）→ 画面の中で倒す（奥行きの軸まわり）。 */
          const y2 = v * cosP - z * sinP;
          const z2 = v * sinP + z * cosP;
          const offset = i * 6 + edge * 3;
          positions[offset] = centerX + x * cosR - y2 * sinR;
          positions[offset + 1] = centerY + x * sinR + y2 * cosR;
          positions[offset + 2] = z2;
          angles[i * 2 + edge] = theta;
        }
      }
      frame.position.needsUpdate = true;
      frame.angle.needsUpdate = true;
    });

    /* ポインターに合わせて、視点をわずかに振ります。 */
    camera.position.set(pointerX * unit * 0.016, -pointerY * unit * 0.016, distance);
    camera.lookAt(0, 0, 0);

    shared.uSide.value = -1;
    renderers[0].render(scene, camera);
    shared.uSide.value = 1;
    renderers[1].render(scene, camera);

    /* 画像を待っているあいだは、読みこみの知らせが次の描画を呼びます。 */
    return ready && elapsed < 1;
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
