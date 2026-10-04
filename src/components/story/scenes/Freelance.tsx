import { story } from "@/data/story";

import s from "./Scene.module.css";
import {
  Cloud,
  Draw,
  Figure,
  Heart,
  M,
  Plane,
  Scene,
  Sparkle,
  cheer,
  cx,
  fx,
  starPath,
  steps,
} from "./kit";

const { labels } = story;

const WINDOW_COLUMNS = [246, 299, 352];
const WINDOW_ROWS = [432, 484, 536];
/** 窓に明かりがともっていく順番。 */
const LIT = [4, 0, 8, 2, 6, 1, 5, 3, 7];

/** クラウドソーシングの画面。ご依頼が並び、評価の星がたまっていきます。 */
function Platform({ x, name, at }: { x: number; name: string; at: number }) {
  return (
    <>
      <M k="pop" a={at} b={at + 0.08}>
        <rect className={s.paper} x={x} y={176} width={204} height={150} rx={14} />
        <text className={cx(s.text, s.sign)} x={x + 102} y={207} fontSize={21}>
          {name}
        </text>
        <path className={cx(s.line, s.thin)} d={`M ${x} 232 H ${x + 204}`} />
        {[254, 280].map((y) => (
          <g key={y}>
            <rect className={s.ink} x={x + 18} y={y - 10} width={58} height={20} rx={10} />
            <text className={cx(s.text, s.onInk)} x={x + 47} y={y + 0.5} fontSize={12}>
              {labels.order}
            </text>
            <path className={cx(s.line, s.thin, s.soft)} d={`M ${x + 88} ${y} H ${x + 184}`} />
          </g>
        ))}
      </M>
      {[0, 1, 2, 3, 4].map((star) => (
        <M key={star} k="pop" a={at + 0.1 + star * 0.018} b={at + 0.16 + star * 0.018}>
          <path className={s.ink} d={starPath(x + 62 + star * 20, 306, 8.5)} />
        </M>
      ))}
    </>
  );
}

function Envelope({ x, y }: { x: number; y: number }) {
  return (
    <>
      <rect className={cx(s.paper, s.thin)} x={x - 21} y={y - 14} width={42} height={28} rx={4} />
      <path className={cx(s.line, s.thin)} d={`M ${x - 21} ${y - 12} L ${x} ${y + 3} L ${x + 21} ${y - 12}`} />
    </>
  );
}

/** 第11章：帰国して株式会社に勤め、やがてフリーランスとして自宅の机へ。 */
export function Freelance() {
  return (
    <Scene>
      <Cloud x={520} y={110} size={0.9} />
      <Cloud x={1090} y={150} size={1.3} />
      <Cloud x={-90} y={190} size={1.4} />

      {/* 帰りの飛行機 */}
      <M k="out" a={0.2} b={0.27}>
        <M k="walk" a={0} b={0.27} dx={900}>
          <g transform="translate(150 110) scale(-0.9 0.9)">
            <Plane />
          </g>
        </M>
      </M>

      {/* 株式会社 */}
      <rect className={s.paper} x={222} y={358} width={190} height={302} />
      <rect className={s.ink} x={210} y={344} width={214} height={16} rx={4} />
      <rect className={s.paper} x={246} y={374} width={142} height={40} rx={6} />
      <text className={cx(s.text)} x={317} y={394.5} fontSize={22}>
        {labels.corporation}
      </text>
      {WINDOW_ROWS.flatMap((y) =>
        WINDOW_COLUMNS.map((x) => (
          <rect key={`${x}-${y}`} className={cx(s.paper, s.thin)} x={x} y={y} width={36} height={34} rx={3} />
        )),
      )}
      {/* 働くうちに、窓の明かりがひとつずつ増えていきます。 */}
      {LIT.map((cell, order) => {
        const x = WINDOW_COLUMNS[cell % 3];
        const y = WINDOW_ROWS[Math.floor(cell / 3)];
        return (
          <M key={cell} k="fade" a={0.24 + order * 0.026} b={0.27 + order * 0.026}>
            <rect className={cx(s.toneDark, s.line, s.thin)} x={x} y={y} width={36} height={34} rx={3} />
          </M>
        );
      })}
      <rect className={s.ink} x={296} y={592} width={42} height={68} />
      <M k="pop" a={0.3} b={0.36}>
        <Sparkle x={234} y={316} size={0.9} />
      </M>
      <M k="pop" a={0.36} b={0.42}>
        <Sparkle x={318} y={300} size={1.3} />
      </M>
      <M k="pop" a={0.42} b={0.48}>
        <Sparkle x={398} y={318} size={0.9} />
      </M>

      {/* クラウドワークスとランサーズ */}
      <Platform x={556} name={labels.platforms[0]} at={0.72} />
      <Platform x={784} name={labels.platforms[1]} at={0.77} />
      <Draw a={0.8} b={0.87} className={cx(s.thin, s.soft)} d="M 658 326 C 660 404 716 470 770 522" />
      <Draw a={0.84} b={0.91} className={cx(s.thin, s.soft)} d="M 886 326 C 884 404 858 470 812 522" />

      {/* 私。会社へ向かい、しばらく勤めたあと、自宅の机へ移ります。 */}
      <M k="away" a={0.21} b={0.5}>
        <M k="walk" a={0.5} b={0.7} dx={-473}>
          <M k="walk" a={0.04} b={0.21} dx={720}>
            <Figure
              who="me"
              x={790}
              armL={[14, -70]}
              armR={[14, -70]}
              fx={{
                ...steps([
                  [0.04, 0.21, 9],
                  [0.5, 0.7, 6],
                ]),
                ...cheer(0.9),
                foreL: fx("turn", 0.7, 0.74, { dr: 70 }),
                foreR: fx("turn", 0.7, 0.74, { dr: -70 }),
              }}
            />
          </M>
        </M>
      </M>

      {/* 自宅の机。会社を離れるころに、用意されます。 */}
      <M k="in" a={0.46} b={0.54} dy={26}>
        <rect className={s.paper} x={700} y={574} width={180} height={86} rx={4} />
        <rect className={s.paper} x={752} y={528} width={76} height={48} rx={7} />
        <Heart x={790} y={553} size={0.9} />
        <path
          className={cx(s.paper, s.thin)}
          d="M 712 554 h 20 v 20 h -20 Z M 732 559 h 7 v 9 h -7"
        />
        <path className={s.paper} d="M 914 624 H 950 L 944 660 H 920 Z" />
        <path
          className={s.line}
          d="M 932 624 V 588 M 932 606 C 916 604 908 590 910 574 C 924 578 932 590 932 606 M 932 596 C 946 592 956 578 954 562 C 940 566 932 580 932 596"
        />
      </M>

      {/* 届いたご依頼が、机に積まれていきます。 */}
      <M k="in" a={0.82} b={0.9} dx={-194} dy={-250}>
        <Envelope x={852} y={560} />
      </M>
      <M k="in" a={0.86} b={0.94} dx={34} dy={-242}>
        <Envelope x={848} y={552} />
      </M>
      <M k="in" a={0.9} b={0.98} dx={-194} dy={-234}>
        <Envelope x={855} y={544} />
        <Heart x={855} y={546} size={0.5} />
      </M>
    </Scene>
  );
}
