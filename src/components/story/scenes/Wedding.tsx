import s from "./Scene.module.css";
import { Figure, Heart, M, Scene, cheer, cx, fx, scatter, steps } from "./kit";

/** アーチに沿って並べる花の位置。 */
const GARLAND = Array.from({ length: 11 }, (_, i) => {
  const angle = (Math.PI * (188 + i * 16.4)) / 180;
  return { x: 600 + Math.cos(angle) * 140, y: 340 + Math.sin(angle) * 140 };
});

const CONFETTI = scatter(18, 290, 130, 620, 420);

function Flower({ x, y, r = 11 }: { x: number; y: number; r?: number }) {
  return (
    <>
      <circle className={cx(s.paper, s.thin)} cx={x} cy={y} r={r} />
      <circle className={s.ink} cx={x} cy={y} r={r * 0.32} />
    </>
  );
}

function Bell({ x }: { x: number }) {
  return (
    <g transform={`translate(${x} 238)`}>
      <path className={cx(s.line, s.thin)} d="M 0 -28 V 0" />
      <path className={s.paper} d="M -16 30 q 2 -30 16 -30 q 14 0 16 30 l 6 8 h -44 z" />
      <circle className={s.ink} cy={43} r={5} />
    </g>
  );
}

/** 花束。腕を横に曲げて持つので、手のひらに対して 90 度起こしています。 */
const bouquet = (
  <g transform="rotate(90)">
    <path className={cx(s.line, s.thin)} d="M -5 4 L 0 24 L 5 4 M -9 16 H 9" />
    <circle className={cx(s.paper, s.thin)} cx={-11} cy={-6} r={9} />
    <circle className={cx(s.paper, s.thin)} cx={11} cy={-6} r={9} />
    <circle className={cx(s.paper, s.thin)} cx={0} cy={-17} r={10} />
    <circle className={s.ink} cx={0} cy={-6} r={4} />
  </g>
);

/** 第3章：結婚式。花のアーチの下で、二人が手を取り合う。 */
export function Wedding() {
  return (
    <Scene>
      {/* 参列する仲間たち */}
      <M k="in" a={0.02} b={0.14} dx={-40}>
        <Figure who="father" ghost x={262} scale={0.8} mood="happy" armL={[142, 18]} armR={[14, 0]} />
        <Figure who="mother" ghost x={356} scale={0.8} mood="happy" armL={[14, 0]} armR={[142, 18]} />
      </M>
      <M k="in" a={0.05} b={0.17} dx={40}>
        <Figure who="me" ghost x={844} scale={0.8} mood="happy" armL={[142, 18]} armR={[14, 0]} />
        <Figure who="father" ghost x={938} scale={0.8} mood="happy" armL={[14, 0]} armR={[142, 18]} />
      </M>

      {/* 花のアーチ */}
      <M k="grow" a={0} b={0.14}>
        <path
          className={s.paper}
          d="M 450 660 V 340 A 150 150 0 0 1 750 340 V 660 H 730 V 340 A 130 130 0 0 0 470 340 V 660 Z"
        />
      </M>
      {GARLAND.map((flower, index) => (
        <M key={index} k="pop" a={0.1 + index * 0.018} b={0.17 + index * 0.018}>
          <Flower x={flower.x} y={flower.y} />
        </M>
      ))}
      {[420, 500, 580].map((y, index) => (
        <M key={y} k="pop" a={0.14 + index * 0.03} b={0.21 + index * 0.03}>
          <Flower x={460} y={y} r={9} />
          <Flower x={740} y={y + 40} r={9} />
        </M>
      ))}

      {/* 鐘。二人が手を取ると、鳴りはじめます。 */}
      <M k="drop" a={0.2} b={0.32} dy={-120}>
        <M k="hang" a={0.5} b={0.98} n={5} dr={13}>
          <Bell x={582} />
          <Bell x={618} />
          <path className={s.ink} d="M 600 228 l -20 -12 v 24 z M 600 228 l 20 -12 v 24 z" />
        </M>
      </M>

      <g transform="translate(600 348)">
        <M k="pop" a={0.56} b={0.72}>
          <M k="pulse" a={0.72} b={1} n={4} ds={1.12}>
            <Heart size={3.1} />
          </M>
        </M>
      </g>

      {/* 母：ベールと花束。 */}
      <M k="walk" a={0.1} b={0.48} dx={-200}>
        <Figure
          who="mother"
          wear="veil"
          x={540}
          dir={1}
          armL={[10, -100]}
          armR={[24, 0]}
          holdL={bouquet}
          fx={{
            ...steps([[0.1, 0.48, 6]], false),
            ...cheer(0.52),
            armR: fx("turn", 0.48, 0.56, { dr: 24 }),
          }}
        />
      </M>

      {/* 父：蝶ネクタイ。 */}
      <M k="walk" a={0.1} b={0.48} dx={200}>
        <Figure
          who="father"
          wear="bow"
          x={660}
          dir={-1}
          armL={[24, 0]}
          fx={{
            ...steps([[0.1, 0.48, 6]], false),
            ...cheer(0.52),
            armL: fx("turn", 0.48, 0.56, { dr: -24 }),
          }}
        />
      </M>

      {/* 紙ふぶき */}
      {CONFETTI.map((piece, index) => (
        <M
          key={index}
          k="in"
          a={0.52 + (index % 9) * 0.045}
          b={0.66 + (index % 9) * 0.045}
          dy={-(piece.y + 60)}
        >
          <g transform={`translate(${piece.x} ${piece.y}) rotate(${piece.turn})`}>
            {index % 3 === 0 ? (
              <Heart size={0.7} />
            ) : index % 3 === 1 ? (
              <rect className={s.ink} x={-5} y={-3} width={10} height={6} rx={1.5} />
            ) : (
              <circle className={cx(s.paper, s.thin)} r={5} />
            )}
          </g>
        </M>
      ))}
    </Scene>
  );
}
