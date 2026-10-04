import { story } from "@/data/story";

import s from "./Scene.module.css";
import { AppWindow, Draw, Figure, Heart, M, Scene, Sparkle, Tag, cheer, cx, fx } from "./kit";

const { labels } = story;

/** 遠くの街なみ。[左端, 幅, 高さ] */
const SKYLINE = [
  [-300, 120, 300],
  [-160, 90, 210],
  [-50, 110, 350],
  [80, 80, 250],
  [176, 70, 150],
  [262, 86, 196],
  [856, 66, 140],
  [938, 80, 186],
  [1040, 96, 290],
  [1150, 110, 370],
  [1276, 84, 240],
  [1376, 120, 320],
];

const BARS = [24, 36, 30, 48, 42, 62];

const LAYER_1 = [262, 316, 370].map((y) => ({ x: 796, y }));
const LAYER_2 = [246, 294, 342, 390].map((y) => ({ x: 870, y }));
const LAYER_3 = [290, 346].map((y) => ({ x: 944, y }));

const links = (from: { x: number; y: number }[], to: { x: number; y: number }[]) =>
  from.flatMap((a) => to.map((b) => `M ${a.x} ${a.y} L ${b.x} ${b.y}`)).join(" ");

/** 第10章：開発会社で、システム、モバイルアプリ、AI へと技術の幅を広げる。 */
export function Career() {
  return (
    <Scene>
      <M k="in" a={0} b={0.1} dy={40}>
        {SKYLINE.map(([x, w, h]) => (
          <rect key={x} className={s.tone} x={x} y={658 - h} width={w} height={h} />
        ))}
      </M>

      {/* システム */}
      <M k="pop" a={0.06} b={0.14}>
        <AppWindow x={212} y={186} w={236} h={230} />
      </M>
      <M k="pop" a={0.1} b={0.16}>
        <Tag x={330} y={182} w={124} label={labels.career[0]} size={16} latin />
      </M>
      {[0, 1, 2].map((unit) => (
        <M key={unit} k="in" a={0.14 + unit * 0.03} b={0.2 + unit * 0.03} dx={-24}>
          <rect className={cx(s.paper, s.thin)} x={234} y={236 + unit * 30} width={84} height={24} rx={4} />
          <circle className={s.ink} cx={246} cy={248 + unit * 30} r={3} />
          <path className={cx(s.line, s.hair)} d={`M 260 ${248 + unit * 30} H 306`} />
        </M>
      ))}
      <M k="pop" a={0.2} b={0.27}>
        <path className={cx(s.paper, s.thin)} d="M 350 250 v 44 a 28 9 0 0 0 56 0 v -44" />
        <ellipse className={cx(s.paper, s.thin)} cx={378} cy={250} rx={28} ry={9} />
        <path className={cx(s.line, s.hair)} d="M 350 272 a 28 9 0 0 0 56 0" />
      </M>
      <Draw a={0.25} b={0.29} className={s.thin} d="M 318 278 H 348" />
      <Draw a={0.25} b={0.29} className={s.thin} d="M 232 396 H 428" />
      {BARS.map((height, index) => (
        <M key={index} k="grow" a={0.27 + index * 0.014} b={0.33 + index * 0.014}>
          <rect className={s.ink} x={238 + index * 32} y={394 - height} width={22} height={height} rx={3} />
        </M>
      ))}

      {/* モバイルアプリ */}
      <M k="pop" a={0.38} b={0.46}>
        <rect className={s.paper} x={540} y={116} width={120} height={236} rx={22} />
        <rect className={s.ink} x={580} y={126} width={40} height={8} rx={4} />
      </M>
      <M k="pop" a={0.42} b={0.48}>
        <Tag x={600} y={112} w={176} label={labels.career[1]} size={16} latin />
      </M>
      <M k="in" a={0.44} b={0.5} dy={-12}>
        <rect className={s.ink} x={552} y={146} width={96} height={18} rx={6} />
      </M>
      {[0, 1, 2].map((card) => (
        <M key={card} k="in" a={0.47 + card * 0.04} b={0.54 + card * 0.04} dy={22}>
          <rect className={cx(s.paper, s.thin)} x={552} y={174 + card * 50} width={96} height={40} rx={8} />
          <circle className={s.tone} cx={568} cy={194 + card * 50} r={8} />
          <path
            className={cx(s.line, s.hair)}
            d={`M 584 ${188 + card * 50} H 636 M 584 ${200 + card * 50} H 620`}
          />
        </M>
      ))}
      <M k="pop" a={0.6} b={0.66}>
        <M k="pulse" a={0.66} b={0.9} n={3} ds={1.2}>
          <circle className={s.ink} cx={656} cy={124} r={15} />
          <text className={cx(s.text, s.code, s.onInk)} x={656} y={124.5} fontSize={16}>
            1
          </text>
        </M>
      </M>

      {/* AI */}
      <M k="pop" a={0.66} b={0.74}>
        <AppWindow x={752} y={186} w={236} h={230} />
      </M>
      <M k="pop" a={0.7} b={0.76}>
        <Tag x={870} y={182} w={64} label={labels.career[2]} size={16} latin />
      </M>
      <Draw a={0.78} b={0.86} className={cx(s.hair, s.soft)} d={links(LAYER_1, LAYER_2)} />
      <Draw a={0.83} b={0.9} className={cx(s.hair, s.soft)} d={links(LAYER_2, LAYER_3)} />
      {[LAYER_1, LAYER_2, LAYER_3].map((layer, depth) =>
        layer.map((node) => (
          <g key={`${node.x}-${node.y}`}>
            <M k="pop" a={0.72 + depth * 0.02} b={0.78 + depth * 0.02}>
              <circle className={cx(s.paper, s.thin)} cx={node.x} cy={node.y} r={11} />
            </M>
            <M k="pop" a={0.86 + depth * 0.03} b={0.91 + depth * 0.03}>
              <circle className={s.ink} cx={node.x} cy={node.y} r={6} />
            </M>
          </g>
        )),
      )}
      <M k="pop" a={0.92} b={0.98}>
        <Sparkle x={980} y={170} size={1.3} />
        <Sparkle x={206} y={170} size={1} />
      </M>

      {/* 机のノートパソコンから、それぞれの仕事へ。 */}
      <Draw a={0.1} b={0.18} className={cx(s.thin, s.soft)} d="M 560 552 C 524 544 478 500 452 424" />
      <Draw a={0.68} b={0.76} className={cx(s.thin, s.soft)} d="M 640 552 C 676 544 722 500 748 424" />

      {/* 私 */}
      <M k="in" a={0} b={0.08} dy={30}>
        <Figure
          who="me"
          x={600}
          armL={[14, -70]}
          armR={[150, 15]}
          fx={{
            ...cheer(0.93),
            face: [
              fx("shift", 0.08, 0.37, { dx: -7 }),
              fx("shift", 0.4, 0.65, { dy: -5 }),
              fx("shift", 0.68, 0.92, { dx: 7 }),
            ],
            armR: fx("turn", 0.92, 0.97, { dr: 136 }),
            foreR: fx("turn", 0.92, 0.97, { dr: 85 }),
          }}
        />
        <rect className={s.paper} x={510} y={574} width={180} height={86} rx={4} />
        <rect className={s.paper} x={562} y={528} width={76} height={48} rx={7} />
        <Heart x={600} y={553} size={0.9} />
      </M>
    </Scene>
  );
}
