import { story } from "@/data/story";

import s from "./Scene.module.css";
import { Cloud, Figure, M, Plane, Scene, cx, fx, scatter, span } from "./kit";

const { labels } = story;

/** 飛行機が通ったあとに残る点。[x, y, 航路のどこか（0〜1）] */
const TRAIL: [x: number, y: number, at: number][] = [
  [482, 604, 0.07],
  [532, 558, 0.2],
  [554, 520, 0.26],
  [576, 483, 0.32],
  [621, 414, 0.43],
  [645, 383, 0.48],
  [669, 351, 0.52],
  [693, 319, 0.57],
  [742, 266, 0.68],
  [769, 243, 0.73],
  [796, 220, 0.79],
  [851, 188, 0.92],
];

/** 飛行機が飛んでいる区間。 */
const TAKEOFF = 0.13;
const LANDING = 0.52;

const WAVES = `M 476 660 q 11 -12 22 0${" t 22 0".repeat(9)}`;
const CONFETTI = scatter(12, 640, 236, 300, 150);

/** 卒業証書。上げた手に持つので、腕の向きに沿わせています。 */
const diploma = (
  <>
    <rect className={cx(s.paper, s.thin)} x={-8} y={-10} width={16} height={52} rx={6} />
    <path className={s.line} d="M -8 16 H 8" />
  </>
);

/** 第9章：飛行機で海を越え、現地の大学を卒業する。 */
export function Abroad() {
  return (
    <Scene>
      <M k="in" a={0} b={0.2} dx={-70}>
        <Cloud x={330} y={150} size={1.1} />
        <Cloud x={-140} y={230} size={1.5} />
      </M>
      <M k="in" a={0.04} b={0.24} dx={70}>
        <Cloud x={1050} y={300} />
        <Cloud x={1400} y={170} size={1.6} />
      </M>

      {/* 海 */}
      <rect className={s.white} x={474} y={646} width={224} height={30} />
      <path className={s.line} d={WAVES} />
      <path
        className={cx(s.line, s.thin, s.soft)}
        d="M 506 692 q 9 -9 18 0 t 18 0 M 578 706 q 9 -9 18 0 t 18 0 M 640 690 q 9 -9 18 0 t 18 0"
      />

      {/* ふるさと */}
      <path className={s.paper} d="M 128 660 L 212 510 Q 226 496 240 510 L 324 660 Z" />
      <path className={cx(s.line, s.thin)} d="M 192 546 l 13 11 l 11 -11 l 10 9 l 11 -9 l 11 11 l 12 -11" />

      {/* 見送る母と父 */}
      <Figure
        who="mother"
        x={318}
        scale={0.6}
        dir={1}
        armR={[150, 18]}
        fx={{ foreR: fx("wave", 0.03, 0.5, { dr: -26, n: 7 }) }}
      />
      <Figure
        who="father"
        x={366}
        scale={0.6}
        dir={1}
        armR={[150, 18]}
        fx={{ foreR: fx("wave", 0.05, 0.52, { dr: -26, n: 7 }) }}
      />

      {/* 旅立つ私。手を振ってから、飛行機に乗りこみます。 */}
      <M k="out" a={0.085} b={0.11}>
        <Figure
          who="me"
          x={426}
          scale={0.6}
          dir={-1}
          armL={[150, 18]}
          fx={{ foreL: fx("wave", 0, 0.085, { dr: 26, n: 2 }) }}
        />
      </M>

      {/* 大学 */}
      <M k="in" a={0} b={0.1} dy={30}>
        <path className={s.line} d="M 900 326 V 280" />
        <path className={s.ink} d="M 902 282 h 36 l -9 9 l 9 9 h -36 Z" />
        <path className={s.paper} d="M 790 400 L 900 326 L 1010 400 Z" />
        <circle className={cx(s.paper, s.thin)} cx={900} cy={372} r={11} />
        <rect className={s.paper} x={800} y={400} width={200} height={28} />
        <text className={cx(s.text, s.sign)} x={901} y={414.5} fontSize={13}>
          {labels.university}
        </text>
        {[822, 874, 926, 978].map((x) => (
          <rect key={x} className={s.paper} x={x - 10} y={428} width={20} height={194} />
        ))}
        <rect className={s.paper} x={796} y={622} width={208} height={18} />
        <rect className={s.paper} x={788} y={640} width={224} height={20} />
      </M>

      {/* 航路 */}
      {TRAIL.map(([x, y, at]) => {
        const passed = TAKEOFF + at * (LANDING - TAKEOFF) + 0.015;
        return (
          <M key={`${x}-${y}`} k="fade" a={passed} b={passed + 0.02}>
            <circle className={s.ink} cx={x} cy={y} r={4} />
          </M>
        );
      })}

      {/* 飛行機 */}
      <M k="fade" a={0.11} b={0.13}>
        {/* 機体の中心を原点にして、そこを軸に傾けます。 */}
        <g transform="translate(880 178)">
          <g className={s.flight} style={span(TAKEOFF, LANDING)}>
            <g transform="scale(1.15)">
              <Plane />
            </g>
          </g>
        </g>
      </M>

      {/* 卒業 */}
      <M k="pop" a={0.6} b={0.68}>
        <Figure who="father" ghost wear="grad" x={862} scale={0.7} mood="happy" armL={[146, 16]} />
      </M>
      <M k="pop" a={0.64} b={0.72}>
        <Figure who="me" ghost wear="grad" x={940} scale={0.7} mood="happy" armR={[146, 16]} />
      </M>
      <M k="pop" a={0.56} b={0.64}>
        <M k="hop" a={0.74} b={0.96} n={2} dy={-30}>
          <Figure
            who="me"
            wear="grad"
            x={752}
            mood="happy"
            armL={[18, 0]}
            armR={[152, 12]}
            holdR={diploma}
          />
        </M>
      </M>
      {CONFETTI.map((piece, index) => (
        <M key={index} k="pop" a={0.7 + (index % 6) * 0.03} b={0.78 + (index % 6) * 0.03}>
          <g transform={`translate(${piece.x} ${piece.y}) rotate(${piece.turn})`}>
            {index % 2 === 0 ? (
              <rect className={s.ink} x={-6} y={-3} width={12} height={6} rx={1.5} />
            ) : (
              <circle className={cx(s.paper, s.thin)} r={5} />
            )}
          </g>
        </M>
      ))}
    </Scene>
  );
}
