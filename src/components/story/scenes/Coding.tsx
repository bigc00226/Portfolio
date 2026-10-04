import { story } from "@/data/story";

import s from "./Scene.module.css";
import {
  AppWindow,
  Draw,
  Figure,
  Heart,
  M,
  Picture,
  Scene,
  Sparkle,
  cheer,
  cx,
  fx,
  span,
} from "./kit";

const { labels } = story;

/** エディタに打ち込んでいくコード。[字下げ, 文字] */
const CODE: [indent: number, text: string][] = [
  [0, "<html>"],
  [1, "<header>…</header>"],
  [1, "<h1>Hello!</h1>"],
  [1, "<p>はじめての…</p>"],
  [1, '<img src="art.png">'],
  [1, `<button>${labels.start}</button>`],
  [1, "<section>…</section>"],
  [0, "</html>"],
];

/** n 行目を打ち始める位置。 */
const typed = (line: number) => 0.07 + line * 0.065;
/** n 行目の結果が、ブラウザに現れる位置。 */
const shown = (line: number) => typed(line) + 0.05;

/** 第7章：デザインを自分の手でコーディングする。打ち込むたび、画面が形になっていく。 */
export function Coding() {
  return (
    <Scene>
      {/* エディタ */}
      <M k="in" a={0} b={0.07} dx={-40}>
        <AppWindow x={214} y={140} w={366} h={330} title={labels.editor} dark>
          {CODE.map(([indent, text], index) => (
            <g key={index}>
              <text
                className={cx(s.text, s.code, s.end, s.onInkDim)}
                x={30}
                y={57 + index * 33}
                fontSize={13}
              >
                {index + 1}
              </text>
              <text
                className={cx(s.text, s.code, s.start, s.onInk)}
                x={46 + indent * 18}
                y={57 + index * 33}
                fontSize={15}
              >
                {text}
              </text>
            </g>
          ))}
        </AppWindow>
      </M>
      {/* 行を隠している覆い。右へ縮んで、一字ずつ見せていきます。 */}
      {CODE.map((_, index) => (
        <rect
          key={index}
          className={cx(s.ink, s.wipe)}
          x={254}
          y={183 + index * 33}
          width={320}
          height={28}
          style={span(typed(index), typed(index) + 0.06)}
        />
      ))}

      {/* ブラウザ */}
      <M k="in" a={0.02} b={0.09} dx={40}>
        <AppWindow x={620} y={140} w={366} h={330} title={labels.browser} />
      </M>
      <M k="in" a={shown(1)} b={shown(1) + 0.06} dy={14}>
        <circle className={s.ink} cx={648} cy={200} r={8} />
        <path className={cx(s.line, s.thin)} d="M 880 200 H 910 M 926 200 H 956" />
      </M>
      <M k="in" a={shown(2)} b={shown(2) + 0.06} dy={14}>
        <rect className={s.ink} x={640} y={224} width={156} height={17} rx={4} />
        <rect className={s.ink} x={640} y={247} width={108} height={17} rx={4} />
      </M>
      <M k="in" a={shown(3)} b={shown(3) + 0.06} dy={14}>
        <path
          className={cx(s.line, s.thin, s.soft)}
          d="M 640 286 H 796 M 640 300 H 780 M 640 314 H 736"
        />
      </M>
      <M k="in" a={shown(4)} b={shown(4) + 0.06} dy={14}>
        <Picture x={822} y={224} w={144} h={124} />
      </M>
      <M k="in" a={shown(5)} b={shown(5) + 0.06} dy={14}>
        <rect className={s.ink} x={640} y={332} width={96} height={30} rx={15} />
        <text className={cx(s.text, s.code, s.onInk)} x={688} y={347.5} fontSize={12}>
          {labels.start}
        </text>
      </M>
      <M k="in" a={shown(6)} b={shown(6) + 0.06} dy={14}>
        <rect className={cx(s.paper, s.thin)} x={640} y={384} width={100} height={62} rx={6} />
        <rect className={cx(s.paper, s.thin)} x={753} y={384} width={100} height={62} rx={6} />
        <rect className={cx(s.paper, s.thin)} x={866} y={384} width={100} height={62} rx={6} />
      </M>

      <Draw a={0.1} b={0.16} d="M 588 305 H 610 M 602 296 L 611 305 L 602 314" />

      {/* 画面に現れた、という驚きと喜び。 */}
      <M k="pop" a={0.62} b={0.7}>
        <Sparkle x={1006} y={150} size={1.7} />
      </M>
      <M k="pop" a={0.66} b={0.74}>
        <Sparkle x={1022} y={420} size={1.1} />
        <Sparkle x={196} y={196} size={1.1} />
      </M>
      <M k="pop" a={0.7} b={0.78}>
        <Sparkle x={182} y={452} size={1.4} />
        <Sparkle x={804} y={104} size={0.9} />
      </M>
      {/* 私。机のノートパソコンに向かい、仕上がると飛び上がります。 */}
      <M k="in" a={0} b={0.07} dy={30}>
        <M k="hop" a={0.7} b={0.96} n={3} dy={-30}>
          <Figure
            who="me"
            kid
            x={600}
            armL={[150, 12]}
            armR={[150, 12]}
            fx={{
              ...cheer(0.64),
              body: fx("bob", 0.07, 0.6, { n: 14 }),
              armL: fx("turn", 0.64, 0.7, { dr: -130 }),
              foreL: fx("turn", 0.64, 0.7, { dr: -82 }),
              armR: fx("turn", 0.64, 0.7, { dr: 130 }),
              foreR: fx("turn", 0.64, 0.7, { dr: 82 }),
            }}
          />
        </M>
        <rect className={s.paper} x={522} y={592} width={156} height={68} rx={4} />
        <rect className={s.paper} x={558} y={544} width={84} height={50} rx={7} />
        <Heart x={600} y={570} size={0.9} />
      </M>
    </Scene>
  );
}
