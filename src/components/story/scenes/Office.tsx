import { story } from "@/data/story";

import s from "./Scene.module.css";
import { Cloud, Figure, M, Scene, Tag, Tree, cx, steps } from "./kit";

const { labels } = story;

const WINDOW_COLUMNS = [462, 536, 610, 684];
/* 下の階から順に灯るよう、下から数えて並べています。 */
const WINDOW_ROWS = [486, 418, 350, 282];

/** 第1章：ビルが建ち、母と父がそれぞれ入社してくる。 */
export function Office() {
  return (
    <Scene>
      <M k="in" a={0.04} b={0.3} dx={-90}>
        <Cloud x={250} y={150} size={1.2} />
        <Cloud x={-170} y={230} size={1.5} />
      </M>
      <M k="in" a={0.08} b={0.34} dx={90}>
        <Cloud x={950} y={118} />
        <Cloud x={1400} y={190} size={1.6} />
      </M>

      {/* 別棟 */}
      <M k="grow" a={0.08} b={0.2}>
        <rect className={s.paper} x={770} y={436} width={116} height={224} />
        {[462, 524, 586].map((y) => (
          <path key={y} className={cx(s.line, s.thin)} d={`M 792 ${y} h 28 M 836 ${y} h 28`} />
        ))}
      </M>

      {/* 本館 */}
      <M k="grow" a={0} b={0.14}>
        <rect className={s.paper} x={430} y={254} width={340} height={406} />
        <rect className={s.ink} x={416} y={238} width={368} height={18} rx={4} />
      </M>

      {WINDOW_ROWS.map((y, row) => (
        <M key={y} k="in" a={0.1 + row * 0.03} b={0.17 + row * 0.03} dy={14}>
          {WINDOW_COLUMNS.map((x) => (
            <g key={x}>
              <rect className={cx(s.paper, s.thin)} x={x} y={y} width={54} height={46} rx={4} />
              <path className={cx(s.line, s.hair)} d={`M ${x + 27} ${y} v 46`} />
            </g>
          ))}
        </M>
      ))}

      {/* 入口。最後に、扉が左右へ開きます。 */}
      <M k="fade" a={0.16} b={0.22}>
        <rect className={s.ink} x={540} y={548} width={120} height={14} rx={4} />
        <rect className={s.ink} x={552} y={562} width={96} height={98} />
        <M k="move" a={0.92} b={1} dx={38}>
          <rect className={cx(s.paper, s.thin)} x={516} y={566} width={42} height={94} />
        </M>
        <M k="move" a={0.92} b={1} dx={-38}>
          <rect className={cx(s.paper, s.thin)} x={642} y={566} width={42} height={94} />
        </M>
      </M>

      {/* 看板 */}
      <M k="grow" a={0.18} b={0.23}>
        <path className={s.line} d="M 520 238 V 212 M 680 238 V 212" />
      </M>
      <M k="drop" a={0.2} b={0.32} dy={-170}>
        <rect className={s.paper} x={462} y={146} width={276} height={68} rx={8} />
        <text className={cx(s.text, s.sign)} x={603} y={181} fontSize={38}>
          {labels.company}
        </text>
      </M>

      <M k="popUp" a={0.2} b={0.28}>
        <Tree x={262} />
      </M>
      <M k="popUp" a={0.23} b={0.31}>
        <Tree x={958} size={0.86} />
      </M>
      <M k="popUp" a={0.26} b={0.33}>
        <Tree x={1110} size={1.1} />
        <Tree x={104} size={0.8} />
      </M>

      {/* 母：デザイナー。作品を入れた鞄を提げて、左から。 */}
      <M k="fade" a={0.34} b={0.38}>
        <M k="walk" a={0.34} b={0.6} dx={-300}>
          <Figure
            who="mother"
            x={478}
            dir={1}
            armR={[6, 0]}
            fx={steps([[0.34, 0.6, 7]])}
            holdR={
              <g transform="translate(0 6)">
                <path className={cx(s.line, s.thin)} d="M -10 2 V -6 H 10 V 2" />
                <rect className={s.paper} x={-27} y={2} width={54} height={40} rx={5} />
                <path className={cx(s.line, s.thin)} d="M -12 30 L 0 12 L 12 30 M -6 22 H 6" />
              </g>
            }
          />
        </M>
      </M>
      <M k="pop" a={0.58} b={0.65}>
        <Tag x={478} y={348} w={134} label={labels.designer} />
      </M>

      {/* 父：システムエンジニア。ノートパソコンの鞄を提げて、右から。 */}
      <M k="fade" a={0.68} b={0.72}>
        <M k="walk" a={0.68} b={0.9} dx={300}>
          <Figure
            who="father"
            x={722}
            dir={-1}
            armL={[6, 0]}
            fx={steps([[0.68, 0.9, 7]])}
            holdL={
              <g transform="translate(0 6)">
                <path className={cx(s.line, s.thin)} d="M -10 2 V -6 H 10 V 2" />
                <rect className={s.paper} x={-29} y={2} width={58} height={38} rx={5} />
                <text className={cx(s.text, s.code)} y={22} fontSize={17}>
                  {"</>"}
                </text>
              </g>
            }
          />
        </M>
      </M>
      <M k="pop" a={0.88} b={0.95}>
        <Tag x={722} y={364} w={214} label={labels.engineer} />
      </M>
    </Scene>
  );
}
