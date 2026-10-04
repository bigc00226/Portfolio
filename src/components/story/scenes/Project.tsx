import { story } from "@/data/story";

import s from "./Scene.module.css";
import { Draw, Figure, Heart, M, Scene, cheer, cx, fx, gearPath, steps } from "./kit";

const { labels } = story;

/** 奥の壁ぎわ。仲間たちとボードは、この線の上に立っています。 */
const BACK = 612;

/** 母の手もとからボードへ飛んでいく、画面の部品。 */
const DESIGN_FROM = { x: 480, y: 440 };
/** 父の手もとからボードへ飛んでいく、仕組みの部品。 */
const SYSTEM_FROM = { x: 720, y: 440 };

function Colleagues({ x }: { x: number }) {
  return (
    <>
      <Figure who="me" ghost x={x + 50} y={BACK} scale={0.72} armL={[10, -60]} armR={[10, -60]} />
      <Figure who="father" ghost x={x + 140} y={BACK} scale={0.72} armL={[10, -60]} armR={[10, -60]} />
      <rect className={s.paper} x={x} y={552} width={190} height={60} rx={4} />
      <rect className={cx(s.paper, s.thin)} x={x + 28} y={522} width={44} height={30} rx={4} />
      <rect className={cx(s.paper, s.thin)} x={x + 118} y={522} width={44} height={30} rx={4} />
    </>
  );
}

/** 第2章：大きなプロジェクト。デザインと仕組みが組み合わさり、二人の距離も近づいていく。 */
export function Project() {
  return (
    <Scene>
      <path className={cx(s.line, s.thin, s.soft)} d={`M -2400 ${BACK} H 3600`} />

      {/* プロジェクトのボード */}
      <M k="in" a={0} b={0.1} dy={36}>
        <path className={s.line} d={`M 470 368 V ${BACK} M 730 368 V ${BACK} M 448 ${BACK} H 492 M 708 ${BACK} H 752`} />
        <rect className={s.paper} x={410} y={110} width={380} height={258} rx={12} />
        <path className={cx(s.line, s.thin)} d="M 410 160 H 790" />
        <text className={cx(s.text, s.sign, s.start)} x={430} y={136} fontSize={20}>
          {labels.project}
        </text>
        <rect className={cx(s.paper, s.thin)} x={600} y={129} width={170} height={14} rx={7} />
        <text className={cx(s.text, s.code, s.start, s.mute)} x={430} y={177} fontSize={11}>
          {labels.design}
        </text>
        <text className={cx(s.text, s.code, s.start, s.mute)} x={612} y={177} fontSize={11}>
          {labels.system}
        </text>
        <path className={cx(s.line, s.hair, s.soft, s.dashed)} d="M 600 172 V 356" />
      </M>

      {/* 進み具合。前半は二人それぞれの仕事で、後半は力を合わせて伸びます。 */}
      <M k="growX" a={0.32} b={0.62}>
        <rect className={s.ink} x={602} y={131} width={100} height={10} rx={5} />
      </M>
      <M k="growX" a={0.66} b={0.86}>
        <rect className={s.ink} x={696} y={131} width={72} height={10} rx={5} />
      </M>

      <M k="in" a={0.02} b={0.14} dx={-50}>
        <Colleagues x={205} />
      </M>
      <M k="in" a={0.05} b={0.17} dx={50}>
        <Colleagues x={805} />
      </M>

      {/* 母のデザイン：画面の部品が、ひとつずつボードに収まっていきます。 */}
      {[
        <rect key="nav" className={s.ink} x={438} y={188} width={140} height={14} rx={4} />,
        <g key="image">
          <rect className={cx(s.tone, s.line, s.thin)} x={438} y={210} width={62} height={52} rx={5} />
          <path className={cx(s.line, s.thin)} d="M 444 254 L 462 232 L 474 246 L 482 238 L 494 254" />
        </g>,
        <path key="copy" className={cx(s.line, s.thin)} d="M 512 218 H 578 M 512 234 H 578 M 512 250 H 556" />,
        <rect key="button" className={s.ink} x={438} y={274} width={72} height={22} rx={11} />,
        <g key="cards">
          <rect className={cx(s.paper, s.thin)} x={438} y={308} width={64} height={38} rx={5} />
          <rect className={cx(s.paper, s.thin)} x={514} y={308} width={64} height={38} rx={5} />
        </g>,
      ].map((piece, index) => {
        const slot = [
          { x: 508, y: 195 },
          { x: 469, y: 236 },
          { x: 545, y: 234 },
          { x: 474, y: 285 },
          { x: 508, y: 327 },
        ][index];
        return (
          <M
            key={index}
            k="in"
            a={0.32 + index * 0.045}
            b={0.41 + index * 0.045}
            dx={DESIGN_FROM.x - slot.x}
            dy={DESIGN_FROM.y - slot.y}
          >
            {piece}
          </M>
        );
      })}

      {/* 父の仕組み：データベース、サーバー、API、歯車。 */}
      <M k="in" a={0.4} b={0.49} dx={SYSTEM_FROM.x - 644} dy={SYSTEM_FROM.y - 222}>
        <path className={cx(s.paper, s.thin)} d="M 622 204 v 36 a 22 8 0 0 0 44 0 v -36" />
        <ellipse className={cx(s.paper, s.thin)} cx={644} cy={204} rx={22} ry={8} />
        <path className={cx(s.line, s.hair)} d="M 622 222 a 22 8 0 0 0 44 0" />
      </M>
      <M k="in" a={0.45} b={0.54} dx={SYSTEM_FROM.x - 738} dy={SYSTEM_FROM.y - 218}>
        <rect className={cx(s.paper, s.thin)} x={706} y={194} width={64} height={48} rx={6} />
        <path className={cx(s.line, s.hair)} d="M 706 210 H 770 M 706 226 H 770" />
        <circle className={s.ink} cx={716} cy={202} r={2.5} />
        <circle className={s.ink} cx={716} cy={218} r={2.5} />
        <circle className={s.ink} cx={716} cy={234} r={2.5} />
      </M>
      <M k="in" a={0.5} b={0.59} dx={SYSTEM_FROM.x - 738} dy={SYSTEM_FROM.y - 316}>
        <rect className={s.ink} x={708} y={300} width={60} height={32} rx={8} />
        <text className={cx(s.text, s.code, s.onInk)} x={738} y={316.5} fontSize={15}>
          API
        </text>
      </M>
      <M k="in" a={0.55} b={0.64} dx={SYSTEM_FROM.x - 644} dy={SYSTEM_FROM.y - 316}>
        <M k="spin" a={0.55} b={0.98} n={2}>
          <path className={cx(s.paper, s.thin)} d={gearPath(644, 318, 27, 20)} />
          <circle className={cx(s.paper, s.thin)} cx={644} cy={318} r={9} />
        </M>
      </M>
      <Draw a={0.58} b={0.66} className={s.thin} d="M 666 222 H 704 M 738 244 V 298 M 706 316 H 672 M 644 246 V 288" />

      {/* デザインと仕組みが、つながる。 */}
      <Draw a={0.64} b={0.72} className={s.thin} d="M 580 240 H 618 M 610 232 L 620 240 L 610 248" />
      <Draw a={0.68} b={0.76} className={s.thin} d="M 706 316 H 590 M 598 308 L 588 316 L 598 324" />

      <M k="pop" a={0.86} b={0.93}>
        <circle className={s.ink} cx={770} cy={110} r={22} />
        <path className={s.whiteLine} d="M 760 110 L 767 118 L 781 102" />
      </M>

      {/* 二人のあいだのハート。協力が深まるほど、大きくなります。 */}
      <g transform="translate(600 452)">
        <M k="pop" a={0.68} b={0.94}>
          <M k="pulse" a={0.7} b={1} n={5} ds={1.14}>
            <Heart size={3} />
          </M>
        </M>
      </g>
      <M k="pop" a={0.88} b={0.95}>
        <Heart x={548} y={398} size={1.1} />
      </M>
      <M k="pop" a={0.92} b={0.99}>
        <Heart x={656} y={388} size={0.8} />
      </M>

      {/* 母：はじめは離れた場所で働き、やがて父のほうへ。 */}
      <M k="walk" a={0.66} b={0.86} dx={-120}>
        <M k="walk" a={0.03} b={0.2} dx={-240}>
          <Figure
            who="mother"
            x={520}
            dir={1}
            fx={{
              ...steps(
                [
                  [0.03, 0.2, 5],
                  [0.66, 0.86, 3],
                ],
                false,
              ),
              ...cheer(0.86),
              armR: fx("lift", 0.3, 0.62, { dr: -112 }),
            }}
          />
        </M>
      </M>

      {/* 父 */}
      <M k="walk" a={0.66} b={0.86} dx={120}>
        <M k="walk" a={0.03} b={0.2} dx={240}>
          <Figure
            who="father"
            x={680}
            dir={-1}
            fx={{
              ...steps(
                [
                  [0.03, 0.2, 5],
                  [0.66, 0.86, 3],
                ],
                false,
              ),
              ...cheer(0.86),
              armL: fx("lift", 0.38, 0.66, { dr: 112 }),
            }}
          />
        </M>
      </M>
    </Scene>
  );
}
