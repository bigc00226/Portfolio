import type { CSSProperties, ReactNode } from "react";

import s from "./Scene.module.css";

/** 地面の高さ（y 座標）。舞台が引く線と、同じ位置です。 */
export const GROUND = 660;

export const cx = (...names: (string | false | null | undefined)[]) =>
  names.filter(Boolean).join(" ");

/* 動き ------------------------------------------------------------------- */

type MotionVars = {
  /** 動き始めの位置のずれ。 */
  dx?: number;
  dy?: number;
  /** 動き始めの傾き、または揺れ幅（度）。 */
  dr?: number;
  /** 動き始めの大きさ、または鼓動の大きさ。 */
  ds?: number;
  /** くり返す回数。 */
  n?: number;
};

/**
 * 章の進み具合 from〜to のあいだに動く、という指定を書きこみます。
 *
 * --a と --b は StoryFilm.tsx が読み取り、再生位置を決めるのに使います。
 * 残りは CSS のアニメーションが使う値です。子へ受け継がれるので、
 * ずれや傾きは毎回すべて書き直しています。
 */
export function span(from: number, to: number, vars: MotionVars = {}): CSSProperties {
  const style: Record<string, string | number> = {
    "--a": from,
    "--b": to,
    "--dx": `${vars.dx ?? 0}px`,
    "--dy": `${vars.dy ?? 0}px`,
    "--dr": `${vars.dr ?? 0}deg`,
    "--ds": vars.ds ?? 1,
  };
  if (vars.n !== undefined) style["--n"] = vars.n;
  return style as CSSProperties;
}

type MotionName =
  | "in"
  | "move"
  | "walk"
  | "fade"
  | "out"
  | "pop"
  | "popUp"
  | "grow"
  | "growX"
  | "drop"
  | "hop"
  | "sway"
  | "hang"
  | "pulse"
  | "spin"
  | "blink"
  | "away";

const DEFAULTS: Partial<Record<MotionName, MotionVars>> = {
  drop: { dy: -140 },
  hop: { dy: -34 },
  sway: { dr: 7 },
  hang: { dr: 7 },
  pulse: { ds: 1.16 },
};

type MProps = MotionVars & {
  /** 動きの種類。Scene.module.css の同じ名前のクラスに対応します。 */
  k: MotionName;
  /** 動き始めと動き終わり（章の進み具合 0〜1）。 */
  a: number;
  b: number;
  className?: string;
  children: ReactNode;
};

/** 中身を、決めた区間のあいだに動かします。仕上がりの位置は、中身を置いた場所です。 */
export function M({ k, a, b, className, children, ...vars }: MProps) {
  return (
    <g className={cx(s[k], className)} style={span(a, b, { ...DEFAULTS[k], ...vars })}>
      {children}
    </g>
  );
}

type DrawProps = { d: string; a: number; b: number; className?: string };

/** 線を、端から描いていきます。 */
export function Draw({ d, a, b, className }: DrawProps) {
  return (
    <path
      className={cx(s.line, s.draw, className)}
      d={d}
      pathLength={1}
      style={span(a, b)}
    />
  );
}

/* 画面 ------------------------------------------------------------------- */

export function Scene({ children }: { children: ReactNode }) {
  return (
    <svg
      className={s.scene}
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <path className={cx(s.line, s.groundLine)} d={`M -2400 ${GROUND} H 3600`} />
      {children}
    </svg>
  );
}

/* 人物 -------------------------------------------------------------------
   足もとの中央を原点にして描きます。大人と子どもで寸法を持ち替えます。 */

type Rig = {
  hipX: number;
  hipY: number;
  leg: number;
  legW: number;
  footRx: number;
  footRy: number;
  torso: { x: number; y: number; w: number; h: number; r: number };
  headY: number;
  headR: number;
  shoulderX: number;
  shoulderY: number;
  upper: number;
  fore: number;
  armW: number;
  hand: number;
  heartY: number;
  heartSize: number;
};

const ADULT: Rig = {
  hipX: 13,
  hipY: -86,
  leg: 78,
  legW: 18,
  footRx: 14,
  footRy: 9,
  torso: { x: -34, y: -190, w: 68, h: 112, r: 27 },
  headY: -226,
  headR: 40,
  shoulderX: 33,
  shoulderY: -170,
  upper: 46,
  fore: 42,
  armW: 15,
  hand: 9.5,
  heartY: -144,
  heartSize: 1.45,
};

const KID: Rig = {
  hipX: 10,
  hipY: -48,
  leg: 42,
  legW: 15,
  footRx: 12,
  footRy: 8,
  torso: { x: -26, y: -122, w: 52, h: 82, r: 22 },
  headY: -154,
  headR: 36,
  shoulderX: 25,
  shoulderY: -106,
  upper: 28,
  fore: 26,
  armW: 12.5,
  hand: 8.5,
  heartY: -88,
  heartSize: 1.2,
};

const DRESS =
  "M -24 -190 H 24 C 34 -190 39 -182 41 -170 L 51 -86 C 53 -72 46 -64 34 -64 H -34 C -46 -64 -53 -72 -51 -86 L -41 -170 C -39 -182 -34 -190 -24 -190 Z";

const VEIL =
  "M -32 -252 C -80 -228 -90 -150 -80 -70 Q 0 -94 80 -70 C 90 -150 80 -228 32 -252 Z";

export const HEART =
  "M 0 9 C -14 -1 -13 -12 -6.5 -12 C -3 -12 -0.8 -10 0 -7.5 C 0.8 -10 3 -12 6.5 -12 C 13 -12 14 -1 0 9 Z";

type Fx = { className?: string; style?: CSSProperties };
/** 動きを重ねたいときは、外側から順に並べて渡します。 */
type FxList = Fx | Fx[];

/** 中身を、渡された動きの数だけ入れ子の <g> で包みます。 */
function Rigged({ fx, children }: { fx?: FxList; children: ReactNode }) {
  const list = fx ? (Array.isArray(fx) ? fx : [fx]) : [];
  return list.reduceRight<ReactNode>(
    (inner, item) => (
      <g className={item.className} style={item.style}>
        {inner}
      </g>
    ),
    children,
  );
}

export type FigurePart =
  | "body"
  | "head"
  | "armL"
  | "foreL"
  | "armR"
  | "foreR"
  | "legL"
  | "legR"
  | "face"
  | "calm"
  | "happy";

export type FigureFx = Partial<Record<FigurePart, FxList>>;

/** [肩の上げ具合, ひじの曲げ具合]。0 がまっすぐ下、プラスが外向きです。 */
type ArmPose = readonly [raise: number, bend?: number];

export type FigureProps = {
  who: "mother" | "father" | "me";
  /** 子どもの体つきで描きます。 */
  kid?: boolean;
  x: number;
  y?: number;
  scale?: number;
  /** 左右を反転します。 */
  flip?: boolean;
  /** 足先と視線の向き。-1 が左、1 が右、0 が正面。 */
  dir?: -1 | 0 | 1;
  look?: readonly [number, number];
  mood?: "calm" | "happy";
  armL?: ArmPose;
  armR?: ArmPose;
  legL?: number;
  legR?: number;
  /** 部位ごとの動き。calm と happy の両方を渡すと、表情を途中で切り替えられます。 */
  fx?: FigureFx;
  /** 手に持たせるもの。手のひらが原点です。 */
  holdL?: ReactNode;
  holdR?: ReactNode;
  wear?: "veil" | "bow" | "grad";
  /** 淡い色で描きます（仲間やお客様）。 */
  ghost?: boolean;
};

function Leg({
  rig,
  side,
  deg,
  dir,
  fx,
}: {
  rig: Rig;
  side: -1 | 1;
  deg: number;
  dir: -1 | 0 | 1;
  fx?: FxList;
}) {
  const toe = (dir === 0 ? side : dir) * 6;
  const shapes = (className: string) => (
    <>
      <rect
        className={className}
        x={-rig.legW / 2}
        y={-rig.legW / 2}
        width={rig.legW}
        height={rig.leg + rig.legW}
        rx={rig.legW / 2}
      />
      <ellipse
        className={className}
        cx={toe}
        cy={rig.leg + rig.legW / 2 - rig.footRy}
        rx={rig.footRx}
        ry={rig.footRy}
      />
    </>
  );

  return (
    <g transform={`translate(${side * rig.hipX} ${rig.hipY}) rotate(${deg})`}>
      <Rigged fx={fx}>
        {shapes(s.figEdge)}
        {shapes(s.figFill)}
      </Rigged>
    </g>
  );
}

function Arm({
  rig,
  side,
  shoulderX,
  pose,
  fx,
  fxFore,
  hold,
}: {
  rig: Rig;
  side: -1 | 1;
  shoulderX: number;
  pose: ArmPose;
  fx?: FxList;
  fxFore?: FxList;
  hold?: ReactNode;
}) {
  const [raise, bend = 0] = pose;
  /* 左腕は時計回りが外向き、右腕はその逆です。 */
  const turn = -side;

  const layer = (className: string, withHold: boolean) => (
    <Rigged fx={fx}>
      <rect
        className={className}
        x={-rig.armW / 2}
        y={-rig.armW / 2}
        width={rig.armW}
        height={rig.upper + rig.armW}
        rx={rig.armW / 2}
      />
      <g transform={`translate(0 ${rig.upper}) rotate(${turn * bend})`}>
        <Rigged fx={fxFore}>
          <rect
            className={className}
            x={-rig.armW / 2}
            y={-rig.armW / 2}
            width={rig.armW}
            height={rig.fore + rig.armW}
            rx={rig.armW / 2}
          />
          <circle className={className} cy={rig.fore} r={rig.hand} />
          {withHold && hold ? <g transform={`translate(0 ${rig.fore})`}>{hold}</g> : null}
        </Rigged>
      </g>
    </Rigged>
  );

  return (
    <g
      transform={`translate(${side * shoulderX} ${rig.shoulderY}) rotate(${turn * raise})`}
    >
      {layer(s.figEdge, false)}
      {layer(s.figFill, true)}
    </g>
  );
}

function Face({
  who,
  look,
  mood,
  fx,
}: {
  who: FigureProps["who"];
  look: readonly [number, number];
  mood: "calm" | "happy";
  fx: FigureFx;
}) {
  const ex = look[0] * 6;
  const ey = look[1] * 4;
  const glasses = who === "father";
  const both = Boolean(fx.calm || fx.happy);

  return (
    <Rigged fx={fx.face}>
      {glasses ? (
        <g transform={`translate(${ex * 0.5} ${ey * 0.5})`}>
          <circle className={s.faceRing} cx={-15} cy={3} r={12.5} />
          <circle className={s.faceRing} cx={15} cy={3} r={12.5} />
          <path className={s.faceRing} d="M -3 1 Q 0 -2 3 1" />
        </g>
      ) : null}

      {both || mood === "calm" ? (
        <Rigged fx={fx.calm ?? {}}>
          <ellipse
            className={s.face}
            cx={(glasses ? -15 : -14) + ex}
            cy={3 + ey}
            rx={glasses ? 4.2 : 5.2}
            ry={glasses ? 5.8 : 7.6}
          />
          <ellipse
            className={s.face}
            cx={(glasses ? 15 : 14) + ex}
            cy={3 + ey}
            rx={glasses ? 4.2 : 5.2}
            ry={glasses ? 5.8 : 7.6}
          />
          <path
            className={s.faceLine}
            d={`M ${-6 + ex * 0.6} ${21 + ey * 0.5} q 6 5 12 0`}
          />
        </Rigged>
      ) : null}

      {both || mood === "happy" ? (
        <Rigged fx={fx.happy ?? {}}>
          <path className={s.faceLine} d={`M ${-21 + ex} ${7 + ey} q 7 -11 14 0`} />
          <path className={s.faceLine} d={`M ${7 + ex} ${7 + ey} q 7 -11 14 0`} />
          <path className={s.face} d={`M ${-9 + ex * 0.6} 17 q 9 14 18 0 Z`} />
        </Rigged>
      ) : null}
    </Rigged>
  );
}

/** 頭。半径 40 の円を基準に描き、子どもは全体を少し縮めます。 */
function Head({
  who,
  look,
  mood,
  fx,
  wear,
}: {
  who: FigureProps["who"];
  look: readonly [number, number];
  mood: "calm" | "happy";
  fx: FigureFx;
  wear?: FigureProps["wear"];
}) {
  return (
    <>
      {/* 母：あごまでのボブ。 */}
      {who === "mother" ? (
        <path
          className={s.fig}
          d="M -45 -2 A 45 45 0 0 1 45 -2 V 20 A 16 16 0 0 1 29 36 H -29 A 16 16 0 0 1 -45 20 Z"
        />
      ) : null}

      <circle className={s.fig} r={40} />

      {/* 前髪。ふちどりの白い線が、髪の生え際になります。 */}
      {who === "mother" ? (
        <path
          className={s.fig}
          d="M -40 -3 A 40 40 0 0 1 40 -3 C 30 -12 14 -22 0 -25 C -12 -19 -28 -10 -40 -3 Z"
        />
      ) : null}
      {who === "father" ? (
        <path
          className={s.fig}
          d="M -40 -6 A 40 40 0 0 1 40 -6 C 32 -18 18 -18 8 -23 C -6 -27 -26 -21 -40 -6 Z"
        />
      ) : null}
      {who === "me" ? (
        <>
          <path
            className={s.fig}
            d="M -40 -3 A 40 40 0 0 1 40 -3 C 24 -16 -24 -16 -40 -3 Z"
          />
          {wear === "grad" ? null : (
            <path
              className={s.fig}
              d="M -3 -37 C -6 -52 3 -64 18 -62 C 11 -56 8 -47 7 -37 Z"
            />
          )}
        </>
      ) : null}

      <Face who={who} look={look} mood={mood} fx={fx} />

      {/* 母のベレー帽。結婚式では花かざりに替わります。 */}
      {who === "mother" && !wear ? (
        <g transform="translate(-6 -40) rotate(-10)">
          <rect className={s.fig} x={-2.5} y={-20} width={5} height={10} rx={2.5} />
          <ellipse className={s.fig} rx={37} ry={14} />
        </g>
      ) : null}
      {wear === "veil" ? (
        <>
          <circle className={cx(s.paper, s.thin)} cx={-17} cy={-35} r={6} />
          <circle className={cx(s.paper, s.thin)} cx={0} cy={-41} r={7} />
          <circle className={cx(s.paper, s.thin)} cx={17} cy={-35} r={6} />
        </>
      ) : null}

      {/* 角帽。 */}
      {wear === "grad" ? (
        <>
          <path className={s.fig} d="M -31 -31 Q 0 -45 31 -31 V -14 Q 0 -25 -31 -14 Z" />
          <path className={s.fig} d="M -54 -41 L 0 -60 L 54 -41 L 0 -22 Z" />
          <path className={s.whiteLine} d="M 0 -41 L 37 -35 V -13" />
          <circle className={s.face} cx={37} cy={-9} r={4.5} />
        </>
      ) : null}
    </>
  );
}

/**
 * 物語の登場人物。黒い体に白い目の、三人の家族です。
 *
 * 母はベレー帽とワンピース、父はめがねとネクタイ、私は頭の上のひと房と、
 * 胸の白いハートが目印です。
 */
export function Figure({
  who,
  kid = false,
  x,
  y = GROUND,
  scale = 1,
  flip = false,
  dir = 0,
  look,
  mood = "calm",
  armL = [8, 0],
  armR = [8, 0],
  legL = 0,
  legR = 0,
  fx = {},
  holdL,
  holdR,
  wear,
  ghost = false,
}: FigureProps) {
  const rig = kid ? KID : ADULT;
  const dress = who === "mother" && !kid;
  const shoulderX = dress ? rig.shoulderX + 2 : rig.shoulderX;
  const eyes = look ?? ([dir * 0.9, 0] as const);
  const { torso } = rig;

  return (
    <g
      className={ghost ? s.ghost : undefined}
      transform={`translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})`}
    >
      {wear === "veil" ? <path className={s.paper} d={VEIL} /> : null}

      <Leg rig={rig} side={-1} deg={legL} dir={dir} fx={fx.legL} />
      <Leg rig={rig} side={1} deg={legR} dir={dir} fx={fx.legR} />

      <Rigged fx={fx.body}>
        {dress ? (
          <>
            <path className={s.fig} d={DRESS} />
            <path className={s.whiteLine} d="M -14 -181 Q 0 -166 14 -181" />
          </>
        ) : (
          <rect
            className={s.fig}
            x={torso.x}
            y={torso.y}
            width={torso.w}
            height={torso.h}
            rx={torso.r}
          />
        )}

        {who === "father" && wear !== "bow" ? (
          <>
            <path className={s.whiteLine} d="M -13 -183 L 0 -172 L 13 -183" />
            <path className={s.face} d="M -4.5 -172 H 4.5 L 8 -146 L 0 -136 L -8 -146 Z" />
          </>
        ) : null}
        {who === "father" && wear === "bow" ? (
          <path
            className={s.face}
            d="M 0 -172 L -15 -181 V -163 Z M 0 -172 L 15 -181 V -163 Z"
          />
        ) : null}
        {who === "me" ? (
          <path
            className={s.face}
            d={HEART}
            transform={`translate(0 ${rig.heartY}) scale(${rig.heartSize})`}
          />
        ) : null}

        <g transform={`translate(0 ${rig.headY}) scale(${rig.headR / 40})`}>
          <Rigged fx={fx.head}>
            <Head who={who} look={eyes} mood={mood} fx={fx} wear={wear} />
          </Rigged>
        </g>

        <Arm
          rig={rig}
          side={-1}
          shoulderX={shoulderX}
          pose={armL}
          fx={fx.armL}
          fxFore={fx.foreL}
          hold={holdL}
        />
        <Arm
          rig={rig}
          side={1}
          shoulderX={shoulderX}
          pose={armR}
          fx={fx.armR}
          fxFore={fx.foreR}
          hold={holdR}
        />
      </Rigged>
    </g>
  );
}

/** 歩く区間。[歩き始め, 歩き終わり, 歩数] */
type Walk = readonly [a: number, b: number, n: number];

/**
 * 歩くときの脚と体の動き。区間をいくつ渡しても構いません。
 * 腕にものを持たせる場合は、arms を false にして腕を振らせません。
 */
export function steps(walks: readonly Walk[], arms = true): FigureFx {
  const each = (className: string) =>
    walks.map(([a, b, n]) => ({ className, style: span(a, b, { n }) }));

  return {
    legL: each(s.stepA),
    legR: each(s.stepB),
    body: each(s.bob),
    ...(arms ? { armL: each(s.swingB), armR: each(s.swingA) } : {}),
  };
}

/** 落ち着いた顔から、うれしい顔へ。at の位置で、ぱっと切り替えます。 */
export function cheer(at: number): FigureFx {
  return {
    calm: { className: s.out, style: span(at, at + 0.012) },
    happy: { className: s.fade, style: span(at, at + 0.012) },
  };
}

/** 部位にかける動きを、ひとつ作ります。 */
export function fx(
  k: "lift" | "turn" | "wave" | "shift" | "bob",
  a: number,
  b: number,
  vars: MotionVars = {},
): Fx {
  return { className: s[k], style: span(a, b, vars) };
}

/* 小道具 ----------------------------------------------------------------- */

/** 名札。(x, y) が、下向きの矢印の先です。 */
export function Tag({
  x,
  y,
  w,
  label,
  size = 20,
  latin = false,
}: {
  x: number;
  y: number;
  w: number;
  label: string;
  size?: number;
  /** 欧文だけの札は、見出しの書体で組みます。 */
  latin?: boolean;
}) {
  const h = size + 18;
  return (
    <g transform={`translate(${x} ${y})`}>
      <path className={s.ink} d="M -8 -11 L 0 0 L 8 -11 Z" />
      <rect className={s.ink} x={-w / 2} y={-h - 9} width={w} height={h} rx={h / 2} />
      <text className={cx(s.text, latin && s.sign, s.onInk)} y={-h / 2 - 8.5} fontSize={size}>
        {label}
      </text>
    </g>
  );
}

export function Heart({
  x = 0,
  y = 0,
  size = 1,
  className = s.ink,
}: {
  x?: number;
  y?: number;
  size?: number;
  className?: string;
}) {
  return (
    <path className={className} d={HEART} transform={`translate(${x} ${y}) scale(${size})`} />
  );
}

/** きらめき。四つの角を持つ星です。 */
export function Sparkle({
  x,
  y,
  size = 1,
  className = s.ink,
}: {
  x: number;
  y: number;
  size?: number;
  className?: string;
}) {
  return (
    <path
      className={className}
      d="M 0 -12 Q 1.6 -1.6 12 0 Q 1.6 1.6 0 12 Q -1.6 1.6 -12 0 Q -1.6 -1.6 0 -12 Z"
      transform={`translate(${x} ${y}) scale(${size})`}
    />
  );
}

export function Cloud({ x, y, size = 1 }: { x: number; y: number; size?: number }) {
  return (
    <path
      className={cx(s.paper, s.thin)}
      d="M -40 16 a 16 16 0 0 1 0 -32 a 22 22 0 0 1 40 -10 a 18 18 0 0 1 30 14 a 14 14 0 0 1 0 28 Z"
      transform={`translate(${x} ${y}) scale(${size})`}
    />
  );
}

export function Tree({ x, y = GROUND, size = 1 }: { x: number; y?: number; size?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${size})`}>
      <path className={s.line} d="M 0 0 V -58 M 0 -30 L 16 -48" />
      <path
        className={s.paper}
        d="M -26 -58 a 24 24 0 0 1 -6 -44 a 28 28 0 0 1 44 -22 a 26 26 0 0 1 22 44 a 20 20 0 0 1 -12 22 Z"
      />
      <path className={cx(s.line, s.thin, s.soft)} d="M 10 -72 q 12 -4 14 -18" />
    </g>
  );
}

/** アプリの窓。左上が原点で、タイトルバーの高さは 34 です。 */
export function AppWindow({
  x,
  y,
  w,
  h,
  title,
  dark = false,
  children,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  title?: string;
  dark?: boolean;
  children?: ReactNode;
}) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect className={dark ? cx(s.line, s.ink) : s.paper} width={w} height={h} rx={14} />
      <path className={dark ? cx(s.whiteLine, s.hair) : cx(s.line, s.thin)} d={`M 0 34 H ${w}`} />
      {[18, 34, 50].map((dot) => (
        <circle key={dot} className={dark ? s.white : s.ink} cx={dot} cy={17} r={4.5} />
      ))}
      {title ? (
        <text
          className={cx(s.text, s.code, dark && s.onInk)}
          x={w / 2}
          y={17.5}
          fontSize={14}
        >
          {title}
        </text>
      ) : null}
      {children}
    </g>
  );
}

/** 歯車の輪郭。 */
export function gearPath(x: number, y: number, outer: number, inner: number, teeth = 8) {
  const points: string[] = [];
  const count = teeth * 4;
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * (i - 0.5)) / count;
    const radius = i % 4 < 2 ? outer : inner;
    points.push(
      `${(x + Math.cos(angle) * radius).toFixed(1)} ${(y + Math.sin(angle) * radius).toFixed(1)}`,
    );
  }
  return `M ${points.join(" L ")} Z`;
}

/** 五つの角を持つ星の輪郭。 */
export function starPath(x: number, y: number, outer: number, inner = outer * 0.46) {
  const points: string[] = [];
  for (let i = 0; i < 10; i++) {
    const angle = (Math.PI * i) / 5 - Math.PI / 2;
    const radius = i % 2 === 0 ? outer : inner;
    points.push(
      `${(x + Math.cos(angle) * radius).toFixed(1)} ${(y + Math.sin(angle) * radius).toFixed(1)}`,
    );
  }
  return `M ${points.join(" L ")} Z`;
}

/** 飛行機。右向きで、機体の中央が原点です。 */
export function Plane() {
  return (
    <>
      <path className={s.fig} d="M -44 -5 L -60 -32 H -43 L -24 -12 Z" />
      <path
        className={s.fig}
        d="M -48 0 C -48 -10 -32 -13 -12 -13 H 26 C 42 -13 52 -6 54 0 C 52 6 42 12 26 12 H -32 C -42 12 -48 6 -48 0 Z"
      />
      <path className={s.fig} d="M -2 3 L -26 34 H -9 L 20 5 Z" />
      <circle className={s.face} cx={6} cy={-4} r={3} />
      <circle className={s.face} cx={18} cy={-4} r={3} />
      <circle className={s.face} cx={30} cy={-4} r={3} />
    </>
  );
}

/** 山と太陽の小さな絵。画像の代わりに置く記号です。 */
export function Picture({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return (
    <>
      <rect className={cx(s.tone, s.line, s.thin)} x={x} y={y} width={w} height={h} rx={8} />
      <path
        className={cx(s.line, s.thin)}
        d={`M ${x + w * 0.1} ${y + h * 0.84} L ${x + w * 0.38} ${y + h * 0.42} L ${x + w * 0.56} ${y + h * 0.66} L ${x + w * 0.7} ${y + h * 0.5} L ${x + w * 0.9} ${y + h * 0.84}`}
      />
      <circle className={cx(s.paper, s.thin)} cx={x + w * 0.74} cy={y + h * 0.26} r={Math.min(w, h) * 0.09} />
    </>
  );
}

/**
 * 紙ふぶきの位置。場面ごとに毎回同じ並びになるよう、乱数ではなく
 * 決まった数列から作っています。
 */
export function scatter(count: number, x: number, y: number, w: number, h: number) {
  return Array.from({ length: count }, (_, i) => {
    const u = (i * 0.618034 + 0.13) % 1;
    const v = (i * 0.414214 + 0.37) % 1;
    return { x: Math.round(x + u * w), y: Math.round(y + v * h), turn: Math.round(u * 300) };
  });
}
