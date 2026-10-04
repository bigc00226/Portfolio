import { story } from "@/data/story";

import s from "./Scene.module.css";
import { Draw, Figure, Heart, M, Scene, Sparkle, cx, fx, steps } from "./kit";

const { labels } = story;

/** 大きなハート。中心が原点です。 */
const BIG_HEART =
  "M 0 117 C -182 -13 -169 -156 -84.5 -156 C -39 -156 -10.4 -130 0 -97.5 C 10.4 -130 39 -156 84.5 -156 C 169 -156 182 -13 0 117 Z";

/** できることの札。[x, y, 幅] */
const SERVICES: [x: number, y: number, w: number][] = [
  [286, 252, 122],
  [430, 172, 128],
  [600, 136, 168],
  [770, 172, 100],
  [914, 252, 72],
];

function Bubble({ x, y, w, tail, label }: { x: number; y: number; w: number; tail: number; label: string }) {
  return (
    <>
      <path
        className={s.paper}
        d={`M ${x - w / 2 + 26} ${y - 26} H ${x + w / 2 - 26} a 26 26 0 0 1 0 52 H ${tail + 14} L ${tail} ${y + 46} L ${tail - 12} ${y + 26} H ${x - w / 2 + 26} a 26 26 0 0 1 0 -52 Z`}
      />
      <text className={s.text} x={x} y={y + 1} fontSize={21}>
        {label}
      </text>
    </>
  );
}

/** 第12章：愛されるエンジニアへ。できることが増え、「ありがとう」が集まってくる。 */
export function Loved() {
  return (
    <Scene>
      {/* 大きなハート */}
      <g transform="translate(600 392)">
        <M k="fade" a={0.5} b={0.6}>
          <path className={s.tone} d={BIG_HEART} />
        </M>
        <Draw a={0.3} b={0.56} d={BIG_HEART} />
      </g>

      {/* できること */}
      {SERVICES.map(([x, y, w], index) => (
        <g key={x}>
          <Draw
            a={0.08 + index * 0.08}
            b={0.14 + index * 0.08}
            className={cx(s.thin, s.soft)}
            d={`M ${x} ${y + 22} L ${Math.round(x + (600 - x) * 0.34)} ${Math.round(y + 22 + (370 - y) * 0.34)}`}
          />
          <M k="pop" a={0.05 + index * 0.08} b={0.13 + index * 0.08}>
            <rect className={s.ink} x={x - w / 2} y={y - 21} width={w} height={42} rx={21} />
            <text className={cx(s.text, s.onInk)} x={x} y={y + 1} fontSize={20}>
              {labels.services[index]}
            </text>
          </M>
        </g>
      ))}

      {/* お客様 */}
      <M k="fade" a={0.57} b={0.62}>
        <M k="walk" a={0.58} b={0.74} dx={-230}>
          <Figure
            who="mother"
            ghost
            x={338}
            scale={0.86}
            dir={1}
            mood="happy"
            armR={[132, 20]}
            fx={steps([[0.58, 0.74, 5]], false)}
          />
        </M>
      </M>
      <M k="fade" a={0.61} b={0.66}>
        <M k="walk" a={0.62} b={0.78} dx={230}>
          <Figure
            who="father"
            ghost
            x={862}
            scale={0.86}
            dir={-1}
            mood="happy"
            armL={[132, 20]}
            fx={steps([[0.62, 0.78, 5]], false)}
          />
        </M>
      </M>
      <M k="pop" a={0.74} b={0.82}>
        <Bubble x={322} y={380} w={200} tail={338} label={labels.thanks[0]} />
      </M>
      <M k="pop" a={0.8} b={0.88}>
        <Bubble x={856} y={380} w={238} tail={862} label={labels.thanks[1]} />
      </M>

      <M k="pop" a={0.84} b={0.91}>
        <Heart x={436} y={520} size={1} />
      </M>
      <M k="pop" a={0.87} b={0.94}>
        <Heart x={480} y={470} size={1.3} />
      </M>
      <M k="pop" a={0.89} b={0.96}>
        <Heart x={722} y={470} size={1.3} />
      </M>
      <M k="pop" a={0.92} b={0.99}>
        <Heart x={766} y={520} size={1} />
      </M>
      <M k="pop" a={0.6} b={0.68}>
        <Sparkle x={196} y={470} size={1} />
        <Sparkle x={1004} y={476} size={1.2} />
      </M>

      {/* 私 */}
      <M k="in" a={0} b={0.08} dy={30}>
        <Figure
          who="me"
          x={600}
          mood="happy"
          armL={[26, 0]}
          armR={[150, 16]}
          fx={{ foreR: fx("wave", 0.84, 1, { dr: -28, n: 3 }) }}
        />
      </M>
    </Scene>
  );
}
