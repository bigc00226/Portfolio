import { story } from "@/data/story";

import s from "./Scene.module.css";
import { AppWindow, Figure, M, Picture, Scene, Sparkle, cheer, cx, fx, span } from "./kit";

const { labels } = story;

const LAYER_WIDTHS = [84, 70, 90, 62, 78, 88];

/** 選択中の部品を囲む枠。四隅に、つまみが付きます。 */
function Selection({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return (
    <>
      <rect className={cx(s.line, s.hair)} x={x} y={y} width={w} height={h} />
      {[
        [x, y],
        [x + w, y],
        [x, y + h],
        [x + w, y + h],
      ].map(([cornerX, cornerY]) => (
        <rect
          key={`${cornerX}-${cornerY}`}
          className={cx(s.paper, s.hair)}
          x={cornerX - 4}
          y={cornerY - 4}
          width={8}
          height={8}
        />
      ))}
    </>
  );
}

/** 余白の寸法を示す、小さな札。 */
function Measure({ x, y, value }: { x: number; y: number; value: string }) {
  return (
    <>
      <rect className={s.ink} x={x - 16} y={y - 10} width={32} height={20} rx={5} />
      <text className={cx(s.text, s.code, s.onInk)} x={x} y={y + 0.5} fontSize={12}>
        {value}
      </text>
    </>
  );
}

/** 第6章：Figma でデザインを仕上げる。部品を置き、余白をととのえ、完成を喜ぶ。 */
export function Design() {
  return (
    <Scene>
      {/* 大きなモニター */}
      <M k="in" a={0} b={0.08} dy={30}>
        <rect className={s.paper} x={645} y={548} width={32} height={96} />
        <rect className={s.paper} x={585} y={640} width={152} height={20} rx={6} />
        <AppWindow x={336} y={150} w={650} h={400} title={labels.figma}>
          <path className={s.tone} d="M 105 35 H 648 V 386 a 12 12 0 0 1 -12 12 H 105 Z" />
          <path className={cx(s.line, s.thin)} d="M 104 34 V 400" />
          {LAYER_WIDTHS.map((width, index) => (
            <g key={index}>
              <rect className={s.ink} x={14} y={54 + index * 24} width={8} height={8} rx={2} />
              <path
                className={cx(s.line, s.thin, s.soft)}
                d={`M 32 ${58 + index * 24} H ${width}`}
              />
            </g>
          ))}
          <text className={cx(s.text, s.code, s.start, s.mute)} x={150} y={51} fontSize={11}>
            Home
          </text>
          <rect className={cx(s.paper, s.thin)} x={150} y={62} width={454} height={300} rx={4} />
        </AppWindow>
      </M>

      {/* 画面の部品を、ひとつずつ置いていきます。 */}
      <M k="in" a={0.08} b={0.15} dx={-120} dy={-10}>
        <circle className={s.ink} cx={512} cy={238} r={8} />
        <path className={cx(s.line, s.thin)} d="M 800 238 H 834 M 850 238 H 884 M 900 238 H 918" />
      </M>
      <M k="in" a={0.15} b={0.23} dx={-150} dy={30}>
        <rect className={s.ink} x={506} y={272} width={210} height={20} rx={5} />
        <rect className={s.ink} x={506} y={300} width={150} height={20} rx={5} />
      </M>
      {/* 本文は、あとから数 px だけ位置を直します。 */}
      <M k="move" a={0.42} b={0.48} dy={12}>
        <M k="in" a={0.24} b={0.32} dx={-150} dy={20}>
          <path
            className={cx(s.line, s.thin, s.soft)}
            d="M 506 346 H 716 M 506 362 H 696 M 506 378 H 640"
          />
        </M>
      </M>
      <M k="in" a={0.32} b={0.4} dx={-150}>
        <rect className={s.ink} x={506} y={402} width={118} height={36} rx={18} />
        <text className={cx(s.text, s.code, s.onInk)} x={565} y={420.5} fontSize={14}>
          {labels.start}
        </text>
      </M>
      <M k="in" a={0.4} b={0.5} dx={90} dy={-30}>
        <Picture x={748} y={270} w={170} h={168} />
      </M>
      <M k="in" a={0.5} b={0.6} dy={40}>
        <rect className={cx(s.paper, s.thin)} x={506} y={458} width={126} height={40} rx={6} />
        <rect className={cx(s.paper, s.thin)} x={648} y={458} width={126} height={40} rx={6} />
        <rect className={cx(s.paper, s.thin)} x={790} y={458} width={128} height={40} rx={6} />
      </M>

      {/* 置いているあいだだけ出る、選択の枠。 */}
      <M k="blink" a={0.14} b={0.25}>
        <Selection x={500} y={266} w={222} h={60} />
      </M>
      <M k="blink" a={0.24} b={0.34}>
        <Selection x={500} y={338} w={222} h={48} />
      </M>
      <M k="blink" a={0.32} b={0.42}>
        <Selection x={500} y={396} w={130} h={48} />
      </M>
      <M k="blink" a={0.4} b={0.52}>
        <Selection x={742} y={264} w={182} h={180} />
      </M>
      <M k="blink" a={0.5} b={0.62}>
        <Selection x={500} y={452} w={424} h={52} />
      </M>

      {/* 余白の寸法 */}
      <M k="pop" a={0.46} b={0.52}>
        <path className={cx(s.line, s.hair)} d="M 676 322 V 344 M 670 322 H 682 M 670 344 H 682" />
        <Measure x={704} y={333} value="24" />
      </M>
      <M k="pop" a={0.56} b={0.62}>
        <path className={cx(s.line, s.hair)} d="M 488 420 H 504 M 488 414 V 426 M 504 414 V 426" />
        <Measure x={496} y={388} value="20" />
      </M>

      {/* カーソル */}
      <M k="fade" a={0.06} b={0.09}>
        <g className={s.cursorDesign} style={span(0.08, 0.66)}>
          <path
            className={cx(s.paper, s.thin)}
            d="M 920 500 v 24 l 6 -6 l 6 13 l 5 -2 l -6 -13 h 9 Z"
          />
        </g>
      </M>

      {/* 完成 */}
      <M k="pop" a={0.7} b={0.78}>
        <g transform="translate(940 212) rotate(-12)">
          <circle className={s.ink} r={38} />
          <circle className={cx(s.whiteLine, s.hair)} r={31} />
          <text className={cx(s.text, s.onInk)} y={1} fontSize={22}>
            {labels.done}
          </text>
        </g>
      </M>
      <M k="pop" a={0.72} b={0.8}>
        <Sparkle x={352} y={118} size={1.5} />
      </M>
      <M k="pop" a={0.76} b={0.84}>
        <Sparkle x={1010} y={300} size={1.1} />
        <Sparkle x={300} y={420} size={0.8} />
      </M>
      <M k="pop" a={0.8} b={0.88}>
        <Sparkle x={976} y={598} size={1.3} />
        <Sparkle x={216} y={470} size={1.1} />
      </M>

      {/* 私。画面を指さして作業し、仕上がると両手を上げて跳ねます。 */}
      <M k="in" a={0.02} b={0.08} dx={-40}>
        <M k="hop" a={0.76} b={0.96} n={2} dy={-30}>
          <Figure
            who="me"
            kid
            x={262}
            dir={1}
            armL={[150, 15]}
            armR={[150, 15]}
            fx={{
              ...cheer(0.7),
              armL: fx("turn", 0.68, 0.74, { dr: -142 }),
              armR: fx("turn", 0.68, 0.74, { dr: 74 }),
              foreR: fx("wave", 0.1, 0.64, { dr: -16, n: 6 }),
            }}
          />
        </M>
      </M>
    </Scene>
  );
}
