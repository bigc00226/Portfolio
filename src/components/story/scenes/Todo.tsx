import { story } from "@/data/story";

import s from "./Scene.module.css";
import { Draw, Figure, M, Scene, Sparkle, cheer, cx, fx, scatter, span } from "./kit";

const { labels } = story;
const { items } = labels.todo;

/** n 番目の予定にチェックが入る位置。 */
const checked = (index: number) => 0.36 + index * 0.1;
/** n 番目の予定の、行の中心の高さ。 */
const row = (index: number) => 256 + index * 66;

/** スマートフォンの両脇に舞う紙ふぶき。 */
const CONFETTI = [...scatter(6, 452, 96, 96, 150), ...scatter(6, 838, 96, 110, 150)];

/** 取り消し線の長さを、文字数からおおよそ決めます。 */
const strike = (label: string) => label.length * 20 + 6;

/** 第8章：自分でつくった TODO アプリ。朝から夜まで、予定をひとつずつ済ませていく。 */
export function Todo() {
  return (
    <Scene>
      {/* 空を渡る道すじ。朝から夜へ。 */}
      <M k="fade" a={0.02} b={0.1}>
        <path className={cx(s.line, s.thin, s.soft, s.dashed)} d="M 220 300 Q 360 76 500 300" />
        <text className={cx(s.text, s.mute)} x={220} y={346} fontSize={15}>
          {labels.todo.morning}
        </text>
        <text className={cx(s.text, s.mute)} x={500} y={346} fontSize={15}>
          {labels.todo.night}
        </text>
      </M>

      {/* 太陽は空を渡り、夜には月に替わります。 */}
      <M k="out" a={0.8} b={0.85}>
        <M k="fade" a={0.04} b={0.1}>
          <g className={s.sunArc} style={span(0.34, 0.8)}>
            <circle className={s.paper} cx={500} cy={300} r={20} />
            <path
              className={cx(s.line, s.thin)}
              d="M 500 268 V 258 M 500 332 V 342 M 468 300 H 458 M 532 300 H 542 M 477 277 L 470 270 M 523 277 L 530 270 M 477 323 L 470 330 M 523 323 L 530 330"
            />
          </g>
        </M>
      </M>
      <M k="pop" a={0.8} b={0.88}>
        <path className={s.ink} d="M 496 276 a 26 26 0 1 0 28 34 a 21 21 0 0 1 -28 -34 Z" />
        <Sparkle x={538} y={268} size={0.6} />
        <Sparkle x={462} y={262} size={0.5} />
      </M>

      {/* スマートフォンの中の、TODO アプリ */}
      <M k="in" a={0} b={0.1} dy={40}>
        <ellipse className={s.tone} cx={694} cy={664} rx={140} ry={9} />
        <rect className={s.paper} x={562} y={128} width={264} height={476} rx={34} />
        <rect className={s.ink} x={664} y={142} width={60} height={12} rx={6} />
        <text className={cx(s.text, s.sign, s.start)} x={590} y={192} fontSize={26}>
          {labels.todo.title}
        </text>
        <path className={cx(s.line, s.thin)} d="M 562 218 H 826" />
        {items.map((item, index) => (
          <g key={item.label}>
            <rect
              className={cx(s.paper, s.thin)}
              x={588}
              y={row(index) - 15}
              width={30}
              height={30}
              rx={8}
            />
            <text className={cx(s.text, s.start)} x={632} y={row(index)} fontSize={20}>
              {item.label}
            </text>
            <text className={cx(s.text, s.code, s.end, s.mute)} x={802} y={row(index)} fontSize={12}>
              {item.time}
            </text>
            {index < items.length - 1 ? (
              <path className={cx(s.line, s.hair, s.soft)} d={`M 588 ${row(index) + 33} H 802`} />
            ) : null}
          </g>
        ))}
      </M>

      {/* 済んだ数。チェックが入るたびに、ひとつ増えます。 */}
      {items.map((_, index) => (
        <M
          key={index}
          k={index === 0 ? "out" : "blink"}
          a={index === 0 ? checked(0) : checked(index - 1)}
          b={index === 0 ? checked(0) + 0.02 : checked(index) + 0.01}
        >
          <text className={cx(s.text, s.code, s.end)} x={802} y={192} fontSize={18}>
            {`${index}/${items.length}`}
          </text>
        </M>
      ))}
      <M k="fade" a={checked(items.length - 1)} b={checked(items.length - 1) + 0.02}>
        <text className={cx(s.text, s.code, s.end)} x={802} y={192} fontSize={18}>
          {`${items.length}/${items.length}`}
        </text>
      </M>

      {/* チェックと取り消し線 */}
      {items.map((item, index) => (
        <g key={item.label}>
          <M k="pop" a={checked(index)} b={checked(index) + 0.05}>
            <rect className={s.ink} x={588} y={row(index) - 15} width={30} height={30} rx={8} />
            <path
              className={s.whiteLine}
              d={`M 595 ${row(index)} L 601 ${row(index) + 7} L 612 ${row(index) - 7}`}
            />
          </M>
          <Draw
            a={checked(index) + 0.02}
            b={checked(index) + 0.07}
            className={s.thin}
            d={`M 629 ${row(index)} H ${629 + strike(item.label)}`}
          />
        </g>
      ))}

      {/* ぜんぶ済んだ。 */}
      {CONFETTI.map((piece, index) => (
        <M key={index} k="pop" a={0.84 + (index % 5) * 0.02} b={0.92 + (index % 5) * 0.02}>
          <g transform={`translate(${piece.x} ${piece.y}) rotate(${piece.turn})`}>
            {index % 2 === 0 ? (
              <rect className={s.ink} x={-6} y={-3} width={12} height={6} rx={1.5} />
            ) : (
              <circle className={cx(s.paper, s.thin)} r={5} />
            )}
          </g>
        </M>
      ))}
      <M k="pop" a={0.86} b={0.94}>
        <Sparkle x={868} y={320} size={1.4} />
        <Sparkle x={874} y={520} size={1} />
      </M>

      {/* 私。父のノートを片手に、予定をひとつずつ押していきます。 */}
      <M k="in" a={0.02} b={0.1} dx={-40}>
        <M k="hop" a={0.86} b={0.98} n={2} dy={-30}>
          <Figure
            who="me"
            kid
            x={396}
            scale={1.12}
            dir={1}
            armL={[150, 15]}
            armR={[150, 15]}
            holdL={
              <g transform="rotate(180)">
                <rect className={s.paper} x={-20} y={-6} width={40} height={50} rx={5} />
                <path className={cx(s.line, s.thin)} d="M -12 -6 V 44" />
                <text className={cx(s.text, s.code)} x={5} y={20} fontSize={13}>
                  {"</>"}
                </text>
              </g>
            }
            fx={{
              ...cheer(0.8),
              armL: fx("turn", 0.8, 0.86, { dr: -136 }),
              armR: fx("turn", 0.8, 0.86, { dr: 72 }),
              foreR: fx("wave", 0.34, 0.84, { dr: -22, n: 5 }),
            }}
          />
        </M>
      </M>
    </Scene>
  );
}
